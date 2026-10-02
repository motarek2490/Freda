import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { IntroBaseProps } from './IntroRouter';

export const RomanticHeartIntro: React.FC<IntroBaseProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'unsealing' | 'opened'>('idle');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const groom = invitation.eventDetails.groomName || (isRtl ? 'يُوسـف الشـريف' : 'Youssef');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'مَريـم غـانم' : 'Maryam');
  const hostNames = invitation.eventDetails.hostNames || (isRtl ? 'عائلتي الشريف وغانم' : 'The Host Families');

  // Ambient gold dust & floating romantic embers canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || shouldReduceMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const count = window.innerWidth < 768 ? 24 : 45;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft center warm gold radiance
      const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) * 0.6);
      grad.addColorStop(0, 'rgba(201, 164, 106, 0.12)');
      grad.addColorStop(0.5, 'rgba(17, 16, 15, 0.6)');
      grad.addColorStop(1, 'rgba(10, 9, 8, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulse += 0.03;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const alpha = Math.max(0.1, p.opacity + Math.sin(p.pulse) * 0.2);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [shouldReduceMotion]);

  const handleOpen = () => {
    if (phase !== 'idle') return;

    if (shouldReduceMotion) {
      onComplete();
      return;
    }

    setPhase('unsealing');

    setTimeout(() => {
      setPhase('opened');
      onComplete();
    }, 1200);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full h-full min-h-screen flex items-center justify-center p-4 bg-[#0B0A09] text-[#F7F1E8] overflow-hidden select-none"
    >
      {/* Background Living Ambient Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Radial Vignette Shadow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,7,6,0.85)_100%)] z-0" />

      {/* Main Glassmorphic Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{
          opacity: phase === 'unsealing' ? [1, 1, 0] : 1,
          scale: phase === 'unsealing' ? [1, 1.05, 1.1] : 1,
          y: phase === 'unsealing' ? [0, -10, -20] : 0,
        }}
        transition={{
          duration: phase === 'unsealing' ? 1.2 : 0.8,
          ease: 'easeOut',
        }}
        className="relative z-10 w-full max-w-lg mx-auto p-7 sm:p-10 rounded-3xl border border-[#C9A46A]/40 bg-[#141210]/85 backdrop-blur-xl shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(201,164,106,0.15)] flex flex-col items-center text-center space-y-6 overflow-hidden"
      >
        {/* Subtle Decorative Golden Border Beading */}
        <div className="absolute inset-1.5 rounded-[22px] border border-[#C9A46A]/20 pointer-events-none" />

        {/* Ornate Corner Arabesques */}
        <div className="absolute top-3 left-3 w-8 h-8 pointer-events-none text-[#C9A46A]/60">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
          </svg>
        </div>
        <div className="absolute top-3 right-3 w-8 h-8 pointer-events-none text-[#C9A46A]/60 scale-x-[-1]">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
          </svg>
        </div>
        <div className="absolute bottom-3 left-3 w-8 h-8 pointer-events-none text-[#C9A46A]/60 scale-y-[-1]">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
          </svg>
        </div>
        <div className="absolute bottom-3 right-3 w-8 h-8 pointer-events-none text-[#C9A46A]/60 scale-[-1]">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
          </svg>
        </div>

        {/* Header: Basmalah & Royal Proclamation */}
        <div className="space-y-2 pt-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[12px] sm:text-xs font-serif tracking-[0.25em] text-[#C9A46A] uppercase font-bold"
          >
            {isRtl ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'IN THE NAME OF ALLAH'}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.35 }}
            className="text-[11px] sm:text-xs font-serif text-[#D6CAB7] max-w-sm mx-auto leading-relaxed italic"
          >
            {isRtl
              ? '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا»'
              : '“And of His signs is that He created for you mates that you may find tranquility in them”'}
          </motion.p>
        </div>

        {/* Divider with Center Gold Gem */}
        <div className="flex items-center justify-center gap-3 w-3/4 opacity-60">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A46A] to-transparent" />
          <span className="text-[10px] text-[#C9A46A]">✦</span>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A46A] to-transparent" />
        </div>

        {/* Royal Names of Groom & Bride */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-1.5 py-1"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#C9A46A]/80 font-mono font-medium block">
            {isRtl ? 'دعوة زفاف ملكية فاخرة' : 'Royal Wedding Invitation'}
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F7F1E8] tracking-wide leading-tight drop-shadow-[0_2px_15px_rgba(201,164,106,0.3)]">
            <span className="text-[#F7F1E8]">{groom}</span>
            <span className="text-[#C9A46A] px-2.5 font-light">&</span>
            <span className="text-[#F7F1E8]">{bride}</span>
          </h1>
          {hostNames && (
            <p className="text-[11px] sm:text-xs text-[#D6CAB7]/75 font-light pt-0.5">
              {isRtl ? `تتشرف ${hostNames} بدعوتكم لحضور حفل الزفاف` : `Cordially invited by ${hostNames}`}
            </p>
          )}
        </motion.div>

        {/* VIP Guest Badge (if personalized) */}
        {guestNameParam && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1E1B17] via-[#2A241C] to-[#1E1B17] border border-[#C9A46A]/60 shadow-[0_0_20px_rgba(201,164,106,0.2)] text-[11px] text-[#F7F1E8] font-medium"
          >
            <span className="text-[#C9A46A] font-bold me-1.5">👑</span>
            <span>{isRtl ? `شرف الحضور لـ: ${guestNameParam}` : `Honored Guest: ${guestNameParam}`}</span>
          </motion.div>
        )}

        {/* The Centerpiece: Royal Wax Seal with Glowing Living Golden Heart */}
        <div className="relative py-3 flex flex-col items-center justify-center">
          {/* Animated Radiating Pulse Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.45, 1.8],
                opacity: [0.6, 0.25, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                ease: 'easeOut',
              }}
              className="w-24 h-24 rounded-full border border-[#C9A46A]/50"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1.6],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.8,
                delay: 0.7,
                ease: 'easeOut',
              }}
              className="w-20 h-20 rounded-full border border-[#C9A46A]/40"
            />
          </div>

          {/* Interactive Seal Button */}
          <motion.button
            type="button"
            onClick={handleOpen}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="relative z-20 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#C9A46A]"
            aria-label={isRtl ? 'المس الختم لفتح الدعوة الملكية' : 'Touch to Unseal The Royal Invitation'}
          >
            {/* Seal Golden Rim & Wax Gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8C1D24] via-[#5C1117] to-[#2B080B] border-2 border-[#C9A46A] shadow-[0_0_35px_rgba(201,164,106,0.45),inset_0_2px_10px_rgba(255,255,255,0.25)] flex items-center justify-center transition-shadow group-hover:shadow-[0_0_45px_rgba(201,164,106,0.7)]" />

            {/* Inner Intricate Gold Border */}
            <div className="absolute inset-1.5 rounded-full border border-[#C9A46A]/60 flex items-center justify-center pointer-events-none" />

            {/* Glowing Golden Living Heart */}
            <div className="relative z-10 flex flex-col items-center justify-center text-[#F7F1E8]">
              <motion.div
                animate={{
                  scale: phase === 'unsealing' ? [1, 1.5, 0] : [1, 1.12, 1],
                  rotate: phase === 'unsealing' ? [0, 15, -15] : 0,
                }}
                transition={{
                  repeat: phase === 'unsealing' ? 0 : Infinity,
                  duration: phase === 'unsealing' ? 0.8 : 1.8,
                  ease: 'easeInOut',
                }}
              >
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#C9A46A] fill-[#C9A46A] drop-shadow-[0_0_12px_rgba(201,164,106,0.9)]" />
              </motion.div>
            </div>

            {/* Sparkle Tag */}
            <span className="absolute -top-1 -right-1 text-xs select-none pointer-events-none animate-pulse">
              ✨
            </span>
          </motion.button>
        </div>

        {/* Action Prompt */}
        <motion.div
          onClick={handleOpen}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="cursor-pointer group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C9A46A] via-[#E6D7B8] to-[#C9A46A] text-[#11100F] font-bold text-xs shadow-[0_0_25px_rgba(201,164,106,0.4)] hover:brightness-110 transition-transform active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          <span>{isRtl ? 'المس لفتح الدعوة الملكية ✨' : 'Touch to Open Royal Invitation ✨'}</span>
        </motion.div>

        {/* Footer Note */}
        <p className="text-[10px] sm:text-[11px] text-[#A89C8B]/70 font-mono tracking-wider">
          {isRtl ? '«لوحة الحب الحية» — تجربة سينمائية خاصة' : 'Living Romantic Canvas — Cinematic Experience'}
        </p>
      </motion.div>
    </div>
  );
};
