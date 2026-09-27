/**
 * ===================================================================================
 * 🎵 ملف إدارة قائمة ومكتبة الموسيقى (Scalable Cloudflare R2 + Firestore Audio System)
 * ===================================================================================
 * - Pure Metadata in Firestore (Zero binary storage in database)
 * - Cloudflare R2 Storage (audio/previews/ and audio/full/)
 * - Dual Audio Package: Preview Audio (15-20s for fast browsing) + Full Audio
 * - In-Memory & Session Caching (Minimizes Firestore Reads)
 * - Pagination & Category Filtering
 * - Full Backward Compatibility for existing invitations
 */

import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  DocumentSnapshot,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { uploadAssetToR2, deleteAssetFromR2 } from '../lib/r2Storage';
import jsonMusicTracks from './musicList.json';
import { MusicTrack, SongDocument } from '../types';

export type { MusicTrack, SongDocument };

// In-memory cache for cloud tracks with TTL
let cachedCloudTracks: MusicTrack[] = [];
let lastCacheTimestamp = 0;
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL to save Firestore reads

/**
 * Uploads both a Preview clip and the Full Audio to Cloudflare R2,
 * returning structured R2 URLs without saving raw audio binaries in Firestore.
 */
export async function uploadSongPackageToR2(
  fullBlob: Blob,
  previewBlob: Blob,
  title: string
): Promise<{ previewUrl: string; audioUrl: string }> {
  const cleanTitle = title
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
    .substring(0, 40);

  // 1. Upload Full Audio to audio/full/
  const fullResult = await uploadAssetToR2(
    fullBlob,
    'audio/full',
    `${cleanTitle}_full.mp3`
  );

  // 2. Upload Preview Audio to audio/previews/
  const previewResult = await uploadAssetToR2(
    previewBlob,
    'audio/previews',
    `${cleanTitle}_preview.mp3`
  );

  return {
    audioUrl: fullResult.url,
    previewUrl: previewResult.url,
  };
}

/**
 * Legacy compatibility wrapper: uploads single audio blob to R2
 */
export async function uploadAudioFileToCloudStorage(blob: Blob, label: string): Promise<string> {
  const cleanName = (label || 'audio_track')
    .replace(/[^a-zA-Z0-9\u0600-\u06FF_-]/g, '_')
    .substring(0, 50);
  const result = await uploadAssetToR2(blob, 'audio/full', `${cleanName}.mp3`);
  return result.url;
}

// Vite Dynamic Import for local bundled fallback assets
const uploadedAudioModules = import.meta.glob<{ default: string }>(
  '/src/assets/music/*.{mp3,wav,m4a,ogg,aac}',
  { eager: true }
);

const localUploadedTracks: MusicTrack[] = Object.entries(uploadedAudioModules).map(([path, module]) => {
  const fileNameWithExt = path.split('/').pop() || '';
  const fileName = fileNameWithExt.replace(/\.(mp3|wav|m4a|ogg|aac)$/i, '');

  let category = 'royal';
  let label = fileName;

  if (fileName.includes('-')) {
    const parts = fileName.split('-');
    const catPart = parts[0].trim();
    const labelPart = parts.slice(1).join('-').trim();
    if (catPart) category = catPart;
    if (labelPart) label = labelPart;
  }

  const url = typeof module === 'string' ? module : module.default;

  return {
    id: 'local-' + fileName,
    title: label,
    category,
    label,
    url,
    audioUrl: url,
    previewUrl: url,
    isActive: true,
  };
});

export const MANUAL_MUSIC_TRACKS: MusicTrack[] = [];
const LOCAL_STORAGE_KEY = 'frida_custom_uploaded_music';

