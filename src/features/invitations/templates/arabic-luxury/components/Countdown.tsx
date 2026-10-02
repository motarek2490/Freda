import React from 'react';
import { motion } from 'motion/react';

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isRtl: boolean;
  accentColor: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  days,
  hours,
  minutes,
  seconds,
  isRtl,
  accentColor,
}) => {
  const units = [
    { value: days, labelAr: 'يوم', labelEn: 'Days' },
    { value: hours, labelAr: 'ساعة', labelEn: 'Hours' },
    { value: minutes, labelAr: 'دقيقة', labelEn: 'Mins' },
    { value: seconds, labelAr: 'ثانية', labelEn: 'Secs' },
  ];

  return (
    <div className="frida-countdown" dir="ltr">
      {units.map((unit, idx) => (
        <div key={idx} className="frida-countdown-unit">
          <motion.span
            className="frida-countdown-number"
            key={unit.value}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ color: accentColor }}
          >
            {String(unit.value).padStart(2, '0')}
          </motion.span>
          <span className="frida-countdown-label">
            {isRtl ? unit.labelAr : unit.labelEn}
          </span>
        </div>
      ))}
    </div>
  );
};
