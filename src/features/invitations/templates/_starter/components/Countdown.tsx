import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props { days: number; hours: number; minutes: number; seconds: number; isRtl: boolean; calendarUrl: string }
const WASH = ['#F6D98B', '#F4B7A3', '#C8D7B2', '#B9D6E8'];

export const Countdown: React.FC<Props> = ({ days, hours, minutes, seconds, isRtl, calendarUrl }) => {
  const u = [
    [isRtl ? 'يوم' : 'days', days], [isRtl ? 'ساعة' : 'hours', hours],
    [isRtl ? 'دقيقة' : 'minutes', minutes], [isRtl ? 'ثانية' : 'seconds', seconds],
  ] as const;
  return (
    <section className="sg-section">
      <div className="sg-index"><span>03</span><span>{isRtl ? 'اليوم الموعود' : 'The Day'}</span></div>
      <div className="sg-count" dir="ltr">
        {u.map(([label, v], i) => (
          <div className="sg-unit" key={label}>
            <span className="sg-wash" style={{ background: WASH[i], opacity: i % 2 ? 0.28 : 0.4 }} />
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v} className="sg-num" initial={{ y: 12, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.4 }}>
                {String(v).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="sg-small">{label}</span>
          </div>
        ))}
      </div>
      <a className="sg-link" href={calendarUrl} target="_blank" rel="noopener noreferrer">
        {isRtl ? 'احفظ الموعد في التقويم' : 'Save the date to your calendar'}
      </a>
    </section>
  );
};
