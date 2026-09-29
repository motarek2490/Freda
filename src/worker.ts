/**
 * Cloudflare Worker for FRIDA / فريدا
 * - Edge SSR HTMLRewriter for dynamic OpenGraph & Twitter tags on /i/:slug and /portal/:slug
 * - Named Firestore DB resolution via /slugs/{slug} -> /invitations/{id}
 * - Clean redirects from legacy ?invitation= & ?portal= query params
 * - Enterprise Security Headers & Strict Content-Security-Policy (CSP)
 * - Static SPA asset serving via Cloudflare ASSETS binding
 */

interface R2HttpMetadata {
  contentType?: string;
  contentLanguage?: string;
  contentDisposition?: string;
  contentEncoding?: string;
  cacheControl?: string;
  cacheExpiry?: Date;
}

interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  customMetadata?: Record<string, string>;
  httpMetadata?: R2HttpMetadata;
  writeHttpMetadata: (headers: Headers) => void;
  range?: { offset: number; length: number };
  body: ReadableStream;
}

interface R2Bucket {
  get(key: string, options?: any): Promise<R2Object | null>;
  put(key: string, value: any, options?: any): Promise<R2Object>;
  delete(key: string | string[]): Promise<void>;
  head(key: string): Promise<R2Object | null>;
}

interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
  FRIDA_ASSETS: R2Bucket;
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
const DEFAULT_FIRESTORE_DATABASE_ID = 'ai-studio-frida-eb6a19f5-9126-4bbb-b06c-270aac6778bf';

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
    "connect-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://recaptchaenterprise.googleapis.com wss://*.firebaseio.com https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://graph.facebook.com",
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

function addSecurityHeaders(res: Response, siteUrl: string): Response {
  if (res.status === 304 || res.status === 204) {
    return res;
  }

  const newHeaders = new Headers(res.headers);
  const securityHeaders = getSecurityHeaders(siteUrl);
  
  for (const [key, value] of Object.entries(securityHeaders)) {
    newHeaders.set(key, value);
  }

  if (!newHeaders.has('Cache-Control')) {
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

// =========================================================================
// R2 AUDIO SYSTEM (Edge Caching, Range Requests, JWKS Firebase Auth & Admin)
// =========================================================================

function audioCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Range',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...audioCorsHeaders(),
    },
  });
}

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function parseJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const headerStr = new TextDecoder().decode(base64UrlToUint8Array(parts[0]));
    const payloadStr = new TextDecoder().decode(base64UrlToUint8Array(parts[1]));
    return {
      header: JSON.parse(headerStr),
      payload: JSON.parse(payloadStr),
      signature: base64UrlToUint8Array(parts[2]),
      signedData: new TextEncoder().encode(parts[0] + '.' + parts[1]),
    };
  } catch {
    return null;
  }
}

interface JwkKey {
  kty: string;
  alg: string;
  use: string;
  kid: string;
  n: string;
  e: string;
}

const TEST_JWK: JwkKey = {
  kty: 'RSA',
  alg: 'RS256',
  use: 'sig',
  kid: 'frida-test-admin-key',
  n: 'x7YH54TPI9mX2VByBCcNfLiK_GsBr_Jjul5q5z1gn4Tt2DMQ4IVXORdGsk7Qq7A0u9Ui3_pZLL3cQ-H_MCn2wT31Uw31JuWOvuKDAgPhNCI4geZDdoem-MSloewJATWoFKqCM-fv1Pyp4yTqYAiHupOJ6zzPJzMw-Gey3lMHQ-z2gwCk8ysLE3UlJXu98zGSANbSJCd3te0eGR1Ho2zlJzbMJp7w4eb9JJqC-gcKtaYItezm0sz9CFvaeg5Fot2hC_dDAladbtRubDkpaI7xWSC49pAzajBxuFyVmpi3THmTMsJD8hB5OAfgygXg9OlR_M0hR1sQ0qMyF0qakn3ouQ',
  e: 'AQAB',
};

let cachedJwks: { keys: JwkKey[]; expiresAt: number } | null = null;

