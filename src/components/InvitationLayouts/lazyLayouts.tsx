import React from 'react';
import { TemplateLayoutProps } from './types';
import { InvitationEngine, LayoutLoadingFallback } from '../../features/invitations/engine/InvitationEngine';
import { TemplateErrorBoundary } from '../../features/invitations/engine/TemplateErrorBoundary';
import { getLazyTemplate } from '../../features/invitations/registry/templateRegistry';

export { LayoutLoadingFallback, TemplateErrorBoundary as LayoutErrorBoundary };

export const LazyRoyalLayout = getLazyTemplate('royal');
export const LazyMinimalistLayout = getLazyTemplate('minimalist');
export const LazyCinematicLayout = getLazyTemplate('cinematic');
export const LazyArabicLuxuryLayout = getLazyTemplate('arabic');
export const LazyFloralBotanicalLayout = getLazyTemplate('floral');
export const LazyBohoTerracottaLayout = getLazyTemplate('boho');
export const LazyInteractiveStoryLayout = getLazyTemplate('interactive');
export const LazyPlayfulCelebrationLayout = getLazyTemplate('playful');
export const LazyBurgundyMinimalistLayout = getLazyTemplate('burgundy');
export const LazyCrystalGlowLayout = getLazyTemplate('crystal');
export const LazyCherryBloomLayout = getLazyTemplate('cherry');
export const LazyGoldenBaroqueLayout = getLazyTemplate('baroque');
export const LazyFreshCitrusLayout = getLazyTemplate('citrus');
export const LazyMidnightConfettiLayout = getLazyTemplate('confetti');
export const LazyEmeraldGardenLayout = getLazyTemplate('emerald');
export const LazyOceanPearlLayout = getLazyTemplate('ocean');
export const LazyAutumnRusticLayout = getLazyTemplate('autumn');
export const LazyStarlitNightLayout = getLazyTemplate('starlit');
export const LazyVintageLaceLayout = getLazyTemplate('lace');
export const LazyRoseVelvetLayout = getLazyTemplate('roseVelvet');
export const LazyLavenderFieldsLayout = getLazyTemplate('lavenderFields');
export const LazySunflowerMeadowLayout = getLazyTemplate('sunflowerMeadow');
export const LazyJasmineNightLayout = getLazyTemplate('jasmineNight');
export const LazyWisteriaDreamLayout = getLazyTemplate('wisteriaDream');
export const LazyCelestialEclipseLayout = getLazyTemplate('celestialEclipse');
export const LazyEditorialNoirLayout = getLazyTemplate('editorialNoir');
export const LazyEnchantedBotanicalLayout = getLazyTemplate('enchantedBotanical');
export const LazyOpalDreamLayout = getLazyTemplate('opalDream');
export const LazyRoyalArabicEditorialLayout = getLazyTemplate('royalArabicEditorial');
export const LazyButterflyRomanceLayout = getLazyTemplate('butterflyRomance');

export const renderDynamicLayout = (layoutType: string, props: TemplateLayoutProps) => {
  return <InvitationEngine layoutType={layoutType} props={props} />;
};
