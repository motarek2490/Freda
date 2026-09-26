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
    badgeAr: 'دعوة زفاف ملكية فاخرة',
    badgeEn: 'Royal Wedding Invitation',
    hostsAr: 'عمر & ياسمين',
    hostsEn: 'Omar & Yasmine',
    venueAr: 'فندق فورسيزونز نايل بلازا • القاهرة',
    venueEn: 'Four Seasons Nile Plaza • Cairo',
    designTitleAr: 'قالب الأكاليل والذهب الخالص 🌟',
    designTitleEn: 'Golden Wreath Royal Edition',
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    accentColor: '#B99A65',
    themeStyle: 'luxury',
    templateId: 'frida-royal-001',
    layoutType: 'royal',
  },
  {
    id: 'vip_2',
    badgeAr: 'حفل زفاف ألف ليلة وليلة',
    badgeEn: 'Thousand & One Nights Wedding',
    hostsAr: 'شريف & نورهان',
    hostsEn: 'Sherif & Nourhan',
    venueAr: 'فندق قصر المينا هاوس • الجيزة',
    venueEn: 'Mena House Palace • Giza Pyramids',
    designTitleAr: 'قالب الأقواس والأهرامات الملكية 🏛️',
    designTitleEn: 'Royal Pyramids & Golden Arches',
    coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    accentColor: '#D4AF37',
    themeStyle: 'arabic',
    templateId: 'frida-arabic-luxury-001',
    layoutType: 'arabic',
  },
  {
    id: 'vip_3',
    badgeAr: 'سهرة الأكاليل المخملية VIP',
    badgeEn: 'Velvet Royal Gala VIP',
    hostsAr: 'د. أحمد & د. ندى',
    hostsEn: 'Dr. Ahmed & Dr. Nada',
    venueAr: 'فندق جيه دبليو ماريوت • القاهرة الجديدة',
    venueEn: 'JW Marriott Hotel • New Cairo',
    designTitleAr: 'قالب السينما والأكاليل الذهبية 🎬',
    designTitleEn: 'Golden Chandelier & Cinema',
    coverImage: 'https://images.unsplash.com/photo-1545232979-fbf34f0c6095?auto=format&fit=crop&w=800&q=80',
    accentColor: '#E6C687',
    themeStyle: 'cinematic',
    templateId: 'frida-cinematic-001',
    layoutType: 'cinematic',
  },
  {
    id: 'vip_4',
    badgeAr: 'ليلة الزفاف الساحلية الملكية',
    badgeEn: 'Coastal Luxury Wedding',
    hostsAr: 'م. طارق & فريدة',
    hostsEn: 'Eng. Tarek & Farida',
    venueAr: 'فندق قصر الكرنك • الإسكندرية',
    venueEn: 'Karnak Palace • Alexandria Coast',
    designTitleAr: 'قالب الزهور واللؤلؤ الأزرق 🌸',
    designTitleEn: 'Floral Pearl & Ocean Waves',
    coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    accentColor: '#C5A059',
    themeStyle: 'floral',
    templateId: 'frida-floral-botanical-001',
    layoutType: 'floral',
  },
  {
    id: 'vip_5',
    badgeAr: 'حفل الزفاف الأسطوري VIP',
    badgeEn: 'Legendary Royal Gala',
    hostsAr: 'كابتن زياد & جودي',
    hostsEn: 'Capt. Ziad & Judy',
    venueAr: 'فندق سانت ريجيس • الماسه العاصمة الإدارية',
    venueEn: 'St. Regis Palace • New Capital',
    designTitleAr: 'قالب تذكرة السفر والتذكرة الذهبية 🎫',
    designTitleEn: 'VIP Boarding Pass & Golden Ticket',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    accentColor: '#F3E5AB',
    themeStyle: 'playful',
    templateId: 'frida-playful-celebration-001',
    layoutType: 'playful',
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
    '/music/royal-wedding-waltz.mp3';

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
    '/music/royal-wedding-waltz.mp3';

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
