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
        className="relative rounded-3xl overflow-hidden border border-[#E6A15C]/40 shadow-[0_20px_80px_rgba(230,161,92,0.15)] text-center min-h-[520px] flex flex-col items-center justify-end p-8 sm:p-14"
      >
        {/* Full Bleed Background Image with Warm Cinema Tint */}
        {details.coverImageUrl && (
          <img
            src={details.coverImageUrl}
            alt="Cinematic Background"
            className="absolute inset-0 w-full h-full object-cover opacity-70 hover:opacity-90 transition-all duration-1000 scale-105 hover:scale-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1215] via-[#1A1215]/75 to-black/30" />

        <div className="relative z-10 space-y-4 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1215]/90 border border-[#E6A15C]/60 text-xs tracking-wider text-[#E6A15C] font-semibold shadow-lg">
            <Heart className="w-3.5 h-3.5 text-[#E6A15C] fill-current" />
            <span>{isRtl ? '✨ قصة حُبنا المضيئة — كادر سينمائي دافئ' : 'A WARM CINEMATIC LOVE STORY'}</span>
          </div>

          <h1 className="font-playfair text-3xl sm:text-5xl font-extrabold text-[#F7F4EE] tracking-wide leading-snug drop-shadow-2xl">
            {details.eventTitle}
          </h1>

          <p className="text-sm sm:text-base text-[#E9E1D5] font-serif italic leading-relaxed max-w-lg mx-auto bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
            "{details.customMessage}"
          </p>

          <div className="pt-4 border-t border-[#E6A15C]/30 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#E6A15C]">
            <span>{details.eventDate}</span>
            <span>•</span>
            <span>{details.venueName}</span>
          </div>
        </div>
      </motion.div>

      {/* 2. THE CHAPTERS / SCENE PROGRESSION */}
      <div className="bg-[#241A1E] border border-[#E6A15C]/30 rounded-3xl p-8 space-y-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E6A15C] to-transparent" />

        <div className="text-center space-y-1">
          <span className="text-xs tracking-[0.25em] font-bold text-[#E6A15C] uppercase">
            {isRtl ? '🎬 الفصل الأول — التفاصيل الملكية' : 'CHAPTER ONE — CELEBRATION DETAILS'}
          </span>
          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تفاصيل الأمسية والزمان' : 'The Celebration Details'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#1A1215] border border-[#E6A15C]/30 space-y-2 hover:border-[#E6A15C] transition-colors">
            <Calendar className="w-6 h-6 text-[#E6A15C]" />
            <h3 className="font-bold text-sm text-[#F7F4EE]">{isRtl ? 'الموعد والزمان' : 'Date & Time'}</h3>
            <p className="text-xs text-[#E9E1D5]">{details.eventDate} @ {details.eventTime}</p>
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-[#E6A15C] hover:underline pt-2"
            >
              {isRtl ? '📅 إضافة للتقويم' : '+ Add to Calendar'}
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-[#1A1215] border border-[#E6A15C]/30 space-y-2 hover:border-[#E6A15C] transition-colors">
            <MapPin className="w-6 h-6 text-[#E6A15C]" />
            <h3 className="font-bold text-sm text-[#F7F4EE]">{isRtl ? 'المكان والعنوان' : 'Venue'}</h3>
            <p className="text-xs text-[#E9E1D5]">{details.venueName}</p>
            {details.googleMapsUrl && (
              <a
                href={details.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-[#E6A15C] hover:underline pt-2"
              >
                {isRtl ? '📍 الاتجاهات والخريطة' : 'Get Directions'}
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
