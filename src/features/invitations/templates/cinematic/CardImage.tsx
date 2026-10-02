import React, { useRef } from 'react';
import { Film } from 'lucide-react';
import { TemplateCardImageProps } from '../../model/templateContract';

export const CinematicCardImage: React.FC<TemplateCardImageProps> = ({
  invitation,
  currentLang = 'ar',
  qrDataUrl,
}) => {
  const isRtl = currentLang === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);

  const colors = invitation.customColors || {
    bg: '#0F0E0D',
    cardBg: '#1A1816',
    text: '#F5EFEB',
    accent: '#D4AF37',
  };

  const bg = colors.bg || '#0F0E0D';
  const cardBg = colors.cardBg || '#1A1816';
  const accent = colors.accent || '#D4AF37';
  const text = colors.text || '#F5EFEB';

  return (
    <div
      ref={cardRef}
      className="relative border border-[#D4AF37]/50 rounded-2xl p-7 sm:p-9 text-center shadow-2xl space-y-6 overflow-hidden font-serif select-none"
      style={{
        background: `linear-gradient(160deg, ${cardBg} 0%, ${bg} 100%)`,
        color: text,
      }}
    >
      {/* Cinematic Film Frame Lines */}
      <div className="absolute inset-2 border border-[#D4AF37]/20 pointer-events-none rounded-xl" />
      
      <div className="space-y-2 relative z-10">
        <Film className="w-7 h-7 mx-auto text-[#D4AF37] opacity-80" />
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold block text-[#D4AF37]">
          {isRtl ? 'عرض سينمائي خاص' : 'A CINEMATIC PREMIERE'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold py-1 tracking-wide" style={{ color: text }}>
          <span>{invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom')}</span>
          <span className="text-[#D4AF37] px-2">&</span>
          <span>{invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride')}</span>
        </h1>
        <p className="text-xs font-light" style={{ color: text, opacity: 0.75 }}>
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
          <span className="text-[11px] font-semibold text-[#D4AF37]">
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
        <div className="p-2 bg-white rounded-xl shadow-md inline-block border-2 border-[#D4AF37]">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 object-contain" />
          ) : (
            <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />
          )}
        </div>
        <span className="text-[10px] font-semibold text-[#D4AF37]">
          {isRtl ? 'امسح الرمز لتأكيد الحضور (RSVP)' : 'Scan QR for RSVP'}
        </span>
      </div>
    </div>
  );
};
