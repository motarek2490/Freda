import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Crown, Feather, Heart } from 'lucide-react';
import { Language, Template } from '../types';
import { colors, typography } from '../styles/designTokens';
import { TEMPLATES } from '../data/templates';

interface WhatWillTheyFeelSectionProps {
  currentLang: Language;
  onSelectMood: (mood: string) => void;
  onExploreTemplate: (template: Template) => void;
}

export const WhatWillTheyFeelSection: React.FC<WhatWillTheyFeelSectionProps> = ({
  currentLang,
  onSelectMood,
  onExploreTemplate,
}) => {
  const isRtl = currentLang === 'ar';
  const [activeMood, setActiveMood] = useState<'royal' | 'editorial' | 'romantic'>('royal');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const moods = [
    {
      id: 'royal' as const,
      icon: Crown,
      nameAr: 'ملكي — ROYAL',
      nameEn: 'ROYAL',
      statementAr: 'اصنع دخولًا يليق باللحظة.',
      statementEn: 'Make an entrance.',
      descAr:
        'هيبة الذهب المعتق، الأرابيسك الأندلسي، والوقار الإمبراطوري الذي يترك انطباع الفخامة الأولى قبل وصول الضيوف.',
      descEn:
        'Aged gold foils, Andalusian arabesques, and imperial poise setting a majestic prelude for your guests.',
      accent: '#C9A86A',
      haloColor: 'rgba(201, 168, 106, 0.15)',
      sampleTemplateId: 'royal-gold',
      fontStyle: isRtl ? "'Amiri', serif" : "'Playfair Display', serif",
    },
    {
      id: 'editorial' as const,
      icon: Feather,
      nameAr: 'إديتوريال — EDITORIAL',
      nameEn: 'EDITORIAL',
      statementAr: 'اجعلها لا تُنسى.',
      statementEn: 'Make it unforgettable.',
      descAr:
        'جماليات أغلفة المجلات العالمية، خطوط حادة وموزونة، دراما الأبيض والأسود (Noir) مع مساحات تنفس سينمائية جريئة.',
      descEn:
        'High-fashion magazine editorial aesthetics, stark typography, monochrome noir drama, and generous cinematic whitespace.',
      accent: '#F4EFE7',
      haloColor: 'rgba(244, 239, 231, 0.12)',
      sampleTemplateId: 'editorial-noir',
      fontStyle: isRtl ? "'Cairo', sans-serif" : "'Cormorant Garamond', serif",
    },
    {
      id: 'romantic' as const,
      icon: Heart,
      nameAr: 'رومانسي — ROMANTIC',
      nameEn: 'ROMANTIC',
      statementAr: 'اجعلها تشبهكم.',
      statementEn: 'Make it personal.',
      descAr:
        'نعومة الورود الخافتة، ألوان الباستيل الدافئة، ونغمات رقيقة تروي حكاية حبكم بنقاء وشاعرية تلامس القلب.',
      descEn:
        'Soft botanical whispers, rose quartz warmth, and acoustic poetics telling your love story with intimate grace.',
      accent: '#E6B8B8',
      haloColor: 'rgba(230, 184, 184, 0.15)',
      sampleTemplateId: 'rose-velvet',
      fontStyle: isRtl ? "'Noto Naskh Arabic', serif" : "'Playfair Display', italic",
    },
  ];

  const currentMoodObj = moods.find((m) => m.id === activeMood) || moods[0];
  const matchedTemplate =
    TEMPLATES.find((t) => t.id === currentMoodObj.sampleTemplateId) || TEMPLATES[0];

  return (
    <section
      id="feel"
      aria-label={isRtl ? 'ماذا تريد أن يشعروا؟' : 'What Will They Feel?'}
      className="py-24 sm:py-32 bg-[#080808] text-[#F4EFE7] relative overflow-hidden transition-colors duration-700 border-t border-[#C9A86A]/15"
    >
      {/* Dynamic Background Atmosphere Lighting according to active mood */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[550px] rounded-full blur-[170px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: currentMoodObj.haloColor }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.3em] uppercase text-[#C9A86A]">
            <span>ATMOSPHERIC WORLDS</span>
            <span aria-hidden="true">·</span>
            <span>EMOTIONAL SIGNATURE</span>
          </div>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFE7] leading-tight"
          >
            {isRtl ? (
              <>
                ماذا تريد أن <span className="italic gold-shimmer-text">يشعروا؟</span>
              </>
            ) : (
              <>
                What Will They <span className="italic gold-shimmer-text">Feel?</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-2xl mx-auto">
            {isRtl
              ? 'كل دعوة في فرِيدا تنقلك إلى عالم شعوري مستقل. اختر الطابع الذي يعكس هويتكم ولحظتكم المنشودة.'
              : 'Every creation in FRIDA belongs to a distinct emotional world. Select the aura that mirrors your story.'}
          </p>
        </div>

        {/* 3 Interactive Mood Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {moods.map((m) => {
            const Icon = m.icon;
            const isSelected = activeMood === m.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  setActiveMood(m.id);
                  onSelectMood(m.id);
                }}
                data-cursor="EXPLORE"
                className={`p-7 sm:p-9 rounded-3xl border transition-all duration-500 cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-xl ${
                  isSelected
                    ? `border-[#C9A86A] bg-gradient-to-b from-[#181613] to-[#0E0D0B] shadow-[0_20px_45px_rgba(201,168,106,0.18)] ${reducedMotion ? '' : '-translate-y-1'}`
                    : `border-[#C9A86A]/20 bg-[#111111]/70 hover:border-[#C9A86A]/60 ${reducedMotion ? '' : 'hover:-translate-y-0.5'}`
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-inner"
                      style={{
                        backgroundColor: isSelected ? 'rgba(201, 168, 106, 0.15)' : '#171717',
                        borderColor: isSelected ? '#C9A86A' : 'rgba(201, 168, 106, 0.25)',
                        color: m.accent,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#D9C8A5]/60">
                      WORLD 0{moods.indexOf(m) + 1}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#C9A86A] block mb-1">
                      {isRtl ? m.nameAr : m.nameEn}
                    </span>
                    <h3
                      style={{
                        fontFamily: m.fontStyle,
                      }}
                      className="text-2xl sm:text-3xl font-bold text-[#F4EFE7] leading-tight"
                    >
                      {isRtl ? m.statementAr : m.statementEn}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#D9C8A5]/80 font-light leading-relaxed">
                    {isRtl ? m.descAr : m.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#C9A86A]/15 flex items-center justify-between text-xs">
                  <span className="font-mono text-[#D9C8A5]/60 text-[11px]">
                    {isSelected ? (isRtl ? '● العالم النشط' : '● Active Atmosphere') : (isRtl ? 'انقر للدخول' : 'Click to enter')}
                  </span>
                  <span className="text-[#C9A86A] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>{isRtl ? 'استعراض' : 'Explore'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic World Showcase Spotlight Banner */}
        <div className="bg-[#111111] rounded-3xl border border-[#C9A86A]/30 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-start">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A86A]">
                {isRtl ? 'القالب النموذجي لهذا العالم' : 'SIGNATURE PIECE FOR THIS MOOD'}
              </span>

              <h4
                style={{
                  fontFamily: currentMoodObj.fontStyle,
                }}
                className="text-2xl sm:text-4xl font-bold text-[#F4EFE7]"
              >
                {matchedTemplate.title[currentLang] || matchedTemplate.title.en}
              </h4>

              <p className="text-xs sm:text-sm text-[#D9C8A5]/80 font-light leading-relaxed max-w-xl">
                {matchedTemplate.description[currentLang] || matchedTemplate.description.en}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onExploreTemplate(matchedTemplate)}
                  data-cursor="OPEN"
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C9A86A] to-[#E6D7B8] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(201,168,106,0.4)] transition-all cursor-pointer"
                >
                  {isRtl ? 'معاينة هذا القالب الحقيقي' : 'Preview Real Invitation'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                onClick={() => onExploreTemplate(matchedTemplate)}
                data-cursor="OPEN"
                className="relative w-full max-w-[280px] aspect-[3/4] rounded-2xl overflow-hidden border border-[#C9A86A]/40 shadow-2xl group cursor-pointer"
              >
                <img
                  src={matchedTemplate.coverImage}
                  alt={matchedTemplate.title[currentLang]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-[#F4EFE7] tracking-wider">
                    {isRtl ? 'افتح التجربة الكاملة ←' : 'Open Experience →'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
