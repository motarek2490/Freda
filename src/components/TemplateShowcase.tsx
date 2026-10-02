import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ArrowUpRight,
  Eye,
  Sliders,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Template, Category, ThemeStyle, Language } from '../types';
import { TEMPLATES, getMergedTemplates } from '../data/templates';
import { TemplateCard } from './TemplateCard';
import { useTranslation } from '../data/translations';
import { colors, typography } from '../styles/designTokens';

interface TemplateShowcaseProps {
  currentLang: Language;
  allTemplates?: Template[];
  onSelectPreview: (template: Template) => void;
  onStartCustomize: (template: Template) => void;
}

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({
  currentLang,
  allTemplates,
  onSelectPreview,
  onStartCustomize,
}) => {
  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';

  const templatesList = useMemo(() => allTemplates || getMergedTemplates(), [allTemplates]);

  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);

  // 5 Curated Spotlight Pieces
  const spotlightPieces = [
    {
      id: 'arabic-luxury-living',
      templateId: 'tmpl-arabic-luxury-001',
      titleDisplay: 'ROMANTIC CANVAS',
      taglineAr: '«لوحة الحب الحية» — قالب التجربة الحية الديمو الأرقى مع رسم القلب المتوهج.',
      taglineEn: 'Living Romantic Canvas — Flagship Live Demo Suite with Glowing Heart Canvas.',
      categoryAr: 'أعراس وقصور ملكية فاخرة',
      categoryEn: 'Royal Palace & Luxury Gala',
      descAr: 'القالب الديمو الرئيسي للتجربة الحية: رسم القلب الذهبي المتوهج بتقنية Canvas المتطورة، تساقط ذرات البريق، وشاشة افتتاح ملكية كاملة.',
      descEn: 'The flagship live demo template: animated golden heart canvas, floating gold dust, and royal opening experience.',
    },
    {
      id: 'royal-hero',
      templateId: 'f1e729be-a6d6-43ad-8e63-f1c8d62157a6',
      titleDisplay: 'ROYAL',
      taglineAr: 'فخامة ملكية لبداية فصل العمر الأبدي.',
      taglineEn: 'Regal proclamation for an unforgettable evening.',
      categoryAr: 'أعراس وقصور ملكية',
      categoryEn: 'Royal Palace & Gala',
      descAr: 'التصميم الأكثر طلباً وفخامة بأسلوب القصور مع إطار ذهبي مزخرف وختم شمعي ثلاثي الأبعاد.',
      descEn: 'Signature royal aesthetic with ornate golden filigree, wax seal, and interactive audio.',
    },
    {
      id: 'elegant-engagement',
      templateId: 'bc70c686-eb91-4f6d-a33e-39be9b927ee1',
      titleDisplay: 'ELEGANT',
      taglineAr: 'خطوبة راقية بتفاصيل لا تُنسى.',
      taglineEn: 'Sophisticated engagement with timeless charm.',
      categoryAr: 'خطوبة وملكة راقية',
      categoryEn: 'High-End Engagement',
      descAr: 'تصميم خطوبة أنيق وناعم بألوان راقية وتفاصيل فخمة تليق بلحظات الفرح الاستثنائية.',
      descEn: 'Refined engagement suite with soft luxury tones, typography, and live RSVP.',
    },
    {
      id: 'minimal-noir',
      templateId: '70f410be-da60-44d3-9637-52fe53ec96ea',
      titleDisplay: 'MINIMAL',
      taglineAr: 'البساطة هي قمة الفخامة والجمال.',
      taglineEn: 'Simplicity is the ultimate sophistication.',
      categoryAr: 'زفاف كلاسيكي عصري',
      categoryEn: 'Modern Minimalist',
      descAr: 'أناقة الخطوط النقية والمساحات الهادئة مع لمسات لونية عميقة لعشاق الذوق الرفيع.',
      descEn: 'Clean proportions, stark typography, and deep rich contrast for tasteful ceremonies.',
    },
    {
      id: 'sahara-nights',
      templateId: 'e84feb17-f6d8-491c-a762-5a63892f4587',
      titleDisplay: 'SAHARA',
      taglineAr: 'دفء ليالي الصحراء تحت ضوء النجوم.',
      taglineEn: 'Warm desert twilight beneath the starlight.',
      categoryAr: 'حفلات بوهو وطبيعية',
      categoryEn: 'Boho & Desert Sunset',
      descAr: 'سحر النغمات الترابية والذهبية مع لمسات بوهيمية دافئة تخلد ذكرى لقائكم في ليلة بديعة.',
      descEn: 'Terracotta gradients, ambient strings, and open-air bohemian romantic spirit.',
    },
  ];

  const categoriesList: { id: Category; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'كل التصاميم', labelEn: 'All Suites' },
    { id: 'weddings', labelAr: 'الأعراس والزفاف', labelEn: 'Weddings' },
    { id: 'engagements', labelAr: 'الخطوبة والملكة', labelEn: 'Engagements' },
    { id: 'birthdays', labelAr: 'أعياد الميلاد', labelEn: 'Birthdays' },
    { id: 'baby_showers', labelAr: 'استقبال المواليد', labelEn: 'Baby Showers' },
    { id: 'royal', labelAr: 'ملكي فاخر', labelEn: 'Royal' },
    { id: 'floral', labelAr: 'زهور وباستيل', labelEn: 'Floral' },
    { id: 'minimal', labelAr: 'مينيمال كلاسيكي', labelEn: 'Minimal' },
    { id: 'boho', labelAr: 'بوهو وصحراوي', labelEn: 'Boho' },
  ];

  // Filter all templates
  const filteredTemplates = useMemo(() => {
    let list = [...templatesList];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => {
        const titleMatch = (t.title?.[currentLang] || t.title?.ar || t.title?.en || '').toLowerCase().includes(q);
        const descMatch = (t.description?.[currentLang] || t.description?.ar || t.description?.en || '').toLowerCase().includes(q);
        return titleMatch || descMatch;
      });
    }

    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    return list;
  }, [templatesList, searchQuery, selectedCategory, currentLang]);

  return (
    <section
      id="atelier"
      aria-label={isRtl ? 'أتيليه فريدا' : 'The FRIDA Atelier'}
      className="py-24 sm:py-32 bg-[#080808] text-[#F4EFE7] relative border-t border-[#C9A86A]/15 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.3em] uppercase text-[#C9A86A]">
            <span>HAUTE COUTURE SUITES</span>
            <span aria-hidden="true">·</span>
            <span>{templatesList.length} {isRtl ? 'تصميماً ملكياً' : 'PIECES'}</span>
          </div>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-4xl sm:text-6xl font-bold tracking-tight text-[#F4EFE7] leading-tight"
          >
            {isRtl ? (
              <>
                أتيليه <span className="italic gold-shimmer-text">FRIDA</span>
              </>
            ) : (
              <>
                THE FRIDA <span className="italic gold-shimmer-text">ATELIER</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-2xl mx-auto">
            {isRtl
              ? 'مجموعة تحريرية كوتور؛ صُمم كل قالب كتحفة فنية قائمة بذاتها مع خطوط عربية موزونة، ومؤثرات صوتية، ومعاينة حية فورية.'
              : 'An editorial couture collection; each piece is crafted with classical typography, fluid motion, and responsive live previews.'}
          </p>
        </div>

        {/* 1. SPOTLIGHT CURATED EDITORIAL PIECES (Sections 10 & 11) */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-[#C9A86A]/20 pb-3">
            <span className="text-xs font-mono tracking-widest text-[#C9A86A] uppercase">
              {isRtl ? 'مختارات الموسم الكبرى' : 'SIGNATURE SPOTLIGHT PIECES'}
            </span>
            <span className="text-xs text-[#D9C8A5]/60 font-light">
              {isRtl ? 'تصاميم بأغلفة تحريرية خاصة' : 'Editorial Magazine Covers'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {spotlightPieces.map((item) => {
              const matchedTemplate =
                TEMPLATES.find((t) => t.id === item.templateId) || TEMPLATES[0];

              return (
                <article
                  key={item.id}
                  className="bg-[#111111] rounded-3xl border border-[#C9A86A]/20 hover:border-[#C9A86A]/70 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl group hover:-translate-y-1"
                >
                  {/* Large Visual Cover Preview */}
                  <div
                    onClick={() => onSelectPreview(matchedTemplate)}
                    data-cursor="EXPLORE"
                    className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-[#181818]"
                  >
                    <img
                      src={matchedTemplate.coverImage}
                      alt={item.titleDisplay}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                      <span className="text-xl font-mono font-bold tracking-widest text-[#F4EFE7]">
                        {item.titleDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Editorial Text Content */}
                  <div className="p-6 space-y-4 flex flex-col justify-between flex-grow">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono tracking-wider text-[#C9A86A] uppercase block">
                        {isRtl ? item.categoryAr : item.categoryEn}
                      </span>

                      <h3
                        style={{
                          fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                        }}
                        className="text-lg sm:text-xl font-bold text-[#F4EFE7] leading-snug group-hover:text-[#C9A86A] transition-colors"
                      >
                        {isRtl ? item.taglineAr : item.taglineEn}
                      </h3>

                      <p className="text-xs text-[#D9C8A5]/80 font-light leading-relaxed">
                        {isRtl ? item.descAr : item.descEn}
                      </p>
                    </div>

                    {/* Dual Action Triggers */}
                    <div className="pt-4 border-t border-[#C9A86A]/15 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectPreview(matchedTemplate)}
                        data-cursor="OPEN"
                        className="text-xs font-semibold text-[#D9C8A5] hover:text-[#F4EFE7] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
                        <span>{isRtl ? 'المعاينة' : 'Preview'}</span>
                      </button>

                      <button
                        onClick={() => onStartCustomize(matchedTemplate)}
                        data-cursor="CREATE"
                        className="px-3.5 py-1.5 rounded-full bg-[#C9A86A] text-[#080808] font-bold text-xs hover:bg-[#E6D7B8] transition-colors flex items-center gap-1 cursor-pointer shadow-md"
                      >
                        <span>{isRtl ? 'خصّص' : 'Customize'}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* 2. THE COMPLETE ATELIER BROWSER (41 TEMPLATES) */}
        <div className="space-y-8 pt-8">
          
          {/* Category Filter Bar + Search (Zero Pills) */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-[#C9A86A]/20">
            
            {/* Minimalist Categories List */}
            <nav className="flex flex-wrap items-center gap-2 sm:gap-3">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setVisibleCount(12);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C9A86A] text-[#080808] font-bold shadow-md'
                        : 'text-[#D9C8A5]/80 hover:text-[#F4EFE7] hover:bg-[#161616]'
                    }`}
                  >
                    {isRtl ? cat.labelAr : cat.labelEn}
                  </button>
                );
              })}
            </nav>

            {/* Quick Filter Search */}
            <div className="relative w-full lg:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(12);
                }}
                placeholder={isRtl ? 'ابحث في الـ ٤١ قالباً...' : 'Search 41 suites...'}
                className="w-full bg-[#111111] border border-[#C9A86A]/30 rounded-full px-4 py-2 pl-9 text-xs text-[#F4EFE7] placeholder-[#8D8A84] focus:outline-none focus:border-[#C9A86A] transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-[#C9A86A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.slice(0, visibleCount).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                currentLang={currentLang}
                onSelectPreview={onSelectPreview}
                onStartCustomize={onStartCustomize}
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredTemplates.length && (
            <div className="text-center pt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="px-8 py-3 rounded-full border border-[#C9A86A]/40 text-[#D9C8A5] hover:text-[#080808] hover:bg-[#C9A86A] transition-all text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                {isRtl
                  ? `عرض المزيد من الأتيليه (${filteredTemplates.length - visibleCount} تصاميم باقية)`
                  : `Load More Suites (${filteredTemplates.length - visibleCount} remaining)`}
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
