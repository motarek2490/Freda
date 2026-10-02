import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'sunflower-meadow',
  name: {
    ar: '«ضحى & إياد» (بهجة مرج دوار الشمس)',
    en: 'Doha & Eyad (Sunflower Meadow Joy)',
  },
  version: '1.0.0',
  layoutType: 'sunflowerMeadow',
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
