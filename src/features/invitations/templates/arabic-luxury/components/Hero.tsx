import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  groomName: string;
  brideName: string;
  eventTitle?: string;
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
  isRevealed: boolean;
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
  groomParents,
  brideParents,
  groomAvatarUrl,
  brideAvatarUrl,
  isRevealed,
}) => {
  const coupleDisplay = `${groomName || ''} & ${brideName || ''}`;
  const hasAvatars = groomAvatarUrl || brideAvatarUrl;

  return (
    <section className="frida-hero" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="frida-hero-overlay">
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center space-y-4 pt-2"
            >
              {/* Basmalah & Quranic Verse (Luminous Gold & White) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-center space-y-1 mb-1"
              >
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
                  className="text-xs sm:text-sm font-serif leading-relaxed text-[#FFFDF7] font-medium max-w-lg mx-auto"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.85)' }}
                >
                  "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
                </p>
              </motion.div>

              {hostNames && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.8 }}
                  className="text-center"
                >
                  <p className="frida-eyebrow text-xs sm:text-sm font-bold tracking-widest" style={{ color: accentColor }}>
                    {isRtl ? 'بدعوة كريمة ومباركة من' : 'Together with their families'}
                  </p>
                  <p
                    className="text-lg sm:text-2xl font-bold text-[#FFFDF7]"
                    style={{
                      fontFamily: isRtl ? "'Amiri', serif" : "'Playfair Display', serif",
                      textShadow: '0 2px 15px rgba(0,0,0,0.9)',
                    }}
                  >
                    {hostNames}
                  </p>
                </motion.div>
              )}

              <motion.h1
                className={`frida-couple-names ${isRtl ? 'frida-couple-names-ar' : ''}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  color: '#FFFDF7',
                  textShadow: `0 4px 28px rgba(0,0,0,0.95), 0 0 35px ${accentColor}40`,
                }}
              >
                {coupleDisplay}
              </motion.h1>

              {hasAvatars && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex items-center gap-4 my-2"
                >
                  {groomAvatarUrl && (
                    <div className="text-center">
                      <img
                        src={groomAvatarUrl}
                        alt={groomName}
                        className="w-16 h-16 rounded-full object-cover border-2 shadow-lg"
                        style={{ borderColor: accentColor }}
                      />
                      <span className="text-[11px] font-bold block mt-1 uppercase tracking-wider" style={{ color: accentColor }}>
                        {isRtl ? 'العريس' : 'The Groom'}
                      </span>
                      {groomParents && <p className="text-[10px] text-[#D7B58A] mt-0.5 italic max-w-[6.5rem]">{groomParents}</p>}
                    </div>
                  )}
                  <span className="text-xl font-light opacity-60" style={{ color: accentColor }}>&</span>
                  {brideAvatarUrl && (
                    <div className="text-center">
                      <img
                        src={brideAvatarUrl}
                        alt={brideName}
                        className="w-16 h-16 rounded-full object-cover border-2 shadow-lg"
                        style={{ borderColor: accentColor }}
                      />
                      <span className="text-[11px] font-bold block mt-1 uppercase tracking-wider" style={{ color: accentColor }}>
                        {isRtl ? 'العروس' : 'The Bride'}
                      </span>
                      {brideParents && <p className="text-[10px] text-[#D7B58A] mt-0.5 italic max-w-[6.5rem]">{brideParents}</p>}
                    </div>
                  )}
                </motion.div>
              )}

              <motion.p
                className="frida-invitation-text text-sm sm:text-base md:text-lg font-medium"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
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
              </motion.p>

              {(eventDate || eventTime) && (
                <motion.div
                  className="frida-detail-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  style={{ gap: '0.75rem', marginTop: '0.5rem' }}
                >
                  {eventDate && (
                    <span className="font-bold text-base" style={{ color: accentColor }}>
                      {eventDate}
                    </span>
                  )}
                  {eventDate && eventTime && <span className="text-[#F7F1E8]/40">•</span>}
                  {eventTime && <span className="text-[#FFFDF7] font-semibold text-base">{eventTime}</span>}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
