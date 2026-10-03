import React from 'react';
import { TemplateCardImageProps } from '../../model/templateContract';

/** Static stationery card for WhatsApp/PDF export. Inline styles only, so image capture is reliable. */
export const SunlitGardenCardImage: React.FC<TemplateCardImageProps> = ({ invitation, currentLang = 'ar', qrDataUrl }) => {
  const isRtl = currentLang === 'ar';
  const d = invitation.eventDetails;
  const serif = isRtl ? "'Amiri', serif" : "'Cormorant Garamond', serif";
  const sans = isRtl ? "'Amiri', serif" : "'Jost', sans-serif";
  const line = '1px solid rgba(58,48,42,0.18)';
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{
      position: 'relative', width: '100%', maxWidth: 460, margin: '0 auto', padding: '2.5rem 2rem', textAlign: 'center',
      overflow: 'hidden', borderRadius: 24, color: '#3A302A', fontFamily: serif,
      background: 'radial-gradient(circle at 15% 0%, #F6D98B77, transparent 50%), radial-gradient(circle at 100% 100%, #F4B7A377, transparent 50%), #FFF9F0',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden
        style={{ position: 'absolute', inset: 0, opacity: 0.5, pointerEvents: 'none' }}>
        <path d="M-10 120 C100 60 200 190 410 110" fill="none" stroke="#D8BC8A" strokeWidth="1.2" />
        <path d="M-10 135 C100 75 200 205 410 125" fill="none" stroke="#F4B7A3" strokeWidth="1.2" />
        <circle cx="352" cy="64" r="22" fill="#E9A6A6" opacity="0.5" />
        <circle cx="352" cy="64" r="5" fill="#F6D98B" />
        <circle cx="48" cy="540" r="16" fill="#CFC2DF" opacity="0.6" />
        <circle cx="48" cy="540" r="4" fill="#F6D98B" />
      </svg>
      <div style={{ position: 'relative' }}>
        <p style={{ margin: 0, fontFamily: sans, fontSize: 13, opacity: 0.7 }}>
          {d.hostNames || (isRtl ? 'بصحبة عائلتينا الكريمتين' : 'Together with their families')}
        </p>
        <h2 style={{ margin: '1.5rem 0', fontWeight: 400, fontSize: 52, lineHeight: isRtl ? 1.35 : 1.05 }}>
          {d.groomName || (isRtl ? 'أحمد' : 'Ahmed')}
          <span style={{ display: 'block', fontStyle: 'italic', fontSize: 26, color: '#D8BC8A' }}>&amp;</span>
          {d.brideName || (isRtl ? 'ليلى' : 'Layla')}
        </h2>
        <p style={{ margin: 0, fontSize: 18 }}>{isRtl ? 'ندعوكم لحضور حفل زفافنا' : 'invite you to celebrate their wedding'}</p>
        <div style={{ margin: '1.75rem 0', padding: '1rem 0', borderTop: line, borderBottom: line, fontSize: 20, lineHeight: 1.6 }}>
          <div>{d.eventDate}</div>
          <div>{d.eventTime}</div>
          <div style={{ fontFamily: sans, fontSize: 14, opacity: 0.75 }}>{d.venueName}</div>
        </div>
        {qrDataUrl && (
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <img src={qrDataUrl} alt="QR" width={84} height={84} style={{ background: '#fff', padding: 6, borderRadius: 12 }} />
            <span style={{ fontFamily: sans, fontSize: 12, opacity: 0.75 }}>
              {isRtl ? 'امسح الرمز لتأكيد الحضور وموقع الحفل' : 'Scan for RSVP & location'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SunlitGardenCardImage;
