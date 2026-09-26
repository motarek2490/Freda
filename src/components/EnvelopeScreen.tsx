import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

interface EnvelopeScreenProps {
  title: string;
  groomName: string;
  brideName: string;
  dateStr?: string;
  onOpen: () => void;
  accentColor?: string;
}

export const EnvelopeScreen: React.FC<EnvelopeScreenProps> = ({
  title,
  groomName,
  brideName,
  dateStr,
  onOpen,
  accentColor = '#C5A880',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenClick = () => {
    if (isOpen) return;
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  const noiseSvg =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E\")";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#0d131f]/95 backdrop-blur-md select-none touch-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Envelope Container */}
        <div className="relative w-full max-w-lg mx-4 aspect-[4/3] max-h-[500px] flex items-center justify-center">
          {/* Envelope Body Base */}
          <div
            className="absolute inset-0 rounded-2xl shadow-2xl overflow-hidden border border-white/10"
            style={{
              backgroundColor: '#f5efe6',
              backgroundImage: noiseSvg,
            }}
          >
            {/* Inner Letter Peek */}
            <div className="absolute inset-4 rounded-xl bg-white shadow-inner flex flex-col items-center justify-center p-6 text-center text-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#b08968] mb-1">
                دعوة خاصة
              </span>
              <h2 className="text-xl md:text-2xl font-serif-luxury font-bold text-slate-900 mb-2">
                {title || 'حفل زفاف مبارك'}
              </h2>
              <p className="text-base md:text-lg font-serif-luxury font-semibold text-[#8c3b2c] mb-1">
                {groomName} & {brideName}
              </p>
              {dateStr && (
                <span className="text-xs text-slate-500 font-mono mt-1">
                  {dateStr}
                </span>
              )}
            </div>

            {/* Left Envelope Flap */}
            <motion.div
              className="absolute inset-0 z-10"
              style={{
                clipPath: 'polygon(0 0, 50% 50%, 0 100%)',
                background: '#ede3d5',
                backgroundImage: noiseSvg,
              }}
              animate={isOpen ? { x: '-100%', opacity: 0 } : { x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            />

            {/* Right Envelope Flap */}
            <motion.div
              className="absolute inset-0 z-10"
              style={{
                clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)',
                background: '#ede3d5',
                backgroundImage: noiseSvg,
              }}
              animate={isOpen ? { x: '100%', opacity: 0 } : { x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            />

            {/* Bottom Envelope Flap */}
            <motion.div
              className="absolute inset-0 z-20"
              style={{
                clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)',
                background: '#f4ece2',
                backgroundImage: noiseSvg,
              }}
              animate={isOpen ? { y: '100%', opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
            />

            {/* Top Envelope Flap with Wax Stamp */}
            <motion.div
              className="absolute inset-0 z-30"
              style={{
                clipPath: 'polygon(0 0, 50% 50%, 100% 0)',
                background: '#f8f2ea',
                backgroundImage: noiseSvg,
                transformOrigin: 'top center',
              }}
              animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>

          {/* Central Wax Seal Button */}
          <div className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.button
              onClick={handleOpenClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              animate={
                isOpen
                  ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
                  : { scale: [1, 1.04, 1] }
              }
              transition={
                isOpen
                  ? { duration: 0.6 }
                  : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
              }
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-[#c94b32] via-[#a8321b] to-[#7f1d0b] shadow-[0_10px_25px_rgba(168,50,27,0.6)] border-4 border-[#e5735d]/40 text-amber-100 cursor-pointer group"
              aria-label="افتح المظروف"
            >
              {/* Golden stamp emblem inside wax */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-dashed border-amber-200/50 flex flex-col items-center justify-center p-1">
                <Heart className="w-5 h-5 text-amber-100 fill-amber-100/40 mb-0.5" />
                <span className="text-[10px] md:text-[11px] font-serif-luxury font-bold tracking-wider">
                  افتح الدعوة
                </span>
              </div>
            </motion.button>
          </div>

          {/* Floating instructions hint */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-14 left-0 right-0 text-center"
          >
            <p className="text-xs md:text-sm font-medium text-amber-100/80 drop-shadow flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              اضغط على ختم الشمع لفتح المظروف وتشغيل الموسيقى
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
