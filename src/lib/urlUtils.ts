/**
 * URL Utilities and Security Helpers for FRIDA
 * Provides strict URL sanitization and path-based link generation.
 */

import { SITE_URL } from '../config/brand';

/**
 * Validates and sanitizes a URL.
 * Only allows safe protocols (https, http, wa.me, tel, mailto, maps).
 * Rejects javascript:, data:, blob:, file:, and invalid strings.
 */
export function safeUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Direct blocked unsafe schemes
  if (/^(javascript|data|vbscript|file|blob):/i.test(trimmed)) {
    console.warn('Blocked unsafe URL scheme:', trimmed);
    return '';
  }

  // Handle wa.me or phone links
  if (/^https?:\/\/wa\.me\//i.test(trimmed) || /^https?:\/\/api\.whatsapp\.com\//i.test(trimmed)) {
    return trimmed;
  }

  // Standard http/https URL validation
  try {
    const parsed = new URL(trimmed, SITE_URL);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return trimmed;
    }
    if (parsed.protocol === 'tel:' || parsed.protocol === 'mailto:') {
      return trimmed;
    }
  } catch {
    return '';
  }

  return '';
}

/**
 * Clean path-based Invitation URL: /i/:slug
 */
export function getInvitationUrl(slugOrId: string, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : SITE_URL);
  const clean = encodeURIComponent(String(slugOrId || '').trim());
  return `${base}/i/${clean}`;
}

/**
 * Clean path-based Host Portal URL: /portal/:slug
 */
export function getPortalUrl(slugOrId: string, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : SITE_URL);
  const clean = encodeURIComponent(String(slugOrId || '').trim());
  return `${base}/portal/${clean}`;
}

/**
 * Clean path-based Template Preview URL: /preview/:id
 */
export function getPreviewUrl(templateId: string, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : SITE_URL);
  const clean = encodeURIComponent(String(templateId || '').trim());
  return `${base}/preview/${clean}`;
}
