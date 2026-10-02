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
  Sparkles,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';

export const VintageLaceLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#FFF9F5';
  const cardBg = customColors?.cardBg || '#FFFFFF';
  const textColor = customColors?.text || '#4A353B';
  const accent = customColors?.accent || '#C88EA7'; // Vintage Dusty Rose Accent

  const eventDate = new Date(`${details.eventDate}T${details.eventTime || '19:00'}`);
  const dateLabel = eventDate.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-hidden font-serif"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* Background Soft Lace Watermark Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5 z-0">
        <svg className="w-full h-full fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="vintageLacePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M 0 10 Q 5 0, 10 10 T 20 10 M 10 0 Q 15 10, 10 20 T 10 0" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#vintageLacePattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
          {/* Custom SVG Vintage Ribbon Bow Above Names */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <svg className="w-16 h-12 mx-auto fill-current text-rose-300" viewBox="0 0 60 40" style={{ color: accent }}>
              <path d="M 30 18 C 22 8, 8 10, 12 22 C 15 30, 26 22, 30 20 C 34 22, 45 30, 48 22 C 52 10, 38 8, 30 18 Z M 30 20 C 26 28, 15 38, 10 38 C 12 30, 24 24, 30 20 Z M 30 20 C 34 28, 45 38, 50 38 C 48 30, 36 24, 30 20 Z" />
              <circle cx="30" cy="19" r="3" />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.35em] font-serif font-semibold mb-3 opacity-80"
            style={{ color: accent }}
          >
            {isRtl ? 'دعوة زفاف كلاسيكية عتيقة' : 'A Classic Vintage Lace Invitation'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold leading-tight"
          >
            {details.groomName || details.eventTitle}
            <span className="inline-block mx-3 my-2" style={{ color: accent }}>
              <Heart className="inline w-6 h-6 fill-current animate-bounce" />
            </span>
            {details.brideName}
          </motion.h1>

          {/* SVG Scalloped Lace Divider */}
          <div className="w-48 h-4 my-6 opacity-70">
            <svg className="w-full h-full text-rose-300 fill-none stroke-current" viewBox="0 0 200 16" style={{ color: accent }}>
              <path d="M 0 8 Q 10 0, 20 8 Q 30 16, 40 8 Q 50 0, 60 8 Q 70 16, 80 8 Q 90 0, 100 8 Q 110 16, 120 8 Q 130 0, 140 8 Q 150 16, 160 8 Q 170 0, 180 8 Q 190 16, 200 8" strokeWidth="2" />
            </svg>
          </div>

          <p className="text-sm sm:text-base font-serif italic max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'يتشرف العروسان بدعوة سيادتكم لحضور حفل الزفاف الكلاسيكي الفاخر' : 'Cordially inviting you to our classic vintage wedding')}
          </p>

          <p className="text-xs sm:text-sm font-semibold mt-4" style={{ color: accent }}>
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
                className="p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-rose-100 text-center relative overflow-hidden"
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

        {/* ORNATE CARD WITH REPEATING SVG LACE BORDER */}
        <section className="max-w-xl mx-auto relative">
          <div
            className="p-8 sm:p-12 rounded-3xl shadow-lg border border-rose-100 space-y-8 text-center relative overflow-hidden"
            style={{ backgroundColor: cardBg }}
          >
            {/* Top Scalloped Lace Border SVG */}
            <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden pointer-events-none opacity-80" style={{ color: accent }}>
              <svg className="w-full h-full fill-current" viewBox="0 0 400 12" preserveAspectRatio="none">
                <path d="M 0 0 C 10 12, 20 12, 30 0 C 40 12, 50 12, 60 0 C 70 12, 80 12, 90 0 C 100 12, 110 12, 120 0 C 130 12, 140 12, 150 0 C 160 12, 170 12, 180 0 C 190 12, 200 12, 210 0 C 220 12, 230 12, 240 0 C 250 12, 260 12, 270 0 C 280 12, 290 12, 300 0 C 310 12, 320 12, 330 0 C 340 12, 350 12, 360 0 C 370 12, 380 12, 390 0 C 400 12, 410 12, 420 0 Z" />
              </svg>
            </div>

            <div className="space-y-2 pt-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-serif text-xl font-bold">{isRtl ? 'الموعد والمكان' : 'Date & Venue'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75">{details.eventTime || '19:00'}</p>
            </div>

            <div className="w-16 h-px mx-auto bg-rose-200" />

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-serif text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
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
              <h3 className="font-serif text-2xl font-bold">{isRtl ? 'جدول المراسم' : 'Vintage Schedule'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 sm:p-5 rounded-2xl bg-white shadow-sm border border-rose-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base font-serif">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 bg-rose-50" style={{ color: accent }}>
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
              <h3 className="font-serif text-2xl font-bold">{isRtl ? 'ألبوم الصور الكلاسيكي' : 'Vintage Gallery'}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border border-rose-100 shadow-sm group cursor-pointer"
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
              <h3 className="font-serif text-2xl font-bold">{isRtl ? 'دفتر التبريكات' : 'Vintage Guestbook'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl bg-white shadow-sm border border-rose-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'الاسم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-400"
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة' : 'Relation'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-rose-400"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب كلمتك...' : 'Write your vintage wish...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-200 rounded-xl p-4 text-xs focus:outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-rose-600 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Wish sent successfully!'}</p>}
            </form>

            <div className="space-y-3">
              {wishes.map((w) => (
                <div key={w.id} className="p-4 rounded-xl bg-white border border-rose-100 space-y-1 text-xs shadow-sm">
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
        <footer className="text-center py-6 border-t border-rose-200 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'نتشرف بدعوتكم لحضور يومنا العتيق الأنيق' : 'Honored to welcome you to our vintage day'}</p>
        </footer>
      </div>
    </div>
  );
};
