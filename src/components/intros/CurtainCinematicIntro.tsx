import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, KeyRound, Crown } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const CurtainCinematicIntro: React.FC<IntroBaseProps> = ({
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
    <div
      className="fixed inset-0 z-50 w-full h-full flex items-center justify-center p-0 bg-[#0F080A] overflow-hidden select-none cursor-pointer perspective-[1200px]"
      onClick={handleInteract}
    >
      {/* Background Warm Stardust Light Beam */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(230,161,92,0.45)_0%,_transparent_75%)] pointer-events-none"
        animate={
          phase === 'opening'
            ? { opacity: [0.3, 1, 0.9], scale: [1, 1.8] }
            : { opacity: 0.35 }
        }
        transition={{ duration: 2.2 }}
      />

      {/* =========================================================================
          FULL-SCREEN RED ENVELOPE (4 TRIANGLES UNTIMING IN 4 DIRECTIONS)
         ========================================================================= */}

      {/* 1. TOP TRIANGLE FLAP */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#80091B] via-[#610513] to-[#40020A] border-b-2 border-[#E6A15C] z-30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] origin-top overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
        animate={
          phase === 'opening'
            ? { rotateX: -110, y: '-100%', opacity: 0 }
            : { rotateX: 0 }
        }
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E6A15C_1px,transparent_1px)] [background-size:16px_16px]" />
      </motion.div>

      {/* 2. BOTTOM TRIANGLE FLAP */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#80091B] via-[#610513] to-[#40020A] border-t-2 border-[#E6A15C] z-30 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] origin-bottom overflow-hidden"
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 0)' }}
        animate={
          phase === 'opening'
            ? { rotateX: 110, y: '100%', opacity: 0 }
            : { rotateX: 0 }
        }
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E6A15C_1px,transparent_1px)] [background-size:16px_16px]" />
      </motion.div>

      {/* 3. LEFT TRIANGLE FLAP */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#610513] via-[#48030D] to-[#2B0106] border-r-2 border-[#E6A15C]/80 z-20 shadow-[15px_0_40px_rgba(0,0,0,0.8)] origin-left overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
        animate={
          phase === 'opening'
            ? { rotateY: -110, x: '-100%', opacity: 0 }
            : { rotateY: 0 }
        }
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* 4. RIGHT TRIANGLE FLAP */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#610513] via-[#48030D] to-[#2B0106] border-l-2 border-[#E6A15C]/80 z-20 shadow-[-15px_0_40px_rgba(0,0,0,0.8)] origin-right overflow-hidden"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 50%)' }}
        animate={
          phase === 'opening'
            ? { rotateY: 110, x: '100%', opacity: 0 }
            : { rotateY: 0 }
        }
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* =========================================================================
          CENTER CONTENT: COUPLE NAMES & SMALL HEART LOCK SEAL
         ========================================================================= */}
      <div className="relative z-40 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6 pointer-events-auto">
        
        {/* Title Header Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-3 bg-[#1C0D11]/90 border border-[#E6A15C]/60 px-6 py-5 rounded-3xl backdrop-blur-md shadow-[0_15px_50px_rgba(0,0,0,0.9)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E6A15C] to-transparent" />

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E6A15C]/15 border border-[#E6A15C]/40 text-[#E6A15C] text-[11px] font-bold">
            <Crown className="w-3.5 h-3.5" />
            <span>{isRtl ? '💌 الظرف الأحمر الملكي بختم القلب' : '💌 Royal Red Envelope Suite'}</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-4xl font-bold text-[#F7F4EE] tracking-wide leading-tight">
            {groom} & {bride}
          </h2>

          {guestNameParam && (
            <p className="text-xs text-[#E6A15C] bg-[#0F080A] border border-[#E6A15C]/30 px-4 py-1.5 rounded-full inline-block font-medium">
              {isRtl ? `خاصة بالضيف المكرم: ${guestNameParam}` : `Specially Reserved For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Small Golden Heart-Shaped Lock in Center */}
        <motion.div
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FAF7F2] via-[#E6A15C] to-[#735A2B] p-0.5 shadow-[0_0_50px_rgba(230,161,92,1)] flex items-center justify-center cursor-pointer border-2 border-[#FAF7F2] z-50"
          animate={
            phase === 'opening'
              ? { scale: [1, 1.6, 0], rotate: [0, 20, -20, 45], opacity: [1, 1, 0] }
              : { scale: [1, 1.08, 1] }
          }
          transition={
            phase === 'opening'
              ? { duration: 1.2 }
              : { repeat: Infinity, duration: 2, ease: 'easeInOut' }
          }
        >
          <div className="w-full h-full rounded-full bg-[#610513] flex items-center justify-center text-[#E6A15C] border border-[#E6A15C]/50 hover:bg-[#E6A15C] hover:text-[#610513] transition-colors">
            <Heart className="w-8 h-8 fill-current text-[#E6A15C]" />
          </div>
        </motion.div>

        {/* Interaction Prompt Tag */}
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.75, 1, 0.75], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E6A15C] text-[#610513] font-bold text-xs shadow-[0_10px_30px_rgba(230,161,92,0.5)] z-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'المس قفل القلب لفتح الظرف الأحمر إلى ٤ مثلثات 💌✨' : 'Touch Heart Lock to Unfold Red Envelope 💌✨'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
