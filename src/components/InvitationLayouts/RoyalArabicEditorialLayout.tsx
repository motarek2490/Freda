import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Gift,
  ExternalLink,
  Maximize2,
  Send,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { TemplateLayoutProps } from './types';

export const RoyalArabicEditorialLayout: React.FC<TemplateLayoutProps> = ({
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Sand drift pointer tracking
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 80;

    interface SandParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      angle: number;
      swaySpeed: number;
      opacity: number;
    }

    const particles: SandParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5, // tiny gold dust sand particles
        speedY: Math.random() * 0.35 + 0.1,
        speedX: Math.random() * 0.1 - 0.05,
        angle: Math.random() * Math.PI,
        swaySpeed: Math.random() * 0.01 + 0.002,
        opacity: Math.random() * 0.45 + 0.15,
      });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          const wasZero = width === 0 || height === 0;
          width = canvas.width = newWidth;
          height = canvas.height = newHeight;
          if (wasZero) {
            particles.forEach((p) => {
              p.x = Math.random() * newWidth;
              p.y = Math.random() * newHeight;
            });
          }
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particles.forEach((p) => {
        p.angle += p.swaySpeed;
        const driftX = Math.sin(p.angle) * 0.15 + mouse.x * 5;
        const driftY = p.speedY + mouse.y * 2;

        p.x += p.speedX + driftX;
        p.y += driftY;

        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`; // Warm royal gold dust particle color
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.targetX = (x / rect.width - 0.5) * 1.5;
    mouseRef.current.targetY = (y / rect.height - 0.5) * 1.2;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="space-y-16 py-8 relative"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 1. HERO ARCHWAY SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="rounded-3xl p-8 sm:p-20 text-center relative overflow-hidden border border-[#3E3224] z-10 flex flex-col items-center justify-center min-h-[75vh]"
        style={{
          backgroundColor: customColors.cardBg,
          background: `linear-gradient(180deg, ${customColors.cardBg} 0%, rgba(31, 22, 12, 0.95) 100%)`,
        }}
      >
        {/* Beautiful interlocking Contemporary Arabic Arch SVG design motif */}
        <div className="w-48 h-48 mx-auto relative mb-8 select-none opacity-90">
          <svg viewBox="0 0 100 120" className="w-full h-full">
            <defs>
              <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={customColors.accent} stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8D7040" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Contemporary Interlocking Archways */}
            {/* Outer arch */}
            <path
              d="M 15 110 L 15 50 A 35 35 0 0 1 85 50 L 85 110"
              fill="none"
              stroke="url(#archGold)"
              strokeWidth="0.75"
            />
            {/* Middle arch */}
            <path
              d="M 25 110 L 25 50 A 25 25 0 0 1 75 50 L 75 110"
              fill="none"
              stroke="url(#archGold)"
              strokeWidth="0.5"
              strokeDasharray="3 1.5"
            />
            {/* Inner arch */}
            <path
              d="M 35 110 L 35 50 A 15 15 0 0 1 65 50 L 65 110"
              fill="none"
              stroke="url(#archGold)"
              strokeWidth="0.75"
            />

            {/* Fine geometric Islamic geometric star element in the focal arch top center */}
            <g transform="translate(50, 50) scale(0.12)">
              <polygon points="0,-20 5,-5 20,0 5,5 0,20 -5,5 -20,0 -5,-5" fill={customColors.accent} />
              <polygon points="0,-20 5,-5 20,0 5,5 0,20 -5,5 -20,0 -5,-5" fill="none" stroke="#FFF" strokeWidth="2" transform="rotate(45)" />
            </g>

            {/* Fine border coordinates */}
            <line x1="5" y1="5" x2="95" y2="5" stroke={customColors.accent} strokeWidth="0.25" opacity="0.4" />
            <line x1="5" y1="115" x2="95" y2="115" stroke={customColors.accent} strokeWidth="0.25" opacity="0.4" />
          </svg>
        </div>

        <div className="space-y-6 max-w-3xl z-10 relative">
          <span
            className="text-xs font-bold tracking-[0.3em] uppercase block font-serif"
            style={{ color: customColors.accent }}
          >
            {isRtl ? 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ' : 'IN THE NAME OF ALLAH, THE BENEFICENT'}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#F7F4EE] leading-snug text-wrap-balance">
            {details.eventTitle}
          </h1>

          <div className="w-16 h-[1.5px] mx-auto opacity-35" style={{ backgroundColor: customColors.accent }} />

          {(details.groomName || details.brideName) && (
            <div className="py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-3xl sm:text-5xl font-serif">
              <span className="text-[#F7F4EE] font-extrabold">{details.groomName}</span>
              <span className="text-base font-light italic opacity-55 font-serif">{isRtl ? 'وَ' : 'WITH'}</span>
              <span className="text-[#F7F4EE] font-extrabold">{details.brideName}</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-[#8D8A84] max-w-lg mx-auto leading-relaxed font-light">
            {details.customMessage || details.mainMessage}
          </p>
        </div>
      </motion.div>

      {/* 2. COUNTDOWN TIMER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 border border-[#3E3224] text-center z-10"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <h4 className="text-xs uppercase tracking-widest mb-6 font-serif" style={{ color: customColors.accent }}>
          {isRtl ? 'مـيـقـات كـتـابـة الـفــرح والـعــقــد' : 'Countdown To This Imperial Marital Union'}
        </h4>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-xl mx-auto">
          {[
            { value: timeLeft.days, label: isRtl ? 'أيام' : 'Days' },
            { value: timeLeft.hours, label: isRtl ? 'ساعات' : 'Hours' },
            { value: timeLeft.minutes, label: isRtl ? 'دقائق' : 'Mins' },
            { value: timeLeft.seconds, label: isRtl ? 'ثواني' : 'Secs' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-5 rounded-2xl border border-[#3E3224]/50 flex flex-col items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <span className="text-2xl sm:text-4xl font-serif font-bold text-[#F7F4EE] tabular-nums">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8D8A84] uppercase mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 3. EVENT DETAILS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 sm:p-12 border border-[#3E3224] z-10 grid grid-cols-1 md:grid-cols-2 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#3E3224]"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <Calendar className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider">
                {isRtl ? 'الـتـاريــخ والـيــوم' : 'Celebration Date'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.eventDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#3E3224]"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <Clock className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider">
                {isRtl ? 'الـسـاعــة والـوقــت' : 'Ceremony Timing'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.eventTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#3E3224]"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <MapPin className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider">
                {isRtl ? 'مـقــر ومـكــان الـحـفــل' : 'The Wedding Hall'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.venueName}</p>
              <p className="text-xs text-[#8D8A84]">{details.venueAddress || details.address}</p>
            </div>
          </div>

          {getGoogleCalendarUrl && (
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#3E3224]/50 text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
              style={{
                borderColor: `${customColors.accent}30`,
                backgroundColor: `${customColors.accent}0a`,
                color: customColors.accent,
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isRtl ? 'حفظ الموعد في الأجندة 📅' : 'Add to Calendar 📅'}</span>
            </a>
          )}
        </div>

        {/* Maps */}
        <div className="rounded-2xl overflow-hidden border border-[#3E3224] h-60 md:h-full relative group">
          {details.venueMapUrl || details.googleMapsUrl ? (
            <iframe
              title="Event Venue Map"
              src={details.venueMapUrl || details.googleMapsUrl}
              className="w-full h-full border-0 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-700"
              allowFullScreen={false}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#251E16] space-y-2">
              <MapPin className="w-8 h-8 text-[#8D8A84] animate-bounce" />
              <span className="text-xs text-[#8D8A84]">{isRtl ? 'الخريطة المرفقة' : 'Interactive Map Location'}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. SCHEDULE SECTION */}
      {details.enableSchedule && details.scheduleTimeline && details.scheduleTimeline.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-[#3E3224] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'جـدول الـفـقــرات الـمـبــاركــة' : 'Marital Ceremony Protocol'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'ترتيب وتنسيق مراسم هذه الليلة الكريمة' : 'Timeline of celebrations in our contemporary marital sanctuary'}
            </p>
          </div>

          <div className="space-y-6 relative border-l border-[#3E3224]/50 md:border-l-0 md:border-t border-[#3E3224]/50 pl-6 md:pl-0 pt-0 md:pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {details.scheduleTimeline.map((item: { time: string; title: string; description?: string }, idx: number) => (
              <div key={idx} className="relative space-y-1">
                <div
                  className="absolute -left-[31px] md:left-1/2 md:-translate-x-1/2 -top-[2px] md:-top-[39px] w-3 h-3 rounded-full border border-stone-900 z-20"
                  style={{ backgroundColor: customColors.accent, borderColor: customColors.cardBg }}
                />
                <span className="text-xs font-serif font-bold block" style={{ color: customColors.accent }}>
                  {item.time}
                </span>
                <h5 className="font-bold text-sm text-[#F7F4EE] font-serif">{item.title}</h5>
                <p className="text-xs text-[#8D8A84] leading-relaxed font-light">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 5. GALLERY SECTION */}
      {details.enableGallery && details.galleryImages && details.galleryImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-[#3E3224] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'أبــوم ذكــريــات الـعـمــر' : 'Marital Visual Portfolio'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'معرض لقطات من أيام حبنا المباركة' : 'Visual collection of our beautiful memories'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {details.galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxImg(img)}
                className="aspect-square rounded-2xl overflow-hidden border border-[#3E3224] cursor-pointer relative group"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-[#F7F4EE]" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 6. WISHES / GUESTBOOK */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 border border-[#3E3224] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'سـجــل وتـهــانـي الـمـحـبـيــن' : 'Official Guestbook'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl ? 'شارك عائلة العروسين كلماتك المباركة ودعواتك الطيبة' : 'Write your kind blessings to stay recorded in our hearts forever'}
            </p>
          </div>

          <form onSubmit={onAddWish} className="space-y-3">
            <input
              type="text"
              required
              placeholder={isRtl ? 'الاسم واللقب' : 'Your Lovely Name'}
              value={newWishAuthor}
              onChange={(e) => setNewWishAuthor(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#3E3224] bg-stone-900/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <input
              type="text"
              placeholder={isRtl ? 'صلة القرابة والمحبة' : 'Relation'}
              value={newWishRelation}
              onChange={(e) => setNewWishRelation(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#3E3224] bg-stone-900/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <textarea
              required
              rows={3}
              placeholder={isRtl ? 'رسالتك ودعاؤك بالخير...' : 'Write your kind blessings...'}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#3E3224] bg-stone-900/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-stone-950 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md font-serif"
              style={{ backgroundColor: customColors.accent }}
            >
              <Send className="w-4 h-4 text-stone-950" />
              <span>{isRtl ? 'تـدوين الـمـبــاركـة الـمـكـتــوبـة ✒️' : 'Post Congratulatory Note ✒️'}</span>
            </button>

            {wishSuccess && (
              <p className="text-emerald-400 text-xs text-center font-semibold">
                {isRtl ? 'تم تدوين التهنئة المباركة! ✒️' : 'Your blessing is registered successfully! ✒️'}
              </p>
            )}
          </form>
        </div>

        {/* Right Scrollable wishes */}
        <div className="lg:col-span-7 space-y-3 max-h-96 overflow-y-auto pr-1">
          {wishes && wishes.length > 0 ? (
            wishes.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-2xl border border-[#3E3224]/30 space-y-2 relative animate-fade-in"
                style={{ backgroundColor: `${customColors.bg}50` }}
              >
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#F7F4EE] font-serif">{w.authorName}</strong>
                  {w.relationship && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-[#3E3224]/60 text-[#8D8A84]">
                      {w.relationship}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8D8A84] leading-relaxed font-light">{w.message}</p>
                <span className="text-[9px] font-mono text-[#8D8A84]/40 block text-right">
                  {w.createdAt?.split('T')[0]}
                </span>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-[#8D8A84] text-xs font-light">
              {isRtl ? 'لا توجد رسائل مسجلة بعد.' : 'No blessings recorded yet.'}
            </div>
          )}
        </div>
      </motion.div>

      {/* 7. RSVP ACTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 sm:p-12 border border-[#3E3224] text-center z-10 space-y-6"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="w-12 h-12 rounded-full border border-[#3E3224] mx-auto flex items-center justify-center">
          <Heart className="w-5 h-5 animate-pulse" style={{ color: customColors.accent }} />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تـأكـيــد رغـبــة الـحـضــور (RSVP)' : 'Attendance RSVP Register'}
          </h3>
          <p className="text-xs text-[#8D8A84] leading-relaxed font-light">
            {isRtl
              ? 'يرجى تأكيد رغبة حضوركم الحفل لتسهيل تنظيم وتوزيع مقاعد قاعة الضيافة.'
              : 'Our wedding hall is complete with your presence. Please let us know your RSVP plans.'}
          </p>
        </div>

        <button
          onClick={onOpenRsvp}
          className="px-8 py-3.5 rounded-xl text-stone-950 font-extrabold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer shadow-lg font-serif"
          style={{ backgroundColor: customColors.accent }}
        >
          {isRtl ? 'تـأكـيــد الـحـضــور والـمـدعـويــن ✉️' : 'Register Marital Attendance ✉️'}
        </button>
      </motion.div>

      {/* 8. GIFT REGISTRY */}
      {details.enableGiftRegistry && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-[#3E3224] text-center z-10 space-y-4"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="w-10 h-10 rounded-full border border-[#3E3224] mx-auto flex items-center justify-center">
            <Gift className="w-4 h-4" style={{ color: customColors.accent }} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'الـمـبــاركـة الـعـيـنـيــة والـهــدايـا' : 'Royal Gift Registry'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl
                ? 'لمن يود مشاركة الثنائي الهدايا والمباركة العينية عير حسابات البنك'
                : 'For those wishing to send direct marital support.'}
            </p>
          </div>
          <button
            onClick={onOpenBank}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#3E3224]/50 text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
            style={{ color: customColors.accent }}
          >
            <span>{isRtl ? 'عــرض الـحـســابــات الـبـنـكـيــة 💳' : 'View Bank Registry Data 💳'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
