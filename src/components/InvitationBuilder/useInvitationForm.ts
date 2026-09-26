import { useState, useRef, useEffect } from 'react';
import {
  Template,
  InvitationData,
  Language,
  EventDetails,
  CustomThemeColors,
  PaymentAccount,
  PaymentAccountType,
} from '../../types';
import { TEMPLATES } from '../../data/templates';
import { saveInvitation } from '../../lib/storage';
import { saveInvitationCloud } from '../../lib/firestoreService';
import { ensureAnonymousAuth } from '../../lib/firebase';
import { resolveAudioTrackUrl } from '../../lib/audioStorage';
import {
  MusicTrack,
  getAllAvailableTracks,
  subscribeCloudMusicLibrary,
} from '../../data/presetMusic';

interface UseInvitationFormProps {
  initialTemplate?: Template | null;
  existingInvitation?: InvitationData | null;
  currentLang: Language;
  onSaved: (invitation: InvitationData) => void;
}

export function useInvitationForm({
  initialTemplate,
  existingInvitation,
  currentLang,
  onSaved,
}: UseInvitationFormProps) {
  const isRtl = currentLang === 'ar';

  const [currentStep, setCurrentStep] = useState<number>(existingInvitation ? 2 : 1);

  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    initialTemplate ||
      TEMPLATES.find((t) => t.id === existingInvitation?.templateId) ||
      TEMPLATES[0]
  );

  const [invitationLanguage, setInvitationLanguage] = useState<Language>(
    existingInvitation?.language || currentLang
  );

  const [invitationTitle, setInvitationTitle] = useState<string>(
    existingInvitation?.title || selectedTemplate.title[currentLang]
  );

  const [eventDetails, setEventDetails] = useState<EventDetails>(
    existingInvitation?.eventDetails || { ...selectedTemplate.defaultData }
  );

  const [themeColors, setThemeColors] = useState<CustomThemeColors>(
    existingInvitation?.customColors || { ...selectedTemplate.defaultColors }
  );

  const [customFont, setCustomFont] = useState<string>(
    existingInvitation?.customFont || selectedTemplate.defaultFont
  );

  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [publishedLink, setPublishedLink] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Payment Account Form State (Vodafone Cash, InstaPay, Bank, Wallets)
  const [newAccountType, setNewAccountType] = useState<PaymentAccountType>('vodafone_cash');
  const [newAccountTitle, setNewAccountTitle] = useState('');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');
  const [newAccountNotes, setNewAccountNotes] = useState('');

  const [savedInvitationData, setSavedInvitationData] = useState<InvitationData | null>(
    existingInvitation || null
  );

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);

  // File Upload Input Refs
  const groomInputRef = useRef<HTMLInputElement>(null);
  const brideInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const musicFileInputRef = useRef<HTMLInputElement>(null);

  // Audio Preview & Dynamic Tracks State
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>(() => getAllAvailableTracks());
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Audio Trimmer Modal State
  const [pendingTrimFile, setPendingTrimFile] = useState<File | null>(null);
  const [showTrimmerModal, setShowTrimmerModal] = useState(false);

  // Load & Subscribe Cloud Shared Music Tracks on Mount
  useEffect(() => {
    const unsub = subscribeCloudMusicLibrary((cloudTracks) => {
      if (cloudTracks && cloudTracks.length > 0) {
        setMusicTracks((prev) => {
          const existingUrls = new Set(cloudTracks.map((t) => t.url));
          const rest = prev.filter((t) => !existingUrls.has(t.url));
          return [...cloudTracks, ...rest];
        });
      }
    });

    return () => {
      unsub();
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const handleDetailChange = (field: keyof EventDetails, value: any) => {
    setEventDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setThemeColors({ ...template.defaultColors });
    setCustomFont(template.defaultFont);
    setEventDetails({ ...template.defaultData });
    setInvitationTitle(template.title[currentLang]);
  };

  const handleAddPaymentAccount = () => {
    if (!newAccountTitle.trim() || !newAccountNumber.trim()) return;

    const newAcc: PaymentAccount = {
      id: 'acc-' + Date.now(),
      type: newAccountType,
      title: newAccountTitle.trim(),
      accountNumber: newAccountNumber.trim(),
      accountHolder: newAccountHolder.trim() || undefined,
      notes: newAccountNotes.trim() || undefined,
    };

    const currentAccounts = eventDetails.paymentAccounts || [];
    handleDetailChange('paymentAccounts', [...currentAccounts, newAcc]);

    setNewAccountTitle('');
    setNewAccountNumber('');
    setNewAccountHolder('');
    setNewAccountNotes('');
  };

  const handleRemovePaymentAccount = (accId: string) => {
    const currentAccounts = eventDetails.paymentAccounts || [];
    handleDetailChange(
      'paymentAccounts',
      currentAccounts.filter((a) => a.id !== accId)
    );
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setPendingTrimFile(file);
    setShowTrimmerModal(true);

    if (musicFileInputRef.current) {
      musicFileInputRef.current.value = '';
    }
  };

  const handleTrackReadyFromTrimmer = async (track: MusicTrack) => {
    setMusicTracks((prev) => [track, ...prev.filter((t) => t.url !== track.url)]);
    handleDetailChange('musicTrackUrl', track.url);
    if (track.label) {
      handleDetailChange('musicTrackName', track.label);
    }
    const playableUrl = await resolveAudioTrackUrl(track.url);
    if (playableUrl) {
      if (!audioPreviewRef.current) {
        audioPreviewRef.current = new Audio(playableUrl);
        audioPreviewRef.current.onended = () => setIsPlayingPreview(false);
      } else {
        audioPreviewRef.current.src = playableUrl;
      }
      audioPreviewRef.current.play().then(() => setIsPlayingPreview(true)).catch(() => {});
    }
  };

  const toggleAudioPreview = async () => {
    if (!eventDetails.musicTrackUrl) return;

    if (isPlayingPreview && audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      const playableUrl = await resolveAudioTrackUrl(eventDetails.musicTrackUrl);
      if (!playableUrl) return;

      if (!audioPreviewRef.current) {
        audioPreviewRef.current = new Audio(playableUrl);
        audioPreviewRef.current.onended = () => setIsPlayingPreview(false);
      } else {
        audioPreviewRef.current.src = playableUrl;
      }
      audioPreviewRef.current
        .play()
        .then(() => setIsPlayingPreview(true))
        .catch((err) => console.warn('Audio playback error:', err));
    }
  };

  const handleSingleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof EventDetails
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleDetailChange(field, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readers = fileList.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newUrls) => {
      setEventDetails((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages || []), ...newUrls],
      }));
    });
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setEventDetails((prev) => ({
      ...prev,
      galleryImages: [...(prev.galleryImages || []), newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setEventDetails((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddScheduleItem = () => {
    const newItem = {
      id: 'sch-' + Date.now(),
      time: '20:00',
      title: isRtl ? 'فقرة جديدة' : 'New Program Item',
      description: '',
    };
    setEventDetails((prev) => ({
      ...prev,
      scheduleTimeline: [...(prev.scheduleTimeline || []), newItem],
    }));
  };

  const handleRemoveScheduleItem = (id: string) => {
    setEventDetails((prev) => ({
      ...prev,
      scheduleTimeline: (prev.scheduleTimeline || []).filter((item) => item.id !== id),
    }));
  };

  const handleSaveForPayment = (
    targetStatus: 'draft' | 'pending_approval' | 'published' = 'pending_approval'
  ): InvitationData => {
    const rawTitle = eventDetails.eventTitle || invitationTitle || '';
    const cleanTitleSlug = rawTitle
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '');
    const fallbackSlug = `frida-invitation-${Date.now()}`;
    const slug = existingInvitation?.slug || cleanTitleSlug || fallbackSlug;

    let finalStatus: 'draft' | 'pending_approval' | 'published' = targetStatus;
    if (targetStatus === 'published' && existingInvitation?.status !== 'published') {
      finalStatus = 'pending_approval';
    }

    const invData: InvitationData = {
      id: existingInvitation?.id || 'inv-' + crypto.randomUUID(),
      templateId: selectedTemplate.id,
      layoutType: selectedTemplate.layoutType || existingInvitation?.layoutType || 'royal',
      title: invitationTitle || eventDetails.eventTitle,
      language: invitationLanguage,
      themeStyle: selectedTemplate.themeStyle,
      customColors: themeColors,
      customFont: customFont,
      eventDetails: eventDetails,
      status: finalStatus,
      createdAt: existingInvitation?.createdAt || new Date().toISOString(),
      slug: existingInvitation?.slug || slug,
      rsvpCount: existingInvitation?.rsvpCount || 0,
      ownerUid: existingInvitation?.ownerUid,
    };

    // Save locally immediately for instant response
    const saved = saveInvitation(invData);
    setSavedInvitationData(saved);

    const shareUrl = `${window.location.origin}/i/${encodeURIComponent(saved.slug)}`;
    setPublishedLink(shareUrl);

    // Sync to Cloud Firestore in the background
    ensureAnonymousAuth()
      .then((user) => {
        if (user) {
          invData.ownerUid = user.uid;
        }
        return saveInvitationCloud(invData, existingInvitation?.slug);
      })
      .then((cloudSaved) => {
        saveInvitation(cloudSaved);
        setSavedInvitationData(cloudSaved);
      })
      .catch((err) => {
        console.warn('Background server sync warning:', err);
      });

    onSaved(saved);
    return saved;
  };

  const handleCopyShareLink = () => {
    if (!publishedLink) return;
    navigator.clipboard.writeText(publishedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `${isRtl ? 'يسرني دعوتكم لحضور' : 'You are cordially invited to'} ${eventDetails.eventTitle}\n\n${publishedLink}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return {
    isRtl,
    currentStep,
    setCurrentStep,
    selectedTemplate,
    invitationLanguage,
    setInvitationLanguage,
    invitationTitle,
    setInvitationTitle,
    eventDetails,
    setEventDetails,
    themeColors,
    setThemeColors,
    customFont,
    setCustomFont,
    previewDeviceMode,
    setPreviewDeviceMode,
    publishedLink,
    copiedLink,
    newGalleryUrl,
    setNewGalleryUrl,
    newAccountType,
    setNewAccountType,
    newAccountTitle,
    setNewAccountTitle,
    newAccountNumber,
    setNewAccountNumber,
    newAccountHolder,
    setNewAccountHolder,
    newAccountNotes,
    setNewAccountNotes,
    savedInvitationData,
    showReviewModal,
    setShowReviewModal,
    groomInputRef,
    brideInputRef,
    coverInputRef,
    galleryInputRef,
    musicFileInputRef,
    musicTracks,
    isPlayingPreview,
    pendingTrimFile,
    setPendingTrimFile,
    showTrimmerModal,
    setShowTrimmerModal,
    handleDetailChange,
    handleTemplateSelect,
    handleAddPaymentAccount,
    handleRemovePaymentAccount,
    handleAudioFileUpload,
    handleTrackReadyFromTrimmer,
    toggleAudioPreview,
    handleSingleFileUpload,
    handleMultipleGalleryUpload,
    handleAddGalleryImage,
    handleRemoveGalleryImage,
    handleAddScheduleItem,
    handleRemoveScheduleItem,
    handleSaveForPayment,
    handleCopyShareLink,
    handleWhatsAppShare,
  };
}
