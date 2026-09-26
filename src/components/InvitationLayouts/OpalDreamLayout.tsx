import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  ExternalLink,
  Maximize2,
  Send,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const OpalDreamLayout: React.FC<TemplateLayoutProps> = ({
  invitation,
  isRtl,
  t,
  customColors,
  timeLeft,
  wishes,
  onOpenRsvp,
  onOpenBank,
  onAddWish,
  newWishAuthor,
  setNewWishAuthor,
  newWishRelation,
  setNewWishRelation,
  newWishMessage,
  setNewWishMessage,
  wishSuccess,
  setActiveLightboxImg,
  getGoogleCalendarUrl,
}) => {
  const details = invitation.eventDetails;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Iridescence mouse tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 35;

    interface PearlParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      oscillationSpeed: number;
      oscillationRange: number;
      hue: number;
      opacity: number;
      scaleSpeed: number;
      pulseAngle: number;
    }

    const particles: PearlParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 4, // magical soft pearlescent spheres
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI,
        oscillationSpeed: Math.random() * 0.008 + 0.003,
        oscillationRange: Math.random() * 15 + 5,
        hue: Math.random() * 60 + 260, // Pearl hues (pinks, purples, blues)
        opacity: Math.random() * 0.3 + 0.15,
        scaleSpeed: Math.random() * 0.02 + 0.005,
        pulseAngle: Math.random() * Math.PI,
      });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          const wasZero = width === 0 || height === 0;
          width = canvas.width = newWidth;
          height = canvas.height = newHeight;
          if (wasZero) {
            particles.forEach((p) => {
              p.x = Math.random() * newWidth;
              p.y = Math.random() * newHeight;
            });
          }
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Draw subtle pastel iridescent background glow sweeps
      const gradient = ctx.createRadialGradient(
        width / 2 + mouse.x * 50,
        height * 0.4 + mouse.y * 30,
        50,
        width / 2,
        height * 0.4,
        isMobile ? 220 : 450
      );
      gradient.addColorStop(0, 'rgba(219, 234, 254, 0.15)'); // soft pearlescent blue
      gradient.addColorStop(0.5, 'rgba(251, 207, 232, 0.08)'); // pastel pink
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render bubbles/pearls
      particles.forEach((p) => {
        p.angle += p.oscillationSpeed;
        p.pulseAngle += p.scaleSpeed;

        const xDrift = Math.sin(p.angle) * p.oscillationRange * 0.1;
        p.x += xDrift + mouse.x * 2;
        p.y -= p.speed;

        // Pulse scale
        const currentSize = p.size + Math.sin(p.pulseAngle) * 2;

        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }

        // Draw iridescent pearl/bubble
        ctx.save();
        ctx.translate(p.x, p.y);

        // Radial shine on each bubble
        const pGrad = ctx.createRadialGradient(
          -currentSize * 0.3,
          -currentSize * 0.3,
          currentSize * 0.1,
          0,
          0,
          currentSize
        );
        pGrad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity + 0.25})`);
        pGrad.addColorStop(0.3, `hsla(${p.hue}, 90%, 85%, ${p.opacity})`);
        pGrad.addColorStop(0.7, `hsla(${(p.hue + 40) % 360}, 90%, 80%, ${p.opacity * 0.5})`);
        pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = pGrad;
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.3})`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.arc(0, 0, Math.max(1, currentSize), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.targetX = x / rect.width - 0.5;
    mouseRef.current.targetY = y / rect.height - 0.5;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="space-y-16 py-8 relative"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 1. HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden border border-white/10 z-10 shadow-[0_8px_32px_rgba(255,255,255,0.02)]"
        style={{
          backgroundColor: customColors.cardBg,
          background: `linear-gradient(135deg, ${customColors.cardBg} 0%, rgba(25, 20, 45, 0.9) 100%)`,
        }}
      >
        {/* Iridescent Geometrical Opal Gemstone SVG Structure */}
        <div className="w-44 h-44 mx-auto relative mb-6 select-none opacity-90">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse-slow">
            <defs>
              <linearGradient id="opalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fbcfe8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Luminous ray lines */}
            <line x1="50" y1="5" x2="50" y2="95" stroke="url(#opalGrad)" strokeWidth="0.2" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="url(#opalGrad)" strokeWidth="0.2" />
            <line x1="15" y1="15" x2="85" y2="85" stroke="url(#opalGrad)" strokeWidth="0.2" />
            <line x1="15" y1="85" x2="85" y2="15" stroke="url(#opalGrad)" strokeWidth="0.2" />

            {/* Inner gem segments */}
            <polygon points="50,15 78,35 78,65 50,85 22,65 22,35" fill="none" stroke="url(#opalGrad)" strokeWidth="0.6" />
            <polygon points="50,25 68,40 68,60 50,75 32,60 32,40" fill="none" stroke="url(#opalGrad)" strokeWidth="0.4" />
            <polygon points="50,15 50,85" fill="none" stroke="url(#opalGrad)" strokeWidth="0.3" />
            <polygon points="22,35 78,65" fill="none" stroke="url(#opalGrad)" strokeWidth="0.3" />
            <polygon points="22,65 78,35" fill="none" stroke="url(#opalGrad)" strokeWidth="0.3" />

            {/* Center Luminous Opal Sphere */}
            <circle cx="50" cy="50" r="13" fill="url(#opalGrad)" className="opacity-70 blur-[1px]" />
            <circle cx="50" cy="50" r="6" fill="#FFF" className="opacity-60 blur-[3px]" />
            <circle cx="46" cy="46" r="2.5" fill="#FFF" className="opacity-90" />
          </svg>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <span
            className="text-[11px] font-bold tracking-[0.3em] uppercase block font-mono"
            style={{ color: customColors.accent }}
          >
            {isRtl ? 'بــسـم الله الــرحــمـن الــرحــيـم' : 'A MAGICAL OPALESCENT DREAM'}
          </span>

          <h1 className="font-playfair text-4xl sm:text-6xl font-light text-[#F7F4EE] leading-tight text-wrap-balance">
            {details.eventTitle}
          </h1>

          <div className="w-16 h-[1px] mx-auto opacity-35" style={{ backgroundColor: customColors.accent }} />

          {(details.groomName || details.brideName) && (
            <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-3xl font-serif">
              <span className="text-[#F7F4EE] font-extrabold">{details.groomName}</span>
              <span className="text-sm italic opacity-55 font-mono">{isRtl ? 'و' : 'AND'}</span>
              <span className="text-[#F7F4EE] font-extrabold">{details.brideName}</span>
            </div>
          )}

          <p className="text-xs text-[#8D8A84] max-w-md mx-auto leading-relaxed font-light">
            {details.customMessage || details.mainMessage}
          </p>
        </div>
      </motion.div>

      {/* 2. COUNTDOWN TIMER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 border border-white/5 text-center z-10"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <h4 className="text-xs uppercase tracking-widest mb-6 font-mono" style={{ color: customColors.accent }}>
          {isRtl ? 'ميقات الالتقاء والوصول' : 'Time Til Our Opalescent Dream Celebration'}
        </h4>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          {[
            { value: timeLeft.days, label: isRtl ? 'أيام' : 'Days' },
            { value: timeLeft.hours, label: isRtl ? 'ساعات' : 'Hours' },
            { value: timeLeft.minutes, label: isRtl ? 'دقائق' : 'Mins' },
            { value: timeLeft.seconds, label: isRtl ? 'ثواني' : 'Secs' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <span className="text-xl sm:text-3xl font-bold text-[#F7F4EE] tabular-nums">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8D8A84] uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. EVENT DETAILS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 sm:p-12 border border-white/5 z-10 grid grid-cols-1 md:grid-cols-2 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <Calendar className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider font-mono">
                {isRtl ? 'اليوم والتاريخ' : 'Day & Date'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.eventDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <Clock className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider font-mono">
                {isRtl ? 'ساعة البدء' : 'Beginning Hour'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.eventTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-white/5"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <MapPin className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider font-mono">
                {isRtl ? 'قاعة وصالة الحفل' : 'Venue & Hall'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.venueName}</p>
              <p className="text-xs text-[#8D8A84]">{details.venueAddress || details.address}</p>
            </div>
          </div>

          {getGoogleCalendarUrl && (
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
              style={{
                borderColor: `${customColors.accent}30`,
                backgroundColor: `${customColors.accent}0a`,
                color: customColors.accent,
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إدراج في الأجندة 📅' : 'Add to Opal Calendar 📅'}</span>
            </a>
          )}
        </div>

        {/* Maps */}
        <div className="rounded-2xl overflow-hidden border border-white/5 h-60 md:h-full relative group">
          {details.venueMapUrl || details.googleMapsUrl ? (
            <iframe
              title="Event Venue Map"
              src={details.venueMapUrl || details.googleMapsUrl}
              className="w-full h-full border-0 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-700"
              allowFullScreen={false}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#171520] space-y-2">
              <MapPin className="w-8 h-8 text-[#8D8A84]" />
              <span className="text-xs text-[#8D8A84]">{isRtl ? 'موقع القاعة' : 'Hall Map Not Configured'}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. SCHEDULE SECTION */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-white/5 z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'مرافق ووقائع الحفل' : 'Opal Event Timeline'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'تفاصيل تنظيم فقرات الاحتفال' : 'Timeline of celebrations in our magical pearlescent night'}
            </p>
          </div>

          <div className="space-y-6 relative border-l border-white/5 md:border-l-0 md:border-t border-white/5 pl-6 md:pl-0 pt-0 md:pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {details.scheduleTimeline.map((item: { time: string; title: string; description?: string }, idx: number) => (
              <div key={idx} className="relative space-y-1">
                <div
                  className="absolute -left-[31px] md:left-1/2 md:-translate-x-1/2 -top-[2px] md:-top-[39px] w-3 h-3 rounded-full border border-[#222] z-20"
                  style={{ backgroundColor: customColors.accent, borderColor: customColors.cardBg }}
                />
                <span className="text-xs font-mono font-bold block" style={{ color: customColors.accent }}>
                  {item.time}
                </span>
                <h5 className="font-bold text-sm text-[#F7F4EE] font-serif">{item.title}</h5>
                <p className="text-xs text-[#8D8A84] leading-relaxed font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. GALLERY SECTION */}
      {details.enableGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-white/5 z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'معرض الصور الحالم' : 'Iridescent Gallery'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'لقطات ساحرة ومباركة' : 'Glimpses of love captured forever'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {details.galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxImg(img)}
                className="aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer relative group"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-[#F7F4EE]" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 6. WISHES / GUESTBOOK */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 border border-white/5 z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'سجل تمنيات الضيوف والمهنئين' : 'Opal Guestbook'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl ? 'دون مباركتك وتهنئتك الطيبة لتبقى مسجلة في سجل العمر الكوني للثنائي' : 'Share your kind congratulations to stay recorded in our hearts forever'}
            </p>
          </div>

          <form onSubmit={onAddWish} className="space-y-3">
            <input
              type="text"
              required
              placeholder={isRtl ? 'الاسم واللقب' : 'Your Lovely Name'}
              value={newWishAuthor}
              onChange={(e) => setNewWishAuthor(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/5 bg-[#171520]/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <input
              type="text"
              placeholder={isRtl ? 'القرابة أو الصلة' : 'Relationship'}
              value={newWishRelation}
              onChange={(e) => setNewWishRelation(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/5 bg-[#171520]/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <textarea
              required
              rows={3}
              placeholder={isRtl ? 'التهنئة والدعاء الطيب للعروسين...' : 'Write your kind blessings...'}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-white/5 bg-[#171520]/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-[#121212] font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              style={{ backgroundColor: customColors.accent }}
            >
              <Send className="w-4 h-4 text-[#121212]" />
              <span>{isRtl ? 'تدوين المباركة الطيبة ✨' : 'Post Warm Blessing ✨'}</span>
            </button>

            {wishSuccess && (
              <p className="text-emerald-400 text-xs text-center font-semibold">
                {isRtl ? 'تم تسجيل تهنئتكم في القلوب! ✨' : 'Your warm wish is registered successfully! ✨'}
              </p>
            )}
          </form>
        </div>

        {/* Right Scrollable wishes */}
        <div className="lg:col-span-7 space-y-3 max-h-96 overflow-y-auto pr-1">
          {wishes && wishes.length > 0 ? (
            wishes.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl border border-white/5 space-y-2 relative animate-fade-in"
                style={{ backgroundColor: `${customColors.bg}50` }}
              >
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#F7F4EE] font-serif">{w.authorName}</strong>
                  {w.relationship && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/5 text-[#8D8A84]">
                      {w.relationship}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8D8A84] leading-relaxed font-light">{w.message}</p>
                <span className="text-[9px] font-mono text-[#8D8A84]/40 block text-right">
                  {w.createdAt?.split('T')[0]}
                </span>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-[#8D8A84] text-xs font-light">
              {isRtl ? 'لا توجد رسائل تهنئة بعد.' : 'No blessings registered yet.'}
            </div>
          )}
        </div>
      </motion.div>

      {/* 7. RSVP ACTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 sm:p-12 border border-white/5 text-center z-10 space-y-6"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="w-12 h-12 rounded-full border border-white/5 mx-auto flex items-center justify-center">
          <Heart className="w-5 h-5" style={{ color: customColors.accent }} />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تأكيد الحضور والمدعوين' : 'Confirm Attendee Plans'}
          </h3>
          <p className="text-xs text-[#8D8A84] leading-relaxed font-light">
            {isRtl
              ? 'تكتمل فرحتنا الكبرى بوجودكم الغالي. يرجى إرسال تأكيد رغبة الحضور لتسهيل التنظيم والتنسيق.'
              : 'Our celebration is complete with your presence. Please let us know your attendance status.'}
          </p>
        </div>

        <button
          onClick={onOpenRsvp}
          className="px-8 py-3.5 rounded-xl text-[#121212] font-extrabold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
          style={{ backgroundColor: customColors.accent }}
        >
          {isRtl ? 'تأكيد الحضور وتأكيد البيانات 💌' : 'Confirm Attendance Details 💌'}
        </button>
      </motion.div>

      {/* 8. GIFT REGISTRY */}
      {details.enableGiftRegistry && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-white/5 text-center z-10 space-y-4"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="w-10 h-10 rounded-full border border-white/5 mx-auto flex items-center justify-center">
            <Gift className="w-4 h-4" style={{ color: customColors.accent }} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'المباركة المالية والعينية' : 'Opalescent Gift Registry'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl
                ? 'لمن يرغب في تقديم المباركة العينية والهدايا لثنائي الحفل'
                : 'For families wishing to send direct marital support.'}
            </p>
          </div>
          <button
            onClick={onOpenBank}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
            style={{ color: customColors.accent }}
          >
            <span>{isRtl ? 'استعراض بيانات الحساب 💳' : 'View Registry Details 💳'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default OpalDreamLayout;
