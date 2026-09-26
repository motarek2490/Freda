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
  Waves,
  Sparkles,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const OceanPearlLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#E6F4F1';
  const cardBg = customColors?.cardBg || '#FFFFFF';
  const textColor = customColors?.text || '#0A3641';
  const accent = customColors?.accent || '#00A896'; // Serene Ocean Pearl Turquoise

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
      className="min-h-screen relative overflow-hidden font-sans-body"
      style={{ backgroundColor: bg, color: textColor }}
    >
      {/* Background Soft Pearl Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50/50 via-transparent to-cyan-100/40 pointer-events-none z-0" />

      {/* Embedded CSS Keyframes for Ocean Sine Wave Animation */}
      <style>{`
        @keyframes oceanWaveLoop {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(0); }
        }
        .animate-ocean-wave {
          animation: oceanWaveLoop 10s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-16">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-full bg-teal-100/80 flex items-center justify-center mb-6 shadow-sm border border-teal-200 relative"
          >
            <Waves className="w-8 h-8" style={{ color: accent }} />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-teal-500 animate-pulse" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.35em] font-sans font-bold mb-3 flex items-center gap-2"
            style={{ color: accent }}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>{isRtl ? 'دعوة الزفاف الساحلية اللؤلؤية' : 'A Coastal Pearl Wedding'}</span>
            <Waves className="w-3.5 h-3.5" />
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

          {/* Custom SVG Sea Shell Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: accent }} />
            <svg className="w-6 h-6 text-teal-600 fill-none stroke-current" viewBox="0 0 40 40">
              <path d="M20 5 C10 5, 2 15, 2 25 C2 32, 10 38, 20 38 C30 38, 38 32, 38 25 C38 15, 30 5, 20 5 Z M20 35 C12 35, 6 28, 6 22 L20 35 Z M20 35 C28 35, 34 28, 34 22 L20 35 Z M20 35 L20 8 M10 12 L20 35 M30 12 L20 35" strokeWidth="2" />
            </svg>
            <div className="w-12 h-0.5 rounded-full" style={{ backgroundColor: accent }} />
          </div>

          <p className="text-sm sm:text-base font-medium max-w-lg opacity-90">
            {details.customMessage || (isRtl ? 'يسعدنا أن تشاركونا الفرحة تحت هواء البحر العليل وأمواجه الهادئة' : 'Join us for a joyful celebration by the calm turquoise sea')}
          </p>

          <p className="text-xs sm:text-sm font-bold font-mono mt-4" style={{ color: accent }}>
            {dateLabel} · {details.eventTime || '17:00'}
          </p>

          {/* ANIMATED SVG OCEAN WAVE UNDER HERO */}
          <div className="w-full overflow-hidden mt-8 pointer-events-none opacity-60">
            <svg className="w-[150%] h-16 text-teal-300/40 fill-current animate-ocean-wave" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
            </svg>
          </div>

          {/* COUNTDOWN */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-8 w-full max-w-md">
            {[
              [timeLeft.days, isRtl ? 'يوم' : 'Days'],
              [timeLeft.hours, isRtl ? 'ساعة' : 'Hrs'],
              [timeLeft.minutes, isRtl ? 'دقيقة' : 'Min'],
              [timeLeft.seconds, isRtl ? 'ثانية' : 'Sec'],
            ].map(([val, label], idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-2xl bg-white shadow-sm border border-teal-100 text-center"
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
            className="p-8 sm:p-10 rounded-3xl shadow-lg border border-teal-100 space-y-8 text-center relative"
            style={{ backgroundColor: cardBg }}
          >
            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{isRtl ? 'الموعد والمكان' : 'Date & Venue'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs opacity-75 font-mono">{details.eventTime || '17:00'}</p>
            </div>

            <div className="w-12 h-px mx-auto bg-teal-200" />

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border border-teal-200 hover:bg-teal-50 transition-all cursor-pointer"
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'فقرات الحفل الشاطئي' : 'Beach Celebration Schedule'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-4 sm:p-5 rounded-2xl bg-white shadow-sm border border-teal-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full font-bold shrink-0 bg-teal-50" style={{ color: accent }}>
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'معرض صور اللؤلؤ' : 'Ocean Gallery'}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border border-teal-100 shadow-sm group cursor-pointer"
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'دفتر التبريكات والتهاني' : 'Coastal Guestbook'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl bg-white shadow-sm border border-teal-100 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'الاسم الكريم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-teal-50/40 border border-teal-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-teal-400"
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة' : 'Relation'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-teal-50/40 border border-teal-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-teal-400"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب كلمة التهنئة...' : 'Write your wish for the couple...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-teal-50/40 border border-teal-200 rounded-xl p-4 text-xs focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: accent }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Message'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-teal-600 text-center font-semibold">{isRtl ? 'تم إرسال تهنئتك بنجاح!' : 'Message sent successfully!'}</p>}
            </form>

            <div className="space-y-3">
              {wishes.map((w) => (
                <div key={w.id} className="p-4 rounded-xl bg-white border border-teal-100 space-y-1 text-xs shadow-sm">
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
        <footer className="text-center py-6 border-t border-teal-200 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'سعداء بمشاركتكم هذه اللحظات العاطفية' : 'Looking forward to seeing you by the ocean'}</p>
        </footer>
      </div>
    </div>
  );
};
