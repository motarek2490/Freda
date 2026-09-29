import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const CelestialEclipseIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'eclipsing' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('eclipsing');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#0A0710] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Radial Eclipse Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.3)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#140F22]/80 border border-[#D4AF37]/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <span className="text-[11px] font-bold text-[#D4AF37] tracking-[0.25em] uppercase block">
            {isRtl ? '✨ الكسوف السماوي والاقتران الملكي' : '✨ Celestial Eclipse Suite'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#E9E1D5] bg-[#0A0710] border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `بدعوة خاصة لـ: ${guestNameParam}` : `Reserved For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Celestial Eclipse Ring */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Rotating Constellation Orbit Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/60"
            animate={
              phase === 'eclipsing'
                ? { rotate: 360, scale: [1, 1.3, 2], opacity: [1, 1, 0] }
                : { rotate: 360 }
            }
            transition={
              phase === 'eclipsing'
                ? { duration: 1.8 }
                : { repeat: Infinity, duration: 20, ease: 'linear' }
            }
          />

          {/* Moon Core */}
          <motion.div
            className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FAF7F2] via-[#D4AF37] to-[#140F22] border-2 border-[#FAF7F2] shadow-[0_0_60px_rgba(212,175,55,1)] flex items-center justify-center z-20"
            animate={
              phase === 'eclipsing'
                ? { scale: [1, 2, 0], opacity: [1, 1, 0] }
                : { scale: [1, 1.05, 1] }
            }
            transition={
              phase === 'eclipsing'
                ? { duration: 1.5 }
                : { repeat: Infinity, duration: 2.5 }
            }
          >
            <Moon className="w-12 h-12 text-[#140F22] fill-current" />
          </motion.div>

        </div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D4AF37] text-[#0A0710] font-bold text-xs shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس الخاتم السماوي لبدء الاقتران والفتح ✨' : 'Touch Ring for Eclipse Opening ✨'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
