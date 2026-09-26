import React from 'react';
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
  Sun,
  Palmtree,
  Sparkles,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const FreshCitrusLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#FFF8F0';
  const cardBg = customColors?.cardBg || '#FFFFFF';
  const textColor = customColors?.text || '#2D1810';
  const accent = customColors?.accent || '#FF7043'; // Vibrant Sunny Citrus Orange

  const eventDate = new Date(`${details.eventDate}T${details.eventTime || '19:00'}`);
  const dateLabel = eventDate.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-hidden font-sans-body"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* Interactive Continuous Slow Rotating Sun Element in Top Corner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="fixed -top-12 -right-12 pointer-events-none z-0 opacity-20 text-orange-500"
      >
        <Sun className="w-56 h-56" />
      </motion.div>

      {/* Floating Citrus & Palm Illustrations Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Floating Palm Tree 1 */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-6 opacity-25 text-orange-600"
        >
          <Palmtree className="w-28 h-28 sm:w-36 sm:h-36" />
        </motion.div>

        {/* Floating Palm Tree 2 (Desktop only or offset) */}
        {!isMobile && (
          <motion.div
            animate={{ y: [0, -22, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-2/3 -right-8 opacity-20 text-amber-600"
          >
            <Palmtree className="w-32 h-32" />
          </motion.div>
        )}

        {/* Floating Flat Citrus Slice SVGs */}
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-1/4 opacity-20"
        >
          <svg className="w-12 h-12 text-orange-400 fill-current" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" />
            <path d="M50 50 L50 10 A40 40 0 0 1 85 35 Z" />
            <path d="M50 50 L85 35 A40 40 0 0 1 85 65 Z" />
            <path d="M50 50 L85 65 A40 40 0 0 1 50 90 Z" />
            <path d="M50 50 L50 90 A40 40 0 0 1 15 65 Z" />
            <path d="M50 50 L15 65 A40 40 0 0 1 15 35 Z" />
            <path d="M50 50 L15 35 A40 40 0 0 1 50 10 Z" />
          </svg>
        </motion.div>

        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, -20, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute bottom-1/4 right-12 opacity-20"
        >
          <svg className="w-16 h-16 text-amber-500 fill-current" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="none" />
            <path d="M50 50 L50 10 A40 40 0 0 1 85 35 Z" />
            <path d="M50 50 L85 35 A40 40 0 0 1 85 65 Z" />
            <path d="M50 50 L85 65 A40 40 0 0 1 50 90 Z" />
            <path d="M50 50 L50 90 A40 40 0 0 1 15 65 Z" />
            <path d="M50 50 L15 65 A40 40 0 0 1 15 35 Z" />
            <path d="M50 50 L15 35 A40 40 0 0 1 50 10 Z" />
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-6 shadow-sm relative"
          >
            <Sun className="w-8 h-8 animate-spin-slow" style={{ color: accent }} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-500 animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] font-sans font-bold mb-3 opacity-80 flex items-center gap-2"
            style={{ color: accent }}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دعوة حفل نهارية مشمسة' : 'Sunny Daytime Celebration'}</span>
            <Sun className="w-3.5 h-3.5" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
          >
            {details.groomName || details.eventTitle}
            <span className="inline-block mx-3 my-2" style={{ color: accent }}>
              <Heart className="inline w-6 h-6 fill-current animate-bounce" />
            </span>
            {details.brideName}
          </motion.h1>

          <div className="flex items-center gap-2 my-6">
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: accent }} />
            <Palmtree className="w-4 h-4 text-orange-500" />
            <div className="w-12 h-1 rounded-full" style={{ backgroundColor: accent }} />
          </div>

          <p className="text-sm sm:text-base font-medium max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'شاركونا أجواء الفرحة والبهجة في حفلنا المنعش' : 'Celebrate our love under the bright open sky')}
          </p>

          <p className="text-xs sm:text-sm font-bold font-mono mt-4" style={{ color: accent }}>
            {dateLabel} · {details.eventTime || '16:00'}
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
                className="p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-orange-100 text-center"
              >
                <span className="font-playfair text-2xl sm:text-4xl font-extrabold block" style={{ color: accent }}>
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
            className="p-8 sm:p-10 rounded-3xl shadow-lg border border-orange-100 space-y-8 text-center relative"
            style={{ backgroundColor: cardBg }}
          >
            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{isRtl ? 'الموعد والمكان' : 'Date & Venue'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75 font-mono">{details.eventTime || '16:00'}</p>
            </div>

            <div className="w-12 h-px mx-auto bg-orange-200" />

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border border-orange-200 hover:bg-orange-50 transition-all cursor-pointer"
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'فقرات الحفل' : 'Party Timeline'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 sm:p-5 rounded-2xl bg-white shadow-sm border border-orange-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full font-bold shrink-0 bg-orange-50" style={{ color: accent }}>
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'معرض الصور المبهجة' : 'Fresh Moments Gallery'}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border border-orange-100 shadow-sm group cursor-pointer"
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'رسائل وتهاني الأحبة' : 'Guestbook Wishes'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl bg-white shadow-sm border border-orange-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'الاسم الكريم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-400"
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة' : 'Relation'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-orange-50/50 border border-orange-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-orange-400"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب كلمة التهنئة...' : 'Write your cheerful message...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-orange-50/50 border border-orange-200 rounded-xl p-4 text-xs focus:outline-none focus:border-orange-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Message'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-orange-600 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Message sent successfully!'}</p>}
            </form>

            <div className="space-y-3">
              {wishes.map((w) => (
                <div key={w.id} className="p-4 rounded-xl bg-white border border-orange-100 space-y-1 text-xs shadow-sm">
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
        <footer className="text-center py-6 border-t border-orange-200 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'نتطلع لرؤيتكم واحتفالنا سوياً' : 'Can’t wait to celebrate together'}</p>
        </footer>
      </div>
    </div>
  );
};
