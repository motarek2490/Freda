import React, { useState, useRef, useMemo } from 'react';
import {
  Music,
  Play,
  Pause,
  Upload,
  Loader2,
  Star,
  Trash2,
  CheckCircle,
  Scissors,
  AlertTriangle,
  X,
  Search,
  Filter,
  Check,
  Power,
  Volume2,
  Radio,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { AdminSettings, Language, MusicTrack } from '../../types';
import { resolveAudioTrackUrl } from '../../lib/audioStorage';
import {
  uploadAudioFileToCloudStorage,
  toggleSongActiveStatus,
} from '../../data/presetMusic';
import { AudioTrimmerModal } from '../AudioTrimmerModal';

interface AdminMusicTabProps {
  currentLang: Language;
  adminTracks: MusicTrack[];
  adminSettings: AdminSettings | null;
  onSaveTrack: (track: MusicTrack) => Promise<void>;
  onDeleteTrack: (trackId: string, trackUrl?: string) => Promise<void>;
  onSetDefaultDemoTrack: (url: string, name: string) => Promise<void>;
  onSetWebsiteBgTrack?: (url: string, name: string) => Promise<void>;
}

interface UploadingFileItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  loadedBytes: number;
  totalBytes: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export const AdminMusicTab: React.FC<AdminMusicTabProps> = ({
  currentLang,
  adminTracks,
  adminSettings,
  onSaveTrack,
  onDeleteTrack,
  onSetDefaultDemoTrack,
  onSetWebsiteBgTrack,
}) => {
  const isRtl = currentLang === 'ar';

  const [playingTrackUrl, setPlayingTrackUrl] = useState<string | null>(null);
  const [loadingTrackUrl, setLoadingTrackUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Multi-file Bulk Upload Queue & Progress State
  const [uploadQueue, setUploadQueue] = useState<UploadingFileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('royal');

  // Search & Filter & Pagination State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pageSize, setPageSize] = useState(24);

  // Audio Trimmer State
  const [trimmerAudioBlob, setTrimmerAudioBlob] = useState<Blob | null>(null);
  const [trimmerTrackName, setTrimmerTrackName] = useState<string>('');

  // Delete Confirmation State
  const [trackToDelete, setTrackToDelete] = useState<MusicTrack | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const trimmerFileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle Play/Pause with HTML5 streaming (no full memory download)
  const handlePlayPause = async (rawUrl: string) => {
    if (!rawUrl) return;

    if (playingTrackUrl === rawUrl && audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackUrl(null);
      return;
    }

    try {
      setLoadingTrackUrl(rawUrl);
      const playable = await resolveAudioTrackUrl(rawUrl);
      if (!playable) {
        setLoadingTrackUrl(null);
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.preload = 'none';
        audioRef.current.onended = () => setPlayingTrackUrl(null);
        audioRef.current.onerror = () => {
          setPlayingTrackUrl(null);
          setLoadingTrackUrl(null);
        };
      }

      audioRef.current.src = playable;
      await audioRef.current.play();
      setPlayingTrackUrl(rawUrl);
    } catch (err) {
      console.warn('Audio playback error:', err);
      setPlayingTrackUrl(null);
    } finally {
      setLoadingTrackUrl(null);
    }
  };

  const processFilesForUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('audio/') || f.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i));
    if (fileArray.length === 0) return;

    const initialQueue: UploadingFileItem[] = fileArray.map((file, idx) => ({
      id: `up_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      name: file.name.replace(/\.[^/.]+$/, '').trim(),
      size: file.size,
      progress: 0,
      loadedBytes: 0,
      totalBytes: file.size,
      status: 'pending',
    }));

    setUploadQueue(initialQueue);
    setIsUploading(true);
    setUploadFeedback(null);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const item = initialQueue[i];

      // Set current file status to uploading
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading' } : q))
      );

      try {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').trim();
        const trackId = `song_${Date.now()}_${i}`;

        const cdnUrl = await uploadAudioFileToCloudStorage(
          file,
          cleanName,
          trackId,
          'library',
          undefined,
          (percent, loaded, total) => {
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.id === item.id
                  ? {
                      ...q,
                      progress: percent,
                      loadedBytes: loaded,
                      totalBytes: total,
                    }
                  : q
              )
            );
          }
        );

        if (cdnUrl) {
          const newTrack: MusicTrack = {
            id: trackId,
            title: cleanName,
            name: { ar: cleanName, en: cleanName },
            label: cleanName,
            artist: 'FRIDA Royal Orchestra',
            url: cdnUrl,
            audioUrl: cdnUrl,
            previewUrl: cdnUrl,
            category: uploadCategory || 'royal',
            isActive: true,
            isDefault: false,
            isCloud: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await onSaveTrack(newTrack);
          successCount++;

          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'completed', progress: 100 } : q
            )
          );
        } else {
          failCount++;
          setUploadQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: 'error', error: 'Upload failed' } : q
            )
          );
        }
      } catch (err: any) {
        failCount++;
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', error: err.message || 'Upload error' }
              : q
          )
        );
      }
    }

    setIsUploading(false);
    if (directFileInputRef.current) directFileInputRef.current.value = '';

    if (successCount > 0) {
      setUploadFeedback(
        isRtl
          ? `🎉 تم رفع وحفظ ${successCount} ${successCount === 1 ? 'معزوفة' : 'معزوفات'} بنجاح في التخزين السحابي!`
          : `🎉 Successfully uploaded ${successCount} track(s) to cloud storage!`
      );
    } else if (failCount > 0) {
      setUploadFeedback(
        isRtl ? 'تعذر رفع الملفات، يرجى إعادة المحاولة.' : 'Upload failed, please retry.'
      );
    }
  };

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFilesForUpload(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFilesForUpload(e.dataTransfer.files);
    }
  };

  const handleFileForTrimmer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cleanName = file.name.replace(/\.[^/.]+$/, '').trim();
    setTrimmerTrackName(cleanName);
    setTrimmerAudioBlob(file);
    if (trimmerFileInputRef.current) trimmerFileInputRef.current.value = '';
  };

  const handleConfirmDelete = async () => {
    if (!trackToDelete) return;

    const toDelete = trackToDelete;
    // Immediately close modal and show instant confirmation (0ms delay)
    setTrackToDelete(null);
    setIsDeleting(false);
    setUploadFeedback(
      isRtl
        ? `تم حذف معزوفة "${getTrackDisplayName(toDelete, 'ar')}" بنجاح 🗑️`
        : 'Track removed successfully!'
    );

    try {
      await onDeleteTrack(toDelete.id || '', toDelete.url || toDelete.audioUrl);
    } catch (err: any) {
      console.warn('Error deleting track in background:', err);
      // The optimistic success message above was wrong — correct it so the
      // admin isn't left believing a deletion that actually failed.
      setUploadFeedback(
        isRtl
          ? `⚠️ لم يتم حذف "${getTrackDisplayName(toDelete, 'ar')}" فعليًا — حدث خطأ، يرجى إعادة المحاولة.`
          : `⚠️ Failed to delete "${getTrackDisplayName(toDelete, 'en')}" — please retry.`
      );
    }
  };

  const handleToggleActive = async (track: MusicTrack) => {
    if (!track.id) return;
    const nextState = !(track.isActive ?? true);
    await toggleSongActiveStatus(track.id, nextState);
    track.isActive = nextState;
    setUploadFeedback(
      isRtl
        ? `تم ${nextState ? 'تفعيل' : 'تعطيل'} معزوفة "${getTrackDisplayName(track, 'ar')}"`
        : `Track ${nextState ? 'activated' : 'deactivated'}`
    );
  };

  const getTrackDisplayName = (t: MusicTrack, lang: 'ar' | 'en'): string => {
    if (!t) return '';
    if (t.title) return t.title;
    if (typeof t.name === 'object' && t.name) {
      return (lang === 'ar' ? t.name.ar || t.name.en : t.name.en || t.name.ar) || t.label || '';
    }
    if (typeof t.name === 'string') return t.name;
    return t.label || '';
  };

  // Filtered & Paginated Tracks
  const filteredTracks = useMemo(() => {
    const hiddenIds = adminSettings?.hiddenTrackIds || [];
    return adminTracks.filter((t) => {
      if (!t) return false;
      if (t.id && hiddenIds.includes(t.id)) return false;
      if (t.url && hiddenIds.includes(t.url)) return false;
      if (t.audioUrl && hiddenIds.includes(t.audioUrl)) return false;
      const matchCategory = selectedCategory === 'all' || (t.category || '').toLowerCase() === (selectedCategory || '').toLowerCase();
      const nameAr = (getTrackDisplayName(t, 'ar') || '').toLowerCase();
      const nameEn = (getTrackDisplayName(t, 'en') || '').toLowerCase();
      const q = (searchQuery || '').toLowerCase().trim();
      const matchSearch =
        !q ||
        nameAr.includes(q) ||
        nameEn.includes(q) ||
        (t.artist && (t.artist || '').toLowerCase().includes(q)) ||
        (t.label && (t.label || '').toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [adminTracks, adminSettings, selectedCategory, searchQuery]);

  const displayedTracks = useMemo(() => {
    return filteredTracks.slice(0, pageSize);
  }, [filteredTracks, pageSize]);

  return (
    <div className="space-y-8">
      {/* Top Quick Settings: Site Background Music & Default Demo Track */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Website Background Music (موسيقى خلفية الموقع) */}
        <div className="bg-[#1F1E1B] rounded-3xl p-5 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.1)] space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-[#2E2C28] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="font-playfair text-sm font-bold text-[#F7F4EE]">
                  {isRtl ? 'موسيقى خلفية الموقع (Site Background)' : 'Website Background Music'}
                </h4>
                <p className="text-[11px] text-[#8D8A84]">
                  {isRtl ? 'تعمل في صفحات الموقع وتتوقف تلقائياً عند فتح الدعوات' : 'Ambient sound for site visitors, auto-pauses in previews'}
                </p>
              </div>
            </div>
            {adminSettings?.websiteBackgroundMusicUrl ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                {isRtl ? 'مفعّلة 🟢' : 'Active 🟢'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px] font-bold">
                {isRtl ? 'غير محددة' : 'Not Set'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#E9E1D5] block">
              {isRtl ? 'المعزوفة المختارة حالياً كخلفية للموقع:' : 'Current Selected Background Track:'}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={adminSettings?.websiteBackgroundMusicUrl || ''}
                onChange={async (e) => {
                  const selectedUrl = e.target.value;
                  if (!selectedUrl) {
                    if (onSetWebsiteBgTrack) await onSetWebsiteBgTrack('', '');
                    return;
                  }
                  const found = adminTracks.find((t) => (t.audioUrl || t.url) === selectedUrl);
                  const trackName = found ? getTrackDisplayName(found, 'ar') : (isRtl ? 'معزوفة الموقع' : 'Site Music');
                  if (onSetWebsiteBgTrack) await onSetWebsiteBgTrack(selectedUrl, trackName);
                }}
                className="flex-1 bg-[#171717] border border-[#333] focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-[#F7F4EE] font-medium focus:outline-none cursor-pointer"
              >
                <option value="">{isRtl ? '— بدون موسيقى خلفية للموقع —' : '— No Background Music —'}</option>
                {adminTracks.map((t) => {
                  const trackUrl = t.audioUrl || t.url;
                  const trackName = getTrackDisplayName(t, 'ar');
                  return (
                    <option key={t.id || trackUrl} value={trackUrl}>
                      {trackName} ({t.category || 'royal'})
                    </option>
                  );
                })}
              </select>

              {adminSettings?.websiteBackgroundMusicUrl && (
                <button
                  onClick={() => handlePlayPause(adminSettings.websiteBackgroundMusicUrl!)}
                  className="p-2 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/40 text-emerald-300 transition-colors cursor-pointer shrink-0"
                  title={isRtl ? 'معاينة الصوت' : 'Preview audio'}
                >
                  {playingTrackUrl === adminSettings.websiteBackgroundMusicUrl ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>
              )}
            </div>

            {adminSettings?.websiteBackgroundMusicName && (
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span>🎵 {adminSettings.websiteBackgroundMusicName}</span>
              </p>
            )}
          </div>
        </div>

        {/* 2. Default Demo Track for Invitations (معزوفة الديمو الافتراضية) */}
        <div className="bg-[#1F1E1B] rounded-3xl p-5 border border-[#B99A65]/40 shadow-[0_0_25px_rgba(185,154,101,0.1)] space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 border-b border-[#2E2C28] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#B99A65]/20 border border-[#B99A65]/50 flex items-center justify-center text-[#B99A65]">
                <Star className="w-4 h-4 fill-[#B99A65]" />
              </div>
              <div>
                <h4 className="font-playfair text-sm font-bold text-[#F7F4EE]">
                  {isRtl ? 'معزوفة الديمو الافتراضية (Default Demo Track)' : 'Default Demo Invitation Music'}
                </h4>
                <p className="text-[11px] text-[#8D8A84]">
                  {isRtl ? 'المعزوفة التي تعمل تلقائياً على كل الدعوات التجريبية وقوالب العرض' : 'Plays automatically on all sample invitations and previews'}
                </p>
              </div>
            </div>
            {adminSettings?.defaultDemoTrackUrl ? (
              <span className="px-2.5 py-1 rounded-full bg-[#B99A65]/20 border border-[#B99A65]/50 text-[#B99A65] text-[10px] font-bold">
                {isRtl ? 'محددة ⭐' : 'Selected ⭐'}
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px] font-bold">
                {isRtl ? 'الافتراضية العامة' : 'Global Default'}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#E9E1D5] block">
              {isRtl ? 'المعزوفة المعينة لجميع الديمو والتجارب:' : 'Current Selected Default Demo Track:'}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={adminSettings?.defaultDemoTrackUrl || ''}
                onChange={async (e) => {
                  const selectedUrl = e.target.value;
                  if (!selectedUrl) return;
                  const found = adminTracks.find((t) => (t.audioUrl || t.url) === selectedUrl);
                  const trackName = found ? getTrackDisplayName(found, 'ar') : (isRtl ? 'معزوفة الديمو' : 'Demo Track');
                  await onSetDefaultDemoTrack(selectedUrl, trackName);
                }}
                className="flex-1 bg-[#171717] border border-[#333] focus:border-[#B99A65] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] font-medium focus:outline-none cursor-pointer"
              >
                <option value="">{isRtl ? '— اختر معزوفة الديمو الافتراضية —' : '— Select Default Demo Track —'}</option>
                {adminTracks.map((t) => {
                  const trackUrl = t.audioUrl || t.url;
                  const trackName = getTrackDisplayName(t, 'ar');
                  return (
                    <option key={t.id || trackUrl} value={trackUrl}>
                      {trackName} ({t.category || 'royal'})
                    </option>
                  );
                })}
              </select>

              {adminSettings?.defaultDemoTrackUrl && (
                <button
                  onClick={() => handlePlayPause(adminSettings.defaultDemoTrackUrl!)}
                  className="p-2 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#B99A65]/40 text-[#B99A65] transition-colors cursor-pointer shrink-0"
                  title={isRtl ? 'معاينة الصوت' : 'Preview audio'}
                >
                  {playingTrackUrl === adminSettings.defaultDemoTrackUrl ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>
              )}
            </div>

            {adminSettings?.defaultDemoTrackName && (
              <p className="text-[10px] text-[#B99A65] font-mono flex items-center gap-1">
                <span>🎵 {adminSettings.defaultDemoTrackName}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Upload New Track Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-[#1F1E1B] rounded-3xl p-6 border transition-all duration-300 ${
          isDragOver
            ? 'border-[#B99A65] bg-[#B99A65]/10 shadow-[0_0_40px_rgba(185,154,101,0.25)] scale-[1.01]'
            : 'border-[#B99A65]/40 shadow-[0_0_30px_rgba(185,154,101,0.1)]'
        } space-y-5`}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h4 className="font-playfair text-base font-bold text-[#F7F4EE] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#B99A65]" />
              <span>{isRtl ? 'إدارة ورفع الملفات الصوتية (Cloudflare R2 + Firestore)' : 'Audio Library & Cloud Storage Management'}</span>
            </h4>
            <p className="text-xs text-[#8D8A84] mt-0.5 leading-relaxed">
              {isRtl
                ? 'يمكنك رفع معزوفة واحدة أو عدة ملفات معاً (Bulk Upload) مع شريط تقدم فوري وسحب وإفلات مباشر.'
                : 'Upload single or multiple tracks in bulk with real-time progress bar and drag & drop.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Selector for Upload */}
            <div className="flex items-center gap-1.5 bg-[#171717] px-2.5 py-1.5 rounded-xl border border-[#333]">
              <span className="text-[11px] text-[#8D8A84]">{isRtl ? 'التصنيف:' : 'Category:'}</span>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="bg-transparent text-xs text-[#B99A65] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="royal" className="bg-[#171717] text-[#F7F4EE]">{isRtl ? 'ملكي فاخر' : 'Royal'}</option>
                <option value="wedding" className="bg-[#171717] text-[#F7F4EE]">{isRtl ? 'زفاف' : 'Wedding'}</option>
                <option value="engagement" className="bg-[#171717] text-[#F7F4EE]">{isRtl ? 'خطوبة' : 'Engagement'}</option>
                <option value="classic" className="bg-[#171717] text-[#F7F4EE]">{isRtl ? 'كلاسيك' : 'Classic'}</option>
                <option value="birthday" className="bg-[#171717] text-[#F7F4EE]">{isRtl ? 'احتفالات' : 'Celebration'}</option>
              </select>
            </div>

            {/* Option 1: Upload with Trimmer & Dual Package */}
            <input
              type="file"
              ref={trimmerFileInputRef}
              onChange={handleFileForTrimmer}
              accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg"
              className="hidden"
            />
            <button
              onClick={() => trimmerFileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#d6bd91] hover:from-[#cbb07e] hover:to-[#e2ca9f] text-[#171717] font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Scissors className="w-4 h-4 text-[#171717]" />
              <span>{isRtl ? 'قص ورفع باحترافية ✂️' : 'Upload & Trim Audio ✂️'}</span>
            </button>

            {/* Option 2: Upload direct multi-file without trim */}
            <input
              type="file"
              ref={directFileInputRef}
              onChange={handleDirectFileUpload}
              accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg"
              multiple
              className="hidden"
            />
            <button
              onClick={() => directFileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#444] text-[#F7F4EE] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#B99A65]" />
                  <span>{isRtl ? 'جارِ الرفع...' : 'Uploading...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#B99A65]" />
                  <span>{isRtl ? 'رفع ملفات متعددة (Bulk) 📤' : 'Upload Multiple Files'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone Hint */}
        <div
          onClick={() => directFileInputRef.current?.click()}
          className="border border-dashed border-[#B99A65]/30 hover:border-[#B99A65] bg-[#171717]/60 hover:bg-[#171717] rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5"
        >
          <Upload className="w-5 h-5 text-[#B99A65]/70" />
          <p className="text-xs text-[#F7F4EE] font-medium">
            {isRtl
              ? 'اسحب وأفلت عدة ملفات صوتية هنا أو اضغط للاختيار من جهازك'
              : 'Drag & drop multiple audio files here or click to browse'}
          </p>
          <span className="text-[10px] text-[#8D8A84]">
            MP3, WAV, M4A, AAC, OGG {isRtl ? '(حتى 35 ميجابايت للملف)' : '(up to 35MB each)'}
          </span>
        </div>

        {/* Real-time Upload Progress Queue */}
        {uploadQueue.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs text-[#8D8A84] border-b border-[#2A2722] pb-2">
              <span className="text-[#F7F4EE] font-semibold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#B99A65] animate-pulse" />
                {isRtl ? 'قائمة الرفع السحابي الفعلي:' : 'Active Upload Queue:'}
              </span>
              <span>
                {uploadQueue.filter((q) => q.status === 'completed').length} / {uploadQueue.length}{' '}
                {isRtl ? 'مكتمل' : 'completed'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#171717] p-3 rounded-xl border border-[#2E2C28] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      {item.status === 'uploading' && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B99A65] shrink-0" />
                      )}
                      {item.status === 'completed' && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                      {item.status === 'error' && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      {item.status === 'pending' && (
                        <Clock className="w-3.5 h-3.5 text-[#8D8A84] shrink-0" />
                      )}
                      <span className="text-[#F7F4EE] font-medium truncate">{item.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 text-[11px]">
                      <span className="text-[#8D8A84]">
                        {item.loadedBytes > 0
                          ? `${formatFileSize(item.loadedBytes)} / ${formatFileSize(item.totalBytes)}`
                          : formatFileSize(item.size)}
                      </span>
                      <span
                        className={`font-bold ${
                          item.status === 'completed'
                            ? 'text-emerald-400'
                            : item.status === 'error'
                            ? 'text-rose-400'
                            : 'text-[#B99A65]'
                        }`}
                      >
                        {item.progress}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#2A2722] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 rounded-full ${
                        item.status === 'completed'
                          ? 'bg-emerald-400'
                          : item.status === 'error'
                          ? 'bg-rose-500'
                          : 'bg-gradient-to-r from-[#B99A65] to-[#f3e7c4]'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadFeedback && (
          <div className="p-3.5 rounded-xl bg-[#171717] border border-[#B99A65]/40 text-xs text-[#F7F4EE] flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B99A65] shrink-0" />
              <span>{uploadFeedback}</span>
            </div>
            <button
              onClick={() => {
                setUploadFeedback(null);
                setUploadQueue([]);
              }}
              className="text-[#8D8A84] hover:text-[#F7F4EE] text-xs p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#1F1E1B] p-3 rounded-2xl border border-[#2A2722]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8D8A84] absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث في مكتبة الأغاني والمعزوفات...' : 'Search audio catalog...'}
            className="w-full bg-[#171717] border border-[#333] rounded-xl pl-3 pr-9 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
          >
            <option value="all">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
            <option value="royal">{isRtl ? 'ملكي فاخر' : 'Royal'}</option>
            <option value="wedding">{isRtl ? 'زفاف' : 'Wedding'}</option>
            <option value="engagement">{isRtl ? 'خطوبة' : 'Engagement'}</option>
            <option value="classic">{isRtl ? 'كلاسيك' : 'Classic'}</option>
            <option value="birthday">{isRtl ? 'احتفالات' : 'Celebration'}</option>
          </select>
        </div>
      </div>

      {/* Available Music Library Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-playfair text-lg font-bold text-[#F7F4EE] flex items-center gap-2">
            <Music className="w-4 h-4 text-[#B99A65]" />
            <span>{isRtl ? 'المكتبة الصوتية المعتمدة للموقع' : 'Official Website Music Library'}</span>
            <span className="text-xs text-[#8D8A84]">({filteredTracks.length})</span>
          </h4>
        </div>

        {displayedTracks.length === 0 ? (
          <div className="p-8 text-center bg-[#1F1E1B] rounded-2xl border border-[#2E2C28] text-xs text-[#8D8A84]">
            {isRtl ? 'لا توجد مقطوعات صوتية تطابق البحث. يمكنك رفع مقطوعة جديدة من الأعلى.' : 'No audio tracks found matching criteria.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTracks.map((track, idx) => {
              const trackNameAr = getTrackDisplayName(track, 'ar');
              const trackNameEn = getTrackDisplayName(track, 'en');
              const mainUrl = track.previewUrl || track.audioUrl || track.url || '';
              const isPlaying = mainUrl ? playingTrackUrl === mainUrl : false;
              const isLoading = mainUrl ? loadingTrackUrl === mainUrl : false;
              const isDefaultDemo =
                adminSettings?.defaultDemoTrackUrl === track.url ||
                adminSettings?.defaultDemoTrackUrl === track.audioUrl ||
                (adminSettings?.defaultDemoTrackName && adminSettings.defaultDemoTrackName === trackNameAr);
              const isWebsiteBg =
                adminSettings?.websiteBackgroundMusicUrl === track.url ||
                adminSettings?.websiteBackgroundMusicUrl === track.audioUrl ||
                (adminSettings?.websiteBackgroundMusicName && adminSettings.websiteBackgroundMusicName === trackNameAr);
              const isActive = track.isActive ?? true;

              return (
                <div
                  key={track.id ? `track-${track.id}-${idx}` : `track-item-${idx}`}
                  className={`bg-[#1F1E1B] rounded-2xl p-4 border transition-all space-y-3 relative ${
                    isWebsiteBg
                      ? 'border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                      : isDefaultDemo
                      ? 'border-[#B99A65] shadow-[0_0_20px_rgba(185,154,101,0.2)]'
                      : isActive
                      ? 'border-[#2E2C28] hover:border-[#444]'
                      : 'border-[#2E2C28] opacity-60'
                  }`}
                >
                  {/* Header & Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-[#2E2C28] text-[#8D8A84] text-[10px] font-mono">
                      {track.category || (isRtl ? 'ملكي' : 'Royal')}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {track.previewUrl && track.audioUrl && track.previewUrl !== track.audioUrl && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[9px] font-bold">
                          Dual Audio
                        </span>
                      )}

                      {isWebsiteBg && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                          <Radio className="w-3 h-3 text-emerald-400" />
                          <span>{isRtl ? 'الموقع' : 'Site BG'}</span>
                        </span>
                      )}

                      {isDefaultDemo && (
                        <span className="px-2 py-0.5 rounded-full bg-[#B99A65]/20 text-[#B99A65] border border-[#B99A65]/40 text-[10px] font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#B99A65]" />
                          <span>{isRtl ? 'ديمو' : 'Demo'}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs text-[#F7F4EE] line-clamp-1">
                      {isRtl ? trackNameAr : trackNameEn}
                    </h5>
                    <p className="text-[10px] text-[#8D8A84] truncate font-mono">
                      {track.artist || 'FRIDA Royal Orchestra'}{mainUrl ? ` • ${mainUrl.substring(0, 40)}...` : ''}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[#2A2722] flex-wrap">
                    {/* Play / Pause */}
                    <button
                      onClick={() => handlePlayPause(mainUrl)}
                      disabled={isLoading}
                      className="p-2 rounded-xl bg-[#2A2722] hover:bg-[#333] text-[#B99A65] transition-colors cursor-pointer"
                      title={isPlaying ? (isRtl ? 'إيقاف' : 'Pause') : (isRtl ? 'معاينة سريعة' : 'Play Preview')}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    {/* Toggle Active/Inactive */}
                    <button
                      onClick={() => handleToggleActive(track)}
                      className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400 hover:bg-emerald-900/40'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
                      }`}
                      title={isActive ? (isRtl ? 'معزوفة مفعّلة (انقر للتعطيل)' : 'Active') : (isRtl ? 'معزوفة معطلة (انقر للتفعيل)' : 'Inactive')}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    {/* Set Website BG Music */}
                    {onSetWebsiteBgTrack && !isWebsiteBg && (
                      <button
                        onClick={() => onSetWebsiteBgTrack(track.audioUrl || track.url, trackNameAr)}
                        className="px-2 py-1.5 rounded-xl bg-[#171717] hover:bg-emerald-950/30 border border-[#333] hover:border-emerald-500/50 text-[#8D8A84] hover:text-emerald-300 text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title={isRtl ? 'تعيين كموسيقى خلفية للموقع بالكامل' : 'Set as website background music'}
                      >
                        <Radio className="w-3 h-3 text-emerald-400" />
                        <span>{isRtl ? 'الموقع' : 'Site BG'}</span>
                      </button>
                    )}

                    {/* Set Default Demo */}
                    {!isDefaultDemo && (
                      <button
                        onClick={() => onSetDefaultDemoTrack(track.audioUrl || track.url, trackNameAr)}
                        className="px-2 py-1.5 rounded-xl bg-[#171717] hover:bg-[#B99A65]/20 border border-[#333] hover:border-[#B99A65] text-[#8D8A84] hover:text-[#B99A65] text-[10px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title={isRtl ? 'تعيين كمعزوفة افتراضية لجميع الديمو' : 'Set as default demo track'}
                      >
                        <Star className="w-3 h-3" />
                        <span>{isRtl ? 'ديمو' : 'Demo'}</span>
                      </button>
                    )}

                    {/* Delete Track */}
                    <button
                      onClick={() => setTrackToDelete(track)}
                      className="px-2 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-600 text-red-400 hover:text-red-200 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ml-auto"
                      title={isRtl ? 'حذف هذه المعزوفة' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Pagination */}
        {filteredTracks.length > pageSize && (
          <div className="text-center pt-4">
            <button
              onClick={() => setPageSize((prev) => prev + 24)}
              className="px-5 py-2.5 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#444] text-[#F7F4EE] text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              {isRtl ? `عرض المزيد (+24) — متبقي ${filteredTracks.length - pageSize}` : 'Load More Songs'}
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {trackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#171717] border border-red-900/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center mx-auto text-red-400 shadow-lg">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-playfair text-lg font-bold text-[#F7F4EE]">
                {isRtl ? 'تأكيد حذف المعزوفة الموسيقية' : 'Confirm Track Deletion'}
              </h3>
              <p className="text-xs text-[#8D8A84] leading-relaxed">
                {isRtl ? (
                  <>
                    هل أنت متأكد من رغبتك في حذف معزوفة{' '}
                    <strong className="text-[#F7F4EE]">
                      "{getTrackDisplayName(trackToDelete, 'ar')}"
                    </strong>{' '}
                    وتنظيف ملفاتها من مساحة التخزين السحابي؟
                  </>
                ) : (
                  <>
                    Are you sure you want to delete{' '}
                    <strong className="text-[#F7F4EE]">
                      "{getTrackDisplayName(trackToDelete, 'en')}"
                    </strong>{' '}
                    and purge its cloud storage assets?
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrackToDelete(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-[#2A2722] hover:bg-[#333] text-[#F7F4EE] text-xs font-bold transition-colors cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{isRtl ? 'جارِ الحذف...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{isRtl ? 'نعم، حذف نهائي' : 'Yes, Delete'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Trimmer Modal with Admin Privileges */}
      {trimmerAudioBlob && (
        <AudioTrimmerModal
          audioBlob={trimmerAudioBlob}
          trackName={trimmerTrackName}
          currentLang={currentLang}
          isAdmin={true}
          onClose={() => setTrimmerAudioBlob(null)}
          onTrackReady={async (newTrack) => {
            await onSaveTrack(newTrack);
            setUploadFeedback(
              isRtl
                ? `تم تجهيز ورفع المعزوفة بنجاح إلى التخزين السحابي! ✂️🎵`
                : 'Track packaged and stored in cloud storage!'
            );
            setTrimmerAudioBlob(null);
          }}
        />
      )}
    </div>
  );
};
