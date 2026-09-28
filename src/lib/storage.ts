import { InvitationData, RSVPResponse, UserProfile, Language } from '../types';
import { TEMPLATES } from '../data/templates';
import { STORAGE_KEYS } from '../config/brand';
import {
  EGYPTIAN_VIP_PROFILES,
  createDemoInvitationFromProfile,
  createTemplatePreviewInvitation,
} from '../data/vipProfiles';
import {
  saveInvitationCloud,
  getInvitationCloudBySlugOrId,
  deleteInvitationCloud,
  saveRSVPCloud,
  getUserInvitationsCloud,
} from './firestoreService';
import { auth, ensureAnonymousAuth } from './firebase';

const INVITATIONS_KEY = STORAGE_KEYS.INVITATIONS;
const RSVPS_KEY = STORAGE_KEYS.RSVPS;
const LANG_KEY = STORAGE_KEYS.LANGUAGE;
const USER_KEY = STORAGE_KEYS.USER_PROFILE;

export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_KEY) || localStorage.getItem('frida_language');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // Ignore restricted localStorage
  }
  return 'ar'; // Default RTL Arabic first
}

export function setStoredLanguage(lang: Language) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}
}

export function getStoredUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(USER_KEY) || localStorage.getItem('frida_user_profile');
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    return null;
  }
  return null;
}

export function setStoredUser(user: UserProfile | null) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('frida_user_profile');
    }
  } catch {}
}

export function getStoredInvitations(): InvitationData[] {
  try {
    const data = localStorage.getItem(INVITATIONS_KEY) || localStorage.getItem('frida_user_invitations');
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    return [];
  }
  return [];
}

export function saveInvitation(invitation: InvitationData): InvitationData {
  // Ensure access code exists
  if (!invitation.hostAccessCode) {
    invitation.hostAccessCode = 'HOST-' + Math.floor(100000 + Math.random() * 900000);
  }

  const current = getStoredInvitations();
  const index = current.findIndex((item) => item.id === invitation.id);
  let updated: InvitationData[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = invitation;
  } else {
    updated = [invitation, ...current];
  }

  try {
    localStorage.setItem(INVITATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  // Persist to Cloud Firestore with isolated vault in background (always runs even if anon auth is unavailable)
  ensureAnonymousAuth()
    .catch(() => null)
    .then((currentUser) => {
      if (currentUser && !invitation.ownerUid) {
        invitation.ownerUid = currentUser.uid;
      }
      return saveInvitationCloud(invitation);
    })
    .catch((err) => {
      console.warn('Cloud sync error for invitation:', err);
    });

  return invitation;
}

export function deleteInvitation(id: string) {
  const current = getStoredInvitations();
  const updated = current.filter((item) => item.id !== id);
  try {
    localStorage.setItem(INVITATIONS_KEY, JSON.stringify(updated));
  } catch {}

  deleteInvitationCloud(id).catch((err) => {
    console.warn('Cloud delete error for invitation:', err);
  });
}

export async function fetchInvitationWithCloudFallback(slugOrId: string): Promise<InvitationData | undefined> {
  const local = getInvitationBySlugOrId(slugOrId);

  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 3500);
  });

  // 1. Try Cloud Firestore with a 3.5 second timeout so the client never hangs forever
  try {
    const cloudInv = await Promise.race([
      getInvitationCloudBySlugOrId(slugOrId),
      timeoutPromise
    ]);

    if (cloudInv) {
      // Keep local cache updated with latest Cloud state
      saveInvitation(cloudInv);
      return cloudInv;
    }
  } catch (e) {
    console.warn('Error retrieving cloud invitation:', e);
  }

  // 2. Fallback to local storage if offline, not found in cloud, or cloud timed out
  return local;
}

