import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'burgundy-minimalist',
  name: {
    ar: '«مريم & يحيى» (شغف المخمل البورغندي)',
    en: 'Maryam & Yehia (Burgundy Passion)',
  },
  version: '1.0.0',
  layoutType: 'burgundy',
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
