import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarHeart, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../data/translations';

interface SplashScreenProps {
  currentLang: Language;
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ currentLang, onFinish }) => {
  const t = useTranslation(currentLang);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 800); // Allow fade-out animation to complete
    }, 2400);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F0F0F] text-[#F7F4EE] px-4 overflow-hidden selection:bg-[#B99A65]"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] bg-[#B99A65]/10 blur-[140px] rounded-full pointer-events-none" />

          {/* Golden Crest Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#B99A65] via-[#E9E1D5] to-[#B99A65] p-[2px] shadow-[0_0_50px_rgba(185,154,101,0.5)] mb-8 overflow-hidden"
          >
            <img src="/logo.jpg" alt="FRIDA Logo" className="w-full h-full rounded-full object-cover" />
          </motion.div>

          {/* Large Brand Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center space-y-3"
          >
            <h1 className="font-playfair text-4xl sm:text-6xl font-extrabold tracking-[0.2em] text-[#F7F4EE] uppercase">
              {currentLang === 'ar' ? 'فريدا' : 'FRIDA'}
            </h1>

            <div className="flex items-center justify-center gap-2 text-xs tracking-[0.3em] text-[#B99A65] uppercase font-sans-body font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.brand.tagline}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </motion.div>

          {/* Minimal Luxury Progress Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 180 }}
            transition={{ duration: 1.8, delay: 0.4, ease: 'easeInOut' }}
            className="h-[2px] bg-gradient-to-r from-[#171717] via-[#B99A65] to-[#171717] mt-12 rounded-full"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.8 }}
            className="text-[10px] tracking-widest text-[#8D8A84] uppercase mt-4"
          >
            {currentLang === 'ar' ? 'منصة الدعوات الرقمية الفاخرة' : 'Premium Invitation Studio'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
