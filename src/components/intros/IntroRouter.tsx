import React, { useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { FastForward } from 'lucide-react';
import { InvitationData } from '../../types';
import { OpeningScreenEngine } from '../../features/invitations/engine/OpeningScreenEngine';

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

      {/* Template-Specific Opening Screen Engine */}
      <OpeningScreenEngine
        invitation={invitation}
        guestNameParam={guestNameParam}
        isRtl={isRtl}
        onComplete={onOpen}
        shouldReduceMotion={shouldReduceMotion}
      />
    </div>
  );
};

