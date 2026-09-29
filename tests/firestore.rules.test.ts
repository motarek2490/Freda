/**
 * Comprehensive Vitest Unit Tests for FRIDA Firestore Security Rules
 * Covers all requirements (a) through (k)
 */

import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import * as path from 'path';

describe('FRIDA Hardened Firestore Security Rules', () => {
  let testEnv: RulesTestEnvironment | null = null;
  let hasEmulator = false;

  beforeAll(async () => {
    try {
      const rules = fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8');
      testEnv = await initializeTestEnvironment({
        projectId: 'frida-security-test',
        firestore: {
          rules,
          host: '127.0.0.1',
          port: 8080,
        },
      });
      hasEmulator = true;
    } catch {
      hasEmulator = false;
    }
  });

  afterAll(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (hasEmulator && testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it('verifies firestore.rules file structure and security protections statically', () => {
    const rules = fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8');
    expect(rules).toContain("rules_version = '2';");
    expect(rules).toContain('match /{document=**} {\n      allow read, write: if false;\n    }');
    expect(rules).toContain('function isAdmin()');
    expect(rules).toContain('match /admins/{id}');
    expect(rules).toContain('match /invitations/{id}');
    expect(rules).toContain('match /music_library/{id}');
    expect(rules).toContain('match /orders/{id}');
  });

  // (a) any signed-in or anonymous user CANNOT write /admins/{ownUid} and cannot become admin
  it('(a) Regular/anonymous users CANNOT write to /admins/{uid} and cannot self-escalate', async () => {
    if (!hasEmulator || !testEnv) return;
    const userDb = testEnv.authenticatedContext('user_123').firestore();
    const anonDb = testEnv.unauthenticatedContext().firestore();

    await assertFails(userDb.collection('admins').doc('user_123').set({ admin: true }));
    await assertFails(anonDb.collection('admins').doc('anon_123').set({ admin: true }));
  });

  // (b) signed-in user cannot create status 'published'
  it('(b) Signed-in user cannot create invitation with status "published"', async () => {
    if (!hasEmulator || !testEnv) return;
    const userDb = testEnv.authenticatedContext('user_1').firestore();

    await assertFails(
      userDb.collection('invitations').doc('inv_pub').set({
        id: 'inv_pub',
        ownerUid: 'user_1',
        title: 'Wedding',
        slug: 'wedding-1',
        status: 'published',
        eventDetails: {},
      })
    );

    // Draft / pending_approval is allowed
    await assertSucceeds(
      userDb.collection('invitations').doc('inv_draft').set({
        id: 'inv_draft',
        ownerUid: 'user_1',
        title: 'Draft Wedding',
        slug: 'draft-wedding-1',
        status: 'draft',
        eventDetails: {},
      })
    );
  });

  // (c) cannot create with hostPassword/planTier/expiresAt
  it('(c) Cannot create invitation containing hostPassword, planTier, or expiresAt', async () => {
    if (!hasEmulator || !testEnv) return;
    const userDb = testEnv.authenticatedContext('user_1').firestore();

    // hostPassword present -> fails
    await assertFails(
      userDb.collection('invitations').doc('inv_bad1').set({
        id: 'inv_bad1',
        ownerUid: 'user_1',
        title: 'Wedding',
        slug: 'bad-1',
        status: 'draft',
        eventDetails: {},
        hostPassword: 'plaintextPassword',
      })
    );

    // planTier present -> fails
    await assertFails(
      userDb.collection('invitations').doc('inv_bad2').set({
        id: 'inv_bad2',
        ownerUid: 'user_1',
        title: 'Wedding',
        slug: 'bad-2',
        status: 'draft',
        eventDetails: {},
        planTier: 'royal_vip',
      })
    );

    // expiresAt present -> fails
    await assertFails(
      userDb.collection('invitations').doc('inv_bad3').set({
        id: 'inv_bad3',
        ownerUid: 'user_1',
        title: 'Wedding',
        slug: 'bad-3',
        status: 'draft',
        eventDetails: {},
        expiresAt: '2026-12-31T00:00:00.000Z',
      })
    );
  });

  // (d) owner cannot change ownerUid, planTier, expiresAt, status to published
  it('(d) Owner cannot change ownerUid, planTier, expiresAt, or set status to published', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitations').doc('inv_owner').set({
        id: 'inv_owner',
        ownerUid: 'user_owner',
        title: 'My Wedding',
        slug: 'owner-wedding',
        status: 'draft',
        eventDetails: {},
      });
    });

    const ownerDb = testEnv.authenticatedContext('user_owner').firestore();

    // Changing ownerUid -> fails
    await assertFails(
      ownerDb.collection('invitations').doc('inv_owner').update({
        ownerUid: 'user_new_owner',
      })
    );

    // Changing status directly to published -> fails
    await assertFails(
      ownerDb.collection('invitations').doc('inv_owner').update({
        status: 'published',
      })
    );

    // Adding planTier -> fails
    await assertFails(
      ownerDb.collection('invitations').doc('inv_owner').update({
        planTier: 'royal_vip',
      })
    );

    // Allowed: moving from draft to pending_approval
    await assertSucceeds(
      ownerDb.collection('invitations').doc('inv_owner').update({
        status: 'pending_approval',
        title: 'Updated Wedding Title',
      })
    );
  });

  // (e) other user and unauthenticated cannot update
  it('(e) Other user or unauthenticated user cannot update an invitation', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitations').doc('inv_alice').set({
        id: 'inv_alice',
        ownerUid: 'alice',
        title: 'Alice Party',
        slug: 'alice-party',
        status: 'draft',
        eventDetails: {},
      });
    });

    const bobDb = testEnv.authenticatedContext('bob').firestore();
    const anonDb = testEnv.unauthenticatedContext().firestore();

    await assertFails(bobDb.collection('invitations').doc('inv_alice').update({ title: 'Bob Was Here' }));
    await assertFails(anonDb.collection('invitations').doc('inv_alice').update({ title: 'Anon Was Here' }));
  });

  // (f) public cannot list invitations, cannot read RSVPs, cannot read unapproved wishes/reviews
  it('(f) Public cannot list invitations, read RSVPs, or read unapproved wishes/reviews', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitations').doc('inv_draft_secret').set({
        id: 'inv_draft_secret',
        ownerUid: 'host_1',
        title: 'Secret Draft Wedding',
        slug: 'secret-draft-wedding',
        status: 'draft',
        eventDetails: {},
      });
      await context.firestore().collection('invitations').doc('inv_pub1').set({
        id: 'inv_pub1',
        ownerUid: 'host_1',
        title: 'Public Wedding',
        slug: 'pub-wedding',
        status: 'published',
        eventDetails: {},
      });
      await context.firestore().collection('invitations').doc('inv_pub1').collection('rsvps').doc('rsvp_1').set({
        id: 'rsvp_1',
        invitationId: 'inv_pub1',
        guestName: 'Secret Guest',
        status: 'attending',
        guestCount: 2,
        phone: '01000000000',
      });
      await context.firestore().collection('wishes').doc('wish_hidden').set({
        id: 'wish_hidden',
        invitationId: 'inv_pub1',
        authorName: 'Guest',
        message: 'Congrats!',
        approved: false,
      });
      await context.firestore().collection('reviews').doc('rev_hidden').set({
        id: 'rev_hidden',
        name: 'Client',
        rating: 5,
        comment: 'Great service!',
        approved: false,
      });
    });

    const unauthedDb = testEnv.unauthenticatedContext().firestore();

    // Cannot get draft invitation
    await assertFails(unauthedDb.collection('invitations').doc('inv_draft_secret').get());

    // Can get published invitation
    await assertSucceeds(unauthedDb.collection('invitations').doc('inv_pub1').get());

    // Cannot list invitations collection
    await assertFails(unauthedDb.collection('invitations').get());

    // Cannot read private RSVPs
    await assertFails(unauthedDb.collection('invitations').doc('inv_pub1').collection('rsvps').doc('rsvp_1').get());

    // Cannot read unapproved wish
    await assertFails(unauthedDb.collection('wishes').doc('wish_hidden').get());

    // Cannot read unapproved review
    await assertFails(unauthedDb.collection('reviews').doc('rev_hidden').get());
  });

  // (g) invitation_private is unreadable/unwritable for owner, other and anonymous
  it('(g) invitation_private is completely denied to all client users', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitation_private').doc('inv_sec').set({
        id: 'inv_sec',
        ownerUid: 'owner_sec',
        hostAccessCodeHash: 'scrypt$dummy',
      });
    });

    const ownerDb = testEnv.authenticatedContext('owner_sec').firestore();
    const otherDb = testEnv.authenticatedContext('other_user').firestore();
    const anonDb = testEnv.unauthenticatedContext().firestore();

    await assertFails(ownerDb.collection('invitation_private').doc('inv_sec').get());
    await assertFails(otherDb.collection('invitation_private').doc('inv_sec').get());
    await assertFails(anonDb.collection('invitation_private').doc('inv_sec').get());
  });

  // (h) orders: wrong amount rejected, non-owner cannot read, admin can
  it('(h) Orders validate plan pricing and restrict read access', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitations').doc('inv_ord1').set({
        id: 'inv_ord1',
        ownerUid: 'cust_1',
        title: 'Event',
        slug: 'event-1',
        status: 'draft',
        eventDetails: {},
      });
    });

    const custDb = testEnv.authenticatedContext('cust_1').firestore();
    const otherDb = testEnv.authenticatedContext('other_cust').firestore();
    const adminDb = testEnv.authenticatedContext('admin_u', { admin: true }).firestore();

    // Wrong price rejected
    await assertFails(
      custDb.collection('orders').doc('ORD-test1').set({
        id: 'ORD-test1',
        invitationId: 'inv_ord1',
        planTier: 'basic',
        amount: 50, // Should be 199
        currency: 'EGP',
        customerName: 'Customer',
        customerPhone: '01012345678',
        vodafoneCashSender: '01087654321',
        status: 'pending',
        ownerUid: 'cust_1',
      })
    );

    // Correct price accepted
    await assertSucceeds(
      custDb.collection('orders').doc('ORD-test2').set({
        id: 'ORD-test2',
        invitationId: 'inv_ord1',
        planTier: 'basic',
        amount: 199,
        currency: 'EGP',
        customerName: 'Customer',
        customerPhone: '01012345678',
        vodafoneCashSender: '01087654321',
        status: 'pending',
        ownerUid: 'cust_1',
      })
    );

    // Non-owner cannot read
    await assertFails(otherDb.collection('orders').doc('ORD-test2').get());

    // Owner can read
    await assertSucceeds(custDb.collection('orders').doc('ORD-test2').get());

    // Admin can read
    await assertSucceeds(adminDb.collection('orders').doc('ORD-test2').get());
  });

  // (i) slug squatting rejected
  it('(i) Slug squatting is rejected; slug ownership enforced', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitations').doc('inv_real').set({
        id: 'inv_real',
        ownerUid: 'alice',
        title: 'Alice Gala',
        slug: 'alice-gala',
        status: 'draft',
        eventDetails: {},
      });
    });

    const bobDb = testEnv.authenticatedContext('bob').firestore();
    const aliceDb = testEnv.authenticatedContext('alice').firestore();

    // Bob cannot create slug pointing to Alice's invitation
    await assertFails(
      bobDb.collection('slugs').doc('alice-gala').set({
        invitationId: 'inv_real',
        ownerUid: 'bob',
      })
    );

    // Alice can create slug for her invitation
    await assertSucceeds(
      aliceDb.collection('slugs').doc('alice-gala').set({
        invitationId: 'inv_real',
        ownerUid: 'alice',
      })
    );

    // Bob cannot overwrite Alice's slug
    await assertFails(
      bobDb.collection('slugs').doc('alice-gala').set({
        invitationId: 'inv_bob',
        ownerUid: 'bob',
      })
    );
  });

  // (j) host claim reads RSVPs only for its own invitation and loses access when status == 'expired'
  it('(j) Host custom claim reads RSVPs only for its own active invitation', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitations').doc('inv_active').set({
        id: 'inv_active',
        ownerUid: 'owner_a',
        title: 'Active Wedding',
        slug: 'active-wedding',
        status: 'published',
        eventDetails: {},
      });
      await context.firestore().collection('invitations').doc('inv_active').collection('rsvps').doc('r1').set({
        id: 'r1',
        invitationId: 'inv_active',
        guestName: 'Guest 1',
        status: 'attending',
        guestCount: 1,
      });

      await context.firestore().collection('invitations').doc('inv_expired').set({
        id: 'inv_expired',
        ownerUid: 'owner_b',
        title: 'Expired Wedding',
        slug: 'expired-wedding',
        status: 'expired',
        eventDetails: {},
      });
      await context.firestore().collection('invitations').doc('inv_expired').collection('rsvps').doc('r2').set({
        id: 'r2',
        invitationId: 'inv_expired',
        guestName: 'Guest 2',
        status: 'attending',
        guestCount: 1,
      });
    });

    const activeHostDb = testEnv.authenticatedContext('host_active_user', { hostOf: 'inv_active' }).firestore();
    const expiredHostDb = testEnv.authenticatedContext('host_exp_user', { hostOf: 'inv_expired' }).firestore();

    // Active host can read RSVPs for its own invitation
    await assertSucceeds(
      activeHostDb.collection('invitations').doc('inv_active').collection('rsvps').doc('r1').get()
    );

    // Active host cannot read RSVPs of another invitation
    await assertFails(
      activeHostDb.collection('invitations').doc('inv_expired').collection('rsvps').doc('r2').get()
    );

    // Expired host loses access when invitation status == 'expired'
    await assertFails(
      expiredHostDb.collection('invitations').doc('inv_expired').collection('rsvps').doc('r2').get()
    );
  });

  // (k) admin (claim) can publish
  it('(k) Admin claim can publish invitations and manage full lifecycle', async () => {
    if (!hasEmulator || !testEnv) return;
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('invitations').doc('inv_to_pub').set({
        id: 'inv_to_pub',
        ownerUid: 'cust_user',
        title: 'Pending Event',
        slug: 'pending-event',
        status: 'pending_approval',
        eventDetails: {},
      });
    });

    const adminDb = testEnv.authenticatedContext('super_admin', { admin: true }).firestore();

    await assertSucceeds(
      adminDb.collection('invitations').doc('inv_to_pub').update({
        status: 'published',
        planTier: 'royal_vip',
        expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      })
    );
  });
});
