import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gem, Waves } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const ShellPearlIntro: React.FC<IntroBaseProps> = ({
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
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#05111B] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Ocean Ripple Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2)_0%,_transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#0A1E2B]/80 border border-[#38BDF8]/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-[11px] font-bold">
            <Waves className="w-3.5 h-3.5" />
            <span>{isRtl ? '🐚 لؤلؤة البحر المحيطية' : '🐚 Ocean Pearl Suite'}</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>

          {guestNameParam && (
            <p className="text-xs text-[#E0F2FE] bg-[#05111B] border border-[#38BDF8]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف الكريم: ${guestNameParam}` : `Specially For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Sea Shell Container */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Top Shell Half */}
          <motion.div
            className="absolute top-4 w-48 h-28 bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#0A1E2B] rounded-t-full border-2 border-[#E0F2FE] shadow-[0_0_40px_rgba(56,189,248,0.5)] z-20 origin-bottom"
            animate={
              phase === 'opening'
                ? { rotateX: -110, y: -100, opacity: 0 }
                : { rotateX: 0 }
            }
            transition={{ duration: 1.8 }}
          />

          {/* Glowing Pearl Core */}
          <motion.div
            className="relative z-30 w-24 h-24 rounded-full bg-gradient-to-tr from-[#FAF7F2] via-[#E0F2FE] to-[#38BDF8] border-2 border-[#FFFFFF] shadow-[0_0_60px_rgba(255,255,255,1)] flex items-center justify-center"
            animate={
              phase === 'opening'
                ? { scale: [1, 2, 0], opacity: [1, 1, 0] }
                : { scale: [1, 1.08, 1] }
            }
            transition={
              phase === 'opening'
                ? { duration: 1.5 }
                : { repeat: Infinity, duration: 2 }
            }
          >
            <Gem className="w-10 h-10 text-[#05111B]" />
          </motion.div>

          {/* Bottom Shell Half */}
          <div className="absolute bottom-4 w-48 h-28 bg-gradient-to-t from-[#0284C7] via-[#0A1E2B] to-[#05111B] rounded-b-full border-2 border-[#38BDF8]/60 z-10" />

        </div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#38BDF8] text-[#05111B] font-bold text-xs shadow-2xl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس الصدفة لاستخراج اللؤلؤة وفتح الدعوة 🐚' : 'Touch Shell to Reveal Pearl 🐚'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
