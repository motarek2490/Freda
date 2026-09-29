import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Cloud, Moon } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const CradleCloudsIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealed'>('idle');

  const title = invitation.eventDetails.eventTitle || invitation.title || (isRtl ? 'حفل استعراض المولود' : 'Baby Shower');

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
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#0B1320] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Soft Pastel Blue Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(147,197,253,0.25)_0%,_transparent_75%)] pointer-events-none" />

      {/* Floating Clouds Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 text-[#93C5FD]/30"
          animate={{ x: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        >
          <Cloud className="w-24 h-24" />
        </motion.div>
        <motion.div
          className="absolute bottom-12 right-12 text-[#93C5FD]/30"
          animate={{ x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        >
          <Cloud className="w-32 h-32" />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#17253D]/90 border border-[#93C5FD]/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <span className="text-[11px] font-bold text-[#93C5FD] tracking-[0.25em] uppercase block">
            {isRtl ? '🍼 استقبال المهد والغيوم الحالمة' : '🍼 Dreamy Cradle & Clouds Suite'}
          </span>
          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {title}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#BFDBFE] bg-[#0B1320] border border-[#93C5FD]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف: ${guestNameParam}` : `Specially For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Cradle Center Button */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#BFDBFE] via-[#93C5FD] to-[#3B82F6] border-2 border-[#FAF7F2] shadow-[0_0_50px_rgba(147,197,253,0.9)] flex items-center justify-center cursor-pointer z-20"
          animate={
            phase === 'opening'
              ? { scale: [1, 1.8, 0], opacity: [1, 1, 0] }
              : { y: [0, -6, 0] }
          }
          transition={
            phase === 'opening'
              ? { duration: 1.5 }
              : { repeat: Infinity, duration: 2.5 }
          }
        >
          <Heart className="w-10 h-10 text-[#0B1320] fill-current" />
        </motion.div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#93C5FD] text-[#0B1320] font-bold text-xs shadow-2xl z-20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس المهد لفتح دعوة المولود 🍼' : 'Touch Cradle to Open 🍼'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
