/**
 * Cloudflare Worker for FRIDA / فريدا
 * - Edge SSR HTMLRewriter for dynamic OpenGraph & Twitter tags on /i/:slug
 * - Cloudflare R2 Asset Delivery (/r2/*) with HTTP Range requests (206 Partial Content) & Audio Streaming
 * - Cloudflare R2 Upload & Management API (/api/r2/upload, /api/r2/delete)
 * - Named Firestore DB resolution via /slugs/{slug} -> /invitations/{id}
 * - Clean redirects from legacy ?invitation= & ?portal= query params
 * - Enterprise Security Headers & Strict Content-Security-Policy (CSP)
 * - High-performance browser & CDN caching
 */

interface R2Bucket {
  get(key: string, options?: { range?: Headers | string | { offset?: number; length?: number } }): Promise<R2ObjectBody | null>;
  head(key: string): Promise<R2Object | null>;
  put(key: string, value: ReadableStream | ArrayBuffer | string | Blob, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<R2Object>;
  delete(keys: string | string[]): Promise<void>;
}

interface R2Object {
  key: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  httpMetadata?: {
    contentType?: string;
    cacheControl?: string;
  };
}

interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json<T>(): Promise<T>;
}

interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
  FRIDA_ASSETS?: R2Bucket;
  SITE_URL?: string;
  BRAND_NAME?: string;
  BRAND_NAME_AR?: string;
  R2_UPLOAD_SECRET?: string;
}

const FIREBASE_PROJECT_ID = 'gen-lang-client-0740490915';
const FIRESTORE_DATABASE_ID = '(default)';
const DEFAULT_SITE_URL = 'https://farid.invitationes.workers.dev';

interface InvitationMeta {
  title: string;
  description: string;
  coverImage: string;
  url: string;
}

const MIME_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  webp: 'image/webp',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  json: 'application/json',
  woff2: 'font/woff2',
  woff: 'font/woff',
  ttf: 'font/ttf',
};

function getMimeType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  return MIME_TYPES[ext] || 'application/octet-stream';
}

const SECURITY_HEADERS: Record<string, string> = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://www.gstatic.com https://www.recaptcha.net https://recaptchaenterprise.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://*.googleusercontent.com https://images.unsplash.com https://www.facebook.com https://www.google-analytics.com https://farid.invitationes.workers.dev",
    "media-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://farid.invitationes.workers.dev",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.cloudfunctions.net https://*.firebaseapp.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://firebasestorage.googleapis.com https://recaptchaenterprise.googleapis.com wss://*.firebaseio.com https://www.google-analytics.com https://analytics.google.com https://www.facebook.com https://graph.facebook.com",
    "frame-src 'self' https://*.firebaseapp.com https://*.google.com https://www.google.com/recaptcha/ https://recaptchaenterprise.googleapis.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
};

