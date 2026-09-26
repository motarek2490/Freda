import React, { useState } from 'react';
import {
  MessageSquare,
  Link2,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Copy,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { Language } from '../types';
import { colors, typography } from '../styles/designTokens';

interface InvitationDistributionSectionProps {
  currentLang: Language;
  onStartCreate: () => void;
}

export const InvitationDistributionSection: React.FC<InvitationDistributionSectionProps> = ({
  currentLang,
  onStartCreate,
}) => {
  const isRtl = currentLang === 'ar';
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'link' | 'qr'>('whatsapp');
  const [copied, setCopied] = useState(false);

  const sampleUrl = 'https://frida.vip/i/omar-yasmine';
  const sampleMessage = isRtl
    ? `✨ بتشرف عائلة (المهندس عمر وياسمين) بدعوتك لمشاركتنا فرحتنا الكبرى.\n📅 الجمعة ٢٠ نوفمبر - ٨ مساءً\n📍 قصر البارون - مصر الجديدة\n💌 افتح ظرف الدعوة الملكي وسجّل حضورك:\n${sampleUrl}`
    : `✨ You are cordially invited to celebrate the wedding of Omar & Yasmine.\n📅 Friday, Nov 20 - 8:00 PM\n📍 Baron Palace, Cairo\n💌 Unveil your invitation & RSVP:\n${sampleUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methods = [
    {
      id: 'whatsapp' as const,
      icon: MessageSquare,
      titleAr: 'واتساب مباشر',
      titleEn: 'Direct WhatsApp',
      taglineAr: 'رسالة راقية بنقرة واحدة',
      taglineEn: 'Polished invite in one tap',
      descAr:
        'رسالة مهندمة مسبقاً باسم ضيفك وميعاد الحفل ورابط فتح الظرف. بتدوس زرار، يفتح الواتساب وتبعته فوراً من غير ما تقعد تصيغ نص بنفسك.',
      descEn:
        'Pre-composed text with your guest’s name, date, venue, and private reveal link ready to send directly on WhatsApp.',
      badgeAr: 'الأسرع وصولاً في مصر',
      badgeEn: 'Instant Reach',
    },
    {
      id: 'link' as const,
      icon: Link2,
      titleAr: 'رابط مباشر وخاص',
      titleEn: 'Private Direct Link',
      taglineAr: 'رابط خفيف يفتح على أي جهاز',
      taglineEn: 'Fast & responsive link',
      descAr:
        'رابط محمي ومخصص لمناسبتك، بيفتح في أقل من ثانية على أي موبايل أو كمبيوتر بدون ما الضيف يحتاج ينزل أي تطبيق أو يسجل حساب.',
      descEn:
        'A secure, lightweight URL tailored to your celebration that loads in under a second with zero app installations.',
      badgeAr: 'بدون تطبيقات',
      badgeEn: 'Zero Installs',
    },
    {
      id: 'qr' as const,
      icon: QrCode,
      titleAr: 'رمز QR عالي الدقة',
      titleEn: 'High-Res QR Code',
      taglineAr: 'للطباعة ولافتة القاعة',
      taglineEn: 'For stationery & venue entry',
      descAr:
        'ملف QR عالي الدقة جاهز للتحميل والطباعة على كروت الفرح الورقية أو لافتة استقبال القاعة. الضيف بيمسحه بكاميرا موبايله يدخل على دعوته فوراً.',
      descEn:
        'High-resolution vector QR code ready for physical stationery or entrance signs, taking guests straight to your live reveal.',
      badgeAr: 'جاهز للطباعة فوراً',
      badgeEn: 'Print Ready',
    },
  ];

  return (
    <div className="bg-[#080808] text-[#F4EFE7]">
      
      {/* 1. SECTION: "كيف ستصل إليهم دعوتك؟" */}
      <section
        id="distribution"
        aria-label={isRtl ? 'كيف ستصل إليهم دعوتك؟' : 'How will your invitation reach them?'}
        className="py-24 sm:py-32 relative overflow-hidden border-t border-[#C9A86A]/15"
      >
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[500px] bg-[#C9A86A]/8 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111111] border border-[#C9A86A]/30 text-[#C9A86A] text-xs font-semibold tracking-widest uppercase shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{isRtl ? 'مشاركة بدون تعقيد' : 'EFFORTLESS REACH'}</span>
            </div>

            <h2
              style={{
                fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
              }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFE7] leading-tight"
            >
              {isRtl ? (
                <>
                  كيف ستصل إليهم <span className="gold-shimmer-text italic">دعوتك؟</span>
                </>
              ) : (
                <>
                  How Will Your Invitation <span className="gold-shimmer-text italic">Reach Them?</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-2xl mx-auto">
              {isRtl
                ? 'ثلاث طرق حقيقية ومطبقة بالكامل في المنصة، تضمن إن كل معزوم توصله دعوته في ثوانٍ وبأعلى وقار.'
                : 'Three real, fully implemented distribution channels ensuring your guests receive their invitation within seconds.'}
            </p>
          </div>

          {/* 3 Real Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {methods.map((method) => {
              const Icon = method.icon;
              const isSelected = activeTab === method.id;

              return (
                <div
                  key={method.id}
                  onClick={() => setActiveTab(method.id)}
                  className={`bg-[#111111] rounded-3xl border transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between space-y-6 cursor-pointer shadow-xl relative overflow-hidden group ${
                    isSelected
                      ? 'border-[#C9A86A] bg-gradient-to-b from-[#171717] to-[#111111] shadow-[0_15px_35px_rgba(201,168,106,0.15)] -translate-y-1'
                      : 'border-[#C9A86A]/20 hover:border-[#C9A86A]/60 hover:-translate-y-0.5'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#1C1C1C] border border-[#C9A86A]/30 flex items-center justify-center text-[#C9A86A] group-hover:scale-105 transition-transform duration-300 shadow-inner">
                        <Icon className="w-6 h-6" />
                      </div>

                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#C9A86A] bg-[#C9A86A]/10 px-2.5 py-1 rounded-full border border-[#C9A86A]/20">
                        {isRtl ? method.badgeAr : method.badgeEn}
                      </span>
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                        }}
                        className="text-xl sm:text-2xl font-bold text-[#F4EFE7] group-hover:text-[#C9A86A] transition-colors"
                      >
                        {isRtl ? method.titleAr : method.titleEn}
                      </h3>
                      <span className="text-xs text-[#C9A86A] font-medium block mt-0.5">
                        {isRtl ? method.taglineAr : method.taglineEn}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#D9C8A5]/80 font-light leading-relaxed">
                      {isRtl ? method.descAr : method.descEn}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#C9A86A]/15 flex items-center justify-between text-xs">
                    <span className="text-[#D9C8A5]/60 font-mono text-[11px]">
                      {isSelected ? (isRtl ? '✓ معروض بالأسفل' : '✓ Active Preview') : (isRtl ? 'اضغط للمعاينة' : 'Tap to preview')}
                    </span>
                    <span className="text-[#C9A86A] font-semibold flex items-center gap-1">
                      {isRtl ? 'مطبّق فعلياً' : 'Live in Platform'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Interactive Preview Box */}
          <div className="bg-[#111111] border border-[#C9A86A]/30 rounded-3xl p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#C9A86A]/15 pb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#C9A86A]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#F4EFE7]">
                  {isRtl
                    ? `معاينة حيّة: ${methods.find((m) => m.id === activeTab)?.titleAr}`
                    : `Live Preview: ${methods.find((m) => m.id === activeTab)?.titleEn}`}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#D9C8A5]/60">FRIDA SHARE SUITE</span>
            </div>

            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <p className="text-xs text-[#D9C8A5]/80">
                  {isRtl
                    ? 'كده الرسالة بتوصل لضيفك على الواتساب بنص منسّق ومحترم:'
                    : 'This is how your formatted message arrives on WhatsApp:'}
                </p>
                <div className="p-4 sm:p-5 rounded-2xl bg-[#161616] border border-emerald-500/30 text-xs sm:text-sm text-[#F4EFE7] whitespace-pre-line leading-relaxed font-sans shadow-inner">
                  {sampleMessage}
                </div>
              </div>
            )}

            {activeTab === 'link' && (
              <div className="space-y-4">
                <p className="text-xs text-[#D9C8A5]/80">
                  {isRtl
                    ? 'رابطك الخاص المباشر. انسخه بلمسة واحدة وحطه في أي شات أو ستوري:'
                    : 'Your private direct link. One tap to copy and paste anywhere:'}
                </p>
                <div className="flex items-center gap-2 bg-[#161616] border border-[#C9A86A]/30 rounded-xl p-2.5">
                  <span className="text-xs text-[#C9A86A] font-mono truncate flex-1 px-2">
                    {sampleUrl}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 rounded-lg bg-[#C9A86A] text-[#080808] text-xs font-bold hover:bg-[#E6D7B8] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'qr' && (
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
                <div className="w-32 h-32 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-lg border border-[#C9A86A]/50">
                  {/* Decorative QR code mockup */}
                  <div className="w-full h-full flex flex-col justify-between p-1 bg-neutral-900 rounded-lg">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 border-2 border-white rounded-sm" />
                      <div className="w-6 h-6 border-2 border-white rounded-sm" />
                    </div>
                    <div className="text-center font-mono text-[9px] text-[#C9A86A] font-bold">FRIDA</div>
                    <div className="flex justify-between items-end">
                      <div className="w-6 h-6 border-2 border-white rounded-sm" />
                      <div className="w-4 h-4 bg-white rounded-xs" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2 max-w-md">
                  <h4 className="font-bold text-base text-[#F4EFE7]">
                    {isRtl ? 'كود QR فكتور عالي الجودة' : 'High-Resolution Vector QR'}
                  </h4>
                  <p className="text-xs text-[#D9C8A5]/80 leading-relaxed font-light">
                    {isRtl
                      ? 'بتقدر تحمله بنقرة واحدة وتطبعه على بطاقاتك الورقية أو استاند الاستقبال. أي موبايل يوجّه الكاميرا عليه بيدخل على الدعوة فوراً.'
                      : 'Download in crisp resolution to print on physical invitations or welcome easels. Any phone camera opens the digital card instantly.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Viral Signature Loop Showcase (Prompt Section 18) */}
          <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-[#111111] rounded-3xl border border-[#C9A86A]/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1.5 text-center sm:text-start">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#C9A86A] block">
                {isRtl ? 'البصمة الفاخرة وانتشار التجربة' : 'THE LUXURY SIGNATURE LOOP'}
              </span>
              <h4 className="text-base font-bold text-[#F4EFE7]">
                {isRtl ? 'كل ضيف يعيش دعوتك.. يبدأ بالتفكير في دعوته' : 'Every Guest Who Experiences FRIDA Begins Their Own Story'}
              </h4>
              <p className="text-xs text-[#D9C8A5]/80 font-light max-w-xl">
                {isRtl
                  ? 'في أسفل كل دعوة منشورة، تظهر إمضاء هادئة: «An experience by FRIDA — اصنع دعوتك»، لتلهم ضيوفكم بصنع دعواتهم الخاصة بكل وقار.'
                  : 'At the close of each digital reveal lies an understated signature: “An experience by FRIDA — Create yours”, driving organic luxury discovery.'}
              </p>
            </div>
            <div className="px-5 py-2.5 rounded-full bg-[#171614] border border-[#C9A86A]/30 text-xs font-mono text-[#D9C8A5] shrink-0 text-center shadow-inner">
              <span>An experience by FRIDA</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SECTION: CLOSING CTA: "اجعلهم يتذكرون الدعوة قبل الحفل" */}
      <section
        id="final-cta"
        aria-label={isRtl ? 'اصنع دعوتك الآن' : 'Craft Your Invitation Now'}
        className="py-24 sm:py-32 relative overflow-hidden border-t border-[#C9A86A]/15 bg-gradient-to-b from-[#080808] via-[#111111] to-[#080808]"
      >
        {/* Golden Core Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#C9A86A]/12 blur-[170px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161616] border border-[#C9A86A]/40 text-[#C9A86A] text-xs font-semibold tracking-widest uppercase shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{isRtl ? 'البداية الملكية لمناسبتك' : 'THE ROYAL BEGINNING'}</span>
          </div>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F4EFE7] leading-tight max-w-4xl mx-auto"
          >
            {isRtl ? (
              <>
                اجعلهم يتذكرون <span className="gold-shimmer-text italic">الدعوة</span> قبل الحفل
              </>
            ) : (
              <>
                Make Them Remember The <span className="gold-shimmer-text italic">Invitation</span> Before The Event
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/90 max-w-2xl mx-auto font-light leading-relaxed">
            {isRtl
              ? 'لحظة فتح الظرف الملكي والموسيقى بتخلق أول انطباع عن فرحتك. ابدأ الآن، اختر قالبك، وخصص كل تفصيلة في دقائق.'
              : 'The moment the royal seal breaks and the score swells sets the tone for your celebration. Begin now, select your canvas, and personalize in minutes.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartCreate}
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] text-[#080808] font-bold text-sm hover:shadow-[0_0_35px_rgba(201,168,106,0.65)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer shadow-2xl"
            >
              <span>{isRtl ? 'اصنع لحظتك الآن' : 'Craft Your Moment Now'}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Reassurance Micro-tags */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#D9C8A5]/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#C9A86A]" />
              {isRtl ? 'معاينة مجانية كاملة قبل النشر' : 'Free Full Preview Before Publishing'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#C9A86A]" />
              {isRtl ? 'دفع آمن عبر فودافون كاش & إنستاباي' : 'Secure Checkout via Vodafone Cash'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#C9A86A]" />
              {isRtl ? 'دعم مستمر حتى يوم مناسبتك' : 'Dedicated Support Until Your Day'}
            </span>
          </div>

        </div>
      </section>

    </div>
  );
};
