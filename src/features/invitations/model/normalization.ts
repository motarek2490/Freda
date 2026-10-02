import { InvitationData, Language, EventDetails, CustomThemeColors, TemplateLayoutType } from '../../../types';
import { getMergedTemplates } from '../../../data/templates';
import { logger } from '../../../shared/utils/logger';

/**
 * Normalizes raw Firestore/local invitation data into a robust canonical model.
 * Guarantees that templates never crash due to missing, undefined, or legacy fields.
 */
export function normalizeInvitation(
  rawInvitation: Partial<InvitationData> | null | undefined,
  userLang?: Language
): InvitationData {
  const mergedTemplatesList = getMergedTemplates();
  const rawTemplateId = rawInvitation?.templateId || '';
  
  const fallbackTemplate =
    mergedTemplatesList.find((t) => t.id === rawTemplateId) ||
    mergedTemplatesList.find((t) => t.layoutType === rawInvitation?.layoutType) ||
    mergedTemplatesList[0];

  const language: Language =
    rawInvitation?.language === 'ar' || rawInvitation?.language === 'en'
      ? rawInvitation.language
      : userLang === 'ar' || userLang === 'en'
      ? userLang
      : 'ar';

  const defaultEventDetails: EventDetails = {
    groomName: '',
    brideName: '',
    groomParents: '',
    brideParents: '',
    dressCode: '',
    customMessage: '',
    mainMessage: '',
    rsvpDeadline: '',
    enableRSVP: true,
    enableGallery: false,
    enableSchedule: false,
    enableGiftRegistry: false,
    enableGuestbook: true,
    galleryImages: [],
    scheduleTimeline: [],
    paymentAccounts: [],
    wishesList: [],
    ...fallbackTemplate.defaultData,
    eventTitle: rawInvitation?.title || fallbackTemplate.defaultData?.eventTitle || fallbackTemplate.title.ar || 'دعوة زفاف ملكية',
    hostNames: fallbackTemplate.defaultData?.hostNames || 'عائلة العريس وعائلة العروس',
    eventDate: fallbackTemplate.defaultData?.eventDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    eventTime: fallbackTemplate.defaultData?.eventTime || '19:00',
    venueName: fallbackTemplate.defaultData?.venueName || 'قصر الاحتفالات الملكي',
    address: fallbackTemplate.defaultData?.address || 'القاهرة، مصر',
    venueAddress: fallbackTemplate.defaultData?.venueAddress || 'القاهرة، مصر',
  };

  const rawDetails = rawInvitation?.eventDetails as Partial<EventDetails> | undefined;
  const normalizedEventDetails: EventDetails = {
    ...defaultEventDetails,
    ...(rawDetails || {}),
    galleryImages: Array.isArray(rawDetails?.galleryImages) ? rawDetails.galleryImages : [],
    scheduleTimeline: Array.isArray(rawDetails?.scheduleTimeline) ? rawDetails.scheduleTimeline : [],
    paymentAccounts: Array.isArray(rawDetails?.paymentAccounts) ? rawDetails.paymentAccounts : [],
    wishesList: Array.isArray(rawDetails?.wishesList) ? rawDetails.wishesList : [],
  };

  const defaultColors: CustomThemeColors = fallbackTemplate.defaultColors || {
    bg: '#171717',
    cardBg: '#1f1e1b',
    text: '#F7F4EE',
    accent: '#B99A65',
  };

  const customColors: CustomThemeColors = {
    bg: rawInvitation?.customColors?.bg || defaultColors.bg,
    cardBg: rawInvitation?.customColors?.cardBg || defaultColors.cardBg,
    text: rawInvitation?.customColors?.text || defaultColors.text,
    accent: rawInvitation?.customColors?.accent || defaultColors.accent,
  };

  const id = rawInvitation?.id || `inv-${Date.now()}`;
  const slug = rawInvitation?.slug || id;

  const normalized: InvitationData = {
    id,
    templateId: rawInvitation?.templateId || fallbackTemplate.id,
    title: rawInvitation?.title || normalizedEventDetails.eventTitle || fallbackTemplate.title[language] || 'دعوة ملكية',
    language,
    themeStyle: rawInvitation?.themeStyle || fallbackTemplate.themeStyle || 'luxury',
    layoutType: (rawInvitation?.layoutType || fallbackTemplate.layoutType || 'royal') as TemplateLayoutType,
    openingStyle: rawInvitation?.openingStyle || fallbackTemplate.openingStyle,
    introType: rawInvitation?.introType || fallbackTemplate.introType,
    customColors,
    customFont: rawInvitation?.customFont || fallbackTemplate.defaultFont || 'font-playfair',
    eventDetails: normalizedEventDetails,
    status: rawInvitation?.status || 'published',
    createdAt: rawInvitation?.createdAt || new Date().toISOString(),
    slug,
    userId: rawInvitation?.userId,
    ownerUid: rawInvitation?.ownerUid,
    customerPhone: rawInvitation?.customerPhone,
    rsvpCount: typeof rawInvitation?.rsvpCount === 'number' ? rawInvitation.rsvpCount : 0,
    guestCount: typeof rawInvitation?.guestCount === 'number' ? rawInvitation.guestCount : 0,
    musicTrackUrl: rawInvitation?.musicTrackUrl || normalizedEventDetails.musicTrackUrl,
    musicTrackName: rawInvitation?.musicTrackName || normalizedEventDetails.musicTrackName,
    galleryImages: normalizedEventDetails.galleryImages,
    hostAccessCode: rawInvitation?.hostAccessCode,
    hostUsername: rawInvitation?.hostUsername,
    expiresAt: rawInvitation?.expiresAt,
    isExpired: rawInvitation?.isExpired,
    approvedAt: rawInvitation?.approvedAt,
    planTier: rawInvitation?.planTier || 'basic',
    rejectionReason: rawInvitation?.rejectionReason,
  };

  logger.debug('Normalized invitation data', { invitationId: normalized.id, templateId: normalized.templateId });

  return normalized;
}
