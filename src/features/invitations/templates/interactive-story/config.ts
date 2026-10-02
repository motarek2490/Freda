import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'interactive-story',
  name: {
    ar: '«حبيبة & عمر» (حكايتنا التفاعلية من أول يوم)',
    en: 'Habiba & Omar (Our Love Story from Day One)',
  },
  version: '1.0.0',
  layoutType: 'interactive',
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
