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
  groomParents?: string;
  brideParents?: string;
  groomAvatarUrl?: string;
  brideAvatarUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({
  groomName, brideName, eventTitle, customMessage, eventDate, eventTime,
  isRtl, accentColor, hostNames, groomParents, brideParents, groomAvatarUrl, brideAvatarUrl
}) => {
  const [revealed, setRevealed] = useState(false);
  const handleReveal = useCallback(() => setRevealed(true), []);
  const coupleDisplay = `${groomName || ''} & ${brideName || ''}`;
  const hasAvatars = groomAvatarUrl || brideAvatarUrl;

  return (
    <section className="frida-hero" dir={isRtl ? 'rtl' : 'ltr'}>
      <RomanticCanvas accentColor={accentColor} onReveal={handleReveal} interactive />
      
      <div className="frida-hero-overlay">
        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
              {hostNames && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.2 }}>
                  <p className="frida-eyebrow">{isRtl ? 'بدعوة كريمة من' : 'Together with their families'}</p>
                  <p style={{ fontSize: '1rem', color: '#F7F1E8', fontWeight: 600, marginTop: '0.5rem', fontFamily: isRtl ? "'Amiri', serif" : "'Playfair Display', serif" }}>
                    {hostNames}
                  </p>
                </motion.div>
              )}

              <motion.h1 className={`frida-couple-names ${isRtl ? 'frida-couple-names-ar' : ''}`}
                initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.6, duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                {coupleDisplay}
              </motion.h1>

              {hasAvatars && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 1.2 }}
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                  {groomAvatarUrl && (
                    <div style={{ textAlign: 'center' }}>
                      <img src={groomAvatarUrl} alt={groomName} style={{ width: '4rem', height: '4rem', borderRadius: '9999px', objectFit: 'cover', border: `2px solid ${accentColor}60`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} />
                      {groomParents && <p style={{ fontSize: '0.65rem', color: '#D7B58A', marginTop: '0.4rem', fontStyle: 'italic', maxWidth: '7rem' }}>{groomParents}</p>}
                    </div>
                  )}
                  <span style={{ color: accentColor, fontSize: '1.2rem', fontWeight: 300, opacity: 0.5 }}>&</span>
                  {brideAvatarUrl && (
                    <div style={{ textAlign: 'center' }}>
                      <img src={brideAvatarUrl} alt={brideName} style={{ width: '4rem', height: '4rem', borderRadius: '9999px', objectFit: 'cover', border: `2px solid ${accentColor}60`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} />
                      {brideParents && <p style={{ fontSize: '0.65rem', color: '#D7B58A', marginTop: '0.4rem', fontStyle: 'italic', maxWidth: '7rem' }}>{brideParents}</p>}
                    </div>
                  )}
                </motion.div>
              )}

              <motion.p className="frida-invitation-text" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 1.2 }}>
                {customMessage || (isRtl ? 'يسعدنا ويشرفنا دعوتكم لمشاركتنا فرحة العمر' : 'Cordially invite you to celebrate our union')}
              </motion.p>

              {(eventDate || eventTime) && (
                <motion.div className="frida-detail-row" style={{ justifyContent: 'center', marginTop: '1.5rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}>
                  {eventDate && <span style={{ color: accentColor, fontSize: '0.85rem', fontWeight: 600 }}>{eventDate}</span>}
                  {eventDate && eventTime && <span style={{ color: 'rgba(247,241,232,0.2)', margin: '0 0.6rem' }}>·</span>}
                  {eventTime && <span style={{ color: 'rgba(247,241,232,0.6)', fontSize: '0.85rem' }}>{eventTime}</span>}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div className="frida-scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2.5, duration: 1 }}>
            <span>{isRtl ? 'اكتشف المزيد' : 'Scroll'}</span>
            <div className="frida-scroll-line" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
