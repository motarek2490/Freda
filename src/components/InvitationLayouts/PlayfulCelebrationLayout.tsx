import React from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  Shirt,
  Send,
  Sparkles,
  ExternalLink,
  Maximize2,
  UserCheck,
  PartyPopper,
  Ticket,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const PlayfulCelebrationLayout: React.FC<TemplateLayoutProps> = ({
  invitation,
  isRtl,
  t,
  customColors,
  timeLeft,
  wishes,
  onOpenRsvp,
  onOpenBank,
  onAddWish,
  newWishAuthor,
  setNewWishAuthor,
  newWishRelation,
  setNewWishRelation,
  newWishMessage,
  setNewWishMessage,
  wishSuccess,
  setActiveLightboxImg,
  getGoogleCalendarUrl,
}) => {
  const details = invitation.eventDetails;

  return (
    <div className="space-y-12 py-6 font-sans-body">
      {/* 1. CELEBRATION TICKET HERO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-br from-[#FFF5EB] to-[#FFEBEB] rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-[#FFAAA6] text-[#2D3142] overflow-hidden text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF6B6B] text-white text-xs font-extrabold shadow-sm mb-4">
          <PartyPopper className="w-4 h-4" />
          <span>{isRtl ? 'احتفال الفرح والبهجة' : 'Celebration Ticket'}</span>
        </div>

        <h1
          className={`text-3xl sm:text-5xl font-black text-[#2D3142] leading-tight mb-4 ${
            isRtl ? 'font-arabic-calligraphy' : 'font-sans'
          }`}
        >
          {details.eventTitle}
        </h1>

        <p className="text-xs sm:text-sm font-medium text-[#4F5D75] max-w-lg mx-auto leading-relaxed mb-6">
          {details.customMessage}
        </p>

        {/* Dynamic Ticket Tear Line */}
        <div className="relative my-8 border-t-2 border-dashed border-[#FFAAA6]">
          <div className="absolute -top-3 -left-12 w-6 h-6 rounded-full bg-black/80" />
          <div className="absolute -top-3 -right-12 w-6 h-6 rounded-full bg-black/80" />
        </div>

        {/* Couple Badges */}
        {(details.groomName || details.brideName) && (
          <div className="flex flex-wrap items-center justify-center gap-6 my-6">
            {details.groomName && (
              <div className="p-4 rounded-2xl bg-white border border-[#FFAAA6] shadow-sm text-center min-w-[140px]">
                {details.groomAvatarUrl && (
                  <img src={details.groomAvatarUrl} alt={details.groomName} className="w-16 h-16 rounded-full mx-auto object-cover mb-2 border-2 border-[#FF6B6B]" />
                )}
                <span className="text-[10px] text-[#FF6B6B] font-extrabold uppercase block">{isRtl ? 'العريس' : 'Groom'}</span>
                <h3 className="font-extrabold text-sm text-[#2D3142]">{details.groomName}</h3>
              </div>
            )}

            <div className="text-xl font-black text-[#FF6B6B]">✨</div>

            {details.brideName && (
              <div className="p-4 rounded-2xl bg-white border border-[#FFAAA6] shadow-sm text-center min-w-[140px]">
                {details.brideAvatarUrl && (
                  <img src={details.brideAvatarUrl} alt={details.brideName} className="w-16 h-16 rounded-full mx-auto object-cover mb-2 border-2 border-[#FF6B6B]" />
                )}
                <span className="text-[10px] text-[#FF6B6B] font-extrabold uppercase block">{isRtl ? 'العروس' : 'Bride'}</span>
                <h3 className="font-extrabold text-sm text-[#2D3142]">{details.brideName}</h3>
              </div>
            )}
          </div>
        )}

        {/* Cover Image */}
        {details.coverImageUrl && (
          <div
            onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
            className="rounded-2xl overflow-hidden border-2 border-[#FFAAA6] max-h-72 shadow-lg cursor-pointer group relative mt-4"
          >
            <img src={details.coverImageUrl} alt="Celebration Cover" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        )}
      </motion.div>

      {/* 2. PARTY COUNTDOWN */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center space-y-6 text-[#2D3142]">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FFEBEB] text-[#FF6B6B] text-xs font-extrabold">
          <Calendar className="w-4 h-4" />
          <span>{details.eventDate} • {details.eventTime}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto" dir="ltr">
          {[
            { label: isRtl ? 'أيام' : 'Days', val: timeLeft.days },
            { label: isRtl ? 'ساعات' : 'Hours', val: timeLeft.hours },
            { label: isRtl ? 'دقائق' : 'Mins', val: timeLeft.minutes },
            { label: isRtl ? 'ثواني' : 'Secs', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#FFF5EB] border border-[#FFAAA6]/50">
              <span className="block font-black text-2xl text-[#FF6B6B]">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase font-bold text-[#4F5D75]">{item.label}</span>
            </div>
          ))}
        </div>

        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B6B] text-white text-xs font-extrabold hover:bg-[#fa5252] transition-all shadow-md"
        >
          <Calendar className="w-4 h-4" />
          <span>{isRtl ? 'إضافة إلى تقويمي' : 'Add to Calendar'}</span>
        </a>
      </div>

      {/* 3. VENUE LOCATION */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl space-y-6 text-center text-[#2D3142]">
        <div className="w-12 h-12 rounded-full bg-[#FFEBEB] flex items-center justify-center mx-auto text-[#FF6B6B]">
          <MapPin className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] tracking-widest text-[#FF6B6B] uppercase font-black block">
            {isRtl ? 'موقع الحفل' : 'VENUE'}
          </span>
          <h2 className="font-extrabold text-2xl text-[#2D3142] mt-1">{details.venueName}</h2>
          <p className="text-xs text-[#4F5D75] mt-1">{details.address}</p>
        </div>

        {details.googleMapsUrl && (
          <a
            href={details.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D3142] text-white font-extrabold text-xs hover:bg-black transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isRtl ? 'فتح خرائط Google' : 'Google Maps'}</span>
          </a>
        )}
      </div>

      {/* 4. RSVP BUTTON */}
      {details.enableRSVP && (
        <div className="text-center pt-4">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-12 py-5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FFAAA6] text-white font-black text-sm uppercase tracking-wider shadow-[0_10px_30px_rgba(255,107,107,0.4)] hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <Ticket className="w-5 h-5" />
            <span>{isRtl ? 'حجز بطاقتي وتأكيد الحضور (RSVP)' : 'Claim Ticket & RSVP'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
