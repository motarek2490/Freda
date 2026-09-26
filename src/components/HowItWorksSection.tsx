import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Palette,
  Sliders,
  MailOpen,
  Send,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '../types';
import { colors, typography } from '../styles/designTokens';

gsap.registerPlugin(ScrollTrigger);

interface HowItWorksSectionProps {
  currentLang: Language;
  onStartCreate: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  currentLang,
  onStartCreate,
}) => {
  const isRtl = currentLang === 'ar';
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  const steps = [
    {
      num: '01',
      actionKey: 'choose',
      titleAr: 'اختر',
      subtitleAr: 'انتقِ قالباً يعبر عن روح اللحظة',
      descAr:
        'تصفح أتيليه فريدا المكوّن من 41 قالباً استثنائياً؛ من الكلاسيكية الملكية والزخارف العربية حتى البوهو والتصاميم السينمائية الحديثة.',
      titleEn: 'Choose',
      subtitleEn: 'Select a canvas that echoes your aesthetic',
      descEn:
        'Explore the curated Atelier of 41 distinctive designs ranging from baroque royal gold to modern minimal and intimate romantic layouts.',
      icon: Palette,
      visualTagAr: '41 قالباً في الأتيليه',
      visualTagEn: '41 Atelier Pieces',
    },
    {
      num: '02',
      actionKey: 'customize',
      titleAr: 'خصّص',
      subtitleAr: 'ضع بصمتكم في كل تفصيلة',
      descAr:
        'أدخل أسماء العروسين أو أصحاب الحفل، التاريخ، القاعة ورابط الخريطة، واختر مقطع الموسيقى التصويرية من مكتبتنا أو ارفع مقطعك الخاص وقصّه بسهولة.',
      titleEn: 'Customize',
      subtitleEn: 'Imbue your personal signature',
      descEn:
        'Enter names, ceremony date, ballroom address, and tailor your background soundtrack directly in our studio.',
      icon: Sliders,
      visualTagAr: 'تخصيص كامل وموسيقى',
      visualTagEn: 'Full Customization & Audio',
    },
    {
      num: '03',
      actionKey: 'unveil',
      titleAr: 'اكشف',
      subtitleAr: 'عاين سحر التجربة الحية',
      descAr:
        'شاهد الدعوة كما سيراها ضيوفك تماماً: لمس ختم الشمع الملكي، انسياب الموسيقى الفورية، وتأثيرات ظهور بطاقة الدعوة بوقار.',
      titleEn: 'Unveil',
      subtitleEn: 'Preview the royal unveiling',
      descEn:
        'Experience the ceremonial wax seal break, the acoustic swell of your soundtrack, and the card reveal exactly as your guests will feel it.',
      icon: MailOpen,
      visualTagAr: 'محاكاة الظرف الملكي',
      visualTagEn: 'Live Ritual Simulation',
    },
    {
      num: '04',
      actionKey: 'share',
      titleAr: 'شارك',
      subtitleAr: 'انشر الفرح وتابع ضيوفك',
      descAr:
        'احصل على رابطك الرقمي الخاص وأرسله فوراً عبر واتساب، وتابع ردود تأكيد الحضور (RSVP) وقائمة المدعوين في بوابتك الخاصة لحظة بلحظة.',
      titleEn: 'Share',
      subtitleEn: 'Invite gracefully & track RSVPs',
      descEn:
        'Distribute your custom URL instantly via WhatsApp, and manage attendee confirmations and guest plus-ones in your private Host Portal.',
      icon: Send,
      visualTagAr: 'مشاركة واتساب & RSVP',
      visualTagEn: 'WhatsApp Share & RSVP',
    },
  ];

  // GSAP ScrollTrigger to update active step as user scrolls through the steps
  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const stepElements = gsap.utils.toArray<HTMLElement>('.scroll-step-card');

      stepElements.forEach((el, index) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 65%',
          end: 'bottom 45%',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      aria-label={isRtl ? 'من فكرة إلى دعوة' : 'From Idea to Invitation'}
      className="py-24 sm:py-32 bg-[#080808] text-[#F4EFE7] relative overflow-hidden border-t border-[#C9A86A]/15"
    >
      {/* Soft Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#C9A86A]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111111] border border-[#C9A86A]/30 text-[#C9A86A] text-xs font-semibold tracking-widest uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{isRtl ? 'رحلة ابتكار الدعوة' : 'THE CREATION JOURNEY'}</span>
          </div>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFE7] leading-tight"
          >
            {isRtl ? (
              <>
                من فكرة إلى <span className="gold-shimmer-text italic">دعوة تخلّد الذكرى</span>
              </>
            ) : (
              <>
                From an Idea to a <span className="gold-shimmer-text italic">Living Heirlooms</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-2xl mx-auto">
            {isRtl
              ? 'أربع خطوات سينمائية سلسة تحول تفاصيل مناسبتكم إلى تحفة رقمية ملكية تُشارك بكل وقار.'
              : 'Four effortless editorial steps transforming your celebration details into a royal interactive statement.'}
          </p>
        </div>

        {/* Desktop Sticky Progress Navigation Bar */}
        <div className="hidden lg:flex items-center justify-between bg-[#111111]/90 border border-[#C9A86A]/25 rounded-2xl p-4 backdrop-blur-md shadow-xl sticky top-20 z-20">
          {steps.map((st, idx) => {
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;
            const Icon = st.icon;

            return (
              <button
                key={st.num}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  const target = document.getElementById(`step-card-${idx}`);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C9A86A] text-[#080808] font-bold shadow-md'
                    : isCompleted
                    ? 'text-[#C9A86A] hover:bg-[#1A1A1A]'
                    : 'text-[#D9C8A5]/60 hover:text-[#F4EFE7]'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    isActive
                      ? 'bg-[#080808] text-[#C9A86A]'
                      : isCompleted
                      ? 'bg-[#C9A86A]/20 text-[#C9A86A]'
                      : 'bg-[#1C1C1C] text-[#8D8A84]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.num}
                </div>
                <span className="text-xs font-semibold">
                  {isRtl ? st.titleAr : st.titleEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4 Visual Scroll-Driven Steps (Semantic <ol> & <li>) */}
        <ol className="space-y-10 sm:space-y-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;

            return (
              <li
                key={step.num}
                id={`step-card-${idx}`}
                className={`scroll-step-card bg-[#111111] rounded-3xl border transition-all duration-500 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl ${
                  isActive
                    ? 'border-[#C9A86A] shadow-[0_20px_50px_rgba(201,168,106,0.15)] bg-gradient-to-br from-[#181818] via-[#111111] to-[#0E0E0E]'
                    : 'border-[#C9A86A]/20 opacity-80 hover:opacity-100 hover:border-[#C9A86A]/50'
                }`}
              >
                {/* Background Large Monogram Watermark */}
                <div className="absolute top-2 right-4 text-7xl sm:text-9xl font-mono font-black text-[#C9A86A]/5 pointer-events-none select-none">
                  {step.num}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  
                  {/* Left Column: Number, Badge, Title, Description */}
                  <div className="lg:col-span-7 space-y-4 text-start">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-[#C9A86A] bg-[#C9A86A]/10 border border-[#C9A86A]/30 px-3 py-1 rounded-full">
                        {step.num}
                      </span>
                      <span className="text-xs font-mono uppercase tracking-wider text-[#D9C8A5]">
                        {isRtl ? step.visualTagAr : step.visualTagEn}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                      }}
                      className="text-2xl sm:text-4xl font-bold text-[#F4EFE7] leading-tight"
                    >
                      <span className="text-[#C9A86A]">{isRtl ? step.titleAr : step.titleEn}</span>{' '}
                      — <span>{isRtl ? step.subtitleAr : step.subtitleEn}</span>
                    </h3>

                    <p className="text-xs sm:text-base text-[#D9C8A5]/90 font-light leading-relaxed max-w-xl">
                      {isRtl ? step.descAr : step.descEn}
                    </p>
                  </div>

                  {/* Right Column: Visual Exhibition Icon Stage */}
                  <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-[#171717] border border-[#C9A86A]/40 flex items-center justify-center text-[#C9A86A] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-2 border border-[#C9A86A]/15 rounded-2xl" />
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#C9A86A]/25 via-[#D9C8A5]/10 to-transparent flex items-center justify-center text-[#C9A86A] shadow-inner">
                        <Icon className="w-10 h-10 sm:w-12 sm:h-12" />
                      </div>
                    </div>
                  </div>

                </div>
              </li>
            );
          })}
        </ol>

        {/* Final CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onStartCreate}
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-gradient-to-r from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(201,168,106,0.5)] transition-all cursor-pointer shadow-xl transform hover:-translate-y-0.5"
          >
            <span>{isRtl ? 'ابدأ الآن — اصنع لحظتك' : 'Begin Now — Craft Your Invitation'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </section>
  );
};
