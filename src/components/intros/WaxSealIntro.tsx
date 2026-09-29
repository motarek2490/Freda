import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const WaxSealIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'cracking' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('cracking');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3200);
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-[#121110] via-[#1F1E1B] to-[#0A0A09]">
      {/* Dark Velvet Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(185,154,101,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center text-center p-6">
        
        {/* Title / Guest Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-2"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B99A65]/15 border border-[#B99A65]/40 text-[#B99A65] text-[11px] font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دعوة ملكية بختم فريدا الخفي' : 'FRIDA Royal Wax Sealed Suite'}</span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>

          {guestNameParam && (
            <p className="text-xs text-[#E9E1D5] bg-[#171717] border border-[#B99A65]/40 px-4 py-1.5 rounded-full inline-block mt-2">
              {isRtl ? `موجهة إلى المكرم: ${guestNameParam}` : `Presented To: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Envelope & Wax Stamp Component */}
        <div className="relative w-72 h-80 flex items-center justify-center cursor-pointer" onClick={handleInteract}>
          
          {/* Main Envelope Body */}
          <motion.div
            className="absolute inset-0 bg-[#1A1916] border-2 border-[#B99A65]/60 rounded-3xl shadow-[0_0_60px_rgba(185,154,101,0.3)] flex flex-col items-center justify-between p-6 overflow-hidden"
            animate={
              phase === 'cracking'
                ? { y: 150, opacity: 0, scale: 0.9 }
                : { y: 0, opacity: 1 }
            }
            transition={{ duration: 1.5, delay: 0.8 }}
          >
            {/* Top Flap V-Shape */}
            <div className="w-full h-32 border-b border-[#B99A65]/40 bg-[#24221D] rounded-t-2xl flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B99A65_1px,transparent_1px)] [background-size:12px_12px]" />
            </div>
            
            <span className="text-[10px] text-[#B99A65] font-mono tracking-widest uppercase">
              FRIDA COUTURE INVITATIONS
            </span>
          </motion.div>

          {/* Golden Wax Seal Stamp */}
          <motion.div
            className="relative z-30 w-24 h-24 rounded-full bg-gradient-to-br from-[#E6CA94] via-[#B99A65] to-[#735A2B] border-2 border-[#FAF7F2] shadow-[0_0_35px_rgba(185,154,101,0.8)] flex items-center justify-center cursor-pointer"
            animate={
              phase === 'cracking'
                ? { scale: [1, 1.3, 0], rotate: [0, 15, -15, 45], opacity: [1, 1, 0] }
                : { scale: [1, 1.05, 1] }
            }
            transition={
              phase === 'cracking'
                ? { duration: 1.2 }
                : { repeat: Infinity, duration: 2.5 }
            }
          >
            {/* Monogram Seal Engraving */}
            <div className="w-20 h-24 rounded-full border border-[#FAF7F2]/40 flex flex-col items-center justify-center text-[#171717]">
              <Crown className="w-6 h-6 text-[#171717]" />
              <span className="font-playfair text-xs font-black tracking-widest uppercase mt-0.5">
                FRIDA
              </span>
            </div>
          </motion.div>

          {/* Tap Prompt Tag */}
          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-10 z-40 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#B99A65] text-[#171717] font-bold text-xs shadow-2xl"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'المس الختم الشمعي لكسره وفتح الدعوة 👑' : 'Tap Wax Seal to Crack & Open 👑'}</span>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};
