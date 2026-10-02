import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'cherry-bloom',
  name: {
    ar: '«وتين & قصي» (أزهار الكرز الوردية)',
    en: 'Wateen & Qusai (Cherry Blossom Kiss)',
  },
  version: '1.0.0',
  layoutType: 'cherry',
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
