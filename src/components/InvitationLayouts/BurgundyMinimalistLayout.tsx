import React from 'react';
import { motion } from 'motion/react';
import { Heart, Calendar, MapPin, Send, Users, Gift, Sparkles, ChevronRight } from 'lucide-react';
import { TemplateLayoutProps } from './types';

// Palette is intentionally its own thing (deep wine + near-black + warm ivory),
// separate from the neutral dark theme your other layouts use — but it still
// respects an admin's customColors.accent override if one is set.
const BURGUNDY = '#3B0A14';
const NEAR_BLACK = '#150707';
const IVORY = '#F4EAE2';
const MUTED = '#B79F91';

export const BurgundyMinimalistLayout: React.FC<TemplateLayoutProps> = ({
  invitation,
  isRtl,
  customColors,
  timeLeft,
  wishes,
  onOpenRsvp,
  getGoogleCalendarUrl,
  setActiveLightboxImg,
}) => {
  const details = invitation.eventDetails;
  const accent = customColors?.accent || '#C9A66B';

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
      className="min-h-screen font-sans-body"
      style={{ background: `linear-gradient(180deg, ${NEAR_BLACK} 0%, ${BURGUNDY} 55%, ${NEAR_BLACK} 100%)`, color: IVORY }}
    >
      {/* ============ HERO ============ */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs tracking-[0.4em] uppercase mb-6"
          style={{ color: MUTED }}
        >
          {isRtl ? 'دعوة زفاف' : 'The Wedding Of'}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="font-playfair text-5xl sm:text-7xl leading-tight"
        >
          {details.groomName || details.eventTitle}
          <span className="block my-3" style={{ color: accent }}>
            <Heart className="inline w-6 h-6" />
          </span>
          {details.brideName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-16 h-px my-8"
          style={{ backgroundColor: accent }}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm"
          style={{ color: MUTED }}
        >
          {dateLabel}
        </motion.p>

        {/* Countdown */}
        <div className="flex items-center gap-6 sm:gap-10 mt-12">
          {[
            [timeLeft.days, isRtl ? 'يوم' : 'Days'],
            [timeLeft.hours, isRtl ? 'ساعة' : 'Hrs'],
            [timeLeft.minutes, isRtl ? 'دقيقة' : 'Min'],
            [timeLeft.seconds, isRtl ? 'ثانية' : 'Sec'],
          ].map(([value, label], i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-playfair text-3xl sm:text-4xl" style={{ color: accent }}>
                {String(value).padStart(2, '0')}
              </span>
              <span className="text-[10px] tracking-widest uppercase mt-1" style={{ color: MUTED }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WARM LEAD-IN ============ */}
      {details.customMessage && (
        <section className="max-w-xl mx-auto px-6 py-16 text-center">
          <Sparkles className="w-5 h-5 mx-auto mb-5" style={{ color: accent }} />
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: IVORY }}>
            {details.customMessage}
          </p>
        </section>
      )}

      {/* ============ EVENT DETAILS ============ */}
      <section className="max-w-md mx-auto px-6 py-12">
        <div
          className="rounded-2xl p-8 space-y-6 text-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)', border: `1px solid ${accent}33` }}
        >
          <div>
            <Calendar className="w-5 h-5 mx-auto mb-3" style={{ color: accent }} />
            <p className="text-sm" style={{ color: MUTED }}>
              {isRtl ? 'الموعد' : 'When'}
            </p>
            <p className="font-playfair text-lg mt-1">{dateLabel}</p>
          </div>
          <div className="w-10 h-px mx-auto" style={{ backgroundColor: `${accent}55` }} />
          <div>
            <MapPin className="w-5 h-5 mx-auto mb-3" style={{ color: accent }} />
            <p className="text-sm" style={{ color: MUTED }}>
              {isRtl ? 'المكان' : 'Where'}
            </p>
            <p className="font-playfair text-lg mt-1">{details.venueName}</p>
            <p className="text-xs mt-1" style={{ color: MUTED }}>
              {details.address}
            </p>
          </div>
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs mt-2 hover:opacity-80"
            style={{ color: accent }}
          >
            {isRtl ? 'أضف إلى التقويم' : 'Add to calendar'}
            <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
          </a>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      {details.galleryImages && details.galleryImages.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 py-16">
          <div className="flex items-center justify-center gap-2 mb-8" style={{ color: MUTED }}>
            <Sparkles className="w-4 h-4" />
            <span className="text-xs tracking-widest uppercase">
              {isRtl ? 'لحظاتنا' : 'Our Moments'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {details.galleryImages.map((src: string, i: number) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setActiveLightboxImg(src)}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                className={`overflow-hidden rounded-lg ${i % 5 === 0 ? 'col-span-2 row-span-2' : ''}`}
                style={{ aspectRatio: '1 / 1', border: `1px solid ${accent}22` }}
              >
                <img
                  src={src}
                  alt={isRtl ? `صورة ${i + 1} من ألبوم الزفاف` : `Wedding photo ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* ============ PRIMARY CTA ============ */}
      <section className="py-20 flex flex-col items-center px-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onOpenRsvp}
          className="px-12 py-4 rounded-full font-semibold text-sm uppercase tracking-widest flex items-center gap-2 shadow-lg cursor-pointer"
          style={{ backgroundColor: accent, color: NEAR_BLACK }}
        >
          <Send className="w-4 h-4" />
          {isRtl ? 'احجز مكانك' : 'Save My Seat'}
        </motion.button>
        <p className="text-xs mt-4" style={{ color: MUTED }}>
          {isRtl ? 'يسعدنا تأكيد حضوركم' : 'We would love to know you\u2019re coming'}
        </p>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      {wishes && wishes.length > 0 && (
        <section className="max-w-lg mx-auto px-6 pb-20">
          <div className="flex items-center justify-center gap-2 mb-8" style={{ color: MUTED }}>
            <Users className="w-4 h-4" />
            <span className="text-xs tracking-widest uppercase">
              {isRtl ? 'كلمات من أحبائنا' : 'Words From Our Loved Ones'}
            </span>
          </div>
          <div className="space-y-5">
            {wishes.slice(0, 3).map((w) => (
              <div key={w.id} className="text-center px-4">
                <p className="text-sm italic" style={{ color: IVORY }}>
                  “{w.message}”
                </p>
                <p className="text-xs mt-2" style={{ color: accent }}>
                  {w.authorName}
                  {w.relationship ? ` · ${w.relationship}` : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ SECONDARY: GIFT REGISTRY ============ */}
      {(details.bankDetailsBride || details.bankDetailsGroom || (details.paymentAccounts && details.paymentAccounts.length > 0)) && (
        <section className="text-center pb-24">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs hover:opacity-80 cursor-pointer"
            style={{ color: MUTED }}
          >
            <Gift className="w-4 h-4" />
            {isRtl ? 'تفاصيل هدية الزفاف' : 'Gift Registry Details'}
          </button>
        </section>
      )}

      {/* ============ FOOTER ============ */}
      <footer className="text-center pb-12 px-6">
        <Heart className="w-4 h-4 mx-auto mb-3" style={{ color: accent }} />
        <p className="text-xs" style={{ color: MUTED }}>
          {isRtl ? 'بكل الحب والامتنان' : 'With all our love and gratitude'}
        </p>
      </footer>
    </div>
  );
};