export function getInvitationBySlugOrId(slugOrId: string): InvitationData | undefined {
  if (!slugOrId) return undefined;
  const list = getStoredInvitations();
  const rawKey = slugOrId.trim();
  const lowerKey = rawKey.toLowerCase();

  // 1. Direct local storage match
  const found = list.find(
    (item) =>
      item.slug?.toLowerCase() === lowerKey ||
      item.id?.toLowerCase() === lowerKey ||
      item.slug === rawKey ||
      item.id === rawKey
  );
  if (found) return found;

  const cleanId = lowerKey
    .replace(/^preview-demo-/, '')
    .replace(/^preview-/, '')
    .replace(/^demo-/, '');

  // 2. Check VIP Demo Profiles (e.g. preview-demo-vip_1, vip_1, etc.)
  const vipProfile = EGYPTIAN_VIP_PROFILES.find(
    (p) =>
      (p.id || '').toLowerCase() === cleanId ||
      (p.id || '').toLowerCase() === lowerKey ||
      `preview-demo-${(p.id || '').toLowerCase()}` === lowerKey ||
      `demo-${(p.id || '').toLowerCase()}` === lowerKey ||
      (p.templateId && p.templateId.toLowerCase() === cleanId) ||
      (p.layoutType && p.layoutType.toLowerCase() === cleanId)
  );
  if (vipProfile) {
    return createDemoInvitationFromProfile(vipProfile, 'ar', rawKey);
  }

  // 3. Check Templates by ID, clean ID, layoutType, or themeStyle
  const tmpl = TEMPLATES.find(
    (t) =>
      (t.id || '').toLowerCase() === cleanId ||
      (t.id || '').toLowerCase() === lowerKey ||
      (t.layoutType && t.layoutType.toLowerCase() === cleanId) ||
      (t.layoutType && t.layoutType.toLowerCase() === lowerKey) ||
      `preview-${(t.id || '').toLowerCase()}` === lowerKey ||
      `demo-${(t.id || '').toLowerCase()}` === lowerKey ||
      (t.layoutType && `preview-${t.layoutType.toLowerCase()}` === lowerKey)
  );
  if (tmpl) {
    return createTemplatePreviewInvitation(tmpl, 'ar', rawKey);
  }

  // 4. Fallback for any other preview-* or demo-* slugs to prevent 404
  if (lowerKey.startsWith('preview-') || lowerKey.startsWith('demo-') || lowerKey.startsWith('preview') || lowerKey.startsWith('demo')) {
    const fallbackTmpl = TEMPLATES[0];
    if (fallbackTmpl) {
      return createTemplatePreviewInvitation(fallbackTmpl, 'ar', rawKey);
    }
  }

  return undefined;
}

export function getStoredRSVPs(invitationId?: string): RSVPResponse[] {
  let allRsvps: RSVPResponse[] = [];
  try {
    const data = localStorage.getItem(RSVPS_KEY) || localStorage.getItem('frida_rsvp_responses');
    if (data) {
      allRsvps = JSON.parse(data);
    }
  } catch {
    allRsvps = [];
  }

  if (invitationId) {
    return allRsvps.filter((r) => r.invitationId === invitationId);
  }
  return allRsvps;
}

export function saveRSVP(
  rsvp: Partial<RSVPResponse> & { invitationId: string; guestName: string; status: 'attending' | 'declined' | 'maybe'; guestCount: number }
): RSVPResponse {
  const all = getStoredRSVPs();
  const existingIndex = rsvp.id ? all.findIndex((r) => r.id === rsvp.id) : -1;

  let savedRsvp: RSVPResponse;
  let updated: RSVPResponse[];

  if (existingIndex >= 0) {
    savedRsvp = {
      ...all[existingIndex],
      ...rsvp,
    };
    updated = [...all];
    updated[existingIndex] = savedRsvp;
  } else {
    savedRsvp = {
      ...rsvp,
      id: rsvp.id || 'rsvp-' + Date.now(),
      createdAt: rsvp.createdAt || new Date().toISOString(),
    };
    updated = [savedRsvp, ...all];
  }

  try {
    localStorage.setItem(RSVPS_KEY, JSON.stringify(updated));
  } catch {}

  saveRSVPCloud(rsvp.invitationId, savedRsvp).catch((e) => {
    console.warn('Cloud RSVP save error:', e);
  });

  return savedRsvp;
}
