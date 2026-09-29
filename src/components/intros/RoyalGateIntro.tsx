import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, KeyRound } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const RoyalGateIntro: React.FC<IntroBaseProps> = ({
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
    }, 3500);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#0A0D0B] overflow-hidden">
      {/* Background Palace Illumination Beam */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(185,154,101,0.4)_0%,_transparent_75%)] pointer-events-none"
        animate={
          phase === 'opening'
            ? { opacity: [0.3, 1, 0.8], scale: [1, 1.5, 2] }
            : { opacity: 0.3 }
        }
        transition={{ duration: 2 }}
      />

      <div className="relative z-10 w-full max-w-lg h-[500px] flex flex-col items-center justify-between text-center p-6 border border-[#B99A65]/30 rounded-3xl bg-[#121814]/80 backdrop-blur-md shadow-2xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1.5 z-20"
        >
          <span className="text-[11px] font-bold text-[#B99A65] tracking-[0.25em] uppercase block">
            {isRtl ? '🏰 البوابة الملكية للقصر' : '🏰 Royal Palace Golden Gate'}
          </span>
          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#E0F2E9] bg-[#122417] border border-[#B99A65]/40 px-3.5 py-1 rounded-full inline-block">
              {isRtl ? `شرف الحضور لـ: ${guestNameParam}` : `Honored Guest: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* 3D Gate Doors Frame */}
        <div className="relative w-full h-72 flex items-center justify-center perspective-[1000px] cursor-pointer" onClick={handleInteract}>
          
          {/* Left Gate Door */}
          <motion.div
            className="w-1/2 h-full bg-[#1A261D] border-y-2 border-l-2 border-[#B99A65] rounded-l-2xl shadow-2xl flex items-center justify-end p-2 origin-left z-20 overflow-hidden"
            animate={
              phase === 'opening'
                ? { rotateY: -110, opacity: 0.2 }
                : { rotateY: 0 }
            }
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full h-full border border-[#B99A65]/40 rounded-l-xl flex items-center justify-center opacity-40">
              <div className="w-16 h-32 border border-[#B99A65] rounded-t-full" />
            </div>
          </motion.div>

          {/* Right Gate Door */}
          <motion.div
            className="w-1/2 h-full bg-[#1A261D] border-y-2 border-r-2 border-[#B99A65] rounded-r-2xl shadow-2xl flex items-center justify-start p-2 origin-right z-20 overflow-hidden"
            animate={
              phase === 'opening'
                ? { rotateY: 110, opacity: 0.2 }
                : { rotateY: 0 }
            }
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full h-full border border-[#B99A65]/40 rounded-r-xl flex items-center justify-center opacity-40">
              <div className="w-16 h-32 border border-[#B99A65] rounded-t-full" />
            </div>
          </motion.div>

          {/* Center Royal Lock & Keyhole */}
          <motion.div
            className="absolute z-30 w-16 h-16 rounded-full bg-gradient-to-br from-[#E6CA94] via-[#B99A65] to-[#735A2B] border-2 border-[#FAF7F2] shadow-[0_0_30px_rgba(185,154,101,0.8)] flex items-center justify-center"
            animate={
              phase === 'opening'
                ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                : { scale: [1, 1.05, 1] }
            }
            transition={
              phase === 'opening'
                ? { duration: 1 }
                : { repeat: Infinity, duration: 2 }
            }
          >
            <KeyRound className="w-7 h-7 text-[#121814]" />
          </motion.div>

        </div>

        {/* Prompt */}
        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="z-20 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B99A65] text-[#121814] font-bold text-xs shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس القفل لفتح البوابة الملكية 🏰' : 'Tap Lock to Open Royal Gate 🏰'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
