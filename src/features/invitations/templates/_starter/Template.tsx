import React from 'react';
import { Calendar, Clock, MapPin, Gift, Send, UserCheck } from 'lucide-react';
import { InvitationTemplateProps } from '../../model/templateContract';
import { Hero } from './components/Hero';
import { Countdown } from './components/Countdown';
import { ActionButton } from './components/ActionButton';
import './styles.css';

export const StarterTemplate: React.FC<InvitationTemplateProps> = ({
  invitation,
  lang,
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
  getGoogleCalendarUrl,
}) => {
  const details = invitation.eventDetails;
  const accent = customColors?.accent || '#C9A46A';
  const text = customColors?.text || '#F7F1E8';
  const cardBg = customColors?.cardBg || '#171412';

  return (
    <div
      className="template-starter"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        backgroundColor: customColors?.bg || '#11100F',
        color: text,
      }}
    >
      {/* 1. HERO SECTION */}
      <Hero
        groomName={details.groomName || ''}
        brideName={details.brideName || ''}
        eventTitle={details.eventTitle || ''}
        customMessage={details.customMessage || ''}
        eventDate={details.eventDate || ''}
        eventTime={details.eventTime || ''}
        isRtl={isRtl}
        accentColor={accent}
        textColor={text}
        cardBgColor={cardBg}
        hostNames={details.hostNames}
      />

      {/* 2. COUNTDOWN */}
      <section className="starter-section">
        <div className="starter-card" style={{ backgroundColor: cardBg, borderColor: `${accent}30` }}>
          <h3 className="text-xs font-bold tracking-widest uppercase text-center mb-4" style={{ color: accent }}>
            {isRtl ? 'العد التنازلي للحفل' : 'Countdown to Celebration'}
          </h3>
          <Countdown
            days={timeLeft.days}
            hours={timeLeft.hours}
            minutes={timeLeft.minutes}
            seconds={timeLeft.seconds}
            isRtl={isRtl}
            accentColor={accent}
          />
          <div className="pt-4 mt-4 border-t flex justify-center gap-3" style={{ borderColor: `${accent}20` }}>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1.5 font-semibold hover:underline"
              style={{ color: accent }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حفظ في التقويم' : 'Save to Calendar'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. VENUE DETAILS */}
      {details.venueName && (
        <section className="starter-section">
          <div className="starter-card text-center space-y-3" style={{ backgroundColor: cardBg, borderColor: `${accent}30` }}>
            <MapPin className="w-5 h-5 mx-auto" style={{ color: accent }} />
            <h2 className="text-xl font-bold font-serif">{details.venueName}</h2>
            {details.address && <p className="text-xs opacity-70">{details.address}</p>}
          </div>
        </section>
      )}

      {/* 4. RSVP ACTION */}
      {details.enableRSVP && (
        <section className="starter-section text-center pt-4">
          <ActionButton
            label={isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Attendance (RSVP)'}
            onClick={onOpenRsvp}
            icon={UserCheck}
            variant="gold"
          />
        </section>
      )}
    </div>
  );
};

export default StarterTemplate;
