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
  Sun,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const BohoTerracottaLayout: React.FC<TemplateLayoutProps> = ({
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
    <div className="space-y-16 py-6 font-sans-body">
      {/* 1. TERRACOTTA CLAY ARCH HERO SUITE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="relative bg-[#FBF5F0] border-2 border-[#D9A083] rounded-t-[140px] rounded-b-3xl p-8 sm:p-14 shadow-2xl overflow-hidden text-center text-[#4A3528]"
      >
        {/* Sunburst Icon */}
        <div className="w-14 h-14 rounded-full bg-[#E58C65]/20 border border-[#E58C65] flex items-center justify-center mx-auto mb-4 text-[#C26338]">
          <Sun className="w-7 h-7" />
        </div>

        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C26338] block mb-2">
          {details.hostNames || (isRtl ? 'احتفال عائلي بوهيمي' : 'A Bohemian Celebration')}
        </span>

        <h1
          className={`text-3xl sm:text-5xl font-serif text-[#3B261A] leading-tight mb-4 ${
            isRtl ? 'font-arabic-calligraphy' : 'font-playfair'
          }`}
        >
          {details.eventTitle}
        </h1>

        <p className="text-xs sm:text-sm font-light text-[#735340] max-w-lg mx-auto leading-relaxed mb-6">
          {details.customMessage}
        </p>

        {/* ARCHED COUPLE IMAGES */}
        {(details.groomName || details.brideName) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-lg mx-auto">
            {details.groomName && (
              <div className="p-4 rounded-t-[60px] rounded-b-2xl bg-[#F4E9E1] border border-[#D9A083] text-center space-y-2">
                <div className="w-24 h-28 mx-auto rounded-t-[50px] rounded-b-xl overflow-hidden shadow-inner border-2 border-white">
                  <img
                    src={details.groomAvatarUrl || '/images/samples/groom_portrait.jpg'}
                    alt={details.groomName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/samples/groom_portrait.jpg';
                    }}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#C26338] font-bold block">
                  {isRtl ? 'العريس' : 'The Groom'}
                </span>
                <h3 className="font-serif font-bold text-base text-[#3B261A]">{details.groomName}</h3>
                {details.groomParents && <p className="text-[10px] text-[#8C6B56]">{details.groomParents}</p>}
              </div>
            )}

            {details.brideName && (
              <div className="p-4 rounded-t-[60px] rounded-b-2xl bg-[#F4E9E1] border border-[#D9A083] text-center space-y-2">
                <div className="w-24 h-28 mx-auto rounded-t-[50px] rounded-b-xl overflow-hidden shadow-inner border-2 border-white">
                  <img
                    src={details.brideAvatarUrl || '/images/samples/bride_portrait.jpg'}
                    alt={details.brideName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/samples/bride_portrait.jpg';
                    }}
                  />
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#C26338] font-bold block">
                  {isRtl ? 'العروس' : 'The Bride'}
                </span>
                <h3 className="font-serif font-bold text-base text-[#3B261A]">{details.brideName}</h3>
                {details.brideParents && <p className="text-[10px] text-[#8C6B56]">{details.brideParents}</p>}
              </div>
            )}
          </div>
        )}

        {/* Cover Photo */}
        {details.coverImageUrl && (
          <div
            onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
            className="rounded-t-[80px] rounded-b-3xl overflow-hidden border border-[#D9A083] max-h-80 shadow-md cursor-pointer group relative mt-6"
          >
            <img
              src={details.coverImageUrl}
              alt="Boho Arch Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2 font-semibold">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>
        )}
      </motion.div>

      {/* 2. EARTH TONE COUNTDOWN */}
      <div className="bg-[#FBF5F0] border border-[#D9A083] rounded-3xl p-8 text-center space-y-6 text-[#4A3528]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E58C65]/20 text-[#C26338] text-xs font-serif font-bold">
          <span>{details.eventDate} • {details.eventTime}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto" dir="ltr">
          {[
            { label: isRtl ? 'أيام' : 'Days', val: timeLeft.days },
            { label: isRtl ? 'ساعات' : 'Hours', val: timeLeft.hours },
            { label: isRtl ? 'دقائق' : 'Mins', val: timeLeft.minutes },
            { label: isRtl ? 'ثواني' : 'Secs', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#F4E9E1] border border-[#D9A083]/40">
              <span className="block font-serif font-bold text-2xl text-[#C26338]">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#8C6B56]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#E8D3C5] flex items-center justify-center gap-4">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 rounded-full bg-[#C26338] text-white text-xs font-bold hover:bg-[#a64e29] transition-all flex items-center gap-2 shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>{isRtl ? 'حفظ الموعد' : 'Save the Date'}</span>
          </a>
        </div>
      </div>

      {/* 3. VENUE LOCATION */}
      <div className="bg-[#FBF5F0] border border-[#D9A083] rounded-3xl p-8 space-y-6 text-center text-[#4A3528]">
        <div className="w-12 h-12 rounded-full bg-[#F4E9E1] border border-[#D9A083] flex items-center justify-center mx-auto text-[#C26338]">
          <MapPin className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#C26338] uppercase font-bold block">
            {isRtl ? 'موقع الاحتفال' : 'The Celebration Venue'}
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#3B261A] mt-1">
            {details.venueName}
          </h2>
          <p className="text-xs text-[#735340] mt-1">{details.address}</p>
        </div>

        {details.googleMapsUrl && (
          <a
            href={details.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C26338] text-white font-bold text-xs uppercase hover:bg-[#a64e29] transition-all shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isRtl ? 'خرائط Google' : 'Open Google Maps'}</span>
          </a>
        )}
      </div>

      {/* 4. RSVP CALLOUT */}
      {details.enableRSVP && (
        <div className="text-center pt-4">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#C26338] text-white font-serif font-bold text-sm tracking-widest shadow-xl hover:bg-[#a64e29] transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <UserCheck className="w-5 h-5" />
            <span>{isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Attendance (RSVP)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
