import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, PartyPopper } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const GiftBoxIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'popping' | 'revealed'>('idle');

  const name = invitation.eventDetails.eventTitle || invitation.title || (isRtl ? 'عيد ميلاد سعيد' : 'Happy Birthday');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('popping');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  // Generate 20 confetti particles
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 1) * 350,
    color: ['#EC4899', '#8B5CF6', '#F59E0B', '#10B981', '#3B82F6'][i % 5],
  }));

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#180B1E] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Festive Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.25)_0%,_transparent_75%)] pointer-events-none" />

      {/* Confetti Explosion Particles */}
      {phase === 'popping' &&
        confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute w-3 h-3 rounded-full z-40"
            style={{ backgroundColor: c.color }}
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{ x: c.x, y: c.y, scale: [0, 1.5, 0], rotate: 360 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
        ))}

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#2D1239]/90 border border-[#EC4899]/50 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EC4899]/20 text-[#EC4899] text-[11px] font-bold">
            <PartyPopper className="w-3.5 h-3.5" />
            <span>{isRtl ? '🎉 صندوق هدايا الحفل والكونفيتي' : '🎉 Celebration Gift Unboxing'}</span>
          </div>

          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {name}
          </h2>

          {guestNameParam && (
            <p className="text-xs text-[#FBCFE8] bg-[#180B1E] border border-[#EC4899]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف: ${guestNameParam}` : `Specially For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Gift Box Component */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          
          {/* Box Lid */}
          <motion.div
            className="absolute top-4 w-44 h-12 bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#EC4899] rounded-t-2xl border-2 border-[#FAF7F2] shadow-2xl z-30 flex items-center justify-center"
            animate={
              phase === 'popping'
                ? { y: -200, rotate: -25, opacity: 0 }
                : { y: 0 }
            }
            transition={{ duration: 1.2 }}
          >
            <div className="w-6 h-full bg-[#F59E0B]" />
          </motion.div>

          {/* Box Body */}
          <div className="absolute bottom-4 w-40 h-36 bg-gradient-to-b from-[#8B5CF6] to-[#4C1D95] rounded-b-2xl border-2 border-[#FAF7F2] shadow-2xl z-20 flex items-center justify-center overflow-hidden">
            <div className="w-6 h-full bg-[#F59E0B]" />
          </div>

          {/* Center Gift Icon */}
          <motion.div
            className="relative z-40 w-16 h-16 rounded-full bg-[#F59E0B] border-2 border-[#FAF7F2] shadow-2xl flex items-center justify-center"
            animate={
              phase === 'popping'
                ? { scale: [1, 1.8, 0], opacity: [1, 1, 0] }
                : { scale: [1, 1.1, 1] }
            }
            transition={
              phase === 'popping'
                ? { duration: 1 }
                : { repeat: Infinity, duration: 2 }
            }
          >
            <Gift className="w-8 h-8 text-[#180B1E]" />
          </motion.div>

        </div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EC4899] text-[#180B1E] font-bold text-xs shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'افتح صندوق الهدايا لتفجير الكونفيتي 🎁' : 'Open Gift Box for Confetti Burst 🎁'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
