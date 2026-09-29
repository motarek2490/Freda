import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const AutumnLeavesIntro: React.FC<IntroBaseProps> = ({
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
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#1C0D02] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Warm Autumn Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.25)_0%,_transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#2E1605]/90 border border-[#F97316]/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <span className="text-[11px] font-bold text-[#F97316] tracking-[0.25em] uppercase block">
            {isRtl ? '🍁 أوراق الخريف الدافئة والحبل الريفي' : '🍁 Rustic Autumn Leaves Suite'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#FFEDD5] bg-[#1C0D02] border border-[#F97316]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف: ${guestNameParam}` : `Specially Reserved For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Center Twine & Oak Leaf Button */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFEDD5] via-[#F97316] to-[#7C2D12] border-2 border-[#FAF7F2] shadow-[0_0_50px_rgba(249,115,22,0.9)] flex items-center justify-center cursor-pointer z-20"
          animate={
            phase === 'opening'
              ? { scale: [1, 1.8, 0], rotate: 180, opacity: [1, 1, 0] }
              : { y: [0, -6, 0] }
          }
          transition={
            phase === 'opening'
              ? { duration: 1.5 }
              : { repeat: Infinity, duration: 2.5 }
          }
        >
          <Sun className="w-10 h-10 text-[#1C0D02]" />
        </motion.div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F97316] text-[#1C0D02] font-bold text-xs shadow-2xl z-20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس العقدة الريفية لفك الحبل وتناثر الأوراق 🍁' : 'Touch Knot to Untie 🍁'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
