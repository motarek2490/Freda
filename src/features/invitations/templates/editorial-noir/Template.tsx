import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  MapPin,
  Heart,
  Gift,
  Maximize2,
  Send,
} from 'lucide-react';
import { TemplateLayoutProps } from '../../model/templateContract';

export const EditorialNoirLayout: React.FC<TemplateLayoutProps> = ({
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
  const heroTitleRef = useRef<HTMLDivElement | null>(null);

  // Parallax offsets (for subtle magnetic effect)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const updateSize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(rect.width || window.innerWidth, 320);
      const newHeight = Math.max(containerRef.current.scrollHeight || window.innerHeight, 600);
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        width = canvas.width = newWidth;
        height = canvas.height = newHeight;
      }
    };
    updateSize();

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 18 : 36;

    interface GeometricParticle {
      x: number;
      y: number;
      size: number;
      type: 'dot' | 'line' | 'square';
      speed: number;
      angle: number;
      length?: number;
      opacity: number;
    }

    const particles: GeometricParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const types: ('dot' | 'line' | 'square')[] = ['dot', 'line', 'square'];
      const chosenType = types[Math.floor(Math.random() * 3)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        type: chosenType,
        speed: Math.random() * 0.15 + 0.05,
        angle: Math.random() * Math.PI * 2,
        length: chosenType === 'line' ? Math.random() * 12 + 6 : undefined,
        opacity: Math.random() * 0.25 + 0.05,
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
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      particles.forEach((p) => {
        p.angle += p.speed * 0.01;
        p.y += Math.sin(p.angle) * p.speed;
        p.x += Math.cos(p.angle) * p.speed;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive displacement away from cursor position
        const drawX = p.x + mouse.x * 30;
        const drawY = p.y + mouse.y * 30;

        ctx.strokeStyle = `rgba(247, 244, 238, ${p.opacity})`;
        ctx.fillStyle = `rgba(247, 244, 238, ${p.opacity})`;
        ctx.lineWidth = 0.5;

        if (p.type === 'dot') {
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'line' && p.length !== undefined) {
          ctx.beginPath();
          ctx.moveTo(drawX, drawY);
          ctx.lineTo(drawX + Math.cos(p.angle) * p.length, drawY + Math.sin(p.angle) * p.length);
          ctx.stroke();
        } else {
          ctx.strokeRect(drawX, drawY, p.size * 2, p.size * 2);
        }
      });

      // Subtle editorial thin grids drawing behind layout sections
      ctx.strokeStyle = 'rgba(247, 244, 238, 0.015)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // Side vertical lines
      ctx.moveTo(width * 0.1, 0);
      ctx.lineTo(width * 0.1, height);
      ctx.moveTo(width * 0.9, 0);
      ctx.lineTo(width * 0.9, height);
      ctx.stroke();

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

    mouseRef.current.targetX = x / rect.width - 0.5;
    mouseRef.current.targetY = y / rect.height - 0.5;

    // Subtle magnetic title shift
    if (heroTitleRef.current) {
      const shiftX = (x / rect.width - 0.5) * 20;
      const shiftY = (y / rect.height - 0.5) * 12;
      heroTitleRef.current.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
    }
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
    if (heroTitleRef.current) {
      heroTitleRef.current.style.transform = `translate3d(0px, 0px, 0)`;
    }
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
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 1. EDITORIAL TEXT-FIRST HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="rounded-3xl p-8 sm:p-20 text-center relative overflow-hidden border border-[#232323] z-20 flex flex-col items-center justify-center min-h-[70vh] backdrop-blur-sm"
        style={{ backgroundColor: `${customColors.cardBg}F5` }}
      >
        {/* Asymmetric SVG Fine Art Layout Frame behind names */}
        <div className="absolute inset-8 pointer-events-none border border-white/[0.04] rounded-2xl flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-35" preserveAspectRatio="none">
            {/* Fine editorial layout boundaries and corners */}
            <line x1="5" y1="5" x2="95" y2="5" stroke={customColors.accent} strokeWidth="0.15" />
            <line x1="5" y1="95" x2="95" y2="95" stroke={customColors.accent} strokeWidth="0.15" />
            <line x1="5" y1="5" x2="5" y2="95" stroke={customColors.accent} strokeWidth="0.15" />
            <line x1="95" y1="5" x2="95" y2="95" stroke={customColors.accent} strokeWidth="0.15" />
            
            {/* Geometric center crosses and circular markers */}
            <circle cx="5" cy="5" r="1.5" fill="none" stroke={customColors.accent} strokeWidth="0.3" />
            <circle cx="95" cy="5" r="1.5" fill="none" stroke={customColors.accent} strokeWidth="0.3" />
            <circle cx="5" cy="95" r="1.5" fill="none" stroke={customColors.accent} strokeWidth="0.3" />
            <circle cx="95" cy="95" r="1.5" fill="none" stroke={customColors.accent} strokeWidth="0.3" />
          </svg>
        </div>

        <div ref={heroTitleRef} className="space-y-8 max-w-4xl transition-transform duration-300 ease-out z-10">
          <span
            className="text-[10px] font-bold tracking-[0.4em] uppercase block font-mono"
            style={{ color: customColors.accent }}
          >
            {isRtl ? 'صــفــحــة تــحــريــريــة خــاصــة' : 'SPECIAL EDITORIAL EDITION'}
          </span>

          <div className="space-y-4">
            {(details.groomName || details.brideName) && (
              <div className="flex flex-col items-center justify-center leading-none">
                <span className="text-5xl sm:text-8xl font-light tracking-tight text-[#F7F4EE] block uppercase font-serif font-extrabold">
                  {details.groomName}
                </span>
                <span
                  className="text-2xl sm:text-4xl italic font-serif my-3 block font-semibold"
                  style={{ color: customColors.accent }}
                >
                  &
                </span>
                <span className="text-5xl sm:text-8xl font-light tracking-tight text-[#F7F4EE] block uppercase font-serif font-extrabold">
                  {details.brideName}
                </span>
              </div>
            )}
          </div>

          <div className="max-w-md mx-auto space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#FAFAFA] font-light italic text-wrap-balance">
              {details.eventTitle}
            </h2>
            <div className="w-12 h-[1px] mx-auto opacity-30" style={{ backgroundColor: customColors.accent }} />
            <p className="text-xs text-[#8D8A84] leading-relaxed font-light tracking-wide">
              {details.customMessage || details.mainMessage}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. COUNTDOWN TIMER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl p-8 border border-[#232323] text-center z-10"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <h4 className="text-[10px] uppercase tracking-[0.25em] mb-8 font-mono" style={{ color: customColors.accent }}>
          {isRtl ? 'الـعـد الـتـنـازلـي لـلإصـدار' : 'COUNTDOWN TO THE CELEBRATION'}
        </h4>
        <div className="grid grid-cols-4 gap-4 max-w-xl mx-auto divide-x divide-white/[0.05] rtl:divide-x-reverse">
          {[
            { value: timeLeft.days, label: isRtl ? 'أيام' : 'Days' },
            { value: timeLeft.hours, label: isRtl ? 'ساعات' : 'Hours' },
            { value: timeLeft.minutes, label: isRtl ? 'دقائق' : 'Mins' },
            { value: timeLeft.seconds, label: isRtl ? 'ثواني' : 'Secs' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center">
              <span className="text-3xl sm:text-5xl font-extrabold text-[#F7F4EE] tabular-nums tracking-tighter">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] text-[#8D8A84] tracking-widest uppercase mt-2 font-mono">
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
        className="rounded-3xl p-8 sm:p-12 border border-[#232323] z-10 grid grid-cols-1 md:grid-cols-2 gap-12"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="space-y-8 justify-center flex flex-col">
          <div className="space-y-1 border-b border-white/[0.04] pb-4">
            <span className="text-[9px] tracking-widest text-[#8D8A84] uppercase font-mono block">01 / DATE & DAY</span>
            <p className="text-xl font-bold text-[#F7F4EE] font-serif">{details.eventDate}</p>
          </div>

          <div className="space-y-1 border-b border-white/[0.04] pb-4">
            <span className="text-[9px] tracking-widest text-[#8D8A84] uppercase font-mono block">02 / CEREMONY HOUR</span>
            <p className="text-xl font-bold text-[#F7F4EE] font-serif">{details.eventTime}</p>
          </div>

          <div className="space-y-2 border-b border-white/[0.04] pb-4">
            <span className="text-[9px] tracking-widest text-[#8D8A84] uppercase font-mono block">03 / AT THE VENUE</span>
            <p className="text-xl font-bold text-[#F7F4EE] font-serif leading-tight">{details.venueName}</p>
            <p className="text-xs text-[#8D8A84] font-light">{details.venueAddress || details.address}</p>
          </div>

          {getGoogleCalendarUrl && (
            <a
              href={getGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start py-1.5 border-b text-xs font-bold transition-colors cursor-pointer"
              style={{
                borderColor: customColors.accent,
                color: customColors.accent,
              }}
            >
              <span>{isRtl ? 'إدراج في الـتـقـويــم +' : 'SAVE DATE TO CALENDAR +'}</span>
            </a>
          )}
        </div>

        {/* Gray Map Display card */}
        <div className="rounded-2xl overflow-hidden border border-[#232323] h-64 md:h-full relative group">
          {details.venueMapUrl || details.googleMapsUrl ? (
            <iframe
              title="Event Venue Map"
              src={details.venueMapUrl || details.googleMapsUrl}
              className="w-full h-full border-0 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-700"
              allowFullScreen={false}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#151515] space-y-2">
              <MapPin className="w-8 h-8 text-[#8D8A84]" />
              <span className="text-[10px] uppercase font-mono text-[#8D8A84] tracking-widest">MAP INTERACTION</span>
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
          className="rounded-3xl p-8 border border-[#232323] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-left rtl:text-right mb-12 border-b border-white/[0.04] pb-6">
            <span className="text-[10px] tracking-[0.2em] block mb-2 font-mono" style={{ color: customColors.accent }}>
              SCHEDULE / 04
            </span>
            <h3 className="font-serif text-3xl font-light text-[#F7F4EE]">
              {isRtl ? 'وقائع وجدول الحفل' : 'Event Narrative Timeline'}
            </h3>
          </div>

          <div className="space-y-8 divide-y divide-white/[0.04]">
            {details.scheduleTimeline.map((item: { time: string; title: string; description?: string }, idx: number) => (
              <div key={idx} className="pt-6 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
                <div className="md:col-span-3">
                  <span className="text-sm font-mono font-bold tracking-widest block" style={{ color: customColors.accent }}>
                    [{item.time}]
                  </span>
                </div>
                <div className="md:col-span-9 space-y-1">
                  <h5 className="font-bold text-base text-[#F7F4EE] font-serif">{item.title}</h5>
                  <p className="text-xs text-[#8D8A84] leading-relaxed font-light">{item.description}</p>
                </div>
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
          className="rounded-3xl p-8 border border-[#232323] z-10"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="text-left rtl:text-right mb-8 border-b border-white/[0.04] pb-4">
            <span className="text-[10px] tracking-[0.2em] block mb-2 font-mono" style={{ color: customColors.accent }}>
              PORTFOLIO / 05
            </span>
            <h3 className="font-serif text-3xl font-light text-[#F7F4EE]">
              {isRtl ? 'ألبوم صور من الذاكرة' : 'Editorial Visual Archive'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {details.galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxImg(img)}
                className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#232323] cursor-pointer relative group"
              >
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-[#0d0d0d]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
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
        className="rounded-3xl p-8 border border-[#232323] z-10 grid grid-cols-1 lg:grid-cols-12 gap-12"
        style={{ backgroundColor: customColors.cardBg }}
      >
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.2em] block mb-1 font-mono" style={{ color: customColors.accent }}>
              GUESTBOOK / 06
            </span>
            <h3 className="font-serif text-3xl font-light text-[#F7F4EE]">
              {isRtl ? 'رسائل وتهاني الضيوف' : 'Guest Acknowledgements'}
            </h3>
          </div>

          <form onSubmit={onAddWish} className="space-y-4">
            <input
              type="text"
              required
              placeholder={isRtl ? 'اسم المهنئ الكريم' : 'Full Name'}
              value={newWishAuthor}
              onChange={(e) => setNewWishAuthor(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#232323] bg-[#0d0d0d]/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all font-mono"
            />
            <input
              type="text"
              placeholder={isRtl ? 'القرابة أو الصفة' : 'Relation'}
              value={newWishRelation}
              onChange={(e) => setNewWishRelation(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#232323] bg-[#0d0d0d]/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all font-mono"
            />
            <textarea
              required
              rows={3}
              placeholder={isRtl ? 'رسالتك المباركة لثنائي الحفل...' : 'Write your kind blessing...'}
              value={newWishMessage}
              onChange={(e) => setNewWishMessage(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-[#232323] bg-[#0d0d0d]/40 text-[#F7F4EE] text-xs focus:outline-none focus:border-[#B99A65] transition-all resize-none"
            />
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl text-[#F7F4EE] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer border border-[#444]"
              style={{ backgroundColor: customColors.accent === '#B99A65' ? '#3F121B' : customColors.accent }}
            >
              <Send className="w-4 h-4 text-[#F7F4EE]" />
              <span>{isRtl ? 'إدراج الـمـبــاركـة عـلـى الـصـفـحـة' : 'SUBMIT TESTIMONIAL'}</span>
            </button>

            {wishSuccess && (
              <p className="text-emerald-400 text-xs text-center font-mono">
                {isRtl ? 'تم التدوين بنجاح! 🖤' : 'Testimonial posted successfully! 🖤'}
              </p>
            )}
          </form>
        </div>

        {/* Right Scrollable wishes */}
        <div className="lg:col-span-7 space-y-4 max-h-96 overflow-y-auto pr-1">
          {wishes && wishes.length > 0 ? (
            wishes.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-2xl border border-white/[0.02] space-y-3 relative"
                style={{ backgroundColor: `${customColors.bg}80` }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <strong className="text-[#F7F4EE] font-serif text-sm">{w.authorName}</strong>
                  {w.relationship && (
                    <span className="text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded border border-white/[0.05] text-[#8D8A84]">
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
            <div className="h-full flex items-center justify-center text-[#8D8A84] text-xs font-mono">
              {isRtl ? 'لا توجد تدوينات بعد.' : 'NO ACKNOWLEDGEMENTS YET.'}
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
        className="rounded-3xl p-8 sm:p-16 border border-[#232323] text-center z-10 space-y-6 relative"
        style={{ backgroundColor: customColors.cardBg }}
      >
        <div className="absolute inset-4 pointer-events-none border border-white/[0.02] rounded-xl" />
        <div className="w-12 h-12 rounded-full border border-white/[0.05] mx-auto flex items-center justify-center">
          <Heart className="w-5 h-5" style={{ color: customColors.accent }} />
        </div>
        <div className="space-y-3 max-w-md mx-auto z-10 relative">
          <span className="text-[10px] tracking-[0.3em] uppercase block font-mono" style={{ color: customColors.accent }}>
            RSVP / 07
          </span>
          <h3 className="font-serif text-3xl font-light text-[#F7F4EE]">
            {isRtl ? 'تأكيد الحضور الرسمي' : 'Attendance Confirmation'}
          </h3>
          <p className="text-xs text-[#8D8A84] leading-relaxed font-light">
            {isRtl
              ? 'يرجى تأكيد رغبة حضوركم الحفل لتسجيل أسمائكم في سجل الضيوف والصفحات التحريرية الرسمية.'
              : 'Please inform us of your attendance status to finalize our guest logs.'}
          </p>
        </div>

        <button
          onClick={onOpenRsvp}
          className="px-10 py-4.5 rounded-xl text-[#F7F4EE] font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity cursor-pointer border border-[#555] relative z-10"
          style={{ backgroundColor: customColors.accent === '#B99A65' ? '#2A0A12' : customColors.accent }}
        >
          {isRtl ? 'تسجيل الحضور والبيانات ✉️' : 'REGISTER ATTENDANCE ✉️'}
        </button>
      </motion.div>

      {/* 8. GIFT REGISTRY */}
      {details.enableGiftRegistry && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 border border-[#232323] text-center z-10 space-y-4"
          style={{ backgroundColor: customColors.cardBg }}
        >
          <div className="w-10 h-10 rounded-full border border-white/[0.05] mx-auto flex items-center justify-center">
            <Gift className="w-5 h-5" style={{ color: customColors.accent }} />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <span className="text-[9px] tracking-[0.2em] block font-mono" style={{ color: customColors.accent }}>
              CONTRIBUTIONS / 08
            </span>
            <h3 className="font-serif text-xl font-light text-[#F7F4EE]">
              {isRtl ? 'دفتر الهدايا والتحويلات' : 'Registry Contributions'}
            </h3>
            <p className="text-xs text-[#8D8A84] font-light">
              {isRtl
                ? 'لمن يرغب في مشاركة الثنائي المباركة والهدايا العينية'
                : 'For guests wishing to send direct marital gifts and registry blessings.'}
            </p>
          </div>
          <button
            onClick={onOpenBank}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.05] text-xs font-mono transition-all hover:scale-[1.02] cursor-pointer"
            style={{ color: customColors.accent }}
          >
            <span>{isRtl ? '[ عرض بيانات الحساب البنكي ]' : '[ VIEW BANKING ACCOUNT DATA ]'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default EditorialNoirLayout;
