import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gem } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const LaceVeilIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'lifting' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('lifting');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#120F12] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Pearl Ambient Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(245,245,244,0.15)_0%,_transparent_75%)] pointer-events-none" />

      {/* Lace Veil Fabric Overlay */}
      <motion.div
        className="absolute inset-0 bg-[#292524]/60 backdrop-blur-sm z-20 border-b-4 border-[#E7E5E4] flex flex-col justify-center items-center p-6"
        animate={
          phase === 'lifting'
            ? { y: '-100%', opacity: 0 }
            : { y: '0%' }
        }
        transition={{ duration: 2.2, ease: [0.25, 1, 0.5, 1] }}
      >
        {/* Lace Pattern Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E7E5E4_1px,transparent_1px)] [background-size:16px_16px]" />
      </motion.div>

      <div className="relative z-30 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#1C1917]/90 border border-[#E7E5E4]/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <span className="text-[11px] font-bold text-[#E7E5E4] tracking-[0.25em] uppercase block">
            {isRtl ? '👰 طرحة الدانتيل العتيقة والدبوس اللؤلؤي' : '👰 Vintage Lace Veil Suite'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#E7E5E4] bg-[#120F12] border border-[#E7E5E4]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف: ${guestNameParam}` : `Specially Reserved For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Pearl Pin Seal */}
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#E7E5E4] to-[#78716C] border-2 border-[#FFFFFF] shadow-[0_0_50px_rgba(255,255,255,0.9)] flex items-center justify-center cursor-pointer z-40"
          animate={
            phase === 'lifting'
              ? { y: -200, scale: 0, opacity: 0 }
              : { scale: [1, 1.08, 1] }
          }
          transition={
            phase === 'lifting'
              ? { duration: 1 }
              : { repeat: Infinity, duration: 2 }
          }
        >
          <Gem className="w-8 h-8 text-[#1C1917]" />
        </motion.div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E7E5E4] text-[#1C1917] font-bold text-xs shadow-2xl z-40"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس الدبوس اللؤلؤي لرفع طرحة الدانتيل 👰' : 'Touch Pearl Pin to Lift Veil 👰'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
