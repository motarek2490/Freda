import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gem } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const CrystalPrismIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'shimmering' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('shimmering');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#090D16] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Crystal Diamond Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.3)_0%,_transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#0F172A]/90 border border-[#38BDF8]/50 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <span className="text-[11px] font-bold text-[#38BDF8] tracking-[0.25em] uppercase block">
            {isRtl ? '💎 الكريستال الألماسي المشع' : '💎 Crystal Diamond Prism Suite'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#E0F2FE] bg-[#090D16] border border-[#38BDF8]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `بدعوة لـ: ${guestNameParam}` : `Specially Reserved For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Diamond Prism Center */}
        <motion.div
          className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-[#38BDF8] via-[#E0F2FE] to-[#FFFFFF] p-0.5 shadow-[0_0_60px_rgba(56,189,248,1)] flex items-center justify-center cursor-pointer"
          animate={
            phase === 'shimmering'
              ? { scale: [1, 2, 0], rotate: 360, opacity: [1, 1, 0] }
              : { rotate: [0, 45, 0], scale: [1, 1.05, 1] }
          }
          transition={
            phase === 'shimmering'
              ? { duration: 1.5 }
              : { repeat: Infinity, duration: 4 }
          }
        >
          <div className="w-full h-full rounded-3xl bg-[#090D16] flex items-center justify-center text-[#38BDF8]">
            <Gem className="w-12 h-12 text-[#38BDF8] animate-pulse" />
          </div>
        </motion.div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#38BDF8] text-[#090D16] font-bold text-xs shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس الكريستال لإشعاع الضوء وفتح الدعوة 💎' : 'Touch Crystal to Radiate Light 💎'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
