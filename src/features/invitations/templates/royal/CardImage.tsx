import React, { useRef } from 'react';
import { Crown } from 'lucide-react';
import { TemplateCardImageProps } from '../../model/templateContract';

export const RoyalCardImage: React.FC<TemplateCardImageProps> = ({
  invitation,
  currentLang = 'ar',
  qrDataUrl,
}) => {
  const isRtl = currentLang === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);

  const colors = invitation.customColors || {
    bg: '#171717',
    cardBg: '#1F1E1B',
    text: '#F7F4EE',
    accent: '#B99A65',
  };

  const bg = colors.bg || '#171717';
  const cardBg = colors.cardBg || '#1F1E1B';
  const accent = colors.accent || '#B99A65';
  const text = colors.text || '#F7F4EE';

  return (
    <div
      ref={cardRef}
      className="relative border-4 border-double rounded-2xl p-7 sm:p-9 text-center shadow-2xl space-y-6 overflow-hidden font-playfair select-none"
      style={{
        background: `linear-gradient(145deg, ${cardBg} 0%, ${bg} 100%)`,
        borderColor: accent,
        color: text,
      }}
    >
      {/* Royal Corner Ornaments */}
      <div className="absolute top-2.5 left-2.5 w-7 h-7 pointer-events-none" style={{ color: accent }}>
        <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
          <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
        </svg>
      </div>
      <div className="absolute top-2.5 right-2.5 w-7 h-7 pointer-events-none scale-x-[-1]" style={{ color: accent }}>
        <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
          <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
        </svg>
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-7 h-7 pointer-events-none scale-y-[-1]" style={{ color: accent }}>
        <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
          <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
        </svg>
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-7 h-7 pointer-events-none scale-[-1]" style={{ color: accent }}>
        <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
          <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
        </svg>
      </div>

      <div className="space-y-2 relative z-10">
        <Crown className="w-8 h-8 mx-auto" style={{ color: accent }} />
        <span className="text-[11px] tracking-[0.3em] uppercase font-bold block" style={{ color: accent }}>
          {isRtl ? 'بسم الله الرحمن الرحيم' : 'IN THE NAME OF GOD'}
        </span>
        <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: `${accent}60` }} />
        <p className="text-xs font-light pt-2" style={{ color: text, opacity: 0.85 }}>
          {isRtl ? 'تتشرف عائلة' : 'The families of'}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: accent }}>
          {invitation.eventDetails.hostNames}
        </h2>
        <p className="text-xs" style={{ color: text, opacity: 0.75 }}>
          {isRtl ? 'بدعوتكم لمشاركتهم فرحتهم الكبرى بمناسبة' : 'request the pleasure of your company to celebrate'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold py-1" style={{ color: text }}>
          {invitation.eventDetails.eventTitle}
        </h1>
      </div>

      <div
        className="py-4 border-y grid grid-cols-2 gap-4 text-xs relative z-10"
        style={{ borderColor: `${accent}40` }}
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
