/**
 * FRIDA CREATIVE ENGINE & THEME ECOSYSTEM
 * Scalable configuration-driven template architecture balancing reusability and genuine visual diversity.
 */

import { Language } from '../types';

export type TemplateTier = 'free' | 'premium' | 'designer' | 'custom';
export type EventType =
  | 'wedding'
  | 'engagement'
  | 'katb_ketab'
  | 'henna'
  | 'reception'
  | 'bridal_shower'
  | 'baby_shower'
  | 'birthday'
  | 'graduation'
  | 'corporate';

export type OpeningExperienceType =
  | 'royal_door'
  | 'envelope_seal'
  | 'palace_entrance'
  | 'garden_reveal'
  | 'moonlight_reveal'
  | 'modern_glass'
  | 'heritage_reveal'
  | 'minimal_editorial';

export type MotionProfile = 'cinematic' | 'graceful' | 'playful' | 'subtle' | 'none';

export interface TemplateDefinition {
  id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  category: EventType;
  tier: TemplateTier;
  layoutEngine:
    | 'royal'
    | 'minimalist'
    | 'baroque'
    | 'cinematic'
    | 'lace'
    | 'boho'
    | 'cherry'
    | 'confetti'
    | 'opal'
    | 'burgundy';
  visualStyle: 'luxury' | 'classic' | 'minimal' | 'boho' | 'romantic' | 'playful' | 'floral';
  openingExperience: OpeningExperienceType;
  motionProfile: MotionProfile;
  typography: {
    primaryFont: string;
    headerFont: string;
    displayFont: string;
  };
  colorSystem: {
    bg: string;
    cardBg: string;
    text: string;
    accent: string;
    secondaryAccent?: string;
  };
  heroStyle: 'editorial' | 'fullscreen_cover' | 'arch_portrait' | 'split_screen' | 'floating_cards';
  galleryStyle: 'grid_lightbox' | 'carousel_slider' | 'polaroid_stack' | 'masonry_editorial';
  rsvpStyle: 'modal_dialog' | 'inline_card' | 'multi_step_drawer';
  musicStyle: 'ambient_autoplay' | 'floating_player' | 'vinyl_record';
  responsiveBehavior: {
    mobileFirst: boolean;
    stickyMobileCtaCap: string; // <= 15%
  };
  featureFlags: {
    enableWaxSeal: boolean;
    enableCountdown: boolean;
    enableGroomBrideCards: boolean;
    enableScheduleTimeline: boolean;
    enableGallery: boolean;
    enableGiftRegistry: boolean;
    enableGuestbook: boolean;
    enableMemoryUploads: boolean;
    enableQrCode: boolean;
    enableSeatingChart: boolean;
  };
}

export const FRIDA_THEME_REGISTRY: Record<string, TemplateDefinition> = {
  'frida-royal-001': {
    id: 'frida-royal-001',
    name: { ar: 'رويال هيرو الملكي', en: 'Royal Hero Edition' },
    description: {
      ar: 'التصميم الملكي الفاخر بأسلوب القصور العربية مع الشمع التفاعلي والموسيقى.',
      en: 'Signature royal palace aesthetic with wax-sealed envelope and gold foil.',
    },
    category: 'wedding',
    tier: 'premium',
    layoutEngine: 'royal',
    visualStyle: 'luxury',
    openingExperience: 'royal_door',
    motionProfile: 'cinematic',
    typography: {
      primaryFont: 'font-sans',
      headerFont: 'font-serif',
      displayFont: 'font-playfair',
    },
    colorSystem: {
      bg: '#0B132B',
      cardBg: '#1C2541',
      text: '#F8F9FA',
      accent: '#C5A880',
    },
    heroStyle: 'fullscreen_cover',
    galleryStyle: 'grid_lightbox',
    rsvpStyle: 'modal_dialog',
    musicStyle: 'floating_player',
    responsiveBehavior: { mobileFirst: true, stickyMobileCtaCap: '12%' },
    featureFlags: {
      enableWaxSeal: true,
      enableCountdown: true,
      enableGroomBrideCards: true,
      enableScheduleTimeline: true,
      enableGallery: true,
      enableGiftRegistry: true,
      enableGuestbook: true,
      enableMemoryUploads: true,
      enableQrCode: true,
      enableSeatingChart: true,
    },
  },
  'frida-couture-2026': {
    id: 'frida-couture-2026',
    name: { ar: 'زفاف كلاسيكي ملكي 2026', en: 'Classic Wedding Haute Couture 2026' },
    description: {
      ar: 'تصميم كلاسيكي ملكي لعام 2026 بروح الهوت كوتور والذهب المعتق.',
      en: '2026 Haute couture editorial suite with gold foil and timeless typography.',
    },
    category: 'wedding',
    tier: 'designer',
    layoutEngine: 'minimalist',
    visualStyle: 'classic',
    openingExperience: 'envelope_seal',
    motionProfile: 'graceful',
    typography: {
      primaryFont: 'font-sans',
      headerFont: 'font-serif',
      displayFont: 'font-playfair',
    },
    colorSystem: {
      bg: '#FAF8F5',
      cardBg: '#FFFFFF',
      text: '#1C1917',
      accent: '#C9A86A',
    },
    heroStyle: 'editorial',
    galleryStyle: 'masonry_editorial',
    rsvpStyle: 'inline_card',
    musicStyle: 'floating_player',
    responsiveBehavior: { mobileFirst: true, stickyMobileCtaCap: '12%' },
    featureFlags: {
      enableWaxSeal: true,
      enableCountdown: true,
      enableGroomBrideCards: true,
      enableScheduleTimeline: true,
      enableGallery: true,
      enableGiftRegistry: true,
      enableGuestbook: true,
      enableMemoryUploads: true,
      enableQrCode: true,
      enableSeatingChart: true,
    },
  },
  'frida-engagement-baroque': {
    id: 'frida-engagement-baroque',
    name: { ar: 'خطوبة بريميوم باروكي', en: 'Baroque Premium Engagement' },
    description: {
      ar: 'طراز باروكي فاخر بزخارف ذهبية لمناسبات الخطوبة الراقية.',
      en: 'Baroque motifs with ambient radiance crafted for engagement galas.',
    },
    category: 'engagement',
    tier: 'free',
    layoutEngine: 'baroque',
    visualStyle: 'luxury',
    openingExperience: 'palace_entrance',
    motionProfile: 'cinematic',
    typography: {
      primaryFont: 'font-sans',
      headerFont: 'font-serif',
      displayFont: 'font-playfair',
    },
    colorSystem: {
      bg: '#1A1423',
      cardBg: '#2A1F3D',
      text: '#F8F9FA',
      accent: '#E5A93C',
    },
    heroStyle: 'split_screen',
    galleryStyle: 'polaroid_stack',
    rsvpStyle: 'modal_dialog',
    musicStyle: 'vinyl_record',
    responsiveBehavior: { mobileFirst: true, stickyMobileCtaCap: '15%' },
    featureFlags: {
      enableWaxSeal: true,
      enableCountdown: true,
      enableGroomBrideCards: true,
      enableScheduleTimeline: true,
      enableGallery: true,
      enableGiftRegistry: true,
      enableGuestbook: true,
      enableMemoryUploads: true,
      enableQrCode: true,
      enableSeatingChart: false,
    },
  },
};

export function getTemplateDefinition(templateId: string): TemplateDefinition {
  return FRIDA_THEME_REGISTRY[templateId] || FRIDA_THEME_REGISTRY['frida-couture-2026'];
}
