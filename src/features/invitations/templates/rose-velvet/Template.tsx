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
  Flower2,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';
import { formatTime12Hour } from '../../../../lib/dateUtils';

export const RoseVelvetLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#1A050B';
  const cardBg = customColors?.cardBg || '#2A0A12';
  const textColor = customColors?.text || '#FDE8ED';
  const accent = customColors?.accent || '#E6A15C';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Magnetic Rose Petals Falling Canvas
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
    const particleCount = isMobile ? 18 : 40;

    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    const handleResize = () => {
      if (!canvas) return;
      const p = canvas.parentElement;
      width = canvas.width = p?.clientWidth || window.innerWidth;
      height = canvas.height = p?.clientHeight || window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = e.touches[0].clientX - rect.left;
        mouse.targetY = e.touches[0].clientY - rect.top;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
    }

    const petals: Petal[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: Math.random() * 0.6 - 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.6 + 0.4,
      color: Math.random() > 0.3 ? '#80091B' : '#B91C1C',
    }));

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Draw custom rose petal path
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size, -p.size * 1.5, -p.size * 1.5, p.size, 0, p.size * 1.8);
      ctx.bezierCurveTo(p.size * 1.5, p.size, p.size, -p.size * 1.5, 0, 0);
      ctx.fill();

      // Soft center vein
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, p.size * 1.2);
      ctx.stroke();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.3;
        p.rotation += p.rotationSpeed;

        // Gentle magnetic attraction to cursor/touch
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        // Reset offscreen
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        drawPetal(p);
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
      {/* Falling Magnetic Rose Petals Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2 shadow-2xl relative"
            style={{ backgroundColor: `${accent}15`, borderColor: accent }}
          >
            {/* Custom Full Open Rose SVG */}
            <svg viewBox="0 0 50 50" className="w-10 h-10 fill-current" style={{ color: '#E11D48' }}>
              <path d="M25 5 C15 5 10 15 15 25 C20 35 30 35 35 25 C40 15 35 5 25 5 Z M25 12 C28 12 30 16 28 20 C26 24 22 24 20 20 C18 16 22 12 25 12 Z" />
            </svg>
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-pulse" style={{ color: accent }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] font-serif font-bold mb-3"
            style={{ color: accent }}
          >
            {isRtl ? 'دعوة مخملية ملكية' : 'Royal Rose Velvet Invitation'}
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

          {/* Rose Velvet Divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="w-16 h-0.5" style={{ backgroundColor: accent }} />
            <Flower2 className="w-5 h-5" style={{ color: accent }} />
            <div className="w-16 h-0.5" style={{ backgroundColor: accent }} />
          </div>

          <p className="text-sm sm:text-base font-serif italic max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'يشرفنا حضوركم لتكتمل فرحتنا في ليلة العمر المخملية' : 'Join us for a magnificent velvet rose celebration')}
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
            style={{ backgroundColor: cardBg, borderColor: `${accent}77` }}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border hover:bg-rose-950/40 transition-all cursor-pointer"
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'برنامج الحفل' : 'Event Schedule'}</h3>
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'معرض الصور' : 'Photo Gallery'}</h3>
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'كلمات ومباركات' : 'Guest Wishes'}</h3>
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
                placeholder={isRtl ? 'اكتب تهنئتك المعطرة بالورد...' : 'Write your romantic wish...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-black/30 border rounded-xl p-4 text-xs focus:outline-none"
                style={{ borderColor: `${accent}30` }}
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent, color: '#1A050B' }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-rose-300 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Wish sent successfully!'}</p>}
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
            style={{ backgroundColor: accent, color: '#1A050B' }}
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
              <span>{isRtl ? 'تفاصيل الهدايا والتحويل' : 'Gift Registry Details'}</span>
            </button>
          </section>
        )}

        {/* FOOTER */}
        <footer className="text-center py-6 border-t border-rose-900/30 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'يسعدنا جدًا تواجدكم معنا في ليلتنا المخملية' : 'Looking forward to celebrating with you'}</p>
        </footer>
      </div>
    </div>
  );
};
