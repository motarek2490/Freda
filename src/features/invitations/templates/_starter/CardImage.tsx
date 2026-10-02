import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { TemplateCardImageProps } from '../../model/templateContract';

/**
 * Starter / Scaffold Printable & Shareable Card Image component for new templates.
 */
export const StarterCardImage: React.FC<TemplateCardImageProps> = ({
  invitation,
  currentLang = 'ar',
  qrDataUrl,
}) => {
  const isRtl = currentLang === 'ar';
  const colors = invitation.customColors || {
    bg: '#171717',
    cardBg: '#1F1E1B',
    text: '#F7F4EE',
    accent: '#B99A65',
  };
  const accent = colors.accent || '#B99A65';

  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative w-full max-w-[460px] mx-auto rounded-3xl p-6 sm:p-8 text-center select-none overflow-hidden shadow-2xl border"
      style={{
        backgroundColor: colors.cardBg || '#1F1E1B',
        borderColor: `${accent}60`,
        color: colors.text || '#F7F4EE',
      }}
    >
      {/* Decorative Border Corner Inset */}
      <div
        className="absolute inset-2 rounded-2xl border pointer-events-none opacity-40"
        style={{ borderColor: accent }}
      />

      {/* Header Emblem */}
      <div className="flex justify-center mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center border shadow-md"
          style={{
            borderColor: accent,
            backgroundColor: `${accent}15`,
            color: accent,
          }}
        >
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Host Announcement */}
      <p className="text-xs font-semibold opacity-80 mb-2">
        {invitation.eventDetails.hostNames || (isRtl ? 'يتشرف الداعون بدعوتكم لحضور حفل الزفاف' : 'Cordially invite you to celebrate')}
      </p>

      {/* Names */}
      <div className="py-2 my-2 border-y border-[#B99A65]/20">
        <h2 className="font-playfair text-2xl sm:text-3xl font-bold tracking-wide">
          {groom} <span style={{ color: accent }}>&</span> {bride}
        </h2>
      </div>

      {/* Event Details */}
      <div className="my-4 space-y-1 text-xs opacity-90">
        <p className="font-bold text-sm" style={{ color: accent }}>
          {invitation.eventDetails.eventTitle || (isRtl ? 'حفل الزفاف المبارك' : 'Wedding Celebration')}
        </p>
        <p>{invitation.eventDetails.eventDate}</p>
        <p>{invitation.eventDetails.eventTime}</p>
        <p className="opacity-80">{invitation.eventDetails.venueName}</p>
      </div>

      {/* QR Code */}
      {qrDataUrl && (
        <div className="pt-3 border-t border-[#B99A65]/20 flex flex-col items-center gap-1.5">
          <div className="p-1.5 bg-white rounded-xl shadow-md">
            <img src={qrDataUrl} alt="QR Code" className="w-20 h-20" />
          </div>
          <span className="text-[10px] font-semibold opacity-75" style={{ color: accent }}>
            {isRtl ? 'امسح الرمز لتأكيد الحضور وموقع الحفل' : 'Scan for RSVP & Location'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StarterCardImage;