function addSecurityHeaders(res: Response, isStaticAsset: boolean): Response {
  const newHeaders = new Headers(res.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
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
 * Handles R2 Asset Serving with Streaming, Range Requests (206 Partial Content),
 * and Caching (ETag & Cache-Control).
 */
async function handleR2AssetRequest(request: Request, env: Env): Promise<Response> {
  if (!env.FRIDA_ASSETS) {
    return new Response('R2 bucket binding (FRIDA_ASSETS) not configured', { status: 503 });
  }

  const url = new URL(request.url);
  // Extract key removing leading /r2/
  let key = decodeURIComponent(url.pathname.replace(/^\/r2\//, ''));

  // Normalize path and prevent directory traversal
  key = key.replace(/\\/g, '/').replace(/\/\.\.\//g, '/').replace(/^\/+/, '');
  if (!key || key.includes('..')) {
    return new Response('Invalid asset path', { status: 400 });
  }

  const rangeHeader = request.headers.get('range');
  const ifNoneMatch = request.headers.get('if-none-match');

  // Check metadata first
  const objectMeta = await env.FRIDA_ASSETS.head(key);
  if (!objectMeta) {
    return new Response('Asset not found in R2 storage', { status: 404 });
  }

  const etag = objectMeta.httpEtag || `"${objectMeta.etag}"`;
  const mimeType = objectMeta.httpMetadata?.contentType || getMimeType(key);

  // Conditional GET (304 Not Modified)
  if (ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (request.method === 'HEAD') {
    return new Response(null, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': objectMeta.size.toString(),
        ETag: etag,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Handle Range Requests for seekable Audio streaming
  if (rangeHeader) {
    const object = await env.FRIDA_ASSETS.get(key, { range: request.headers });
    if (!object) {
      return new Response('Asset not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', mimeType);
    headers.set('ETag', etag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Access-Control-Allow-Origin', '*');

    // If partial content was served
    if ('range' in object && object.range) {
      const { offset, length } = object.range as { offset: number; length: number };
      const end = offset + length - 1;
      headers.set('Content-Range', `bytes ${offset}-${end}/${objectMeta.size}`);
      headers.set('Content-Length', length.toString());

      return new Response(object.body, {
        status: 206,
        headers,
      });
    }

    headers.set('Content-Length', object.size.toString());
    return new Response(object.body, {
      status: 200,
      headers,
    });
  }

  // Standard full asset stream
  const object = await env.FRIDA_ASSETS.get(key);
  if (!object) {
    return new Response('Asset not found', { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Type', mimeType);
  headers.set('Content-Length', object.size.toString());
  headers.set('ETag', etag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Access-Control-Allow-Origin', '*');

  return new Response(object.body, {
    status: 200,
    headers,
  });
}

/**
 * Handles R2 Asset Upload API (/api/r2/upload)
 */
async function handleR2UploadApi(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!env.FRIDA_ASSETS) {
    return new Response(
      JSON.stringify({ error: 'R2 bucket (FRIDA_ASSETS) not bound in environment' }),
      { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let targetPath = request.headers.get('x-file-path') || '';
    let fileBlob: Blob | ArrayBuffer | null = null;
    let fileContentType = request.headers.get('x-content-type') || 'application/octet-stream';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const pathParam = formData.get('path') as string | null;

      if (!file) {
        return new Response(JSON.stringify({ error: 'Missing file in form data' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }

      fileBlob = file;
      fileContentType = file.type || getMimeType(file.name);
      targetPath = pathParam || `uploads/${Date.now()}_${file.name}`;
    } else {
      // Direct stream / binary
      fileBlob = await request.arrayBuffer();
      if (!targetPath) {
        targetPath = `uploads/${Date.now()}_asset`;
      }
    }

    // Sanitize path
    targetPath = targetPath.replace(/\\/g, '/').replace(/\/\.\.\//g, '/').replace(/^\/+/, '');
    if (!targetPath || targetPath.includes('..')) {
      return new Response(JSON.stringify({ error: 'Invalid path' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const r2Obj = await env.FRIDA_ASSETS.put(targetPath, fileBlob, {
      httpMetadata: {
        contentType: fileContentType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    const publicUrl = `/r2/${targetPath}`;
    return new Response(
      JSON.stringify({
        success: true,
        key: targetPath,
        url: publicUrl,
        size: r2Obj.size,
        etag: r2Obj.etag,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Failed to upload to R2' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

/**
 * Handles R2 Asset Delete API (/api/r2/delete)
 */
async function handleR2DeleteApi(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST' && request.method !== 'DELETE') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  if (!env.FRIDA_ASSETS) {
    return new Response(
      JSON.stringify({ error: 'R2 bucket (FRIDA_ASSETS) not bound' }),
      { status: 503, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { key?: string; keys?: string[] };
    const key = body.key;
    const keys = body.keys || (key ? [key] : []);

    if (keys.length === 0) {
      return new Response(JSON.stringify({ error: 'No keys provided to delete' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Clean keys
    const cleanKeys = keys
      .map((k) => k.replace(/^\/r2\//, '').replace(/^\/+/, ''))
      .filter((k) => !k.includes('..'));

    await env.FRIDA_ASSETS.delete(cleanKeys);

    return new Response(JSON.stringify({ success: true, deletedKeys: cleanKeys }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || 'Failed to delete from R2' }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

/**
 * Resolves metadata using Firestore REST with named database ID:
 * 1. Checks /slugs/{slug} document
 * 2. Fetches /invitations/{invitationId}
 * 3. Fallback: direct /invitations/{slug}
 */
async function fetchInvitationMeta(slugOrId: string, siteUrl: string): Promise<InvitationMeta | null> {
  const cleanSlug = slugOrId.toLowerCase().trim();
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents`;

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
    console.error('Worker Firestore fetch error:', err);
  }

  return null;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const siteUrl = env.SITE_URL || DEFAULT_SITE_URL;

    // Handle CORS preflight for APIs
    if (request.method === 'OPTIONS' && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/r2/'))) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Range, X-File-Path, X-Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // 1. R2 Direct Storage Asset Route (/r2/*)
    if (url.pathname.startsWith('/r2/')) {
      const r2Response = await handleR2AssetRequest(request, env);
      return addSecurityHeaders(r2Response, true);
    }

    // 2. R2 Upload API Route (/api/r2/upload)
    if (url.pathname === '/api/r2/upload') {
      return handleR2UploadApi(request, env);
    }

    // 3. R2 Delete API Route (/api/r2/delete)
    if (url.pathname === '/api/r2/delete') {
      return handleR2DeleteApi(request, env);
    }

    // 4. Legacy Query Redirects (301 Permanent)
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

    // 5. OpenGraph / Twitter Edge SSR for /i/:slug
    const invMatch = url.pathname.match(/^\/i\/([^\/]+)$/);
    if (invMatch) {
      const slug = decodeURIComponent(invMatch[1]);
      const indexReq = new Request(new URL('/', request.url), request);
      const assetResponse = await env.ASSETS.fetch(indexReq);

      if (!assetResponse.ok) {
        return addSecurityHeaders(assetResponse, false);
      }

      const meta = await fetchInvitationMeta(slug, siteUrl);
      if (!meta) {
        return addSecurityHeaders(assetResponse, false);
      }

      const transformed = new HTMLRewriter()
        .on('title', {
          element(el) {
            el.setInnerContent(meta.title);
          },
        })
        .on('meta[name="description"]', {
          element(el) {
            el.setAttribute('content', meta.description);
          },
        })
        .on('meta[property="og:title"]', {
          element(el) {
            el.setAttribute('content', meta.title);
          },
        })
        .on('meta[property="og:description"]', {
          element(el) {
            el.setAttribute('content', meta.description);
          },
        })
        .on('meta[property="og:image"]', {
          element(el) {
            el.setAttribute('content', meta.coverImage);
          },
        })
        .on('meta[property="og:url"]', {
          element(el) {
            el.setAttribute('content', meta.url);
          },
        })
        .on('meta[name="twitter:title"]', {
          element(el) {
            el.setAttribute('content', meta.title);
          },
        })
        .on('meta[name="twitter:description"]', {
          element(el) {
            el.setAttribute('content', meta.description);
          },
        })
        .on('meta[name="twitter:image"]', {
          element(el) {
            el.setAttribute('content', meta.coverImage);
          },
        })
        .transform(assetResponse);

      return addSecurityHeaders(transformed, false);
    }

    // 6. Static asset or standard SPA page fetch
    let response = await env.ASSETS.fetch(request);
    if (!response.ok && !isStaticAsset) {
      const indexReq = new Request(new URL('/', request.url), request);
      response = await env.ASSETS.fetch(indexReq);
    }
    return addSecurityHeaders(response, isStaticAsset);
  },
};
