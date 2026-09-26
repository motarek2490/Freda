import React, { useRef } from 'react';
import { Sparkles, Heart, Feather, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { colors, typography } from '../styles/designTokens';

interface BrandStorySectionProps {
  currentLang: Language;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ currentLang }) => {
  const isRtl = currentLang === 'ar';
  const sectionRef = useRef<HTMLDivElement>(null);

  const pillars = [
    {
      id: 'heritage',
      icon: Feather,
      titleAr: 'أصالة الضيافة والمقام الرفيع',
      titleEn: 'Heritage of Gracious Hospitality',
      descAr:
        'في ثقافتنا، الدعوة ليست مجرد إشعار بموعد، بل هي إكرام وتقدير يُقدّم لكل ضيف باسمه ومقامه بما يليق ببهجة المناسبة.',
      descEn:
        'In our culture, an invitation is never a mere date reminder; it is a gesture of esteem and honor presented to each guest.',
    },
    {
      id: 'craft',
      icon: Sparkles,
      titleAr: 'حرفية دار أزياء رقمية',
      titleEn: 'Haute Couture Digital Craft',
      descAr:
        'نعتني بجماليات الخطوط العربية الموزونة، ودرجات الذهبي الدافئ، والتناغم بين الصوت والحركة كما يُعتنى بأدق تفاصيل فساتين الزفاف.',
      descEn:
        'We attend to classical typography, warm gold foils, and acoustic rhythm with the precision of a couture atelier.',
    },
    {
      id: 'privacy',
      icon: ShieldCheck,
      titleAr: 'احترام الخصوصية والوقار',
      titleEn: 'Sanctity of Privacy & Dignity',
      descAr:
        'دعواتكم خاصة بكم؛ نوفر روابط مؤمنة بالكامل وخيارات لتحديد الضيوف وكلمات مرور شخصية لتبقى ذكرياتكم في دائرة أحبابكم فقط.',
      descEn:
        'Your sacred moments belong to you. We provide private links, password gates, and host control to safeguard your memories.',
    },
  ];

  return (
    <section
      id="story"
      ref={sectionRef}
      aria-label={isRtl ? 'قصة فريدا' : 'The FRIDA Story'}
      className="relative py-24 sm:py-32 bg-[#080808] text-[#F4EFE7] overflow-hidden border-t border-[#C9A86A]/15"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#C9A86A]/8 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A86A]/30 bg-[#111111] text-[#C9A86A] text-xs font-semibold uppercase tracking-widest shadow-md">
            <Heart className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{isRtl ? 'رؤية فرِيدا' : 'THE FRIDA ESSENCE'}</span>
          </div>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#F4EFE7] leading-tight"
          >
            {isRtl ? (
              <>
                من مصر، لكل لحظة <span className="gold-shimmer-text italic">تستحق أن تُروى</span>
              </>
            ) : (
              <>
                From Egypt, For Every Moment <span className="gold-shimmer-text italic">Worth Telling</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-2xl mx-auto">
            {isRtl
              ? 'انطلقنا من مصر بشغف يمزج كرم الضيافة وعراقة تقاليد الأفراح مع أحدث أساليب الفن الرقمي التفاعلي، لنصنع دعوة تليق بمقامكم.'
              : 'Born in Egypt with a dedication to marry time-honored celebration hospitality with state-of-the-art interactive digital craft.'}
          </p>
        </div>

        {/* Story Focus Statement */}
        <div className="py-12 px-6 sm:px-12 border border-[#C9A86A]/20 text-center bg-[#111111] rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C9A86A]/5 to-transparent pointer-events-none" />

          <div className="space-y-4 relative z-10">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A86A] font-mono font-bold block">
              {isRtl ? 'فلسفة التصميم' : 'DESIGN PHILOSOPHY'}
            </span>

            <p
              style={{
                fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
              }}
              className="text-xl sm:text-3xl lg:text-4xl font-bold text-[#F4EFE7] leading-relaxed"
            >
              {isRtl
                ? '«البطاقة الورقية تُنسى في الأدراج.. أما اللحظة التفاعلية فتبقى حية في وجدان كل من يحضرها.»'
                : '“Paper cards get tucked away in drawers; an interactive reveal lingers in the hearts of those you hold dear.”'}
            </p>

            <p className="text-xs sm:text-sm text-[#D9C8A5]/80 max-w-xl mx-auto font-light leading-relaxed pt-2">
              {isRtl
                ? 'لهذا السبب صممنا كل تفصيلة في فريدا — من صوت فتح الختم حتى نغمة الموسيقى — لتكون امتداداً لهيبة وجمال يومكم المنشود.'
                : 'Every element in FRIDA is tuned with meticulous reverence to become a living extension of your celebration’s dignity.'}
            </p>
          </div>
        </div>

        {/* 3 Story Pillar Cards (Semantic <article>) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.id}
                className="bg-[#111111] border border-[#C9A86A]/20 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-[#C9A86A]/60 transition-all duration-300 shadow-xl group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#171717] border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A] group-hover:scale-105 transition-transform duration-300 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>

                <h3
                  style={{
                    fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                  }}
                  className="text-lg sm:text-xl font-bold text-[#F4EFE7] group-hover:text-[#C9A86A] transition-colors"
                >
                  {isRtl ? pillar.titleAr : pillar.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-[#D9C8A5]/80 leading-relaxed font-light">
                  {isRtl ? pillar.descAr : pillar.descEn}
                </p>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
};
