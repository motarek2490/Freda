import React, { useState, useEffect } from 'react';
import {
  Language,
  Template,
  InvitationData,
  UserProfile,
  AdminSettings,
} from './types';
import {
  getAdminSettingsCloud,
  subscribeAdminSettingsCloud,
} from './lib/firestoreService';
import { subscribeCloudMusicLibrary } from './data/presetMusic';
import {
  getStoredLanguage,
  setStoredLanguage,
  getStoredUser,
  getStoredInvitations,
  fetchInvitationWithCloudFallback,
  saveInvitation,
} from './lib/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { CinematicHero, EGYPTIAN_VIP_PROFILES, EgyptianVIPProfile } from './components/CinematicHero';
import { WhatWillTheyFeelSection } from './components/WhatWillTheyFeelSection';
import { MomentBeforeIDoSection } from './components/MomentBeforeIDoSection';
import { BrandStorySection } from './components/BrandStorySection';
import { TemplateShowcase } from './components/TemplateShowcase';
import { ExperienceFeaturesSection } from './components/ExperienceFeaturesSection';
import { CategoryGrid } from './components/CategoryGrid';
import { HowItWorksSection } from './components/HowItWorksSection';
import { InvitationDistributionSection } from './components/InvitationDistributionSection';
import { FAQSection } from './components/FAQSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { PendingApprovalScreen } from './components/PendingApprovalScreen';
import { InvitationLoadingScreen } from './components/InvitationLoadingScreen';
import { InvitationNotFoundScreen } from './components/InvitationNotFoundScreen';
import { OccasionLanding, OccasionType } from './components/OccasionLanding';
import { checkAndExpireInvitationsCloud } from './lib/firestoreService';
import { TEMPLATES } from './data/templates';
import { BRAND_NAME, BRAND_NAME_AR } from './config/brand';

// Code-split heavy modals and dashboards for maximum landing page performance
const TemplateDetailModal = React.lazy(() =>
  import('./components/TemplateDetailModal').then((m) => ({ default: m.TemplateDetailModal }))
);
const InvitationBuilderModal = React.lazy(() =>
  import('./components/InvitationBuilder/InvitationBuilderModal').then((m) => ({
    default: m.InvitationBuilderModal,
  }))
);
const Dashboard = React.lazy(() =>
  import('./components/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const ShareModal = React.lazy(() =>
  import('./components/ShareModal').then((m) => ({ default: m.ShareModal }))
);
const AuthModal = React.lazy(() =>
  import('./components/AuthModal').then((m) => ({ default: m.AuthModal }))
);
const InvitationRenderer = React.lazy(() =>
  import('./components/InvitationRenderer').then((m) => ({ default: m.InvitationRenderer }))
);
const HostGuestPortal = React.lazy(() =>
  import('./components/HostGuestPortal').then((m) => ({ default: m.HostGuestPortal }))
);
const PricingModal = React.lazy(() =>
  import('./components/PricingModal').then((m) => ({ default: m.PricingModal }))
);
const CardImageModal = React.lazy(() =>
  import('./components/CardImageModal').then((m) => ({ default: m.CardImageModal }))
);
const AdminOrdersDashboard = React.lazy(() =>
  import('./components/AdminOrdersDashboard').then((m) => ({ default: m.AdminOrdersDashboard }))
);
const OrderStatusModal = React.lazy(() =>
  import('./components/OrderStatusModal').then((m) => ({ default: m.OrderStatusModal }))
);

const LazyModalFallback: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none">
    <div className="w-8 h-8 border-2 border-[#C9A86A]/20 border-t-[#C9A86A] rounded-full animate-spin" />
  </div>
);

