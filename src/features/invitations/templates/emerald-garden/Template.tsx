import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
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
  TreeDeciduous,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';

export const EmeraldGardenLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#062C21';
  const cardBg = customColors?.cardBg || '#0A3C2F';
  const textColor = customColors?.text || '#E2F4EE';
  const accent = customColors?.accent || '#E5C158'; // Gold Leaf Accent

  const butterflyContainerRef = useRef<HTMLDivElement | null>(null);

  // GSAP Curved Path Flying Butterflies Animation
  useEffect(() => {
    if (!butterflyContainerRef.current) return;

    const ctx = gsap.context(() => {
      const butterflies = butterflyContainerRef.current?.querySelectorAll('.emerald-butterfly');
      butterflies?.forEach((b, idx) => {
        // Floating wing flap effect
        gsap.to(b.querySelectorAll('.wing-left'), {
          scaleX: 0.2,
          duration: 0.25 + (idx % 3) * 0.05,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
        gsap.to(b.querySelectorAll('.wing-right'), {
          scaleX: 0.2,
          duration: 0.25 + (idx % 3) * 0.05,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });

        // Curved path flight across screen edges
        const pathX = idx % 2 === 0 ? [0, 80, -40, 100, 0] : [0, -100, 50, -80, 0];
        const pathY = idx % 2 === 0 ? [0, -60, 90, -40, 0] : [0, 80, -50, 70, 0];

        gsap.to(b, {
          x: (i) => pathX[i % pathX.length] * 2,
          y: (i) => pathY[i % pathY.length] * 2,
          rotation: (idx % 2 === 0 ? 1 : -1) * 25,
          duration: 12 + (idx % 3) * 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });
    }, butterflyContainerRef);

    return () => ctx.revert();
  }, []);

  const eventDate = new Date(`${details.eventDate}T${details.eventTime || '19:00'}`);
  const dateLabel = eventDate.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const butterflyCount = isMobile ? 3 : 6;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-hidden font-sans-body"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* Flying GSAP Butterflies Overlay */}
      <div
        ref={butterflyContainerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      >
        {Array.from({ length: butterflyCount }).map((_, i) => (
          <div
            key={i}
            className="emerald-butterfly absolute opacity-80"
            style={{
              top: `${15 + i * 14}%`,
              left: `${(i % 2 === 0 ? 10 : 80)}%`,
              width: '32px',
              height: '32px',
              color: accent,
            }}
          >
            {/* Custom SVG Butterfly Path */}
            <svg viewBox="0 0 50 50" className="w-full h-full fill-current drop-shadow-md">
              <g className="wing-left" style={{ transformOrigin: '25px 25px' }}>
                <path d="M25 25 C15 5, 2 10, 5 25 C8 32, 20 30, 25 25 Z" />
                <path d="M25 25 C18 35, 8 40, 12 45 C18 48, 22 36, 25 25 Z" opacity="0.8" />
              </g>
              <g className="wing-right" style={{ transformOrigin: '25px 25px' }}>
                <path d="M25 25 C35 5, 48 10, 45 25 C42 32, 30 30, 25 25 Z" />
                <path d="M25 25 C32 35, 42 40, 38 45 C32 48, 28 36, 25 25 Z" opacity="0.8" />
              </g>
              {/* Body */}
              <ellipse cx="25" cy="25" rx="1.5" ry="8" fill="#111" />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 border shadow-2xl relative"
            style={{ backgroundColor: `${accent}15`, borderColor: `${accent}88` }}
          >
            <TreeDeciduous className="w-8 h-8" style={{ color: accent }} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 animate-pulse" style={{ color: accent }} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.35em] font-serif font-bold mb-3"
            style={{ color: accent }}
          >
            {isRtl ? 'دعوة الحديقة الزمردية الملكية' : 'Royal Emerald Garden Celebration'}
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

          {/* Gold Leaf Divider */}
          <div className="flex items-center gap-2 my-6">
            <div className="w-16 h-px" style={{ backgroundColor: `${accent}88` }} />
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" style={{ color: accent }}>
              <path d="M17,8C15.5,5 12,3 8,3C3,3 2,7 2,12C2,17 6,21 11,21 C16,21 21,17 21,12 C21,10.5 20,9.2 19,8.2 Z" />
            </svg>
            <div className="w-16 h-px" style={{ backgroundColor: `${accent}88` }} />
          </div>

          <p className="text-sm sm:text-base font-serif italic max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'نتشرف بدعوتكم لحضور ليلة من أبهى ليالي الزفاف في الحديقة الملكية' : 'Join us for a magical evening in the royal garden')}
          </p>

          <p className="text-xs sm:text-sm font-mono mt-4 font-bold" style={{ color: accent }}>
            {dateLabel} · {details.eventTime || '19:00'}
          </p>

          {/* COUNTDOWN */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-12 w-full max-w-md">
            {[
              [timeLeft.days, isRtl ? 'يوم' : 'Days'],
              [timeLeft.hours, isRtl ? 'ساعة' : 'Hrs'],
              [timeLeft.minutes, isRtl ? 'دقيقة' : 'Min'],
              [timeLeft.seconds, isRtl ? 'ثانية' : 'Sec'],
            ].map(([val, label], idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl border text-center shadow-xl relative overflow-hidden"
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
            className="p-8 sm:p-10 rounded-3xl border shadow-2xl space-y-8 text-center relative"
            style={{ backgroundColor: cardBg, borderColor: `${accent}60` }}
          >
            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{isRtl ? 'الموعد والمكان' : 'Date & Venue'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75 font-mono">{details.eventTime || '19:00'}</p>
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border hover:bg-emerald-900/30 transition-all cursor-pointer"
              style={{ borderColor: accent, color: accent }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة إلى تقويم Google' : 'Add to Google Calendar'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </section>

        {/* SCHEDULE TIMELINE */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'برنامج الحفل' : 'Garden Itinerary'}</h3>
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
                    {item.time}
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'ألبوم صور الحديقة' : 'Garden Photo Gallery'}</h3>
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

        {/* WISHES & GUESTBOOK */}
        {details.enableGuestbook && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Users className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'سجل تهاني الضيوف' : 'Guestbook Wishes'}</h3>
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
                placeholder={isRtl ? 'اكتب كلمة التهنئة للعروسين...' : 'Write your wish for the couple...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-black/30 border rounded-xl p-4 text-xs focus:outline-none"
                style={{ borderColor: `${accent}30` }}
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent, color: '#062C21' }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-amber-300 text-center font-semibold">{isRtl ? 'تم تسليم تهنئتك بنجاح!' : 'Wish sent successfully!'}</p>}
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
            style={{ backgroundColor: accent, color: '#062C21' }}
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
        <footer className="text-center py-6 border-t border-emerald-900/40 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'نتطلع لاستقبالكم في حديقتنا الملكية' : 'Looking forward to welcoming you in the garden'}</p>
        </footer>
      </div>
    </div>
  );
};
