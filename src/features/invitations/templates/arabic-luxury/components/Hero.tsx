import React from 'react';
import { motion } from 'motion/react';

interface HeroProps {
  groomName: string;
  brideName: string;
  eventTitle: string;
  customMessage: string;
  eventDate: string;
  eventTime: string;
  isRtl: boolean;
  accentColor: string;
  isRevealed?: boolean;
  hostNames?: string;
  groomParents?: string;
  brideParents?: string;
  groomAvatarUrl?: string;
  brideAvatarUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  groomName,
  brideName,
  eventTitle,
  customMessage,
  eventDate,
  eventTime,
  isRtl,
  accentColor,
  isRevealed = true,
  hostNames,
  groomParents,
  brideParents,
  groomAvatarUrl,
  brideAvatarUrl,
}) => {
  const coupleDisplay = `${groomName || ''} & ${brideName || ''}`;
  const hasAvatars = groomAvatarUrl || brideAvatarUrl;

  return (
    <section className="frida-hero" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="frida-hero-overlay">
        {/* The text content appears gracefully UNDERNEATH the heart after it is drawn */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 pt-1 sm:pt-2"
        >
          {/* Basmalah & Quranic Verse (Directly below the glowing heart) */}
          <div className="text-center space-y-1.5">
            <p
              className="text-sm sm:text-base font-serif tracking-widest font-extrabold"
              style={{
                color: accentColor,
                textShadow: `0 0 16px ${accentColor}60`,
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p
              className="text-xs sm:text-sm md:text-base font-serif leading-relaxed text-[#FFFDF7] font-medium max-w-xl mx-auto"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
            </p>
          </div>

          {/* Host Names Greeting */}
          {hostNames && (
            <div className="text-center pt-1">
              <p
                className="frida-eyebrow text-xs sm:text-sm font-bold tracking-widest"
                style={{ color: accentColor }}
              >
                {isRtl ? 'بدعوة كريمة ومباركة من' : 'Together with their families'}
              </p>
              <h2
                className="text-lg sm:text-2xl md:text-3xl font-bold font-serif text-[#FFFDF7] mt-1"
                style={{
                  textShadow: '0 2px 15px rgba(0,0,0,0.9)',
                }}
              >
                {hostNames}
              </h2>
            </div>
          )}

          {/* Couple Names (Directly below heart, prominent, sharp, and clear) */}
          <div className="text-center py-1">
            <h1
              className={`frida-couple-names ${isRtl ? 'frida-couple-names-ar' : ''}`}
              style={{
                color: '#FFFDF7',
                textShadow: `0 4px 28px rgba(0,0,0,0.95), 0 0 35px ${accentColor}40`,
              }}
            >
              {coupleDisplay}
            </h1>
          </div>

          {/* Groom & Bride Avatars & Parents */}
          {hasAvatars && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '2rem',
                margin: '0.75rem 0',
              }}
            >
              {groomAvatarUrl && (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={groomAvatarUrl}
                    alt={groomName}
                    style={{
                      width: '4.75rem',
                      height: '4.75rem',
                      borderRadius: '9999px',
                      objectFit: 'cover',
                      border: `2px solid ${accentColor}`,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
                      margin: '0 auto',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: accentColor,
                      fontWeight: 800,
                      display: 'block',
                      marginTop: '0.4rem',
                    }}
                  >
                    {isRtl ? 'العريس' : 'The Groom'}
                  </span>
                  {groomParents && (
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#E6DCBF',
                        marginTop: '0.2rem',
                        fontWeight: 600,
                        maxWidth: '9.5rem',
                      }}
                    >
                      {groomParents}
                    </p>
                  )}
                </div>
              )}

              <span
                style={{
                  color: accentColor,
                  fontSize: '1.75rem',
                  fontWeight: 300,
                  opacity: 0.8,
                }}
              >
                &
              </span>

              {brideAvatarUrl && (
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={brideAvatarUrl}
                    alt={brideName}
                    style={{
                      width: '4.75rem',
                      height: '4.75rem',
                      borderRadius: '9999px',
                      objectFit: 'cover',
                      border: `2px solid ${accentColor}`,
                      boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
                      margin: '0 auto',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: accentColor,
                      fontWeight: 800,
                      display: 'block',
                      marginTop: '0.4rem',
                    }}
                  >
                    {isRtl ? 'العروس' : 'The Bride'}
                  </span>
                  {brideParents && (
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#E6DCBF',
                        marginTop: '0.2rem',
                        fontWeight: 600,
                        maxWidth: '9.5rem',
                      }}
                    >
                      {brideParents}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Invitation Message */}
          <p
            className="frida-invitation-text text-sm sm:text-base md:text-lg font-medium"
            style={{
              color: '#FBF5E8',
              lineHeight: 1.8,
              textShadow: '0 2px 12px rgba(0,0,0,0.9)',
            }}
          >
            {customMessage ||
              (isRtl
                ? 'يسعدنا ويشرفنا دعوتكم لمشاركتنا فرحة العمر وأسعد اللحظات'
                : 'Cordially invite you to celebrate our sacred union')}
          </p>

          {/* Date & Time Row (Crisp, High Contrast Gold Badge) */}
          {(eventDate || eventTime) && (
            <div
              className="frida-detail-row"
              style={{
                justifyContent: 'center',
                marginTop: '1rem',
                gap: '0.75rem',
              }}
            >
              {eventDate && (
                <span
                  style={{
                    color: accentColor,
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                  }}
                >
                  {eventDate}
                </span>
              )}
              {eventDate && eventTime && (
                <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0.4rem' }}>
                  ·
                </span>
              )}
              {eventTime && (
                <span style={{ color: '#FFFDF7', fontSize: '1rem', fontWeight: 700 }}>
                  {eventTime}
                </span>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {isRevealed && (
        <div className="frida-scroll-hint">
          <span>{isRtl ? 'اكتشف المزيد' : 'Scroll'}</span>
          <div className="frida-scroll-line" />
        </div>
      )}
    </section>
  );
};
