import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RomanticCanvas } from '../canvas/RomanticCanvas';

interface HeroProps {
  groomName: string;
  brideName: string;
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
  isRevealed: boolean; // يتم تمريره من القالب الرئيسي
}

export const Hero: React.FC<HeroProps> = ({
  groomName, brideName, customMessage, eventDate, eventTime,
  isRtl, accentColor, hostNames, groomParents, brideParents,
  groomAvatarUrl, brideAvatarUrl, isRevealed
}) => {
  const coupleDisplay = `${groomName || ''} & ${brideName || ''}`;
  const hasAvatars = groomAvatarUrl || brideAvatarUrl;

  return (
    <section className="frida-hero" dir={isRtl ? 'rtl' : 'ltr'}>
      <RomanticCanvas accentColor={accentColor} onReveal={() => {}} interactive />
      
      <div className="frida-hero-overlay">
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col items-center"
            >
              {hostNames && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="text-center mb-4"
                >
                  <p className="frida-eyebrow">{isRtl ? 'بدعوة كريمة من' : 'Together with their families'}</p>
                  <p className="text-lg font-semibold text-[#F7F1E8]" style={{ fontFamily: isRtl ? "'Amiri', serif" : "'Playfair Display', serif" }}>
                    {hostNames}
                  </p>
                </motion.div>
              )}

              <motion.h1
                className={`frida-couple-names ${isRtl ? 'frida-couple-names-ar' : ''}`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {coupleDisplay}
              </motion.h1>

              {hasAvatars && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="flex items-center gap-4 mt-4"
                >
                  {groomAvatarUrl && (
                    <div className="text-center">
                      <img src={groomAvatarUrl} alt={groomName} className="w-16 h-16 rounded-full object-cover border-2 border-[#C9A46A]/60 shadow-lg" />
                      {groomParents && <p className="text-[10px] text-[#D7B58A] mt-1 italic max-w-[6rem]">{groomParents}</p>}
                    </div>
                  )}
                  <span className="text-[#C9A46A] text-xl font-light opacity-60">&</span>
                  {brideAvatarUrl && (
                    <div className="text-center">
                      <img src={brideAvatarUrl} alt={brideName} className="w-16 h-16 rounded-full object-cover border-2 border-[#C9A46A]/60 shadow-lg" />
                      {brideParents && <p className="text-[10px] text-[#D7B58A] mt-1 italic max-w-[6rem]">{brideParents}</p>}
                    </div>
                  )}
                </motion.div>
              )}

              <motion.p
                className="frida-invitation-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                {customMessage}
              </motion.p>

              {(eventDate || eventTime) && (
                <motion.div
                  className="frida-detail-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 1 }}
                >
                  {eventDate && <span className="font-semibold text-[#C9A46A]">{eventDate}</span>}
                  {eventDate && eventTime && <span className="mx-2 text-[#F7F1E8]/30">•</span>}
                  {eventTime && <span className="text-[#F7F1E8]/70">{eventTime}</span>}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
