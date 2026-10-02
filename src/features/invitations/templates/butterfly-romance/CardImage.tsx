import React, { useRef } from 'react';
import { TemplateCardImageProps } from '../../model/templateContract';

export const ButterflyCardImage: React.FC<TemplateCardImageProps> = ({
  invitation,
  currentLang = 'ar',
  qrDataUrl,
}) => {
  const isRtl = currentLang === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);

  const colors = invitation.customColors || {
    bg: '#FAF7F2',
    cardBg: '#FFFFFF',
    text: '#2B2625',
    accent: '#7A1F35',
  };

  const bg = colors.bg || '#FAF7F2';
  const cardBg = colors.cardBg || '#FFFFFF';
  const accent = colors.accent || '#7A1F35';
  const text = colors.text || '#2B2625';

  return (
    <div
      ref={cardRef}
      className="relative border-2 rounded-2xl p-7 sm:p-9 text-center shadow-xl space-y-6 overflow-hidden font-serif select-none"
      style={{
        backgroundColor: cardBg,
        borderColor: `${accent}40`,
        color: text,
      }}
    >
      {/* Botanical Corner Filigree with Butterfly Accent */}
      <div className="absolute top-2 left-2 text-rose-500 opacity-80 text-sm">🦋</div>
      <div className="absolute top-2 right-2 text-rose-500 opacity-80 text-sm">🦋</div>
      <div className="absolute bottom-2 left-2 text-rose-500 opacity-80 text-sm">🌸</div>
      <div className="absolute bottom-2 right-2 text-rose-500 opacity-80 text-sm">🌸</div>

      <div className="space-y-2 relative z-10">
        <span className="text-[11px] tracking-[0.25em] uppercase font-bold block" style={{ color: accent }}>
          {isRtl ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'IN THE NAME OF GOD'}
        </span>
        <p className="text-xs font-light pt-2" style={{ color: text, opacity: 0.85 }}>
          {isRtl ? 'تتشرف عائلاتنا بدعوتكم لحضور حفل زفاف' : 'Cordially invite you to celebrate the wedding of'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold py-1" style={{ color: accent }}>
          <span>{invitation.eventDetails.groomName || (isRtl ? 'كريم' : 'Groom')}</span>
          <span className="px-2 font-light text-[#2B2625]">&</span>
          <span>{invitation.eventDetails.brideName || (isRtl ? 'فريدة' : 'Bride')}</span>
        </h1>
        <p className="text-xs font-medium" style={{ color: text, opacity: 0.75 }}>
          {invitation.eventDetails.eventTitle}
        </p>
      </div>

      <div
        className="py-4 border-y grid grid-cols-2 gap-4 text-xs relative z-10"
        style={{ borderColor: `${accent}30` }}
      >
        <div>
          <span className="text-[10px] uppercase block" style={{ color: text, opacity: 0.7 }}>
            {isRtl ? 'الموعد' : 'Date'}
          </span>
          <strong className="block font-semibold text-sm" style={{ color: text }}>
            {invitation.eventDetails.eventDate}
          </strong>
          <span className="text-[11px] font-semibold" style={{ color: accent }}>
            {invitation.eventDetails.eventTime}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase block" style={{ color: text, opacity: 0.7 }}>
            {isRtl ? 'المكان' : 'Venue'}
          </span>
          <strong className="block font-semibold text-sm line-clamp-1" style={{ color: text }}>
            {invitation.eventDetails.venueName}
          </strong>
          <span className="text-[11px] line-clamp-1" style={{ color: text, opacity: 0.8 }}>
            {invitation.eventDetails.address}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-1 relative z-10">
        <div className="p-2 bg-white rounded-xl shadow-md inline-block border-2" style={{ borderColor: accent }}>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 object-contain" />
          ) : (
            <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />
          )}
        </div>
        <span className="text-[10px] font-semibold" style={{ color: accent }}>
          {isRtl ? 'امسح الرمز لتأكيد الحضور (RSVP)' : 'Scan QR for RSVP & Google Maps'}
        </span>
      </div>
    </div>
  );
};
