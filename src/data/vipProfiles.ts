import { Language, TemplateLayoutType, InvitationData } from '../types';
import { TEMPLATES } from './templates';
import { DEFAULT_ADMIN_SETTINGS } from '../lib/firestoreService';
import { BRAND_NAME_AR } from '../config/brand';

export interface EgyptianVIPProfile {
  id: string;
  badgeAr: string;
  badgeEn: string;
  hostsAr: string;
  hostsEn: string;
  venueAr: string;
  venueEn: string;
  designTitleAr: string;
  designTitleEn: string;
  coverImage: string;
  accentColor: string;
  themeStyle: string;
  templateId?: string;
  layoutType?: TemplateLayoutType;
}

export const EGYPTIAN_VIP_PROFILES: EgyptianVIPProfile[] = [
  {
    id: 'vip_1',
    badgeAr: 'سهرة الزفاف السينمائية الفاخرة 🎬',
    badgeEn: 'Cinematic Royal Gala VIP (Elegant)',
    hostsAr: 'زياد & هدير',
    hostsEn: 'Ziad & Hadeer',
    venueAr: 'فندق جراند نايل تاور • قاعة فرحتي • القاهرة',
    venueEn: 'Grand Nile Tower Hotel • Cairo',
    designTitleAr: 'قالب إيليجانت السينمائي المذهب 🎬✨',
    designTitleEn: 'Elegant Cinematic Edition',
    coverImage: '/images/samples/couple_seafront_terrace_1790456664887.jpg',
    accentColor: '#D4AF37',
    themeStyle: 'luxury',
    templateId: '4237b9ea-0fba-4a61-bb58-51f5c8dc74a7',
    layoutType: 'cinematic',
  },
  {
    id: 'vip_2',
    badgeAr: 'دعوة زفاف ملكية فاخرة',
    badgeEn: 'Royal Wedding Invitation',
    hostsAr: 'عمر & ياسمين',
    hostsEn: 'Omar & Yasmine',
    venueAr: 'فندق فورسيزونز نايل بلازا • القاهرة',
    venueEn: 'Four Seasons Nile Plaza • Cairo',
    designTitleAr: 'قالب رويال هيرو المذهب 🌟',
    designTitleEn: 'Royal Hero Edition',
    coverImage: '/images/samples/royal_invitation_mockup_1790456589429.jpg',
    accentColor: '#B99A65',
    themeStyle: 'luxury',
    templateId: 'f1e729be-a6d6-43ad-8e63-f1c8d62157a6',
    layoutType: 'royal',
  },
  {
    id: 'vip_3',
    badgeAr: 'حفل خطوبة راقية كوتور',
    badgeEn: 'Couture Engagement',
    hostsAr: 'شريف & نورهان',
    hostsEn: 'Sherif & Nourhan',
    venueAr: 'فندق قصر المينا هاوس • الجيزة',
    venueEn: 'Mena House Palace • Giza Pyramids',
    designTitleAr: 'قالب إيليجانت التحريري 🏛️',
    designTitleEn: 'Elegant Editorial Engagement',
    coverImage: '/images/samples/engagement_invitation_mockup_1790456600087.jpg',
    accentColor: '#D4AF37',
    themeStyle: 'luxury',
    templateId: 'bc70c686-eb91-4f6d-a33e-39be9b927ee1',
    layoutType: 'royalArabicEditorial',
  },
  {
    id: 'vip_4',
    badgeAr: 'ليلة الزفاف الساحلية الملكية',
    badgeEn: 'Coastal Luxury Wedding',
    hostsAr: 'م. طارق & فريدة',
    hostsEn: 'Eng. Tarek & Farida',
    venueAr: 'فندق قصر المنتزه • الإسكندرية',
    venueEn: 'Montaza Palace • Alexandria Coast',
    designTitleAr: 'قالب الزفاف الكلاسيكي الراقي 🌸',
    designTitleEn: 'Classic Wedding Edition',
    coverImage: '/images/samples/couple_seafront_terrace_1790456664887.jpg',
    accentColor: '#C5A059',
    themeStyle: 'classic',
    templateId: '06fa4b53-cfc2-48de-8766-c2c3a5d94cb9',
    layoutType: 'minimalist',
  },
  {
    id: 'vip_5',
    badgeAr: 'حفل الزفاف الباروكي المذهب VIP',
    badgeEn: 'Golden Baroque Royal Gala',
    hostsAr: 'كابتن زياد & جودي',
    hostsEn: 'Capt. Ziad & Judy',
    venueAr: 'فندق سانت ريجيس • العاصمة الإدارية',
    venueEn: 'St. Regis Palace • New Capital',
    designTitleAr: 'قالب الباروك الذهبي 🎫',
    designTitleEn: 'VIP Golden Baroque Edition',
    coverImage: '/images/samples/baroque_gold_mockup_1790456610620.jpg',
    accentColor: '#F3E5AB',
    themeStyle: 'luxury',
    templateId: '271fc8ac-1fc3-4f70-8bc1-c620f5e28785',
    layoutType: 'baroque',
  },
];

