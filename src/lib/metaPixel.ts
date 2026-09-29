/**
 * Meta (Facebook) Pixel Integration Module for FRIDA
 * Dynamically loads Meta Pixel script only when user consent is granted.
 * Lazy-loads after page load / requestIdleCallback to preserve Core Web Vitals.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    META_PIXEL_ID?: string;
  }
}

const DEFAULT_PIXEL_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_META_PIXEL_ID) ||
  'YOUR_META_PIXEL_ID';

let pixelInitialized = false;

export function getMetaPixelId(): string {
  if (typeof window !== 'undefined' && window.META_PIXEL_ID) {
    return window.META_PIXEL_ID;
  }
  return DEFAULT_PIXEL_ID;
}

/**
 * Initializes Meta Pixel script tag dynamically and lazily.
 */
export function initMetaPixel(): void {
  if (typeof window === 'undefined' || pixelInitialized) return;

  const pixelId = getMetaPixelId();
  if (!pixelId || pixelId === 'YOUR_META_PIXEL_ID') {
    // Pixel ID not provided; skip loading script until configured
    return;
  }

  const loadScript = () => {
    if (window.fbq) return;

    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */

    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('init', pixelId);
      fbq('track', 'PageView');
    }
    pixelInitialized = true;
  };

  // Lazy-load after window load / idle time to avoid blocking LCP/FID
  if (document.readyState === 'complete') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadScript);
    } else {
      setTimeout(loadScript, 1000);
    }
  } else {
    window.addEventListener('load', () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadScript);
      } else {
        setTimeout(loadScript, 1000);
      }
    });
  }
}

/**
 * Track standard or custom Meta Pixel events
 */
export function trackMetaPixelEvent(eventName: string, params?: Record<string, any>, isCustom = false): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  try {
    if (isCustom) {
      window.fbq('trackCustom', eventName, params);
    } else {
      window.fbq('track', eventName, params);
    }
  } catch (e) {
    console.warn('Meta Pixel tracking error:', e);
  }
}
