/**
 * Cloudflare Worker for FRIDA / فريدا
 * - Edge SSR HTMLRewriter for dynamic OpenGraph & Twitter tags on /i/:slug and /portal/:slug
 * - Named Firestore DB resolution via /slugs/{slug} -> /invitations/{id}
 * - Clean redirects from legacy ?invitation= & ?portal= query params
 * - Enterprise Security Headers & Strict Content-Security-Policy (CSP)
 * - Static SPA asset serving via Cloudflare ASSETS binding
 */

interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
  SITE_URL?: string;
  BRAND_NAME?: string;
  BRAND_NAME_AR?: string;
  // تم إضافة متغيرات البيئة لتجنب المعرفات الثابتة
  FIREBASE_PROJECT_ID?: string;
  FIRESTORE_DATABASE_ID?: string;
}

// قيم احتياطية (Fallbacks) فقط في حال عدم وجود متغيرات بيئة
const DEFAULT_SITE_URL = 'https://farid.invitationes.workers.dev';
const DEFAULT_FIREBASE_PROJECT_ID = 'frida-ed3b5';
const DEFAULT_FIRESTORE_DATABASE_ID = '(default)';

interface InvitationMeta {
  title: string;
  description: string;
  coverImage: string;
  url: string;
}

// دالة ديناميكية لإنشاء سياسة أمان المحتوى (CSP) تتضمن النطاق الصحيح تلقائياً
function getContentSecurityPolicy(siteUrl: string): string {
  const host = new URL(siteUrl).hostname;
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://www.gstatic.com https://www.recaptcha.net https://recaptchaenterprise.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://*.googleusercontent.com https://images.unsplash.com https://www.facebook.com https://www.google-analytics.com https://${host}`,
    `media-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://${host}`,
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://recaptchaenterprise.googleapis.com wss://*.firebaseio.com https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://graph.facebook.com",
    "frame-src 'self' https://*.firebaseapp.com https://*.google.com https://www.google.com/recaptcha/ https://recaptchaenterprise.googleapis.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

function getSecurityHeaders(siteUrl: string): Record<string, string> {
  return {
    'Content-Security-Policy': getContentSecurityPolicy(siteUrl),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  };
}

function addSecurityHeaders(res: Response, isStaticAsset: boolean, siteUrl: string): Response {
  const newHeaders = new Headers(res.headers);
  const securityHeaders = getSecurityHeaders(siteUrl);
  
  for (const [key, value] of Object.entries(securityHeaders)) {
    newHeaders.set(key, value);
  }

  if (isStaticAsset) {
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (!newHeaders.has('Cache-Control')) {
    newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: newHeaders,
  });
}

/**
 * Resolves metadata using Firestore REST with named database ID
 */
async function fetchInvitationMeta(
  slugOrId: string,
  siteUrl: string,
  isPortal: boolean,
  projectId: string,
  databaseId: string
): Promise<InvitationMeta | null> {
  const cleanSlug = slugOrId.toLowerCase().trim();
  const dbIdsToTry = Array.from(new Set([databaseId, '(default)', 'ai-studio-vowly-eb6a19f5-9126-4bbb-b06c-270aac6778bf'])).filter(Boolean);

  for (const activeDb of dbIdsToTry) {
    const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${activeDb}/documents`;

    try {
      let targetInvId = cleanSlug;

      // 1. Resolve slug doc
      const slugUrl = `${baseUrl}/slugs/${encodeURIComponent(cleanSlug)}`;
      const slugRes = await fetch(slugUrl, { headers: { Accept: 'application/json' } });
      if (slugRes.ok) {
        const slugDoc = (await slugRes.json()) as any;
        if (slugDoc.fields?.invitationId?.stringValue) {
          targetInvId = slugDoc.fields.invitationId.stringValue;
        }
      }

      // 2. Fetch invitation doc
      const invUrl = `${baseUrl}/invitations/${encodeURIComponent(targetInvId)}`;
      const invRes = await fetch(invUrl, { headers: { Accept: 'application/json' } });

      if (invRes.ok) {
        const invDoc = (await invRes.json()) as any;
        if (invDoc && invDoc.fields) {
          const fields = invDoc.fields;
          const title = fields.title?.stringValue || 'دعوة ملكية خاصة — FRIDA';
          const eventDetails = fields.eventDetails?.mapValue?.fields || {};
          const hostNames = eventDetails.hostNames?.stringValue || '';
          const eventTitle = eventDetails.eventTitle?.stringValue || title;
          const venueName = eventDetails.venueName?.stringValue || '';
          const eventDate = eventDetails.eventDate?.stringValue || '';
          const coverImage =
            eventDetails.coverImageUrl?.stringValue ||
            fields.coverImage?.stringValue ||
            `${siteUrl}/og-default.jpg`;

          if (isPortal) {
            return {
              title: `بوابة إدارة الضيوف | ${eventTitle} — فريدا`,
              description: hostNames
                ? `بوابة إدارة الضيوف وتأكيدات الحضور (RSVP) لدعوة ${eventTitle} الخاصة بعائلة ${hostNames}.`
                : `بوابة إدارة الضيوف وتأكيدات الحضور (RSVP) الخاصة بدعوة ${eventTitle}.`,
              coverImage,
              url: `${siteUrl}/portal/${encodeURIComponent(cleanSlug)}`,
            };
          }

          const desc = hostNames
            ? `تتشرف عائلة ${hostNames} بدعوتكم لحضور ${eventTitle}${venueName ? ` في ${venueName}` : ''}${eventDate ? ` يوم ${eventDate}` : ''}.`
            : `دعوة خاصة لحضور ${eventTitle}. انقر لمشاهدة تفاصيل الدعوة وتأكيد الحضور (RSVP).`;

          return {
            title: `${eventTitle} | فريدا (FRIDA)`,
            description: desc,
            coverImage,
            url: `${siteUrl}/i/${encodeURIComponent(cleanSlug)}`,
          };
        }
      }
    } catch (err) {
      console.warn(`Worker Firestore fetch attempt on db '${activeDb}' error:`, err);
    }
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // قراءة المتغيرات من البيئة مع وجود قيم احتياطية آمنة
    const siteUrl = env.SITE_URL || DEFAULT_SITE_URL;
    const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;
    const databaseId = env.FIRESTORE_DATABASE_ID || DEFAULT_FIRESTORE_DATABASE_ID;

    // 1. Legacy Query Redirects (301 Permanent)
    const legacyInv = url.searchParams.get('invitation');
    if (legacyInv && (url.pathname === '/' || url.pathname === '')) {
      return Response.redirect(`${siteUrl}/i/${encodeURIComponent(legacyInv)}`, 301);
    }

    const legacyPortal = url.searchParams.get('portal');
    if (legacyPortal && (url.pathname === '/' || url.pathname === '')) {
      return Response.redirect(`${siteUrl}/portal/${encodeURIComponent(legacyPortal)}`, 301);
    }

    const isStaticAsset =
      url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/music/') ||
      url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2|woff|ttf|mp3|webmanifest)$/i) !== null;

    // 2. OpenGraph / Twitter Edge SSR for /i/:slug and /portal/:slug
    const invMatch = url.pathname.match(/^\/i\/([^\/]+)$/);
    const portalMatch = url.pathname.match(/^\/portal\/([^\/]+)$/);

    if (invMatch || portalMatch) {
      const isPortal = !invMatch && !!portalMatch;
      const slug = decodeURIComponent((invMatch || portalMatch)![1]);
      const indexReq = new Request(new URL('/', request.url), request);
      const assetResponse = await env.ASSETS.fetch(indexReq);

      if (!assetResponse.ok) {
        return addSecurityHeaders(assetResponse, false, siteUrl);
      }

      const meta = await fetchInvitationMeta(slug, siteUrl, isPortal, projectId, databaseId);
      if (!meta) {
        return addSecurityHeaders(assetResponse, false, siteUrl);
      }

      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(meta.title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', meta.description); } })
        .on('meta[property="og:title"]', { element(el) { el.setAttribute('content', meta.title); } })
        .on('meta[property="og:description"]', { element(el) { el.setAttribute('content', meta.description); } })
        .on('meta[property="og:image"]', { element(el) { el.setAttribute('content', meta.coverImage); } })
        .on('meta[property="og:url"]', { element(el) { el.setAttribute('content', meta.url); } })
        .on('meta[name="twitter:title"]', { element(el) { el.setAttribute('content', meta.title); } })
        .on('meta[name="twitter:description"]', { element(el) { el.setAttribute('content', meta.description); } })
        .on('meta[name="twitter:image"]', { element(el) { el.setAttribute('content', meta.coverImage); } })
        .transform(assetResponse);

      return addSecurityHeaders(transformed, false, siteUrl);
    }

    // 3. Static asset or standard SPA page fetch
    let response = await env.ASSETS.fetch(request);
    if (!response.ok && !isStaticAsset) {
      const indexReq = new Request(new URL('/', request.url), request);
      response = await env.ASSETS.fetch(indexReq);
    }
    
    return addSecurityHeaders(response, isStaticAsset, siteUrl);
  },
};
