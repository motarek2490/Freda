import React, { lazy } from 'react';
import { TemplateLayoutProps } from './types';

const FallbackPlaceholder: React.FC<TemplateLayoutProps> = () => (
  <div className="min-h-screen bg-[#0E0D0B] text-[#D4AF37] flex items-center justify-center p-6">
    <div className="animate-pulse text-center font-serif text-lg tracking-widest">
      FRIDA ROYAL INVITATION
    </div>
  </div>
);

/**
 * Resilient dynamic layout importer with automatic retry and graceful fallback.
 * Prevents "Failed to fetch dynamically imported module" from crashing the invitation view.
 */
function safeLazy<T extends Record<string, any>>(
  importer: () => Promise<T>,
  componentName: string
): React.LazyExoticComponent<React.FC<TemplateLayoutProps>> {
  return lazy(async () => {
    try {
      const mod = await importer();
      return { default: mod.default || mod[componentName] };
    } catch (firstErr) {
      console.warn(`[FRIDA Layout] Initial load failed for ${componentName}, retrying in 300ms...`, firstErr);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mod = await importer();
        return { default: mod.default || mod[componentName] };
      } catch (secondErr) {
        console.error(`[FRIDA Layout] Second load attempt failed for ${componentName}. Falling back:`, secondErr);
        try {
          const fallback = await import('./RoyalLayout');
          return { default: fallback.default || fallback.RoyalLayout };
        } catch (fallbackErr) {
          console.error('[FRIDA Layout] Critical fallback failed:', fallbackErr);
          return { default: FallbackPlaceholder };
        }
      }
    }
  });
}

export const LazyRoyalLayout = safeLazy(() => import('./RoyalLayout'), 'RoyalLayout');
export const LazyMinimalistLayout = safeLazy(() => import('./MinimalistLayout'), 'MinimalistLayout');
export const LazyCinematicLayout = safeLazy(() => import('./CinematicLayout'), 'CinematicLayout');
export const LazyArabicLuxuryLayout = safeLazy(() => import('./ArabicLuxuryLayout'), 'ArabicLuxuryLayout');
export const LazyFloralBotanicalLayout = safeLazy(() => import('./FloralBotanicalLayout'), 'FloralBotanicalLayout');
export const LazyBohoTerracottaLayout = safeLazy(() => import('./BohoTerracottaLayout'), 'BohoTerracottaLayout');
export const LazyInteractiveStoryLayout = safeLazy(() => import('./InteractiveStoryLayout'), 'InteractiveStoryLayout');
export const LazyPlayfulCelebrationLayout = safeLazy(() => import('./PlayfulCelebrationLayout'), 'PlayfulCelebrationLayout');
export const LazyBurgundyMinimalistLayout = safeLazy(() => import('./BurgundyMinimalistLayout'), 'BurgundyMinimalistLayout');
export const LazyCrystalGlowLayout = safeLazy(() => import('./CrystalGlowLayout'), 'CrystalGlowLayout');
export const LazyCherryBloomLayout = safeLazy(() => import('./CherryBloomLayout'), 'CherryBloomLayout');
export const LazyGoldenBaroqueLayout = safeLazy(() => import('./GoldenBaroqueLayout'), 'GoldenBaroqueLayout');
export const LazyFreshCitrusLayout = safeLazy(() => import('./FreshCitrusLayout'), 'FreshCitrusLayout');
export const LazyMidnightConfettiLayout = safeLazy(() => import('./MidnightConfettiLayout'), 'MidnightConfettiLayout');
export const LazyEmeraldGardenLayout = safeLazy(() => import('./EmeraldGardenLayout'), 'EmeraldGardenLayout');
export const LazyOceanPearlLayout = safeLazy(() => import('./OceanPearlLayout'), 'OceanPearlLayout');
export const LazyAutumnRusticLayout = safeLazy(() => import('./AutumnRusticLayout'), 'AutumnRusticLayout');
export const LazyStarlitNightLayout = safeLazy(() => import('./StarlitNightLayout'), 'StarlitNightLayout');
export const LazyVintageLaceLayout = safeLazy(() => import('./VintageLaceLayout'), 'VintageLaceLayout');
export const LazyRoseVelvetLayout = safeLazy(() => import('./RoseVelvetLayout'), 'RoseVelvetLayout');
export const LazyLavenderFieldsLayout = safeLazy(() => import('./LavenderFieldsLayout'), 'LavenderFieldsLayout');
export const LazySunflowerMeadowLayout = safeLazy(() => import('./SunflowerMeadowLayout'), 'SunflowerMeadowLayout');
export const LazyJasmineNightLayout = safeLazy(() => import('./JasmineNightLayout'), 'JasmineNightLayout');
export const LazyWisteriaDreamLayout = safeLazy(() => import('./WisteriaDreamLayout'), 'WisteriaDreamLayout');
export const LazyCelestialEclipseLayout = safeLazy(() => import('./CelestialEclipseLayout'), 'CelestialEclipseLayout');
export const LazyEditorialNoirLayout = safeLazy(() => import('./EditorialNoirLayout'), 'EditorialNoirLayout');
export const LazyEnchantedBotanicalLayout = safeLazy(() => import('./EnchantedBotanicalLayout'), 'EnchantedBotanicalLayout');
export const LazyOpalDreamLayout = safeLazy(() => import('./OpalDreamLayout'), 'OpalDreamLayout');
export const LazyRoyalArabicEditorialLayout = safeLazy(() => import('./RoyalArabicEditorialLayout'), 'RoyalArabicEditorialLayout');
export const LazyButterflyRomanceLayout = safeLazy(() => import('./ButterflyRomanceLayout'), 'ButterflyRomanceLayout');

export const LayoutLoadingFallback: React.FC = () => (
  <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[#0E0E0E] text-[#C9A86A]">
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 border-2 border-[#C9A86A]/20 border-t-[#C9A86A] rounded-full animate-spin" />
      <span className="text-[10px] font-mono tracking-widest uppercase">FRIDA ATELIER</span>
    </div>
  </div>
);

/**
 * Layout Error Boundary to prevent template rendering crashes
 */
export class LayoutErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackProps: TemplateLayoutProps },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallbackProps: TemplateLayoutProps }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[FRIDA] Error in template layout execution:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <LazyRoyalLayout {...this.props.fallbackProps} />;
    }
    return this.props.children;
  }
}

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
    case 'butterflyRomance': return <LazyButterflyRomanceLayout {...props} />;
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
