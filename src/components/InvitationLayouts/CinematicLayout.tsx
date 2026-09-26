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
  Film,
  Sparkles,
  ExternalLink,
  Maximize2,
  UserCheck,
  Play,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const CinematicLayout: React.FC<TemplateLayoutProps> = ({
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
    <div className="space-y-20 py-6 font-sans-body">
      {/* 1. CINEMATIC FULL-SCREEN SCENE HERO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="relative rounded-3xl overflow-hidden border border-[#333] shadow-[0_30px_100px_rgba(0,0,0,0.9)] text-center min-h-[500px] flex flex-col items-center justify-end p-8 sm:p-14"
      >
        {/* Full Bleed Background Image with Film Vignette */}
        {details.coverImageUrl && (
          <img
            src={details.coverImageUrl}
            alt="Cinematic Background"
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-60 transition-all duration-1000"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-[#0F0F11]/70 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/80 border border-[#B99A65]/40 text-[10px] tracking-widest text-[#B99A65] uppercase font-mono">
            <Film className="w-3 h-3" />
            <span>{isRtl ? 'قصة حُب سينمائية' : 'A CINEMATIC STORY'}</span>
          </div>

          <h1 className="font-playfair text-4xl sm:text-6xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight drop-shadow-2xl">
            {details.eventTitle}
          </h1>

          <p className="text-sm text-[#D4D4D8] italic font-serif leading-relaxed max-w-lg mx-auto">
            "{details.customMessage}"
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-4 text-xs font-mono text-[#A1A1AA]">
            <span>{details.eventDate}</span>
            <span>•</span>
            <span>{details.venueName}</span>
          </div>
        </div>
      </motion.div>

      {/* 2. THE CHAPTERS / SCENE PROGRESSION */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 space-y-8">
        <div className="text-center space-y-1">
          <span className="text-[10px] tracking-[0.3em] font-mono text-[#B99A65] uppercase">
            {isRtl ? 'الفصل الأول' : 'CHAPTER ONE'}
          </span>
          <h2 className="font-playfair text-2xl font-bold text-[#FAFAFA]">
            {isRtl ? 'تفاصيل الأمسية والزمان' : 'The Celebration Details'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#0F0F11] border border-[#27272A] space-y-2">
            <Calendar className="w-6 h-6 text-[#B99A65]" />
            <h3 className="font-bold text-sm text-[#FAFAFA]">{isRtl ? 'الموعد والزمان' : 'Date & Time'}</h3>
            <p className="text-xs text-[#A1A1AA]">{details.eventDate} @ {details.eventTime}</p>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] text-[#B99A65] underline pt-2"
            >
              {isRtl ? 'إضافة للتقويم' : '+ Add to Calendar'}
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F0F11] border border-[#27272A] space-y-2">
            <MapPin className="w-6 h-6 text-[#B99A65]" />
            <h3 className="font-bold text-sm text-[#FAFAFA]">{isRtl ? 'المكان والعنوان' : 'Venue'}</h3>
            <p className="text-xs text-[#A1A1AA]">{details.venueName}</p>
            {details.googleMapsUrl && (
              <a
                href={details.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[11px] text-[#B99A65] underline pt-2"
              >
                {isRtl ? 'الاتجاهات والخريطة' : 'Get Directions'}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 3. PHOTO GALLERY FILMSTRIP */}
      {details.galleryImages && details.galleryImages.length > 0 && (
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 space-y-6">
          <div className="text-center">
            <span className="text-[10px] tracking-[0.3em] font-mono text-[#B99A65] uppercase">
              {isRtl ? 'شريط الصور السينمائي' : 'PHOTO GALLERY'}
            </span>
            <h3 className="font-playfair text-xl font-bold text-[#FAFAFA]">
              {isRtl ? 'معرض الذكريات' : 'Moments & Memories'}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {details.galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxImg(imgUrl)}
                className="h-44 rounded-2xl overflow-hidden border border-[#27272A] cursor-pointer group relative"
              >
                <img
                  src={imgUrl}
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. GUESTBOOK & RSVP */}
      <div className="space-y-6 text-center">
        {details.enableRSVP && (
          <button
            onClick={onOpenRsvp}
            className="px-10 py-5 rounded-full bg-[#B99A65] text-[#0F0F11] font-bold text-xs uppercase tracking-widest shadow-2xl hover:bg-[#d6bd91] transition-all"
          >
            {isRtl ? 'تأكيد الحضور السينمائي' : 'Confirm Attendance'}
          </button>
        )}
      </div>
    </div>
  );
};
