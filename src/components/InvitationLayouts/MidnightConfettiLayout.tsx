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
  PartyPopper,
  Sparkles,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';
import { formatTime12Hour } from '../../lib/dateUtils';

export const MidnightConfettiLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#0D0B18';
  const cardBg = customColors?.cardBg || '#18142A';
  const textColor = customColors?.text || '#F3F0FF';
  const accent = customColors?.accent || '#A855F7'; // Neon Purple / Cyan Accent

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HTML5 Canvas Confetti Particle Burst Effect (Runs for 3.5s)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    let width = (canvas.width = parent?.clientWidth || window.innerWidth);
    let height = (canvas.height = parent?.clientHeight || window.innerHeight);

    const isMobile = width < 768;
    const confettiCount = isMobile ? 40 : 85;

    const colors = ['#A855F7', '#06B6D4', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#F43F5E'];
    const particles = Array.from({ length: confettiCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.4 - height * 0.2, // Launch from top area
      w: Math.random() * 8 + 6,
      h: Math.random() * 12 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 3 + 2.5,
      vx: Math.random() * 3 - 1.5,
      rotation: Math.random() * 360,
      vRot: Math.random() * 6 - 3,
      opacity: 1,
    }));

    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 3800; // 3.8 seconds total duration

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed * 0.003) * 0.8;
        p.rotation += p.vRot;

        // Fade out near the end
        if (progress > 0.7) {
          p.opacity = Math.max(0, 1 - (progress - 0.7) / 0.3);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      const p = canvas.parentElement;
      width = canvas.width = p?.clientWidth || window.innerWidth;
      height = canvas.height = p?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
      {/* Canvas Confetti Explosion Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-2xl relative"
            style={{ backgroundColor: `${accent}20`, borderColor: `${accent}80` }}
          >
            <PartyPopper className="w-8 h-8" style={{ color: accent }} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-cyan-400 animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] font-mono font-bold mb-3 flex items-center gap-2"
            style={{ color: '#06B6D4' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دعوة احتفالية عصرية' : 'Modern Celebration'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold leading-tight"
          >
            {details.groomName || details.eventTitle}
            <span className="inline-block mx-3 my-2 text-cyan-400">
              <Heart className="inline w-6 h-6 fill-current animate-pulse" />
            </span>
            {details.brideName}
          </motion.h1>

          <div className="w-24 h-1 my-6 rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500" />

          <p className="text-sm sm:text-base font-light max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'انضموا إلينا في ليلة لا تُنسى مليئة بالفرح والموسيقى' : 'Join us for an unforgettable night of celebration')}
          </p>

          <p className="text-xs sm:text-sm font-mono mt-4 font-bold" style={{ color: '#06B6D4' }}>
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
                className="p-3 sm:p-4 rounded-2xl border text-center shadow-2xl backdrop-blur-md"
                style={{ backgroundColor: cardBg, borderColor: `${accent}40` }}
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
        <section className="max-w-xl mx-auto">
          <div
            className="p-8 sm:p-10 rounded-3xl border shadow-2xl space-y-8 text-center"
            style={{ backgroundColor: cardBg, borderColor: `${accent}40` }}
          >
            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{isRtl ? 'الموعد والزمان' : 'Date & Time'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75 font-mono">{formattedTime}</p>
            </div>

            <div className="w-12 h-px mx-auto bg-purple-500/30" />

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border hover:bg-purple-500/10 transition-all cursor-pointer"
              style={{ borderColor: accent, color: accent }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة للتقويم' : 'Add to Calendar'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </section>

        {/* SCHEDULE TIMELINE */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'برنامج الحفل' : 'Party Schedule'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4"
                  style={{ backgroundColor: cardBg, borderColor: `${accent}30` }}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full font-bold shrink-0" style={{ backgroundColor: `${accent}20`, color: accent }}>
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'ألبوم صور الليلة' : 'Party Gallery'}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border group cursor-pointer shadow-xl"
                  style={{ borderColor: `${accent}30` }}
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'تهاني الحضور' : 'Party Guestbook'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: cardBg, borderColor: `${accent}30` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'الاسم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-400"
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة' : 'Relation'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-purple-400"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب تهنئتك...' : 'Write your celebration wish...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-black/30 border border-purple-500/30 rounded-xl p-4 text-xs focus:outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-purple-400 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Wish sent successfully!'}</p>}
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
            className="px-10 py-4 rounded-full font-bold text-sm uppercase text-white shadow-2xl flex items-center justify-center gap-2 mx-auto cursor-pointer"
            style={{ backgroundColor: accent }}
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
          <p className="mt-1">{isRtl ? 'جاهزون لليلة مليئة بالمرح والفرح!' : 'Get ready for an unforgettable night!'}</p>
        </footer>
      </div>
    </div>
  );
};
