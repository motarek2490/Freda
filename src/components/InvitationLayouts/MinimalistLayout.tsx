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
  ExternalLink,
  Maximize2,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const MinimalistLayout: React.FC<TemplateLayoutProps> = ({
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
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-16 py-8 font-sans-body">
      {/* 1. EDITORIAL SPLIT-GRID HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#121212] border border-[#27272A] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Block */}
          <div className="md:col-span-7 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-[#27272A] text-[10px] tracking-widest text-[#94A3B8] uppercase font-bold">
              {details.hostNames || 'Invitation'}
            </div>

            <h1 className="text-3xl sm:text-5xl font-light text-[#FAFAFA] tracking-tight leading-tight">
              {details.eventTitle}
            </h1>

            {/* Couple names minimal grid */}
            {(details.groomName || details.brideName) && (
              <div className="flex items-center gap-4 text-lg font-mono text-[#E2E8F0] pt-2 border-t border-[#27272A]">
                <span>{details.groomName}</span>
                <span className="text-[#94A3B8]">&</span>
                <span>{details.brideName}</span>
              </div>
            )}

            <p className="text-xs text-[#94A3B8] font-light leading-relaxed max-w-md">
              {details.customMessage}
            </p>

            {/* Large Minimalist Numeric Date Badge */}
            <div className="pt-4 border-t border-[#27272A] flex items-baseline gap-3 font-mono">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#FAFAFA]">
                {details.eventDate}
              </span>
              <span className="text-xs text-[#94A3B8]">{details.eventTime}</span>
            </div>
          </div>

          {/* Right Image Block */}
          <div className="md:col-span-5">
            {details.coverImageUrl ? (
              <div
                onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
                className="rounded-2xl overflow-hidden border border-[#27272A] max-h-96 cursor-pointer group relative"
              >
                <img
                  src={details.coverImageUrl}
                  alt="Minimal Cover"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-2xl bg-[#18181B] border border-[#27272A] flex items-center justify-center text-[#52525B] text-xs font-mono">
                [ EDITORIAL IMAGE ]
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. NUMERIC COUNTDOWN & CALENDAR BAR */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 font-mono text-center" dir="ltr">
          <div>
            <span className="block text-2xl font-bold text-[#FAFAFA]">{timeLeft.days}</span>
            <span className="text-[9px] uppercase text-[#71717A]">{isRtl ? 'أيام' : 'Days'}</span>
          </div>
          <span className="text-xl text-[#3F3F46]">:</span>
          <div>
            <span className="block text-2xl font-bold text-[#FAFAFA]">{timeLeft.hours}</span>
            <span className="text-[9px] uppercase text-[#71717A]">{isRtl ? 'ساعات' : 'Hours'}</span>
          </div>
          <span className="text-xl text-[#3F3F46]">:</span>
          <div>
            <span className="block text-2xl font-bold text-[#FAFAFA]">{timeLeft.minutes}</span>
            <span className="text-[9px] uppercase text-[#71717A]">{isRtl ? 'دقائق' : 'Mins'}</span>
          </div>
          <span className="text-xl text-[#3F3F46]">:</span>
          <div>
            <span className="block text-2xl font-bold text-[#FAFAFA]">{timeLeft.seconds}</span>
            <span className="text-[9px] uppercase text-[#71717A]">{isRtl ? 'ثواني' : 'Secs'}</span>
          </div>
        </div>

        <a
          href={getGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs font-mono transition-all flex items-center gap-2"
        >
          <Calendar className="w-4 h-4 text-[#94A3B8]" />
          <span>{isRtl ? 'حفظ التقويم' : 'Save Date'}</span>
        </a>
      </div>

      {/* 3. LOCATION & VENUE */}
      <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#71717A] block">
              {isRtl ? 'الموقع والعنوان' : 'LOCATION & VENUE'}
            </span>
            <h2 className="text-xl font-bold text-[#FAFAFA] mt-1">{details.venueName}</h2>
            <p className="text-xs text-[#A1A1AA] mt-0.5">{details.address}</p>
          </div>
          {details.googleMapsUrl && (
            <a
              href={details.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] transition-all"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {details.dressCode && (
          <p className="text-xs text-[#71717A] font-mono">
            {isRtl ? 'قواعد اللباس:' : 'DRESS CODE:'} {details.dressCode}
          </p>
        )}
      </div>

      {/* 4. SCHEDULE TIMELINE */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 space-y-6">
          <h3 className="text-sm font-mono tracking-widest uppercase text-[#71717A]">
            {isRtl ? 'البرنامج الزمني' : 'EVENT TIMELINE'}
          </h3>
          <div className="space-y-3">
            {details.scheduleTimeline.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-[#27272A]/50 text-xs">
                <span className="font-mono text-[#94A3B8]">{item.time}</span>
                <span className="font-medium text-[#FAFAFA]">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. GUESTBOOK & RSVP BUTTON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.enableGuestbook && (
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 space-y-4">
            <h3 className="text-xs font-mono text-[#71717A] uppercase">
              {isRtl ? 'التبريكات والتهاني' : 'MESSAGES & WISHES'}
            </h3>
            <form onSubmit={onAddWish} className="space-y-2">
              <input
                type="text"
                required
                value={newWishAuthor}
                onChange={(e) => setNewWishAuthor(e.target.value)}
                placeholder={isRtl ? 'الاسم...' : 'Name...'}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-2.5 text-xs text-[#FAFAFA]"
              />
              <textarea
                required
                rows={2}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                placeholder={isRtl ? 'رسالتك...' : 'Message...'}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-2.5 text-xs text-[#FAFAFA]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#27272A] hover:bg-[#3F3F46] text-[#FAFAFA] text-xs font-mono rounded-xl transition-all"
              >
                {isRtl ? 'إرسال' : 'Submit'}
              </button>
            </form>
          </div>
        )}

        {details.enableRSVP && (
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 flex flex-col justify-between space-y-4 text-center">
            <div>
              <span className="text-xs font-mono text-[#71717A] uppercase block">
                {isRtl ? 'تأكيد الحضور' : 'CONFIRMATION'}
              </span>
              <h3 className="text-lg font-bold text-[#FAFAFA] mt-1">
                {isRtl ? 'هل ستنضم إلينا؟' : 'Will you join us?'}
              </h3>
            </div>
            <button
              onClick={onOpenRsvp}
              className="w-full py-4 rounded-2xl bg-[#FAFAFA] text-[#09090B] font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#E4E4E7] transition-all flex items-center justify-center gap-2"
            >
              <span>{isRtl ? 'تأكيد الحضور الآن' : 'RSVP ONLINE'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
