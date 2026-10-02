import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'autumn-rustic',
  name: {
    ar: '«عبير & طارق» (دفء الشموع والخريف)',
    en: 'Abeer & Tarek (Warm Autumn Romance)',
  },
  version: '1.0.0',
  layoutType: 'autumn',
  category: 'weddings',
  themeStyle: 'luxury',
  defaultColors: {
    bg: '#171717',
    cardBg: '#1f1e1b',
    text: '#F7F4EE',
    accent: '#B99A65',
  },
  defaultFont: 'font-playfair',
  supportedLanguages: ['ar', 'en'],
  supportsRTL: true,
  supportsRSVP: true,
  supportsMusic: true,
  supportsGiftRegistry: true,
  supportsGallery: true,
  supportsTimeline: true,
  supportsGuestbook: true,
};
