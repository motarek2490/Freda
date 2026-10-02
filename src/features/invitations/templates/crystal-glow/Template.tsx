import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  Send,
  Users,
  Gift,
  ChevronRight,
  Gem,
  Star,
  Sparkle,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';
import { formatTime12Hour } from '../../../../lib/dateUtils';

export const CrystalGlowLayout: React.FC<TemplateLayoutProps> = ({
  invitation,
  isRtl,
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
  const bg = customColors?.bg || '#06101E';
  const cardBg = customColors?.cardBg || 'rgba(10, 25, 47, 0.65)';
  const textColor = customColors?.text || '#E2E8F0';
  const accent = customColors?.accent || '#E5C158';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Crystal Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const parent = canvas.parentElement;
    let width = (canvas.width = parent?.clientWidth || window.innerWidth);
    let height = (canvas.height = parent?.clientHeight || window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 28 : 65;

    let mouseX = width / 2;
    let mouseY = height / 2;
    let isInteracting = false;

    interface CrystalParticle {
      x: number;
      y: number;
      size: number;
      alpha: number;
      vx: number;
      vy: number;
      pulseSpeed: number;
      isStarShape: boolean;
    }

    const particles: CrystalParticle[] = Array.from({ length: particleCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1.2,
      alpha: Math.random() * 0.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      isStarShape: i % 4 === 0,
    }));

    const draw4PointStar = (
      cx: number,
      cy: number,
      outerR: number,
      innerR: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.restore();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isInteracting = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        isInteracting = true;
      }
    };

    const handleResize = () => {
      if (!canvas) return;
      const p = canvas.parentElement;
      width = canvas.width = p?.clientWidth || window.innerWidth;
      height = canvas.height = p?.clientHeight || window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.008;
        if (p.alpha < 0.2) p.alpha = 0.2;
        if (p.alpha > 0.95) p.alpha = 0.95;

        if (isInteracting) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160;
          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        if (p.isStarShape) {
          draw4PointStar(p.x, p.y, p.size * 3.5, p.size * 1.2, accent, p.alpha);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = accent;
          ctx.globalAlpha = p.alpha;
          ctx.shadowBlur = 12;
          ctx.shadowColor = accent;
          ctx.fill();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [accent]);

  const eventDate = new Date(`${details.eventDate}T${details.eventTime || '19:00'}`);
  const dateLabel = eventDate.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedTime = formatTime12Hour(details.eventTime || '19:00', isRtl);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-hidden font-sans-body"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* Interactive Crystal Canvas Particle Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border relative shadow-2xl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: `${accent}88` }}
          >
            <Gem className="w-8 h-8" style={{ color: accent }} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-pulse" style={{ color: accent }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <Star className="w-3.5 h-3.5 fill-current opacity-80" style={{ color: accent }} />
            <p
              className="text-xs tracking-[0.4em] uppercase font-mono font-bold"
              style={{ color: accent }}
            >
              {isRtl ? 'دعوة زفاف كريستالية' : 'A Crystal Celebration Of Love'}
            </p>
            <Star className="w-3.5 h-3.5 fill-current opacity-80" style={{ color: accent }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold leading-tight drop-shadow-md relative"
          >
            <Sparkle className="w-5 h-5 absolute -top-4 -left-4 opacity-75 animate-bounce hidden sm:block" style={{ color: accent }} />
            {details.groomName || details.eventTitle}
            <span className="inline-block mx-3 my-2" style={{ color: accent }}>
              <Heart className="inline w-6 h-6 fill-current animate-pulse" />
            </span>
            {details.brideName}
            <Sparkle className="w-5 h-5 absolute -bottom-4 -right-4 opacity-75 animate-bounce hidden sm:block" style={{ color: accent }} />
          </motion.h1>

          <div className="w-24 h-0.5 my-8 rounded-full relative" style={{ backgroundColor: accent }}>
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-300 shadow-md" style={{ backgroundColor: accent }} />
          </div>

          <p className="text-sm sm:text-base font-light tracking-wide max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'نتشرف بدعوتكم لمشاركتنا فرحتنا الكبرى' : 'Join us in celebrating our eternal union')}
          </p>

          <p className="text-xs sm:text-sm font-mono mt-4 font-bold" style={{ color: accent }}>
            {dateLabel} · {formattedTime}
          </p>

          {/* COUNTDOWN */}
          <div dir="ltr" className="grid grid-cols-4 gap-3 sm:gap-6 mt-12 w-full max-w-md">
            {[
              [timeLeft.days, isRtl ? 'يوم' : 'Days'],
              [timeLeft.hours, isRtl ? 'ساعة' : 'Hrs'],
              [timeLeft.minutes, isRtl ? 'دقيقة' : 'Min'],
              [timeLeft.seconds, isRtl ? 'ثانية' : 'Sec'],
            ].map(([val, label], idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl backdrop-blur-xl border border-white/10 text-center shadow-lg relative overflow-hidden group"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)' }}
              >
                <span className="font-playfair text-2xl sm:text-4xl font-bold block" style={{ color: accent }}>
                  {String(val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider opacity-70 block mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* EVENT DETAILS CARD */}
        <section className="max-w-xl mx-auto relative">
          <div className="absolute -top-3 -left-3 text-amber-400 opacity-60">
            <Sparkles className="w-6 h-6" style={{ color: accent }} />
          </div>
          <div className="absolute -bottom-3 -right-3 text-amber-400 opacity-60">
            <Sparkles className="w-6 h-6" style={{ color: accent }} />
          </div>

          <div
            className="p-8 sm:p-10 rounded-3xl backdrop-blur-2xl border shadow-2xl space-y-8 text-center"
            style={{ backgroundColor: cardBg, borderColor: `${accent}40` }}
          >
            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold flex items-center justify-center gap-2">
                <span>{isRtl ? 'التاريخ والوقت' : 'Date & Time'}</span>
              </h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75 font-mono">{formattedTime}</p>
            </div>

            <div className="w-16 h-px mx-auto" style={{ backgroundColor: `${accent}40` }} />

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold backdrop-blur-md border hover:bg-white/10 transition-all cursor-pointer"
              style={{ borderColor: `${accent}80`, color: accent }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حفظ في تقويم Google' : 'Add to Google Calendar'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </section>

        {/* SCHEDULE TIMELINE */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'برنامج الحفل' : 'Event Timeline'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 sm:p-5 rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-between gap-4"
                  style={{ backgroundColor: cardBg }}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full font-semibold shrink-0" style={{ backgroundColor: `${accent}20`, color: accent }}>
                    {formatTime12Hour(item.time, isRtl)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY */}
        {details.enableGallery && details.galleryImages && details.galleryImages.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="font-playfair text-2xl font-bold flex items-center justify-center gap-2">
                <Star className="w-4 h-4 fill-current" style={{ color: accent }} />
                <span>{isRtl ? 'معرض الصور الكريستالي' : 'Crystal Photo Gallery'}</span>
                <Star className="w-4 h-4 fill-current" style={{ color: accent }} />
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border border-white/10 group cursor-pointer shadow-lg"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* WISHES & GUESTBOOK */}
        {details.enableGuestbook && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Users className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'أمنيات الأحبة' : 'Guestbook & Wishes'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl backdrop-blur-md border border-white/10 space-y-4" style={{ backgroundColor: cardBg }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'الاسم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة (اختياري)' : 'Relation (Optional)'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب تهنئتك للعروسين...' : 'Write your wish for the couple...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent, color: '#06101E' }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-emerald-400 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Wish sent successfully!'}</p>}
            </form>

            <div className="space-y-3">
              {wishes.map((w) => (
                <div key={w.id} className="p-4 rounded-xl backdrop-blur-sm border border-white/5 space-y-1 text-xs" style={{ backgroundColor: cardBg }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{ color: accent }}>{w.authorName}</span>
                    {w.relationship && <span className="opacity-60 text-[10px]">{w.relationship}</span>}
                  </div>
                  <p className="opacity-90">{w.message}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RSVP PRIMARY CTA */}
        <section className="text-center py-6 space-y-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenRsvp}
            className="px-10 py-4 rounded-full font-bold text-sm uppercase shadow-2xl flex items-center justify-center gap-2 mx-auto cursor-pointer"
            style={{ backgroundColor: accent, color: '#06101E' }}
          >
            <Send className="w-4 h-4" />
            <span>{isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm RSVP'}</span>
          </motion.button>
        </section>

        {/* GIFT REGISTRY */}
        {details.enableGiftRegistry && (
          <section className="text-center pb-8">
            <button
              onClick={onOpenBank}
              className="inline-flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: accent }}
            >
              <Gift className="w-4 h-4" />
              <span>{isRtl ? 'تفاصيل الهدية والتحويل' : 'Gift Registry Details'}</span>
            </button>
          </section>
        )}

        {/* FOOTER */}
        <footer className="text-center py-6 border-t border-white/10 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'يسعدنا وجودكم لمشاركتنا الفرحة' : 'Looking forward to celebrating with you'}</p>
        </footer>
      </div>
    </div>
  );
};
