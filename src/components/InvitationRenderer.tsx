import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  HelpCircle,
  Share2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Gift,
  Shirt,
  Send,
  X,
  UserCheck,
  Copy,
  Check,
  MessageCircle,
  QrCode,
  Users,
  Play,
  Pause,
  Maximize2,
  Sliders,
  ChevronDown,
  Image as ImageIcon,
  RotateCcw,
  Music,
  Disc3,
} from 'lucide-react';
import { InvitationData, Language, RSVPResponse, GuestWish, TemplateLayoutType, PaymentAccountType } from '../types';
import { saveRSVP, getStoredRSVPs } from '../lib/storage';
import { saveWishCloud, subscribeAdminSettingsCloud } from '../lib/firestoreService';
import { resolveAudioTrackUrl } from '../lib/audioStorage';
import { useTranslation } from '../data/translations';
import { trackRSVPSubmitted } from '../lib/analytics';
import { TEMPLATES, getMergedTemplates } from '../data/templates';
import { ShareModal } from './ShareModal';
import { CardImageModal } from './CardImageModal';
import { DemoMusicPickerModal } from './DemoMusicPickerModal';
import { PendingApprovalScreen } from './PendingApprovalScreen';
import { ExpiredInvitationScreen } from './ExpiredInvitationScreen';
import { ThemeEnvelopeScreen } from './ThemeEnvelopeScreen';
import { normalizeInvitation } from '../features/invitations/model/normalization';
import { InvitationEngine, LayoutLoadingFallback } from '../features/invitations/engine/InvitationEngine';
import { TemplateErrorBoundary } from '../features/invitations/engine/TemplateErrorBoundary';
import { TemplateLayoutProps } from '../features/invitations/model/templateContract';
import { generateQrCodeDataUrl } from '../lib/qrHelper';

const ClientQrCode: React.FC<{ urlOrData: string; alt?: string; className?: string }> = ({ urlOrData, alt = 'QR Code', className }) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (!urlOrData) return;
    let text = urlOrData;
    if (urlOrData.includes('data=')) {
      try {
        const urlObj = new URL(urlOrData);
        text = urlObj.searchParams.get('data') || urlOrData;
      } catch {
        // Fallback to raw text
      }
    }
    generateQrCodeDataUrl(text).then(setDataUrl);
  }, [urlOrData]);

  if (!dataUrl) {
    return <div className={`${className} bg-gray-200 animate-pulse rounded`} />;
  }

  return <img src={dataUrl} alt={alt} className={className} />;
};

interface InvitationRendererProps {
  invitation: InvitationData;
  userLang?: Language;
  currentLang?: Language;
  onBackToApp?: () => void;
  isStandaloneView?: boolean;
}

