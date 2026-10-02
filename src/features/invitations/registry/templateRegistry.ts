import React, { lazy } from 'react';
import { InvitationTemplateProps, TemplateConfig } from '../model/templateContract';
import { logger } from '../../../shared/utils/logger';

/**
 * Registry mapping template layouts to dynamic/lazy import functions.
 * Does NOT bundle all templates into the initial bundle - each is dynamically chunked.
 */
export const templateRegistry: Record<
  string,
  () => Promise<{ default: React.ComponentType<InvitationTemplateProps>; config?: TemplateConfig }>
> = {
  royal: () => import('../templates/royal'),
  minimalist: () => import('../templates/minimalist'),
  cinematic: () => import('../templates/cinematic'),
  arabic: () => import('../templates/arabic-luxury'),
  'arabic-luxury': () => import('../templates/arabic-luxury'),
  'romantic-canvas': () => import('../templates/arabic-luxury'),
  floral: () => import('../templates/floral-botanical'),
  'floral-botanical': () => import('../templates/floral-botanical'),
  boho: () => import('../templates/boho-terracotta'),
  'boho-terracotta': () => import('../templates/boho-terracotta'),
  interactive: () => import('../templates/interactive-story'),
  'interactive-story': () => import('../templates/interactive-story'),
  playful: () => import('../templates/playful-celebration'),
  'playful-celebration': () => import('../templates/playful-celebration'),
  burgundy: () => import('../templates/burgundy-minimalist'),
  'burgundy-minimalist': () => import('../templates/burgundy-minimalist'),
  crystal: () => import('../templates/crystal-glow'),
  'crystal-glow': () => import('../templates/crystal-glow'),
  cherry: () => import('../templates/cherry-bloom'),
  'cherry-bloom': () => import('../templates/cherry-bloom'),
  baroque: () => import('../templates/golden-baroque'),
  'golden-baroque': () => import('../templates/golden-baroque'),
  citrus: () => import('../templates/fresh-citrus'),
  'fresh-citrus': () => import('../templates/fresh-citrus'),
  confetti: () => import('../templates/midnight-confetti'),
  'midnight-confetti': () => import('../templates/midnight-confetti'),
  emerald: () => import('../templates/emerald-garden'),
  'emerald-garden': () => import('../templates/emerald-garden'),
  ocean: () => import('../templates/ocean-pearl'),
  'ocean-pearl': () => import('../templates/ocean-pearl'),
  autumn: () => import('../templates/autumn-rustic'),
  'autumn-rustic': () => import('../templates/autumn-rustic'),
  starlit: () => import('../templates/starlit-night'),
  'starlit-night': () => import('../templates/starlit-night'),
  lace: () => import('../templates/vintage-lace'),
  'vintage-lace': () => import('../templates/vintage-lace'),
  roseVelvet: () => import('../templates/rose-velvet'),
  'rose-velvet': () => import('../templates/rose-velvet'),
  lavenderFields: () => import('../templates/lavender-fields'),
  'lavender-fields': () => import('../templates/lavender-fields'),
  sunflowerMeadow: () => import('../templates/sunflower-meadow'),
  'sunflower-meadow': () => import('../templates/sunflower-meadow'),
  jasmineNight: () => import('../templates/jasmine-night'),
  'jasmine-night': () => import('../templates/jasmine-night'),
  wisteriaDream: () => import('../templates/wisteria-dream'),
  'wisteria-dream': () => import('../templates/wisteria-dream'),
  celestialEclipse: () => import('../templates/celestial-eclipse'),
  'celestial-eclipse': () => import('../templates/celestial-eclipse'),
  editorialNoir: () => import('../templates/editorial-noir'),
  'editorial-noir': () => import('../templates/editorial-noir'),
  enchantedBotanical: () => import('../templates/enchanted-botanical'),
  'enchanted-botanical': () => import('../templates/enchanted-botanical'),
  opalDream: () => import('../templates/opal-dream'),
  'opal-dream': () => import('../templates/opal-dream'),
  royalArabicEditorial: () => import('../templates/royal-arabic-editorial'),
  'royal-arabic-editorial': () => import('../templates/royal-arabic-editorial'),
  butterflyRomance: () => import('../templates/butterfly-romance'),
  'butterfly-romance': () => import('../templates/butterfly-romance'),
  starter: () => import('../templates/_starter'),
};

/**
 * Resilient lazy loader for template components with automatic retry and error capture.
 */
export function getLazyTemplate(
  layoutType: string
): React.LazyExoticComponent<React.ComponentType<InvitationTemplateProps>> {
  const loader = templateRegistry[layoutType] || templateRegistry.royal;

  return lazy(async () => {
    try {
      logger.debug('Loading template module', { layoutType });
      const mod = await loader();
      return { default: mod.default };
    } catch (firstErr) {
      logger.warn(`Initial chunk load failed for template "${layoutType}", retrying in 300ms...`, { layoutType }, firstErr);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const mod = await loader();
        return { default: mod.default };
      } catch (secondErr) {
        logger.error(`Second load attempt failed for template "${layoutType}"`, { layoutType }, secondErr);
        // Fallback to royal layout module
        const fallbackMod = await templateRegistry.royal();
        return { default: fallbackMod.default };
      }
    }
  });
}
