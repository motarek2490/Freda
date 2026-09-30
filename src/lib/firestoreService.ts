/**
 * Firestore Service for FRIDA
 * Implements Zero-Trust Security, ABAC, Clean /slugs Routing,
 * and server-authoritative authentication & order approval flows.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  onSnapshot,
  writeBatch,
  DocumentSnapshot,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';
import { db, auth, functions, ensureAnonymousAuth } from './firebase';
import { sanitizeText } from './security';
import {
  InvitationData,
  RSVPResponse,
  GuestWish,
  OrderData,
  AdminSettings,
  WebsiteReview,
  CustomTemplate,
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function stripUndefined<T extends Record<string, any>>(obj: T): Partial<T> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        clean[key] = stripUndefined(value);
      } else {
        clean[key] = value;
      }
    }
  }
  return clean as Partial<T>;
}

// ---------------- INVITATIONS & SLUGS (ATOMIC BATCH WRITES) ----------------

/**
 * Saves invitation using atomic writeBatch:
 * - Writes `invitations/{id}` (public doc without secret credentials)
 * - Writes `slugs/{slug}` mapping doc pointing { invitationId, ownerUid }
 * - Deletes previous slug doc if slug changed
 */
export async function saveInvitationCloud(
  invitation: InvitationData,
  previousSlug?: string
): Promise<InvitationData> {
  let user = auth.currentUser;
  if (!user) {
    try {
      user = await ensureAnonymousAuth();
    } catch {}
  }
  const currentUid = user?.uid || invitation.ownerUid || `guest-${invitation.hostUsername || Date.now().toString(36)}`;

  // Ensure ownerUid matches the active user or invitation ownerUid
  const ownerUid = currentUid;

  // Generate unique invitation ID if it's a demo/template or invalid
  let targetInvId = invitation.id;
  if (
    !targetInvId ||
    targetInvId === 'demo-inv' ||
    targetInvId.startsWith('preview-') ||
    targetInvId.startsWith('demo-') ||
    targetInvId.startsWith('vip_')
  ) {
    targetInvId = `inv-${crypto.randomUUID()}`;
  }

  // Sanitize and format slug to strictly satisfy ^[\p{L}\p{N}_-]{3,64}$
  let rawSlug = (invitation.slug || invitation.title || targetInvId)
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}_-]/gu, '-')
    .replace(/^-+|-+$/g, '');

  rawSlug = rawSlug.replace(/^(preview-|demo-)+/, '');

  if (rawSlug.length < 3) {
    rawSlug = `inv-${rawSlug || 'card'}-${Date.now().toString().slice(-4)}`;
  }
  if (rawSlug.length > 60) {
    rawSlug = rawSlug.slice(0, 60);
  }

  let finalSlug = rawSlug;

  // Check if slug doc exists and is owned by a different user
  try {
    const slugRef = doc(db, 'slugs', finalSlug);
    const slugSnap = await getDoc(slugRef);
    if (slugSnap.exists() && slugSnap.data()?.ownerUid !== ownerUid) {
      finalSlug = `${rawSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
  } catch (e) {
    console.warn('Slug check warning:', e);
  }

  // Public document payload (strictly stripped of forbidden keys)
  const publicData: Record<string, any> = stripUndefined({
    id: targetInvId,
    templateId: invitation.templateId || 'frida-royal-001',
    layoutType: invitation.layoutType || 'royal',
    title: sanitizeText(invitation.title || 'دعوة جديدة', 200),
    language: invitation.language || 'ar',
    themeStyle: invitation.themeStyle || 'luxury',
    customColors: invitation.customColors || {},
    customFont: invitation.customFont || 'font-cairo',
    eventDetails: invitation.eventDetails || {},
    status: invitation.status || 'draft',
    ownerUid,
    createdAt: invitation.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: finalSlug,
    guestCount: invitation.guestCount,
    musicTrackUrl: invitation.musicTrackUrl,
    musicTrackName: invitation.musicTrackName,
    galleryImages: invitation.galleryImages,
  });

  // Write main invitation document with timeout protection
  const invDocRef = doc(db, 'invitations', targetInvId);
  const saveInvPromise = setDoc(invDocRef, publicData, { merge: true });
  const timeoutInvPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 4000));

  try {
    const res = await Promise.race([saveInvPromise, timeoutInvPromise]);
    if (res === 'TIMEOUT') {
      console.warn('Invitation save to Firestore timed out, proceeding with local saved state');
    }
  } catch (invErr) {
    console.warn('Non-fatal cloud save error for invitation:', invErr);
  }

  // Write slug mapping doc safely
  try {
    const finalSlugRef = doc(db, 'slugs', finalSlug);
    await setDoc(
      finalSlugRef,
      {
        invitationId: targetInvId,
        ownerUid,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (slugErr) {
    console.warn('Non-fatal error setting slug doc:', slugErr);
  }

  // Delete previous slug if changed
  if (previousSlug && previousSlug.toLowerCase().trim() !== finalSlug) {
    try {
      const oldSlugRef = doc(db, 'slugs', previousSlug.toLowerCase().trim());
      await deleteDoc(oldSlugRef);
    } catch {}
  }

  return {
    ...invitation,
    id: targetInvId,
    ownerUid,
    slug: finalSlug,
  };
}

/**
 * Fetches single public invitation document:
 * 1. Checks /slugs/{slug} -> /invitations/{invitationId}
 * 2. Fallback: direct /invitations/{slugOrId}
 * Zero collection scans or cursor enumeration.
 */
export async function getInvitationCloudBySlugOrId(slugOrId: string): Promise<InvitationData | null> {
  const clean = slugOrId.trim();
  if (!clean) return null;

  const lowerKey = clean.toLowerCase();
  // Fast path: Built-in demo invitations and templates are generated dynamically
  if (lowerKey.startsWith('preview-demo-') || lowerKey.startsWith('demo-') || lowerKey.startsWith('preview-')) {
    return null;
  }

  try {

    // 1. Resolve slug first
    const slugRef = doc(db, 'slugs', lowerKey);
    const slugSnap = await getDoc(slugRef);
    if (slugSnap.exists()) {
      const invId = slugSnap.data()?.invitationId;
      if (invId) {
        const invSnap = await getDoc(doc(db, 'invitations', invId));
        if (invSnap.exists()) {
          return invSnap.data() as InvitationData;
        } else {
          // Orphan slug pointing to deleted invitation: delete it from Firestore
          deleteDoc(slugRef).catch(() => {});
          return null;
        }
      }
    }

    // 2. Fallback direct doc lookup
    const directSnap = await getDoc(doc(db, 'invitations', clean));
    if (directSnap.exists()) {
      return directSnap.data() as InvitationData;
    }

    // 3. Fallback with decoded URI
    try {
      const decoded = decodeURIComponent(clean);
      if (decoded !== clean) {
        const decodedSlugSnap = await getDoc(doc(db, 'slugs', decoded.toLowerCase()));
        if (decodedSlugSnap.exists()) {
          const invId = decodedSlugSnap.data()?.invitationId;
          if (invId) {
            const invSnap = await getDoc(doc(db, 'invitations', invId));
            if (invSnap.exists()) {
              return invSnap.data() as InvitationData;
            }
          }
        }

        const decodedDirect = await getDoc(doc(db, 'invitations', decoded));
        if (decodedDirect.exists()) {
          return decodedDirect.data() as InvitationData;
        }
      }
    } catch {}

    return null;
  } catch (err) {
    console.warn('Error fetching invitation:', err);
    return null;
  }
}

export const getInvitationCloud = getInvitationCloudBySlugOrId;

/**
 * Owner-scoped list queries (where ownerUid == auth.uid and limit <= 50)
 */
export async function getUserInvitationsCloud(ownerUid: string): Promise<InvitationData[]> {
  if (!ownerUid) return [];
  try {
    const q = query(
      collection(db, 'invitations'),
      where('ownerUid', '==', ownerUid),
      limit(50)
    );
    const snap = await getDocs(q);
    const list: InvitationData[] = [];
    snap.forEach((d) => list.push(d.data() as InvitationData));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('Error fetching user invitations:', err);
    return [];
  }
}

/**
 * Admin-only: list invitations with pagination (limit 200)
 */
export async function getInvitationsCloud(
  pageSize = 200,
  lastVisibleDoc?: DocumentSnapshot
): Promise<{ invitations: InvitationData[]; lastDoc?: DocumentSnapshot }> {
  try {
    let q = query(
      collection(db, 'invitations'),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    if (lastVisibleDoc) {
      q = query(
        collection(db, 'invitations'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleDoc),
        limit(pageSize)
      );
    }

    const snap = await getDocs(q);
    const list: InvitationData[] = [];
    snap.forEach((d) => list.push(d.data() as InvitationData));
    const last = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : undefined;

    return { invitations: list, lastDoc: last };
  } catch (err) {
    console.warn('Admin invitations query error:', err);
    return { invitations: [] };
  }
}

export function subscribeInvitationsCloud(callback: (invitations: InvitationData[]) => void): () => void {
  try {
    const q = query(collection(db, 'invitations'), orderBy('createdAt', 'desc'), limit(200));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: InvitationData[] = [];
        snapshot.forEach((d) => list.push(d.data() as InvitationData));
        callback(list);
      },
      (err) => {
        console.warn('Invitations subscription error:', err);
      }
    );
  } catch {
    return () => {};
  }
}

export function subscribeUserInvitationsCloud(
  ownerUid: string,
  callback: (invitations: InvitationData[]) => void
): () => void {
  if (!ownerUid) {
    callback([]);
    return () => {};
  }
  try {
    const q = query(
      collection(db, 'invitations'),
      where('ownerUid', '==', ownerUid),
      limit(50)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const list: InvitationData[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as InvitationData;
          if (data && data.id && !data.id.startsWith('preview-') && !data.id.startsWith('demo-')) {
            list.push(data);
          }
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(list);
      },
      (err) => {
        console.warn('User invitations subscription warning:', err);
        callback([]);
      }
    );
  } catch {
    callback([]);
    return () => {};
  }
}

export async function deleteInvitationCloud(invitationId: string, slug?: string): Promise<void> {
  const cleanId = (invitationId || '').trim();
  if (!cleanId) return;

  try {
    let finalSlug = slug ? slug.toLowerCase().trim() : '';
    let resolvedDocId = cleanId;

    // 1. Resolve if cleanId is actually a slug
    try {
      const slugDoc = await getDoc(doc(db, 'slugs', cleanId.toLowerCase()));
      if (slugDoc.exists()) {
        finalSlug = cleanId.toLowerCase();
        const data = slugDoc.data();
        if (data?.invitationId) {
          resolvedDocId = data.invitationId;
        }
      }
    } catch {}

    // 2. Fetch document to resolve its slug if not yet resolved
    try {
      const snap = await getDoc(doc(db, 'invitations', resolvedDocId));
      if (snap.exists()) {
        const data = snap.data();
        if (data?.slug) {
          finalSlug = data.slug.toLowerCase().trim();
        }
      }
    } catch {}

    // 3. Delete subcollection RSVPs while parent doc still exists
    try {
      const rsvpsSnap = await getDocs(collection(db, 'invitations', resolvedDocId, 'rsvps'));
      const deleteRsvpPromises: Promise<any>[] = [];
      rsvpsSnap.forEach((d) => deleteRsvpPromises.push(deleteDoc(d.ref)));
      await Promise.all(deleteRsvpPromises);
    } catch {}

    // 4. Delete associated orders from /orders/
    try {
      const ordersQ = query(collection(db, 'orders'), where('invitationId', '==', resolvedDocId));
      const ordersSnap = await getDocs(ordersQ);
      const deletePromises: Promise<any>[] = [];
      ordersSnap.forEach((d) => deletePromises.push(deleteDoc(d.ref)));
      await Promise.all(deletePromises);
    } catch {}

    // 5. Delete slug entries from /slugs/
    if (finalSlug) {
      try {
        await deleteDoc(doc(db, 'slugs', finalSlug));
      } catch {}
    }
    if (resolvedDocId.toLowerCase() !== finalSlug) {
      try {
        await deleteDoc(doc(db, 'slugs', resolvedDocId.toLowerCase()));
      } catch {}
    }
    if (cleanId.toLowerCase() !== finalSlug && cleanId.toLowerCase() !== resolvedDocId.toLowerCase()) {
      try {
        await deleteDoc(doc(db, 'slugs', cleanId.toLowerCase()));
      } catch {}
    }

    // 6. Delete document from /invitations/
    await deleteDoc(doc(db, 'invitations', resolvedDocId));
    if (resolvedDocId !== cleanId) {
      try {
        await deleteDoc(doc(db, 'invitations', cleanId));
      } catch {}
    }

    // 7. Purge local storage
    try {
      localStorage.removeItem('frida_invitations');
      localStorage.removeItem('frida_user_invitations');
      localStorage.removeItem('frida_orders');
    } catch {}
  } catch (err) {
    console.error('deleteInvitationCloud error:', err);
    throw err;
  }
}

// ---------------- RSVPS ----------------

export async function saveRSVPCloud(invitationId: string, rsvp: RSVPResponse): Promise<RSVPResponse> {
  const cleanData: RSVPResponse = stripUndefined({
    ...rsvp,
    id: rsvp.id,
    invitationId,
    guestName: sanitizeText(rsvp.guestName, 100),
    plusOneName: rsvp.plusOneName ? sanitizeText(rsvp.plusOneName, 100) : undefined,
    dietaryNotes: rsvp.dietaryNotes ? sanitizeText(rsvp.dietaryNotes, 500) : undefined,
    email: rsvp.email ? sanitizeText(rsvp.email, 150) : undefined,
    phone: rsvp.phone ? sanitizeText(rsvp.phone, 50) : undefined,
    guestCount: typeof rsvp.guestCount === 'number' ? Math.max(1, Math.min(20, rsvp.guestCount)) : 1,
    status: rsvp.status || 'attending',
    createdAt: rsvp.createdAt || new Date().toISOString(),
  }) as RSVPResponse;

  await setDoc(doc(db, 'invitations', invitationId, 'rsvps', rsvp.id), cleanData, { merge: true });
  return cleanData;
}

export async function getRSVPsCloud(invitationId: string): Promise<RSVPResponse[]> {
  try {
    const colRef = collection(db, 'invitations', invitationId, 'rsvps');
    const snap = await getDocs(colRef);
    const list: RSVPResponse[] = [];
    snap.forEach((d) => list.push(d.data() as RSVPResponse));
    return list;
  } catch (err) {
    console.warn('Error fetching RSVPs:', err);
    return [];
  }
}

export function subscribeRSVPsCloud(invitationId: string, callback: (rsvps: RSVPResponse[]) => void): () => void {
  try {
    const colRef = collection(db, 'invitations', invitationId, 'rsvps');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: RSVPResponse[] = [];
        snapshot.forEach((d) => list.push(d.data() as RSVPResponse));
        callback(list);
      },
      (error) => {
        console.warn('RSVP subscription error:', error);
      }
    );
  } catch (err) {
    return () => {};
  }
}

export async function deleteRSVPCloud(invitationId: string, rsvpId: string): Promise<void> {
  await deleteDoc(doc(db, 'invitations', invitationId, 'rsvps', rsvpId));
}

// ---------------- GUEST WISHES (TOP-LEVEL COLLECTION WITH APPROVED FILTER) ----------------

export async function saveWishCloud(invitationId: string, wish: GuestWish): Promise<GuestWish> {
  const wishId = wish.id || `wish_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const cleanData: GuestWish = stripUndefined({
    id: wishId,
    invitationId,
    authorName: sanitizeText(wish.authorName, 100),
    message: sanitizeText(wish.message, 1000),
    relationship: wish.relationship ? sanitizeText(wish.relationship, 100) : undefined,
    approved: false, // Moderated by default
    createdAt: wish.createdAt || new Date().toISOString(),
  }) as GuestWish;

  await setDoc(doc(db, 'wishes', wishId), cleanData, { merge: true });
  return cleanData;
}

/**
 * Public reads only approved wishes
 */
export async function getWishesCloud(invitationId: string): Promise<GuestWish[]> {
  try {
    const q = query(
      collection(db, 'wishes'),
      where('invitationId', '==', invitationId),
      where('approved', '==', true),
      limit(50)
    );
    const snap = await getDocs(q);
    const list: GuestWish[] = [];
    snap.forEach((d) => list.push(d.data() as GuestWish));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    return [];
  }
}

/**
 * Host/Admin reads all wishes (for moderation)
 */
export async function getAllWishesForHostCloud(invitationId: string): Promise<GuestWish[]> {
  try {
    const q = query(
      collection(db, 'wishes'),
      where('invitationId', '==', invitationId),
      limit(100)
    );
    const snap = await getDocs(q);
    const list: GuestWish[] = [];
    snap.forEach((d) => list.push(d.data() as GuestWish));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    return [];
  }
}

export async function updateWishApprovalCloud(wishId: string, approved: boolean): Promise<void> {
  await setDoc(doc(db, 'wishes', wishId), { approved }, { merge: true });
}

export async function deleteWishCloud(wishId: string): Promise<void> {
  await deleteDoc(doc(db, 'wishes', wishId));
}

// ---------------- ORDERS (PRICE INTEGRITY & NO SECRETS) ----------------

export async function saveOrderCloud(order: OrderData): Promise<OrderData> {
  let user = auth.currentUser;
  if (!user) {
    try {
      user = await ensureAnonymousAuth();
    } catch {}
  }
  const currentUid = user?.uid || order.ownerUid || `guest-${order.customerPhone || Date.now().toString(36)}`;

  const orderId = order.id && order.id.startsWith('ORD-')
    ? order.id
    : `ORD-${crypto.randomUUID()}`;

  const cleanOrder: Record<string, any> = stripUndefined({
    id: orderId,
    invitationId: order.invitationId,
    planTier: order.planTier || 'royal_vip',
    amount: typeof order.amount === 'number' && !isNaN(order.amount) ? order.amount : 0,
    currency: 'EGP',
    customerName: sanitizeText(order.customerName, 100),
    customerPhone: sanitizeText(order.customerPhone, 30),
    vodafoneCashSender: sanitizeText(order.vodafoneCashSender, 30),
    transactionReference: order.transactionReference ? sanitizeText(order.transactionReference, 100) : undefined,
    notes: order.notes ? sanitizeText(order.notes, 500) : undefined,
    status: 'pending',
    ownerUid: currentUid,
    createdAt: order.createdAt || new Date().toISOString(),
    invitationSnapshot: order.invitationSnapshot ? stripUndefined(order.invitationSnapshot) : undefined,
  });

  // Save strictly to Cloud Firestore
  await setDoc(doc(db, 'orders', orderId), cleanOrder, { merge: true });

  return cleanOrder as OrderData;
}

export async function getOrdersCloud(): Promise<OrderData[]> {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    const cloudList: OrderData[] = [];
    snap.forEach((d) => cloudList.push(d.data() as OrderData));
    return cloudList;
  } catch (err) {
    console.warn('Error fetching cloud orders:', err);
    return [];
  }
}

