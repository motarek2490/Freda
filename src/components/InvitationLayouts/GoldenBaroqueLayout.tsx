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
  Crown,
  Sparkles,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const GoldenBaroqueLayout: React.FC<TemplateLayoutProps> = ({
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
  const bg = customColors?.bg || '#0A080C';
  const cardBg = customColors?.cardBg || '#141017';
  const textColor = customColors?.text || '#F3ECE0';
  const accent = customColors?.accent || '#D4AF37'; // Imperial Baroque Gold

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
      {/* Background Subtle Gradient Vignette */}
      <div className="absolute inset-0 bg-radial from-amber-950/20 via-transparent to-black/90 pointer-events-none z-0" />

      {/* Embedded CSS for Gold Shimmer Sweep Animation */}
      <style>{`
        @keyframes baroqueGoldShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-gold-shimmer {
          animation: baroqueGoldShimmer 4s infinite linear;
        }
      `}</style>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 space-y-20">
        {/* HERO SECTION */}
        <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 relative">
          {/* Custom SVG Baroque Top Crest */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-6 flex flex-col items-center"
          >
            <Crown className="w-10 h-10 mx-auto" style={{ color: accent }} />
            {/* Detailed Ornate Baroque Crest SVG */}
            <svg className="w-48 h-8 mx-auto mt-2 opacity-90 fill-current" viewBox="0 0 240 40" style={{ color: accent }}>
              <path d="M120 0 C140 15, 180 8, 220 20 C180 32, 140 25, 120 40 C100 25, 60 32, 20 20 C60 8, 100 15, 120 0 Z M120 10 C130 18, 160 14, 190 20 C160 26, 130 22, 120 30 C110 22, 80 26, 50 20 C80 14, 110 18, 120 10 Z" />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.4em] font-serif mb-4 font-bold"
            style={{ color: accent }}
          >
            {isRtl ? 'دعوة ملكية فاخرة' : 'An Imperial Royal Invitation'}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-wide drop-shadow-2xl"
          >
            {details.groomName || details.eventTitle}
            <span className="block my-3 text-2xl font-normal italic" style={{ color: accent }}>
              &amp;
            </span>
            {details.brideName}
          </motion.h1>

          <div className="w-32 h-px my-8 relative overflow-hidden" style={{ backgroundColor: accent }}>
            {/* Real Gold Shimmer Bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-100 to-transparent animate-gold-shimmer" />
          </div>

          <p className="text-sm sm:text-base font-serif italic max-w-xl leading-relaxed opacity-90">
            {details.customMessage || (isRtl ? 'نتشرف بدعوة سيادتكم لحضور حفل الزفاف الملكي' : 'We cordially request the honor of your presence')}
          </p>

          <p className="text-xs sm:text-sm font-mono mt-6 uppercase tracking-widest font-bold" style={{ color: accent }}>
            {dateLabel} · {details.eventTime || '19:00'}
          </p>

          {/* COUNTDOWN WITH SHIMMER BORDERS */}
          <div className="grid grid-cols-4 gap-3 sm:gap-6 mt-12 w-full max-w-md">
            {[
              [timeLeft.days, isRtl ? 'يوم' : 'Days'],
              [timeLeft.hours, isRtl ? 'ساعة' : 'Hrs'],
              [timeLeft.minutes, isRtl ? 'دقيقة' : 'Min'],
              [timeLeft.seconds, isRtl ? 'ثانية' : 'Sec'],
            ].map(([val, label], idx) => (
              <div
                key={idx}
                className="p-3 sm:p-4 rounded-xl border relative overflow-hidden text-center shadow-2xl"
                style={{ backgroundColor: cardBg, borderColor: `${accent}66` }}
              >
                {/* Gold Shimmer Sweep Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full animate-gold-shimmer pointer-events-none" />
                <span className="font-playfair text-2xl sm:text-4xl font-bold block" style={{ color: accent }}>
                  {String(val).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-70 block mt-1">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ORNATE BAROQUE EVENT DETAILS CARD WITH DETAILED SVG CORNER ORNAMENTS */}
        <section className="max-w-xl mx-auto relative">
          <div
            className="p-8 sm:p-12 rounded-3xl border relative shadow-2xl space-y-8 text-center overflow-hidden"
            style={{ backgroundColor: cardBg, borderColor: `${accent}80` }}
          >
            {/* Top Shimmer Sweep Line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-200 to-transparent animate-gold-shimmer" />

            {/* Intricate Baroque Corner Flourishes SVG */}
            {/* Top-Left Corner Ornament */}
            <svg className="absolute top-2 left-2 w-10 h-10 opacity-90 fill-current pointer-events-none" viewBox="0 0 40 40" style={{ color: accent }}>
              <path d="M 0 0 L 25 0 C 18 5, 12 12, 12 25 L 0 25 Z M 4 4 L 4 18 C 8 10, 10 8, 18 4 Z" />
              <path d="M 0 0 C 15 0, 30 15, 30 30 C 25 20, 20 25, 0 0 Z" />
            </svg>
            {/* Top-Right Corner Ornament */}
            <svg className="absolute top-2 right-2 w-10 h-10 opacity-90 fill-current pointer-events-none scale-x-[-1]" viewBox="0 0 40 40" style={{ color: accent }}>
              <path d="M 0 0 L 25 0 C 18 5, 12 12, 12 25 L 0 25 Z M 4 4 L 4 18 C 8 10, 10 8, 18 4 Z" />
              <path d="M 0 0 C 15 0, 30 15, 30 30 C 25 20, 20 25, 0 0 Z" />
            </svg>
            {/* Bottom-Left Corner Ornament */}
            <svg className="absolute bottom-2 left-2 w-10 h-10 opacity-90 fill-current pointer-events-none scale-y-[-1]" viewBox="0 0 40 40" style={{ color: accent }}>
              <path d="M 0 0 L 25 0 C 18 5, 12 12, 12 25 L 0 25 Z M 4 4 L 4 18 C 8 10, 10 8, 18 4 Z" />
              <path d="M 0 0 C 15 0, 30 15, 30 30 C 25 20, 20 25, 0 0 Z" />
            </svg>
            {/* Bottom-Right Corner Ornament */}
            <svg className="absolute bottom-2 right-2 w-10 h-10 opacity-90 fill-current pointer-events-none scale-[-1]" viewBox="0 0 40 40" style={{ color: accent }}>
              <path d="M 0 0 L 25 0 C 18 5, 12 12, 12 25 L 0 25 Z M 4 4 L 4 18 C 8 10, 10 8, 18 4 Z" />
              <path d="M 0 0 C 15 0, 30 15, 30 30 C 25 20, 20 25, 0 0 Z" />
            </svg>

            <div className="space-y-2">
              <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{isRtl ? 'الموعد والتوقيت' : 'Date & Time'}</h3>
              <p className="text-sm opacity-90">{dateLabel}</p>
              <p className="text-xs font-mono opacity-80">{details.eventTime || '19:00'}</p>
            </div>

            {/* Baroque Divider */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-16 h-px" style={{ backgroundColor: `${accent}40` }} />
              <Crown className="w-4 h-4" style={{ color: accent }} />
              <div className="w-16 h-px" style={{ backgroundColor: `${accent}40` }} />
            </div>

            <div className="space-y-2">
              <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: accent }} />
              <h3 className="font-playfair text-xl font-bold">{details.venueName}</h3>
              <p className="text-xs opacity-80 max-w-sm mx-auto">{details.address}</p>
            </div>

            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold border hover:bg-amber-500/10 transition-all cursor-pointer relative overflow-hidden"
              style={{ borderColor: accent, color: accent }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة إلى تقويم الملكي' : 'Add to Royal Calendar'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </a>
          </div>
        </section>

        {/* SCHEDULE TIMELINE */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Sparkles className="w-5 h-5 mx-auto" style={{ color: accent }} />
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'المراسم والبرنامج' : 'Royal Itinerary'}</h3>
            </div>
            <div className="space-y-4">
              {details.scheduleTimeline.map((item, i) => (
                <div
                  key={item.id || i}
                  className="p-5 rounded-2xl border flex items-center justify-between gap-4 relative overflow-hidden"
                  style={{ backgroundColor: cardBg, borderColor: `${accent}40` }}
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base font-playfair">{item.title}</h4>
                    {item.description && <p className="text-xs opacity-75">{item.description}</p>}
                  </div>
                  <span className="font-mono text-xs px-3 py-1.5 rounded-full font-semibold shrink-0 border" style={{ backgroundColor: `${accent}15`, borderColor: `${accent}40`, color: accent }}>
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'معرض الصور الملوكي' : 'Royal Portrait Gallery'}</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border group cursor-pointer shadow-xl relative"
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
              <h3 className="font-playfair text-2xl font-bold">{isRtl ? 'تهاني الضيوف الكرام' : 'Royal Guestbook'}</h3>
            </div>

            <form onSubmit={onAddWish} className="p-6 rounded-2xl border space-y-4" style={{ backgroundColor: cardBg, borderColor: `${accent}40` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder={isRtl ? 'اسم الضيف الكريم' : 'Your Name'}
                  value={newWishAuthor}
                  onChange={(e) => setNewWishAuthor(e.target.value)}
                  className="w-full bg-black/40 border rounded-xl px-4 py-2 text-xs focus:outline-none"
                  style={{ borderColor: `${accent}40` }}
                />
                <input
                  type="text"
                  placeholder={isRtl ? 'صلة القرابة' : 'Relation'}
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  className="w-full bg-black/40 border rounded-xl px-4 py-2 text-xs focus:outline-none"
                  style={{ borderColor: `${accent}40` }}
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder={isRtl ? 'اكتب كلمة التهنئة للعروسين...' : 'Write your wish for the couple...'}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                className="w-full bg-black/40 border rounded-xl p-4 text-xs focus:outline-none"
                style={{ borderColor: `${accent}40` }}
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden"
                style={{ backgroundColor: accent, color: '#0A080C' }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة الملكية' : 'Send Royal Wish'}</span>
              </button>
              {wishSuccess && <p className="text-xs text-amber-400 text-center font-semibold">{isRtl ? 'تم تسليم تهنئتك الملكية بنجاح!' : 'Royal wish sent successfully!'}</p>}
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
            className="px-12 py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 mx-auto cursor-pointer relative overflow-hidden"
            style={{ backgroundColor: accent, color: '#0A080C' }}
          >
            <Send className="w-4 h-4" />
            <span>{isRtl ? 'تأكيد الحضور الملكي (RSVP)' : 'Confirm Royal RSVP'}</span>
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
        <footer className="text-center py-6 border-t border-amber-900/30 text-xs opacity-60">
          <p>{details.eventTitle}</p>
          <p className="mt-1">{isRtl ? 'يشرفنا الترحيب بحضوركم الكريـم' : 'Honored to welcome your presence'}</p>
        </footer>
      </div>
    </div>
  );
};
