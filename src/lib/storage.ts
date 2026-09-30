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
  // Purge any stale legacy local cache
  try {
    localStorage.removeItem(INVITATIONS_KEY);
    localStorage.removeItem('frida_user_invitations');
  } catch {}
  return [];
}

export function saveInvitation(invitation: InvitationData): InvitationData {
  if (
    !invitation ||
    !invitation.id ||
    invitation.id.startsWith('preview-') ||
    invitation.id.startsWith('demo-') ||
    invitation.id === 'demo-inv' ||
    invitation.slug?.startsWith('preview-') ||
    invitation.slug?.startsWith('demo-')
  ) {
    return invitation;
  }

  // Ensure access code exists
  if (!invitation.hostAccessCode) {
    invitation.hostAccessCode = 'HOST-' + Math.floor(100000 + Math.random() * 900000);
  }

  // Persist directly to Cloud Firestore
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

export function clearAllStoredMockData() {
  try {
    localStorage.removeItem(INVITATIONS_KEY);
    localStorage.removeItem('frida_user_invitations');
  } catch {}
}

export function deleteInvitation(id: string) {
  try {
    localStorage.removeItem(INVITATIONS_KEY);
    localStorage.removeItem('frida_user_invitations');
  } catch {}

  deleteInvitationCloud(id).catch((err) => {
    console.warn('Cloud delete error for invitation:', err);
  });
}

export async function fetchInvitationWithCloudFallback(slugOrId: string): Promise<InvitationData | undefined> {
  const cleanKey = (slugOrId || '').trim();
  if (!cleanKey) return undefined;

  const lower = cleanKey.toLowerCase();

  // If it's a built-in demo or template preview, return immediately without network overhead
  if (lower.startsWith('preview-demo-') || lower.startsWith('demo-') || lower.startsWith('preview-')) {
    return getInvitationBySlugOrId(cleanKey);
  }

  // 1. Fetch strictly from Cloud Firestore
  try {
    const cloudInv = await getInvitationCloudBySlugOrId(cleanKey);
    if (cloudInv) {
      return cloudInv;
    }
  } catch (e) {
    console.warn('Error retrieving cloud invitation:', e);
  }

  // NEVER fallback to local storage for real invitations.
  // If it does not exist in Cloud Firestore, it was deleted!
  return undefined;
}

export function getInvitationBySlugOrId(slugOrId: string): InvitationData | undefined {
  if (!slugOrId) return undefined;
  const rawKey = slugOrId.trim();
  const lowerKey = rawKey.toLowerCase();

  const cleanId = lowerKey
    .replace(/^preview-demo-/, '')
    .replace(/^preview-/, '')
    .replace(/^demo-/, '');

  // 1. Check VIP Demo Profiles (e.g. preview-demo-vip_1, vip_1, etc.)
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

  // 2. Check Templates by ID, clean ID, layoutType, or themeStyle
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

  // 3. Fallback for any other preview-* or demo-* slugs to prevent crash
  if (lowerKey.startsWith('preview-') || lowerKey.startsWith('demo-') || lowerKey.startsWith('preview') || lowerKey.startsWith('demo')) {
    const fallbackTmpl = TEMPLATES[0];
    if (fallbackTmpl) {
      return createTemplatePreviewInvitation(fallbackTmpl, 'ar', rawKey);
    }
  }

  return undefined;
}

export function getStoredRSVPs(invitationId?: string): RSVPResponse[] {
  try {
    localStorage.removeItem(RSVPS_KEY);
    localStorage.removeItem('frida_rsvp_responses');
  } catch {}
  return [];
}

export function saveRSVP(
  rsvp: Partial<RSVPResponse> & { invitationId: string; guestName: string; status: 'attending' | 'declined' | 'maybe'; guestCount: number }
): RSVPResponse {
  const savedRsvp: RSVPResponse = {
    ...rsvp,
    id: rsvp.id || 'rsvp-' + Date.now(),
    createdAt: rsvp.createdAt || new Date().toISOString(),
  } as RSVPResponse;

  saveRSVPCloud(rsvp.invitationId, savedRsvp).catch((e) => {
    console.warn('Cloud RSVP save error:', e);
  });

  return savedRsvp;
}
