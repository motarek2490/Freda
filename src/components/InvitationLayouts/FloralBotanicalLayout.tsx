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
  CheckCircle2,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';
import { formatTime12Hour } from '../../lib/dateUtils';

export const FloralBotanicalLayout: React.FC<TemplateLayoutProps> = ({
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
      {/* 1. BOTANICAL WREATH & DECKLED PAPER SUITE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative bg-[#FAF8F5] text-[#2C3531] rounded-[36px] p-8 sm:p-14 shadow-[0_20px_70px_rgba(0,0,0,0.4)] border border-[#D1E2D3] overflow-hidden text-center"
      >
        {/* Watercolor Botanical Leaves Accent Decor */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#E3EFE5] rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#F2E3E8] rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Botanical Sprig Top Monogram Icon */}
        <div className="w-16 h-16 rounded-full border-2 border-[#5B7553]/30 bg-[#FFFFFF] flex items-center justify-center mx-auto mb-4 text-[#5B7553] shadow-sm">
          <span className="text-2xl">🌿</span>
        </div>

        <span className="text-[11px] tracking-[0.25em] text-[#5B7553] uppercase font-bold block mb-2">
          {details.hostNames || (isRtl ? 'دعوة زفاف مباركة' : 'Joyfully Invite You')}
        </span>

        <h1
          className={`text-3xl sm:text-5xl font-serif font-medium text-[#1E2B22] leading-tight mb-4 ${
            isRtl ? 'font-arabic-calligraphy' : 'font-playfair'
          }`}
        >
          {details.eventTitle}
        </h1>

        <p className="text-xs sm:text-sm font-light text-[#55655B] max-w-lg mx-auto leading-relaxed mb-6">
          {details.customMessage}
        </p>

        {/* COUPLE FLORAL PORTRAIT MEDALLIONS */}
        {(details.groomName || details.brideName) && (
          <div className="flex flex-wrap items-center justify-center gap-8 my-8">
            {details.groomName && (
              <div className="text-center space-y-2">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FFFFFF] shadow-md mx-auto bg-[#E3EFE5]">
                    {details.groomAvatarUrl ? (
                      <img src={details.groomAvatarUrl} alt={details.groomName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-serif text-[#5B7553]">G</div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-base">🌸</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#1E2B22]">{details.groomName}</h3>
                {details.groomParents && <p className="text-[11px] text-[#78887E]">{details.groomParents}</p>}
              </div>
            )}

            <div className="text-2xl text-[#8E5B6A] font-serif">&</div>

            {details.brideName && (
              <div className="text-center space-y-2">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#FFFFFF] shadow-md mx-auto bg-[#F2E3E8]">
                    {details.brideAvatarUrl ? (
                      <img src={details.brideAvatarUrl} alt={details.brideName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-serif text-[#8E5B6A]">B</div>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 text-base">🌺</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#1E2B22]">{details.brideName}</h3>
                {details.brideParents && <p className="text-[11px] text-[#78887E]">{details.brideParents}</p>}
              </div>
            )}
          </div>
        )}

        {/* Cover Photo */}
        {details.coverImageUrl && (
          <div
            onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
            className="rounded-3xl overflow-hidden border border-[#D1E2D3] max-h-80 shadow-lg cursor-pointer group relative"
          >
            <img
              src={details.coverImageUrl}
              alt="Floral Botanical Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2 font-semibold">
              <Maximize2 className="w-4 h-4" />
              <span>{isRtl ? 'تكبير الصورة' : 'Expand Image'}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* 2. SAGE COUNTDOWN BOX */}
      <div className="bg-[#FAF8F5] border border-[#D1E2D3] rounded-[32px] p-8 text-center space-y-6 text-[#2C3531]">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#E3EFE5] text-[#3D5239] text-xs font-bold font-serif">
          <span>🍃</span>
          <span>{details.eventDate} • {formatTime12Hour(details.eventTime, isRtl)}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto" dir="ltr">
          {[
            { label: isRtl ? 'أيام' : 'Days', val: timeLeft.days },
            { label: isRtl ? 'ساعات' : 'Hours', val: timeLeft.hours },
            { label: isRtl ? 'دقائق' : 'Mins', val: timeLeft.minutes },
            { label: isRtl ? 'ثواني' : 'Secs', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E3EFE5] shadow-sm">
              <span className="block font-serif font-bold text-2xl text-[#3D5239]">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#78887E]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#E3EFE5]">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#3D5239] text-[#FFFFFF] text-xs font-bold hover:bg-[#2F3F2C] transition-all flex items-center gap-2 shadow-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>{isRtl ? 'حفظ الموعد في التقويم' : 'Save Date in Calendar'}</span>
          </a>

          {details.rsvpDeadline && (
            <span className="text-xs text-[#78887E] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#3D5239]" />
              {isRtl ? `آخر موعد لتأكيد الحضور: ${details.rsvpDeadline}` : `RSVP Deadline: ${details.rsvpDeadline}`}
            </span>
          )}
        </div>
      </div>

      {/* 3. VENUE LOCATION */}
      <div className="bg-[#FAF8F5] border border-[#D1E2D3] rounded-[32px] p-8 space-y-6 text-center text-[#2C3531]">
        <div className="w-12 h-12 rounded-full bg-[#E3EFE5] flex items-center justify-center mx-auto text-[#3D5239]">
          <MapPin className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] tracking-[0.25em] text-[#5B7553] uppercase font-bold block">
            {isRtl ? 'مكان الحفل والحديقة' : 'Ceremony & Reception Location'}
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1E2B22] mt-1">
            {details.venueName}
          </h2>
          <p className="text-xs text-[#6B7B70] mt-1">{details.address}</p>
        </div>

        {details.googleMapsUrl && (
          <a
            href={details.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3D5239] text-[#FFFFFF] font-bold text-xs hover:bg-[#2F3F2C] transition-all shadow-md"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isRtl ? 'فتح اتجاهات خرائط Google' : 'Open Google Maps Directions'}</span>
          </a>
        )}

        {details.dressCode && (
          <div className="pt-4 border-t border-[#E3EFE5] text-xs text-[#55655B] flex items-center justify-center gap-2">
            <Shirt className="w-4 h-4 text-[#3D5239]" />
            <span>
              <strong>{isRtl ? 'طابع اللباس:' : 'Dress Code:'}</strong> {details.dressCode}
            </span>
          </div>
        )}
      </div>

      {/* 4. BOTANICAL SCHEDULE */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <div className="bg-[#FAF8F5] border border-[#D1E2D3] rounded-[32px] p-8 space-y-6 text-[#2C3531]">
          <h3 className="font-serif text-xl font-bold text-[#1E2B22] text-center">
            {isRtl ? 'برنامج اليوم' : 'Order of the Day'}
          </h3>

          <div className="space-y-4 max-w-xl mx-auto">
            {details.scheduleTimeline.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E3EFE5] flex items-start gap-4 shadow-sm"
              >
                <div className="px-3 py-1.5 rounded-full bg-[#E3EFE5] text-[#3D5239] font-serif text-xs font-bold">
                  {formatTime12Hour(item.time, isRtl)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1E2B22]">{item.title}</h4>
                  <p className="text-xs text-[#6B7B70] mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. GUESTBOOK & WISHES */}
      {details.enableGuestbook && (
        <div className="bg-[#FAF8F5] border border-[#D1E2D3] rounded-[32px] p-8 space-y-6 text-[#2C3531]">
          <h3 className="font-serif text-xl font-bold text-[#1E2B22] text-center">
            {isRtl ? 'أمنيات الضيوف وباقات الود' : 'Warm Messages & Wishes'}
          </h3>

          <form onSubmit={onAddWish} className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E3EFE5] space-y-3 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newWishAuthor}
                onChange={(e) => setNewWishAuthor(e.target.value)}
                placeholder={isRtl ? 'اسمك الكريم...' : 'Your Name...'}
                className="w-full bg-[#FAF8F5] border border-[#D1E2D3] rounded-xl p-3 text-xs text-[#1E2B22] focus:border-[#3D5239]"
              />
              <input
                type="text"
                value={newWishRelation}
                onChange={(e) => setNewWishRelation(e.target.value)}
                placeholder={isRtl ? 'صلة القرابة...' : 'Relation...'}
                className="w-full bg-[#FAF8F5] border border-[#D1E2D3] rounded-xl p-3 text-xs text-[#1E2B22] focus:border-[#3D5239]"
              />
            </div>
            <textarea
              required
              rows={2}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              placeholder={isRtl ? 'رسالتك اللطيفة...' : 'Your warm wish...'}
              className="w-full bg-[#FAF8F5] border border-[#D1E2D3] rounded-xl p-3 text-xs text-[#1E2B22] focus:border-[#3D5239]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#3D5239] text-[#FFFFFF] font-bold text-xs uppercase tracking-wider hover:bg-[#2F3F2C] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isRtl ? 'إرسال باقة التهنئة' : 'Send Floral Wish'}</span>
            </button>
            {wishSuccess && (
              <p className="text-xs text-emerald-600 text-center font-semibold">
                {isRtl ? 'شكراً لك! تم نشر تهنئتك بنجاح' : 'Thank you! Wish added successfully.'}
              </p>
            )}
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div key={w.id} className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E3EFE5] space-y-1 shadow-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#3D5239]">{w.authorName}</span>
                  <span className="text-[10px] text-[#78887E]">{w.relationship}</span>
                </div>
                <p className="text-xs text-[#55655B] italic">"{w.message}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. RSVP CALLOUT */}
      {details.enableRSVP && (
        <div className="text-center pt-4">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#3D5239] text-[#FFFFFF] font-serif font-bold text-sm tracking-wider shadow-[0_10px_30px_rgba(61,82,57,0.35)] hover:bg-[#2F3F2C] transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <UserCheck className="w-5 h-5" />
            <span>{isRtl ? 'تأكيد الحضور (RSVP)' : 'RSVP Online'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
