import React, { lazy } from 'react';
import { TemplateLayoutProps } from './types';

export const LazyRoyalLayout = lazy(() =>
  import('./RoyalLayout').then((m) => ({ default: m.RoyalLayout }))
);
export const LazyMinimalistLayout = lazy(() =>
  import('./MinimalistLayout').then((m) => ({ default: m.MinimalistLayout }))
);
export const LazyCinematicLayout = lazy(() =>
  import('./CinematicLayout').then((m) => ({ default: m.CinematicLayout }))
);
export const LazyArabicLuxuryLayout = lazy(() =>
  import('./ArabicLuxuryLayout').then((m) => ({ default: m.ArabicLuxuryLayout }))
);
export const LazyFloralBotanicalLayout = lazy(() =>
  import('./FloralBotanicalLayout').then((m) => ({ default: m.FloralBotanicalLayout }))
);
export const LazyBohoTerracottaLayout = lazy(() =>
  import('./BohoTerracottaLayout').then((m) => ({ default: m.BohoTerracottaLayout }))
);
export const LazyInteractiveStoryLayout = lazy(() =>
  import('./InteractiveStoryLayout').then((m) => ({ default: m.InteractiveStoryLayout }))
);
export const LazyPlayfulCelebrationLayout = lazy(() =>
  import('./PlayfulCelebrationLayout').then((m) => ({ default: m.PlayfulCelebrationLayout }))
);
export const LazyBurgundyMinimalistLayout = lazy(() =>
  import('./BurgundyMinimalistLayout').then((m) => ({ default: m.BurgundyMinimalistLayout }))
);
export const LazyCrystalGlowLayout = lazy(() =>
  import('./CrystalGlowLayout').then((m) => ({ default: m.CrystalGlowLayout }))
);
export const LazyCherryBloomLayout = lazy(() =>
  import('./CherryBloomLayout').then((m) => ({ default: m.CherryBloomLayout }))
);
export const LazyGoldenBaroqueLayout = lazy(() =>
  import('./GoldenBaroqueLayout').then((m) => ({ default: m.GoldenBaroqueLayout }))
);
export const LazyFreshCitrusLayout = lazy(() =>
  import('./FreshCitrusLayout').then((m) => ({ default: m.FreshCitrusLayout }))
);
export const LazyMidnightConfettiLayout = lazy(() =>
  import('./MidnightConfettiLayout').then((m) => ({ default: m.MidnightConfettiLayout }))
);
export const LazyEmeraldGardenLayout = lazy(() =>
  import('./EmeraldGardenLayout').then((m) => ({ default: m.EmeraldGardenLayout }))
);
export const LazyOceanPearlLayout = lazy(() =>
  import('./OceanPearlLayout').then((m) => ({ default: m.OceanPearlLayout }))
);
export const LazyAutumnRusticLayout = lazy(() =>
  import('./AutumnRusticLayout').then((m) => ({ default: m.AutumnRusticLayout }))
);
export const LazyStarlitNightLayout = lazy(() =>
  import('./StarlitNightLayout').then((m) => ({ default: m.StarlitNightLayout }))
);
export const LazyVintageLaceLayout = lazy(() =>
  import('./VintageLaceLayout').then((m) => ({ default: m.VintageLaceLayout }))
);
export const LazyRoseVelvetLayout = lazy(() =>
  import('./RoseVelvetLayout').then((m) => ({ default: m.RoseVelvetLayout }))
);
export const LazyLavenderFieldsLayout = lazy(() =>
  import('./LavenderFieldsLayout').then((m) => ({ default: m.LavenderFieldsLayout }))
);
export const LazySunflowerMeadowLayout = lazy(() =>
  import('./SunflowerMeadowLayout').then((m) => ({ default: m.SunflowerMeadowLayout }))
);
export const LazyJasmineNightLayout = lazy(() =>
  import('./JasmineNightLayout').then((m) => ({ default: m.JasmineNightLayout }))
);
export const LazyWisteriaDreamLayout = lazy(() =>
  import('./WisteriaDreamLayout').then((m) => ({ default: m.WisteriaDreamLayout }))
);
export const LazyCelestialEclipseLayout = lazy(() =>
  import('./CelestialEclipseLayout').then((m) => ({ default: m.CelestialEclipseLayout }))
);
export const LazyEditorialNoirLayout = lazy(() =>
  import('./EditorialNoirLayout').then((m) => ({ default: m.EditorialNoirLayout }))
);
export const LazyEnchantedBotanicalLayout = lazy(() =>
  import('./EnchantedBotanicalLayout').then((m) => ({ default: m.EnchantedBotanicalLayout }))
);
export const LazyOpalDreamLayout = lazy(() =>
  import('./OpalDreamLayout').then((m) => ({ default: m.OpalDreamLayout }))
);
export const LazyRoyalArabicEditorialLayout = lazy(() =>
  import('./RoyalArabicEditorialLayout').then((m) => ({ default: m.RoyalArabicEditorialLayout }))
);

