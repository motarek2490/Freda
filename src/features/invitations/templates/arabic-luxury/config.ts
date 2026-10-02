import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'arabic-luxury',
  name: {
    ar: '«الفخامة العربية الحية» (لوحة رومانسية سينمائية)',
    en: 'Arabic Luxury Canvas (Cinematic Romantic)',
  },
  version: '2.0.0',
  layoutType: 'arabic',
  category: 'weddings',
  themeStyle: 'luxury',
  defaultColors: {
    bg: '#11100F',
    cardBg: '#171412',
    text: '#F7F1E8',
    accent: '#C9A46A',
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
