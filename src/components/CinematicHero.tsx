import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Play,
  Heart,
  ChevronDown,
  Calendar,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '../types';
import { EgyptianVIPProfile, EGYPTIAN_VIP_PROFILES } from '../data/vipProfiles';
import { colors, typography } from '../styles/designTokens';

gsap.registerPlugin(ScrollTrigger);

export type { EgyptianVIPProfile };
export { EGYPTIAN_VIP_PROFILES };

interface CinematicHeroProps {
  currentLang: Language;
  onStartCreate: () => void;
  onExploreDesigns: () => void;
  onOpenDemoPreview: (profile?: EgyptianVIPProfile) => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  currentLang,
  onStartCreate,
  onExploreDesigns,
  onOpenDemoPreview,
}) => {
  const isRtl = currentLang === 'ar';
  const [activeProfileIdx, setActiveProfileIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInteractiveOpened, setIsInteractiveOpened] = useState(false);

  // References for GSAP ScrollTrigger
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const sealLeftRef = useRef<HTMLDivElement>(null);
  const sealRightRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const cardTypoHeaderRef = useRef<HTMLDivElement>(null);
  const cardDetailsRef = useRef<HTMLDivElement>(null);
  const cardCtaRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);

  // Rotate demo profile every 10 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveProfileIdx((prev) => (prev + 1) % EGYPTIAN_VIP_PROFILES.length);
    }, 600000);
    return () => clearInterval(timer);
  }, []);

  const activeProfile = EGYPTIAN_VIP_PROFILES[activeProfileIdx];

  // 1. Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // 2. High-performance ambient gold dust micro-particles
  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particleCount = window.innerWidth < 768 ? 14 : 26;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.4,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.3 - 0.05,
      alpha: Math.random() * 0.45 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 106, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  // 3. GSAP Scroll-Controlled Envelope Reveal ("THE INVITATION THEATRE")
  // Sequence Milestones:
  // 0%: Envelope closed
  // 15%: Subtle light appears
  // 25%: Wax seal / emblem reacts
  // 35%: Seal breaks
  // 45%: Envelope begins opening
  // 55%: Invitation begins emerging
  // 65%: Invitation rises
  // 75%: Typography appears
  // 85%: Names / date / event details appear
  // 100%: Full invitation experience becomes visible -> ENTER THE EXPERIENCE
  useEffect(() => {
    if (reducedMotion || !heroSectionRef.current || !pinContainerRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: isMobile ? '+=1000' : '+=1600',
          pin: pinContainerRef.current,
          scrub: 0.8,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            if (self.progress > 0.4) {
              setIsInteractiveOpened(true);
            } else {
              setIsInteractiveOpened(false);
            }
          },
        },
      });

      // 0% -> 25%: Title block fades gently and ambient light intensifies
      if (titleBlockRef.current) {
        tl.to(
          titleBlockRef.current,
          {
            opacity: 0.2,
            y: -25,
            ease: 'power1.out',
            duration: 0.25,
          },
          0
        );
      }

      // 0% -> 15%: Subtle light emerges behind envelope
      if (ambientGlowRef.current) {
        tl.fromTo(
          ambientGlowRef.current,
          { opacity: 0.25, scale: 0.9 },
          { opacity: 0.75, scale: 1.15, ease: 'power2.out', duration: 0.25 },
          0
        );
      }

      // 15% -> 25%: Wax seal reacts (pulses, glows, scales up)
      if (sealRef.current) {
        tl.to(
          sealRef.current,
          {
            scale: 1.2,
            filter: 'drop-shadow(0 0 16px rgba(212, 175, 55, 0.8))',
            ease: 'power2.inOut',
            duration: 0.1,
          },
          0.15
        );
      }

      // 25% -> 35%: Wax seal breaks into two halves parting smoothly
      if (sealLeftRef.current && sealRightRef.current) {
        tl.to(
          sealLeftRef.current,
          {
            x: -24,
            rotation: -18,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.1,
          },
          0.25
        ).to(
          sealRightRef.current,
          {
            x: 24,
            rotation: 18,
            opacity: 0,
            ease: 'power2.in',
            duration: 0.1,
          },
          0.25
        );
      }

      // 35% -> 50%: Flap opens upward in 3D (rotateX 180deg)
      if (flapRef.current) {
        tl.to(
          flapRef.current,
          {
            rotateX: 180,
            transformOrigin: 'top center',
            ease: 'power2.inOut',
            duration: 0.15,
          },
          0.35
        );
      }

      // 45% -> 65%: Invitation card begins emerging and rises upward from pocket
      if (cardRef.current) {
        tl.to(
          cardRef.current,
          {
            y: isMobile ? -140 : -220,
            scale: isMobile ? 1.04 : 1.1,
            boxShadow: '0 30px 70px rgba(0,0,0,0.9), 0 0 50px rgba(201,168,106,0.3)',
            ease: 'power2.out',
            duration: 0.3,
          },
          0.45
        );
      }

      // 65% -> 75%: Headline typography on card appears
      if (cardTypoHeaderRef.current) {
        tl.fromTo(
          cardTypoHeaderRef.current,
          { opacity: 0.2, y: 15 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.15 },
          0.65
        );
      }

      // 75% -> 85%: Names / date / venue micro-details glide into crisp clarity
      if (cardDetailsRef.current) {
        tl.fromTo(
          cardDetailsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'power2.out', duration: 0.15 },
          0.75
        );
      }

      // 85% -> 100%: CTA 'ENTER THE EXPERIENCE' glows into full prominence
      if (cardCtaRef.current) {
        tl.fromTo(
          cardCtaRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, ease: 'back.out(1.5)', duration: 0.15 },
          0.85
        );
      }
    }, heroSectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSealClick = () => {
    // Immediate tactile unveil or open
    onOpenDemoPreview(activeProfile);
  };

  return (
    <section
      ref={heroSectionRef}
      id="hero"
      aria-label={isRtl ? 'مسرح الدعوة' : 'The Invitation Theatre'}
      className="relative bg-[#080808] text-[#F4EFE7] overflow-hidden"
    >
      {/* Ambient Particle Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Pinned Cinema Container */}
      <div
        ref={pinContainerRef}
        className="relative z-10 w-full min-h-screen flex flex-col justify-between py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        {/* Subtle Ambient Radial Lighting Core */}
        <div
          ref={ambientGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[550px] bg-[#C9A86A]/10 rounded-full blur-[160px] pointer-events-none transition-opacity duration-700"
          style={{
            opacity: reducedMotion ? 0.6 : Math.min(1, 0.35 + scrollProgress * 0.65),
          }}
        />

        {/* 1. Header Hero Typography Block (Digital Couture) */}
        <div
          ref={titleBlockRef}
          className="text-center space-y-4 max-w-3xl mx-auto pt-4 sm:pt-8 transition-transform duration-300"
        >
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.3em] uppercase text-[#C9A86A]">
            <span>FRIDA</span>
            <span aria-hidden="true">·</span>
            <span>DIGITAL COUTURE</span>
          </div>

          <h1
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFE7] leading-tight"
          >
            {isRtl ? (
              <>
                الدعوة ليست أول صفحة في الحفل.{' '}
                <span className="gold-shimmer-text block mt-1">الدعوة هي أول لحظة منه.</span>
              </>
            ) : (
              <>
                It's Not Just an Invitation.{' '}
                <span className="gold-shimmer-text block mt-1">
                  It's The First Moment of The Story.
                </span>
              </>
            )}
          </h1>

          <p className="text-xs sm:text-sm text-[#D9C8A5]/80 max-w-xl mx-auto font-light leading-relaxed">
            {isRtl
              ? 'هناك دعوات تُفتح... وهناك دعوات تُعاش. اصنع لحظة يتذكرها ضيوفك قبل أن يصلوا.'
              : 'Some invitations are opened. Yours is experienced. Create a moment your guests remember before they arrive.'}
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onStartCreate}
              data-cursor="CREATE"
              className="px-6 sm:px-7 py-3 rounded-full bg-gradient-to-r from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(201,168,106,0.5)] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              {isRtl ? 'اصنع لحظتك' : 'Create Your Moment'}
            </button>

            <button
              onClick={() => onOpenDemoPreview(activeProfile)}
              data-cursor="OPEN"
              className="px-5 sm:px-6 py-3 rounded-full border border-[#C9A86A]/40 text-[#F4EFE7] hover:bg-[#C9A86A]/10 text-xs font-semibold tracking-wider transition-colors cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{isRtl ? 'شاهد التجربة' : 'Experience Demo'}</span>
            </button>
          </div>
        </div>

        {/* 2. THE SPATIAL 3D ENVELOPE OBJECT */}
        <div className="relative my-auto flex items-center justify-center py-8 sm:py-12 perspective-[1400px]">
          <div
            className="relative w-[310px] sm:w-[440px] md:w-[500px] h-[210px] sm:h-[280px] md:h-[310px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Envelope Back Body (Base Layer with textured cardstock & royal damask inside) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1A17] to-[#12110F] rounded-2xl border border-[#C9A86A]/30 shadow-2xl overflow-hidden">
              {/* Inner Lining Pattern (visible when card slides out) */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle at center, #C9A86A 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                }}
              />
              <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-[#C9A86A]/30 to-transparent" />
            </div>

            {/* The Hidden Royal Invitation Card (Slides Out) */}
            <div
              ref={cardRef}
              onClick={() => onOpenDemoPreview(activeProfile)}
              data-cursor="OPEN"
              tabIndex={0}
              role="button"
              aria-label={isRtl ? 'فتح دعوة الزفاف الحية' : 'Open live invitation preview'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenDemoPreview(activeProfile);
                }
              }}
              className="absolute inset-x-3 sm:inset-x-5 top-3 sm:top-5 bottom-3 sm:bottom-5 rounded-xl bg-gradient-to-b from-[#161513] via-[#1A1815] to-[#11100E] border border-[#C9A86A]/50 p-4 sm:p-6 flex flex-col justify-between text-center shadow-2xl cursor-pointer select-none transition-all duration-300 z-10 hover:border-[#C9A86A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A86A]"
              style={{
                transform: reducedMotion ? 'translateY(-140px)' : 'translateY(0px)',
              }}
            >
              {/* Card Gold Trim Inner Border */}
              <div className="absolute inset-1.5 border border-[#C9A86A]/25 rounded-lg pointer-events-none" />

              {/* Emerging Headline Typography */}
              <div ref={cardTypoHeaderRef} className="space-y-1.5 relative z-10">
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#C9A86A] uppercase block">
                  {isRtl ? 'دعوة زفاف ملكية' : 'ROYAL WEDDING SUITE'}
                </span>
                <p className="text-[10px] text-[#D9C8A5]/70 font-light">
                  {isRtl ? 'يتشرفون بدعوتكم لحضور حفل' : 'Cordially invite you to celebrate'}
                </p>
                <h3
                  style={{
                    fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                  }}
                  className="text-lg sm:text-2xl font-bold text-[#F4EFE7] pt-1"
                >
                  {isRtl ? activeProfile.hostsAr : activeProfile.hostsEn}
                </h3>
              </div>

              {/* Emerging Date / Venue Micro Details */}
              <div
                ref={cardDetailsRef}
                className="space-y-2 pt-2 border-t border-[#C9A86A]/15 relative z-10"
                style={{ opacity: reducedMotion ? 1 : Math.max(0, (scrollProgress - 0.4) * 2) }}
              >
                <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-[#D9C8A5]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C9A86A]" />
                    {isRtl ? 'الجمعة، ٢٠ نوفمبر ٢٠٢٦' : 'Friday, Nov 20, 2026'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C9A86A]" />
                    {isRtl ? activeProfile.venueAr : activeProfile.venueEn}
                  </span>
                </div>
              </div>

              {/* 100% Transition Button: ENTER THE EXPERIENCE */}
              <div
                ref={cardCtaRef}
                className="pt-1 relative z-10"
                style={{ opacity: reducedMotion ? 1 : Math.max(0, (scrollProgress - 0.65) * 2.5) }}
              >
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-[#080808] bg-gradient-to-r from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(201,168,106,0.4)] hover:brightness-110 transition-transform active:scale-95">
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isRtl ? 'افتح التجربة الحية' : 'Enter The Experience'}</span>
                </div>
              </div>
            </div>

            {/* Envelope Triangular Flap (Folds Open 3D with realistic front & lining backface) */}
            <div
              ref={flapRef}
              className="absolute top-0 inset-x-0 h-1/2 z-20 origin-top"
              style={{
                transformStyle: 'preserve-3d',
                transform: reducedMotion ? 'rotateX(180deg)' : 'rotateX(0deg)',
              }}
            >
              {/* Outer Flap Face (Visible when closed) */}
              <svg
                viewBox="0 0 500 160"
                className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,0 500,0 250,150"
                  fill="#1C1A17"
                  stroke="#C9A86A"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
              </svg>
            </div>

            {/* Envelope Front Pocket (Lower Triangular Layer with gold hairline edge) */}
            <div className="absolute inset-0 pointer-events-none z-30">
              <svg
                viewBox="0 0 500 310"
                className="w-full h-full drop-shadow-[0_-6px_20px_rgba(0,0,0,0.8)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,310 500,310 250,140"
                  fill="#141311"
                  stroke="#C9A86A"
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                />
              </svg>
            </div>

            {/* Wax Seal Emblem (Center of envelope - splits on reveal) */}
            <div
              ref={sealRef}
              onClick={handleSealClick}
              tabIndex={0}
              role="button"
              aria-label={isRtl ? 'كسر ختم الشمع وفتح الدعوة' : 'Break wax seal and open invitation'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSealClick();
                }
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A86A]"
              title={isRtl ? 'المس ختم الشمع' : 'Tap Wax Seal'}
              data-cursor="OPEN"
              style={{
                opacity: reducedMotion ? 0 : 1,
                pointerEvents: isInteractiveOpened ? 'none' : 'auto',
              }}
            >
              {/* Left Half of Wax Seal */}
              <div
                ref={sealLeftRef}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8C1D24] via-[#5C1117] to-[#36090D] border-2 border-[#C9A86A] shadow-[0_0_25px_rgba(140,29,36,0.7)] flex items-center justify-center overflow-hidden"
                style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C9A86A]/40 flex items-center justify-center">
                  <span className="font-playfair font-black text-sm text-[#F4EFE7] tracking-wider pr-1">
                    F
                  </span>
                </div>
              </div>

              {/* Right Half of Wax Seal */}
              <div
                ref={sealRightRef}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8C1D24] via-[#5C1117] to-[#36090D] border-2 border-[#C9A86A] shadow-[0_0_25px_rgba(140,29,36,0.7)] flex items-center justify-center overflow-hidden"
                style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#C9A86A]/40 flex items-center justify-center">
                  <span className="font-playfair font-black text-sm text-[#F4EFE7] tracking-wider pl-1">
                    R
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Minimal Interaction Hint */}
        <div className="text-center pb-2 sm:pb-4 text-xs font-mono text-[#D9C8A5]/60 flex flex-col items-center gap-1.5 select-none">
          <span className="tracking-[0.2em] uppercase">
            {isRtl ? 'مرّر لاكتشاف اللحظة' : 'SCROLL TO REVEAL'}
          </span>
          <ChevronDown className="w-4 h-4 text-[#C9A86A] animate-bounce" />
        </div>
      </div>
    </section>
  );
};
