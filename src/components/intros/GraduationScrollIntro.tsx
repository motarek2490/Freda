import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Award } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const GraduationScrollIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealed'>('idle');

  const title = invitation.eventDetails.eventTitle || invitation.title || (isRtl ? 'حفل التخرج والتفوق' : 'Graduation Gala');

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
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-[#080B1A] overflow-hidden cursor-pointer" onClick={handleInteract}>
      {/* Gold Academic Spotlight */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,179,8,0.25)_0%,_transparent_75%)] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center p-6 space-y-6">
        
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 bg-[#101733]/90 border border-[#EAB308]/40 p-6 rounded-3xl backdrop-blur-md shadow-2xl"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAB308]/20 text-[#EAB308] text-[11px] font-bold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isRtl ? '🎓 وثيقة وقبعة التخرج الذهبية' : '🎓 Graduation Diploma Suite'}</span>
          </div>

          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {title}
          </h2>

          {guestNameParam && (
            <p className="text-xs text-[#FEF08A] bg-[#080B1A] border border-[#EAB308]/40 px-3.5 py-1.5 rounded-full inline-block">
              {isRtl ? `خاصة بالضيف: ${guestNameParam}` : `Specially Reserved For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Graduation Cap Center */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FEF08A] via-[#EAB308] to-[#CA8A04] border-2 border-[#FAF7F2] shadow-[0_0_50px_rgba(234,179,8,0.9)] flex items-center justify-center cursor-pointer z-20"
          animate={
            phase === 'opening'
              ? { y: -200, rotate: 360, scale: 1.5, opacity: 0 }
              : { y: [0, -6, 0] }
          }
          transition={
            phase === 'opening'
              ? { duration: 1.5 }
              : { repeat: Infinity, duration: 2.5 }
          }
        >
          <GraduationCap className="w-12 h-12 text-[#080B1A]" />
        </motion.div>

        {phase === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EAB308] text-[#080B1A] font-bold text-xs shadow-2xl z-20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المس القبعة لفك وثيقة التخرج والدعوة 🎓' : 'Touch Cap to Unroll Diploma 🎓'}</span>
          </motion.div>
        )}

      </div>
    </div>
  );
};
