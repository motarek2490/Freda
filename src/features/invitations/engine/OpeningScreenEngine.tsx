import React, { useMemo } from 'react';
import { InvitationData } from '../../../types';
import { TemplateOpeningScreenProps } from '../model/templateContract';
import { ArabicLuxuryOpeningScreen } from '../templates/arabic-luxury/OpeningScreen';
import { RoyalOpeningScreen } from '../templates/royal/OpeningScreen';
import { ButterflyOpeningScreen } from '../templates/butterfly-romance/OpeningScreen';
import { CinematicOpeningScreen } from '../templates/cinematic/OpeningScreen';

// Fallback intros
import { RibbonIntro } from '../../../components/intros/RibbonIntro';
import { RoyalGateIntro } from '../../../components/intros/RoyalGateIntro';
import { PetalsIntro } from '../../../components/intros/PetalsIntro';
import { LanternsStarsIntro } from '../../../components/intros/LanternsStarsIntro';
import { CelestialEclipseIntro } from '../../../components/intros/CelestialEclipseIntro';
import { ShellPearlIntro } from '../../../components/intros/ShellPearlIntro';
import { ScrollBookIntro } from '../../../components/intros/ScrollBookIntro';
import { LaceVeilIntro } from '../../../components/intros/LaceVeilIntro';
import { CrystalPrismIntro } from '../../../components/intros/CrystalPrismIntro';
import { GiftBoxIntro } from '../../../components/intros/GiftBoxIntro';
import { CradleCloudsIntro } from '../../../components/intros/CradleCloudsIntro';
import { GraduationScrollIntro } from '../../../components/intros/GraduationScrollIntro';
import { AutumnLeavesIntro } from '../../../components/intros/AutumnLeavesIntro';
import { WaxSealIntro } from '../../../components/intros/WaxSealIntro';

interface OpeningScreenEngineProps {
  invitation: InvitationData;
  guestNameParam: string | null;
  isRtl: boolean;
  onComplete: () => void;
  shouldReduceMotion: boolean;
}

export const OpeningScreenEngine: React.FC<OpeningScreenEngineProps> = (props) => {
  const { invitation } = props;
  const layout = invitation.layoutType || (invitation.templateId?.includes('arabic') ? 'arabic' : 'royal');

  // Direct template module OpeningScreen delegation
  if (layout === 'arabic' || invitation.templateId?.includes('arabic')) {
    return <ArabicLuxuryOpeningScreen {...props} />;
  }

  if (layout === 'butterflyRomance' || invitation.templateId?.includes('butterfly')) {
    return <ButterflyOpeningScreen {...props} />;
  }

  if (layout === 'cinematic' || invitation.templateId?.includes('cinematic')) {
    return <CinematicOpeningScreen {...props} />;
  }

  if (layout === 'royal') {
    return <RoyalOpeningScreen {...props} />;
  }

  // Fallback routing by introType or theme
  const introType = invitation.introType || invitation.openingStyle || '';

  switch (introType) {
    case 'curtain':
      return <CinematicOpeningScreen {...props} />;
    case 'butterfly':
      return <ButterflyOpeningScreen {...props} />;
    case 'romantic-heart':
      return <ArabicLuxuryOpeningScreen {...props} />;
    case 'ribbon':
      return <RibbonIntro {...props} />;
    case 'royal-gate':
      return <RoyalGateIntro {...props} />;
    case 'petals':
      return <PetalsIntro {...props} />;
    case 'lanterns-stars':
      return <LanternsStarsIntro {...props} />;
    case 'celestial-eclipse':
      return <CelestialEclipseIntro {...props} />;
    case 'ocean-pearl':
      return <ShellPearlIntro {...props} />;
    case 'scroll-book':
      return <ScrollBookIntro {...props} />;
    case 'lace-veil':
      return <LaceVeilIntro {...props} />;
    case 'crystal-prism':
      return <CrystalPrismIntro {...props} />;
    case 'gift-unboxing':
      return <GiftBoxIntro {...props} />;
    case 'baby-cradle':
      return <CradleCloudsIntro {...props} />;
    case 'graduation-scroll':
      return <GraduationScrollIntro {...props} />;
    case 'autumn-leaves':
      return <AutumnLeavesIntro {...props} />;
    default:
      return <WaxSealIntro {...props} />;
  }
};
