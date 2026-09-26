import React from 'react';
import { Sparkles, Heart, Gift, Award, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Language, Template } from '../types';
import { TEMPLATES } from '../data/templates';
import { BRAND_NAME, BRAND_NAME_AR } from '../config/brand';

export type OccasionType = 'weddings' | 'engagements' | 'birthdays' | 'graduation';

interface OccasionLandingProps {
  occasion: OccasionType;
  currentLang: Language;
  onSelectTemplate: (template: Template) => void;
  onGoHome: () => void;
}

const OCCASION_CONFIG: Record<
  OccasionType,
  {
    titleAr: string;
    titleEn: string;
    metaDescAr: string;
    metaDescEn: string;
    categoryMatch: string;
    icon: typeof Heart;
    featuresAr: string[];
    featuresEn: string[];
  }
> = {
  weddings: {
    titleAr: 'دعوات زفاف رقمية ملكية فخمة',
    titleEn: 'Royal Luxury Digital Wedding Invitations',
    metaDescAr: 'صمم أفخم بطاقات دعوة زفاف إلكترونية تفاعلية مع موسيقى ملكية، وفك ختم الظرف، وتأكيد الحضور (RSVP) بدقة وأناقة.',
    metaDescEn: 'Craft bespoke digital wedding invitations with royal envelopes, ambient music, and effortless guest RSVP tracking.',
    categoryMatch: 'weddings',
    icon: Heart,
    featuresAr: [
      'فك ختم الظرف الملكي التفاعلي',
      'تخصيص أسماء كبار الشخصيات (VIP)',
      'تأكيد الحضور وكشف معازيم إكسل جاهز للقاعة',
      'صندوق تبريكات حي وصور الحفل',
    ],
    featuresEn: [
      'Interactive royal wax envelope reveal',
      'VIP guest personalized links',
      'Instant RSVP guest list with hall-ready Excel export',
      'Live guestbook wishes & high-res photo gallery',
    ],
  },
  engagements: {
    titleAr: 'بطاقات دعوة خطوبة وعقد قران راقية',
    titleEn: 'Elegant Engagement & Katb Ketab Invitations',
    metaDescAr: 'شارك فرحة خطوبتك بتصاميم عصرية رومانسية وألوان زهرية هادئة مع خرائط Google وتأكيد الحضور الفوري.',
    metaDescEn: 'Celebrate your engagement with romantic, editorial designs, interactive Google Maps directions, and real-time RSVPs.',
    categoryMatch: 'engagements',
    icon: Sparkles,
    featuresAr: [
      'تصاميم زهرية وبوهيمية فاخرة',
      'رابط موقع الحفل عبر خرائط Google بدقة',
      'عد تنازلي ليوم الحفل بالساعات والثواني',
      'مشاركة فورية وسهلة بنقرة واحدة عبر واتساب',
    ],
    featuresEn: [
      'Floral, botanical, and boho luxury palettes',
      'Exact venue GPS via Google Maps',
      'Live countdown clock down to seconds',
      'One-click WhatsApp sharing with rich preview cards',
    ],
  },
  birthdays: {
    titleAr: 'دعوات أعياد ميلاد وحفلات خاصة مبهجة',
    titleEn: 'Joyful Birthday & Private Party Invitations',
    metaDescAr: 'دعوات أعياد ميلاد مميزة للأطفال والشباب مع خلفيات تفاعلية، وموسيقى مبهجة، وتأكيد الحضور بالهاتف.',
    metaDescEn: 'Vibrant digital birthday invitations with cheerful animations, custom playlists, and quick guest confirmations.',
    categoryMatch: 'birthdays',
    icon: Gift,
    featuresAr: [
      'تصاميم مبهجة وجريئة تناسب جميع الأعمار',
      'تسجيل الحضور مع عدد المرافقين بدقة',
      'قائمة هدايا وبطاقة ترحيب مخصصة',
      'موسيقى احتفالية خاصة بالحفل',
    ],
    featuresEn: [
      'Playful, vibrant designs for every milestone',
      'Accurate RSVP headcounts including plus-ones',
      'Gift registry wishlist & personalized welcome note',
      'Custom celebratory party playlist',
    ],
  },
  graduation: {
    titleAr: 'دعوات حفلات تخرج ونجاح استثنائية',
    titleEn: 'Prestige Graduation & Milestone Celebrations',
    metaDescAr: 'احتفل بثمرة جهدك وشارك فرحة تخرجك بدعوات ملكية أنيقة تليق بإنجازك الأكاديمي الكبير.',
    metaDescEn: 'Honor academic excellence with distinguished digital invitations crafted for your landmark achievement.',
    categoryMatch: 'corporate',
    icon: Award,
    featuresAr: [
      'ألوان ملكية رسمية مستوحاة من أروقة الجامعات',
      'تسجيل حضور الأصدقاء والأساتذة الكرام',
      'دفتر تهاني مفتوح لكلمات التبريكات والنجاح',
      'رابط دائم قابل للمشاركة والاحتفاظ به كذكرى',
    ],
    featuresEn: [
      'Prestigious academic aesthetics & royal colors',
      'Formal guest confirmations for faculty & family',
      'Open digital guestbook for congratulatory messages',
      'Permanent digital keepsake to cherish forever',
    ],
  },
};

