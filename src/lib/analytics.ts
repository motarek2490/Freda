/**
 * Unified Analytics & Conversion Tracking Module for FRIDA (GA4 + Meta Pixel)
 * Privacy-first: Tracks events ONLY when user consent is explicitly 'granted'.
 * Strict Zero-PII Policy: Never logs phone numbers, guest names, or private credentials.
 */

import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';
import { app } from './firebase';
import { initMetaPixel, trackMetaPixelEvent } from './metaPixel';

export const CONSENT_STORAGE_KEY = 'frida_analytics_consent';

export type ConsentStatus = 'granted' | 'denied' | null;

let analyticsInstance: Analytics | null = null;
let isGAInitialized = false;

/**
 * Gets user privacy consent choice from localStorage
 */
export function getAnalyticsConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (value === 'granted' || value === 'denied') {
      return value;
    }
  } catch {
    // localStorage disabled
  }
  return null;
}

/**
 * Initializes GA4 and Meta Pixel if user consent is 'granted'
 */
export async function initAnalyticsIfConsented(): Promise<void> {
  if (typeof window === 'undefined') return;

  const consent = getAnalyticsConsent();
  if (consent !== 'granted') {
    return;
  }

  // 1. Initialize Firebase Analytics (GA4) if supported
  if (!isGAInitialized) {
    try {
      const supported = await isSupported();
      if (supported) {
        analyticsInstance = getAnalytics(app);
        isGAInitialized = true;
      }
    } catch (e) {
      console.warn('Firebase Analytics not supported in this environment:', e);
    }
  }

  // 2. Initialize Meta Pixel lazily
  initMetaPixel();
}

/**
 * Save user consent choice and trigger/disable analytics accordingly
 */
export function setAnalyticsConsent(status: 'granted' | 'denied'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  } catch {
    // ignore
  }

  if (status === 'granted') {
    initAnalyticsIfConsented();
  }
}

// -----------------------------------------------------------------------------
// EVENT TRACKING HELPERS (Zero-PII)
// -----------------------------------------------------------------------------

/**
 * 1. Template Preview Event (view_template / ViewContent)
 */
export function trackViewTemplate(templateId: string, templateName: string, category?: string): void {
  if (getAnalyticsConsent() !== 'granted') return;

  const cleanId = String(templateId || '').trim();
  const cleanName = String(templateName || '').trim();

  // GA4 Event
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'view_item', {
      item_id: cleanId,
      item_name: cleanName,
      item_category: category || 'templates',
    });
    logEvent(analyticsInstance, 'view_template', {
      template_id: cleanId,
      category: category || 'templates',
    });
  }

  // Meta Pixel Event
  trackMetaPixelEvent('ViewContent', {
    content_ids: [cleanId],
    content_name: cleanName,
    content_type: 'product',
    content_category: category || 'templates',
  });
}

/**
 * 2. Begin Checkout Event (begin_checkout / InitiateCheckout)
 */
export function trackBeginCheckout(planTier: string, priceEGP: number): void {
  if (getAnalyticsConsent() !== 'granted') return;

  const cleanTier = String(planTier || 'royal_vip').trim();
  const numValue = Number(priceEGP) || 0;

  // GA4 Event
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'begin_checkout', {
      value: numValue,
      currency: 'EGP',
      plan_tier: cleanTier,
    });
  }

  // Meta Pixel Event
  trackMetaPixelEvent('InitiateCheckout', {
    value: numValue,
    currency: 'EGP',
    content_category: cleanTier,
  });
}

/**
 * 3. Purchase / Order Placed Event (purchase / Purchase)
 */
export function trackPurchase(orderId: string, planTier: string, priceEGP: number): void {
  if (getAnalyticsConsent() !== 'granted') return;

  const cleanOrderId = String(orderId || '').trim();
  const cleanTier = String(planTier || 'royal_vip').trim();
  const numValue = Number(priceEGP) || 0;

  // GA4 Event
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'purchase', {
      transaction_id: cleanOrderId,
      value: numValue,
      currency: 'EGP',
      plan_tier: cleanTier,
    });
  }

  // Meta Pixel Event
  trackMetaPixelEvent('Purchase', {
    value: numValue,
    currency: 'EGP',
    content_type: 'product',
    content_name: cleanTier,
    order_id: cleanOrderId,
  });
}

/**
 * 4. Sign Up / Account Registered Event (sign_up / CompleteRegistration)
 */
export function trackSignUp(method = 'google'): void {
  if (getAnalyticsConsent() !== 'granted') return;

  // GA4 Event
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'sign_up', {
      method,
    });
  }

  // Meta Pixel Event
  trackMetaPixelEvent('CompleteRegistration', {
    status: true,
  });
}

/**
 * 5. Guest RSVP Submitted Event (rsvp_submitted / Lead)
 */
export function trackRSVPSubmitted(invitationId: string, status: string, guestCount = 1): void {
  if (getAnalyticsConsent() !== 'granted') return;

  const cleanInvId = String(invitationId || '').trim();
  const cleanStatus = String(status || 'attending').trim();

  // GA4 Event
  if (analyticsInstance) {
    logEvent(analyticsInstance, 'rsvp_submitted', {
      invitation_id: cleanInvId,
      rsvp_status: cleanStatus,
      guest_count: guestCount,
    });
  }

  // Meta Pixel Event
  trackMetaPixelEvent('Lead', {
    content_name: 'RSVP Submission',
    content_category: cleanStatus,
  });
  trackMetaPixelEvent('RSVPSubmitted', { invitation_id: cleanInvId, status: cleanStatus }, true);
}
