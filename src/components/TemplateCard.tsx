import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  Edit3,
  Sparkles,
  Crown,
  Image as ImageIcon,
  Layout,
  Layers,
} from 'lucide-react';
import { Template, Language } from '../types';
import { useTranslation } from '../data/translations';
import { colors, typography } from '../styles/designTokens';
import { renderDynamicLayout, LayoutLoadingFallback } from './InvitationLayouts/lazyLayouts';

interface TemplateCardProps {
  template: Template;
  currentLang: Language;
  onSelectPreview: (template: Template) => void;
  onStartCustomize: (template: Template) => void;
  activeMood?: 'royal' | 'editorial' | 'romantic' | 'all';
  index?: number;
  isWideFeatured?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  currentLang,
  onSelectPreview,
  onStartCustomize,
  activeMood = 'all',
  index = 0,
  isWideFeatured = false,
}) => {
  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';
  const [showRealCard, setShowRealCard] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver: Only render active layout animations when card is in or near viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.08, rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const data = template.defaultData;
  const groomName = data?.groomName || (isRtl ? 'عمر' : 'Omar');
  const brideName = data?.brideName || (isRtl ? 'ياسمين' : 'Yasmine');
  const venue = data?.venueName || (isRtl ? 'قصر الفخامة الملكي' : 'Royal Grand Ballroom');
  const date = data?.eventDate || '2026-11-20';

  // Live Layout Render Helper with full props
  const renderLiveLayout = () => {
    if (!isVisible) return null;

    const fullInvitation = {
      id: template.id,
      templateId: template.id,
      title: template.title[currentLang] || template.title['ar'] || 'دعوة فريدا',
      category: template.category,
      themeStyle: template.themeStyle,
      supportedLanguages: template.supportedLanguages,
      coverImageUrl: template.coverImage,
      layoutType: template.layoutType || 'royal',
      language: currentLang,
      customFont: template.defaultFont || 'font-playfair',
      slug: template.id,
      customColors: template.defaultColors,
      eventDetails: template.defaultData,
      status: 'published' as const,
      createdAt: new Date().toISOString(),
    };

    const dummyProps = {
      invitation: fullInvitation,
      lang: currentLang,
      isRtl,
      t,
      customColors: template.defaultColors,
      timeLeft: { days: 14, hours: 6, minutes: 30, seconds: 15 },
      wishes: [],
      onOpenRsvp: () => {},
      onOpenBank: () => {},
      onAddWish: (e: React.FormEvent) => e.preventDefault(),
      newWishAuthor: '',
      setNewWishAuthor: () => {},
      newWishRelation: '',
      setNewWishRelation: () => {},
      newWishMessage: '',
      setNewWishMessage: () => {},
      wishSuccess: false,
      setActiveLightboxImg: () => {},
      getGoogleCalendarUrl: () => '#',
    };

    const layout = template.layoutType || 'royal';

    return (
      <React.Suspense fallback={<LayoutLoadingFallback />}>
        {renderDynamicLayout(layout, dummyProps)}
      </React.Suspense>
    );
  };

  // Extract one short evocative emotional description sentence
  const rawDesc = template.description[currentLang] || template.description['ar'] || '';
  const shortEmotionalSentence = rawDesc.includes('.') ? rawDesc.split('.')[0].trim() + '.' : rawDesc;

  // Visual mood styling enhancements
  const moodBorderClass =
    activeMood === 'royal'
      ? 'border-[#C9A86A]/40 hover:border-[#C9A86A] shadow-[0_15px_40px_rgba(201,168,106,0.12)]'
      : activeMood === 'editorial'
      ? 'border-[#D9C8A5]/30 hover:border-[#F4EFE7]/80 shadow-[0_15px_40px_rgba(255,255,255,0.05)]'
      : activeMood === 'romantic'
      ? 'border-[#D9C8A5]/40 hover:border-[#E8B4B8] shadow-[0_15px_40px_rgba(232,180,184,0.15)]'
      : 'border-[#C9A86A]/20 hover:border-[#C9A86A]/70 shadow-[0_15px_40px_rgba(0,0,0,0.6)]';

  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <article
      ref={cardRef}
      className={`group relative bg-[#111111] rounded-2xl sm:rounded-3xl border ${moodBorderClass} overflow-hidden transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between ${
        isWideFeatured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
      style={{ willChange: 'transform, border-color' }}
    >
      {/* 1. Atelier Piece Header Ribbon (Edition Number & Category Tag) */}
      <div className="relative z-20 px-5 pt-4 pb-2 flex items-center justify-between border-b border-[#C9A86A]/10 bg-[#161616]/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-[#C9A86A] font-bold tracking-widest uppercase">
            № {formattedIndex}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#C9A86A]/50" />
          <span className="text-[11px] font-semibold text-[#D9C8A5] tracking-wide">
            {t.categories[template.category]}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {template.isNew && (
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#C9A86A] text-[#080808] shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              {isRtl ? 'إصدار جديد' : 'New Edition'}
            </span>
          )}

          {/* Toggle Live Render / Image View */}
          <button
            type="button"
            onClick={() => setShowRealCard(!showRealCard)}
            className="p-1 rounded-full bg-[#080808]/80 text-[#C9A86A] border border-[#C9A86A]/30 hover:bg-[#C9A86A] hover:text-[#080808] transition-colors cursor-pointer"
            title={showRealCard ? (isRtl ? 'عرض الصورة الفوتوغرافية' : 'Show Photo') : (isRtl ? 'عرض المحاكاة التفاعلية' : 'Show Interactive Render')}
          >
            {showRealCard ? <ImageIcon className="w-3 h-3" /> : <Layout className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 2. Visual Exhibition Frame (Large Preview) */}
      <div className={`relative overflow-hidden bg-[#0A0A0A] ${isWideFeatured ? 'h-80 sm:h-96 md:h-[440px]' : 'h-72 sm:h-80 md:h-[370px]'}`}>
        {showRealCard ? (
          <div className="relative w-full h-full overflow-hidden bg-[#0D0D0D]">
            {isVisible ? (
              <div className="absolute inset-0 w-[240%] h-[240%] origin-top-left scale-[0.41] pointer-events-none select-none z-0">
                {renderLiveLayout()}
              </div>
            ) : (
              <div className="w-full h-full p-6 flex flex-col justify-center items-center text-center space-y-2 bg-[#121212]">
                <Crown className="w-6 h-6 text-[#C9A86A]/60" />
                <p className="font-playfair text-sm text-[#F4EFE7] font-semibold">{groomName} & {brideName}</p>
                <p className="text-xs text-[#D9C8A5]/70">{venue}</p>
              </div>
            )}

            {/* Subtle Royal Watermark Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#080808]/80 backdrop-blur-md rounded-full border border-[#C9A86A]/20 text-[9px] font-mono text-[#D9C8A5] pointer-events-none z-10">
              <Crown className="w-3 h-3 text-[#C9A86A]" />
              <span>{isRtl ? 'معاينة سينمائية حية' : 'Cinematic Live Preview'}</span>
            </div>
          </div>
        ) : (
          <img
            src={template.coverImage}
            alt={template.title[currentLang]}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* Ambient Bottom Gradient for contrast */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent pointer-events-none z-10" />
      </div>

      {/* 3. Editorial Metadata & Actions Body */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-grow space-y-4 bg-[#111111]">
        <div className="space-y-2">
          <h3
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-xl sm:text-2xl font-bold text-[#F4EFE7] group-hover:text-[#C9A86A] transition-colors leading-snug"
          >
            {template.title[currentLang]}
          </h3>

          {/* Emotional One-Sentence Description */}
          <p className="text-xs sm:text-sm text-[#D9C8A5]/90 font-light leading-relaxed line-clamp-2">
            {shortEmotionalSentence}
          </p>
        </div>

        {/* 4. The Two Action Buttons: "افتح التجربة" & "خصّص" */}
        <div className="pt-2 grid grid-cols-2 gap-2.5 border-t border-[#C9A86A]/15">
          <button
            type="button"
            onClick={() => onSelectPreview(template)}
            className="w-full py-2.5 px-3 rounded-xl border border-[#C9A86A]/40 bg-[#161616] hover:bg-[#C9A86A]/15 text-[#F4EFE7] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Eye className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{isRtl ? 'افتح التجربة' : 'Open Experience'}</span>
          </button>

          <button
            type="button"
            onClick={() => onStartCustomize(template)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] text-[#080808] text-xs font-bold flex items-center justify-center gap-1.5 hover:shadow-[0_0_20px_rgba(201,168,106,0.4)] transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isRtl ? 'خصّص' : 'Customize'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
