import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FastForward, Sparkles } from 'lucide-react';
import { InvitationData } from '../../types';

// Intro Engine Components
import { ButterflyIntro } from './ButterflyIntro';
import { CurtainCinematicIntro } from './CurtainCinematicIntro';
import { WaxSealIntro } from './WaxSealIntro';
import { RibbonIntro } from './RibbonIntro';
import { RoyalGateIntro } from './RoyalGateIntro';
import { PetalsIntro } from './PetalsIntro';
import { LanternsStarsIntro } from './LanternsStarsIntro';
import { CelestialEclipseIntro } from './CelestialEclipseIntro';
import { ShellPearlIntro } from './ShellPearlIntro';
import { ScrollBookIntro } from './ScrollBookIntro';
import { LaceVeilIntro } from './LaceVeilIntro';
import { CrystalPrismIntro } from './CrystalPrismIntro';
import { GiftBoxIntro } from './GiftBoxIntro';
import { CradleCloudsIntro } from './CradleCloudsIntro';
import { GraduationScrollIntro } from './GraduationScrollIntro';
import { AutumnLeavesIntro } from './AutumnLeavesIntro';
import { RomanticHeartIntro } from './RomanticHeartIntro';

export interface IntroBaseProps {
  invitation: InvitationData;
  guestNameParam: string | null;
  isRtl: boolean;
  onComplete: () => void;
  shouldReduceMotion: boolean;
}

interface IntroRouterProps {
  invitation: InvitationData;
  guestNameParam: string | null;
  isRtl: boolean;
  onOpen: () => void;
}

export const IntroRouter: React.FC<IntroRouterProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onOpen,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [hasSkipped, setHasSkipped] = useState(false);

  // If user prefers reduced motion, bypass long animations or auto-trigger completion
  const shouldReduceMotion = Boolean(prefersReducedMotion);

  const handleSkip = () => {
    setHasSkipped(true);
    onOpen();
  };

  if (hasSkipped) return null;

  // Determine intro engine from explicit introType, openingStyle, or fallback layoutType
  const layout = invitation.layoutType || (invitation.templateId?.includes('arabic') ? 'arabic' : 'royal');
  const introType =
    (layout === 'arabic' || invitation.templateId?.includes('arabic'))
      ? 'romantic-heart'
      : (invitation.introType || invitation.openingStyle || getIntroTypeFromLayout(layout));

  const renderIntroEngine = () => {
    const commonProps: IntroBaseProps = {
      invitation,
      guestNameParam,
      isRtl,
      onComplete: onOpen,
      shouldReduceMotion,
    };

    switch (introType) {
      case 'romantic-heart':
      case 'arabic-luxury':
        return <RomanticHeartIntro {...commonProps} />;
      case 'butterfly':
        return <ButterflyIntro {...commonProps} />;
      case 'curtain':
      case 'curtain-reveal':
        return <CurtainCinematicIntro {...commonProps} />;
      case 'wax-seal':
      case 'wax_seal':
        return <WaxSealIntro {...commonProps} />;
      case 'ribbon':
        return <RibbonIntro {...commonProps} />;
      case 'royal-gate':
      case 'royal_door':
        return <RoyalGateIntro {...commonProps} />;
      case 'petals':
      case 'petal-scatter':
        return <PetalsIntro {...commonProps} />;
      case 'lanterns-stars':
        return <LanternsStarsIntro {...commonProps} />;
      case 'celestial-eclipse':
        return <CelestialEclipseIntro {...commonProps} />;
      case 'ocean-pearl':
        return <ShellPearlIntro {...commonProps} />;
      case 'scroll-book':
        return <ScrollBookIntro {...commonProps} />;
      case 'lace-veil':
        return <LaceVeilIntro {...commonProps} />;
      case 'crystal-prism':
        return <CrystalPrismIntro {...commonProps} />;
      case 'gift-unboxing':
        return <GiftBoxIntro {...commonProps} />;
      case 'baby-cradle':
        return <CradleCloudsIntro {...commonProps} />;
      case 'graduation-scroll':
        return <GraduationScrollIntro {...commonProps} />;
      case 'autumn-leaves':
        return <AutumnLeavesIntro {...commonProps} />;
      default:
        // Default luxury fallback based on category or layout
        return <WaxSealIntro {...commonProps} />;
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 overflow-hidden bg-[#0D0D0D] flex items-center justify-center select-none"
    >
      {/* Always Visible Skip Button */}
      <button
        onClick={handleSkip}
        type="button"
        className="fixed top-5 left-5 sm:left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-[#171717]/85 border border-[#B99A65]/50 text-[#F7F4EE] hover:text-[#B99A65] hover:bg-[#171717] hover:border-[#B99A65] backdrop-blur-md text-xs font-bold transition-all shadow-lg hover:shadow-[0_0_20px_rgba(185,154,101,0.3)] cursor-pointer group"
      >
        <span>{isRtl ? 'تخطي الافتتاحية' : 'Skip Intro'}</span>
        <FastForward className="w-3.5 h-3.5 text-[#B99A65] group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Main Active Intro Engine */}
      {renderIntroEngine()}
    </div>
  );
};

// Helper: Infer introType from template layoutType
function getIntroTypeFromLayout(layout: string): string {
  switch (layout) {
    case 'butterflyRomance':
      return 'butterfly';
    case 'cinematic':
      return 'curtain';
    case 'royal':
    case 'royalArabicEditorial':
    case 'editorialNoir':
      return 'wax-seal';
    case 'burgundy':
    case 'minimalist':
    case 'roseVelvet':
    case 'lavenderFields':
      return 'ribbon';
    case 'arabic':
      return 'romantic-heart';
    case 'baroque':
    case 'emerald':
      return 'royal-gate';
    case 'cherry':
    case 'jasmineNight':
    case 'wisteriaDream':
    case 'sunflowerMeadow':
    case 'citrus':
      return 'petals';
    case 'starlit':
      return 'lanterns-stars';
    case 'celestialEclipse':
      return 'celestial-eclipse';
    case 'ocean':
      return 'ocean-pearl';
    case 'interactive':
    case 'boho':
      return 'scroll-book';
    case 'lace':
      return 'lace-veil';
    case 'crystal':
      return 'crystal-prism';
    case 'confetti':
      return 'gift-unboxing';
    case 'opalDream':
      return 'baby-cradle';
    case 'playful':
      return 'graduation-scroll';
    case 'autumn':
      return 'autumn-leaves';
    default:
      return 'wax-seal';
  }
}
