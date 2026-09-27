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
  Award,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';
import { formatTime12Hour } from '../../lib/dateUtils';

export const ArabicLuxuryLayout: React.FC<TemplateLayoutProps> = ({
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
      {/* 1. TRADITIONAL ARABESQUE ROYAL ARCH CARTOUCHE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1 }}
        className="relative bg-[#1A1612] border-2 border-[#C5A059] rounded-t-[120px] rounded-b-3xl p-8 sm:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden text-center"
        style={{
          background: 'linear-gradient(180deg, #1C1813 0%, #120F0C 100%)',
          borderColor: customColors.accent || '#C5A059',
        }}
      >
        {/* Subtle Arabesque Pattern Background Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Intricate Corner Gold Lace Details */}
        <div className="absolute top-4 left-4 text-[#C5A059] text-xs font-serif select-none">❖ ✦ ❖</div>
        <div className="absolute top-4 right-4 text-[#C5A059] text-xs font-serif select-none">❖ ✦ ❖</div>
        <div className="absolute bottom-4 left-4 text-[#C5A059] text-xs font-serif select-none">✦ ❖ ✦</div>
        <div className="absolute bottom-4 right-4 text-[#C5A059] text-xs font-serif select-none">✦ ❖ ✦</div>

        {/* Traditional Basmalah / Opening Calligraphy Banner */}
        <div className="max-w-md mx-auto mb-6 pt-4">
          <div className="inline-flex items-center justify-center px-6 py-2 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] text-sm font-arabic-calligraphy tracking-wider mb-3">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <p className="text-xs sm:text-sm text-[#D4AF37] font-arabic-calligraphy leading-relaxed">
            "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"
          </p>
        </div>

        {/* Host Families Formal Greeting */}
        <div className="my-6">
          <span className="text-[11px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block mb-2">
            {isRtl ? 'دعوة كريمة ومباركة من' : 'Cordially Invited By'}
          </span>
          <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#F7F4EE]">
            {details.hostNames}
          </h2>
        </div>

        {/* Royal Arch Frame for the Main Couple */}
        <div className="relative my-8 p-6 sm:p-8 rounded-3xl border border-[#C5A059]/40 bg-[#241E17]/80 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
            <Sparkles className="w-6 h-6" />
          </div>

          <h1
            className={`text-2xl sm:text-4xl font-extrabold text-[#F7F4EE] leading-snug mb-3 ${
              isRtl ? 'font-arabic-calligraphy' : 'font-playfair'
            }`}
          >
            {details.eventTitle}
          </h1>

          <p className="text-xs sm:text-sm text-[#E6DCBF]/80 max-w-xl mx-auto leading-relaxed">
            {details.customMessage}
          </p>

          {/* Groom & Bride Pedigree Cards */}
          {(details.groomName || details.brideName) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-[#C5A059]/30">
              {details.groomName && (
                <div className="p-5 rounded-2xl bg-[#1A1612] border border-[#C5A059]/30 text-center space-y-2">
                  <img
                    src={details.groomAvatarUrl || '/images/samples/groom_portrait.jpg'}
                    alt={details.groomName}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#C5A059] shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/samples/groom_portrait.jpg';
                    }}
                  />
                  <span className="text-[10px] text-[#C5A059] uppercase tracking-widest font-bold block">
                    {isRtl ? 'العريس' : 'The Groom'}
                  </span>
                  <h3 className="font-bold text-lg text-[#F7F4EE]">{details.groomName}</h3>
                  {details.groomParents && (
                    <p className="text-xs text-[#A89F91] italic">{details.groomParents}</p>
                  )}
                </div>
              )}

              {details.brideName && (
                <div className="p-5 rounded-2xl bg-[#1A1612] border border-[#C5A059]/30 text-center space-y-2">
                  <img
                    src={details.brideAvatarUrl || '/images/samples/bride_portrait.jpg'}
                    alt={details.brideName}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#C5A059] shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/samples/bride_portrait.jpg';
                    }}
                  />
                  <span className="text-[10px] text-[#C5A059] uppercase tracking-widest font-bold block">
                    {isRtl ? 'العروس' : 'The Bride'}
                  </span>
                  <h3 className="font-bold text-lg text-[#F7F4EE]">{details.brideName}</h3>
                  {details.brideParents && (
                    <p className="text-xs text-[#A89F91] italic">{details.brideParents}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cover Photo */}
        {details.coverImageUrl && (
          <div
            onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
            className="rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 max-h-80 shadow-2xl cursor-pointer group relative"
          >
            <img
              src={details.coverImageUrl}
              alt="Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2 font-semibold">
              <Maximize2 className="w-4 h-4" />
              <span>{isRtl ? 'تكبير صورة المناسبة' : 'Enlarge Cover Image'}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* 2. GOLDEN DATE COIN & COUNTDOWN */}
      <div className="bg-[#1C1813] border border-[#C5A059]/40 rounded-3xl p-8 text-center space-y-6 shadow-xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 text-[#C5A059] text-xs font-bold">
          <Calendar className="w-4 h-4" />
          <span>{details.eventDate} • {formatTime12Hour(details.eventTime, isRtl)}</span>
        </div>

        <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
          {isRtl ? 'الأيام المتبقية على بهجتنا الكبرى' : 'Countdown to the Sacred Celebration'}
        </h3>

        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto" dir="ltr">
          {[
            { label: isRtl ? 'أيام' : 'Days', val: timeLeft.days },
            { label: isRtl ? 'ساعات' : 'Hours', val: timeLeft.hours },
            { label: isRtl ? 'دقائق' : 'Mins', val: timeLeft.minutes },
            { label: isRtl ? 'ثواني' : 'Secs', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#241E17] border border-[#C5A059]/30">
              <span className="block font-playfair font-extrabold text-2xl text-[#C5A059]">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#A89F91]">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[#332A20] flex flex-wrap items-center justify-center gap-4">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#C5A059] text-[#120F0C] font-extrabold text-xs hover:bg-[#d8b56f] transition-all flex items-center gap-2 shadow-md"
          >
            <Calendar className="w-4 h-4" />
            <span>{isRtl ? 'إضافة إلى تقويم Google' : 'Save to Google Calendar'}</span>
          </a>

          {details.rsvpDeadline && (
            <span className="text-xs text-[#A89F91] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              {isRtl ? `آخر موعد للرد: ${details.rsvpDeadline}` : `RSVP Deadline: ${details.rsvpDeadline}`}
            </span>
          )}
        </div>
      </div>

      {/* 3. VENUE LOCATION & HOSPITALITY */}
      <div className="bg-[#1A1612] border border-[#C5A059]/40 rounded-3xl p-8 space-y-6 text-center shadow-xl">
        <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center mx-auto text-[#C5A059]">
          <MapPin className="w-6 h-6" />
        </div>

        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#C5A059] block">
            {isRtl ? 'قاعة الحفل وموقع الضيافة' : 'Venue & Hall'}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE] mt-1">
            {details.venueName}
          </h2>
          <p className="text-xs text-[#A89F91] mt-1 max-w-md mx-auto">{details.address}</p>
        </div>

        {details.googleMapsUrl && (
          <a
            href={details.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#120F0C] font-bold text-xs uppercase tracking-wider transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{isRtl ? 'عرض الموقع الدقيق على الخريطة' : 'Open Location in Google Maps'}</span>
          </a>
        )}

        {details.dressCode && (
          <div className="pt-4 border-t border-[#332A20] flex items-center justify-center gap-2 text-xs text-[#E6DCBF]">
            <Shirt className="w-4 h-4 text-[#C5A059]" />
            <span>
              <strong>{isRtl ? 'الزي المعتمد:' : 'Dress Code:'}</strong> {details.dressCode}
            </span>
          </div>
        )}
      </div>

      {/* 4. HOSPITALITY TIMELINE / PROGRAMME */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <div className="bg-[#1C1813] border border-[#C5A059]/40 rounded-3xl p-8 space-y-6">
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE] text-center">
            {isRtl ? 'مراسم وبرنامج الحفل' : 'Celebration Schedule'}
          </h3>

          <div className="space-y-4 max-w-xl mx-auto">
            {details.scheduleTimeline.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-2xl bg-[#241E17] border border-[#C5A059]/20 flex items-start gap-4"
              >
                <div className="px-3 py-1.5 rounded-xl bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] font-mono text-xs font-bold">
                  {formatTime12Hour(item.time, isRtl)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#F7F4EE]">{item.title}</h4>
                  <p className="text-xs text-[#A89F91] mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BANK GIFT REGISTRY */}
      {details.enableGiftRegistry && (
        <div className="bg-[#1A1612] border border-[#C5A059]/40 rounded-3xl p-8 text-center space-y-4">
          <Gift className="w-8 h-8 text-[#C5A059] mx-auto" />
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
            {isRtl ? 'هدية العروسين والتهنئة' : 'Gift Registry & Wishes'}
          </h3>
          <p className="text-xs text-[#A89F91] max-w-md mx-auto">
            {isRtl
              ? 'مشاركتكم فرحتنا هي الهدية الأغلى. ولمن أراد التفضل بتقديم تهنئة رقمية مسبقة عبر الحسابات البنكية:'
              : 'Your presence brings us joy. For those who wish to extend a gift through bank transfer:'}
          </p>
          <button
            onClick={onOpenBank}
            className="px-6 py-3 rounded-2xl bg-[#241E17] border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-[#120F0C] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            {isRtl ? 'بيانات التحويل البنكي ورمز QR' : 'View Bank Transfer Info & QR'}
          </button>
        </div>
      )}

      {/* 6. GUESTBOOK WISHES */}
      {details.enableGuestbook && (
        <div className="bg-[#1C1813] border border-[#C5A059]/40 rounded-3xl p-8 space-y-6">
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE] text-center">
            {isRtl ? 'سجل دعوات وتهاني الضيوف' : 'Guestbook & Warm Wishes'}
          </h3>

          <form onSubmit={onAddWish} className="p-4 rounded-2xl bg-[#241E17] border border-[#332A20] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={newWishAuthor}
                onChange={(e) => setNewWishAuthor(e.target.value)}
                placeholder={isRtl ? 'الاسم الكريم...' : 'Your Name...'}
                className="w-full bg-[#1A1612] border border-[#332A20] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#C5A059]"
              />
              <input
                type="text"
                value={newWishRelation}
                onChange={(e) => setNewWishRelation(e.target.value)}
                placeholder={isRtl ? 'صلة القرابة (صديق، قريب...)...' : 'Relation (Friend, Cousin...)...'}
                className="w-full bg-[#1A1612] border border-[#332A20] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#C5A059]"
              />
            </div>
            <textarea
              required
              rows={2}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              placeholder={isRtl ? 'اكتب تبريكاتك ودعواتك للعروسين بالبركة...' : 'Write your prayer and blessing...'}
              className="w-full bg-[#1A1612] border border-[#332A20] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#C5A059]"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C5A059] text-[#120F0C] font-bold text-xs uppercase tracking-wider hover:bg-[#d8b56f] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isRtl ? 'إرسال التهنئة المباركة' : 'Post Your Blessings'}</span>
            </button>
            {wishSuccess && (
              <p className="text-xs text-emerald-400 text-center font-semibold">
                {isRtl ? 'جزاك الله خيراً، تم إرسال تبريكك بنجاح!' : 'Your blessing was recorded!'}
              </p>
            )}
          </form>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div key={w.id} className="p-4 rounded-xl bg-[#241E17] border border-[#332A20] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#C5A059]">{w.authorName}</span>
                  <span className="text-[10px] text-[#A89F91]">{w.relationship}</span>
                </div>
                <p className="text-xs text-[#E6DCBF] italic">{w.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. RSVP CALLOUT */}
      {details.enableRSVP && (
        <div className="text-center pt-4">
          <button
            onClick={onOpenRsvp}
            className="w-full sm:w-auto px-12 py-5 rounded-full bg-gradient-to-r from-[#C5A059] via-[#d8b56f] to-[#C5A059] text-[#120F0C] font-extrabold text-sm uppercase tracking-widest shadow-[0_10px_40px_rgba(197,160,89,0.5)] hover:scale-105 transition-all cursor-pointer flex items-center justify-center gap-3 mx-auto"
          >
            <UserCheck className="w-5 h-5" />
            <span>{isRtl ? 'تأكيد الحضور والمشاركة (RSVP)' : 'Confirm Your Attendance (RSVP)'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