export const InvitationRenderer: React.FC<InvitationRendererProps> = ({
  invitation: rawInvitation,
  userLang,
  onBackToApp,
  isStandaloneView = false,
}) => {
  // Canonical Normalization guarantees no malformed Firestore doc or missing field crashes React
  const invitation = normalizeInvitation(rawInvitation, userLang);

  const lang = invitation.language || userLang || 'en';
  const t = useTranslation(lang);
  const isRtl = lang === 'ar';

  // Security Lock: Check 30-day Expiration
  const isExpired =
    invitation.status === 'expired' ||
    (Boolean(invitation.expiresAt) && new Date(invitation.expiresAt!).getTime() < Date.now());

  if (isExpired) {
    return <ExpiredInvitationScreen invitation={invitation} currentLang={lang} onGoHome={onBackToApp} />;
  }

  // Security Lock: If opened as standalone public URL and invitation is NOT published by admin yet
  if (isStandaloneView && invitation.status !== 'published') {
    return <PendingApprovalScreen invitation={invitation} currentLang={lang} />;
  }

  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // Floating Demo Music Selector States
  const [showMusicPickerModal, setShowMusicPickerModal] = useState(false);
  const [activeMusicUrl, setActiveMusicUrl] = useState<string>(
    invitation.eventDetails.musicTrackUrl || ''
  );
  const [activeMusicName, setActiveMusicName] = useState<string>(
    invitation.eventDetails.musicTrackName || (isRtl ? 'معزوفة زفاف فريدا الملكية' : 'FRIDA Royal Waltz')
  );
  const [musicToastMessage, setMusicToastMessage] = useState<string | null>(null);

  // Determine if this is a demo or preview invitation
  const isDemoInvitation =
    !isStandaloneView ||
    invitation.id.startsWith('preview-') ||
    invitation.id.startsWith('demo-') ||
    Boolean(invitation.slug?.startsWith('preview-')) ||
    Boolean(invitation.slug?.startsWith('demo-')) ||
    invitation.hostAccessCode === 'HOST-DEMO' ||
    invitation.hostAccessCode === 'HOST-PREVIEW';

  // Synchronize with Admin Default Demo Track for demo invitations and invitations without custom tracks
  useEffect(() => {
    const unsub = subscribeAdminSettingsCloud((settings) => {
      if (settings?.defaultDemoTrackUrl) {
        if (isDemoInvitation || !invitation.eventDetails.musicTrackUrl) {
          setActiveMusicUrl((current) => current || settings.defaultDemoTrackUrl!);
          setActiveMusicName((current) => (current === (isRtl ? 'معزوفة زفاف فريدا الملكية' : 'FRIDA Royal Waltz') ? (settings.defaultDemoTrackName || current) : current));
        }
      }
    });
    return () => unsub();
  }, [isDemoInvitation, invitation.eventDetails.musicTrackUrl, isRtl]);

  // Synchronize invitation eventDetails with selected music
  invitation.eventDetails.musicTrackUrl = activeMusicUrl;
  invitation.eventDetails.musicTrackName = activeMusicName;

  // Auto-dismiss music toast
  useEffect(() => {
    if (!musicToastMessage) return;
    const timer = setTimeout(() => {
      setMusicToastMessage(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [musicToastMessage]);

  const handleSelectDemoTrack = (newTrackUrl: string, newTrackName: string) => {
    setActiveMusicUrl(newTrackUrl);
    setActiveMusicName(newTrackName);
    setEnvelopeOpened(true);
    setIsPlayingMusic(true);
    setMusicToastMessage(
      isRtl ? `تم تفعيل المعزوفة: ${newTrackName} 🎶` : `Soundtrack Activated: ${newTrackName} 🎶`
    );
  };

  // Auto-Scroll Motion State (Starts automatically by default)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [hasCompletedScroll, setHasCompletedScroll] = useState(false);
  const autoScrollRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Helper to find parent scrollable container if rendered inside preview box or modal
  const getScrollContainer = (): HTMLElement | null => {
    if (!rootRef.current) return null;
    let parent = rootRef.current.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  // Lightbox Image Preview State
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);

  // Guest Personalization from URL
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const guestNameParam = searchParams?.get('guest') || null;
  const tableParam = searchParams?.get('table') || null;
  const seatsParam = searchParams?.get('seats') || null;

  // RSVP Form Modal State
  const [showRsvpModal, setShowRsvpModal] = useState(false);
  const [rsvpGuestName, setRsvpGuestName] = useState(guestNameParam || '');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'declined' | 'maybe'>('attending');
  const [rsvpGuestCount, setRsvpGuestCount] = useState(seatsParam ? Math.max(1, parseInt(seatsParam, 10)) : 1);
  const [rsvpPlusOneName, setRsvpPlusOneName] = useState('');
  const [rsvpDietaryNotes, setRsvpDietaryNotes] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpLimitError, setRsvpLimitError] = useState<string | null>(null);

  // Bank Gift Registry Modal State
  const [showBankModal, setShowBankModal] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // Guestbook Wishes State
  const [wishes, setWishes] = useState<GuestWish[]>(
    invitation.eventDetails.wishesList || [
      {
        id: 'w1',
        invitationId: invitation.id,
        authorName: isRtl ? 'د. فيصل الصباح' : 'Dr. Faisal Al-Sabah',
        relationship: isRtl ? 'صديق العائلة' : 'Family Friend',
        message: isRtl
          ? 'بارك الله لكما وبارك عليكما وجمع بينكما في خير. ألف مبروك!'
          : 'Wishing you a lifetime of joy, love, and eternal happiness together!',
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]
  );
  const [newWishAuthor, setNewWishAuthor] = useState('');
  const [newWishRelation, setNewWishRelation] = useState('');
  const [newWishMessage, setNewWishMessage] = useState('');
  const [wishSuccess, setWishSuccess] = useState(false);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(
      `${invitation.eventDetails.eventDate}T${invitation.eventDetails.eventTime || '19:00'}`
    ).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [invitation.eventDetails.eventDate, invitation.eventDetails.eventTime]);

  // Audio setup - resolves cloud/local/remote audio tracks reliably across mobile & desktop
  useEffect(() => {
    const rawTrackUrl = activeMusicUrl;
    if (!rawTrackUrl) {
      setAudioRef(null);
      setIsPlayingMusic(false);
      return;
    }

    let isCancelled = false;
    let createdAudio: HTMLAudioElement | null = null;

    resolveAudioTrackUrl(rawTrackUrl).then((playableUrl) => {
      if (isCancelled || !playableUrl) return;

      createdAudio = new Audio(playableUrl);
      createdAudio.preload = 'auto';
      createdAudio.loop = true;
      createdAudio.volume = 0.45;
      setAudioRef(createdAudio);

      if (envelopeOpened) {
        createdAudio
          .play()
          .then(() => setIsPlayingMusic(true))
          .catch((err) => {
            console.warn('Autoplay prevented by browser, waiting for user touch gesture:', err);
            setIsPlayingMusic(false);
          });
      }
    });

    return () => {
      isCancelled = true;
      if (createdAudio) {
        createdAudio.pause();
        createdAudio.src = '';
      }
    };
  }, [activeMusicUrl]);

  // Trigger audio playback when envelope opens or when user toggles music
  useEffect(() => {
    if (!audioRef) return;

    if (envelopeOpened && isPlayingMusic) {
      audioRef.play().then(() => setIsPlayingMusic(true)).catch(() => setIsPlayingMusic(false));
    } else if (!isPlayingMusic) {
      audioRef.pause();
    }
  }, [envelopeOpened, isPlayingMusic, audioRef]);

  // Universal first user interaction gesture listener to smoothly start audio on strict mobile browsers
  useEffect(() => {
    const handleFirstUserGesture = () => {
      if (audioRef && (envelopeOpened || !invitation.layoutType || invitation.layoutType === 'minimalist') && audioRef.paused) {
        audioRef
          .play()
          .then(() => setIsPlayingMusic(true))
          .catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstUserGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstUserGesture, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstUserGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstUserGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener('click', handleFirstUserGesture);
      window.removeEventListener('touchstart', handleFirstUserGesture);
      window.removeEventListener('scroll', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
    };
  }, [audioRef, envelopeOpened, invitation.layoutType]);

  // Ensure the page always starts at the very top (scrollTop = 0) upon opening
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
    setHasCompletedScroll(false);
  }, [invitation.id]);

  // Pause auto-scroll on user wheel or deliberate touch drag (with grace period for iPhone tap release)
  useEffect(() => {
    if (!isAutoScrolling || !envelopeOpened) return;

    // Grace period of 1200ms after opening envelope so finger release / tap gestures on iPhone do NOT cancel auto-scroll
    const openTimestamp = Date.now();
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Ignore if within initial grace period
      if (Date.now() - openTimestamp < 1200) return;

      if (e.touches && e.touches[0]) {
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        // Only pause if deliberate user swipe (> 12px)
        if (deltaY > 12) {
          setIsAutoScrolling(false);
        }
      }
    };

    const handleWheel = () => {
      if (Date.now() - openTimestamp < 1200) return;
      setIsAutoScrolling(false);
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isAutoScrolling, envelopeOpened]);

  // Handle Smooth Auto-Scrolling Motion (Works identically across iPhone iOS Safari & Android at 60/120fps)
  useEffect(() => {
    if (isAutoScrolling && envelopeOpened) {
      let lastTimestamp: number | null = null;
      let scrollAcc = 0;

      const step = (timestamp: number) => {
        if (!lastTimestamp) {
          lastTimestamp = timestamp;
          autoScrollRef.current = requestAnimationFrame(step);
          return;
        }

        const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
        lastTimestamp = timestamp;

        const scrollContainer = getScrollContainer();
        if (scrollContainer) {
          const currentY = scrollContainer.scrollTop;
          const maxY = scrollContainer.scrollHeight - scrollContainer.clientHeight;

          // Only terminate if page has actually loaded completely (> 300px) and reached the very bottom
          if (maxY > 300 && currentY >= maxY - 10) {
            setIsAutoScrolling(false);
            setHasCompletedScroll(true);
            return;
          }

          const speed = maxY > 300 ? Math.max(maxY / 60, 50) : 60;
          scrollAcc += speed * dt;

          if (scrollAcc >= 1) {
            const toScroll = Math.floor(scrollAcc);
            scrollAcc -= toScroll;
            scrollContainer.scrollTop += toScroll;
          }
        } else {
          const scrollEl = document.scrollingElement || document.documentElement || document.body;
          const currentY = scrollEl.scrollTop || window.scrollY || 0;
          const totalHeight = scrollEl.scrollHeight || Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
          const maxY = totalHeight - window.innerHeight;

          if (maxY > 300 && currentY >= maxY - 10) {
            setIsAutoScrolling(false);
            setHasCompletedScroll(true);
            return;
          }

          const speed = maxY > 300 ? Math.max(maxY / 60, 50) : 60;
          scrollAcc += speed * dt;

          if (scrollAcc >= 1) {
            const toScroll = Math.floor(scrollAcc);
            scrollAcc -= toScroll;
            scrollEl.scrollTop += toScroll;
          }
        }

        autoScrollRef.current = requestAnimationFrame(step);
      };

      autoScrollRef.current = requestAnimationFrame(step);
    } else {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    }

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [isAutoScrolling, envelopeOpened]);

  const handleRestartScroll = () => {
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setHasCompletedScroll(false);
    setIsAutoScrolling(true);
  };

  const toggleMusic = () => {
    if (!audioRef) return;
    if (isPlayingMusic) {
      audioRef.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  };

  const handleOpenEnvelope = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const scrollContainer = getScrollContainer();
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
    setEnvelopeOpened(true);
    setIsAutoScrolling(true);
    setIsPlayingMusic(true);
    if (audioRef) {
      audioRef
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {});
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpGuestName.trim()) return;

    // Check Plan Tier Limit (Basic Package: Max 50 RSVPs)
    const tier = invitation.planTier || 'basic';
    if (tier === 'basic') {
      const currentRsvps = getStoredRSVPs(invitation.id);
      if (currentRsvps.length >= 50) {
        setRsvpLimitError(
          isRtl
            ? 'عذراً، وصلت هذه الدعوة للحد الأقصى لردود الحضور (50 معزوم) المتاحة للباقة الأساسية. يرجى التواصل مع العريس/العروس للترقية للباقة الملكية.'
            : 'This basic invitation has reached its 50 RSVP limit. Please contact the host to upgrade.'
        );
        return;
      }
    }

    setRsvpLimitError(null);

    saveRSVP({
      invitationId: invitation.id,
      guestName: rsvpGuestName,
      email: rsvpEmail,
      phone: rsvpPhone,
      status: rsvpStatus,
      guestCount: rsvpStatus === 'attending' ? rsvpGuestCount : 0,
      plusOneName: rsvpPlusOneName,
      dietaryNotes: rsvpDietaryNotes,
    });

    // Zero-PII analytics tracking for guest RSVP submission
    trackRSVPSubmitted(invitation.id, rsvpStatus, rsvpStatus === 'attending' ? rsvpGuestCount : 0);

    setRsvpSuccess(true);
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSuccess(false);
    }, 2500);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishAuthor.trim() || !newWishMessage.trim()) return;

    const wishObj: GuestWish = {
      id: `w-${Date.now()}`,
      invitationId: invitation.id,
      authorName: newWishAuthor,
      relationship: newWishRelation,
      message: newWishMessage,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setWishes([wishObj, ...wishes]);
    setNewWishAuthor('');
    setNewWishRelation('');
    setNewWishMessage('');
    setWishSuccess(true);

    // If it's a real published invitation, sync wish to Cloud Firestore
    if (!invitation.id.startsWith('preview-') && !invitation.id.startsWith('demo-')) {
      saveWishCloud(invitation.id, wishObj).catch((e) => console.warn('Wish cloud sync failed:', e));
    }

    setTimeout(() => setWishSuccess(false), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAcc(id);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  const getGoogleCalendarUrl = () => {
    const details = invitation.eventDetails;
    const title = encodeURIComponent(details.eventTitle);
    const dateStr = details.eventDate.replace(/-/g, '');
    const venue = encodeURIComponent(`${details.venueName}, ${details.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}T190000Z/${dateStr}T220000Z&location=${venue}`;
  };

  const customColors = invitation.customColors || {
    bg: '#171717',
    cardBg: '#1f1e1b',
    text: '#F7F4EE',
    accent: '#B99A65',
  };

  const details = invitation.eventDetails;

  const renderTemplateLayout = () => {
    const layoutProps: TemplateLayoutProps = {
      invitation,
      lang,
      isRtl,
      t,
      customColors,
      timeLeft,
      wishes,
      onOpenRsvp: () => setShowRsvpModal(true),
      onOpenBank: () => setShowBankModal(true),
      onAddWish: handleAddWish,
      newWishAuthor,
      setNewWishAuthor,
      newWishRelation,
      setNewWishRelation,
      newWishMessage,
      setNewWishMessage,
      wishSuccess,
      setActiveLightboxImg,
      getGoogleCalendarUrl,
    };

    const rawLayout: TemplateLayoutType =
      invitation.layoutType ||
      (invitation.templateId.includes('butterfly')
        ? 'butterflyRomance'
        : invitation.templateId.includes('arabic')
        ? 'arabic'
        : invitation.templateId.includes('floral') || invitation.templateId.includes('botanical')
        ? 'floral'
        : invitation.templateId.includes('boho')
        ? 'boho'
        : invitation.templateId.includes('interactive')
        ? 'interactive'
        : invitation.templateId.includes('playful')
        ? 'playful'
        : invitation.templateId.includes('burgundy')
        ? 'burgundy'
        : invitation.templateId.includes('crystal')
        ? 'crystal'
        : invitation.templateId.includes('cherry')
        ? 'cherry'
        : invitation.templateId.includes('baroque')
        ? 'baroque'
        : invitation.templateId.includes('citrus')
        ? 'citrus'
        : invitation.templateId.includes('confetti')
        ? 'confetti'
        : invitation.templateId.includes('emerald')
        ? 'emerald'
        : invitation.templateId.includes('ocean')
        ? 'ocean'
        : invitation.templateId.includes('autumn')
        ? 'autumn'
        : invitation.templateId.includes('starlit')
        ? 'starlit'
        : invitation.templateId.includes('lace')
        ? 'lace'
        : invitation.templateId.includes('cinematic')
        ? 'cinematic'
        : invitation.templateId.includes('minimal')
        ? 'minimalist'
        : 'royal');

    return <InvitationEngine layoutType={rawLayout} props={layoutProps} />;
  };

  return (
    <div
      ref={rootRef}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen text-[#F7F4EE] relative overflow-x-hidden font-sans-body transition-colors duration-500 selection:bg-[#B99A65] selection:text-[#171717]"
      style={{ backgroundColor: customColors.bg }}
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] blur-[150px] opacity-20 pointer-events-none"
        style={{ backgroundColor: customColors.accent }}
      />

      {/* Floating Control Bar: Auto-Scroll, Audio Player, Navigation */}
      <div className="fixed top-4 left-4 right-4 z-40 max-w-4xl mx-auto flex items-center justify-between gap-2">
        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="px-3.5 py-1.5 rounded-full bg-[#171717]/90 backdrop-blur-md border border-[#B99A65]/40 text-xs font-semibold text-[#F7F4EE] hover:bg-[#B99A65] hover:text-[#171717] transition-all cursor-pointer shadow-lg"
          >
            ← {isRtl ? 'العودة لـ فريدا' : 'Back to FRIDA'}
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Play/Pause Auto-Scroll Toggle Button */}
          {envelopeOpened && (
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171717]/80 backdrop-blur-md border border-[#B99A65]/40 text-xs font-semibold text-[#F7F4EE] hover:border-[#B99A65] transition-all cursor-pointer shadow-lg"
              title={
                isAutoScrolling
                  ? isRtl ? 'إيقاف التمرير التلقائي مؤقتاً' : 'Pause Auto-Scroll'
                  : isRtl ? 'استئناف التمرير التلقائي' : 'Resume Auto-Scroll'
              }
            >
              {isAutoScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#B99A65]" />
                  <span className="hidden sm:inline">{isRtl ? 'إيقاف التمرير' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#B99A65]" />
                  <span className="hidden sm:inline">{isRtl ? 'تمرير تلقائي' : 'Auto Scroll'}</span>
                </>
              )}
            </button>
          )}

          {/* Replay Auto-Scroll Button (Hidden while auto-scrolling, appears ONLY after reaching bottom) */}
          {envelopeOpened && hasCompletedScroll && !isAutoScrolling && (
            <button
              onClick={handleRestartScroll}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#B99A65] text-[#171717] border border-[#B99A65] text-xs font-bold shadow-lg transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(185,154,101,0.5)] animate-bounce"
              title={isRtl ? 'إعادة التمرير التلقائي' : 'Replay Auto-Scroll'}
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#171717]" />
              <span>{isRtl ? 'إعادة التمرير 🔄' : 'Replay 🔄'}</span>
            </button>
          )}

          {/* Music Audio Control Button */}
          {(activeMusicUrl || details.musicTrackUrl) && (
            <button
              onClick={toggleMusic}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717]/80 backdrop-blur-md border border-[#B99A65]/40 text-xs font-medium text-[#F7F4EE] hover:border-[#B99A65] transition-all cursor-pointer shadow-lg"
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#B99A65] animate-pulse" />
                  <span>{isRtl ? 'إيقاف الصوت' : 'Music On'}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-[#8D8A84]" />
                  <span>{isRtl ? 'تشغيل الموسيقى' : 'Play Music'}</span>
                </>
              )}
            </button>
          )}

          {/* Cute Demo Music Selector Quick Button in Top Bar (Icon only) */}
          {isDemoInvitation && (
            <button
              onClick={() => setShowMusicPickerModal(true)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E1B16] to-[#2E271D] hover:from-[#B99A65]/30 hover:to-[#D4AF37]/40 backdrop-blur-md border border-[#D4AF37]/60 hover:border-[#D4AF37] text-[#E6C687] hover:text-[#FFFFFF] flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              title={isRtl ? 'اختيار وتجربة معزوفة أخرى 🎵' : 'Select another soundtrack 🎵'}
              aria-label={isRtl ? 'اختيار الموسيقى' : 'Select Music'}
            >
              <Disc3 className="w-4 h-4 text-[#D4AF37] animate-[spin_6s_linear_infinite]" />
            </button>
          )}

          {/* Static Card Image View - Hidden on live standalone guest views */}
          {(!isStandaloneView || isDemoInvitation) && (
            <button
              onClick={() => setShowCardModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171717]/80 backdrop-blur-md border border-[#333] hover:border-[#B99A65] text-xs font-semibold text-[#E9E1D5] hover:text-[#B99A65] transition-all cursor-pointer shadow-lg"
              title={isRtl ? 'كرت صورة ثابت للواتساب والطباعة' : 'Static Card Graphic'}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#B99A65]" />
              <span className="hidden sm:inline">{isRtl ? 'كرت صورة' : 'Card'}</span>
            </button>
          )}

          {/* Share Invitation Link Button - Hidden on live standalone guest views */}
          {(!isStandaloneView || isDemoInvitation) && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171717]/90 backdrop-blur-md border border-[#B99A65] text-xs font-bold text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] transition-all cursor-pointer shadow-lg"
              title={isRtl ? 'مشاركة ونسخ رابط الدعوة' : 'Share & Copy Invitation Link'}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'مشاركة الرابط 🔗' : 'Share Link 🔗'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Unseal Envelope Entry Screen */}
      <AnimatePresence>
        {!envelopeOpened && (
          <ThemeEnvelopeScreen
            invitation={invitation}
            guestNameParam={guestNameParam}
            isRtl={isRtl}
            onOpen={handleOpenEnvelope}
          />
        )}
      </AnimatePresence>

      {/* Main Digital Invitation Suite Content */}
      <div className="max-w-3xl mx-auto px-4 py-20 relative z-10 space-y-16">
        {guestNameParam && (
          <div className="max-w-xl mx-auto px-5 py-4 bg-gradient-to-r from-[#1F1E1B]/95 via-[#292621]/95 to-[#1F1E1B]/95 border border-[#B99A65]/70 rounded-2xl text-center shadow-[0_4px_30px_rgba(185,154,101,0.25)] backdrop-blur-md animate-in fade-in slide-in-from-top-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B99A65] to-transparent" />
            <span className="text-[11px] font-bold text-[#B99A65] uppercase tracking-wider block mb-1">
              {isRtl ? '👑 دعوة ملكية خاصة موجهة إلى:' : '👑 Royal Invitation Specially For:'}
            </span>
            <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE] tracking-wide">
              {guestNameParam}
            </h3>
            {(tableParam || seatsParam) && (
              <div className="flex items-center justify-center gap-3 text-xs text-[#E9E1D5] mt-2 pt-2 border-t border-[#B99A65]/30">
                {tableParam && (
                  <span className="bg-[#B99A65]/20 text-[#B99A65] font-semibold px-3 py-0.5 rounded-full border border-[#B99A65]/40">
                    {isRtl ? `طاولة رقم: ${tableParam}` : `Table: ${tableParam}`}
                  </span>
                )}
                {seatsParam && (
                  <span className="bg-[#B99A65]/20 text-[#B99A65] font-semibold px-3 py-0.5 rounded-full border border-[#B99A65]/40">
                    {isRtl ? `عدد المقاعد: ${seatsParam}` : `Reserved Seats: ${seatsParam}`}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
        {renderTemplateLayout()}
      </div>

      {/* Lightbox Fullscreen Image Preview */}
      {activeLightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in">
          <button
            onClick={() => setActiveLightboxImg(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-white hover:text-[#B99A65] cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={activeLightboxImg}
            alt="Enlarged preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-[#B99A65]/40"
          />
        </div>
      )}

      {/* Bank Details Modal */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowBankModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center border-b border-[#333] pb-4">
              <Gift className="w-8 h-8 text-[#B99A65] mx-auto mb-2" />
              <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
                {isRtl ? 'تفاصيل الحسابات والتبريكات' : 'Bank Accounts & QR Registry'}
              </h3>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Flexible Payment Accounts (Vodafone Cash, InstaPay, Bank Transfer, Wallets) */}
              {details.paymentAccounts && details.paymentAccounts.length > 0 ? (
                details.paymentAccounts.map((acc, index) => {
                  const getAccountTypeBadge = (type: PaymentAccountType) => {
                    switch (type) {
                      case 'vodafone_cash':
                        return { label: isRtl ? 'فودافون كاش / محفظة هاتف' : 'Vodafone Cash / Phone Wallet', color: 'bg-red-500/20 text-red-400 border-red-500/40', icon: '📱' };
                      case 'instapay':
                        return { label: isRtl ? 'إنستا باي (InstaPay)' : 'InstaPay Account', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: '⚡' };
                      case 'bank_transfer':
                        return { label: isRtl ? 'تحويل بنكي (IBAN)' : 'Bank Transfer (IBAN)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: '🏦' };
                      case 'e_wallet':
                        return { label: isRtl ? 'محفظة إلكترونية' : 'E-Wallet', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: '💳' };
                      default:
                        return { label: isRtl ? 'طريقة تهادي إلكترونية' : 'Other Payment Method', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: '🎁' };
                    }
                  };

                  const badge = getAccountTypeBadge(acc.type);

                  return (
                    <div key={acc.id || index} className="bg-[#1F1E1B] p-5 rounded-2xl border border-[#B99A65]/35 space-y-3 shadow-md">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${badge.color}`}>
                          <span>{badge.icon}</span>
                          <span>{badge.label}</span>
                        </span>
                        {acc.accountHolder && (
                          <span className="text-xs text-[#E9E1D5] font-semibold">{acc.accountHolder}</span>
                        )}
                      </div>

                      <div className="text-xs space-y-1">
                        <p className="font-bold text-[#F7F4EE] text-sm">{acc.title}</p>
                        {acc.notes && <p className="text-[11px] text-[#8D8A84] italic">{acc.notes}</p>}
                      </div>

                      <div className="flex items-center justify-between bg-[#171717] p-3 rounded-xl border border-[#333]">
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-[#B99A65] truncate select-all">
                          {acc.accountNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(acc.accountNumber, `acc-${index}`)}
                          className="px-3 py-1.5 rounded-lg bg-[#B99A65] text-[#171717] font-bold text-xs hover:bg-[#d6bd91] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {copiedAcc === `acc-${index}` ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'تم النسخ!' : 'Copied!'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'نسخ الرقم' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {acc.qrCodeUrl && (
                        <div className="pt-2 text-center bg-[#171717] p-3 rounded-xl border border-[#333]">
                          <p className="text-[10px] text-[#8D8A84] mb-1.5">{isRtl ? 'مسح رمز QR للتحويل السريع:' : 'Scan QR Code for direct transfer:'}</p>
                          <ClientQrCode urlOrData={acc.qrCodeUrl} alt={acc.title} className="w-32 h-32 mx-auto rounded-xl border border-[#333] shadow-md" />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                /* Fallback for legacy groom/bride bank details */
                <>
                  {details.bankDetailsGroom && (
                    <div className="bg-[#1F1E1B] p-5 rounded-2xl border border-[#B99A65]/30 space-y-3">
                      <span className="text-[10px] tracking-widest text-[#B99A65] font-bold uppercase block">
                        {isRtl ? 'حساب العريس' : 'Groom Account'}
                      </span>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-[#F7F4EE]">{details.bankDetailsGroom.bankName}</p>
                        <p className="text-[#8D8A84]">{details.bankDetailsGroom.accountHolder}</p>
                      </div>
                      <div className="flex items-center justify-between bg-[#171717] p-2.5 rounded-xl border border-[#333]">
                        <span className="font-mono text-xs font-bold text-[#B99A65] truncate">
                          {details.bankDetailsGroom.accountNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(details.bankDetailsGroom!.accountNumber, 'groom')}
                          className="p-1.5 rounded-lg bg-[#1F1E1B] text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] transition-all cursor-pointer"
                        >
                          {copiedAcc === 'groom' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      {details.bankDetailsGroom.qrCodeUrl && (
                        <div className="pt-2 text-center">
                          <ClientQrCode urlOrData={details.bankDetailsGroom.qrCodeUrl} alt="Groom QR" className="w-32 h-32 mx-auto rounded-xl border border-[#333]" />
                        </div>
                      )}
                    </div>
                  )}

                  {details.bankDetailsBride && (
                    <div className="bg-[#1F1E1B] p-5 rounded-2xl border border-[#B99A65]/30 space-y-3">
                      <span className="text-[10px] tracking-widest text-[#B99A65] font-bold uppercase block">
                        {isRtl ? 'حساب العروس' : 'Bride Account'}
                      </span>
                      <div className="text-xs space-y-1">
                        <p className="font-bold text-[#F7F4EE]">{details.bankDetailsBride.bankName}</p>
                        <p className="text-[#8D8A84]">{details.bankDetailsBride.accountHolder}</p>
                      </div>
                      <div className="flex items-center justify-between bg-[#171717] p-2.5 rounded-xl border border-[#333]">
                        <span className="font-mono text-xs font-bold text-[#B99A65] truncate">
                          {details.bankDetailsBride.accountNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(details.bankDetailsBride!.accountNumber, 'bride')}
                          className="p-1.5 rounded-lg bg-[#1F1E1B] text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] transition-all cursor-pointer"
                        >
                          {copiedAcc === 'bride' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      {details.bankDetailsBride.qrCodeUrl && (
                        <div className="pt-2 text-center">
                          <ClientQrCode urlOrData={details.bankDetailsBride.qrCodeUrl} alt="Bride QR" className="w-32 h-32 mx-auto rounded-xl border border-[#333]" />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RSVP Modal */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setShowRsvpModal(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65]"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65] mx-auto animate-bounce">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
                  {t.invitationCard.rsvpSuccessTitle}
                </h3>
                <p className="text-xs text-[#8D8A84]">
                  {t.invitationCard.rsvpSuccessDesc}
                </p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <div className="text-center pb-2 border-b border-[#333]">
                  <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
                    {t.invitationCard.rsvpCTA}
                  </h3>
                  <p className="text-xs text-[#8D8A84] mt-1">
                    {details.eventTitle}
                  </p>
                </div>

                {rsvpLimitError && (
                  <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs text-center leading-relaxed">
                    {rsvpLimitError}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('attending')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border cursor-pointer transition-all ${
                      rsvpStatus === 'attending'
                        ? 'bg-[#B99A65] text-[#171717] border-[#B99A65]'
                        : 'bg-[#1F1E1B] text-[#8D8A84] border-[#333]'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t.invitationCard.attending}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpStatus('maybe')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border cursor-pointer transition-all ${
                      rsvpStatus === 'maybe'
                        ? 'bg-[#B99A65] text-[#171717] border-[#B99A65]'
                        : 'bg-[#1F1E1B] text-[#8D8A84] border-[#333]'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>{t.invitationCard.maybe}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRsvpStatus('declined')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border cursor-pointer transition-all ${
                      rsvpStatus === 'declined'
                        ? 'bg-[#B99A65] text-[#171717] border-[#B99A65]'
                        : 'bg-[#1F1E1B] text-[#8D8A84] border-[#333]'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t.invitationCard.declined}</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#8D8A84] mb-1">
                      {t.invitationCard.guestName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={rsvpGuestName}
                      onChange={(e) => setRsvpGuestName(e.target.value)}
                      placeholder="e.g. Abdullah Al-Mansoor"
                      className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#8D8A84] mb-1">
                        {t.invitationCard.guestPhone}
                      </label>
                      <input
                        type="tel"
                        value={rsvpPhone}
                        onChange={(e) => setRsvpPhone(e.target.value)}
                        placeholder="+966 50 000 0000"
                        className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#8D8A84] mb-1">
                        {t.invitationCard.guestCount}
                      </label>
                      <select
                        value={rsvpGuestCount}
                        onChange={(e) => setRsvpGuestCount(Number(e.target.value))}
                        disabled={rsvpStatus !== 'attending'}
                        className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                      >
                        <option value={1}>1 Guest</option>
                        <option value={2}>2 Guests</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8D8A84] mb-1">
                      {t.invitationCard.dietaryNotes}
                    </label>
                    <textarea
                      rows={2}
                      value={rsvpDietaryNotes}
                      onChange={(e) => setRsvpDietaryNotes(e.target.value)}
                      placeholder="Any allergies or special requirements..."
                      className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:bg-[#d6bd91] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.invitationCard.submitRSVP}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Share Invitation Modal */}
      {showShareModal && (
        <ShareModal
          invitation={invitation}
          currentLang={lang}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Static Printable Invitation Card Modal */}
      {showCardModal && (
        <CardImageModal
          invitation={invitation}
          currentLang={lang}
          onClose={() => setShowCardModal(false)}
        />
      )}

      {/* Floating Demo Music Selector Cute Button (FAB - Icon Only, No Text) */}
      {isDemoInvitation && (
        <div className="fixed bottom-6 start-6 z-50 pointer-events-auto">
          <motion.button
            whileHover={{ scale: 1.12, rotate: 6 }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            onClick={() => setShowMusicPickerModal(true)}
            className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center cursor-pointer group shadow-[0_8px_30px_rgba(0,0,0,0.65),0_0_22px_rgba(212,175,55,0.4)] hover:shadow-[0_12px_45px_rgba(212,175,55,0.7)] transition-all duration-300 border-2 border-[#D4AF37]/80 hover:border-[#FFF1C5] bg-gradient-to-tr from-[#1E1B16] via-[#2D2417] to-[#1A1713]"
            title={isRtl ? 'اختر معزوفة لتجربتها على هذه الدعوة 🎵' : 'Pick a soundtrack for this invitation 🎵'}
            aria-label={isRtl ? 'اختيار معزوفة الدعوة' : 'Select invitation soundtrack'}
          >
            {/* Cute ambient glow aura */}
            <span className="absolute inset-0 rounded-full bg-[#D4AF37] opacity-20 animate-ping pointer-events-none" />

            {/* Glossy top-left highlight for cute 3D bubble reflection */}
            <span className="absolute top-1.5 left-2.5 w-4 h-2 rounded-full bg-white/30 blur-[1px] -rotate-45 pointer-events-none" />

            {/* Cute Music & Vinyl Icon */}
            <div className="relative flex items-center justify-center text-[#E6C687] group-hover:text-[#FFF5DC] transition-colors">
              <Disc3 className="w-7 h-7 sm:w-8 sm:h-8 animate-[spin_8s_linear_infinite] drop-shadow-[0_2px_8px_rgba(212,175,55,0.5)]" />
              <Music className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-[#F3E5AB] fill-current animate-bounce drop-shadow" />
            </div>

            {/* Cute sparkle badge */}
            <span className="absolute -top-1 -left-1 text-[11px] leading-none animate-pulse select-none pointer-events-none">
              ✨
            </span>
          </motion.button>
        </div>
      )}

      {/* Toast Notification when changing soundtrack */}
      <AnimatePresence>
        {musicToastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            className="fixed bottom-24 start-6 z-50 max-w-sm px-4 py-2.5 rounded-2xl bg-[#1A1815]/95 backdrop-blur-xl border border-[#B99A65] text-[#F7F4EE] text-xs font-semibold shadow-[0_15px_40px_rgba(0,0,0,0.9)] flex items-center gap-2.5 pointer-events-none"
          >
            <div className="w-6 h-6 rounded-full bg-[#B99A65]/20 text-[#B99A65] flex items-center justify-center shrink-0">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span className="truncate">{musicToastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Demo Music Picker Modal */}
      <DemoMusicPickerModal
        isOpen={showMusicPickerModal}
        onClose={() => setShowMusicPickerModal(false)}
        currentLang={lang}
        activeTrackUrl={activeMusicUrl}
        activeTrackName={activeMusicName}
        onSelectTrack={handleSelectDemoTrack}
      />

    </div>
  );
};
