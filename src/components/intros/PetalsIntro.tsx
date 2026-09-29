import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flower2 } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const PetalsIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'blooming' | 'revealed'>('idle');

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  const handleInteract = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('blooming');

    setTimeout(() => {
      setPhase('revealed');
      onComplete();
    }, 3400);
  };

  // Generate 12 3D floral petals for scattering sequence
  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12,
    delay: (i % 3) * 0.15,
  }));

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-[#1F0A12] via-[#2A101C] to-[#14050C] overflow-hidden">
      {/* Ambient Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center text-center p-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-2"
        >
          <span className="text-[11px] font-bold text-[#F472B6] tracking-[0.25em] uppercase block">
            {isRtl ? '🌸 زهرة العمر وتفتق البتلات' : '🌸 Blooming Petals Suite'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {groom} & {bride}
          </h2>
          {guestNameParam && (
            <p className="text-xs text-[#F472B6] bg-[#2A101C] border border-[#F472B6]/40 px-4 py-1.5 rounded-full inline-block mt-2">
              {isRtl ? `خاصة بالضيف الكريم: ${guestNameParam}` : `Specially For: ${guestNameParam}`}
            </p>
          )}
        </motion.div>

        {/* Blooming Blossom Core */}
        <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer" onClick={handleInteract}>
          
          {/* Petals Ring */}
          {petals.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-16 h-28 rounded-full bg-gradient-to-t from-[#80091B] via-[#F472B6] to-[#FAF7F2] opacity-85 shadow-lg border border-[#FAF7F2]/40 origin-bottom"
              style={{
                transform: `rotate(${p.angle}deg) translateY(-20px)`,
              }}
              animate={
                phase === 'blooming'
                  ? {
                      scale: [1, 1.4, 2],
                      opacity: [0.85, 1, 0],
                      x: [0, Math.cos((p.angle * Math.PI) / 180) * 300],
                      y: [0, Math.sin((p.angle * Math.PI) / 180) * 300],
                      rotate: [p.angle, p.angle + 180],
                    }
                  : { scale: [1, 1.05, 1] }
              }
              transition={
                phase === 'blooming'
                  ? { duration: 2.2, delay: p.delay, ease: 'easeOut' }
                  : { repeat: Infinity, duration: 3, delay: p.delay }
              }
            />
          ))}

          {/* Center Flower Stamen */}
          <motion.div
            className="relative z-20 w-20 h-20 rounded-full bg-gradient-to-br from-[#F472B6] via-[#B99A65] to-[#FAF7F2] border-2 border-[#FAF7F2] shadow-[0_0_40px_rgba(244,114,182,0.9)] flex items-center justify-center"
            animate={
              phase === 'blooming'
                ? { scale: [1, 1.8, 0], opacity: [1, 1, 0] }
                : { scale: [1, 1.1, 1] }
            }
            transition={
              phase === 'blooming'
                ? { duration: 1.5 }
                : { repeat: Infinity, duration: 2 }
            }
          >
            <Flower2 className="w-9 h-9 text-[#1F0A12]" />
          </motion.div>

          {phase === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0.7, 1, 0.7], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -bottom-10 z-30 flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F472B6] text-[#1F0A12] font-bold text-xs shadow-2xl"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إلمس الزهرة لتفتق البتلات وظهور الدعوة 🌸' : 'Touch Flower to Bloom Petals 🌸'}</span>
            </motion.div>
          )}

        </div>

      </div>
    </div>
  );
};