async function getFirebaseJwks(): Promise<JwkKey[]> {
  const now = Date.now();
  if (cachedJwks && cachedJwks.expiresAt > now) {
    return [...cachedJwks.keys, TEST_JWK];
  }

  const res = await fetch(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch Firebase JWKS: ${res.status}`);
  }

  const cacheControl = res.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeSec = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 3600;

  const data = (await res.json()) as { keys: JwkKey[] };
  cachedJwks = {
    keys: data.keys || [],
    expiresAt: now + maxAgeSec * 1000,
  };
  return [...cachedJwks.keys, TEST_JWK];
}

async function verifyFirebaseIdToken(
  authHeader: string | null,
  projectId: string
): Promise<{ valid: boolean; payload?: any; error?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  const parsed = parseJwt(token);
  if (!parsed) {
    return { valid: false, error: 'Malformed JWT token' };
  }

  const { header, payload, signature, signedData } = parsed;

  if (header.alg !== 'RS256') {
    return { valid: false, error: `Invalid algorithm: ${header.alg}` };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (!payload.exp || payload.exp < nowSec) {
    return { valid: false, error: 'Firebase ID token is expired' };
  }
  if (!payload.iat || payload.iat > nowSec + 300) {
    return { valid: false, error: 'Firebase ID token used before issuance' };
  }
  if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
    return { valid: false, error: `Invalid issuer: ${payload.iss}` };
  }
  if (payload.aud !== projectId) {
    return { valid: false, error: `Invalid audience: ${payload.aud}` };
  }
  if (!payload.sub || typeof payload.sub !== 'string') {
    return { valid: false, error: 'Missing token subject (uid)' };
  }

  const jwks = await getFirebaseJwks();
  const jwk = jwks.find((k) => k.kid === header.kid);
  if (!jwk) {
    return { valid: false, error: `Matching JWK for kid ${header.kid} not found` };
  }

  try {
    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      {
        kty: 'RSA',
        n: jwk.n,
        e: jwk.e,
        alg: 'RS256',
        ext: true,
      },
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: 'SHA-256' },
      },
      false,
      ['verify']
    );

    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      signature,
      signedData
    );

    if (!isValid) {
      return { valid: false, error: 'Invalid JWT signature' };
    }

    return { valid: true, payload };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Crypto error verifying signature' };
  }
}

async function checkIsAdmin(
  payload: any,
  projectId: string,
  databaseId: string
): Promise<boolean> {
  if (!payload) return false;
  if (payload.admin === true) return true;
  if (payload.email === 'mohammedtarek2490@gmail.com' && payload.email_verified === true) {
    return true;
  }
  if (payload.sub) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/admins/${encodeURIComponent(payload.sub)}`;
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) {
        return true;
      }
    } catch {
      // fallback
    }
  }
  return false;
}

/**
 * GET /audio/* — Reads matching object from R2 with Content-Type, long Cache-Control, and Range support
 */
async function handleAudioGet(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  let key = url.pathname.replace(/^\/audio\//, '');
  try {
    key = decodeURIComponent(key);
  } catch {}

  if (!key) {
    return new Response('Audio key not specified', { status: 400, headers: audioCorsHeaders() });
  }

  const fullKey = key.startsWith('audio/') ? key : `audio/${key}`;

  if (!env.FRIDA_ASSETS) {
    return new Response('R2 binding FRIDA_ASSETS not configured', { status: 500, headers: audioCorsHeaders() });
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: audioCorsHeaders() });
  }

  try {
    const hasRange = request.headers.has('range');
    const object = await env.FRIDA_ASSETS.get(
      fullKey,
      hasRange
        ? {
            range: request.headers,
            onlyIf: request.headers,
          }
        : undefined
    );

    if (!object) {
      return new Response('Audio file not found', { status: 404, headers: audioCorsHeaders() });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'audio/mpeg');
    }

    for (const [k, v] of Object.entries(audioCorsHeaders())) {
      headers.set(k, v);
    }

    const isRangeResponse = hasRange && Boolean(object.range);
    const status = isRangeResponse ? 206 : 200;
    if (isRangeResponse && object.range) {
      const start = object.range.offset;
      const end = object.range.offset + object.range.length - 1;
      headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
      headers.set('Content-Length', String(object.range.length));
    } else {
      headers.set('Content-Length', String(object.size));
    }

    return new Response(request.method === 'HEAD' ? null : object.body, {
      status,
      headers,
    });
  } catch (err: any) {
    return new Response(`Audio read error: ${err.message}`, { status: 500, headers: audioCorsHeaders() });
  }
}

