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
    { label: isRtl ? 'يوم' : 'Days', val: days },
    { label: isRtl ? 'ساعة' : 'Hours', val: hours },
    { label: isRtl ? 'دقيقة' : 'Mins', val: minutes },
    { label: isRtl ? 'ثانية' : 'Secs', val: seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center" dir="ltr">
      {units.map((unit, idx) => (
        <div key={idx} className="p-3.5 rounded-2xl bg-black/25 border border-white/5 shadow-inner">
          <motion.span
            key={unit.val}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="block text-2xl sm:text-3xl font-bold font-mono"
            style={{ color: accentColor }}
          >
            {String(unit.val).padStart(2, '0')}
          </motion.span>
          <span className="text-[10px] tracking-wider uppercase opacity-70 block mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
};
