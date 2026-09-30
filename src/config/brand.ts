/**
 * Centralized Brand Configuration for FRIDA / فريدا
 * Single source of truth for branding, typography constants, site URL, and infrastructure constants.
 */

export const BRAND_NAME = 'FRIDA';
export const BRAND_NAME_AR = 'فريدا';

// Live URL from env or fallback to workers.dev URL
export const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://farid.invitationes.workers.dev';

// DO-NOT-RENAME Infrastructure Identifiers
export const FIREBASE_DB_ID = 'ai-studio-frida-eb6a19f5-9126-4bbb-b06c-270aac6778bf';
export const FUNCTIONS_REGION = 'europe-west1';

export const BRAND_TAGLINE_EN = 'Your Moments. Beautifully Invited.';
export const BRAND_TAGLINE_AR = 'لحظاتكم الاستثنائية، بدعوات ملكية تليق بكم.';

export const BRAND_DESCRIPTION_EN =
  'Create, customize, and share ultra-elegant digital invitations for weddings, birthdays, anniversaries, corporate events, and special occasions with FRIDA.';
export const BRAND_DESCRIPTION_AR =
  'صمم وشارك أفخم بطاقات الدعوة الرقمية الملكية التفاعلية لحفلات الزفاف والخطوبة والمناسبات الخاصة مع منصة فريدا.';

export const BRAND_PRIMARY_COLOR = '#B99A65';
export const BRAND_SECONDARY_COLOR = '#E9E1D5';
export const BRAND_BG_DARK = '#171717';
export const BRAND_BG_CARD = '#1F1E1B';

// Unified Local Storage Keys
export const STORAGE_KEYS = {
  INVITATIONS: 'frida_user_invitations',
  RSVPS: 'frida_rsvp_responses',
  LANGUAGE: 'frida_language',
  USER_PROFILE: 'frida_user_profile',
} as const;

export const DEFAULT_PLAN_PRICES = {
  basic: 0,
  royal_vip: 0,
  diamond: 0,
} as const;

export function getPlanPrice(
  planTier: 'basic' | 'royal_vip' | 'diamond',
  adminSettings?: { basicPriceEGP?: number; royalPriceEGP?: number; diamondPriceEGP?: number } | null
): number {
  if (planTier === 'basic') return adminSettings?.basicPriceEGP ?? 0;
  if (planTier === 'diamond') return adminSettings?.diamondPriceEGP ?? 0;
  return adminSettings?.royalPriceEGP ?? 0;
}

