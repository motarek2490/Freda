import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  Shirt,
  Send,
  ExternalLink,
  Maximize2,
  UserCheck,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';
import { formatTime12Hour } from '../../../../lib/dateUtils';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { ActionButton } from './components/ActionButton';
import { RomanticCanvas } from './canvas/RomanticCanvas';
import './styles.css';

export const ArabicLuxuryLayout: React.FC<TemplateLayoutProps> = ({
  invitation,
  isRtl,
  t,
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
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleReveal = React.useCallback(() => {
    setIsRevealed(true);
    // السماح بالتمرير بعد اكتمال المشهد الافتتاحي
    setTimeout(() => setIsLoaded(true), 500);
  }, []);

  // Guaranteed fallback timer (4.5s to perfectly match the 3.5s draw + 1.8s shrink animation)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
      setTimeout(() => setIsLoaded(true), 500);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  const details = invitation.eventDetails;
  const accent = customColors?.accent || '#C9A46A';
  const text = customColors?.text || '#F7F1E8';

  return (
    <div
      className={`template-arabic-luxury ${isLoaded ? 'loaded-phase' : 'loading-phase'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: customColors?.bg || '#11100F',
        color: text,
      }}
    >
      {/* FULL LIVING ROMANTIC CANVAS BACKGROUND */}
      <RomanticCanvas
        accentColor={accent}
        onReveal={handleReveal}
        interactive
      />

      {/* Subtle Grain Overlay */}
      <div className="frida-grain" />

      {/* 1. HERO & LIVING CANVAS */}
      <Hero
        groomName={details.groomName || ''}
        brideName={details.brideName || ''}
        eventTitle={details.eventTitle || (isRtl ? 'حفل زفاف مبارك' : 'Wedding Celebration')}
        customMessage={details.customMessage || details.mainMessage || ''}
        eventDate={details.eventDate || ''}
        eventTime={details.eventTime || ''}
        isRtl={isRtl}
        accentColor={accent}
        isRevealed={isRevealed}
        hostNames={details.hostNames}
        groomParents={details.groomParents}
        brideParents={details.brideParents}
        groomAvatarUrl={details.groomAvatarUrl}
        brideAvatarUrl={details.brideAvatarUrl}
      />

      {/* Sections gracefully reveal once heart drawing completes */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col gap-12 sm:gap-16 pb-12"
      >
        <div className="frida-divider" />

        {/* 2. COUNTDOWN & CALENDAR */}
        <section className="frida-section text-center space-y-6">
          <p className="frida-eyebrow" style={{ color: accent }}>
            {isRtl ? 'العد التنازلي' : 'Countdown'}
          </p>
          <h2 className="frida-section-title">
            {isRtl ? 'الأيام المتبقية على بهجتنا الكبرى' : 'Countdown to the Sacred Celebration'}
          </h2>
          
          <Countdown
            days={timeLeft.days}
            hours={timeLeft.hours}
            minutes={timeLeft.minutes}
            seconds={timeLeft.seconds}
            isRtl={isRtl}
            accentColor={accent}
          />

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="frida-btn-primary"
              style={{ borderColor: `${accent}60`, color: accent, fontSize: '0.75rem', padding: '0.8rem 2rem' }}
            >
              <Calendar className="w-4 h-4" />
              <span>{isRtl ? 'إضافة إلى تقويم Google' : 'Save to Google Calendar'}</span>
            </a>
            {details.rsvpDeadline && (
              <span className="frida-detail-row" style={{ fontSize: '0.8rem' }}>
                <Clock className="w-4 h-4" style={{ color: accent }} />
                {isRtl ? `آخر موعد للرد: ${details.rsvpDeadline}` : `RSVP Deadline: ${details.rsvpDeadline}`}
              </span>
            )}
          </div>
        </section>

        <div className="frida-divider" />

        {/* 3. VENUE LOCATION */}
        {details.venueName && (
          <section className="frida-section text-center space-y-4">
            <MapPin className="w-6 h-6 mx-auto" style={{ color: accent }} />
            <p className="frida-eyebrow" style={{ color: accent }}>
              {isRtl ? 'قاعة الحفل وموقع الضيافة' : 'Venue & Location'}
            </p>
            <h2 className="frida-section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {details.venueName}
            </h2>
            {details.address && (
              <p style={{ fontSize: '0.9rem', color: `${text}80`, maxWidth: '28rem', margin: '0 auto' }}>
                {details.address}
              </p>
            )}
            <div className="frida-detail-row" style={{ marginTop: '0.75rem' }}>
              <Calendar className="w-4 h-4" style={{ color: accent }} />
              <span>{details.eventDate}</span>
              <span style={{ color: `${text}30`, margin: '0 0.5rem' }}>•</span>
              <Clock className="w-4 h-4" style={{ color: accent }} />
              <span>{formatTime12Hour(details.eventTime, isRtl)}</span>
            </div>
            {details.googleMapsUrl && (
              <div style={{ paddingTop: '1rem' }}>
                <a
                  href={details.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="frida-btn-primary frida-btn-gold"
                  style={{ fontSize: '0.75rem', padding: '0.85rem 2.25rem' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isRtl ? 'عرض الموقع الدقيق على الخريطة' : 'Open Location in Google Maps'}</span>
                </a>
              </div>
            )}
            {details.dressCode && (
              <div className="frida-detail-row" style={{ marginTop: '1rem' }}>
                <Shirt className="w-4 h-4" style={{ color: accent }} />
                <span>
                  <strong>{isRtl ? 'الزي المعتمد:' : 'Dress Code:'}</strong> {details.dressCode}
                </span>
              </div>
            )}
          </section>
        )}

        {/* 4. TIMELINE / PROGRAMME */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <>
            <div className="frida-divider" />
            <section className="frida-section text-center space-y-6">
              <p className="frida-eyebrow" style={{ color: accent }}>
                {isRtl ? 'البرنامج' : 'Programme'}
              </p>
              <h2 className="frida-section-title">
                {isRtl ? 'مراسم وبرنامج الحفل' : 'Celebration Schedule'}
              </h2>
              <div style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {details.scheduleTimeline.map((item, idx) => (
                  <div key={item.id || idx} className="frida-timeline-item">
                    <span className="frida-timeline-time">{formatTime12Hour(item.time, isRtl)}</span>
                    <div style={{ textAlign: isRtl ? 'right' : 'left' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: text }}>{item.title}</h4>
                      {item.description && (
                        <p style={{ fontSize: '0.8rem', color: `${text}70`, marginTop: '0.2rem' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* 5. COVER IMAGE / PHOTO */}
        {details.coverImageUrl && (
          <>
            <div className="frida-divider" />
            <section className="frida-section text-center">
              <div
                onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
                style={{
                  borderRadius: '1.75rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  position: 'relative',
                  maxHeight: '24rem',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                  border: `1px solid ${accent}30`,
                }}
              >
                <img
                  src={details.coverImageUrl}
                  alt="Cover"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: '1.25rem',
                  }}
                >
                  <span style={{ color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Maximize2 className="w-4 h-4 text-[#C9A46A]" />
                    {isRtl ? 'تكبير صورة المناسبة' : 'Enlarge Cover Image'}
                  </span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 6. GIFT REGISTRY */}
        {details.enableGiftRegistry && (
          <>
            <div className="frida-divider" />
            <section className="frida-section text-center space-y-4">
              <Gift className="w-7 h-7 mx-auto" style={{ color: accent }} />
              <p className="frida-eyebrow" style={{ color: accent }}>
                {isRtl ? 'صندوق الهدايا والتبريكات' : 'Gift Registry'}
              </p>
              <h2 className="frida-section-title">
                {isRtl ? 'هدية العروسين والتهنئة' : 'Gift Registry & Wishes'}
              </h2>
              <p style={{ fontSize: '0.9rem', color: `${text}80`, maxWidth: '28rem', margin: '0 auto', lineHeight: 1.8 }}>
                {isRtl
                  ? 'مشاركتكم فرحتنا هي الهدية الأغلى. ولمن أراد التفضل بتقديم تهنئة مسبقة عبر الحسابات البنكية ومحافظ الهاتف:'
                  : 'Your presence brings us joy. For those who wish to extend a gift through bank transfer:'}
              </p>
              <div style={{ paddingTop: '0.5rem' }}>
                <ActionButton
                  label={isRtl ? 'بيانات التحويل البنكي ورمز QR' : 'View Bank Transfer Info & QR'}
                  onClick={onOpenBank}
                  icon={Gift}
                  variant="gold"
                />
              </div>
            </section>
          </>
        )}

        {/* 7. GUESTBOOK & WISHES */}
        {details.enableGuestbook && (
          <>
            <div className="frida-divider" />
            <section className="frida-section text-center space-y-6">
              <p className="frida-eyebrow" style={{ color: accent }}>
                {isRtl ? 'سجل التهاني' : 'Guestbook'}
              </p>
              <h2 className="frida-section-title">
                {isRtl ? 'سجل دعوات وتهاني الضيوف' : 'Guestbook & Warm Wishes'}
              </h2>

              <form onSubmit={onAddWish} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxWidth: '34rem', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem' }}>
                  <input
                    type="text"
                    required
                    value={newWishAuthor}
                    onChange={(e) => setNewWishAuthor(e.target.value)}
                    placeholder={isRtl ? 'الاسم الكريم...' : 'Your Name...'}
                    className="frida-input"
                  />
                  <input
                    type="text"
                    value={newWishRelation}
                    onChange={(e) => setNewWishRelation(e.target.value)}
                    placeholder={isRtl ? 'صلة القرابة...' : 'Relation...'}
                    className="frida-input"
                  />
                </div>
                <textarea
                  required
                  rows={2}
                  value={newWishMessage}
                  onChange={(e) => setNewWishMessage(e.target.value)}
                  placeholder={isRtl ? 'اكتب تبريكاتك ودعواتك للعروسين بالبركة...' : 'Write your prayer and blessing...'}
                  className="frida-input"
                  style={{ resize: 'vertical' }}
                />
                <button
                  type="submit"
                  className="frida-btn-primary frida-btn-gold"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '0.9rem' }}
                >
                  <Send className="w-4 h-4" />
                  <span>{isRtl ? 'إرسال التهنئة المباركة' : 'Post Your Blessings'}</span>
                </button>
                {wishSuccess && (
                  <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6ee7b7', fontWeight: 600 }}>
                    {isRtl ? 'جزاك الله خيراً، تم إرسال تبريكك بنجاح!' : 'Your blessing was recorded successfully!'}
                  </p>
                )}
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '20rem', overflowY: 'auto', maxWidth: '34rem', margin: '0 auto' }}>
                {wishes.map((w) => (
                  <div key={w.id} className="frida-wish-card" style={{ textAlign: isRtl ? 'right' : 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: accent }}>{w.authorName}</span>
                      {w.relationship && <span style={{ fontSize: '0.75rem', color: `${text}60` }}>{w.relationship}</span>}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: `${text}90`, fontStyle: 'italic', lineHeight: 1.6 }}>{w.message}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* 8. RSVP CONFIRMATION */}
        {details.enableRSVP && (
          <>
            <div className="frida-divider" />
            <section className="frida-section text-center space-y-4" style={{ paddingBottom: '6rem' }}>
              <p className="frida-eyebrow" style={{ color: accent }}>
                {isRtl ? 'نتشرف بحضوركم الكريم' : 'We Await Your Presence'}
              </p>
              <h2 className="frida-section-title" style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                {isRtl ? 'تأكيد الحضور ومشاركتنا الفرحة' : 'Confirm Your Attendance (RSVP)'}
              </h2>
              <ActionButton
                label={isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Attendance (RSVP)'}
                onClick={onOpenRsvp}
                icon={UserCheck}
                variant="gold"
              />
              <div style={{ marginTop: '3rem' }}>
                <Heart className="w-5 h-5 mx-auto" style={{ color: accent, opacity: 0.5 }} />
              </div>
            </section>
          </>
        )}
      </motion.div>
    </div>
  );
};

export const RomanticCanvasLayout = ArabicLuxuryLayout;
export default ArabicLuxuryLayout;
