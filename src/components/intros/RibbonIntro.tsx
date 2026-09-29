import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const RibbonIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'untying' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('untying');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-[#2A0812] via-[#1A050C] to-[#0A0206]">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(230,161,92,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center text-center p-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-2"
        >
          <span className="text-[11px] font-bold text-[#E6A15C] tracking-[0.2em] uppercase block">
            {isRtl ? '🎀 رباط الفيونكة المخملي الفاخر' : '🎀 Velvet Satin Ribbon Suite'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#E6A15C] bg-[#2A0812] border border-[#E6A15C]/40 px-4 py-1.5 rounded-full inline-block mt-2">
              {isRtl ? `بدعوة خاصة لـ: ${guestNameParam}` : `Specially Reserved For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Envelope with Ribbon Bow Knot */}
        <div className="relative w-72 h-80 flex items-center justify-center cursor-pointer" onClick={handleInteract}>
          
          {/* Card Envelope */}
          <div className="absolute inset-0 bg-[#1A080F] border-2 border-[#E6A15C]/60 rounded-3xl shadow-[0_0_50px_rgba(230,161,92,0.3)] overflow-hidden" />

          {/* Left Ribbon Wing */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-36 h-12 bg-gradient-to-r from-[#80091B] via-[#A81028] to-[#E6A15C] rounded-r-full shadow-lg origin-left z-20"
            animate={
              phase === 'untying'
                ? { x: -300, rotate: -45, opacity: 0 }
                : { x: 0 }
            }
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Right Ribbon Wing */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-36 h-12 bg-gradient-to-l from-[#80091B] via-[#A81028] to-[#E6A15C] rounded-l-full shadow-lg origin-right z-20"
            animate={
              phase === 'untying'
                ? { x: 300, rotate: 45, opacity: 0 }
                : { x: 0 }
            }
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Center Bow Knot */}
          <motion.div
            className="relative z-30 w-20 h-20 rounded-full bg-gradient-to-tr from-[#80091B] via-[#E6A15C] to-[#FAF7F2] border-2 border-[#FAF7F2] shadow-[0_0_30px_rgba(230,161,92,0.8)] flex items-center justify-center cursor-pointer"
            animate={
              phase === 'untying'
                ? { scale: [1, 1.4, 0], rotate: [0, 180, 360], opacity: [1, 1, 0] }
                : { scale: [1, 1.08, 1] }
            }
            transition={
              phase === 'untying'
                ? { duration: 1.2 }
                : { repeat: Infinity, duration: 2 }
            }
          >
            <Heart className="w-8 h-8 text-[#FAF7F2] fill-current" />
          </motion.div>

          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-10 z-40 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E6A15C] text-[#1A050C] font-bold text-xs shadow-2xl"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'اسحب أو إلمس الفيونكة لفك الرباط 🎀' : 'Pull Ribbon Bow to Untie 🎀'}</span>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
