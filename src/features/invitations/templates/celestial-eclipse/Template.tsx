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
import { TemplateLayoutProps } from '../../model/templateContract';

export const CelestialEclipseLayout: React.FC<TemplateLayoutProps> = ({
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

  // Mouse/Touch Parallax state (held in ref for fast drawing, no React renders)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Particle settings based on screen width
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 35 : 100;

    interface Particle {
      x: number;
      y: number;
      size: number;
      baseOpacity: number;
      opacity: number;
      speed: number;
      angle: number;
      orbitRadius?: number;
      orbitSpeed?: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isOrbiting = Math.random() > 0.6;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        baseOpacity: Math.random() * 0.6 + 0.2,
        opacity: 0,
        speed: Math.random() * 0.2 + 0.05,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: isOrbiting ? Math.random() * 200 + 50 : undefined,
        orbitSpeed: isOrbiting ? (Math.random() * 0.001 + 0.0002) * (Math.random() > 0.5 ? 1 : -1) : undefined,
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

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw interactive eclipse soft glow backdrop
      const centerX = width / 2 + mouse.x * 30;
      const centerY = height * 0.35 + mouse.y * 20;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        isMobile ? 180 : 350
      );
      gradient.addColorStop(0, `${customColors.accent}25`);
      gradient.addColorStop(0.3, `${customColors.accent}0a`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw Orbiting / Twinkling Stars
      particles.forEach((p) => {
        p.angle += p.speed * 0.01;
        p.opacity = p.baseOpacity + Math.sin(p.angle) * 0.2;

        if (p.orbitRadius !== undefined && p.orbitSpeed !== undefined) {
          // Circular orbital path around the Eclipse center
          p.angle += p.orbitSpeed;
          p.x = centerX + Math.cos(p.angle) * p.orbitRadius;
          p.y = centerY + Math.sin(p.angle) * p.orbitRadius;
        } else {
          // Standard slow cosmic drift
          p.y -= p.speed;
          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
        }

        // Apply mouse inertia pushback
        const drawX = p.x - mouse.x * 15;
        const drawY = p.y - mouse.y * 15;

        ctx.fillStyle = `rgba(247, 244, 238, ${Math.max(0.1, Math.min(1, p.opacity))})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [customColors.accent]);

  // Handle pointer interactions
  const handlePointerMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.targetX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseRef.current.targetY = (e.clientY - rect.top) / rect.height - 0.5;
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
      {/* 0. Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 1. HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden border border-[#2E2C28] z-10"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Fine SVG Celestial Eclipse Decorative Motif */}
        <div className="w-48 h-48 mx-auto relative mb-6 select-none opacity-90">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Outer golden aura orbit */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke={customColors.accent}
              strokeWidth="0.5"
              strokeDasharray="4 2"
              className="animate-spin-slow origin-center"
            />
            {/* Soft background glow */}
            <circle cx="50" cy="50" r="28" fill={customColors.accent} className="opacity-[0.12] blur-[4px]" />
            {/* Eclipse Sun (Golden corona ring) */}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="none"
              stroke={customColors.accent}
              strokeWidth="1.5"
              className="drop-shadow-[0_0_8px_rgba(185,154,101,0.6)]"
            />
            {/* Orbit paths and starburst lines */}
            <line x1="50" y1="5" x2="50" y2="95" stroke={customColors.accent} strokeWidth="0.25" opacity="0.3" />
            <line x1="5" y1="50" x2="95" y2="50" stroke={customColors.accent} strokeWidth="0.25" opacity="0.3" />
            {/* Lunar Disk blocking the sun */}
            <circle cx="47" cy="48" r="21.5" fill={customColors.bg} />
            {/* Star sparks */}
            <path d="M50 15 L51 21 L57 22 L51 23 L50 29 L49 23 L43 22 L49 21 Z" fill={customColors.accent} opacity="0.8" />
            <circle cx="78" cy="30" r="1" fill="#F7F4EE" />
            <circle cx="20" cy="70" r="1.5" fill="#F7F4EE" />
          </svg>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          <span
            className="text-[11px] font-bold tracking-[0.25em] uppercase block font-mono"
            style={{ color: customColors.accent }}
          >
            {isRtl ? 'بــسـم الله الــرحــمـن الــرحــيـم' : 'IN THE NAME OF ALMIGHTY GOD'}
          </span>
          
          <h1 className="font-playfair text-4xl sm:text-6xl font-light text-[#F7F4EE] leading-tight text-wrap-balance">
            {details.eventTitle}
          </h1>

          <div className="w-16 h-[1px] mx-auto opacity-40" style={{ backgroundColor: customColors.accent }} />

          {(details.groomName || details.brideName) && (
            <div className="py-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-2xl sm:text-4xl font-serif">
              <span className="text-[#F7F4EE] font-bold drop-shadow-sm">{details.groomName}</span>
              <span className="text-sm font-light uppercase tracking-widest font-mono opacity-55">
                {isRtl ? 'و' : 'AND'}
              </span>
              <span className="text-[#F7F4EE] font-bold drop-shadow-sm">{details.brideName}</span>
            </div>
          )}

          <p className="text-sm text-[#8D8A84] max-w-lg mx-auto leading-relaxed font-light">
            {details.customMessage || details.mainMessage}
          </p>
        </div>
      </motion.div>

      {/* 2. COUNTDOWN TIMER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 border border-[#2E2C28] text-center z-10"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <h4 className="text-xs uppercase tracking-[0.2em] mb-6 font-mono" style={{ color: customColors.accent }}>
          {isRtl ? 'العد التنازلي للحفل الكوني' : 'Time Until Cosmic Eclipse Celebration'}
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
              className="p-3 sm:p-5 rounded-2xl border border-[#2E2C28]/60 flex flex-col items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: `${customColors.bg}80` }}
            >
              {/* Spherical glowing backdrop */}
              <div
                className="absolute inset-0 w-8 h-8 rounded-full blur-xl opacity-20 pointer-events-none"
                style={{ backgroundColor: customColors.accent }}
              />
              <span className="text-2xl sm:text-4xl font-mono font-bold text-[#F7F4EE] tabular-nums relative z-10">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#8D8A84] tracking-wider uppercase mt-1 relative z-10">
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
        className="rounded-3xl p-8 sm:p-12 border border-[#2E2C28] z-10 grid grid-cols-1 md:grid-cols-2 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2E2C28]"
              style={{ backgroundColor: `${customColors.bg}a0` }}
            >
              <Calendar className="w-5 h-5" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider font-mono">
                {isRtl ? 'التاريخ واليوم' : 'Celebration Date'}
              </h4>
              <p className="text-lg font-bold text-[#F7F4EE]">{details.eventDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2E2C28]"
              style={{ backgroundColor: `${customColors.bg}a0` }}
            >
              <Clock className="w-5 h-5" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider font-mono">
                {isRtl ? 'الوقت والتوقيت' : 'Ceremony Time'}
              </h4>
              <p className="text-lg font-bold text-[#F7F4EE]">{details.eventTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border border-[#2E2C28]"
              style={{ backgroundColor: `${customColors.bg}a0` }}
            >
              <MapPin className="w-5 h-5" style={{ color: customColors.accent }} />
            </div>
            <div>
              <h4 className="text-xs text-[#8D8A84] uppercase tracking-wider font-mono">
                {isRtl ? 'موقع الحفل والمنطقة' : 'Venue Name & Address'}
              </h4>
              <p className="text-lg font-bold text-[#F7F4EE]">{details.venueName}</p>
              <p className="text-xs text-[#8D8A84]">{details.venueAddress || details.address}</p>
            </div>
          </div>

          {getGoogleCalendarUrl && (
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
              style={{
                borderColor: `${customColors.accent}40`,
                backgroundColor: `${customColors.accent}12`,
                color: customColors.accent,
              }}
            >
              <Calendar className="w-4 h-4" />
              <span>{isRtl ? 'إضافة التقويم الفلكي 📅' : 'Add to Celestial Calendar 📅'}</span>
            </a>
          )}
        </div>

        {/* Embedded Interactive Google Maps Iframe */}
        <div className="rounded-2xl overflow-hidden border border-[#2E2C28] h-60 md:h-full relative group">
          {details.venueMapUrl || details.googleMapsUrl ? (
            <iframe
              title="Event Venue Map"
              src={details.venueMapUrl || details.googleMapsUrl}
              className="w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              allowFullScreen={false}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#1A1A1A] space-y-2">
              <MapPin className="w-8 h-8 text-[#8D8A84] animate-bounce" />
              <span className="text-xs text-[#8D8A84]">{isRtl ? 'الخريطة المرفقة' : 'Interactive Map Not Configured'}</span>
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
          className="rounded-3xl p-8 border border-[#2E2C28] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'بروتوكول الحفل' : 'Event Celestial Timeline'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'ترتيب وتوقيت فقرات ومراحل ليلة العمر' : 'Chronological layout of our magical astronomical night'}
            </p>
          </div>

          <div className="space-y-6 relative border-l-2 md:border-l-0 md:border-t-2 border-[#2E2C28] pl-6 md:pl-0 pt-0 md:pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {details.scheduleTimeline.map((item: { time: string; title: string; description?: string }, idx: number) => (
              <div key={idx} className="relative space-y-2">
                {/* Visual node */}
                <div
                  className="absolute -left-[31px] md:left-1/2 md:-translate-x-1/2 -top-[2px] md:-top-[39px] w-4 h-4 rounded-full border-4 border-[#121212] z-20"
                  style={{ backgroundColor: customColors.accent, borderColor: customColors.cardBg }}
                />
                <span className="text-xs font-mono font-bold tracking-widest block" style={{ color: customColors.accent }}>
                  {item.time}
                </span>
                <h5 className="font-bold text-sm text-[#F7F4EE]">{item.title}</h5>
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
          className="rounded-3xl p-8 border border-[#2E2C28] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-center mb-8 space-y-2">
            <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'معرض الصور الكوني' : 'Celestial Photo Gallery'}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-sm mx-auto font-light">
              {isRtl ? 'لقطات ساحرة تخلد تفاصيل حبنا' : 'Capturing beautiful moments under the stars'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {details.galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxImg(img)}
                className="aspect-square rounded-2xl overflow-hidden border border-[#2E2C28] cursor-pointer relative group"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#121212]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
        className="rounded-3xl p-8 border border-[#2E2C28] z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'دفتر تهاني الأقارب' : 'Celestial Guestbook'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl ? 'شارك عائلة العروسين مباركتك الطيبة لهذه الليلة' : 'Bless the couple with your starry warm congratulations'}
            </p>
          </div>

          <form onSubmit={onAddWish} className="space-y-3">
            <input
              type="text"
              required
              placeholder={isRtl ? 'اسم المهنئ الكريم' : 'Your Elegant Name'}
              value={newWishAuthor}
              onChange={(e) => setNewWishAuthor(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#2E2C28] bg-[#121212]/60 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <input
              type="text"
              placeholder={isRtl ? 'صلة القرابة (مثال: صديق العريس)' : 'Relation (e.g. Groom Friend)'}
              value={newWishRelation}
              onChange={(e) => setNewWishRelation(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#2E2C28] bg-[#121212]/60 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all"
            />
            <textarea
              required
              rows={3}
              placeholder={isRtl ? 'رسالة التهنئة والدعاء...' : 'Write your warm blessings...'}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              className="w-full p-3 rounded-xl border border-[#2E2C28] bg-[#121212]/60 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl text-[#171717] font-bold text-xs uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg"
              style={{ backgroundColor: customColors.accent }}
            >
              <Send className="w-4 h-4" />
              <span>{isRtl ? 'إرسال التهنئة الفلكية' : 'Send Cosmic Blessing'}</span>
            </button>

            {wishSuccess && (
              <p className="text-emerald-400 text-xs text-center font-bold">
                {isRtl ? 'تم تسجيل تهنئتكم بنجاح! 🎉' : 'Your wish is recorded under the stars! 🎉'}
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
                className="p-4 rounded-2xl border border-[#2E2C28]/40 space-y-2 relative"
                style={{ backgroundColor: `${customColors.bg}60` }}
              >
                <div className="flex items-center justify-between text-xs">
                  <strong className="text-[#F7F4EE]">{w.authorName}</strong>
                  {w.relationship && (
                    <span className="text-[10px] tracking-wide uppercase font-mono px-2 py-0.5 rounded-md bg-[#2E2C28] text-[#8D8A84]">
                      {w.relationship}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8D8A84] leading-relaxed font-light">{w.message}</p>
                <span className="text-[9px] font-mono text-[#8D8A84]/60 block text-right">
                  {w.createdAt?.split('T')[0]}
                </span>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center text-[#8D8A84] text-xs font-light">
              {isRtl ? 'لا توجد رسائل بعد. كن أول المهنئين!' : 'No wishes recorded yet. Be the first to congratulate!'}
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
        className="rounded-3xl p-8 sm:p-12 border border-[#2E2C28] text-center z-10 space-y-6"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="w-12 h-12 rounded-full border border-[#2E2C28] mx-auto flex items-center justify-center">
          <Heart className="w-6 h-6 animate-pulse" style={{ color: customColors.accent }} />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Your Attendance (RSVP)'}
          </h3>
          <p className="text-xs text-[#8D8A84] leading-relaxed font-light">
            {isRtl
              ? 'تكتمل فرحتنا الكبرى بوجودكم الغالي معنا. يرجى تأكيد حضوركم الكريم لتسهيل التنظيم الكوني للحفل.'
              : 'Our celestial night is not complete without your magnificent presence. Please let us know your plans.'}
          </p>
        </div>

        <button
          onClick={onOpenRsvp}
          className="px-8 py-4 rounded-xl text-[#171717] font-extrabold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer shadow-lg transform hover:scale-[1.02]"
          style={{ backgroundColor: customColors.accent }}
        >
          {isRtl ? 'تأكيد الحضور والمدعوين 💌' : 'Confirm Invitation Attendance 💌'}
        </button>
      </motion.div>

      {/* 8. GIFT REGISTRY */}
      {details.enableGiftRegistry && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-[#2E2C28] text-center z-10 space-y-4"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="w-10 h-10 rounded-full border border-[#2E2C28] mx-auto flex items-center justify-center">
            <Gift className="w-5 h-5" style={{ color: customColors.accent }} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'المباركة المالية والهدايا' : 'Gift Registry & Blessings'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl
                ? 'لمن يرغب في مشاركتنا الهدايا والمباركة العينية عبر الحسابات البنكية'
                : 'For those wishing to contribute directly to the starting couple path.'}
            </p>
          </div>
          <button
            onClick={onOpenBank}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
            style={{ borderColor: `${customColors.accent}40`, backgroundColor: `${customColors.accent}12`, color: customColors.accent }}
          >
            <span>{isRtl ? 'عرض تفاصيل الحسابات البنكية 💳' : 'View Direct Bank Account Details 💳'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CelestialEclipseLayout;
