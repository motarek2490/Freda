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
  Sparkles,
  ExternalLink,
  Maximize2,
  UserCheck,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';
import { formatTime12Hour } from '../../../../lib/dateUtils';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { ActionButton } from './components/ActionButton';
import './styles.css';

// ─── Scroll Reveal Wrapper ───
const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    className={className}
  >
    {children}
  </motion.div>
);

// ─── Main Template ───
export const RomanticCanvasLayout: React.FC<TemplateLayoutProps> = ({
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
  const details = invitation.eventDetails;
  const accent = customColors?.accent || '#C9A46A';
  const text = customColors?.text || '#F7F1E8';
  const cardBg = customColors?.cardBg || '#171412';

  return (
    <div
      className="template-romantic-canvas"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: customColors?.bg || '#11100F',
        color: text,
      }}
    >
      {/* Film Grain Overlay */}
      <div className="frida-grain" />

      {/* ═══════════════════════════════════════════
          1. HERO — Living Romantic Canvas
          ═══════════════════════════════════════════ */}
      <Hero
        groomName={details.groomName || ''}
        brideName={details.brideName || ''}
        eventTitle={details.eventTitle || ''}
        customMessage={details.customMessage || ''}
        eventDate={details.eventDate || ''}
        eventTime={details.eventTime || ''}
        isRtl={isRtl}
        accentColor={accent}
        hostNames={details.hostNames}
      />

      {/* ═══════════════════════════════════════════
          2. COUNTDOWN
          ═══════════════════════════════════════════ */}
      <Reveal>
        <section className="frida-section">
          <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
            <p className="frida-eyebrow" style={{ color: accent }}>
              {isRtl ? 'العد التنازلي' : 'Countdown'}
            </p>
            <h2 className="frida-section-title">
              {isRtl ? 'الأيام المتبقية على بهجتنا' : 'Until the Celebration'}
            </h2>
            <Countdown
              days={timeLeft.days}
              hours={timeLeft.hours}
              minutes={timeLeft.minutes}
              seconds={timeLeft.seconds}
              isRtl={isRtl}
              accentColor={accent}
            />
            <div className="frida-divider" />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="frida-btn-primary"
                style={{ borderColor: `${accent}40`, color: accent, fontSize: '0.65rem', padding: '0.7rem 1.5rem' }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إضافة للتقويم' : 'Save to Calendar'}</span>
              </a>
              {details.rsvpDeadline && (
                <span className="frida-detail-row" style={{ fontSize: '0.7rem' }}>
                  <Clock className="w-3.5 h-3.5" style={{ color: accent }} />
                  {isRtl ? `آخر موعد: ${details.rsvpDeadline}` : `Deadline: ${details.rsvpDeadline}`}
                </span>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══════════════════════════════════════════
          3. VENUE
          ═══════════════════════════════════════════ */}
      {details.venueName && (
        <Reveal delay={0.1}>
          <section className="frida-section">
            <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <MapPin className="w-5 h-5 mx-auto" style={{ color: accent }} />
              </div>
              <p className="frida-eyebrow" style={{ color: accent }}>
                {isRtl ? 'الموقع' : 'Venue'}
              </p>
              <h2 className="frida-section-title">{details.venueName}</h2>
              {details.address && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: `${text}80`, marginBottom: '1.25rem' }}>
                  {details.address}
                </p>
              )}
              <div className="frida-detail-row" style={{ marginBottom: '1rem' }}>
                <Calendar className="w-4 h-4" style={{ color: accent }} />
                <span>{details.eventDate}</span>
                <span style={{ color: `${text}30`, margin: '0 0.3rem' }}>·</span>
                <Clock className="w-4 h-4" style={{ color: accent }} />
                <span>{formatTime12Hour(details.eventTime, isRtl)}</span>
              </div>
              {details.googleMapsUrl && (
                <div style={{ textAlign: 'center' }}>
                  <a
                    href={details.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="frida-btn-primary"
                    style={{ borderColor: `${accent}40`, color: accent, fontSize: '0.65rem' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'عرض على الخريطة' : 'Open in Maps'}</span>
                  </a>
                </div>
              )}
              {details.dressCode && (
                <>
                  <div className="frida-divider" />
                  <div className="frida-detail-row">
                    <Shirt className="w-4 h-4" style={{ color: accent }} />
                    <span>
                      <strong>{isRtl ? 'الزي:' : 'Dress Code:'}</strong> {details.dressCode}
                    </span>
                  </div>
                </>
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══════════════════════════════════════════
          4. TIMELINE / SCHEDULE
          ═══════════════════════════════════════════ */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <Reveal delay={0.1}>
          <section className="frida-section">
            <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
              <p className="frida-eyebrow" style={{ color: accent }}>
                {isRtl ? 'البرنامج' : 'Programme'}
              </p>
              <h2 className="frida-section-title">
                {isRtl ? 'مراسم الحفل' : 'Celebration Schedule'}
              </h2>
              <div style={{ maxWidth: '28rem', margin: '0 auto' }}>
                {details.scheduleTimeline.map((item, idx) => (
                  <div key={item.id || idx} className="frida-timeline-item">
                    <span className="frida-timeline-time" style={{ borderColor: `${accent}30`, color: accent }}>
                      {formatTime12Hour(item.time, isRtl)}
                    </span>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: text }}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p style={{ fontSize: '0.75rem', color: `${text}60`, marginTop: '0.2rem' }}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══════════════════════════════════════════
          5. COVER IMAGE / GALLERY
          ═══════════════════════════════════════════ */}
      {details.coverImageUrl && (
        <Reveal delay={0.1}>
          <section className="frida-section">
            <div
              onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
              style={{
                borderRadius: '1.25rem',
                overflow: 'hidden',
                border: `1px solid ${accent}25`,
                cursor: 'pointer',
                position: 'relative',
                maxHeight: '20rem',
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
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '1rem',
                }}
              >
                <span style={{ color: '#fff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Maximize2 className="w-3.5 h-3.5" />
                  {isRtl ? 'تكبير' : 'Enlarge'}
                </span>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══════════════════════════════════════════
          6. GIFT REGISTRY
          ═══════════════════════════════════════════ */}
      {details.enableGiftRegistry && (
        <Reveal delay={0.1}>
          <section className="frida-section">
            <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)`, textAlign: 'center' }}>
              <Gift className="w-6 h-6 mx-auto" style={{ color: accent, marginBottom: '0.75rem' }} />
              <p className="frida-eyebrow" style={{ color: accent }}>
                {isRtl ? 'الهدايا' : 'Gift Registry'}
              </p>
              <h2 className="frida-section-title">
                {isRtl ? 'هدية العروسين' : 'Gift & Wishes'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: `${text}70`, maxWidth: '24rem', margin: '0 auto 1.5rem', lineHeight: 1.7 }}>
                {isRtl
                  ? 'مشاركتكم فرحتنا هي الهدية الأغلى. ولمن أراد التفضل بتقديم تهنئة رقمية:'
                  : 'Your presence is the greatest gift. For those wishing to extend a digital blessing:'}
              </p>
              <ActionButton
                label={isRtl ? 'بيانات التحويل البنكي' : 'Bank Transfer Info'}
                onClick={onOpenBank}
                icon={Gift}
                variant="outline"
              />
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══════════════════════════════════════════
          7. GUESTBOOK
          ═══════════════════════════════════════════ */}
      {details.enableGuestbook && (
        <Reveal delay={0.1}>
          <section className="frida-section">
            <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
              <p className="frida-eyebrow" style={{ color: accent, textAlign: 'center' }}>
                {isRtl ? 'سجل التهاني' : 'Guestbook'}
              </p>
              <h2 className="frida-section-title">
                {isRtl ? 'دعواتكم وتهانيكم' : 'Warm Wishes'}
              </h2>

              {/* Wish Form */}
              <form onSubmit={onAddWish} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                  placeholder={isRtl ? 'اكتب تبريكاتك للعروسين...' : 'Write your blessing...'}
                  className="frida-input"
                  style={{ resize: 'vertical' }}
                />
                <button
                  type="submit"
                  className="frida-btn-primary frida-btn-gold"
                  style={{ width: '100%', fontSize: '0.7rem' }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إرسال التهنئة' : 'Post Blessing'}</span>
                </button>
                {wishSuccess && (
                  <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 600 }}>
                    {isRtl ? 'جزاك الله خيراً، تم إرسال تبريكك!' : 'Your blessing was recorded!'}
                  </p>
                )}
              </form>

              {/* Wishes List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '16rem', overflowY: 'auto' }}>
                {wishes.map((w) => (
                  <div key={w.id} className="frida-wish-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: accent }}>
                        {w.authorName}
                      </span>
                      <span style={{ fontSize: '0.6rem', color: `${text}50` }}>
                        {w.relationship}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: `${text}90`, fontStyle: 'italic', lineHeight: 1.6 }}>
                      {w.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══════════════════════════════════════════
          8. RSVP
          ═══════════════════════════════════════════ */}
      {details.enableRSVP && (
        <Reveal delay={0.15}>
          <section className="frida-section" style={{ textAlign: 'center', paddingBottom: '6rem' }}>
            <div className="frida-divider" style={{ marginBottom: '2rem' }} />
            <p className="frida-eyebrow" style={{ color: accent }}>
              {isRtl ? 'نتشرف بحضوركم' : 'We Await Your Presence'}
            </p>
            <h2
              className="frida-section-title"
              style={{ fontSize: '1.5rem', marginBottom: '2rem' }}
            >
              {isRtl ? 'هل سنراكم هناك؟' : 'Will You Join Us?'}
            </h2>
            <ActionButton
              label={isRtl ? 'تأكيد الحضور' : 'Confirm Attendance'}
              onClick={onOpenRsvp}
              icon={UserCheck}
              variant="gold"
            />
            <div style={{ marginTop: '2rem' }}>
              <Heart
                className="w-4 h-4 mx-auto"
                style={{ color: accent, opacity: 0.3 }}
              />
            </div>
          </section>
        </Reveal>
      )}
    </div>
  );
};
