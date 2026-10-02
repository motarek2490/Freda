import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'midnight-confetti',
  name: {
    ar: '«فرح & تيمور» (بهجة الاحتفال والكونفيتي)',
    en: 'Farah & Taymour (Celebration Confetti)',
  },
  version: '1.0.0',
  layoutType: 'confetti',
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
