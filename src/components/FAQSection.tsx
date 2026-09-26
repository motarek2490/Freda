import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../data/translations';

interface FAQSectionProps {
  currentLang: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ currentLang }) => {
  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';

  const faqs = [
    {
      q: isRtl ? 'إزاي بتابع ردود وتأكيدات حضور المعازيم؟' : 'How does real-time guest RSVP tracking work?',
      a: isRtl
        ? 'أول ما المعزوم يفتح رابط دعوته ويدوس تأكيد الحضور، رده بيتسجل فوراً في لوحة تحكمك الخاصة، وتقدر تشوف كشف الأسماء والمرافقين في أي لحظة وتنزله إكسل.'
        : 'The moment a guest confirms attendance, their response logs instantly into your private host portal. You can view attendee numbers and export to Excel anytime.',
    },
    {
      q: isRtl ? 'هل الدعوة بتفتح كويس وسريع على كل الموبايلات؟' : 'Does the invitation load smoothly on all phones?',
      a: isRtl
        ? 'أكيد، الدعوة مصممة تفتح في أقل من ثانية على الآيفون والأندرويد بدون ما الضيف يحتاج ينزل أي تطبيق أو يسجل حساب.'
        : 'Yes, the invitation loads in under a second across iPhones, Android devices, and laptops without any app downloads or accounts.',
    },
    {
      q: isRtl ? 'أقدر أحط لوكيشن القاعة على جوجل ماب وموسيقى خاصة بي؟' : 'Can I add Google Maps directions and a custom song?',
      a: isRtl
        ? 'طبعاً، بتحط رابط لوكيشن القاعة والمعزوم يدوس عليه يفتح الجي بي إس ويوصله لباب القاعة، وتقدر تختار أي أغنية أو زفة وتقص بدايتها بالمحرر.'
        : 'Yes, your Google Maps link guides guests directly to the venue gates, and you can select or trim your custom soundtrack in our audio editor.',
    },
    {
      q: isRtl ? 'إزاي بيتم دفع وتفعيل الدعوة في مصر؟' : 'How does payment and activation work in Egypt?',
      a: isRtl
        ? 'الدفع بسيط ومباشر عبر فودافون كاش أو إنستاباي. بمجرد تحويل المبلغ وإدخال رقم التحويل، بنراجع ونفعّل دعوتك فوراً وتبدأ تبعتها لأحبابك.'
        : 'Checkout is instant via Vodafone Cash or InstaPay. Once you submit the transfer reference, your invite is verified and activated immediately.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#121212] text-[#F7F4EE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f1e1b] border border-[#B99A65]/30 text-[#B99A65] text-xs font-semibold uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.nav.faq}</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold">
            {isRtl ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[#1F1E1B] border border-[#B99A65]/20 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-start flex items-center justify-between font-playfair font-bold text-sm sm:text-base text-[#F7F4EE] hover:text-[#B99A65]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#B99A65] transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#8D8A84] leading-relaxed border-t border-[#333] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
