import React from 'react';
import {
  Mail,
  Music,
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Share2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { Language } from '../types';
import { colors, typography } from '../styles/designTokens';

interface ExperienceFeaturesSectionProps {
  currentLang: Language;
  onExploreAtelier?: () => void;
  onStartCreate?: () => void;
}

export const ExperienceFeaturesSection: React.FC<ExperienceFeaturesSectionProps> = ({
  currentLang,
  onExploreAtelier,
  onStartCreate,
}) => {
  const isRtl = currentLang === 'ar';

  // 100% Real Features verified directly in FRIDA's codebase
  const realFeatures = [
    {
      id: 'envelope',
      icon: Mail,
      titleAr: 'فتح الظرف وختم الشمع الملكي',
      titleEn: 'Royal Envelope & Wax Seal Unveil',
      descAr:
        'تجربة فتح تفاعلية ثلاثية الأبعاد؛ يلمس الضيف ختم الشمع لينكسر وينفتح الظرف كاشفاً بطاقة الدعوة مع تأثيرات إضاءة سينمائية.',
      descEn:
        'A 3D interactive opening ritual; the guest taps the royal wax seal to release the envelope and slide out the invitation card.',
      badgeAr: 'تفاعل حركي ثلاثي الأبعاد',
      badgeEn: '3D Interactive Ritual',
    },
    {
      id: 'audio',
      icon: Music,
      titleAr: 'الموسيقى وقص الصوت الحي',
      titleEn: 'Ambient Score & Audio Trimmer',
      descAr:
        'موسيقى تصويرية ترافق فتح الدعوة، مع أداة مدمجة لقص وتحويل مقطعكم الصوتي المفضل محلياً بصيغة MP3 وتشغيله في الخلفية.',
      descEn:
        'Ambient musical scores playing during the reveal, complete with an in-browser audio trimmer to edit your custom MP3 track.',
      badgeAr: 'مكتبة سحابية ومحرر صوت',
      badgeEn: 'Cloud Music & Local Trimmer',
    },
    {
      id: 'rsvp',
      icon: CheckCircle,
      titleAr: 'تأكيد الحضور الذكي (RSVP)',
      titleEn: 'Smart RSVP Guest Manager',
      descAr:
        'نموذج رقمي لتأكيد أو اعتذار الضيوف وتحديد عدد المرافقين، مع بوابة خاصة لصاحب المناسبة لمتابعة الإحصائيات لحظياً.',
      descEn:
        'A frictionless digital RSVP flow for guest confirmations and plus-ones, synchronized live to the host management portal.',
      badgeAr: 'مزامنة سحابية لحظية',
      badgeEn: 'Live Realtime Sync',
    },
    {
      id: 'timeline',
      icon: Calendar,
      titleAr: 'تفاصيل المناسبة والجدول الزمني',
      titleEn: 'Event Itinerary & Timeline',
      descAr:
        'عرض منظم لفقرات الحفل (استقبال، زفة، عشاء، كعكة الزفاف) بمواعيدها المحددة ليتابع الضيوف برنامج يومكم لحظة بلحظة.',
      descEn:
        'An organized schedule of wedding milestones (reception, entrance, dinner, cake) keeping guests in perfect harmony.',
      badgeAr: 'برنامج تفصيلي للحفل',
      badgeEn: 'Curated Schedule',
    },
    {
      id: 'maps',
      icon: MapPin,
      titleAr: 'الخرائط التفاعلية والتقويم',
      titleEn: 'Google Maps & Calendar Sync',
      descAr:
        'زر ملاحة مباشر يفتح قاعة الحفل فوراً في Google Maps، مع إمكانية حفظ التاريخ وتنبيهات المناسبة في تقويم الهاتف بنقرة واحدة.',
      descEn:
        'One-tap Google Maps navigation directly to the ballroom, paired with instant Google Calendar date synchronization.',
      badgeAr: 'ملاحة بنقرة واحدة',
      badgeEn: 'One-Tap Navigation',
    },
    {
      id: 'countdown',
      icon: Clock,
      titleAr: 'العد التنازلي الدقيق',
      titleEn: 'Live Precision Countdown',
      descAr:
        'ساعة رقمية حية تحسب الأيام والساعات والدقائق والثواني حتى لحظة انطلاق الحفل مع حساب دقيق للمنطقة الزمنية.',
      descEn:
        'A live precision counter tallying days, hours, minutes, and seconds until the celebration commences.',
      badgeAr: 'توقيت حي للمناسبة',
      badgeEn: 'Live Clock',
    },
    {
      id: 'sharing',
      icon: Share2,
      titleAr: 'المشاركة عبر واتساب ورمز QR',
      titleEn: 'Instant WhatsApp Share & QR',
      descAr:
        'توليد روابط سريعة مع رسائل مخصصة وراقية لإرسالها للضيوف عبر واتساب، ورمز استجابة سريعة (QR) لمسحه والدخول فوراً.',
      descEn:
        'Pre-formatted WhatsApp invitations with custom links, complemented by high-resolution QR codes for physical cards or check-in.',
      badgeAr: 'مشاركة فورية وبطاقة QR',
      badgeEn: 'Instant QR & WhatsApp',
    },
  ];

  return (
    <section
      id="experience"
      aria-label={isRtl ? 'تجربة فريدا' : 'FRIDA Experience'}
      className="py-24 sm:py-32 bg-[#080808] text-[#F4EFE7] relative overflow-hidden border-t border-[#C9A86A]/15"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[500px] bg-[#C9A86A]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.3em] uppercase text-[#C9A86A]">
            <span>THE LIVING SUITE</span>
            <span aria-hidden="true">·</span>
            <span>7 REAL CAPABILITIES</span>
          </div>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFE7] leading-tight"
          >
            {isRtl ? (
              <>
                ليست مجرد بطاقة. <span className="gold-shimmer-text italic">إنها تجربة.</span>
              </>
            ) : (
              <>
                Not Just a Card. <span className="gold-shimmer-text italic">An Experience.</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-2xl mx-auto">
            {isRtl
              ? 'كل دعوة في فريدا مُجهزة بمجموعة متكاملة من الأدوات التفاعلية الحقيقية المصممة لإبهار ضيوفكم وتسهيل إدارة حضورهم.'
              : 'Every invitation in FRIDA is engineered with a real suite of interactive capabilities crafted to captivate your guests and streamline host coordination.'}
          </p>
        </div>

        {/* Feature Grid (Semantic HTML <article>) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {realFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            const isHeroCard = idx === 0;

            return (
              <article
                key={feat.id}
                className={`group bg-[#111111] rounded-3xl border border-[#C9A86A]/20 hover:border-[#C9A86A]/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl ${
                  isHeroCard ? 'md:col-span-2 lg:col-span-2 bg-gradient-to-br from-[#161616] via-[#111111] to-[#0D0D0D] border-[#C9A86A]/35' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A] group-hover:scale-105 transition-transform duration-300 shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#C9A86A]">
                      {isRtl ? feat.badgeAr : feat.badgeEn}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                    }}
                    className={`font-bold text-[#F4EFE7] group-hover:text-[#C9A86A] transition-colors ${
                      isHeroCard ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                    }`}
                  >
                    {isRtl ? feat.titleAr : feat.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#D9C8A5]/80 font-light leading-relaxed">
                    {isRtl ? feat.descAr : feat.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#C9A86A]/10 flex items-center justify-between text-[11px] text-[#C9A86A]">
                  <span className="font-mono text-[#D9C8A5]/60">FEATURE 0{idx + 1}</span>
                  <span className="font-semibold flex items-center gap-1">
                    {isRtl ? 'مُفعّل بالكامل' : 'Production Ready'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Call to Action strip */}
        <div className="text-center pt-6">
          {onStartCreate && (
            <button
              onClick={onStartCreate}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(201,168,106,0.5)] transition-all cursor-pointer shadow-xl"
            >
              <span>{isRtl ? 'اصنع دعوتك مع هذه المزايا الآن' : 'Create Invitation With These Features'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
