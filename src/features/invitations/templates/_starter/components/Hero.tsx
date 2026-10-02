import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  groomName: string;
  brideName: string;
  eventTitle: string;
  customMessage: string;
  eventDate: string;
  eventTime: string;
  isRtl: boolean;
  accentColor: string;
  textColor: string;
  cardBgColor: string;
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
  textColor,
  cardBgColor,
  hostNames,
}) => {
  const coupleDisplay = groomName && brideName ? `${groomName} & ${brideName}` : eventTitle;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="p-8 sm:p-12 rounded-3xl text-center space-y-6 border shadow-2xl relative overflow-hidden"
      style={{
        backgroundColor: cardBgColor,
        borderColor: `${accentColor}30`,
        color: textColor,
      }}
    >
      {hostNames && (
        <span className="text-[11px] font-semibold tracking-widest uppercase opacity-70 block" style={{ color: accentColor }}>
          {isRtl ? 'بدعوة كريمة من' : 'Cordially Invited By'} {hostNames}
        </span>
      )}

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border"
           style={{ color: accentColor, borderColor: `${accentColor}50` }}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>{eventTitle || (isRtl ? 'حفل زفاف مبارك' : 'Wedding Celebration')}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight" style={{ color: textColor }}>
        {coupleDisplay}
      </h1>

      <p className="text-sm sm:text-base opacity-80 max-w-md mx-auto leading-relaxed">
        {customMessage || (isRtl ? 'يسعدنا ويشرفنا دعوتكم لحضور حفلنا ومشاركتنا أجمل اللحظات' : 'We invite you to celebrate our special day with us.')}
      </p>

      <div className="flex items-center justify-center gap-3 pt-4 border-t text-xs opacity-75" style={{ borderColor: `${accentColor}20` }}>
        <span>{eventDate}</span>
        <span>•</span>
        <span>{eventTime}</span>
      </div>
    </motion.section>
  );
};
