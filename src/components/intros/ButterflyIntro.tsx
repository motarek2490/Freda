import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const ButterflyIntro: React.FC<IntroBaseProps> = ({
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

    // Motion timeline: 3.5s total animation then trigger complete
    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-[#1A0A10] via-[#2A101A] to-[#12050B]">
      {/* Ambient Bokeh Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7A1F35]/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#B99A65]/20 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Main Interactive Envelope Container */}
      <div className="relative z-10 w-full max-w-md aspect-[3/4] flex flex-col items-center justify-center p-6 text-center">
        
        {/* Guest Greeting Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-2"
        >
          <span className="text-[11px] font-bold text-[#B99A65] tracking-[0.25em] uppercase block">
            {isRtl ? '🦋 دعوة زفاف ملكية حصرية' : '🦋 Royal Wedding Invitation'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#E9E1D5] bg-[#7A1F35]/40 border border-[#B99A65]/40 px-4 py-1.5 rounded-full inline-block mt-2">
              {isRtl ? `خاصة بـ: ${guestNameParam}` : `Exclusively For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Interactive Butterfly Seal Frame */}
        <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer group" onClick={handleInteract}>
          
          {/* Envelope 4 Flaps */}
          <motion.div
            className="absolute inset-0 bg-[#2B121A] border-2 border-[#B99A65]/60 rounded-3xl shadow-[0_0_50px_rgba(122,31,53,0.4)] overflow-hidden"
            animate={
              phase === 'opening'
                ? { scale: [1, 1.05, 0.95], opacity: [1, 1, 0] }
                : { scale: 1 }
            }
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            {/* Debossed Pattern lines */}
            <svg className="absolute inset-0 w-full h-full opacity-25 stroke-[#B99A65]" viewBox="0 0 200 200">
              <line x1="0" y1="0" x2="200" y2="200" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="200" y1="0" x2="0" y2="200" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="60" strokeWidth="1" fill="none" />
            </svg>
          </motion.div>

          {/* Golden Butterfly Center Piece */}
          <motion.div
            className="relative z-20 flex flex-col items-center justify-center cursor-pointer"
            animate={
              phase === 'opening'
                ? { y: [-10, -180], scale: [1, 1.6, 2.2], opacity: [1, 1, 0] }
                : { y: [0, -8, 0] }
            }
            transition={
              phase === 'opening'
                ? { duration: 2.8, ease: 'easeOut' }
                : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            }
          >
            {/* SVG Golden Butterfly Wing Flap Animation */}
            <motion.svg
              viewBox="0 0 100 100"
              className="w-32 h-32 drop-shadow-[0_0_25px_rgba(185,154,101,0.8)] filter"
              animate={
                phase === 'opening'
                  ? { rotateY: [0, 60, -60, 40, -40, 0] }
                  : { rotate: [0, 2, -2, 0] }
              }
              transition={{ repeat: Infinity, duration: phase === 'opening' ? 0.3 : 2 }}
            >
              {/* Left Wing */}
              <path
                d="M50 50 C20 10, 5 30, 15 65 C25 80, 45 70, 50 50 Z"
                fill="url(#goldGrad)"
                stroke="#FAF7F2"
                strokeWidth="1.5"
              />
              {/* Right Wing */}
              <path
                d="M50 50 C80 10, 95 30, 85 65 C75 80, 55 70, 50 50 Z"
                fill="url(#goldGrad)"
                stroke="#FAF7F2"
                strokeWidth="1.5"
              />
              {/* Butterfly Body */}
              <ellipse cx="50" cy="50" rx="3" ry="18" fill="#FAF7F2" />
              <path d="M50 32 Q45 20 40 15 M50 32 Q55 20 60 15" stroke="#FAF7F2" strokeWidth="1.5" fill="none" />

              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FAF7F2" />
                  <stop offset="50%" stopColor="#B99A65" />
                  <stop offset="100%" stopColor="#7A1F35" />
                </linearGradient>
              </defs>
            </motion.svg>

            {phase === 'idle' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
                className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#171717]/90 border border-[#B99A65] text-[#FAF7F2] text-xs font-bold shadow-xl"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B99A65]" />
                <span>{isRtl ? 'المس الفراشة لفتح الدعوة 🦋' : 'Touch Butterfly to Unveil 🦋'}</span>
              </motion.div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
};
