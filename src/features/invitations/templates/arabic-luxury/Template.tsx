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
      {/* Film Grain Texture */}
      <div className="frida-grain" />

      {/* ═══════════════════════════════════════════
          1. HERO & LIVING CANVAS
          ═══════════════════════════════════════════ */}
      <Hero
        groomName={details.groomName || ''}
        brideName={details.brideName || ''}
        eventTitle={details.eventTitle || (isRtl ? 'حفل زفاف مبارك' : 'Wedding Celebration')}
        customMessage={details.customMessage || details.mainMessage || (isRtl ? 'يسعدنا ويشرفنا دعوتكم لمشاركتنا فرحة العمر' : 'Cordially invite you to celebrate our union')}
        eventDate={details.eventDate || ''}
        eventTime={details.eventTime || ''}
        isRtl={isRtl}
        accentColor={accent}
        hostNames={details.hostNames}
        groomParents={details.groomParents}
        brideParents={details.brideParents}
        groomAvatarUrl={details.groomAvatarUrl}
        brideAvatarUrl={details.brideAvatarUrl}
      />

      {/* ═══════════════════════════════════════════
          2. COUNTDOWN & SAVE TO CALENDAR
          ═══════════════════════════════════════════ */}
      <section className="frida-section">
        <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
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
          <div className="frida-divider" />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="frida-btn-primary"
              style={{ borderColor: `${accent}50`, color: accent, fontSize: '0.7rem', padding: '0.75rem 1.75rem' }}
            >
              <Calendar className="w-4 h-4" />
              <span>{isRtl ? 'إضافة إلى تقويم Google' : 'Save to Google Calendar'}</span>
            </a>
            {details.rsvpDeadline && (
              <span className="frida-detail-row" style={{ fontSize: '0.75rem' }}>
                <Clock className="w-4 h-4" style={{ color: accent }} />
                {isRtl ? `آخر موعد لتأكيد الحضور: ${details.rsvpDeadline}` : `RSVP Deadline: ${details.rsvpDeadline}`}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. VENUE LOCATION & GOOGLE MAPS
          ═══════════════════════════════════════════ */}
      {details.venueName && (
        <section className="frida-section">
          <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
            <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '9999px',
                  backgroundColor: `${accent}15`,
                  border: `1px solid ${accent}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  color: accent,
                }}
              >
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <p className="frida-eyebrow" style={{ color: accent }}>
              {isRtl ? 'قاعة الحفل وموقع الضيافة' : 'Venue & Location'}
            </p>
            <h2 className="frida-section-title" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
              {details.venueName}
            </h2>
            {details.address && (
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: `${text}80`, marginBottom: '1.25rem' }}>
                {details.address}
              </p>
            )}

            <div className="frida-detail-row" style={{ marginBottom: '1.25rem' }}>
              <Calendar className="w-4 h-4" style={{ color: accent }} />
              <span>{details.eventDate}</span>
              <span style={{ color: `${text}30`, margin: '0 0.4rem' }}>•</span>
              <Clock className="w-4 h-4" style={{ color: accent }} />
              <span>{formatTime12Hour(details.eventTime, isRtl)}</span>
            </div>

            {details.googleMapsUrl && (
              <div style={{ textAlign: 'center' }}>
                <a
                  href={details.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="frida-btn-primary frida-btn-gold"
                  style={{ fontSize: '0.75rem', padding: '0.85rem 2rem' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isRtl ? 'عرض الموقع الدقيق على الخريطة' : 'Open Location in Google Maps'}</span>
                </a>
              </div>
            )}

            {details.dressCode && (
              <>
                <div className="frida-divider" />
                <div className="frida-detail-row">
                  <Shirt className="w-4 h-4" style={{ color: accent }} />
                  <span>
                    <strong>{isRtl ? 'الزي المعتمد:' : 'Dress Code:'}</strong> {details.dressCode}
                  </span>
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          4. TIMELINE / PROGRAMME
          ═══════════════════════════════════════════ */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <section className="frida-section">
          <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
            <p className="frida-eyebrow" style={{ color: accent }}>
              {isRtl ? 'البرنامج' : 'Programme'}
            </p>
            <h2 className="frida-section-title">
              {isRtl ? 'مراسم وبرنامج الحفل' : 'Celebration Schedule'}
            </h2>
            <div style={{ maxWidth: '32rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {details.scheduleTimeline.map((item, idx) => (
                <div key={item.id || idx} className="frida-timeline-item">
                  <span className="frida-timeline-time" style={{ borderColor: `${accent}40`, color: accent }}>
                    {formatTime12Hour(item.time, isRtl)}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: text }}>
                      {item.title}
                    </h4>
                    {item.description && (
                      <p style={{ fontSize: '0.8rem', color: `${text}70`, marginTop: '0.2rem' }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          5. COVER IMAGE / PHOTO
          ═══════════════════════════════════════════ */}
      {details.coverImageUrl && (
        <section className="frida-section">
          <div
            onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
            style={{
              borderRadius: '1.5rem',
              overflow: 'hidden',
              border: `2px solid ${accent}40`,
              cursor: 'pointer',
              position: 'relative',
              maxHeight: '22rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
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
      )}

      {/* ═══════════════════════════════════════════
          6. BANK GIFT REGISTRY
          ═══════════════════════════════════════════ */}
      {details.enableGiftRegistry && (
        <section className="frida-section">
          <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)`, textAlign: 'center' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '9999px',
                backgroundColor: `${accent}15`,
                border: `1px solid ${accent}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: accent,
              }}
            >
              <Gift className="w-7 h-7" />
            </div>
            <p className="frida-eyebrow" style={{ color: accent }}>
              {isRtl ? 'صندوق الهدايا والتبريكات' : 'Gift Registry'}
            </p>
            <h2 className="frida-section-title">
              {isRtl ? 'هدية العروسين والتهنئة' : 'Gift Registry & Wishes'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: `${text}80`, maxWidth: '28rem', margin: '0 auto 1.5rem', lineHeight: 1.8 }}>
              {isRtl
                ? 'مشاركتكم فرحتنا هي الهدية الأغلى. ولمن أراد التفضل بتقديم تهنئة مسبقة عبر الحسابات البنكية ومحافظ الهاتف:'
                : 'Your presence brings us joy. For those who wish to extend a gift through bank transfer or phone wallet:'}
            </p>
            <ActionButton
              label={isRtl ? 'بيانات التحويل البنكي ورمز QR' : 'View Bank Transfer Info & QR'}
              onClick={onOpenBank}
              icon={Gift}
              variant="gold"
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          7. GUESTBOOK & WISHES
          ═══════════════════════════════════════════ */}
      {details.enableGuestbook && (
        <section className="frida-section">
          <div className="frida-section-card" style={{ background: `linear-gradient(135deg, ${cardBg}dd, ${cardBg}f2)` }}>
            <p className="frida-eyebrow" style={{ color: accent, textAlign: 'center' }}>
              {isRtl ? 'سجل التهاني' : 'Guestbook'}
            </p>
            <h2 className="frida-section-title">
              {isRtl ? 'سجل دعوات وتهاني الضيوف' : 'Guestbook & Warm Wishes'}
            </h2>

            {/* Wish Form */}
            <form onSubmit={onAddWish} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
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
                  placeholder={isRtl ? 'صلة القرابة (صديق، قريب...)...' : 'Relation (Friend, Cousin...)...'}
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
                style={{ width: '100%', fontSize: '0.75rem', padding: '0.85rem' }}
              >
                <Send className="w-4 h-4" />
                <span>{isRtl ? 'إرسال التهنئة المباركة' : 'Post Your Blessings'}</span>
              </button>
              {wishSuccess && (
                <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600 }}>
                  {isRtl ? 'جزاك الله خيراً، تم إرسال تبريكك بنجاح!' : 'Your blessing was recorded successfully!'}
                </p>
              )}
            </form>

            {/* Wishes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '18rem', overflowY: 'auto' }}>
              {wishes.map((w) => (
                <div key={w.id} className="frida-wish-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: accent }}>
                      {w.authorName}
                    </span>
                    {w.relationship && (
                      <span style={{ fontSize: '0.7rem', color: `${text}60` }}>
                        {w.relationship}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: `${text}90`, fontStyle: 'italic', lineHeight: 1.6 }}>
                    {w.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          8. RSVP CONFIRMATION
          ═══════════════════════════════════════════ */}
      {details.enableRSVP && (
        <section className="frida-section" style={{ textAlign: 'center', paddingBottom: '6rem' }}>
          <div className="frida-divider" style={{ marginBottom: '2rem' }} />
          <p className="frida-eyebrow" style={{ color: accent }}>
            {isRtl ? 'نتشرف بحضوركم الكريم' : 'We Await Your Presence'}
          </p>
          <h2
            className="frida-section-title"
            style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}
          >
            {isRtl ? 'تأكيد الحضور ومشاركتنا الفرحة' : 'Confirm Your Attendance (RSVP)'}
          </h2>
          <ActionButton
            label={isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Attendance (RSVP)'}
            onClick={onOpenRsvp}
            icon={UserCheck}
            variant="gold"
          />
          <div style={{ marginTop: '2.5rem' }}>
            <Heart
              className="w-5 h-5 mx-auto"
              style={{ color: accent, opacity: 0.4 }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default RomanticCanvasLayout;