export function getStoredCustomTracks(): MusicTrack[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function deleteCustomUploadedTrack(trackIdOrUrl: string): void {
  try {
    const existing = getStoredCustomTracks();
    const filtered = existing.filter((t) => t.id !== trackIdOrUrl && t.url !== trackIdOrUrl);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Error deleting track from local storage:', err);
  }
}

export function saveCustomUploadedTrack(track: MusicTrack): void {
  try {
    const existing = getStoredCustomTracks();
    const filtered = existing.filter((t) => t.url !== track.url && t.label !== track.label && t.id !== track.id);
    const updated = [{ ...track, id: track.id || 'trk-' + Date.now() }, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 20)));
  } catch (err) {
    console.warn('Error storing custom track locally:', err);
  }
}

/**
 * Saves or updates song metadata in Firestore collection `music_library`
 * Ensures clean metadata structure and updates in-memory cache.
 */
export async function saveTrackToCloudLibrary(track: MusicTrack | SongDocument): Promise<void> {
  const anyTrack = track as any;
  const trackId = track.id || `song_${Date.now()}`;
  const trackTitle =
    anyTrack.title ||
    (typeof anyTrack.name === 'string' ? anyTrack.name : anyTrack.name?.ar) ||
    anyTrack.label ||
    'معزوفة ملكية';

  const audioUrl = anyTrack.audioUrl || anyTrack.url;
  const previewUrl = anyTrack.previewUrl || audioUrl;

  const docData: SongDocument = {
    id: trackId,
    title: trackTitle,
    artist: track.artist || 'FRIDA Royal Orchestra',
    duration: track.duration || 60,
    previewUrl,
    audioUrl,
    coverUrl: track.coverUrl || '',
    category: track.category || 'royal',
    isActive: track.isActive ?? true,
    isDefault: track.isDefault ?? false,
    createdAt: track.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Construct backward-compatible MusicTrack object
  const unifiedTrack: MusicTrack = {
    ...docData,
    name: { ar: docData.title, en: docData.title },
    label: docData.title,
    url: docData.audioUrl,
    isCloud: true,
  };

  cachedCloudTracks = [unifiedTrack, ...cachedCloudTracks.filter((t) => t.id !== trackId)];
  saveCustomUploadedTrack(unifiedTrack);

  try {
    await setDoc(doc(db, 'music_library', trackId), docData, { merge: true });
  } catch (err) {
    console.warn('Failed to save song metadata to Firestore:', err);
  }
}

/**
 * Deletes a song from Firestore and cleans up its R2 asset files if present.
 */
export async function deleteTrackFromCloudLibrary(trackIdOrUrl: string): Promise<boolean> {
  try {
    const existing = cachedCloudTracks.find((t) => t.id === trackIdOrUrl || t.url === trackIdOrUrl || t.audioUrl === trackIdOrUrl);
    cachedCloudTracks = cachedCloudTracks.filter((t) => t.id !== trackIdOrUrl && t.url !== trackIdOrUrl && t.audioUrl !== trackIdOrUrl);
    deleteCustomUploadedTrack(trackIdOrUrl);

    // Clean up R2 assets
    if (existing) {
      if (existing.previewUrl?.startsWith('/r2/')) {
        deleteAssetFromR2(existing.previewUrl).catch(() => {});
      }
      if (existing.audioUrl?.startsWith('/r2/')) {
        deleteAssetFromR2(existing.audioUrl).catch(() => {});
      }
    }

    if (existing?.id || trackIdOrUrl) {
      const docId = existing?.id || trackIdOrUrl;
      await deleteDoc(doc(db, 'music_library', docId));
    }
    return true;
  } catch (err) {
    console.warn('Failed to delete track from cloud library:', err);
    deleteCustomUploadedTrack(trackIdOrUrl);
    return false;
  }
}

/**
 * Toggles a song's active state in Firestore
 */
export async function toggleSongActiveStatus(songId: string, isActive: boolean): Promise<void> {
  try {
    const existing = cachedCloudTracks.find((t) => t.id === songId);
    if (existing) {
      existing.isActive = isActive;
    }
    await setDoc(doc(db, 'music_library', songId), { isActive, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    console.warn('Failed to toggle song active status:', err);
  }
}

/**
 * Subscribes to real-time updates of the music library catalog with cache updating.
 */
export function subscribeCloudMusicLibrary(callback: (tracks: MusicTrack[]) => void): () => void {
  try {
    const colRef = collection(db, 'music_library');
    return onSnapshot(
      colRef,
      (snap) => {
        const list: MusicTrack[] = [];
        snap.forEach((d) => {
          const data = d.data() as SongDocument;
          list.push({
            id: data.id || d.id,
            title: data.title,
            name: { ar: data.title, en: data.title },
            label: data.title,
            artist: data.artist,
            duration: data.duration,
            url: data.audioUrl || (data as any).url,
            audioUrl: data.audioUrl || (data as any).url,
            previewUrl: data.previewUrl || data.audioUrl || (data as any).url,
            coverUrl: data.coverUrl,
            category: data.category || 'royal',
            isActive: data.isActive ?? true,
            isDefault: data.isDefault ?? false,
            isCloud: true,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        });
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        cachedCloudTracks = list;
        lastCacheTimestamp = Date.now();
        callback(list);
      },
      (err) => {
        console.warn('Error subscribing to music library:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to set up music library listener:', err);
    return () => {};
  }
}

/**
 * Fetches the Cloud Music Library with in-memory caching to save Firestore reads.
 */
export async function getCloudMusicLibrary(forceRefresh = false): Promise<MusicTrack[]> {
  const now = Date.now();
  if (!forceRefresh && cachedCloudTracks.length > 0 && now - lastCacheTimestamp < CACHE_TTL_MS) {
    return cachedCloudTracks;
  }

  try {
    const colRef = collection(db, 'music_library');
    const snap = await getDocs(colRef);
    const list: MusicTrack[] = [];
    snap.forEach((d) => {
      const data = d.data() as SongDocument;
      list.push({
        id: data.id || d.id,
        title: data.title,
        name: { ar: data.title, en: data.title },
        label: data.title,
        artist: data.artist,
        duration: data.duration,
        url: data.audioUrl || (data as any).url,
        audioUrl: data.audioUrl || (data as any).url,
        previewUrl: data.previewUrl || data.audioUrl || (data as any).url,
        coverUrl: data.coverUrl,
        category: data.category || 'royal',
        isActive: data.isActive ?? true,
        isDefault: data.isDefault ?? false,
        isCloud: true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      });
    });
    list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    cachedCloudTracks = list;
    lastCacheTimestamp = now;
    return list;
  } catch (err) {
    console.warn('Failed to fetch cloud music library:', err);
    return cachedCloudTracks;
  }
}

/**
 * Returns all available tracks across Cloud R2, local presets, and cached catalog.
 */
export function getAllAvailableTracks(hiddenIds: string[] = []): MusicTrack[] {
  const localCustom = getStoredCustomTracks();
  const jsonTracks: MusicTrack[] = Array.isArray(jsonMusicTracks)
    ? (jsonMusicTracks as any[]).map((t) => ({
        id: t.id,
        title: t.name,
        name: { ar: t.name, en: t.name },
        label: t.name,
        category: t.category,
        url: t.url,
        audioUrl: t.url,
        previewUrl: t.url,
        isActive: true,
      }))
    : [];

  const hiddenSet = new Set(hiddenIds);
  const seenUrls = new Set<string>();
  const combined: MusicTrack[] = [];

  for (const trk of [...cachedCloudTracks, ...localCustom, ...jsonTracks, ...localUploadedTracks, ...MANUAL_MUSIC_TRACKS]) {
    const mainUrl = trk.audioUrl || trk.url;
    if ((trk.id && hiddenSet.has(trk.id)) || hiddenSet.has(mainUrl) || hiddenSet.has(trk.url)) {
      continue;
    }
    if (!seenUrls.has(mainUrl)) {
      seenUrls.add(mainUrl);
      combined.push({
        ...trk,
        url: mainUrl,
        audioUrl: trk.audioUrl || mainUrl,
        previewUrl: trk.previewUrl || mainUrl,
      });
    }
  }

  return combined;
}

export const PRESET_MUSIC_TRACKS: MusicTrack[] = getAllAvailableTracks();
