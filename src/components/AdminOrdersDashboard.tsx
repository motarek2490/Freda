import React, { useState, useEffect } from 'react';
import {
  OrderData,
  InvitationData,
  AdminSettings,
  Language,
  WebsiteReview,
  CustomTemplate,
} from '../types';
import {
  getOrdersCloud,
  subscribeOrdersCloud,
  updateOrderStatusCloud,
  approveOrderCloud,
  setHostCredentialsCloud,
  getAdminSettingsCloud,
  subscribeAdminSettingsCloud,
  saveAdminSettingsCloud,
  DEFAULT_ADMIN_SETTINGS,
  getInvitationsCloud,
  subscribeInvitationsCloud,
  updateInvitationStatusCloud,
  deleteInvitationCloud,
  deleteOrderCloud,
  subscribeWebsiteReviewsCloud,
  deleteWebsiteReviewCloud,
  saveCustomTemplateCloud,
  getCustomTemplatesCloud,
  deleteCustomTemplateCloud,
  getInvitationCloudBySlugOrId,
} from '../lib/firestoreService';
import {
  MusicTrack,
  subscribeCloudMusicLibrary,
  saveTrackToCloudLibrary,
  deleteTrackFromCloudLibrary,
  getAllAvailableTracks,
} from '../data/presetMusic';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { verifyIsAdminUser, adminLogout } from '../lib/security';

import { AdminLoginModal } from './admin/AdminLoginModal';
import { AdminHeader, AdminTab } from './admin/AdminHeader';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminInvitationsTab } from './admin/AdminInvitationsTab';
import { AdminTemplatesTab } from './admin/AdminTemplatesTab';
import { AdminMusicTab } from './admin/AdminMusicTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { AdminReviewsTab } from './admin/AdminReviewsTab';
import { ClientHandoverModal } from './ClientHandoverModal';

interface AdminOrdersDashboardProps {
  currentLang?: Language;
  onClose: () => void;
  onPreviewInvitation?: (inv: InvitationData) => void;
  onSettingsUpdated?: (settings: AdminSettings) => void;
}

