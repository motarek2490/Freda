import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'editorial-noir',
  name: {
    ar: '«ريم & أدهم» (الافتتاحية العصرية الفاتنة)',
    en: 'Reem & Adham (Vogue Editorial Allure)',
  },
  version: '1.0.0',
  layoutType: 'editorialNoir',
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
