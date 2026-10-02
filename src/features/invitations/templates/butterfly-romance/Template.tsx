import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Send,
  Users,
  Gift,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';
import { formatTime12Hour } from '../../../../lib/dateUtils';

export const ButterflyRomanceLayout: React.FC<TemplateLayoutProps> = ({
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

  // Romantic Ivory & Rose Color Palette
  const ivoryBg = customColors?.bg || '#FAF7F2';
  const cardIvory = customColors?.cardBg || '#FFFFFF';
  const charcoalText = customColors?.text || '#2B2625';
  const maroonAccent = customColors?.accent || '#7A1F35';
  const roseSoft = '#E8B4B8';
  const envelopeBurgundy = '#38141C';

  // Envelope Opening State
  const [isOpened, setIsOpened] = useState(false);
  const [hasStartedOpening, setHasStartedOpening] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleOpenEnvelope = () => {
    if (isOpened || hasStartedOpening) return;
    setHasStartedOpening(true);
    if (prefersReducedMotion) {
      setIsOpened(true);
    } else {
      setTimeout(() => {
        setIsOpened(true);
      }, 1100);
    }
  };

  // Names parsing
  const groom = details.groomName || (isRtl ? 'كريم الشناوي' : 'Karim El-Shennawy');
  const bride = details.brideName || (isRtl ? 'فريدة الشاذلي' : 'Farida El-Shazly');

  const kickerText = isRtl
    ? (details.eventTitle || 'يسعدنا أن تشاركونا فرحة العمر')
    : (details.customMessage ? 'WE’RE GETTING MARRIED' : 'WE’RE GETTING MARRIED');

  const inviteSubtitle = isRtl
    ? 'دعوة خاصة لليلة العمر'
    : 'You Are Cordially Invited';

  const scriptFontClass = isRtl
    ? "font-['Aref_Ruqaa','Amiri',serif]"
    : "font-['Alex_Brush',cursive]";

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen relative overflow-x-hidden transition-colors duration-1000 select-none selection:bg-[#E8B4B8] selection:text-[#2B2625]"
      style={{
        backgroundColor: isOpened ? ivoryBg : envelopeBurgundy,
        fontFamily: isRtl ? "'Cairo', sans-serif" : "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* --------------------------------------------------------------------- */}
      {/* 1. INTRO: 4-WAY OUTWARD FLAP ENVELOPE OPENING EXPERIENCE             */}
      {/* --------------------------------------------------------------------- */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onClick={handleOpenEnvelope}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer overflow-hidden bg-[#240A10]"
          >
            {/* Subtle Debossed Floral Background Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#E8B4B8 1px, transparent 1px), radial-gradient(#E8B4B8 1px, #240A10 1px)`,
                backgroundSize: '32px 32px',
                backgroundPosition: '0 0, 16px 16px',
              }}
            />

            {/* Ambient Warm Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80 pointer-events-none" />

            {/* 4-Way Flap Container */}
            <div className="relative w-[92vw] max-w-[440px] h-[580px] rounded-2xl shadow-2xl overflow-hidden border border-[#D48C95]/30 flex items-center justify-center bg-[#38141C]">
              {/* Embossed Paper Texture Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/20 pointer-events-none" />

              {/* TOP FLAP */}
              <motion.div
                initial={{ rotateX: 0, y: 0 }}
                animate={
                  hasStartedOpening && !prefersReducedMotion
                    ? { rotateX: 160, y: -160, opacity: 0 }
                    : { rotateX: 0, y: 0 }
                }
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                style={{ transformOrigin: 'top center' }}
                className="absolute top-0 left-0 right-0 h-1/2 bg-[#421721] border-b border-[#D48C95]/40 shadow-lg z-20"
                style-clip-path="polygon(0 0, 100% 0, 50% 100%)"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
              </motion.div>

              {/* BOTTOM FLAP */}
              <motion.div
                initial={{ rotateX: 0, y: 0 }}
                animate={
                  hasStartedOpening && !prefersReducedMotion
                    ? { rotateX: -160, y: 160, opacity: 0 }
                    : { rotateX: 0, y: 0 }
                }
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                style={{ transformOrigin: 'bottom center' }}
                className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#36121B] border-t border-[#D48C95]/30 shadow-lg z-20"
              />

              {/* LEFT FLAP */}
              <motion.div
                initial={{ rotateY: 0, x: 0 }}
                animate={
                  hasStartedOpening && !prefersReducedMotion
                    ? { rotateY: -160, x: -160, opacity: 0 }
                    : { rotateY: 0, x: 0 }
                }
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                style={{ transformOrigin: 'left center' }}
                className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#3A151E] border-r border-[#D48C95]/20 shadow-md z-10"
              />

              {/* RIGHT FLAP */}
              <motion.div
                initial={{ rotateY: 0, x: 0 }}
                animate={
                  hasStartedOpening && !prefersReducedMotion
                    ? { rotateY: 160, x: 160, opacity: 0 }
                    : { rotateY: 0, x: 0 }
                }
                transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
                style={{ transformOrigin: 'right center' }}
                className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#321118] border-l border-[#D48C95]/20 shadow-md z-10"
              />

              {/* Center Seal / Tap Button (Visible before click) */}
              {!hasStartedOpening && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-30 flex flex-col items-center gap-3 text-center px-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E8B4B8] to-[#9C384D] p-0.5 shadow-xl animate-pulse">
                    <div className="w-full h-full rounded-full bg-[#38141C] flex items-center justify-center border border-[#E8B4B8]/40">
                      <Sparkles className="w-7 h-7 text-[#E8B4B8]" />
                    </div>
                  </div>
                  <span className="font-serif text-sm tracking-widest text-[#E8B4B8] uppercase font-semibold">
                    {isRtl ? 'انقر لفتح الدعوة الملكية' : 'TAP TO OPEN INVITATION'}
                  </span>
                  <span className="text-[11px] text-[#E8B4B8]/70 font-light">
                    {groom} & {bride}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --------------------------------------------------------------------- */}
      {/* 2. REVEALED INVITATION CONTENT (Cream / Ivory Romantic Editorial)   */}
      {/* --------------------------------------------------------------------- */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center">
        
        {/* PERSISTENT ANCHORED VECTOR BUTTERFLY ILLUSTRATION */}
        {/* Soft pink / lilac wings with gold-outlined vein details */}
        <div className="sticky top-6 z-40 my-4 flex flex-col items-center pointer-events-none">
          <ButterflyVectorIllustration prefersReducedMotion={prefersReducedMotion} />
        </div>

        {/* MAIN INVITATION CARD CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: isOpened ? 0.1 : 0.4 }}
          style={{ backgroundColor: cardIvory }}
          className="w-full rounded-3xl p-8 sm:p-14 shadow-2xl border border-[#EBE3D7] relative overflow-hidden text-center space-y-10"
        >
          {/* Subtle Corner Florals & Watermark */}
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-[#E8B4B8]/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-[#7A1F35]/10 blur-2xl pointer-events-none" />

          {/* 1. SMALL LETTER-SPACED MAROON KICKER */}
          <div className="pt-2">
            <span
              className={
                isRtl
                  ? 'text-xs sm:text-sm font-bold text-[#7A1F35] block'
                  : 'text-[11px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#7A1F35] block'
              }
            >
              {kickerText}
            </span>
          </div>

          {/* 2. COUPLE NAMES IN LARGE SCRIPT FONT WITH DUAL-TONE & */}
          <div className="py-2 space-y-2">
            {/* Groom Name */}
            <div className={`${scriptFontClass} text-4xl sm:text-6xl text-[#2B2625] leading-tight drop-shadow-sm`}>
              {groom}
            </div>

            {/* Dual-Tone Decorative Ampersand / Connector */}
            <div className="relative inline-flex items-center justify-center my-1">
              <span className={`${scriptFontClass} text-4xl sm:text-5xl text-[#E8B4B8]/80 absolute -top-0.5 -left-0.5 select-none`}>
                &
              </span>
              <span className={`${scriptFontClass} text-4xl sm:text-5xl text-[#2B2625] relative z-10 select-none`}>
                &
              </span>
            </div>

            {/* Bride Name */}
            <div className={`${scriptFontClass} text-4xl sm:text-6xl text-[#2B2625] leading-tight drop-shadow-sm`}>
              {bride}
            </div>
          </div>

          {/* 3. SAVE THE DATE / YOU'RE INVITED IN SCRIPT */}
          <div className="space-y-1">
            <span className={`${scriptFontClass} text-2xl sm:text-3xl text-[#7A1F35]/90 block`}>
              {inviteSubtitle}
            </span>
            {details.customMessage && (
              <p className="text-xs sm:text-sm text-[#5C5250] max-w-md mx-auto leading-relaxed pt-2 font-serif italic">
                "{details.customMessage}"
              </p>
            )}
          </div>

          {/* DIVIDER LINE WITH PETAL FLOURISH */}
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto py-1">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D48C95]/50 to-transparent" />
            <div className="w-2 h-2 rotate-45 bg-[#7A1F35]" />
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D48C95]/50 to-transparent" />
          </div>

          {/* 4. EVENT DATE IN SPACED SERIF CAPS */}
          <div className="space-y-2">
            <div className="font-serif tracking-[0.25em] uppercase text-sm sm:text-base font-bold text-[#2B2625]">
              {details.eventDate}
            </div>
            {details.eventTime && (
              <div className="text-xs font-serif text-[#7A1F35] font-semibold tracking-wider">
                {formatTime12Hour(details.eventTime, isRtl)}
              </div>
            )}
          </div>

          {/* 5. TIME AND VENUE DETAILS IN SMALL REFINED SERIF */}
          <div className="bg-[#FAF6F0] rounded-2xl p-6 border border-[#E8DFC8]/60 space-y-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-[#7A1F35]">
              <MapPin className="w-4 h-4" />
              <span className="font-serif font-bold text-sm text-[#2B2625]">
                {details.venueName || (isRtl ? 'قصر الأفراح الملكي' : 'Royal Palace Hall')}
              </span>
            </div>
            {details.address && (
              <p className="text-xs text-[#6B5F5D] leading-relaxed font-serif">
                {details.address}
              </p>
            )}
            {details.dressCode && (
              <div className="pt-2 border-t border-[#E8DFC8]/40 text-[11px] text-[#7A1F35] font-medium tracking-wide">
                <span>{isRtl ? 'الزي المفضل:' : 'Dress Code:'} </span>
                <span className="font-serif">{details.dressCode}</span>
              </div>
            )}
          </div>

          {/* ACTION BUTTONS: Add to Calendar & Google Maps */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2B2625] text-[#FAF7F2] hover:bg-[#7A1F35] text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة للتقويم' : 'Add to Calendar'}</span>
            </a>

            {details.googleMapsUrl && (
              <a
                href={details.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF6F0] text-[#7A1F35] border border-[#7A1F35]/30 hover:bg-[#7A1F35] hover:text-[#FAF7F2] text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isRtl ? 'موقع القاعة (GPS)' : 'Get Directions'}</span>
              </a>
            )}
          </div>

          {/* COUNTDOWN TIMER BADGE */}
          <div className="pt-4">
            <div className="text-[11px] font-serif uppercase tracking-[0.2em] text-[#7A1F35] mb-3 font-semibold">
              {isRtl ? 'العد التنازلي لليلة العمر' : 'COUNTDOWN TO THE BIG DAY'}
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
              {[
                { label: isRtl ? 'يوم' : 'Days', val: timeLeft.days },
                { label: isRtl ? 'ساعة' : 'Hours', val: timeLeft.hours },
                { label: isRtl ? 'دقيقة' : 'Mins', val: timeLeft.minutes },
                { label: isRtl ? 'ثانية' : 'Secs', val: timeLeft.seconds },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF6F0] rounded-xl p-2.5 border border-[#E8DFC8]/60 flex flex-col items-center"
                >
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#2B2625]">
                    {item.val}
                  </span>
                  <span className="text-[9px] text-[#7A1F35] uppercase tracking-wider font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PRIMARY RSVP TRIGGER BUTTON */}
          {details.enableRSVP && (
            <div className="pt-4">
              <button
                onClick={onOpenRsvp}
                className="w-full max-w-sm py-4 px-8 rounded-full bg-gradient-to-r from-[#7A1F35] to-[#9C384D] text-[#FAF7F2] text-sm font-bold tracking-widest uppercase hover:brightness-110 shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <Heart className="w-4 h-4 text-[#E8B4B8]" />
                <span>{isRtl ? 'تأكيد الحضور (RSVP)' : 'CONFIRM ATTENDANCE'}</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* ------------------------------------------------------------------- */}
        {/* 3. OPTIONAL MODULES: SCHEDULE, GALLERY, WISHES, GIFTS               */}
        {/* ------------------------------------------------------------------- */}

        {/* SCHEDULE TIMELINE */}
        {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
          <div className="w-full mt-12 bg-white rounded-3xl p-8 border border-[#EBE3D7] shadow-lg text-center space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2B2625]">
              {isRtl ? 'برنامج الحفل' : 'Event Timeline'}
            </h3>
            <div className="space-y-4 max-w-md mx-auto text-start">
              {details.scheduleTimeline.map((item, i) => (
                <div key={item.id || i} className="flex items-start gap-4 p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]/60">
                  <div className="w-16 text-xs font-mono font-bold text-[#7A1F35] pt-0.5">
                    {item.time}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B2625]">{item.title}</h4>
                    {item.description && (
                      <p className="text-[11px] text-[#6B5F5D] mt-0.5">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHOTO GALLERY */}
        {details.enableGallery && details.galleryImages && details.galleryImages.length > 0 && (
          <div className="w-full mt-12 bg-white rounded-3xl p-8 border border-[#EBE3D7] shadow-lg text-center space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2B2625]">
              {isRtl ? 'ألبوم الصور التذكارية' : 'Memories & Gallery'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {details.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxImg(img)}
                  className="aspect-square rounded-2xl overflow-hidden border border-[#EBE3D7] shadow-sm cursor-pointer group relative"
                >
                  <img
                    src={img}
                    alt="Wedding memory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#7A1F35]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GUESTBOOK WISHES */}
        {details.enableGuestbook && (
          <div className="w-full mt-12 bg-white rounded-3xl p-8 border border-[#EBE3D7] shadow-lg space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#2B2625] text-center">
              {isRtl ? 'دفتر تهاني العروسين' : 'Guestbook & Wishes'}
            </h3>

            {/* Wish Submission Form */}
            <form onSubmit={onAddWish} className="space-y-3 max-w-md mx-auto">
              <input
                type="text"
                required
                value={newWishAuthor}
                onChange={(e) => setNewWishAuthor(e.target.value)}
                placeholder={isRtl ? 'الاسم الكريم' : 'Your Full Name'}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D7] bg-[#FAF7F2] text-xs text-[#2B2625] focus:outline-none focus:border-[#7A1F35]"
              />
              <input
                type="text"
                value={newWishRelation}
                onChange={(e) => setNewWishRelation(e.target.value)}
                placeholder={isRtl ? 'صلة القرابة أو الصداقة (اختياري)' : 'Relationship (Optional)'}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D7] bg-[#FAF7F2] text-xs text-[#2B2625] focus:outline-none focus:border-[#7A1F35]"
              />
              <textarea
                required
                rows={3}
                value={newWishMessage}
                onChange={(e) => setNewWishMessage(e.target.value)}
                placeholder={isRtl ? 'اكتب تهنئتك القلبية للعروسين...' : 'Write your congratulations message...'}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EBE3D7] bg-[#FAF7F2] text-xs text-[#2B2625] focus:outline-none focus:border-[#7A1F35] resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#7A1F35] text-white text-xs font-bold hover:bg-[#9C384D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إرسال التهنئة' : 'Send Congratulations'}</span>
              </button>
              {wishSuccess && (
                <p className="text-xs text-emerald-700 font-bold text-center">
                  {isRtl ? '✨ تم إرسال تهنئتكم بنجاح!' : '✨ Message sent successfully!'}
                </p>
              )}
            </form>

            {/* Wishes Feed */}
            {wishes && wishes.length > 0 && (
              <div className="space-y-3 max-w-md mx-auto pt-4 border-t border-[#EBE3D7]">
                {wishes.slice(0, 6).map((w, i) => (
                  <div key={w.id || i} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EBE3D7]/60 space-y-1 text-start">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#2B2625]">{w.authorName}</span>
                      {w.relationship && (
                        <span className="text-[10px] text-[#7A1F35] bg-[#E8B4B8]/20 px-2 py-0.5 rounded-full font-medium">
                          {w.relationship}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5C5250] font-serif leading-relaxed">
                      "{w.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BANK / GIFT REGISTRY */}
        {details.enableGiftRegistry && (
          <div className="w-full mt-12 bg-white rounded-3xl p-8 border border-[#EBE3D7] shadow-lg text-center space-y-4">
            <Gift className="w-7 h-7 text-[#7A1F35] mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#2B2625]">
              {isRtl ? 'الهدايا وبطاقات التهنئة' : 'Gift Registry & Accounts'}
            </h3>
            <p className="text-xs text-[#6B5F5D] max-w-sm mx-auto font-serif">
              {isRtl
                ? 'مشاركتكم وحضوركم هو أجمل هدية تسعد قلوبنا.'
                : 'Your presence is our greatest present.'}
            </p>
            <button
              onClick={onOpenBank}
              className="px-6 py-2.5 rounded-full bg-[#FAF6F0] text-[#7A1F35] border border-[#7A1F35]/30 hover:bg-[#7A1F35] hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              {isRtl ? 'عرض تفاصيل الحسابات' : 'View Account Details'}
            </button>
          </div>
        )}

        {/* FOOTER SIGNATURE */}
        <div className="py-12 text-center text-xs text-[#8C7E7B] font-serif">
          <span>{isRtl ? 'دعوة رقمية ملكية من فريدا' : 'Crafted with Haute Couture by FRIDA'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * -----------------------------------------------------------------------------
 * 🦋 Vector Butterfly Illustration Component
 * - Left Wing & Right Wing with soft pink/lilac gradients and gold-vein details
 * - Pure CSS 3D flutter loop animation on each wing
 * - Respects prefers-reduced-motion
 * -----------------------------------------------------------------------------
 */
interface ButterflyProps {
  prefersReducedMotion: boolean;
}

const ButterflyVectorIllustration: React.FC<ButterflyProps> = ({ prefersReducedMotion }) => {
  return (
    <div
      className={`relative w-28 h-24 sm:w-32 sm:h-28 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(122,31,53,0.18)] ${
        prefersReducedMotion ? '' : 'animate-butterfly-float'
      }`}
      style={{ perspective: '800px' }}
    >
      <svg
        viewBox="0 0 160 140"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft Pink / Lilac Wing Gradient */}
          <linearGradient id="butterflyPinkGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE8EA" />
            <stop offset="45%" stopColor="#F5CCD2" />
            <stop offset="85%" stopColor="#E8B4B8" />
            <stop offset="100%" stopColor="#D48C95" />
          </linearGradient>

          {/* Secondary Soft Lilac Blush Gradient */}
          <linearGradient id="butterflyLilacGradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#EED9E4" />
            <stop offset="100%" stopColor="#C99EB8" />
          </linearGradient>

          {/* Gold Foil Vein Gradient */}
          <linearGradient id="butterflyGoldVein" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F6E0A4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA820A" />
          </linearGradient>
        </defs>

        {/* LEFT WING GROUP (Flutter Transform Origin at Center Body) */}
        <g
          className={prefersReducedMotion ? '' : 'butterfly-left-wing'}
          style={{ transformOrigin: '80px 70px' }}
        >
          {/* Forewing Left */}
          <path
            d="M80 65 C68 35 30 15 12 30 C-4 44 8 82 45 88 C65 91 76 75 80 65 Z"
            fill="url(#butterflyPinkGradient)"
            stroke="url(#butterflyGoldVein)"
            strokeWidth="1.2"
          />
          {/* Inner Lilac Layer Left */}
          <path
            d="M78 63 C66 40 38 28 24 38 C14 47 22 75 50 78 C68 80 75 70 78 63 Z"
            fill="url(#butterflyLilacGradient)"
            opacity="0.75"
          />
          {/* Gold Veins Forewing Left */}
          <path d="M78 64 Q45 48 20 32" stroke="url(#butterflyGoldVein)" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M56 54 Q32 58 16 62" stroke="url(#butterflyGoldVein)" strokeWidth="0.6" strokeLinecap="round" />
          <path d="M68 62 Q52 75 35 82" stroke="url(#butterflyGoldVein)" strokeWidth="0.6" strokeLinecap="round" />

          {/* Hindwing Left */}
          <path
            d="M80 75 C65 85 40 100 32 118 C26 132 45 138 60 128 C74 118 78 95 80 75 Z"
            fill="url(#butterflyPinkGradient)"
            stroke="url(#butterflyGoldVein)"
            strokeWidth="1.2"
          />
          {/* Gold Veins Hindwing Left */}
          <path d="M79 78 Q55 105 40 122" stroke="url(#butterflyGoldVein)" strokeWidth="0.7" strokeLinecap="round" />
          <path d="M64 96 Q52 114 48 126" stroke="url(#butterflyGoldVein)" strokeWidth="0.5" strokeLinecap="round" />
        </g>

        {/* RIGHT WING GROUP (Flutter Transform Origin at Center Body) */}
        <g
          className={prefersReducedMotion ? '' : 'butterfly-right-wing'}
          style={{ transformOrigin: '80px 70px' }}
        >
          {/* Forewing Right */}
          <path
            d="M80 65 C92 35 130 15 148 30 C164 44 152 82 115 88 C95 91 84 75 80 65 Z"
            fill="url(#butterflyPinkGradient)"
            stroke="url(#butterflyGoldVein)"
            strokeWidth="1.2"
          />
          {/* Inner Lilac Layer Right */}
          <path
            d="M82 63 C94 40 122 28 136 38 C146 47 138 75 110 78 C92 80 85 70 82 63 Z"
            fill="url(#butterflyLilacGradient)"
            opacity="0.75"
          />
          {/* Gold Veins Forewing Right */}
          <path d="M82 64 Q115 48 140 32" stroke="url(#butterflyGoldVein)" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M104 54 Q128 58 144 62" stroke="url(#butterflyGoldVein)" strokeWidth="0.6" strokeLinecap="round" />
          <path d="M92 62 Q108 75 125 82" stroke="url(#butterflyGoldVein)" strokeWidth="0.6" strokeLinecap="round" />

          {/* Hindwing Right */}
          <path
            d="M80 75 C95 85 120 100 128 118 C134 132 115 138 100 128 C86 118 82 95 80 75 Z"
            fill="url(#butterflyPinkGradient)"
            stroke="url(#butterflyGoldVein)"
            strokeWidth="1.2"
          />
          {/* Gold Veins Hindwing Right */}
          <path d="M81 78 Q105 105 120 122" stroke="url(#butterflyGoldVein)" strokeWidth="0.7" strokeLinecap="round" />
          <path d="M96 96 Q108 114 112 126" stroke="url(#butterflyGoldVein)" strokeWidth="0.5" strokeLinecap="round" />
        </g>

        {/* BUTTERFLY CENTER BODY & HEAD */}
        <ellipse cx="80" cy="72" rx="2.5" ry="16" fill="#4A1E27" stroke="url(#butterflyGoldVein)" strokeWidth="0.8" />
        <circle cx="80" cy="54" r="3.2" fill="#4A1E27" stroke="url(#butterflyGoldVein)" strokeWidth="0.8" />

        {/* ANTENNAE WITH DELICATE GOLD PEARLS */}
        <path d="M79 52 C74 42 65 35 58 32" stroke="url(#butterflyGoldVein)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <circle cx="57" cy="31.5" r="1.5" fill="#D4AF37" />

        <path d="M81 52 C86 42 95 35 102 32" stroke="url(#butterflyGoldVein)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <circle cx="103" cy="31.5" r="1.5" fill="#D4AF37" />
      </svg>

      {/* Embedded Flutter & Float CSS Styles */}
      <style>{`
        @keyframes butterflyFloat {
          0% { transform: translateY(-3px) scale(1); }
          50% { transform: translateY(4px) scale(1.02); }
          100% { transform: translateY(-3px) scale(1); }
        }
        @keyframes leftWingFlutter {
          0% { transform: rotateY(0deg) rotateZ(0deg); }
          50% { transform: rotateY(-26deg) rotateZ(-2deg); }
          100% { transform: rotateY(0deg) rotateZ(0deg); }
        }
        @keyframes rightWingFlutter {
          0% { transform: rotateY(0deg) rotateZ(0deg); }
          50% { transform: rotateY(26deg) rotateZ(2deg); }
          100% { transform: rotateY(0deg) rotateZ(0deg); }
        }
        .animate-butterfly-float {
          animation: butterflyFloat 4s ease-in-out infinite;
        }
        .butterfly-left-wing {
          animation: leftWingFlutter 2.4s ease-in-out infinite alternate;
        }
        .butterfly-right-wing {
          animation: rightWingFlutter 2.4s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-butterfly-float,
          .butterfly-left-wing,
          .butterfly-right-wing {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};
