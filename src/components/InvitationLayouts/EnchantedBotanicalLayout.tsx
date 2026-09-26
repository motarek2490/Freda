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

export const EnchantedBotanicalLayout: React.FC<TemplateLayoutProps> = ({
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

  // Breeze tracking on move
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, breezeStrength: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 18 : 45;

    interface LeafParticle {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      oscillationSpeed: number;
      oscillationRange: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }

    const particles: LeafParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 3, // slightly larger leaf petal size
        speed: Math.random() * 0.4 + 0.15,
        angle: Math.random() * Math.PI,
        oscillationSpeed: Math.random() * 0.01 + 0.005,
        oscillationRange: Math.random() * 20 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.01 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        opacity: Math.random() * 0.4 + 0.2,
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
      // Decay breeze strength
      mouse.breezeStrength += (0 - mouse.breezeStrength) * 0.05;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particles.forEach((p) => {
        // Naturally drift down and sideways
        p.angle += p.oscillationSpeed;
        p.rotation += p.rotationSpeed;

        const sidewaysDrift = Math.sin(p.angle) * 0.5;
        // Apply pointer move breeze interaction
        const windX = (mouse.x * 25 + Math.cos(p.angle) * p.oscillationRange) * 0.25;
        const windY = p.speed + (mouse.y * 12) * 0.25;

        p.x += sidewaysDrift + windX * (1 + mouse.breezeStrength);
        p.y += windY;

        // Reset if boundary passed
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw a delicate leaf shape
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        ctx.fillStyle = `${customColors.accent}33`; // light organic leaf translucent color
        ctx.strokeStyle = `${customColors.accent}55`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        // Leaf design drawing using cubic curves
        ctx.moveTo(0, -p.size);
        ctx.quadraticCurveTo(p.size / 2, -p.size / 2, 0, p.size);
        ctx.quadraticCurveTo(-p.size / 2, -p.size / 2, 0, -p.size);
        ctx.fill();
        ctx.stroke();

        // Draw center spine of the leaf
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(0, p.size);
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [customColors.accent]);

  const handlePointerMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.targetX = x / rect.width - 0.5;
    mouseRef.current.targetY = y / rect.height - 0.5;
    mouseRef.current.breezeStrength = 1.5; // kick up dust/leaves
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

      {/* 1. HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden border border-[#2B352E] z-10"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Custom Botanical Sprig Branch SVG Illustration in Hero */}
        <div className="w-40 h-40 mx-auto relative mb-6 select-none opacity-85">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            {/* Center golden ring with olive leaves */}
            <circle
              cx="60"
              cy="60"
              r="40"
              fill="none"
              stroke={customColors.accent}
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
            
            {/* High-fidelity Handcrafted botanical twig */}
            <path
              d="M 60 100 C 60 70, 40 40, 60 15 C 62 18, 65 30, 60 55 C 55 75, 60 85, 60 100"
              fill="none"
              stroke={customColors.accent}
              strokeWidth="1.2"
            />

            {/* Left Leaf sprigs */}
            <path d="M 52 75 C 45 75, 42 68, 48 65 C 52 65, 54 70, 52 75" fill={customColors.accent} opacity="0.6" />
            <path d="M 45 55 C 38 52, 35 44, 42 42 C 47 42, 48 48, 45 55" fill={customColors.accent} opacity="0.6" />
            <path d="M 46 32 C 40 28, 42 20, 48 22 C 51 24, 50 30, 46 32" fill={customColors.accent} opacity="0.6" />

            {/* Right Leaf sprigs */}
            <path d="M 66 82 C 72 80, 76 74, 72 70 C 67 70, 64 76, 66 82" fill={customColors.accent} opacity="0.6" />
            <path d="M 62 62 C 70 60, 75 52, 70 48 C 65 48, 62 55, 62 62" fill={customColors.accent} opacity="0.6" />
            <path d="M 61 40 C 68 36, 70 28, 65 26 C 60 28, 59 34, 61 40" fill={customColors.accent} opacity="0.6" />

            {/* Fine decorative details */}
            <circle cx="60" cy="15" r="1.5" fill={customColors.accent} />
          </svg>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <span
            className="text-[11px] font-bold tracking-[0.2em] uppercase block font-serif"
            style={{ color: customColors.accent }}
          >
            {isRtl ? 'بــسـم الـلـه الـرحـمـن الـرحـيـم' : 'UNDER THE COOP OF ENCHANTING NATURE'}
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#F7F4EE] leading-tight text-wrap-balance">
            {details.eventTitle}
          </h1>

          <div className="w-16 h-[1px] mx-auto opacity-35" style={{ backgroundColor: customColors.accent }} />

          {(details.groomName || details.brideName) && (
            <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-2xl sm:text-4xl font-serif">
              <span className="text-[#F7F4EE] font-bold">{details.groomName}</span>
              <span className="text-sm italic opacity-55 font-serif font-light">{isRtl ? 'وَ' : 'WITH'}</span>
              <span className="text-[#F7F4EE] font-bold">{details.brideName}</span>
            </div>
          )}

          <p className="text-xs text-[#8D8A84] max-w-md mx-auto leading-relaxed font-light">
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
        className="rounded-3xl p-8 border border-[#2B352E] text-center z-10"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <h4 className="text-xs uppercase tracking-widest mb-6 font-serif" style={{ color: customColors.accent }}>
          {isRtl ? 'ميقات لقاء الربيع المبارك' : 'Time Til Our Enchanted Spring Gathering'}
        </h4>
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          {[
            { value: timeLeft.days, label: isRtl ? 'أيام' : 'Days' },
            { value: timeLeft.hours, label: isRtl ? 'ساعات' : 'Hours' },
            { value: timeLeft.minutes, label: isRtl ? 'دقائق' : 'Mins' },
            { value: timeLeft.seconds, label: isRtl ? 'ثواني' : 'Secs' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl border border-[#2B352E]/40 flex flex-col items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: `${customColors.bg}70` }}
            >
              <span className="text-xl sm:text-3xl font-bold text-[#F7F4EE] tabular-nums">
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
        className="rounded-3xl p-8 sm:p-12 border border-[#2B352E] z-10 grid grid-cols-1 md:grid-cols-2 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B352E]"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <Calendar className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider">
                {isRtl ? 'تاريخ قطاف الفرح' : 'The Beautiful Day'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.eventDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B352E]"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <Clock className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider">
                {isRtl ? 'ميقات الحضور' : 'Gathering Hour'}
              </h4>
              <p className="text-base font-bold text-[#F7F4EE] font-serif">{details.eventTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2B352E]"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              <MapPin className="w-4 h-4" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider">
                {isRtl ? 'بستان وحرم الحفل' : 'Garden or Venue'}
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
              style={{
                borderColor: `${customColors.accent}30`,
                backgroundColor: `${customColors.accent}0a`,
                color: customColors.accent,
              }}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إدراج في الروزنامة الوردية 📅' : 'Add to Garden Calendar 📅'}</span>
            </a>
          )}
        </div>

        {/* Embedded map */}
        <div className="rounded-2xl overflow-hidden border border-[#2B352E] h-60 md:h-full relative group">
          {details.venueMapUrl || details.googleMapsUrl ? (
            <iframe
              title="Event Venue Map"
              src={details.venueMapUrl || details.googleMapsUrl}
              className="w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              allowFullScreen={false}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A221E] space-y-2">
              <MapPin className="w-8 h-8 text-[#8D8A84] animate-bounce" />
              <span className="text-xs text-[#8D8A84]">{isRtl ? 'بستان الحفل' : 'Garden Map Not Setup'}</span>
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
          className="rounded-3xl p-8 border border-[#2B352E] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'ترتيب فقرات قطاف اليوم' : 'The Botanical Timeline'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'أبرز فقرات حفلنا الرائع مرتبة بالترتيب' : 'Timeline of celebrations in our organic sanctuary'}
            </p>
          </div>

          <div className="space-y-6 relative border-l-2 md:border-l-0 md:border-t-2 border-[#2B352E] pl-6 md:pl-0 pt-0 md:pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {details.scheduleTimeline.map((item: { time: string; title: string; description?: string }, idx: number) => (
              <div key={idx} className="relative space-y-1">
                <div
                  className="absolute -left-[31px] md:left-1/2 md:-translate-x-1/2 -top-[2px] md:-top-[39px] w-3.5 h-3.5 rounded-full border border-stone-800 z-20"
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
          className="rounded-3xl p-8 border border-[#2B352E] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'معرض صور البستان' : 'Sanctuary Photo Gallery'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'لقطات طبيعية وجميلة لذكرانا الطيبة' : 'Visual collections of natural moments of joy'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {details.galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxImg(img)}
                className="aspect-square rounded-2xl overflow-hidden border border-[#2B352E] cursor-pointer relative group"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
        className="rounded-3xl p-8 border border-[#2B352E] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'دفتر ياسمين لتهاني الحضور' : 'Jasmine Guestbook'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl ? 'اكتب تمنياتك الطيبة لتزهر في قلوب العروسين مدى العمر' : 'Let your congratulations blossom in our hearts forever'}
            </p>
          </div>

          <form onSubmit={onAddWish} className="space-y-3">
            <input
              type="text"
              required
              placeholder={isRtl ? 'الاسم الكريم' : 'Your Lovely Name'}
              value={newWishAuthor}
              onChange={(e) => setNewWishAuthor(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#2B352E] bg-stone-900/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <input
              type="text"
              placeholder={isRtl ? 'القرابة والمودة' : 'Relationship'}
              value={newWishRelation}
              onChange={(e) => setNewWishRelation(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#2B352E] bg-stone-900/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <textarea
              required
              rows={3}
              placeholder={isRtl ? 'اكتب تهنئتك العطرة هنا...' : 'Write your warm blessings...'}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#2B352E] bg-stone-900/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-stone-900 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md"
              style={{ backgroundColor: customColors.accent }}
            >
              <Send className="w-4 h-4 text-stone-900" />
              <span>{isRtl ? 'إرسال التهنئة العطرة ✨' : 'Send Fragrant Blessing ✨'}</span>
            </button>

            {wishSuccess && (
              <p className="text-emerald-400 text-xs text-center font-semibold">
                {isRtl ? 'أينعت تهنئتكم في القلوب! 🌿' : 'Your blessing blossomed in our hearts! 🌿'}
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
                className="p-4 rounded-2xl border border-[#2B352E]/30 space-y-2 relative"
                style={{ backgroundColor: `${customColors.bg}50` }}
              >
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#F7F4EE] font-serif">{w.authorName}</strong>
                  {w.relationship && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-[#2B352E]/60 text-[#8D8A84]">
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
              {isRtl ? 'لا توجد تهاني مسجلة بعد.' : 'No blessings recorded yet.'}
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
        className="rounded-3xl p-8 sm:p-12 border border-[#2B352E] text-center z-10 space-y-6"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="w-12 h-12 rounded-full border border-[#2B352E] mx-auto flex items-center justify-center">
          <Heart className="w-5 h-5" style={{ color: customColors.accent }} />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-serif text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تأكيد الحضور البستاني' : 'Confirm Sanctuary Attendance'}
          </h3>
          <p className="text-xs text-[#8D8A84] leading-relaxed font-light">
            {isRtl
              ? 'يرجى تأكيد حضوركم الكريم وتدوين عدد المرافقين لتسهيل ترتيب مقاعد البستان.'
              : 'Please inform us if you will share our natural marital ceremony sanctuary.'}
          </p>
        </div>

        <button
          onClick={onOpenRsvp}
          className="px-8 py-3.5 rounded-xl text-stone-900 font-extrabold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
          style={{ backgroundColor: customColors.accent }}
        >
          {isRtl ? 'تأكيد حضور البستان 🌿' : 'Confirm Sanctuary Attendance 🌿'}
        </button>
      </motion.div>

      {/* 8. GIFT REGISTRY */}
      {details.enableGiftRegistry && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-[#2B352E] text-center z-10 space-y-4"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="w-10 h-10 rounded-full border border-[#2B352E] mx-auto flex items-center justify-center">
            <Gift className="w-4 h-4" style={{ color: customColors.accent }} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'صندوق الهدايا والعون' : 'Botanical Gift Registry'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl
                ? 'لمن يرغب في تقديم المباركة العينية لمساندة الثنائي'
                : 'For families wishing to send direct support to the couple path.'}
            </p>
          </div>
          <button
            onClick={onOpenBank}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2B352E]/40 text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer"
            style={{ color: customColors.accent }}
          >
            <span>{isRtl ? 'عرض تفاصيل التحويل المالي 💳' : 'View Financial Details 💳'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default EnchantedBotanicalLayout;
