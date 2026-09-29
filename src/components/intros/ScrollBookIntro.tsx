import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Scroll } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const ScrollBookIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('opening');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#140F0A] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Warm Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(185,154,101,0.25)_0%,_transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#211A13]/90 border border-[#B99A65]/50 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A65]/20 text-[#B99A65] text-[11px] font-bold">
            <Scroll className="w-3.5 h-3.5" />
            <span>{isRtl ? '📜 المخطوطة الملكية وسجل العمر' : '📜 Royal Journal & Scroll Suite'}</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>

          {guestNameParam && (
            <p className="text-xs text-[#E9E1D5] bg-[#140F0A] border border-[#B99A65]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف: ${guestNameParam}` : `Specially For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* 3D Journal / Book Frame */}
        <div className="relative w-64 h-80 flex items-center justify-center perspective-[1000px]">
          
          {/* Leather Book Cover Left */}
          <motion.div
            className="w-1/2 h-full bg-[#2E2218] border-2 border-[#B99A65] rounded-l-2xl shadow-2xl flex flex-col justify-between p-4 origin-left z-20"
            animate={
              phase === 'opening'
                ? { rotateY: -140, opacity: 0 }
                : { rotateY: 0 }
            }
            transition={{ duration: 1.8 }}
          >
            <div className="border border-[#B99A65]/30 h-full rounded-l-xl p-2 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#B99A65]" />
            </div>
          </motion.div>

          {/* Leather Book Cover Right */}
          <motion.div
            className="w-1/2 h-full bg-[#2E2218] border-2 border-[#B99A65] rounded-r-2xl shadow-2xl flex flex-col justify-between p-4 origin-right z-20"
            animate={
              phase === 'opening'
                ? { rotateY: 140, opacity: 0 }
                : { rotateY: 0 }
            }
            transition={{ duration: 1.8 }}
          >
            <div className="border border-[#B99A65]/30 h-full rounded-r-xl p-2 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-[#B99A65]" />
            </div>
          </motion.div>

          {/* Center Latch Lock */}
          <motion.div
            className="absolute z-30 w-16 h-16 rounded-full bg-gradient-to-br from-[#E6CA94] via-[#B99A65] to-[#735A2B] border-2 border-[#FAF7F2] shadow-2xl flex items-center justify-center"
            animate={
              phase === 'opening'
                ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] }
                : { scale: [1, 1.05, 1] }
            }
            transition={
              phase === 'opening'
                ? { duration: 1 }
                : { repeat: Infinity, duration: 2 }
            }
          >
            <Scroll className="w-7 h-7 text-[#140F0A]" />
          </motion.div>

        </div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B99A65] text-[#140F0A] font-bold text-xs shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس المخطوطة لتقليب الصفحات واستعراض الدعوة 📜' : 'Touch Scroll to Open Pages 📜'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
