/**
 * FRIDA PRIVACY VAULT & SECURITY ACCESS CONTROL
 * Client and server-side authorization enforcement:
 * - Unlisted invitation URLs
 * - Optional PIN protection
 * - Guest access tokens
 * - Expiration lifecycle management
 */

export interface InvitationSecurityConfig {
  isPrivate: boolean;
  accessPin?: string;
  isExpired?: boolean;
  expiresAt?: string;
  unlisted?: boolean;
}

const AUTHORIZED_SESSIONS_KEY = 'frida_authorized_pins';

/**
 * Validates PIN attempt securely
 */
export function verifyInvitationPin(inputPin: string, correctPin?: string): boolean {
  if (!correctPin) return true;
  return inputPin.trim() === correctPin.trim();
}

/**
 * Checks if current browser session has unlocked the PIN for given invitation
 */
export function isPinUnlockedInSession(invitationId: string): boolean {
  try {
    const raw = sessionStorage.getItem(AUTHORIZED_SESSIONS_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(invitationId);
  } catch {
    return false;
  }
}

/**
 * Stores unlocked invitation ID in session
 */
export function markPinUnlockedInSession(invitationId: string) {
  try {
    const raw = sessionStorage.getItem(AUTHORIZED_SESSIONS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(invitationId)) {
      list.push(invitationId);
      sessionStorage.setItem(AUTHORIZED_SESSIONS_KEY, JSON.stringify(list));
    }
  } catch {}
}

/**
 * Checks if invitation has expired based on event date + grace period (e.g. 30 days)
 */
export function checkIsExpired(eventDate?: string, maxDaysAfter: number = 30): boolean {
  if (!eventDate) return false;
  try {
    const eventTime = new Date(eventDate).getTime();
    const now = Date.now();
    const daysDiff = (now - eventTime) / (1000 * 60 * 60 * 24);
    return daysDiff > maxDaysAfter;
  } catch {
    return false;
  }
}
