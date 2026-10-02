import React, { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';
import { TemplateCardImageProps } from '../../model/templateContract';

export const ArabicLuxuryCardImage: React.FC<TemplateCardImageProps> = ({
  invitation,
  currentLang = 'ar',
  qrDataUrl,
}) => {
  const isRtl = currentLang === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  const colors = invitation.customColors || {
    bg: '#11100F',
    cardBg: '#191715',
    text: '#F7F1E8',
    accent: '#C9A46A',
  };

  const bg = colors.bg || '#11100F';
  const cardBg = colors.cardBg || '#191715';
  const accent = colors.accent || '#C9A46A';
  const text = colors.text || '#F7F1E8';

  const groom = invitation.eventDetails.groomName || (isRtl ? 'يُوسـف الشـريف' : 'Youssef');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'مَريـم غـانم' : 'Maryam');
  const hostNames = invitation.eventDetails.hostNames || (isRtl ? 'عائلتي الشريف وغانم' : 'The Host Families');

  // Parallax interaction
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX = 0, clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
    }

    mouseRef.current.targetX = (clientX / rect.width) - 0.5;
    mouseRef.current.targetY = (clientY / rect.height) - 0.5;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // Ambient floating gold dust & rose petal particles for the card background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      speed: Math.random() * 0.35 + 0.1,
      angle: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.25,
      isPetal: Math.random() > 0.8,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      particles.forEach((p) => {
        p.angle += 0.01;
        p.y -= p.speed;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const drawX = p.x + mouse.x * 12;
        const drawY = p.y + mouse.y * 12;

        if (p.isPetal) {
          ctx.save();
          ctx.translate(drawX, drawY);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(180, 40, 50, ${p.opacity * 0.6})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative border-4 border-double rounded-2xl p-7 sm:p-9 text-center shadow-2xl space-y-6 overflow-hidden font-serif select-none"
      style={{
        background: `linear-gradient(150deg, ${cardBg} 0%, #12100E 50%, ${bg} 100%)`,
        borderColor: accent,
        color: text,
      }}
    >
      {/* Dynamic Background Parallax Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-2xl opacity-80"
      />

      {/* Ornate Golden Arabesque Corner Ornaments */}
      <div className="absolute top-2.5 left-2.5 w-8 h-8 pointer-events-none text-[#C9A46A] opacity-90 drop-shadow-[0_0_6px_rgba(201,164,106,0.5)]">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
          <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
        </svg>
      </div>
      <div className="absolute top-2.5 right-2.5 w-8 h-8 pointer-events-none text-[#C9A46A] opacity-90 drop-shadow-[0_0_6px_rgba(201,164,106,0.5)] scale-x-[-1]">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
          <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
        </svg>
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-8 h-8 pointer-events-none text-[#C9A46A] opacity-90 drop-shadow-[0_0_6px_rgba(201,164,106,0.5)] scale-y-[-1]">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
          <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
        </svg>
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-8 h-8 pointer-events-none text-[#C9A46A] opacity-90 drop-shadow-[0_0_6px_rgba(201,164,106,0.5)] scale-[-1]">
        <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
          <path d="M0 0 v20 c4 -8, 12 -16, 20 -20 h-20 Z M4 4 h12 v4 h-8 v8 h-4 v-12 Z" />
        </svg>
      </div>

      {/* Card Body Content */}
      <div className="space-y-3 relative z-10">
        {/* Glowing Golden Living Heart Crest */}
        <div className="w-13 h-13 mx-auto rounded-full bg-gradient-to-br from-[#8C1D24] via-[#5C1117] to-[#2B080B] border-2 border-[#C9A46A] flex items-center justify-center shadow-[0_0_25px_rgba(201,164,106,0.65)]">
          <Heart className="w-6 h-6 text-[#C9A46A] fill-[#C9A46A] drop-shadow-[0_0_8px_rgba(201,164,106,0.9)]" />
        </div>

        <span className="text-[12px] sm:text-xs tracking-[0.25em] font-serif uppercase font-bold block" style={{ color: accent }}>
          {isRtl ? 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' : 'IN THE NAME OF ALLAH'}
        </span>

        <p className="text-[11px] font-serif text-[#D6CAB7] max-w-sm mx-auto leading-relaxed italic opacity-90">
          {isRtl
            ? '«وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»'
            : '“And of His signs is that He created for you mates that you may find tranquility in them”'}
        </p>

        <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: `${accent}60` }} />

        <p className="text-xs font-light pt-1" style={{ color: text, opacity: 0.85 }}>
          {isRtl
            ? (hostNames ? `تتشرف ${hostNames} بدعوتكم لحضور حفل زفاف` : 'تتشرف عائلاتنا بدعوتكم لحضور حفل زفاف')
            : 'Request the pleasure of your company to celebrate'}
        </p>

        {/* Groom & Bride Royal Names */}
        <h1 className="text-2xl sm:text-3xl font-extrabold py-1 font-serif tracking-wide text-[#F7F1E8] drop-shadow-[0_2px_12px_rgba(201,164,106,0.35)]">
          <span>{groom}</span>
          <span className="text-[#C9A46A] px-2.5 font-light">&</span>
          <span>{bride}</span>
        </h1>

        <p className="text-xs font-medium" style={{ color: accent }}>
          {invitation.eventDetails.eventTitle}
        </p>
      </div>

      {/* Date & Venue Plaque */}
      <div
        className="py-4 border-y grid grid-cols-2 gap-4 text-xs relative z-10"
        style={{ borderColor: `${accent}40` }}
      >
        <div>
          <span className="text-[10px] uppercase block" style={{ color: text, opacity: 0.7 }}>
            {isRtl ? 'الموعد' : 'Date'}
          </span>
          <strong className="block font-semibold text-sm" style={{ color: text }}>
            {invitation.eventDetails.eventDate}
          </strong>
          <span className="text-[11px] font-semibold" style={{ color: accent }}>
            {invitation.eventDetails.eventTime}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase block" style={{ color: text, opacity: 0.7 }}>
            {isRtl ? 'المكان' : 'Venue'}
          </span>
          <strong className="block font-semibold text-sm line-clamp-1" style={{ color: text }}>
            {invitation.eventDetails.venueName}
          </strong>
          <span className="text-[11px] line-clamp-1" style={{ color: text, opacity: 0.8 }}>
            {invitation.eventDetails.address}
          </span>
        </div>
      </div>

      {/* QR Code Container with Accent Border */}
      <div className="flex flex-col items-center justify-center space-y-1.5 relative z-10">
        <div
          className="p-2 bg-white rounded-xl shadow-md inline-block border-2"
          style={{ borderColor: accent }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="w-20 h-20 object-contain"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />
          )}
        </div>
        <span className="text-[10px] font-semibold" style={{ color: accent }}>
          {isRtl
            ? 'امسح الرمز لفتح لوحة الحب الحية وتأكيد الحضور (RSVP) ✨'
            : 'Scan QR for Living Romantic Canvas & RSVP ✨'}
        </span>
      </div>
    </div>
  );
};