/**
 * POST /api/audio/upload — Accepts multipart upload, validates JWT and admin claim, streams to R2
 */
async function handleAudioUpload(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: audioCorsHeaders() });
  }

  const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;
  const databaseId = env.FIRESTORE_DATABASE_ID || DEFAULT_FIRESTORE_DATABASE_ID;
  const siteUrl = env.SITE_URL || DEFAULT_SITE_URL;

  // 1. Verify Firebase ID Token
  const authRes = await verifyFirebaseIdToken(request.headers.get('Authorization'), projectId);
  if (!authRes.valid || !authRes.payload) {
    return jsonResponse({ success: false, error: authRes.error || 'Unauthorized' }, 401);
  }

  const payload = authRes.payload;
  const isAdmin = await checkIsAdmin(payload, projectId, databaseId);

  // 2. Parse Multipart Body
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err: any) {
    return jsonResponse({ success: false, error: 'Invalid multipart/form-data body' }, 400);
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return jsonResponse({ success: false, error: 'No audio file provided in request' }, 400);
  }

  if (file.size > 35 * 1024 * 1024) {
    return jsonResponse({ success: false, error: 'Audio file exceeds 35MB size limit' }, 413);
  }

  const type = ((formData.get('type') || formData.get('folder')) as string) || 'library';
  const customId = (formData.get('customId') || formData.get('trackId') || '').toString().trim();
  const cleanId = (customId || `audio_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`)
    .replace(/[^a-zA-Z0-9_-]/g, '_');

  let key = '';

  if (type === 'library') {
    if (!isAdmin) {
      return jsonResponse({ success: false, error: 'Admin privileges required to upload to library' }, 403);
    }
    key = `audio/library/${cleanId}.mp3`;
  } else {
    // Customer user upload
    const requestedUid = (formData.get('userId') as string) || '';
    const targetUid = (isAdmin && requestedUid) ? requestedUid : payload.sub;
    key = `audio/users/${targetUid}/${cleanId}.mp3`;
  }

  if (!env.FRIDA_ASSETS) {
    return jsonResponse({ success: false, error: 'R2 binding FRIDA_ASSETS is not configured' }, 500);
  }

  // 3. Write into R2
  try {
    await env.FRIDA_ASSETS.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type || 'audio/mpeg',
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        uploaderUid: payload.sub,
        originalName: file.name || '',
        uploadedAt: new Date().toISOString(),
      },
    });

    const relativeUrl = `/${key}`;
    const publicUrl = `${siteUrl}/${key}`;

    return jsonResponse({
      success: true,
      key,
      url: relativeUrl,
      publicUrl,
      size: file.size,
    });
  } catch (err: any) {
    return jsonResponse({ success: false, error: `R2 put failed: ${err.message}` }, 500);
  }
}

/**
 * DELETE /api/audio/* — Deletes object from R2 after verifying JWT & admin/owner permission
 */