export function createDemoInvitationFromProfile(
  profile: EgyptianVIPProfile,
  lang: Language = 'ar',
  customSlug?: string
): InvitationData {
  const matchingTemplate =
    TEMPLATES.find((t) => t.id === profile.templateId) ||
    TEMPLATES.find((t) => t.themeStyle === profile.themeStyle) ||
    TEMPLATES[0];

  const hosts = lang === 'ar' ? profile.hostsAr : profile.hostsEn;
  const rawGroom = hosts.split('&')[0]?.trim() || (lang === 'ar' ? 'العريس' : 'Groom');
  const rawBride = hosts.split('&')[1]?.trim() || (lang === 'ar' ? 'العروس' : 'Bride');

  const defaultTrackUrl =
    DEFAULT_ADMIN_SETTINGS.defaultDemoTrackUrl ||
    matchingTemplate.defaultData?.musicTrackUrl ||
    '';

  const defaultTrackName =
    DEFAULT_ADMIN_SETTINGS.defaultDemoTrackName ||
    `معزوفة أوركسترا زفاف ${BRAND_NAME_AR} الملكية`;

  const finalSlug = customSlug || `preview-demo-${profile.id}`;

  return {
    id: `preview-demo-${profile.id}`,
    templateId: matchingTemplate.id,
    layoutType: profile.layoutType || matchingTemplate.layoutType || 'royal',
    title: lang === 'ar' ? profile.badgeAr : profile.badgeEn,
    language: lang,
    themeStyle: matchingTemplate.themeStyle,
    customColors: matchingTemplate.defaultColors,
    customFont: matchingTemplate.defaultFont,
    eventDetails: {
      ...matchingTemplate.defaultData,
      hostNames: hosts,
      groomName: rawGroom,
      brideName: rawBride,
      eventTitle: lang === 'ar' ? profile.badgeAr : profile.badgeEn,
      venueName: lang === 'ar' ? profile.venueAr : profile.venueEn,
      musicTrackUrl: defaultTrackUrl,
      musicTrackName: defaultTrackName,
    },
    status: 'published',
    createdAt: new Date().toISOString(),
    slug: finalSlug,
    hostAccessCode: 'HOST-DEMO',
  };
}

export function createTemplatePreviewInvitation(
  tmpl: typeof TEMPLATES[0],
  lang: Language = 'ar',
  customSlug?: string
): InvitationData {
  const defaultTrackUrl =
    DEFAULT_ADMIN_SETTINGS.defaultDemoTrackUrl ||
    tmpl.defaultData?.musicTrackUrl ||
    '';

  const defaultTrackName =
    DEFAULT_ADMIN_SETTINGS.defaultDemoTrackName ||
    tmpl.defaultData?.musicTrackName ||
    `معزوفة أوركسترا زفاف ${BRAND_NAME_AR} الملكية`;

  const finalSlug = customSlug || `preview-${tmpl.id}`;

  return {
    id: `preview-${tmpl.id}`,
    templateId: tmpl.id,
    layoutType: tmpl.layoutType || 'royal',
    title: tmpl.title[lang] || tmpl.title.ar || tmpl.title.en,
    language: lang,
    themeStyle: tmpl.themeStyle,
    customColors: tmpl.defaultColors,
    customFont: tmpl.defaultFont,
    eventDetails: {
      ...tmpl.defaultData,
      musicTrackUrl: defaultTrackUrl,
      musicTrackName: defaultTrackName,
    },
    status: 'published',
    createdAt: new Date().toISOString(),
    slug: finalSlug,
    hostAccessCode: 'HOST-PREVIEW',
  };
}