export const OccasionLanding: React.FC<OccasionLandingProps> = ({
  occasion,
  currentLang,
  onSelectTemplate,
  onGoHome,
}) => {
  const isRtl = currentLang === 'ar';
  const config = OCCASION_CONFIG[occasion] || OCCASION_CONFIG.weddings;
  const Icon = config.icon;

  const matchingTemplates = TEMPLATES.filter(
    (t) => t.category === config.categoryMatch || t.id.includes(occasion)
  );

  const displayTemplates = matchingTemplates.length > 0 ? matchingTemplates : TEMPLATES.slice(0, 6);

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#171717] text-[#F7F4EE] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 text-xs text-[#8D8A84] hover:text-[#B99A65] transition-colors cursor-pointer"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isRtl ? `العودة للرئيسية (${BRAND_NAME_AR})` : `Back to Home (${BRAND_NAME})`}</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1F1E1B] border border-[#B99A65]/40 text-[#B99A65] text-xs font-semibold uppercase shadow-lg">
            <Icon className="w-4 h-4 text-[#B99A65]" />
            <span>{isRtl ? 'صفحة مناسبة خاصة' : 'Curated Occasion'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F7F4EE]">
            {isRtl ? config.titleAr : config.titleEn}
          </h1>

          <p className="text-sm sm:text-base text-[#8D8A84] leading-relaxed">
            {isRtl ? config.metaDescAr : config.metaDescEn}
          </p>

          {/* Features Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left sm:text-right">
            {(isRtl ? config.featuresAr : config.featuresEn).map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1F1E1B]/60 border border-[#333] text-xs text-[#E9E1D5]"
              >
                <div className="w-5 h-5 rounded-full bg-[#B99A65]/20 text-[#B99A65] flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Catalog Grid for this occasion */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#333] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F7F4EE]">
              {isRtl ? 'التصاميم المقترحة لهذه المناسبة' : 'Featured Designs for this Occasion'}
            </h2>
            <span className="text-xs text-[#8D8A84]">
              {displayTemplates.length} {isRtl ? 'تصميم متاح' : 'designs available'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group relative rounded-3xl bg-[#1F1E1B] border border-[#333] hover:border-[#B99A65] overflow-hidden transition-all duration-300 flex flex-col cursor-pointer shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-[#171717]">
                  <img
                    src={template.coverImage}
                    alt={template.title[currentLang]}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-[#B99A65] border border-[#B99A65]/30">
                      {template.themeStyle}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-[#F7F4EE] group-hover:text-[#B99A65] transition-colors">
                      {template.title[currentLang]}
                    </h3>
                    <p className="text-xs text-[#8D8A84] mt-1 line-clamp-2">
                      {template.description[currentLang]}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#171717] border border-[#333] group-hover:border-[#B99A65] text-xs font-semibold text-[#E9E1D5] group-hover:text-[#171717] group-hover:bg-[#B99A65] transition-all flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'معاينة وتخصيص الدعوة' : 'Preview & Customize'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
