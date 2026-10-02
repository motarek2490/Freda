import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'ocean-pearl',
  name: {
    ar: '«درة & بحر» (لؤلؤة الشاطئ الفيروزية)',
    en: 'Dorra & Bahr (Coastal Pearl Dream)',
  },
  version: '1.0.0',
  layoutType: 'ocean',
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