export const LayoutLoadingFallback: React.FC = () => (
  <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[#0E0E0E] text-[#C9A86A]">
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 border-2 border-[#C9A86A]/20 border-t-[#C9A86A] rounded-full animate-spin" />
      <span className="text-[10px] font-mono tracking-widest uppercase">FRIDA ATELIER</span>
    </div>
  </div>
);

export const renderDynamicLayout = (layoutType: string, props: TemplateLayoutProps) => {
  switch (layoutType) {
    case 'roseVelvet': return <LazyRoseVelvetLayout {...props} />;
    case 'lavenderFields': return <LazyLavenderFieldsLayout {...props} />;
    case 'sunflowerMeadow': return <LazySunflowerMeadowLayout {...props} />;
    case 'jasmineNight': return <LazyJasmineNightLayout {...props} />;
    case 'wisteriaDream': return <LazyWisteriaDreamLayout {...props} />;
    case 'celestialEclipse': return <LazyCelestialEclipseLayout {...props} />;
    case 'editorialNoir': return <LazyEditorialNoirLayout {...props} />;
    case 'enchantedBotanical': return <LazyEnchantedBotanicalLayout {...props} />;
    case 'opalDream': return <LazyOpalDreamLayout {...props} />;
    case 'royalArabicEditorial': return <LazyRoyalArabicEditorialLayout {...props} />;
    case 'crystal': return <LazyCrystalGlowLayout {...props} />;
    case 'cherry': return <LazyCherryBloomLayout {...props} />;
    case 'baroque': return <LazyGoldenBaroqueLayout {...props} />;
    case 'citrus': return <LazyFreshCitrusLayout {...props} />;
    case 'confetti': return <LazyMidnightConfettiLayout {...props} />;
    case 'emerald': return <LazyEmeraldGardenLayout {...props} />;
    case 'ocean': return <LazyOceanPearlLayout {...props} />;
    case 'autumn': return <LazyAutumnRusticLayout {...props} />;
    case 'starlit': return <LazyStarlitNightLayout {...props} />;
    case 'lace': return <LazyVintageLaceLayout {...props} />;
    case 'arabic': return <LazyArabicLuxuryLayout {...props} />;
    case 'floral': return <LazyFloralBotanicalLayout {...props} />;
    case 'boho': return <LazyBohoTerracottaLayout {...props} />;
    case 'interactive': return <LazyInteractiveStoryLayout {...props} />;
    case 'playful': return <LazyPlayfulCelebrationLayout {...props} />;
    case 'burgundy': return <LazyBurgundyMinimalistLayout {...props} />;
    case 'cinematic': return <LazyCinematicLayout {...props} />;
    case 'minimalist': return <LazyMinimalistLayout {...props} />;
    case 'royal':
    default:
      return <LazyRoyalLayout {...props} />;
  }
};
