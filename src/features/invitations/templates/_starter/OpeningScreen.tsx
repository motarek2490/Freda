import React from 'react';
import { motion } from 'motion/react';
import { TemplateOpeningScreenProps } from '../../model/templateContract';

/** Ivory paper with a soft sunrise glow; one tap opens the invitation. */
export const SunlitGardenOpeningScreen: React.FC<TemplateOpeningScreenProps> = ({
  invitation, guestNameParam, isRtl, onComplete, shouldReduceMotion,
}) => {
  const d = invitation.eventDetails;
  const groom = d.groomName || (isRtl ? 'أحمد' : 'Ahmed');
  const bride = d.brideName || (isRtl ? 'ليلى' : 'Layla');
  const serif = isRtl ? "'Amiri', serif" : "'Cormorant Garamond', serif";
  const sans = isRtl ? "'Amiri', serif" : "'Jost', sans-serif";
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 10, filter: shouldReduceMotion ? 'none' : 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: shouldReduceMotion ? 0.3 : 1.2, delay: shouldReduceMotion ? 0 : delay },
  });

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{
      position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center', padding: '1.5rem',
      color: '#3A302A', fontFamily: serif, overflow: 'hidden',
      background: 'radial-gradient(ellipse at 30% 10%, #F6D98B66, transparent 55%), radial-gradient(ellipse at 80% 90%, #F4B7A355, transparent 55%), #FFF9F0',
    }}>
      {guestNameParam && (
        <motion.p {...fade(0.2)} style={{ margin: 0, fontFamily: sans, fontSize: '0.95rem', opacity: 0.75 }}>
          {isRtl ? `إلى ${guestNameParam}` : `For ${guestNameParam}`}
        </motion.p>
      )}
      <motion.h1 {...fade(0.6)} style={{ margin: 0, fontWeight: 400, fontSize: 'clamp(3rem,14vw,5.5rem)', lineHeight: isRtl ? 1.3 : 1 }}>
        {groom}
        <span style={{ display: 'block', fontStyle: 'italic', fontSize: '0.4em', color: '#D8BC8A' }}>&amp;</span>
        {bride}
      </motion.h1>
      <motion.button {...fade(1.4)} type="button" onClick={onComplete}
        style={{ marginTop: '1rem', minHeight: 52, padding: '0.9rem 2.6rem', border: 0, borderRadius: 999, cursor: 'pointer',
          fontFamily: sans, fontSize: isRtl ? '1.05rem' : '0.9rem', letterSpacing: isRtl ? 0 : '0.08em', color: '#3A302A',
          background: 'linear-gradient(135deg,#F4B7A3,#D8BC8A)', boxShadow: '0 14px 34px -14px rgba(216,150,120,.8)' }}>
        {isRtl ? 'افتح الدعوة' : 'Open the invitation'}
      </motion.button>
    </div>
  );
};

export default SunlitGardenOpeningScreen;
