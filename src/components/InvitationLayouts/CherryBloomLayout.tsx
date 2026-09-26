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
  Flower2,
  Sparkles,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';
import { formatTime12Hour } from '../../lib/dateUtils';

export const CherryBloomLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#FFF5F7';
  const cardBg = customColors?.cardBg || '#FFFFFF';
  const textColor = customColors?.text || '#4A2E35';
  const accent = customColors?.accent || '#D946EF'; // Deep Rose Fuchsia

  const petalsContainerRef = useRef<HTMLDivElement | null>(null);

  // GSAP Swaying & Falling Cherry Blossom Petals Animation
  useEffect(() => {
    if (!petalsContainerRef.current) return;

    const ctx = gsap.context(() => {
      const petalElems = petalsContainerRef.current?.querySelectorAll('.cherry-petal-item');
      petalElems?.forEach((elem, idx) => {
        // Horizontal sway oscillation
        gsap.to(elem, {
          x: `+=${(idx % 2 === 0 ? 1 : -1) * (25 + (idx % 3) * 10)}`,
          rotation: (idx % 2 === 0 ? 1 : -1) * (180 + (idx % 4) * 45),
          duration: 2.5 + (idx % 3) * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Vertical continuous fall
        gsap.to(elem, {
          y: '108vh',
          duration: 7 + (idx % 5) * 2,
          delay: idx * 0.5,
          repeat: -1,
          ease: 'none',
        });
      });
    }, petalsContainerRef);

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
  const petalCount = isMobile ? 12 : 22;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-hidden font-sans-body"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* GSAP Falling Cherry Blossom Petals Background Container */}
      <div
        ref={petalsContainerRef}
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      >
        {Array.from({ length: petalCount }).map((_, i) => (
          <div
            key={i}
            className="cherry-petal-item absolute opacity-70"
            style={{
              top: '-8%',
              left: `${(i * (100 / petalCount)) + (i % 3) * 2}%`,
              width: `${18 + (i % 3) * 6}px`,
              height: `${20 + (i % 3) * 6}px`,
            }}
          >
            {/* Custom SVG Cherry Blossom Petal Path with Top Notch */}
            <svg viewBox="0 0 24 24" className="w-full h-full fill-current text-pink-400/80 drop-shadow-sm">
              <path d="M12 4C10 2 7 2 5 4C3 6 3 9 4 12C6 16 12 22 12 22C12 22 18 16 20 12C21 9 21 6 19 4C17 2 14 2 12 4Z" />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-6 shadow-sm relative"
          >
            <Flower2 className="w-8 h-8" style={{ color: accent }} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-pink-500 animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] font-serif font-semibold mb-3 opacity-80 flex items-center gap-2"
            style={{ color: accent }}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دعوة زفاف وردية' : 'Cherry Blossom Wedding'}</span>
            <Flower2 className="w-3.5 h-3.5" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-tight flex flex-wrap items-center justify-center gap-3"
          >
            <span>{details.groomName || details.eventTitle}</span>
            <span className="inline-block mx-1 my-2" style={{ color: accent }}>
              <Heart className="inline w-6 h-6 fill-current animate-bounce" />
            </span>
            <span>{details.brideName}</span>
          </motion.h1>

          <div className="flex items-center gap-3 my-6">
            <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: accent }} />
            <Flower2 className="w-4 h-4" style={{ color: accent }} />
            <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: accent }} />
          </div>

          <p className="text-sm sm:text-base font-serif italic max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'نسعد بوجودكم ومعيتكم في يومنا المميز' : 'Your presence will make our blossoming day complete')}
          </p>

          <p className="text-xs sm:text-sm font-semibold mt-4" style={{ color: accent }}>
            {dateLabel} · {formatTime12Hour(details.eventTime || '19:00', isRtl)}
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
                className="p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-pink-100 text-center relative overflow-hidden"
              >
                <span className="font-serif text-2xl sm:text-4xl font-bold block" style={{ color: accent }}>
                  {String(val).padStart(2, '0')}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-serif tracking-wider opacity-70 block mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* EVENT DETAILS CARD */}
        <section className="max-w-xl mx-auto">
          <div
            className="p-8 sm:p-10 rounded-3xl shadow-lg border border-pink-100 space-y-8 text-center relative"
            style={{ backgroundColor: cardBg }}
          >
            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-serif text-xl font-bold">{isRtl ? 'الموعد والزمان' : 'Date & Time'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75">{formatTime12Hour(details.eventTime || '19:00', isRtl)}</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px bg-pink-200" />
              <Flower2 className="w-3.5 h-3.5 text-pink-400" />
              <div className="w-12 h-px bg-pink-200" />
            </div>

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-serif text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border border-pink-200 hover:bg-pink-50 transition-all cursor-pointer"
              style={{ color: accent }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة إلى التقويم' : 'Add to Calendar'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </section>

        {/* SCHEDULE TIMELINE */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-serif text-2xl font-bold">{isRtl ? 'جدول الفقرات' : 'Event Schedule'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 sm:p-5 rounded-2xl bg-white shadow-sm border border-pink-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 bg-pink-50" style={{ color: accent }}>
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
              <h3 className="font-serif text-2xl font-bold flex items-center justify-center gap-2">
                <Flower2 className="w-4 h-4" style={{ color: accent }} />
                <span>{isRtl ? 'ألبوم الصور' : 'Photo Gallery'}</span>
                <Flower2 className="w-4 h-4" style={{ color: accent }} />
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border border-pink-100 shadow-sm group cursor-pointer"
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
              <h3 className="font-serif text-2xl font-bold">{isRtl ? 'دفتر تهاني الزوار' : 'Guestbook & Wishes'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl bg-white shadow-sm border border-pink-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'الاسم الكريـم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-pink-400"
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة (اختياري)' : 'Relation (Optional)'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-pink-50/50 border border-pink-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-pink-400"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب تهنئتك...' : 'Write your wish for the couple...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-pink-50/50 border border-pink-200 rounded-xl p-4 text-xs focus:outline-none focus:border-pink-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-white"
                style={{ backgroundColor: accent }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-pink-600 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Wish sent successfully!'}</p>}
            </form>

            <div className="space-y-3">
              {wishes.map((w) => (
                <div key={w.id} className="p-4 rounded-xl bg-white border border-pink-100 space-y-1 text-xs shadow-sm">
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
            className="px-10 py-4 rounded-full font-bold text-sm uppercase text-white shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer"
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
        <footer className="text-center py-6 border-t border-pink-200 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'نتطلع لمشاركتكم هذه اللحظات المزهرة' : 'Can’t wait to celebrate together'}</p>
        </footer>
      </div>
    </div>
  );
};
