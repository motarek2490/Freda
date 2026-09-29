import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Star } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const LanternsStarsIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'glowing' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('glowing');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3400);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#0B0D1B] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Night Sky Background Stardust */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25)_0%,_transparent_75%)] pointer-events-none" />

      {/* Hanging Lanterns Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-48 flex justify-around pointer-events-none z-20">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center origin-top"
            animate={
              phase === 'glowing'
                ? { y: [0, -20, 100], opacity: [1, 1, 0] }
                : { rotate: [i % 2 === 0 ? 3 : -3, i % 2 === 0 ? -3 : 3] }
            }
            transition={
              phase === 'glowing'
                ? { duration: 2, delay: i * 0.2 }
                : { repeat: Infinity, repeatType: 'reverse', duration: 3 + i }
            }
          >
            <div className="w-0.5 h-20 bg-gradient-to-b from-[#B99A65] to-transparent" />
            <div className="w-10 h-14 bg-gradient-to-b from-[#E6CA94] via-[#B99A65] to-[#735A2B] rounded-2xl border border-[#FAF7F2] shadow-[0_0_25px_rgba(230,202,148,0.8)] flex items-center justify-center">
              <div className="w-4 h-6 bg-[#FFF] rounded-full blur-[2px] animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-30 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title Frame */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#13172E]/80 border border-[#818CF8]/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#818CF8]/20 text-[#818CF8] text-[11px] font-bold">
            <Moon className="w-3.5 h-3.5" />
            <span>{isRtl ? '🌙 ليلة نجوم وفوانيس فريدا' : '🌙 Starlit Lantern Night'}</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>

          {guestNameParam && (
            <p className="text-xs text-[#E0E7FF] bg-[#0B0D1B] border border-[#818CF8]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف: ${guestNameParam}` : `Exclusively For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Center Glowing Crescent */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#818CF8] via-[#C084FC] to-[#FAF7F2] p-0.5 shadow-[0_0_50px_rgba(129,140,248,0.9)] flex items-center justify-center"
          animate={
            phase === 'glowing'
              ? { scale: [1, 1.8, 0], rotate: 180, opacity: [1, 1, 0] }
              : { scale: [1, 1.08, 1] }
          }
          transition={
            phase === 'glowing'
              ? { duration: 1.5 }
              : { repeat: Infinity, duration: 2.5 }
          }
        >
          <div className="w-full h-full rounded-full bg-[#0B0D1B] flex items-center justify-center text-[#818CF8]">
            <Star className="w-10 h-10 fill-current animate-pulse" />
          </div>
        </motion.div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#818CF8] text-[#0B0D1B] font-bold text-xs shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس السماء لتنوير الفوانيس والنجوم 🌙' : 'Touch Sky to Light Up Lanterns 🌙'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
