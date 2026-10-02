import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'emerald-garden',
  name: {
    ar: '«روضة & أنس» (جنة الزمرد الخضراء)',
    en: 'Rawda & Anas (Emerald Garden Eden)',
  },
  version: '1.0.0',
  layoutType: 'emerald',
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
