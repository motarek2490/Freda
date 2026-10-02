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
  Sparkles,
  ExternalLink,
  Maximize2,
  UserCheck,
  Compass,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';

export const InteractiveStoryLayout: React.FC<TemplateLayoutProps> = ({
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
  const [activeChapter, setActiveChapter] = useState<number>(0);

  const chapters = [
    {
      id: 0,
      title: isRtl ? 'المقدمة والعريس والعروس' : 'The Couple',
      badge: isRtl ? 'الفصل الأول' : 'Chapter 01',
    },
    {
      id: 1,
      title: isRtl ? 'موعد الاحتفال والزمان' : 'Date & Countdown',
      badge: isRtl ? 'الفصل الثاني' : 'Chapter 02',
    },
    {
      id: 2,
      title: isRtl ? 'مكان الحفل والخريطة' : 'Venue & Maps',
      badge: isRtl ? 'الفصل الثالث' : 'Chapter 03',
    },
    {
      id: 3,
      title: isRtl ? 'سجل التهاني والتبريكات' : 'Wishes & RSVP',
      badge: isRtl ? 'الفصل الرابع' : 'Chapter 04',
    },
  ];

  return (
    <div className="space-y-8 py-4 font-sans-body">
      {/* CHAPTER STEPPER NAVIGATION BAR */}
      <div className="sticky top-16 z-30 bg-[#171717]/90 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex items-center justify-between gap-1 overflow-x-auto shadow-2xl">
        {chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setActiveChapter(ch.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex flex-col items-center ${
              activeChapter === ch.id
                ? 'bg-[#B99A65] text-[#121212] shadow-md scale-[1.02]'
                : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="text-[9px] uppercase tracking-widest opacity-75">{ch.badge}</span>
            <span className="truncate max-w-[120px]">{ch.title}</span>
          </button>
        ))}
      </div>

      {/* CHAPTER CONTENT ANIMATION CONTAINER */}
      <AnimatePresence mode="wait">
        {activeChapter === 0 && (
          <motion.div
            key="ch0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center mx-auto text-[#B99A65]">
                <Heart className="w-6 h-6 fill-[#B99A65]/30 text-[#B99A65]" />
              </div>

              <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-[#B99A65] font-bold">
                {details.hostNames || (isRtl ? 'دعوة حفل زفاف' : 'Interactive Wedding Story')}
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight font-serif">
                {details.eventTitle}
              </h1>

              <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-lg mx-auto leading-relaxed">
                "{details.customMessage}"
              </p>

              {/* Groom & Bride Profiles */}
              {(details.groomName || details.brideName) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                  {details.groomName && (
                    <div className="p-4 rounded-2xl bg-[#141416] border border-white/5 text-center space-y-2">
                      <img
                        src={details.groomAvatarUrl || '/images/samples/groom_portrait.jpg'}
                        alt={details.groomName}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#B99A65]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/samples/groom_portrait.jpg';
                        }}
                      />
                      <span className="text-[10px] text-[#B99A65] uppercase font-bold">{isRtl ? 'العريس' : 'Groom'}</span>
                      <h3 className="font-bold text-base text-white">{details.groomName}</h3>
                      {details.groomParents && <p className="text-xs text-[#71717A]">{details.groomParents}</p>}
                    </div>
                  )}

                  {details.brideName && (
                    <div className="p-4 rounded-2xl bg-[#141416] border border-white/5 text-center space-y-2">
                      <img
                        src={details.brideAvatarUrl || '/images/samples/bride_portrait.jpg'}
                        alt={details.brideName}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#B99A65]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/samples/bride_portrait.jpg';
                        }}
                      />
                      <span className="text-[10px] text-[#B99A65] uppercase font-bold">{isRtl ? 'العروس' : 'Bride'}</span>
                      <h3 className="font-bold text-base text-white">{details.brideName}</h3>
                      {details.brideParents && <p className="text-xs text-[#71717A]">{details.brideParents}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Cover Photo */}
              {details.coverImageUrl && (
                <div
                  onClick={() => setActiveLightboxImg(details.coverImageUrl!)}
                  className="rounded-2xl overflow-hidden border border-white/10 max-h-80 shadow-2xl cursor-pointer group relative"
                >
                  <img src={details.coverImageUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2">
                    <Maximize2 className="w-4 h-4" />
                    <span>{isRtl ? 'تكبير الصورة' : 'View Full Image'}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setActiveChapter(1)}
                className="w-full py-4 rounded-2xl bg-[#B99A65] text-[#121212] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#d4b986] transition-all cursor-pointer"
              >
                <span>{isRtl ? 'الانتقال إلى موعد وتوقيت الحفل' : 'Proceed to Date & Countdown'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {activeChapter === 1 && (
          <motion.div
            key="ch1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
              <span className="text-[10px] tracking-[0.3em] font-mono text-[#B99A65] uppercase font-bold">
                {isRtl ? 'العد التنازلي للموعد' : 'COUNTDOWN TO THE MOMENT'}
              </span>

              <h2 className="text-3xl font-extrabold text-white font-serif">{details.eventDate}</h2>
              <p className="text-xs text-[#A1A1AA]">{details.eventTime}</p>

              <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto" dir="ltr">
                {[
                  { label: isRtl ? 'أيام' : 'Days', val: timeLeft.days },
                  { label: isRtl ? 'ساعات' : 'Hours', val: timeLeft.hours },
                  { label: isRtl ? 'دقائق' : 'Mins', val: timeLeft.minutes },
                  { label: isRtl ? 'ثواني' : 'Secs', val: timeLeft.seconds },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#141416] border border-white/5">
                    <span className="block font-serif font-bold text-2xl text-[#B99A65]">
                      {String(item.val).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-[#71717A]">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#B99A65] text-[#121212] text-xs font-bold hover:bg-[#d4b986] transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isRtl ? 'حفظ الموعد في التقويم' : 'Save to Google Calendar'}</span>
                </a>
              </div>

              <button
                onClick={() => setActiveChapter(2)}
                className="w-full py-4 rounded-2xl bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#3F3F46] transition-all cursor-pointer"
              >
                <span>{isRtl ? 'الانتقال إلى خريطة المكان' : 'Next: Venue Location'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {activeChapter === 2 && (
          <motion.div
            key="ch2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center mx-auto text-[#B99A65]">
                <MapPin className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] tracking-[0.3em] font-mono text-[#B99A65] uppercase font-bold">
                  {isRtl ? 'مقر الحفل' : 'VENUE & LOCATION'}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{details.venueName}</h2>
                <p className="text-xs text-[#A1A1AA] mt-1">{details.address}</p>
              </div>

              {details.googleMapsUrl && (
                <a
                  href={details.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B99A65] text-[#121212] font-bold text-xs hover:bg-[#d4b986] transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{isRtl ? 'فتح اتجاهات خرائط Google' : 'Open in Google Maps'}</span>
                </a>
              )}

              {details.dressCode && (
                <div className="p-4 rounded-xl bg-[#141416] border border-white/5 text-xs text-[#A1A1AA] flex items-center justify-center gap-2">
                  <Shirt className="w-4 h-4 text-[#B99A65]" />
                  <span>
                    <strong>{isRtl ? 'قواعد اللباس:' : 'Dress Code:'}</strong> {details.dressCode}
                  </span>
                </div>
              )}

              <button
                onClick={() => setActiveChapter(3)}
                className="w-full py-4 rounded-2xl bg-[#27272A] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#3F3F46] transition-all cursor-pointer"
              >
                <span>{isRtl ? 'الانتقال إلى سجل التهاني وتأكيد الحضور' : 'Next: Wishes & RSVP'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}

        {activeChapter === 3 && (
          <motion.div
            key="ch3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-[#1C1C1E] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-6 shadow-2xl">
              <h3 className="font-serif text-2xl font-bold text-white text-center">
                {isRtl ? 'أمنيات وتبريكات الضيوف' : 'Guest Wishes & Greetings'}
              </h3>

              <form onSubmit={onAddWish} className="p-4 rounded-2xl bg-[#141416] border border-white/5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newWishAuthor}
                    onChange={(e) => setNewWishAuthor(e.target.value)}
                    placeholder={isRtl ? 'الاسم الكريم...' : 'Your Name...'}
                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={newWishRelation}
                    onChange={(e) => setNewWishRelation(e.target.value)}
                    placeholder={isRtl ? 'صلة القرابة...' : 'Relation...'}
                    className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-xs text-white"
                  />
                </div>
                <textarea
                  required
                  rows={2}
                  value={newWishMessage}
                  onChange={(e) => setNewWishMessage(e.target.value)}
                  placeholder={isRtl ? 'اكتب تهنئتك...' : 'Your greeting...'}
                  className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-xs text-white"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#B99A65] text-[#121212] font-bold text-xs uppercase hover:bg-[#d4b986] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isRtl ? 'نشر التهنئة' : 'Submit Greeting'}</span>
                </button>
              </form>

              {/* RSVP Action */}
              {details.enableRSVP && (
                <div className="text-center pt-4">
                  <button
                    onClick={onOpenRsvp}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B99A65] to-[#d4b986] text-[#121212] font-bold text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>{isRtl ? 'تأكيد الحضور الآن (RSVP)' : 'Confirm RSVP Online'}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