export const AdminOrdersDashboard: React.FC<AdminOrdersDashboardProps> = ({
  currentLang = 'ar',
  onClose,
  onPreviewInvitation,
  onSettingsUpdated,
}) => {
  const isRtl = currentLang === 'ar';

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await verifyIsAdminUser(user);
        setIsAuthenticated(isAdmin);
      } else {
        setIsAuthenticated(false);
      }
      setIsCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  // Core Data State
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [reviews, setReviews] = useState<WebsiteReview[]>([]);
  const [adminTracks, setAdminTracks] = useState<MusicTrack[]>(() => getAllAvailableTracks());

  // Handover Modal State
  const [handoverInv, setHandoverInv] = useState<InvitationData | null>(null);
  const [handoverOrder, setHandoverOrder] = useState<OrderData | undefined>(undefined);

  // Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. Orders
    const unsubOrders = subscribeOrdersCloud((res) => {
      if (res) setOrders(res);
    });

    // 2. Invitations
    const unsubInvitations = subscribeInvitationsCloud((res) => {
      if (res) setInvitations(res);
    });

    // 3. Admin Settings
    const unsubSettings = subscribeAdminSettingsCloud((res) => {
      if (res) {
        setAdminSettings(res);
        if (onSettingsUpdated) onSettingsUpdated(res);
        const hiddenIds = res.hiddenTrackIds || [];
        setAdminTracks((prev) =>
          prev.filter((t) => !hiddenIds.includes(t.id || '') && !hiddenIds.includes(t.url || ''))
        );
      }
    });

    // 4. Custom Templates
    getCustomTemplatesCloud().then((res) => {
      if (res) setCustomTemplates(res);
    });

    // 5. Reviews
    const unsubReviews = subscribeWebsiteReviewsCloud((res) => {
      if (res) setReviews(res);
    });

    // 6. Music Library
    const unsubMusic = subscribeCloudMusicLibrary((cloudTracks) => {
      getAdminSettingsCloud().then((currSettings) => {
        const hiddenIds = currSettings?.hiddenTrackIds || adminSettings?.hiddenTrackIds || [];
        const presets = getAllAvailableTracks(hiddenIds);
        const map = new Map<string, MusicTrack>();
        presets.forEach((t) => {
          if (t.id && !hiddenIds.includes(t.id) && !hiddenIds.includes(t.url)) {
            map.set(t.id, t);
          }
        });
        cloudTracks.forEach((t) => {
          if (t.id && !hiddenIds.includes(t.id) && !hiddenIds.includes(t.url)) {
            map.set(t.id, t);
          }
        });
        setAdminTracks(Array.from(map.values()));
      });
    });

    return () => {
      unsubOrders();
      unsubInvitations();
      unsubSettings();
      unsubReviews();
      unsubMusic();
    };
  }, [isAuthenticated, onSettingsUpdated]);

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
  };

  // Order Actions
  const handleApproveOrder = async (order: OrderData) => {
    try {
      const res = await approveOrderCloud(order.id);
      let plainAccessCode = res?.hostAccessCode;
      if (!plainAccessCode && order.invitationId) {
        const credRes = await setHostCredentialsCloud(order.invitationId);
        plainAccessCode = credRes?.accessCode;
      }

      let targetInv: InvitationData | undefined = invitations.find((i) => i.id === order.invitationId);
      if (!targetInv && order.invitationSnapshot) {
        targetInv = order.invitationSnapshot as InvitationData;
      }
      if (!targetInv && order.invitationId) {
        targetInv = (await getInvitationCloudBySlugOrId(order.invitationId)) || undefined;
      }

      if (targetInv && targetInv.id) {
        const publishedInv: InvitationData = {
          ...targetInv,
          id: targetInv.id,
          status: 'published',
          hostAccessCode: plainAccessCode || targetInv.hostAccessCode,
          hostUsername: res?.hostUsername || targetInv.hostUsername || order.customerPhone,
        };
        setHandoverInv(publishedInv);
        setHandoverOrder({
          ...order,
          status: 'approved',
        });
      }
    } catch (err) {
      console.error('Error approving order:', err);
      alert(currentLang === 'ar' ? 'فشل اعتماد الطلب. يرجى التأكد من اتصال السيرفر ومحاولة مرة أخرى.' : 'Failed to approve order. Please try again.');
    }
  };

  const handleRejectOrder = async (orderId: string, reason: string) => {
    try {
      await updateOrderStatusCloud(orderId, 'rejected', reason);
    } catch (err) {
      console.warn('Error rejecting order:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderCloud(orderId);
    } catch (err) {
      console.warn('Error deleting order:', err);
    }
  };

  // Invitation Actions
  const handleUpdateInvitationStatus = async (
    invId: string,
    status: 'published' | 'draft' | 'pending_approval' | 'expired'
  ) => {
    try {
      await updateInvitationStatusCloud(invId, status as any);
    } catch (err) {
      console.warn('Error updating invitation status:', err);
    }
  };

  const handleDeleteInvitation = async (invId: string) => {
    try {
      await deleteInvitationCloud(invId);
    } catch (err) {
      console.warn('Error deleting invitation:', err);
    }
  };

  // Custom Templates Actions
  const handleSaveCustomTemplate = async (template: CustomTemplate) => {
    await saveCustomTemplateCloud(template);
    setCustomTemplates((prev) => [template, ...prev]);
  };

  const handleDeleteCustomTemplate = async (templateId: string) => {
    await deleteCustomTemplateCloud(templateId);
    setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId));
  };

  // Music Actions
  const handleSaveTrack = async (track: MusicTrack) => {
    try {
      await saveTrackToCloudLibrary(track);
    } catch (err) {
      console.warn('Error saving track to cloud library:', err);
    }
    setAdminTracks((prev) => [track, ...prev.filter((t) => t.id !== track.id && t.url !== track.url)]);
  };

  const handleDeleteTrack = async (trackId: string, trackUrl?: string) => {
    // 1. Immediately reflect in UI state so the user sees instant feedback
    setAdminTracks((prev) => prev.filter((t) => t.id !== trackId && (!trackUrl || t.url !== trackUrl)));

    // 2. Delete from Cloud Firestore / local cache / IndexedDB
    try {
      if (trackId || trackUrl) {
        await deleteTrackFromCloudLibrary(trackId || trackUrl || '');
      }
    } catch (err) {
      console.warn('Error in deleteTrackFromCloudLibrary:', err);
    }

    // 3. Hide or blacklist in adminSettings so preset/system tracks are permanently removed
    try {
      const currentSettings = adminSettings || DEFAULT_ADMIN_SETTINGS;
      const currentHidden = currentSettings.hiddenTrackIds || [];
      const toHide = [trackId, trackUrl].filter(Boolean) as string[];
      const newHidden = Array.from(new Set([...currentHidden, ...toHide]));
      const updated: AdminSettings = {
        ...currentSettings,
        hiddenTrackIds: newHidden,
      };
      saveAdminSettingsCloud(updated).catch(() => {});
      setAdminSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
    } catch (settingsErr) {
      console.warn('Error updating adminSettings for deleted track:', settingsErr);
    }
  };

  const handleSetDefaultDemoTrack = async (url: string, name: string) => {
    if (!adminSettings) return;
    const updated: AdminSettings = {
      ...adminSettings,
      defaultDemoTrackUrl: url,
      defaultDemoTrackName: name,
    };
    await saveAdminSettingsCloud(updated);
    setAdminSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
  };

  // Settings Actions
  const handleSaveSettings = async (newSettings: AdminSettings) => {
    await saveAdminSettingsCloud(newSettings);
    setAdminSettings(newSettings);
    if (onSettingsUpdated) onSettingsUpdated(newSettings);
  };

  // Reviews Actions
  const handleDeleteReview = async (reviewId: string) => {
    await deleteWebsiteReviewCloud(reviewId);
  };

  // If not authenticated, render Login Modal
  if (!isAuthenticated) {
    return (
      <AdminLoginModal
        currentLang={currentLang}
        onClose={onClose}
        onSuccess={() => setIsAuthenticated(true)}
      />
    );
  }

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-[#121212] overflow-y-auto animate-in fade-in"
    >
      {/* Header Bar */}
      <AdminHeader
        currentLang={currentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingOrdersCount={pendingOrdersCount}
        totalOrdersCount={orders.length}
        totalInvitationsCount={invitations.length}
        reviewsCount={reviews.length}
        onLogout={handleLogout}
        onClose={onClose}
      />

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {activeTab === 'orders' && (
          <AdminOrdersTab
            currentLang={currentLang}
            orders={orders}
            invitations={invitations}
            onApproveOrder={handleApproveOrder}
            onRejectOrder={handleRejectOrder}
            onDeleteOrder={handleDeleteOrder}
            onPreviewInvitation={onPreviewInvitation}
            onOpenHandoverModal={(inv, ord) => {
              setHandoverInv(inv);
              setHandoverOrder(ord);
            }}
          />
        )}

        {activeTab === 'all_invitations' && (
          <AdminInvitationsTab
            currentLang={currentLang}
            invitations={invitations}
            onUpdateStatus={handleUpdateInvitationStatus}
            onDeleteInvitation={handleDeleteInvitation}
            onPreviewInvitation={onPreviewInvitation}
            onOpenHandoverModal={(inv) => {
              setHandoverInv(inv);
              setHandoverOrder(undefined);
            }}
          />
        )}

        {activeTab === 'templates' && (
          <AdminTemplatesTab
            currentLang={currentLang}
            customTemplates={customTemplates}
            onSaveTemplate={handleSaveCustomTemplate}
            onDeleteTemplate={handleDeleteCustomTemplate}
          />
        )}

        {activeTab === 'music' && (
          <AdminMusicTab
            currentLang={currentLang}
            adminTracks={adminTracks}
            adminSettings={adminSettings}
            onSaveTrack={handleSaveTrack}
            onDeleteTrack={handleDeleteTrack}
            onSetDefaultDemoTrack={handleSetDefaultDemoTrack}
          />
        )}

        {activeTab === 'reviews' && (
          <AdminReviewsTab
            currentLang={currentLang}
            reviews={reviews}
            onDeleteReview={handleDeleteReview}
          />
        )}

        {activeTab === 'settings' && adminSettings && (
          <AdminSettingsTab
            currentLang={currentLang}
            adminSettings={adminSettings}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* Client Handover Modal */}
      {handoverInv && (
        <ClientHandoverModal
          invitation={handoverInv}
          order={handoverOrder}
          currentLang={currentLang}
          onClose={() => {
            setHandoverInv(null);
            setHandoverOrder(undefined);
          }}
        />
      )}
    </div>
  );
};
