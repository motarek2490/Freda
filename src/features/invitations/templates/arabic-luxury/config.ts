import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'arabic-luxury',
  name: {
    ar: '«شمس & بدر» (أصالة الفخامة العربية)',
    en: 'Shams & Badr (Pure Arabic Grandeur)',
  },
  version: '1.0.0',
  layoutType: 'arabic',
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
