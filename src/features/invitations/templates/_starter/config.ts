import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'template-sunlit-garden',
  name: { ar: 'حديقة الشمس', en: 'Sunlit Garden' },
  version: '1.0.0',
  layoutType: 'editorial',
  category: 'weddings',
  themeStyle: 'luxury',
  defaultColors: { bg: '#FFF9F0', cardBg: '#FFFFFF', text: '#3A302A', accent: '#D8BC8A' },
  defaultFont: 'font-cormorant',
  supportedLanguages: ['ar', 'en'],
  supportsRTL: true,
  supportsRSVP: true,
  supportsMusic: false,
  supportsGiftRegistry: true,
  supportsGallery: true,
  supportsTimeline: false,
  supportsGuestbook: true,
  introType: 'none',
  author: 'FRIDA Atelier',
} as TemplateConfig;
