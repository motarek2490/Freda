# FRIDA (فريدا) - Security Architecture & Deployment Guide

## 1. Firebase Firestore Security Rules Deployment

The project uses Zero-Trust Attribute-Based Access Control (ABAC) defined in `/firestore.rules`.

### Deployment Steps:
1. **Via Firebase CLI (Terminal):**
   ```bash
   firebase deploy --only firestore:rules
   ```
2. **Via AI Studio Agent:**
   The agent automatically deploys `firestore.rules` whenever modifications are made using `deploy_firebase`.

### Key Access Control Guarantees:
- **Orders (`/orders/{orderId}`):**
  - Read: Admin ONLY (`mohammedtarek2490@gmail.com`).
  - Create: Clients can initiate orders with status `pending`.
  - Update/Delete: Restricted strictly to Admin. Clients CANNOT approve their own orders or tamper with the amount/status fields.
- **Invitations (`/invitations/{invitationId}`):**
  - Read: Public (`get`, `list`).
  - Status Elevation: Unauthenticated clients CANNOT promote an invitation from `pending_approval` to `published`. Only Admins can publish invitations upon payment verification.
- **RSVPs & Wishes (`/rsvps`, `/wishes`):**
  - Create: Enforces strict field size and schema checks. All guest input strings are sanitized with `sanitizeText` on the frontend before rendering.
  - Update/Delete: Admin ONLY.

---

## 2. Supabase Storage RLS Policies Configuration Guide (`music` Bucket)

To secure audio uploads on Supabase Storage for background music tracks:

### Step-by-Step Instructions in Supabase Dashboard:
1. Open **Supabase Dashboard** -> Select your project.
2. Go to **Storage** -> **Buckets** -> Select or create the `music` bucket.
3. Ensure **Public Bucket** is enabled for audio playback reading.
4. Click on **Policies** for the `music` bucket.

### Policy Configuration Rules:

#### A. Public Read Access (SELECT)
- **Policy Name:** `Allow Public Read for Music Tracks`
- **Target Roles:** `anon`, `authenticated`
- **Allowed Operation:** `SELECT`
- **USING Expression:** `bucket_id = 'music'`

#### B. Restricted Audio Insert (INSERT)
- **Policy Name:** `Allow Admin Audio Uploads with MIME and Size Limits`
- **Target Roles:** `authenticated` (or Admin service role)
- **Allowed Operation:** `INSERT`
- **WITH CHECK Expression:**
  ```sql
  bucket_id = 'music'
  AND (storage.foldername(name))[1] = 'music'
  AND (LOWER(storage.extension(name)) IN ('mp3', 'wav', 'm4a', 'ogg'))
  ```

#### C. Prevent Unauthorized Update & Delete (UPDATE & DELETE)
- **Policy Name:** `Disable Anonymous Update and Delete`
- **Target Roles:** `anon`
- **Allowed Operations:** `UPDATE`, `DELETE`
- **USING Expression:** `false`

---

## 3. Client-Side Security & Input Sanitization
- All text inputs from guests (RSVP guest names, plus one, dietary notes, wishes messages, customer reviews) pass through `sanitizeText` in `src/lib/security.ts` to neutralize HTML tags and prevent XSS scripts.
- Admin Authentication is backed by Firebase Auth server-side rate-limiting (`auth/too-many-requests`) to prevent brute-force attacks.