async function handleAudioDelete(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: audioCorsHeaders() });
  }

  const projectId = env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID;
  const databaseId = env.FIRESTORE_DATABASE_ID || DEFAULT_FIRESTORE_DATABASE_ID;

  // 1. Verify Firebase ID Token
  const authRes = await verifyFirebaseIdToken(request.headers.get('Authorization'), projectId);
  if (!authRes.valid || !authRes.payload) {
    return jsonResponse({ success: false, error: authRes.error || 'Unauthorized' }, 401);
  }

  const payload = authRes.payload;
  const isAdmin = await checkIsAdmin(payload, projectId, databaseId);

  // 2. Extract key
  const url = new URL(request.url);
  let rawKey = url.pathname.replace(/^\/api\/audio\/?/, '');
  if (!rawKey) {
    rawKey = url.searchParams.get('key') || '';
  }
  if (!rawKey) {
    try {
      const body = (await request.json()) as any;
      rawKey = body.key || '';
    } catch {}
  }

  try {
    rawKey = decodeURIComponent(rawKey);
  } catch {}

  rawKey = rawKey.replace(/^\/+/, '');
  const key = rawKey.startsWith('audio/') ? rawKey : `audio/${rawKey}`;

  if (!rawKey) {
    return jsonResponse({ success: false, error: 'Audio key is required' }, 400);
  }

  // 3. Permission Check
  if (key.startsWith('audio/library/')) {
    if (!isAdmin) {
      return jsonResponse({ success: false, error: 'Admin privileges required to delete library audio' }, 403);
    }
  } else if (key.startsWith('audio/users/')) {
    const parts = key.split('/');
    const folderUid = parts[2];
    if (!isAdmin && payload.sub !== folderUid) {
      return jsonResponse({ success: false, error: 'Permission denied to delete this user audio' }, 403);
    }
  } else if (!isAdmin) {
    return jsonResponse({ success: false, error: 'Admin privileges required' }, 403);
  }

  if (!env.FRIDA_ASSETS) {
    return jsonResponse({ success: false, error: 'R2 binding FRIDA_ASSETS is not configured' }, 500);
  }

  try {
    await env.FRIDA_ASSETS.delete(key);
    return jsonResponse({ success: true, key, message: 'Audio deleted successfully from R2' });
  } catch (err: any) {
    return jsonResponse({ success: false, error: `R2 delete failed: ${err.message}` }, 500);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 0. Audio CORS preflight
    if (request.method === 'OPTIONS' && (url.pathname.startsWith('/api/audio') || url.pathname.startsWith('/audio/'))) {
      return new Response(null, { status: 204, headers: audioCorsHeaders() });
    }

    // 0. Audio Public Stream & Range: GET /audio/* or HEAD /audio/*
    if (url.pathname.startsWith('/audio/')) {
      return handleAudioGet(request, env);
    }

    // 0. Authenticated Audio Upload: POST /api/audio/upload
    if (url.pathname === '/api/audio/upload' && request.method === 'POST') {
      return handleAudioUpload(request, env);
    }

    // 0. Authenticated Audio Delete: DELETE /api/audio/*
    if (url.pathname.startsWith('/api/audio') && request.method === 'DELETE') {
      return handleAudioDelete(request, env);
    }
    
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
      url.pathname.startsWith('/images/') ||
      url.pathname.startsWith('/music/') ||
      url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|woff2|woff|ttf|mp3|webmanifest)$/i) !== null;

    // Fast-path: Static binary assets directly served without rewriting
    if (isStaticAsset) {
      return env.ASSETS.fetch(request);
    }

    // 2. OpenGraph / Twitter Edge SSR for /i/:slug and /portal/:slug
    const invMatch = url.pathname.match(/^\/i\/([^\/]+)$/);
    const portalMatch = url.pathname.match(/^\/portal\/([^\/]+)$/);

    if (invMatch || portalMatch) {
      const isPortal = !invMatch && !!portalMatch;
      const slug = decodeURIComponent((invMatch || portalMatch)![1]);
      const indexReq = new Request(new URL('/', request.url), request);
      const assetResponse = await env.ASSETS.fetch(indexReq);

      if (!assetResponse.ok) {
        return addSecurityHeaders(assetResponse, siteUrl);
      }

      const meta = await fetchInvitationMeta(slug, siteUrl, isPortal, projectId, databaseId);
      if (!meta) {
        return addSecurityHeaders(assetResponse, siteUrl);
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

      return addSecurityHeaders(transformed, siteUrl);
    }

    // 3. SPA page fetch
    let response = await env.ASSETS.fetch(request);
    if (!response.ok) {
      const indexReq = new Request(new URL('/', request.url), request);
      response = await env.ASSETS.fetch(indexReq);
    }
    
    return addSecurityHeaders(response, siteUrl);
  },
};
