import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RomanticCanvas } from '../canvas/RomanticCanvas';

interface HeroProps {
  groomName: string;
  brideName: string;
  eventTitle: string;
  customMessage: string;
  eventDate: string;
  eventTime: string;
  isRtl: boolean;
  accentColor: string;
  hostNames?: string;
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
  hostNames,
}) => {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = useCallback(() => {
    setRevealed(true);
  }, []);

  const coupleDisplay = isRtl
    ? `${groomName || ''} & ${brideName || ''}`
    : `${groomName || ''} & ${brideName || ''}`;

  return (
    <section className="frida-hero" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Living Canvas Background */}
      <RomanticCanvas
        accentColor={accentColor}
        onReveal={handleReveal}
        interactive
      />

      {/* Overlay Content */}
      <div className="frida-hero-overlay">
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="space-y-6"
            >
              {/* Eyebrow */}
              {hostNames && (
                <motion.p
                  className="frida-eyebrow"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 1.2 }}
                >
                  {isRtl ? 'بدعوة كريمة من' : 'Together with their families'}
                </motion.p>
              )}

              {/* Couple Names */}
              <motion.h1
                className={`frida-couple-names ${isRtl ? 'frida-couple-names-ar' : ''}`}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {coupleDisplay}
              </motion.h1>

              {/* Invitation Message */}
              <motion.p
                className="frida-invitation-text"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 1.2 }}
              >
                {customMessage ||
                  (isRtl
                    ? 'يسعدنا دعوتكم لمشاركتنا أجمل لحظات العمر'
                    : 'invite you to celebrate the beginning of their forever')}
              </motion.p>

              {/* Date & Time */}
              <motion.div
                className="frida-detail-row"
                style={{ justifyContent: 'center', marginTop: '1.5rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 1 }}
              >
                <span style={{ color: accentColor, fontSize: '0.75rem' }}>
                  {eventDate}
                </span>
                {eventTime && (
                  <>
                    <span style={{ color: 'rgba(247,241,232,0.2)', margin: '0 0.5rem' }}>
                      ·
                    </span>
                    <span style={{ color: 'rgba(247,241,232,0.5)', fontSize: '0.75rem' }}>
                      {eventTime}
                    </span>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="frida-scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <span>{isRtl ? 'اكتشف المزيد' : 'Scroll'}</span>
            <div className="frida-scroll-line" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
