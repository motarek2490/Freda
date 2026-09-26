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
  ChevronRight,
  Maximize2,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';
import { formatTime12Hour } from '../../lib/dateUtils';

export const RoyalLayout: React.FC<TemplateLayoutProps> = ({
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
    <div className="space-y-16 py-8">
      {/* 1. ROYAL HERO CREST CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-center border-2 border-[#B99A65]/50 rounded-3xl p-8 sm:p-14 shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Decorative Filigree Corner Borders */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#B99A65]" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#B99A65]" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#B99A65]" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#B99A65]" />

        {/* Royal Crest Monogram Icon */}
        <div className="w-16 h-16 rounded-full border-2 border-[#B99A65] bg-[#171717] flex items-center justify-center mx-auto mb-6 text-[#B99A65] shadow-lg">
          <Sparkles className="w-8 h-8" />
        </div>

        <span className="text-[11px] tracking-[0.3em] text-[#B99A65] uppercase font-bold block mb-3">
          {details.hostNames}
        </span>

        <h1
          className={`text-3xl sm:text-5xl font-extrabold text-[#F7F4EE] leading-tight mb-4 ${
            isRtl ? 'font-arabic-calligraphy' : 'font-playfair'
          }`}
        >
          {details.eventTitle}
        </h1>

        <p className="text-xs sm:text-sm font-light text-[#E9E1D5]/80 max-w-xl mx-auto leading-relaxed mb-8">
          {details.customMessage}
        </p>

        {/* GROOM & BRIDE PROFILE CARDS */}
        {(details.groomName || details.brideName) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 max-w-2xl mx-auto">
            {details.groomName && (
              <div className="p-5 rounded-2xl bg-[#171717]/80 border border-[#B99A65]/30 text-center space-y-3">
                {details.groomAvatarUrl && (
                  <img
                    src={details.groomAvatarUrl}
                    alt={details.groomName}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#B99A65]"
                  />
                )}
                <div>
                  <span className="text-[10px] text-[#B99A65] uppercase tracking-widest font-bold">
                    {isRtl ? 'العريس' : 'Groom'}
                  </span>
                  <h3 className="font-playfair font-bold text-lg text-[#F7F4EE]">
                    {details.groomName}
                  </h3>
                  {details.groomParents && (
                    <p className="text-[11px] text-[#8D8A84] italic">{details.groomParents}</p>
                  )}
                </div>
              </div>
            )}

            {details.brideName && (
              <div className="p-5 rounded-2xl bg-[#171717]/80 border border-[#B99A65]/30 text-center space-y-3">
                {details.brideAvatarUrl && (
                  <img
                    src={details.brideAvatarUrl}
                    alt={details.brideName}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#B99A65]"
                  />
                )}
                <div>
                  <span className="text-[10px] text-[#B99A65] uppercase tracking-widest font-bold">
                    {isRtl ? 'العروس' : 'Bride'}
                  </span>
                  <h3 className="font-playfair font-bold text-lg text-[#F7F4EE]">
                    {details.brideName}
                  </h3>
                  {details.brideParents && (
                    <p className="text-[11px] text-[#8D8A84] italic">{details.brideParents}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cover Image */}
        {details.coverImageUrl && (
          <div
            onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
            className="mt-6 rounded-2xl overflow-hidden border border-[#B99A65]/40 max-h-80 shadow-2xl cursor-pointer group relative"
          >
            <img
              src={details.coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2 font-semibold">
              <Maximize2 className="w-4 h-4" />
              <span>{isRtl ? 'تكبير الصورة' : 'View Full Image'}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* 2. COUNTDOWN TIMER & CALENDAR */}
      <div className="bg-[#171717] border border-[#B99A65]/30 rounded-3xl p-8 text-center space-y-6">
        <span className="text-[10px] tracking-[0.3em] text-[#B99A65] uppercase font-bold">
          {isRtl ? 'العد التنازلي للمناسبة' : 'Countdown to the Big Day'}
        </span>

        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto" dir="ltr">
          {[
            { label: isRtl ? 'أيام' : 'Days', val: timeLeft.days },
            { label: isRtl ? 'ساعات' : 'Hours', val: timeLeft.hours },
            { label: isRtl ? 'دقائق' : 'Mins', val: timeLeft.minutes },
            { label: isRtl ? 'ثواني' : 'Secs', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-[#1F1E1B] border border-[#B99A65]/20">
              <span className="block font-playfair font-extrabold text-2xl text-[#F7F4EE]">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#8D8A84]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#333]">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#B99A65]/20 border border-[#B99A65] text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] text-xs font-bold transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{isRtl ? 'إضافة إلى تقويم Google' : 'Add to Google Calendar'}</span>
          </a>

          {details.rsvpDeadline && (
            <span className="text-xs text-[#8D8A84] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B99A65]" />
              {isRtl ? `آخر موعد لتأكيد الحضور: ${details.rsvpDeadline}` : `RSVP Deadline: ${details.rsvpDeadline}`}
            </span>
          )}
        </div>
      </div>

      {/* 3. VENUE LOCATION & MAP DIRECTORY */}
      <div className="bg-[#1F1E1B] border border-[#B99A65]/30 rounded-3xl p-8 space-y-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#B99A65]/10 border border-[#B99A65]/40 flex items-center justify-center mx-auto text-[#B99A65]">
          <MapPin className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] tracking-[0.2em] text-[#B99A65] uppercase font-bold">
            {isRtl ? 'مكان الاحتفال' : 'Venue & Location'}
          </span>
          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE] mt-1">
            {details.venueName}
          </h2>
          <p className="text-xs text-[#8D8A84] mt-1">{details.address}</p>
        </div>

        {details.googleMapsUrl && (
          <a
            href={details.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#B99A65] text-[#171717] font-extrabold text-xs uppercase tracking-widest hover:bg-[#d6bd91] transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isRtl ? 'فتح الخريطة والاتجاهات' : 'Get Driving Directions'}</span>
          </a>
        )}

        {details.dressCode && (
          <div className="pt-4 border-t border-[#333] flex items-center justify-center gap-2 text-xs text-[#E9E1D5]">
            <Shirt className="w-4 h-4 text-[#B99A65]" />
            <span>
              <strong>{isRtl ? 'قواعد اللباس:' : 'Dress Code:'}</strong> {details.dressCode}
            </span>
          </div>
        )}
      </div>

      {/* 4. PROGRAMME / EVENT TIMELINE */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <div className="bg-[#171717] border border-[#B99A65]/30 rounded-3xl p-8 space-y-6">
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE] text-center">
            {isRtl ? 'جدول المواعيد والبرنامج' : 'Event Schedule'}
          </h3>

          <div className="space-y-4 max-w-xl mx-auto">
            {details.scheduleTimeline.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-[#1F1E1B] border border-[#B99A65]/20 flex items-start gap-4"
              >
                <div className="px-3 py-1.5 rounded-xl bg-[#B99A65]/20 border border-[#B99A65] text-[#B99A65] font-mono text-xs font-bold whitespace-nowrap">
                  {formatTime12Hour(item.time, isRtl)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#F7F4EE]">{item.title}</h4>
                  <p className="text-xs text-[#8D8A84] mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. GIFT REGISTRY & BANK DETAILS */}
      {details.enableGiftRegistry && (
        <div className="bg-[#1F1E1B] border border-[#B99A65]/30 rounded-3xl p-8 text-center space-y-4">
          <Gift className="w-8 h-8 text-[#B99A65] mx-auto" />
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
            {isRtl ? 'هدايا العروسين والتبريكات' : 'Gift Registry'}
          </h3>
          <p className="text-xs text-[#8D8A84] max-w-md mx-auto">
            {isRtl
              ? 'حضوركم هو أجمل هدايانا. لمن يرغب في إهداء العروسين رقمياً عبر الحسابات البنكية:'
              : 'Your presence is the greatest gift. Should you wish to honor us with a gift, bank details are provided.'}
          </p>
          <button
            onClick={onOpenBank}
            className="px-6 py-3 rounded-2xl bg-[#171717] border border-[#B99A65] text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] text-xs font-extrabold uppercase tracking-widest transition-all"
          >
            {isRtl ? 'عرض بيانات التحويل والـ QR' : 'View Bank Transfer Info & QR'}
          </button>
        </div>
      )}

      {/* 6. GUESTBOOK & WISHES BOARD */}
      {details.enableGuestbook && (
        <div className="bg-[#171717] border border-[#B99A65]/30 rounded-3xl p-8 space-y-6">
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE] text-center">
            {isRtl ? 'دفتر التهاني والتبريكات' : 'Guest Wishbook'}
          </h3>

          {/* Add Wish Form */}
          <form onSubmit={onAddWish} className="p-4 rounded-2xl bg-[#1F1E1B] border border-[#333] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newWishAuthor}
                onChange={(e) => setNewWishAuthor(e.target.value)}
                placeholder={isRtl ? 'اسمك الكريم...' : 'Your Name...'}
                className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65]"
              />
              <input
                type="text"
                value={newWishRelation}
                onChange={(e) => setNewWishRelation(e.target.value)}
                placeholder={isRtl ? 'صلة القرابة (اختياري)...' : 'Relation (Optional)...'}
                className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65]"
              />
            </div>
            <textarea
              required
              rows={2}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              placeholder={isRtl ? 'اكتب تبريكاتك وأمنياتك اللطيفة للعروسين...' : 'Write your warm wishes...'}
              className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:bg-[#d6bd91] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isRtl ? 'إرسال التبريكات' : 'Send Wishes'}</span>
            </button>
            {wishSuccess && (
              <p className="text-xs text-emerald-400 text-center font-semibold">
                {isRtl ? 'تمت إضافة تهنئتك بنجاح!' : 'Wish posted successfully!'}
              </p>
            )}
          </form>

          {/* Wishes List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div key={w.id} className="p-4 rounded-xl bg-[#1F1E1B] border border-[#333] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#B99A65]">{w.authorName}</span>
                  <span className="text-[10px] text-[#8D8A84]">{w.relationship}</span>
                </div>
                <p className="text-xs text-[#E9E1D5] italic">{w.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RSVP FLOATING ACTION CALLOUT */}
      {details.enableRSVP && (
        <div className="text-center pt-6">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-sm uppercase tracking-widest shadow-[0_10px_40px_rgba(185,154,101,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
          >
            <UserCheck className="w-5 h-5" />
            <span>{isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm RSVP Online'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