export default function App() {
  // Language & Dir state
  const [currentLang, setCurrentLang] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    setStoredLanguage(currentLang);
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Auth User State
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());

  // Global Admin Settings for Default Demo Song & Pricing
  const [appAdminSettings, setAppAdminSettings] = useState<AdminSettings | null>(null);

  useEffect(() => {
    // 1. Real-time Admin Settings subscription across all devices
    const unsubSettings = subscribeAdminSettingsCloud((res) => {
      if (res) setAppAdminSettings(res);
    });

    // 2. Real-time Cloud Music Library cache subscription
    const unsubMusic = subscribeCloudMusicLibrary(() => {
      // Synchronized globally into cache
    });

    return () => {
      unsubSettings();
      unsubMusic();
    };
  }, []);

  // Dynamic Head SEO Tag injection
  useEffect(() => {
    if (!appAdminSettings) return;

    if (appAdminSettings.siteTitle) {
      document.title = appAdminSettings.siteTitle;
    }

    const updateMeta = (name: string, content?: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const updateProperty = (property: string, content?: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('description', appAdminSettings.metaDescription);
    updateProperty('og:title', appAdminSettings.ogTitle || appAdminSettings.siteTitle);
    updateProperty('og:description', appAdminSettings.ogDescription || appAdminSettings.metaDescription);
    updateProperty('og:image', appAdminSettings.ogImage);
    updateMeta('twitter:title', appAdminSettings.ogTitle || appAdminSettings.siteTitle);
    updateMeta('twitter:description', appAdminSettings.ogDescription || appAdminSettings.metaDescription);
  }, [appAdminSettings]);

  // Invitations State (Local dashboard management, no global table subscribe)
  const [invitations, setInvitations] = useState<InvitationData[]>(() => getStoredInvitations());

  const refreshInvitations = () => {
    setInvitations(getStoredInvitations());
  };

  // Standalone public invitation view or host portal
  const [standaloneInvitation, setStandaloneInvitation] = useState<InvitationData | null>(null);
  const [portalInvitation, setPortalInvitation] = useState<InvitationData | null>(null);
  const [activeOccasion, setActiveOccasion] = useState<OccasionType | null>(null);
  const [trackOrderId, setTrackOrderId] = useState<string>('');

  // Dedicated Route State
  const [routeState, setRouteState] = useState<{
    isLoading: boolean;
    notFoundTargetId?: string;
  }>({ isLoading: false });

  const resolveUrlRoute = async (searchParams: URLSearchParams) => {
    const pathname = window.location.pathname;

    // Check for /i/:slug, /preview/:slug, /portal/:slug path
    const pathSlugMatch = pathname.match(/^\/i\/([^\/]+)$/);
    const previewPathMatch = pathname.match(/^\/preview\/([^\/]+)$/);
    const portalPathMatch = pathname.match(/^\/portal\/([^\/]+)$/);
    const occasionPathMatch = pathname.match(/^\/occasions\/([^\/]+)$/);
    const trackPathMatch = pathname.match(/^\/track(?:\/([^\/]+))?$/);

    const previewParam = previewPathMatch ? decodeURIComponent(previewPathMatch[1]) : searchParams.get('preview');
    const rawInv = pathSlugMatch ? pathSlugMatch[1] : searchParams.get('invitation');
    const invParam = rawInv ? decodeURIComponent(rawInv) : null;
    const portalParam = portalPathMatch ? decodeURIComponent(portalPathMatch[1]) : searchParams.get('portal');
    const adminParam = searchParams.get('admin');
    const viewParam = searchParams.get('view');
    const trackParam = searchParams.get('track');

    if (adminParam) {
      setShowAdminModal(true);
    }

    if (viewParam === 'dashboard') {
      setActiveView('dashboard');
    }

    if (trackPathMatch || trackParam) {
      const orderId = (trackPathMatch && trackPathMatch[1]) || (trackParam !== '1' ? trackParam : '') || '';
      setTrackOrderId(orderId);
      setShowOrderStatusModal(true);
    }

    if (occasionPathMatch) {
      const occ = occasionPathMatch[1] as OccasionType;
      setActiveOccasion(occ);
      setActiveView('occasion');
      return;
    }

    // 1. Preview Route
    if (previewParam) {
      setRouteState({ isLoading: true });
      const found = await fetchInvitationWithCloudFallback(previewParam);
      if (found) {
        setLivePreviewInvitation(found);
        setActiveView('live_invitation');
        setRouteState({ isLoading: false });
      } else {
        const cleanId = previewParam.replace(/^preview-/, '').replace(/^demo-/, '');
        const tmpl = TEMPLATES.find((t) => t.id === cleanId || t.id === previewParam);
        if (tmpl) {
          const sample: InvitationData = {
            id: `preview-${tmpl.id}`,
            templateId: tmpl.id,
            layoutType: tmpl.layoutType || 'royal',
            title: tmpl.title[currentLang],
            language: currentLang,
            themeStyle: tmpl.themeStyle,
            customColors: tmpl.defaultColors,
            customFont: tmpl.defaultFont,
            eventDetails: {
              ...tmpl.defaultData,
              musicTrackUrl: appAdminSettings?.defaultDemoTrackUrl || tmpl.defaultData?.musicTrackUrl,
              musicTrackName: appAdminSettings?.defaultDemoTrackName || tmpl.defaultData?.musicTrackName,
            },
            status: 'published',
            createdAt: new Date().toISOString(),
            slug: `preview-${tmpl.id}`,
          };
          setLivePreviewInvitation(sample);
          setActiveView('live_invitation');
          setRouteState({ isLoading: false });
        } else {
          setRouteState({ isLoading: false, notFoundTargetId: previewParam });
        }
      }
      return;
    }

    // 2. Standalone Public Invitation Route (/i/:slug or ?invitation=:slug)
    if (invParam) {
      setRouteState({ isLoading: true });
      const found = await fetchInvitationWithCloudFallback(invParam);
      if (found) {
        setStandaloneInvitation(found);
        setRouteState({ isLoading: false });
      } else {
        setRouteState({ isLoading: false, notFoundTargetId: invParam });
      }
      return;
    }

    // 3. Host Portal Route
    if (portalParam) {
      setRouteState({ isLoading: true });
      const found = await fetchInvitationWithCloudFallback(portalParam);
      if (found) {
        setPortalInvitation(found);
        setActiveView('host_portal');
        setRouteState({ isLoading: false });
      } else {
        setRouteState({ isLoading: false, notFoundTargetId: portalParam });
      }
      return;
    }

    // Default Home
    setRouteState({ isLoading: false });
  };

  useEffect(() => {
    // Run 30-day expiration cleanup
    checkAndExpireInvitationsCloud().catch((err) => console.warn('Expiration check error:', err));

    const urlParams = new URLSearchParams(window.location.search);
    resolveUrlRoute(urlParams);

    const handlePopState = () => {
      const currentParams = new URLSearchParams(window.location.search);
      const isPathInv = window.location.pathname.startsWith('/i/');
      const isPathOcc = window.location.pathname.startsWith('/occasions/');
      if (!currentParams.get('preview') && !currentParams.get('invitation') && !currentParams.get('portal') && !isPathInv && !isPathOcc) {
        setStandaloneInvitation(null);
        setLivePreviewInvitation(null);
        setPortalInvitation(null);
        setActiveOccasion(null);
        setActiveView('home');
        setRouteState({ isLoading: false });
      } else {
        resolveUrlRoute(currentParams);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentLang]);

  // View & Modal State
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'live_invitation' | 'host_portal' | 'occasion'>('home');
  const [returnToAdminOnBack, setReturnToAdminOnBack] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showCardImageModal, setShowCardImageModal] = useState(false);
  const [showOrderStatusModal, setShowOrderStatusModal] = useState(false);

  // Selected Target Objects
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedInvitationForEdit, setSelectedInvitationForEdit] = useState<InvitationData | null>(null);
  const [selectedInvitationForShare, setSelectedInvitationForShare] = useState<InvitationData | null>(null);
  const [pricingTargetInvitation, setPricingTargetInvitation] = useState<InvitationData | null>(null);
  const [cardImageTargetInvitation, setCardImageTargetInvitation] = useState<InvitationData | null>(null);
  const [livePreviewInvitation, setLivePreviewInvitation] = useState<InvitationData | null>(null);

  // Scroll to section helper
  const handleNavigateSection = (sectionId: string) => {
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartCreate = (template?: Template) => {
    if (template) {
      setSelectedTemplate(template);
    } else {
      setSelectedTemplate(TEMPLATES[0]);
    }
    setSelectedInvitationForEdit(null);
    setShowBuilderModal(true);
  };

  const handleEditInvitation = (invitation: InvitationData) => {
    setSelectedInvitationForEdit(invitation);
    const tmpl = TEMPLATES.find((t) => t.id === invitation.templateId) || TEMPLATES[0];
    setSelectedTemplate(tmpl);
    setShowBuilderModal(true);
  };

  const handlePreviewInvitation = (invitation: InvitationData) => {
    if (showAdminModal) {
      setReturnToAdminOnBack(true);
      setShowAdminModal(false);
    }
    const slug = invitation.slug || invitation.id;
    window.history.pushState({ preview: slug }, '', `/i/${slug}`);

    setLivePreviewInvitation(invitation);
    setActiveView('live_invitation');
    window.scrollTo(0, 0);
  };

  const handleOpenDemoPreview = (profile?: EgyptianVIPProfile) => {
    const demoProfile = profile || EGYPTIAN_VIP_PROFILES[0];
    const matchingTemplate =
      TEMPLATES.find((t) => t.id === demoProfile.templateId) ||
      TEMPLATES.find((t) => t.themeStyle === demoProfile.themeStyle) ||
      TEMPLATES[0];

    const demoTrackUrl =
      appAdminSettings?.defaultDemoTrackUrl || '';
    const demoTrackName =
      appAdminSettings?.defaultDemoTrackName ||
      `معزوفة أوركسترا زفاف ${BRAND_NAME_AR} الملكية`;

    const hostsAr = demoProfile?.hostsAr || '';
    const hostsEn = demoProfile?.hostsEn || '';
    const rawGroom = currentLang === 'ar' ? (hostsAr.split('&')[0] || '') : (hostsEn.split('&')[0] || '');
    const rawBride = currentLang === 'ar' ? (hostsAr.split('&')[1] || '') : (hostsEn.split('&')[1] || '');
    const groomName = rawGroom.trim() || (currentLang === 'ar' ? 'العريس' : 'Groom');
    const brideName = rawBride.trim() || (currentLang === 'ar' ? 'العروس' : 'Bride');

    const sample: InvitationData = {
      id: `preview-demo-${demoProfile.id}`,
      templateId: matchingTemplate.id,
      layoutType: demoProfile.layoutType || matchingTemplate.layoutType || 'royal',
      title: currentLang === 'ar' ? demoProfile.badgeAr : demoProfile.badgeEn,
      language: currentLang,
      themeStyle: matchingTemplate.themeStyle,
      customColors: matchingTemplate.defaultColors,
      customFont: matchingTemplate.defaultFont,
      eventDetails: {
        ...matchingTemplate.defaultData,
        groomName,
        brideName,
        eventTitle: currentLang === 'ar' ? demoProfile.badgeAr : demoProfile.badgeEn,
        venueName: currentLang === 'ar' ? demoProfile.venueAr : demoProfile.venueEn,
        musicTrackUrl: demoTrackUrl,
        musicTrackName: demoTrackName,
      },
      status: 'published',
      createdAt: new Date().toISOString(),
      slug: `preview-demo-${demoProfile.id}`,
    };

    handlePreviewInvitation(sample);
  };

  // 1. Loading State
  if (routeState.isLoading) {
    return (
      <InvitationLoadingScreen
        currentLang={currentLang}
        onGoHome={() => {
          setRouteState({ isLoading: false });
          window.history.pushState({}, '', '/');
          setActiveView('home');
        }}
      />
    );
  }

  // 2. Not Found View
  if (routeState.notFoundTargetId) {
    return (
      <InvitationNotFoundScreen
        currentLang={currentLang}
        identifier={routeState.notFoundTargetId}
        onGoHome={() => {
          setRouteState({ isLoading: false });
          window.history.pushState({}, '', '/');
          setActiveView('home');
        }}
      />
    );
  }

  // 3. Host Guest Management Portal
  if (activeView === 'host_portal' && portalInvitation) {
    return (
      <React.Suspense fallback={<LazyModalFallback />}>
        <HostGuestPortal
          invitation={portalInvitation}
          userLang={currentLang}
          onBack={() => {
            window.history.pushState({}, '', '/');
            setActiveView('dashboard');
          }}
        />
      </React.Suspense>
    );
  }

  // 4. Standalone Invitation Link
  if (standaloneInvitation) {
    if (standaloneInvitation.status !== 'published') {
      return (
        <React.Suspense fallback={<LazyModalFallback />}>
          <PendingApprovalScreen
            invitation={standaloneInvitation}
            currentLang={currentLang}
            onOpenPricing={() => {
              setPricingTargetInvitation(standaloneInvitation);
              setShowPricingModal(true);
            }}
            onGoHome={() => {
              setStandaloneInvitation(null);
              window.history.replaceState({}, '', '/');
            }}
          />

          {showPricingModal && pricingTargetInvitation && (
            <PricingModal
              invitation={pricingTargetInvitation}
              currentLang={currentLang}
              onClose={() => {
                setShowPricingModal(false);
                refreshInvitations();
                if (standaloneInvitation) {
                  fetchInvitationWithCloudFallback(standaloneInvitation.slug || standaloneInvitation.id).then((found) => {
                    if (found) setStandaloneInvitation(found);
                  });
                }
              }}
              onOrderSubmitted={() => {
                refreshInvitations();
                if (standaloneInvitation) {
                  fetchInvitationWithCloudFallback(standaloneInvitation.slug || standaloneInvitation.id).then((found) => {
                    if (found) setStandaloneInvitation(found);
                  });
                }
              }}
            />
          )}
        </React.Suspense>
      );
    }

    return (
      <React.Suspense fallback={<LazyModalFallback />}>
        <InvitationRenderer
          invitation={standaloneInvitation}
          userLang={currentLang}
          isStandaloneView={true}
          onBackToApp={() => {
            setStandaloneInvitation(null);
            window.history.replaceState({}, '', '/');
          }}
        />
      </React.Suspense>
    );
  }

  // 5. Live Digital Invitation Full Screen Preview
  if (activeView === 'live_invitation' && livePreviewInvitation) {
    return (
      <React.Suspense fallback={<LazyModalFallback />}>
        <InvitationRenderer
          invitation={livePreviewInvitation}
          userLang={currentLang}
          onBackToApp={() => {
            window.history.pushState({}, '', '/');
            setActiveView('home');
            setLivePreviewInvitation(null);
            if (returnToAdminOnBack) {
              setShowAdminModal(true);
              setReturnToAdminOnBack(false);
            }
          }}
        />
      </React.Suspense>
    );
  }

  // 6. Curated Occasion Landing Page
  if (activeView === 'occasion' && activeOccasion) {
    return (
      <div className="min-h-screen bg-[#171717] text-[#F7F4EE] flex flex-col font-sans-body">
        <Navbar
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          user={user}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenDashboard={() => setActiveView('dashboard')}
          onStartCreate={() => handleStartCreate()}
          onNavigateSection={handleNavigateSection}
          onOpenAdmin={() => setShowAdminModal(true)}
          onOpenTrackOrder={() => setShowOrderStatusModal(true)}
          bgTrackUrl={appAdminSettings?.defaultDemoTrackUrl}
          bgTrackName={appAdminSettings?.defaultDemoTrackName}
        />
        <OccasionLanding
          occasion={activeOccasion}
          currentLang={currentLang}
          onSelectTemplate={(tmpl) => {
            setSelectedTemplate(tmpl);
            setShowDetailModal(true);
          }}
          onGoHome={() => {
            setActiveOccasion(null);
            setActiveView('home');
            window.history.pushState({}, '', '/');
          }}
        />
        <Footer
          currentLang={currentLang}
          onNavigateSection={handleNavigateSection}
          onStartCreate={() => handleStartCreate()}
          onOpenAdmin={() => setShowAdminModal(true)}
          onOpenTrackOrder={() => setShowOrderStatusModal(true)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F4EFE7] flex flex-col font-sans-body">
      {/* Desktop Only Minimal Custom Cursor */}
      <CustomCursor />

      {/* Fixed Minimal Luxury Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenDashboard={() => setActiveView('dashboard')}
        onStartCreate={() => handleStartCreate()}
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenTrackOrder={() => setShowOrderStatusModal(true)}
        bgTrackUrl={appAdminSettings?.defaultDemoTrackUrl}
        bgTrackName={appAdminSettings?.defaultDemoTrackName}
        isAudioSuppressed={
          showBuilderModal ||
          showAdminModal ||
          showDetailModal ||
          Boolean(livePreviewInvitation)
        }
      />

      {/* Main App Page Routing */}
      {activeView === 'dashboard' ? (
        <React.Suspense fallback={<LazyModalFallback />}>
          <Dashboard
            invitations={invitations}
            currentLang={currentLang}
            onStartCreate={() => handleStartCreate()}
            onEditInvitation={handleEditInvitation}
            onPreviewInvitation={handlePreviewInvitation}
            onShareInvitation={(inv) => {
              setSelectedInvitationForShare(inv);
              setShowShareModal(true);
            }}
            onRefreshList={refreshInvitations}
            onOpenPortal={(inv) => {
              setPortalInvitation(inv);
              setActiveView('host_portal');
            }}
            onOpenCardImage={(inv) => {
              setCardImageTargetInvitation(inv);
              setShowCardImageModal(true);
            }}
            onOpenPricing={(inv) => {
              setPricingTargetInvitation(inv);
              setShowPricingModal(true);
            }}
          />
        </React.Suspense>
      ) : (
        <main className="flex-grow">
          {/* Section 1: The Invitation Theatre (Hero Experience) */}
          <section id="hero">
            <CinematicHero
              currentLang={currentLang}
              onStartCreate={() => handleStartCreate()}
              onExploreDesigns={() => handleNavigateSection('atelier')}
              onOpenDemoPreview={handleOpenDemoPreview}
            />
          </section>

          {/* Section 2: "ماذا تريد أن يشعروا؟" (What Will They Feel?) */}
          <WhatWillTheyFeelSection
            currentLang={currentLang}
            onSelectMood={(mood) => {
              handleNavigateSection('atelier');
            }}
            onExploreTemplate={(tmpl) => {
              setSelectedTemplate(tmpl);
              setShowDetailModal(true);
            }}
          />

          {/* Section 3: The FRIDA Atelier (Template Showcase) */}
          <TemplateShowcase
            currentLang={currentLang}
            onSelectPreview={(tmpl) => {
              setSelectedTemplate(tmpl);
              setShowDetailModal(true);
            }}
            onStartCustomize={(tmpl) => handleStartCreate(tmpl)}
          />

          {/* Section 4: "ليست بطاقة. إنها تجربة." (Real Platform Capabilities) */}
          <section id="experience">
            <ExperienceFeaturesSection
              currentLang={currentLang}
              onExploreAtelier={() => handleNavigateSection('atelier')}
              onStartCreate={() => handleStartCreate()}
            />
          </section>

          {/* Section 5: "اللحظة التي تسبق 'نعم'" (The Moment Before "I Do") */}
          <MomentBeforeIDoSection
            currentLang={currentLang}
            onOpenLivePreview={handlePreviewInvitation}
            onStartCreate={() => handleStartCreate()}
          />

          {/* Section 6: "من فكرة إلى دعوة" (How It Works: 4 Scroll-Driven Steps) */}
          <section id="how-it-works">
            <HowItWorksSection
              currentLang={currentLang}
              onStartCreate={() => handleStartCreate()}
            />
          </section>

          {/* Section 7: "لحظات شاركوها معنا" (Real Verified Customer Reviews) */}
          <section id="reviews">
            <TestimonialsSection currentLang={currentLang} />
          </section>

          {/* Section 8: "كيف ستصل إليهم دعوتك؟" & Viral Loop & Final CTA */}
          <InvitationDistributionSection
            currentLang={currentLang}
            onStartCreate={() => handleStartCreate()}
          />

          {/* Section 9: "من مصر، لكل لحظة تستحق أن تُروى" (Brand Story) */}
          <section id="story">
            <BrandStorySection currentLang={currentLang} />
          </section>

          {/* Section 10: Occasion Categories */}
          <section id="categories">
            <CategoryGrid
              currentLang={currentLang}
              onSelectCategory={(category) => {
                const map: Record<string, OccasionType> = {
                  weddings: 'weddings',
                  engagements: 'engagements',
                  birthdays: 'birthdays',
                  corporate: 'graduation',
                };
                if (map[category]) {
                  setActiveOccasion(map[category]);
                  setActiveView('occasion');
                  window.history.pushState({}, '', `/occasions/${map[category]}`);
                } else {
                  handleNavigateSection('atelier');
                }
              }}
            />
          </section>

          {/* Section 11: FAQ */}
          <section id="faq">
            <FAQSection currentLang={currentLang} />
          </section>
        </main>
      )}

      {/* Global Luxury Footer */}
      <Footer
        currentLang={currentLang}
        onNavigateSection={handleNavigateSection}
        onStartCreate={() => handleStartCreate()}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenTrackOrder={() => setShowOrderStatusModal(true)}
      />

      {/* --- Global Modals (Lazy Loaded) --- */}
      <React.Suspense fallback={<LazyModalFallback />}>
        {showDetailModal && selectedTemplate && (
          <TemplateDetailModal
            template={selectedTemplate}
            currentLang={currentLang}
            onClose={() => setShowDetailModal(false)}
            onStartCustomize={() => {
              setShowDetailModal(false);
              handleStartCreate(selectedTemplate);
            }}
            onLivePreview={() => {
              setShowDetailModal(false);
              const sample: InvitationData = {
                id: `preview-${selectedTemplate.id}`,
                templateId: selectedTemplate.id,
                layoutType: selectedTemplate.layoutType || 'royal',
                title: selectedTemplate.title[currentLang],
                language: currentLang,
                themeStyle: selectedTemplate.themeStyle,
                customColors: selectedTemplate.defaultColors,
                customFont: selectedTemplate.defaultFont,
                eventDetails: {
                  ...selectedTemplate.defaultData,
                  musicTrackUrl: appAdminSettings?.defaultDemoTrackUrl || selectedTemplate.defaultData?.musicTrackUrl,
                  musicTrackName: appAdminSettings?.defaultDemoTrackName || selectedTemplate.defaultData?.musicTrackName,
                },
                status: 'published',
                createdAt: new Date().toISOString(),
                slug: `preview-${selectedTemplate.id}`,
              };
              handlePreviewInvitation(sample);
            }}
          />
        )}

        {showBuilderModal && (
          <InvitationBuilderModal
            currentLang={currentLang}
            initialTemplate={selectedTemplate || TEMPLATES[0]}
            existingInvitation={selectedInvitationForEdit}
            onClose={() => setShowBuilderModal(false)}
            onSaved={(invitation: InvitationData) => {
              saveInvitation(invitation);
              refreshInvitations();
              setShowBuilderModal(false);
              setPricingTargetInvitation(invitation);
              setShowPricingModal(true);
            }}
          />
        )}

        {showShareModal && (
          <ShareModal
            invitation={selectedInvitationForShare}
            currentLang={currentLang}
            onClose={() => setShowShareModal(false)}
            onOpenPricing={(inv) => {
              setShowShareModal(false);
              setPricingTargetInvitation(inv);
              setShowPricingModal(true);
            }}
          />
        )}

        {showAuthModal && (
          <AuthModal
            currentLang={currentLang}
            onClose={() => setShowAuthModal(false)}
            onOpenAdmin={() => setShowAdminModal(true)}
            onSuccess={(loggedUser, inv) => {
              setUser(loggedUser);
              if (inv) {
                setPortalInvitation(inv);
                setActiveView('host_portal');
              } else {
                setActiveView('dashboard');
              }
            }}
          />
        )}

        {showAdminModal && (
          <AdminOrdersDashboard
            currentLang={currentLang}
            onClose={() => {
              setShowAdminModal(false);
              getAdminSettingsCloud().then((res) => {
                if (res) setAppAdminSettings(res);
              });
            }}
            onPreviewInvitation={handlePreviewInvitation}
            onSettingsUpdated={(newSettings) => setAppAdminSettings(newSettings)}
          />
        )}

        {showPricingModal && (
          <PricingModal
            invitation={pricingTargetInvitation}
            currentLang={currentLang}
            onClose={() => setShowPricingModal(false)}
            onOrderSubmitted={() => {
              refreshInvitations();
            }}
          />
        )}

        {showCardImageModal && cardImageTargetInvitation && (
          <CardImageModal
            invitation={cardImageTargetInvitation}
            currentLang={currentLang}
            onClose={() => setShowCardImageModal(false)}
          />
        )}

        {showOrderStatusModal && (
          <OrderStatusModal
            currentLang={currentLang}
            initialOrderId={trackOrderId}
            onClose={() => {
              setShowOrderStatusModal(false);
              setTrackOrderId('');
            }}
          />
        )}
      </React.Suspense>

      {/* Analytics Cookie Consent Banner */}
      <CookieConsentBanner currentLang={currentLang} />
    </div>
  );
}
