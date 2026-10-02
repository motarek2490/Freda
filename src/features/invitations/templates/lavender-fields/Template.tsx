import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Send,
  Users,
  Gift,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';
import { formatTime12Hour } from '../../../../lib/dateUtils';

export const LavenderFieldsLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#1A1326';
  const cardBg = customColors?.cardBg || '#261C38';
  const textColor = customColors?.text || '#F1EBFB';
  const accent = customColors?.accent || '#C084FC';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Floating Glowing Pollen Particles with Smooth Mouse Follower Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const parent = canvas.parentElement;
    let width = (canvas.width = parent?.clientWidth || window.innerWidth);
    let height = (canvas.height = parent?.clientHeight || window.innerHeight);

    const isMobile = width < 768;
    const particleCount = isMobile ? 25 : 55;

    let targetMouse = { x: width / 2, y: height / 2 };
    let mouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      if (!canvas) return;
      const p = canvas.parentElement;
      width = canvas.width = p?.clientWidth || window.innerWidth;
      height = canvas.height = p?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        targetMouse.x = e.touches[0].clientX - rect.left;
        targetMouse.y = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    interface PollenParticle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      alpha: number;
      speedX: number;
      speedY: number;
      pulse: number;
    }

    const particles: PollenParticle[] = Array.from({ length: particleCount }).map(() => {
      const x = Math.random() * width;
      const y = Math.random() * height;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.4 ? '#E9D5FF' : '#A855F7',
        alpha: Math.random() * 0.7 + 0.3,
        speedX: (Math.random() - 0.5) * 0.6,
        speedY: -Math.random() * 0.5 - 0.2,
        pulse: Math.random() * Math.PI * 2,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Lagging ease follow cursor
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.02) * 0.4;
        p.pulse += 0.03;

        // Influence toward smooth mouse follower
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 220) {
          const factor = (220 - dist) / 220;
          p.x += (dx / dist) * factor * 1.5;
          p.y += (dy / dist) * factor * 1.5;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulse) * 0.2);

        // Draw glowing pollen dot
        ctx.save();
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

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
      {/* Glowing Lavender Pollen Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 shadow-2xl relative"
            style={{ backgroundColor: `${accent}20`, borderColor: accent }}
          >
            {/* Custom Lavender Sprig SVG */}
            <svg viewBox="0 0 40 40" className="w-10 h-10 fill-current" style={{ color: accent }}>
              <path d="M20 38 L20 10 M17 30 C15 28, 15 25, 20 25 C25 25, 25 28, 23 30 Z M16 22 C14 20, 14 17, 20 17 C26 17, 26 20, 24 22 Z M17 14 C15 12, 15 9, 20 9 C25 9, 25 12, 23 14 Z" />
            </svg>
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-pulse" style={{ color: accent }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] font-serif font-bold mb-3"
            style={{ color: accent }}
          >
            {isRtl ? 'دعوة حقول اللافندر الساحرة' : 'Lavender Fields Celebration'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold leading-tight"
          >
            {details.groomName || details.eventTitle}
            <span className="inline-block mx-3 my-2" style={{ color: accent }}>
              <Heart className="inline w-6 h-6 fill-current animate-bounce" />
            </span>
            {details.brideName}
          </motion.h1>

          {/* Lavender Divider Sprigs */}
          <div className="flex items-center gap-3 my-6">
            <div className="w-16 h-0.5" style={{ backgroundColor: `${accent}77` }} />
            <div className="w-6 h-6 text-purple-300">
              <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
                <circle cx="15" cy="15" r="4" />
                <circle cx="9" cy="15" r="2.5" opacity="0.7" />
                <circle cx="21" cy="15" r="2.5" opacity="0.7" />
              </svg>
            </div>
            <div className="w-16 h-0.5" style={{ backgroundColor: `${accent}77` }} />
          </div>

          <p className="text-sm sm:text-base font-serif italic max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'يسعدنا أن تشاركونا أبهى اللحظات في حقل اللافندر الحالم' : 'Celebrate our magical wedding amid the lavender fields')}
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
                className="p-3 sm:p-4 rounded-2xl border text-center shadow-2xl relative overflow-hidden"
                style={{ backgroundColor: cardBg, borderColor: `${accent}50` }}
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

        {/* DETAILS CARD */}
        <section className="max-w-xl mx-auto">
          <div
            className="p-8 sm:p-10 rounded-3xl border-2 shadow-2xl space-y-8 text-center relative"
            style={{ backgroundColor: cardBg, borderColor: `${accent}66` }}
          >
            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{isRtl ? 'الموعد والمكان' : 'Date & Venue'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75 font-mono">{formattedTime}</p>
            </div>

            <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: `${accent}40` }} />

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border hover:bg-purple-900/30 transition-all cursor-pointer"
              style={{ borderColor: accent, color: accent }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة إلى تقويم Google' : 'Add to Google Calendar'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </section>

        {/* TIMELINE */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'جدول المواعيد' : 'Event Timeline'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4"
                  style={{ backgroundColor: cardBg, borderColor: `${accent}30` }}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base font-playfair">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full font-bold shrink-0 border" style={{ backgroundColor: `${accent}15`, borderColor: `${accent}30`, color: accent }}>
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'معرض الصور' : 'Gallery'}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border group cursor-pointer shadow-xl"
                  style={{ borderColor: `${accent}40` }}
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

        {/* GUESTBOOK */}
        {details.enableGuestbook && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Users className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'تهاني وأحنيات' : 'Wishes'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: cardBg, borderColor: `${accent}40` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'الاسم الكريم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-black/30 border rounded-xl px-4 py-2 text-xs focus:outline-none"
                  style={{ borderColor: `${accent}30` }}
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة' : 'Relation'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-black/30 border rounded-xl px-4 py-2 text-xs focus:outline-none"
                  style={{ borderColor: `${accent}30` }}
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب تهنئتك المعطرة باللافندر...' : 'Write your wish...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-black/30 border rounded-xl p-4 text-xs focus:outline-none"
                style={{ borderColor: `${accent}30` }}
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent, color: '#1A1326' }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-purple-300 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Wish sent successfully!'}</p>}
            </form>

            <div className="space-y-3">
              {wishes.map((w) => (
                <div key={w.id} className="p-4 rounded-xl border space-y-1 text-xs" style={{ backgroundColor: cardBg, borderColor: `${accent}20` }}>
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
            style={{ backgroundColor: accent, color: '#1A1326' }}
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
        <footer className="text-center py-6 border-t border-purple-900/30 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'نسعد بلعياكم في حقل اللافندر' : 'Looking forward to meeting you in lavender fields'}</p>
        </footer>
      </div>
    </div>
  );
};