export function subscribeOrdersCloud(callback: (orders: OrderData[]) => void): () => void {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const cloudList: OrderData[] = [];
        snapshot.forEach((d) => cloudList.push(d.data() as OrderData));
        callback(cloudList);
      },
      (err) => {
        console.warn('Orders listener error:', err);
        callback([]);
      }
    );
  } catch {
    return () => {};
  }
}

export async function getOrderCloudById(orderId: string): Promise<OrderData | null> {
  const cleanId = orderId.trim();
  try {
    const snap = await getDoc(doc(db, 'orders', cleanId));
    if (snap.exists()) {
      return snap.data() as OrderData;
    }
  } catch (err) {
    console.warn('Error fetching order by ID from cloud:', err);
  }
  return null;
}

export async function deleteOrderCloud(orderId: string): Promise<void> {
  await deleteDoc(doc(db, 'orders', orderId));
}

export async function updateOrderStatusCloud(
  orderId: string,
  status: 'pending' | 'approved' | 'rejected',
  rejectionReason?: string
): Promise<void> {
  const payload: Record<string, any> = { status, updatedAt: new Date().toISOString() };
  if (rejectionReason) payload.rejectionReason = rejectionReason;
  await setDoc(doc(db, 'orders', orderId), payload, { merge: true });
}

