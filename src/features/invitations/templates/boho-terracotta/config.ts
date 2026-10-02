import { TemplateConfig } from '../../model/templateContract';

export const config: TemplateConfig = {
  id: 'boho-terracotta',
  name: {
    ar: '«سلمى & مروان» (سحر الغروب والبوهو الدافئ)',
    en: 'Salma & Marwan (Warm Sunset Boho)',
  },
  version: '1.0.0',
  layoutType: 'boho',
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
