import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'vintage-lace',
  name: {
    ar: '«عبلة & عنتر» (حنين الدانتيل الأبيض)',
    en: 'Abla & Antar (White Lace Nostalgia)',
  },
  version: '1.0.0',
  layoutType: 'lace',
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