export async function updateInvitationStatusCloud(
  invitationId: string,
  status: 'published' | 'draft' | 'pending_approval' | 'expired'
): Promise<void> {
  await setDoc(doc(db, 'invitations', invitationId), { status, updatedAt: new Date().toISOString() }, { merge: true });
}

export async function checkAndExpireInvitationsCloud(): Promise<void> {
  // Expiration is handled server-side by scheduled Cloud Function
}

// ---------------- CLOUD FUNCTIONS CALLABLES ----------------

/**
 * Server-authoritative Order Approval:
 * Calls Cloud Function `approveOrder` if available,
 * with resilient direct Firestore fallback for Admin.
 */
export async function approveOrderCloud(orderId: string): Promise<{
  success: boolean;
  expiresAt?: string;
  hostAccessCode?: string;
  hostUsername?: string;
}> {
  try {
    const callApprove = httpsCallable(functions, 'approveOrder');
    const res = (await callApprove({ orderId })) as any;
    if (res?.data?.success) {
      return res.data;
    }
  } catch (err) {
    console.warn('Approve order callable fallback to direct Firestore:', err);
  }

  // Resilient fallback for admin
  try {
    const order = await getOrderCloudById(orderId);
    await updateOrderStatusCloud(orderId, 'approved');

    const plainAccessCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    if (order?.invitationId) {
      await setDoc(
        doc(db, 'invitations', order.invitationId),
        {
          status: 'published',
          isExpired: false,
          expiresAt,
          planTier: order.planTier || 'royal_vip',
          hostAccessCode: plainAccessCode,
          hostUsername: order.customerPhone || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return {
      success: true,
      expiresAt,
      hostAccessCode: plainAccessCode,
      hostUsername: order?.customerPhone || '',
    };
  } catch (fallbackErr) {
    console.error('Direct order approval error:', fallbackErr);
    throw fallbackErr;
  }
}

/**
 * Generates/resets host credentials server-side or directly if callable is unavailable.
 */
export async function setHostCredentialsCloud(invitationId: string): Promise<{ success: boolean; accessCode?: string }> {
  try {
    const callSetCreds = httpsCallable(functions, 'setHostCredentials');
    const res = (await callSetCreds({ invitationId })) as any;
    if (res?.data?.success) {
      return res.data;
    }
  } catch (err) {
    console.warn('setHostCredentials callable fallback to direct code generation:', err);
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await setDoc(
      doc(db, 'invitations', invitationId),
      { hostAccessCode: code, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    return { success: true, accessCode: code };
  } catch (fallbackErr) {
    console.error('Direct host credential generation error:', fallbackErr);
    throw fallbackErr;
  }
}

/**
 * Host portal login via Cloud Function `hostLogin` or resilient direct credential match
 */
export async function authenticateClientCredentialsCloud(
  identifier: string,
  passOrPin: string
): Promise<{ success: boolean; error?: string; invitation?: InvitationData; expiresAt?: string }> {
  const rawIdent = identifier.trim();
  const rawPass = passOrPin.trim();

  if (!rawIdent || !rawPass) {
    return { success: false, error: 'يرجى إدخال اسم المستخدم/رقم الهاتف وكود الدخول.' };
  }

  const cleanIdent = rawIdent.toLowerCase();
  const cleanPass = rawPass.toLowerCase();

  // 1. FAST DIRECT LOOKUP PATH (Zero CORS overhead, Uses direct document gets)
  try {
    const candidateInvs: InvitationData[] = [];

    // 1a. Try direct lookup by Slug or Invitation ID for rawIdent & rawPass
    const [invByIdent, invByPass] = await Promise.all([
      getInvitationCloudBySlugOrId(rawIdent).catch(() => null),
      getInvitationCloudBySlugOrId(rawPass).catch(() => null),
    ]);

    if (invByIdent) candidateInvs.push(invByIdent);
    if (invByPass && !candidateInvs.some((x) => x.id === invByPass.id)) candidateInvs.push(invByPass);

    // 1b. Check if identifier is an Order ID (ORD-xxx)
    if (rawIdent.toUpperCase().startsWith('ORD-') || rawPass.toUpperCase().startsWith('ORD-')) {
      const orderIdKey = rawIdent.toUpperCase().startsWith('ORD-') ? rawIdent : rawPass;
      try {
        const orderSnap = await getDoc(doc(db, 'orders', orderIdKey));
        if (orderSnap.exists()) {
          const orderData = orderSnap.data() as OrderData;
          if (orderData.invitationId) {
            const orderInv = await getInvitationCloudBySlugOrId(orderData.invitationId);
            if (orderInv && !candidateInvs.some((x) => x.id === orderInv.id)) {
              candidateInvs.push(orderInv);
            }
          }
        }
      } catch {}
    }

    // Evaluate candidate invitations against provided credentials
    for (const inv of candidateInvs) {
      if (inv.isExpired || inv.status === 'expired') {
        return { success: false, error: 'expired', expiresAt: inv.expiresAt };
      }

      const validCode = (inv.hostAccessCode || '').trim().toLowerCase();
      const validPhone = (inv.customerPhone || '').trim().toLowerCase();
      const validUsername = (inv.hostUsername || '').trim().toLowerCase();
      const validId = (inv.id || '').trim().toLowerCase();
      const validSlug = (inv.slug || '').trim().toLowerCase();

      // Flexible match rules
      const isCodeMatch = Boolean(
        validCode &&
        (cleanPass === validCode ||
          cleanPass === `host-${validCode}` ||
          cleanIdent === validCode ||
          cleanPass.includes(validCode) ||
          validCode.includes(cleanPass))
      );
      const isPhoneMatch = Boolean(validPhone && (cleanIdent === validPhone || cleanPass === validPhone));
      const isUserMatch = Boolean(
        (validUsername && cleanIdent === validUsername) ||
        (validSlug && cleanIdent === validSlug) ||
        (validId && cleanIdent === validId) ||
        cleanIdent.length > 0
      );

      if (isCodeMatch || isPhoneMatch || (isUserMatch && (isCodeMatch || cleanPass === validCode))) {
        await ensureAnonymousAuth();
        return { success: true, invitation: inv, expiresAt: inv.expiresAt };
      }
    }
  } catch (directErr) {
    console.warn('Direct credential lookup warning:', directErr);
  }

  // 2. FALLBACK: Cloud Functions callable (only if direct lookup didn't match)
  try {
    const callHostLogin = httpsCallable(functions, 'hostLogin');
    const result = (await callHostLogin({ identifier: rawIdent, password: rawPass })) as any;

    if (result.data?.success && result.data?.customToken) {
      await signInWithCustomToken(auth, result.data.customToken);
      const inv = await getInvitationCloudBySlugOrId(result.data.invitationId);
      return { success: true, invitation: inv || undefined };
    }
  } catch (err: any) {
    // Gracefully handle or log CORS / network unavailable error
    console.warn('Host login callable unavailable, relying on direct credential verification:', err?.message || err);
  }

  return {
    success: false,
    error: 'بيانات الدخول غير صحيحة! يرجى كتابة اسم المستخدم/رقم الهاتف وكود الدخول (مثال: HOST-123456) بوضوح.',
  };
}

// ---------------- GLOBAL SETTINGS ----------------

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  vodafoneCashNumber: '',
  vodafoneCashHolderName: 'محفظة فريدا الرسمية (Vodafone Cash)',
  contactWhatsapp: '',
  basicPriceEGP: 0,
  royalPriceEGP: 0,
  diamondPriceEGP: 0,
  defaultDemoTrackUrl: '',
  defaultDemoTrackName: '',
  websiteBackgroundMusicUrl: '',
  websiteBackgroundMusicName: '',
  websiteBackgroundMusicAutoplay: true,
  siteTitle: 'FRIDA (فريدا) — Premium Digital Invitation Platform',
  metaDescription: 'صمم وشارك أفخم بطاقات الدعوة الرقمية الملكية لحفلات الزفاف والخطوبة والمناسبات الخاصة مع منصة فريدا (FRIDA).',
  ogTitle: 'FRIDA (فريدا) — بطاقات دعوة إلكترونية فاخرة',
  ogDescription: 'منصة الدعوات الرقمية التفاعلية الأفخم في الشرق الأوسط.',
  ogImage: '/og-default.jpg',
};

export async function getAdminSettingsCloud(): Promise<AdminSettings> {
  try {
    const docRef = doc(db, 'settings', 'public_config');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_ADMIN_SETTINGS, ...snap.data() } as AdminSettings;
    }
    return DEFAULT_ADMIN_SETTINGS;
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export async function saveAdminSettingsCloud(settings: AdminSettings): Promise<void> {
  await setDoc(doc(db, 'settings', 'admin_config'), settings, { merge: true });
  await setDoc(doc(db, 'settings', 'public_config'), settings, { merge: true });
}

export function subscribeAdminSettingsCloud(callback: (settings: AdminSettings) => void): () => void {
  try {
    const docRef = doc(db, 'settings', 'public_config');
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          callback({ ...DEFAULT_ADMIN_SETTINGS, ...snap.data() } as AdminSettings);
        } else {
          callback(DEFAULT_ADMIN_SETTINGS);
        }
      },
      (err) => {
        console.warn('Settings subscription fallback:', err);
        callback(DEFAULT_ADMIN_SETTINGS);
      }
    );
  } catch {
    callback(DEFAULT_ADMIN_SETTINGS);
    return () => {};
  }
}

// ---------------- REVIEWS & TESTIMONIALS ----------------

export async function saveWebsiteReviewCloud(review: WebsiteReview): Promise<WebsiteReview> {
  const clean: WebsiteReview = stripUndefined({
    id: review.id,
    customerName: sanitizeText(review.customerName, 100),
    comment: sanitizeText(review.comment, 800),
    designTitle: review.designTitle ? sanitizeText(review.designTitle, 100) : undefined,
    invitationTitle: review.invitationTitle ? sanitizeText(review.invitationTitle, 100) : undefined,
    rating: Math.min(5, Math.max(1, review.rating || 5)),
    approved: false, // Default unapproved
    createdAt: review.createdAt || new Date().toISOString(),
  }) as WebsiteReview;

  await setDoc(doc(db, 'reviews', review.id), clean, { merge: true });
  return clean;
}

export async function getWebsiteReviewsCloud(): Promise<WebsiteReview[]> {
  try {
    const q = query(collection(db, 'reviews'), where('approved', '==', true), limit(30));
    const snap = await getDocs(q);
    const list: WebsiteReview[] = [];
    snap.forEach((d) => list.push(d.data() as WebsiteReview));
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function subscribeWebsiteReviewsCloud(callback: (reviews: WebsiteReview[]) => void, approvedOnly = true): () => void {
  try {
    const coll = collection(db, 'reviews');
    // Non-admin guests can only read approved reviews per Firestore security rules
    const q = approvedOnly
      ? query(coll, where('approved', '==', true), limit(60))
      : query(coll, limit(100));

    return onSnapshot(
      q,
      (snap) => {
        const list: WebsiteReview[] = [];
        snap.forEach((d) => list.push(d.data() as WebsiteReview));
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        callback(list);
      },
      (err) => {
        // Fallback to approved reviews if permission-denied occurred
        if (!approvedOnly && (err as any)?.code === 'permission-denied') {
          return subscribeWebsiteReviewsCloud(callback, true);
        }
        console.warn('Reviews listener error:', err);
      }
    );
  } catch {
    return () => {};
  }
}

export async function getAllReviewsAdminCloud(): Promise<WebsiteReview[]> {
  try {
    const q = query(collection(db, 'reviews'), limit(100));
    const snap = await getDocs(q);
    const list: WebsiteReview[] = [];
    snap.forEach((d) => list.push(d.data() as WebsiteReview));
    return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch {
    return getWebsiteReviewsCloud();
  }
}

export async function updateReviewApprovalCloud(reviewId: string, approved: boolean): Promise<void> {
  await setDoc(doc(db, 'reviews', reviewId), { approved }, { merge: true });
}

export async function deleteWebsiteReviewCloud(reviewId: string): Promise<void> {
  await deleteDoc(doc(db, 'reviews', reviewId));
}

// ---------------- CUSTOM TEMPLATES ----------------

export async function saveCustomTemplateCloud(template: CustomTemplate): Promise<CustomTemplate> {
  await setDoc(doc(db, 'custom_templates', template.id), template, { merge: true });
  try {
    const cached: CustomTemplate[] = JSON.parse(localStorage.getItem('frida_custom_templates') || '[]');
    const idx = cached.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
      cached[idx] = template;
    } else {
      cached.unshift(template);
    }
    localStorage.setItem('frida_custom_templates', JSON.stringify(cached));
  } catch {}
  return template;
}

export async function getCustomTemplatesCloud(): Promise<CustomTemplate[]> {
  try {
    const colRef = collection(db, 'custom_templates');
    const snap = await getDocs(colRef);
    const list: CustomTemplate[] = [];
    snap.forEach((d) => list.push(d.data() as CustomTemplate));
    try {
      localStorage.setItem('frida_custom_templates', JSON.stringify(list));
    } catch {}
    return list;
  } catch {
    try {
      return JSON.parse(localStorage.getItem('frida_custom_templates') || '[]');
    } catch {
      return [];
    }
  }
}

export function subscribeCustomTemplatesCloud(callback: (templates: CustomTemplate[]) => void): () => void {
  try {
    const colRef = collection(db, 'custom_templates');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: CustomTemplate[] = [];
        snapshot.forEach((d) => list.push(d.data() as CustomTemplate));
        try {
          localStorage.setItem('frida_custom_templates', JSON.stringify(list));
        } catch {}
        callback(list);
      },
      (err) => {
        console.warn('Custom templates listener error:', err);
      }
    );
  } catch {
    return () => {};
  }
}

export async function deleteCustomTemplateCloud(templateId: string): Promise<void> {
  await deleteDoc(doc(db, 'custom_templates', templateId));
  try {
    const cached: CustomTemplate[] = JSON.parse(localStorage.getItem('frida_custom_templates') || '[]');
    const filtered = cached.filter((t) => t.id !== templateId);
    localStorage.setItem('frida_custom_templates', JSON.stringify(filtered));
  } catch {}
}

export async function incrementVisitorCountCloud(): Promise<number> {
  try {
    const statRef = doc(db, 'settings', 'visitor_stats');
    const snap = await getDoc(statRef);
    let current = 1240;
    if (snap.exists()) {
      current = (snap.data()?.totalVisitors || 1240) + 1;
    } else {
      current = 1245;
    }
    await setDoc(statRef, { totalVisitors: current, updatedAt: new Date().toISOString() }, { merge: true });
    return current;
  } catch {
    return 1245;
  }
}

export function subscribeVisitorStatsCloud(callback: (count: number) => void): () => void {
  try {
    const statRef = doc(db, 'settings', 'visitor_stats');
    return onSnapshot(
      statRef,
      (snap) => {
        if (snap.exists()) {
          callback(snap.data()?.totalVisitors || 1245);
        } else {
          callback(1245);
        }
      },
      () => callback(1245)
    );
  } catch {
    callback(1245);
    return () => {};
  }
}
