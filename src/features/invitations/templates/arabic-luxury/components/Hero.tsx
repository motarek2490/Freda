import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Clock } from 'lucide-react';
import { RomanticCanvas } from '../canvas/RomanticCanvas';
import { formatTime12Hour } from '../../../../../lib/dateUtils';

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
}) => {
  const coupleDisplay =
    groomName && brideName ? `${groomName} & ${brideName}` : eventTitle;

  return (
    <section className="frida-hero" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Living Canvas Background Layer */}
      <RomanticCanvas
        accentColor={accentColor}
        onReveal={() => {}}
        interactive
      />

      {/* Overlay Content */}
      <div className="frida-hero-overlay space-y-6 w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          {/* Traditional Basmalah & Quranic Verse */}
          <div className="text-center space-y-2 pt-2">
            <div
              className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border text-xs font-serif tracking-widest shadow-sm"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}12`,
                color: accentColor,
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <p
              className="text-xs sm:text-sm font-serif leading-relaxed opacity-85 max-w-md mx-auto"
              style={{ color: '#E6DCBF' }}
            >
              "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
            </p>
          </div>

          {/* Host Families Formal Greeting */}
          {hostNames && (
            <div className="text-center">
              <span
                className="frida-eyebrow block"
                style={{ color: accentColor }}
              >
                {isRtl ? 'دعوة كريمة ومباركة من' : 'Cordially Invited By'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif" style={{ color: '#F7F1E8' }}>
                {hostNames}
              </h2>
            </div>
          )}

          {/* Couple Main Arch Card */}
          <div
            className="relative p-6 sm:p-10 rounded-3xl border text-center shadow-2xl backdrop-blur-md space-y-4"
            style={{
              backgroundColor: 'rgba(23, 20, 18, 0.85)',
              borderColor: `${accentColor}45`,
            }}
          >
            <div
              className="w-12 h-12 rounded-full mx-auto flex items-center justify-center border"
              style={{
                backgroundColor: `${accentColor}20`,
                borderColor: accentColor,
                color: accentColor,
              }}
            >
              <Sparkles className="w-6 h-6" />
            </div>

            <h1
              className={`frida-couple-names ${isRtl ? 'frida-couple-names-ar' : ''}`}
            >
              {coupleDisplay}
            </h1>

            <p className="frida-invitation-text">
              {customMessage}
            </p>

            {/* Date & Time Badge */}
            <div
              className="frida-detail-row"
              style={{ justifyContent: 'center', marginTop: '1.25rem' }}
            >
              <Calendar className="w-4 h-4" style={{ color: accentColor }} />
              <span style={{ color: accentColor, fontSize: '0.85rem', fontWeight: 600 }}>
                {eventDate}
              </span>
              {eventTime && (
                <>
                  <span style={{ color: 'rgba(247,241,232,0.3)', margin: '0 0.5rem' }}>
                    •
                  </span>
                  <Clock className="w-4 h-4" style={{ color: accentColor }} />
                  <span style={{ color: '#F7F1E8', fontSize: '0.85rem' }}>
                    {formatTime12Hour(eventTime, isRtl)}
                  </span>
                </>
              )}
            </div>

            {/* Groom & Bride Pedigree Cards with Avatars */}
            {(groomName || brideName) && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t"
                style={{ borderColor: `${accentColor}25` }}
              >
                {groomName && (
                  <div
                    className="p-4 rounded-2xl border text-center space-y-1.5"
                    style={{
                      backgroundColor: 'rgba(17, 16, 15, 0.8)',
                      borderColor: `${accentColor}25`,
                    }}
                  >
                    <img
                      src={groomAvatarUrl || '/images/samples/groom_portrait.jpg'}
                      alt={groomName}
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 shadow-md"
                      style={{ borderColor: accentColor }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/samples/groom_portrait.jpg';
                      }}
                    />
                    <span className="text-[10px] uppercase tracking-widest font-bold block" style={{ color: accentColor }}>
                      {isRtl ? 'العريس' : 'The Groom'}
                    </span>
                    <h3 className="font-bold text-base" style={{ color: '#F7F1E8' }}>{groomName}</h3>
                    {groomParents && (
                      <p className="text-xs italic opacity-70">{groomParents}</p>
                    )}
                  </div>
                )}

                {brideName && (
                  <div
                    className="p-4 rounded-2xl border text-center space-y-1.5"
                    style={{
                      backgroundColor: 'rgba(17, 16, 15, 0.8)',
                      borderColor: `${accentColor}25`,
                    }}
                  >
                    <img
                      src={brideAvatarUrl || '/images/samples/bride_portrait.jpg'}
                      alt={brideName}
                      className="w-16 h-16 rounded-full mx-auto object-cover border-2 shadow-md"
                      style={{ borderColor: accentColor }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/samples/bride_portrait.jpg';
                      }}
                    />
                    <span className="text-[10px] uppercase tracking-widest font-bold block" style={{ color: accentColor }}>
                      {isRtl ? 'العروس' : 'The Bride'}
                    </span>
                    <h3 className="font-bold text-base" style={{ color: '#F7F1E8' }}>{brideName}</h3>
                    {brideParents && (
                      <p className="text-xs italic opacity-70">{brideParents}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
