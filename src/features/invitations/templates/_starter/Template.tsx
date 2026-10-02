import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Heart, Sparkles } from 'lucide-react';
import { InvitationTemplateProps } from '../../model/templateContract';

export const StarterTemplate: React.FC<InvitationTemplateProps> = ({
  invitation,
  lang,
  isRtl,
  t,
  customColors,
  timeLeft,
  onOpenRsvp,
  getGoogleCalendarUrl,
}) => {
  const details = invitation.eventDetails;

  return (
    <div className="starter-template-container w-full max-w-2xl mx-auto space-y-12">
      {/* Hero Header */}
      <div
        className="p-8 sm:p-12 rounded-3xl text-center space-y-6 border shadow-2xl relative overflow-hidden"
        style={{
          backgroundColor: customColors.cardBg,
          borderColor: `${customColors.accent}40`,
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border"
               style={{ color: customColors.accent, borderColor: `${customColors.accent}60` }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{details.eventTitle || 'Wedding Celebration'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight"
              style={{ color: customColors.text }}>
            {details.groomName && details.brideName
              ? `${details.groomName} & ${details.brideName}`
              : details.eventTitle}
          </h1>

          <p className="text-sm sm:text-base opacity-80 max-w-md mx-auto leading-relaxed">
            {details.mainMessage || details.customMessage || (isRtl ? 'يسعدنا ويشرفنا دعوتكم لحضور حفلنا ومشاركتنا أجمل اللحظات' : 'We are honored to invite you to celebrate with us.')}
          </p>
        </motion.div>

        {/* Date & Time Badge */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t" style={{ borderColor: `${customColors.accent}20` }}>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Calendar className="w-4 h-4" style={{ color: customColors.accent }} />
            <span>{details.eventDate}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock className="w-4 h-4" style={{ color: customColors.accent }} />
            <span>{details.eventTime}</span>
          </div>
        </div>
      </div>

      {/* Countdown Section */}
      <div
        className="p-6 rounded-2xl border text-center space-y-4"
        style={{ backgroundColor: customColors.cardBg, borderColor: `${customColors.accent}30` }}
      >
        <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: customColors.accent }}>
          {isRtl ? 'العد التنازلي للحفل' : 'Countdown to Celebration'}
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: isRtl ? 'يوم' : 'Days', value: timeLeft.days },
            { label: isRtl ? 'ساعة' : 'Hours', value: timeLeft.hours },
            { label: isRtl ? 'دقيقة' : 'Mins', value: timeLeft.minutes },
            { label: isRtl ? 'ثانية' : 'Secs', value: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-black/30 border border-white/5">
              <span className="block text-2xl font-bold font-mono" style={{ color: customColors.accent }}>
                {item.value}
              </span>
              <span className="text-[10px] opacity-70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action RSVP Button */}
      <div className="text-center pt-4">
        <button
          onClick={onOpenRsvp}
          className="w-full max-w-sm py-4 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
          style={{
            backgroundColor: customColors.accent,
            color: '#171717',
          }}
        >
          {isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Attendance (RSVP)'}
        </button>
      </div>
    </div>
  );
};

export default StarterTemplate;
