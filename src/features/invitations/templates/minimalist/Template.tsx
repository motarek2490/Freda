import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Sparkles,
  Crown,
  ChevronDown,
  MessageCircle,
  Camera,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';

export const MinimalistLayout: React.FC<TemplateLayoutProps> = ({
  invitation,
  lang,
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
  const [waxSealOpened, setWaxSealOpened] = useState(false);

  const groomName = details.groomName || (isRtl ? 'حُسـام الدسوقـي' : 'Hossam El-Desouky');
  const brideName = details.brideName || (isRtl ? 'دِينـا الجوهـري' : 'Dina El-Gohary');
  const groomInitial = groomName.trim().charAt(0) || 'H';
  const brideInitial = brideName.trim().charAt(0) || 'D';

  const groomImg = details.groomAvatarUrl || '/images/samples/groom_portrait.jpg';
  const brideImg = details.brideAvatarUrl || '/images/samples/bride_portrait.jpg';
  const coverImg = details.coverImageUrl || '/images/samples/couple_seafront_terrace_1790456664887.jpg';

  const accentColor = customColors.accent || '#C9A86A';

  return (
    <div className="space-y-12 sm:space-y-16 py-6 font-serif-header text-[#1C1917] selection:bg-[#C9A86A]/20">
      {/* 1. HAUTE COUTURE 2026 WAX SEAL / ENVELOPE INTRO SEAL */}
      {!waxSealOpened && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EC] to-[#EFECE6] border border-[#C9A86A]/40 rounded-3xl p-8 sm:p-12 text-center shadow-xl overflow-hidden space-y-6"
        >
          {/* Subtle Monogram Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="font-playfair text-9xl font-bold text-[#1C1917]">
              {groomInitial}{brideInitial}
            </span>
          </div>

          <div className="relative z-10 space-y-4 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C1917] text-[#C9A86A] text-[10px] font-mono tracking-[0.25em] uppercase shadow-sm">
              <Crown className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{isRtl ? 'دعوة زفاف خاصة — هوت كوتور 2026' : 'Haute Couture 2026 Invitation'}</span>
            </div>

            <p className="text-xs uppercase tracking-widest text-[#78716C] font-sans-body">
              {details.hostNames || (isRtl ? 'يتشرفان بدعوتكم لحضور حفل الزفاف' : 'Requests the pleasure of your company')}
            </p>

            <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-[#1C1917] tracking-tight leading-tight">
              {groomName} <span className="text-[#C9A86A] font-light">&amp;</span> {brideName}
            </h1>

            {/* Interactive Wax Seal Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setWaxSealOpened(true)}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#1C1917] via-[#2A2421] to-[#1C1917] text-[#F5F2EC] text-xs font-mono font-bold tracking-widest uppercase hover:shadow-[0_0_30px_rgba(201,168,106,0.4)] transition-all cursor-pointer border border-[#C9A86A]/60"
              >
                <span className="w-7 h-7 rounded-full bg-[#C9A86A] text-[#1C1917] flex items-center justify-center font-bold text-[11px] shadow-sm">
                  {groomInitial}{brideInitial}
                </span>
                <span>{isRtl ? 'افتح الدعوة الملكية 📜' : 'Open Royal Invitation'}</span>
                <Sparkles className="w-4 h-4 text-[#C9A86A] group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* MAIN INVITATION BODY */}
      <AnimatePresence>
        {(waxSealOpened || true) && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-12 sm:space-y-16"
          >
            {/* 2. EDITORIAL HERO SECTION */}
            <div className="relative bg-[#FAF8F5] border border-[#C9A86A]/30 rounded-3xl p-6 sm:p-12 shadow-lg overflow-hidden space-y-8">
              {/* Background Geometric Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#C9A86A]/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="text-center space-y-4 max-w-2xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.3em] uppercase text-[#C9A86A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'HAUTE COUTURE EDITORIAL 2026' : 'CLASSIC HAUTE COUTURE 2026'}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-[#1C1917] tracking-tight leading-tight">
                  {details.eventTitle}
                </h1>

                <div className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-playfair text-[#1C1917] pt-2">
                  <span className="font-semibold">{groomName}</span>
                  <span className="text-[#C9A86A] font-light text-xl sm:text-2xl">&amp;</span>
                  <span className="font-semibold">{brideName}</span>
                </div>

                {/* Parents Note */}
                {(details.groomParents || details.brideParents) && (
                  <p className="text-xs text-[#78716C] font-sans-body max-w-lg mx-auto leading-relaxed pt-1">
                    {details.groomParents && details.brideParents
                      ? (isRtl ? `ببركة وتبريكات ${details.groomParents} و ${details.brideParents}` : `With the blessings of ${details.groomParents} & ${details.brideParents}`)
                      : (details.groomParents || details.brideParents)}
                  </p>
                )}

                {/* Poetic Message */}
                {details.customMessage && (
                  <p className="text-xs sm:text-sm text-[#44403C] font-sans-body font-light leading-relaxed max-w-xl mx-auto pt-2 border-t border-[#C9A86A]/20">
                    "{details.customMessage}"
                  </p>
                )}
              </div>

              {/* Cover Image Showcase */}
              <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border border-[#C9A86A]/30 shadow-md group cursor-pointer">
                <img
                  src={coverImg}
                  alt="Wedding Cover"
                  className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/samples/couple_seafront_terrace_1790456664887.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent flex items-end justify-between p-6 opacity-90 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-mono text-[#F5F2EC] flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-[#C9A86A]" />
                    <span>{details.venueName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveLightboxImg(coverImg)}
                    className="p-2.5 rounded-full bg-[#1C1917]/80 backdrop-blur-md text-[#F5F2EC] border border-[#C9A86A]/40 hover:bg-[#C9A86A] hover:text-[#1C1917] transition-all"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. GROOM & BRIDE ELEGANT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 max-w-2xl mx-auto">
                <div className="p-6 rounded-2xl bg-white border border-[#C9A86A]/30 shadow-sm text-center space-y-3 relative overflow-hidden group hover:border-[#C9A86A] transition-colors">
                  <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-[#C9A86A] p-1 shadow-md bg-[#FAF8F5]">
                    <img
                      src={groomImg}
                      alt={groomName}
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/samples/groom_portrait.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C9A86A] uppercase tracking-[0.25em] font-mono font-bold block">
                      {isRtl ? 'العريس' : 'The Groom'}
                    </span>
                    <h3 className="font-playfair font-bold text-xl text-[#1C1917] mt-0.5">{groomName}</h3>
                    {details.groomParents && <p className="text-xs text-[#78716C] font-sans-body italic mt-1">{details.groomParents}</p>}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border border-[#C9A86A]/30 shadow-sm text-center space-y-3 relative overflow-hidden group hover:border-[#C9A86A] transition-colors">
                  <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-2 border-[#C9A86A] p-1 shadow-md bg-[#FAF8F5]">
                    <img
                      src={brideImg}
                      alt={brideName}
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/samples/bride_portrait.jpg';
                      }}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C9A86A] uppercase tracking-[0.25em] font-mono font-bold block">
                      {isRtl ? 'العروس' : 'The Bride'}
                    </span>
                    <h3 className="font-playfair font-bold text-xl text-[#1C1917] mt-0.5">{brideName}</h3>
                    {details.brideParents && <p className="text-xs text-[#78716C] font-sans-body italic mt-1">{details.brideParents}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. GLOWING COUNTDOWN & SAVE THE DATE CARD */}
            <div className="bg-[#1C1917] text-[#F5F2EC] border border-[#C9A86A]/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-start">
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C9A86A] flex items-center justify-center md:justify-start gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'العد التنازلي لليلة العمر' : 'COUNTDOWN TO THE MOMENT'}</span>
                </span>
                <h3 className="text-lg sm:text-xl font-playfair font-bold text-[#F5F2EC]">
                  {details.eventDate} <span className="text-xs font-mono text-[#A8A29E]">({details.eventTime})</span>
                </h3>
              </div>

              {/* Countdown Digits */}
              <div className="flex items-center gap-4 sm:gap-6 font-mono text-center" dir="ltr">
                <div className="bg-[#2A2421] border border-[#C9A86A]/30 rounded-2xl px-3.5 py-2.5 min-w-[64px]">
                  <span className="block text-2xl sm:text-3xl font-bold text-[#C9A86A]">{timeLeft.days}</span>
                  <span className="text-[9px] uppercase text-[#A8A29E]">{isRtl ? 'أيام' : 'Days'}</span>
                </div>
                <span className="text-xl text-[#C9A86A] font-bold">:</span>
                <div className="bg-[#2A2421] border border-[#C9A86A]/30 rounded-2xl px-3.5 py-2.5 min-w-[64px]">
                  <span className="block text-2xl sm:text-3xl font-bold text-[#F5F2EC]">{timeLeft.hours}</span>
                  <span className="text-[9px] uppercase text-[#A8A29E]">{isRtl ? 'ساعات' : 'Hours'}</span>
                </div>
                <span className="text-xl text-[#C9A86A] font-bold">:</span>
                <div className="bg-[#2A2421] border border-[#C9A86A]/30 rounded-2xl px-3.5 py-2.5 min-w-[64px]">
                  <span className="block text-2xl sm:text-3xl font-bold text-[#F5F2EC]">{timeLeft.minutes}</span>
                  <span className="text-[9px] uppercase text-[#A8A29E]">{isRtl ? 'دقائق' : 'Mins'}</span>
                </div>
              </div>

              {/* Save Date Button */}
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] text-[#1C1917] text-xs font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(201,168,106,0.4)] transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{isRtl ? 'إضافة إلى التقويم' : 'Save To Calendar'}</span>
              </a>
            </div>

            {/* 5. VENUE & LOCATION DETAILS */}
            <div className="bg-[#FAF8F5] border border-[#C9A86A]/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#C9A86A]/20 pb-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A86A] uppercase flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'المكان والعنوان' : 'VENUE & LOCATION'}</span>
                  </span>
                  <h2 className="text-2xl font-playfair font-bold text-[#1C1917]">{details.venueName}</h2>
                  <p className="text-xs text-[#78716C] font-sans-body">{details.address}</p>
                </div>

                {details.googleMapsUrl && (
                  <a
                    href={details.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-2xl bg-[#1C1917] hover:bg-[#2A2421] text-[#F5F2EC] text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <span>{isRtl ? 'افتح الخريطة (Google Maps)' : 'Open Map'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#C9A86A]" />
                  </a>
                )}
              </div>

              {details.dressCode && (
                <div className="flex items-center gap-3 p-4 bg-[#F5F2EC] rounded-2xl border border-[#C9A86A]/20 text-xs font-sans-body text-[#44403C]">
                  <Shirt className="w-4 h-4 text-[#C9A86A] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1C1917]">{isRtl ? 'قواعد اللباس (Dress Code):' : 'Dress Code:'} </span>
                    <span>{details.dressCode}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. EVENT PROGRAMME TIMELINE */}
            {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
              <div className="bg-[#FAF8F5] border border-[#C9A86A]/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A86A] uppercase">
                    {isRtl ? 'برنامج السهرة الملكية' : 'EVENING PROGRAMME'}
                  </span>
                  <h3 className="text-2xl font-playfair font-bold text-[#1C1917]">
                    {isRtl ? 'جدول الفقرات والمواعيد' : 'Timeline Schedule'}
                  </h3>
                </div>

                <div className="relative space-y-4 max-w-xl mx-auto pt-2">
                  <div className="absolute top-3 bottom-3 left-4 sm:left-1/2 -ml-px w-0.5 bg-[#C9A86A]/30 pointer-events-none" />

                  {details.scheduleTimeline.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-[#F5F2EC] border border-[#C9A86A]/20 rounded-2xl shadow-sm hover:border-[#C9A86A] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#1C1917] text-[#C9A86A] font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {item.time}
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#1C1917]">{item.title}</h4>
                          {item.description && (
                            <p className="text-[11px] text-[#78716C] font-sans-body mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. PHOTO GALLERY SHOWCASE */}
            {details.enableGallery && details.galleryImages && details.galleryImages.length > 0 && (
              <div className="bg-[#FAF8F5] border border-[#C9A86A]/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A86A] uppercase">
                    {isRtl ? 'معرض الذكريات والصور' : 'MEMORY GALLERY'}
                  </span>
                  <h3 className="text-2xl font-playfair font-bold text-[#1C1917]">
                    {isRtl ? 'أجمل اللحظات' : 'Cherished Moments'}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {details.galleryImages.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveLightboxImg(imgUrl)}
                      className="relative rounded-2xl overflow-hidden border border-[#C9A86A]/20 h-40 sm:h-52 cursor-pointer group shadow-sm"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${i}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/samples/couple_rings_hands_1790456674517.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-5 h-5 text-[#C9A86A]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. RSVP ACTION BUTTON & BANK REGISTRY */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {details.enableRSVP && (
                <button
                  type="button"
                  onClick={onOpenRsvp}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1C1917] text-[#C9A86A] border border-[#C9A86A]/60 font-mono font-bold text-xs tracking-widest uppercase hover:bg-[#C9A86A] hover:text-[#1C1917] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Attendance'}</span>
                </button>
              )}

              {details.enableGiftRegistry && (
                <button
                  type="button"
                  onClick={onOpenBank}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FAF8F5] text-[#1C1917] border border-[#C9A86A]/40 font-mono font-bold text-xs tracking-widest uppercase hover:bg-[#F5F2EC] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 text-[#C9A86A]" />
                  <span>{isRtl ? 'صندوق الهدايا والتهاني' : 'Gift Registry'}</span>
                </button>
              )}
            </div>

            {/* 9. GUESTBOOK / WISHES SECTION */}
            {details.enableGuestbook && (
              <div className="bg-[#FAF8F5] border border-[#C9A86A]/30 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C9A86A] uppercase">
                    {isRtl ? 'دفتر التهاني والذكريات' : 'GUESTBOOK WISHES'}
                  </span>
                  <h3 className="text-2xl font-playfair font-bold text-[#1C1917]">
                    {isRtl ? 'كلمات المحبة من الأهل والأصدقاء' : 'Warm Messages'}
                  </h3>
                </div>

                {/* Wish Submission Form */}
                <div className="bg-[#F5F2EC] border border-[#C9A86A]/20 rounded-2xl p-4 sm:p-6 space-y-4 max-w-xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={isRtl ? 'اسمك الكريم' : 'Your Name'}
                      value={newWishAuthor}
                      onChange={(e) => setNewWishAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C9A86A]/30 text-xs text-[#1C1917] focus:outline-none focus:border-[#C9A86A]"
                    />
                    <input
                      type="text"
                      placeholder={isRtl ? 'صلة القرابة (مثال: صديق، قريب)' : 'Relationship (e.g. Friend)'}
                      value={newWishRelation}
                      onChange={(e) => setNewWishRelation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C9A86A]/30 text-xs text-[#1C1917] focus:outline-none focus:border-[#C9A86A]"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder={isRtl ? 'اكتب تهنئتك القلبية للعروسين...' : 'Write your congratulations...'}
                    value={newWishMessage}
                    onChange={(e) => setNewWishMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C9A86A]/30 text-xs text-[#1C1917] focus:outline-none focus:border-[#C9A86A]"
                  />
                  <button
                    type="button"
                    onClick={onAddWish}
                    className="w-full py-3 rounded-xl bg-[#1C1917] text-[#C9A86A] font-mono font-bold text-xs uppercase hover:bg-[#2A2421] transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إرسال التهنئة' : 'Send Message'}</span>
                  </button>
                  {wishSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs text-center font-sans-body">
                      {isRtl ? 'تم إرسال تهنئتك بنجاح! شكراً لك ❤️' : 'Your message has been sent! Thank you ❤️'}
                    </div>
                  )}
                </div>

                {/* Wishes List */}
                {wishes && wishes.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
                    {wishes.map((w) => (
                      <div key={w.id} className="p-4 rounded-2xl bg-white border border-[#C9A86A]/20 shadow-sm space-y-2">
                        <div className="flex items-center justify-between border-b border-[#C9A86A]/10 pb-2">
                          <span className="font-bold text-xs text-[#1C1917]">{w.authorName}</span>
                          <span className="text-[10px] text-[#C9A86A] font-mono">{w.relationship}</span>
                        </div>
                        <p className="text-xs text-[#44403C] font-sans-body leading-relaxed">{w.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
