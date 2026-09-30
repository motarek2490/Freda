import React, { useState, useRef, useEffect } from 'react';
import {
  Instagram,
  Twitter,
  Mail,
  ArrowUp,
  Shield,
  Code2,
  Sparkles,
  Search,
  Lock,
  Users,
} from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../data/translations';
import { subscribeVisitorStatsCloud } from '../lib/firestoreService';
import { colors, typography } from '../styles/designTokens';

interface FooterProps {
  currentLang: Language;
  onNavigateSection: (sectionId: string) => void;
  onStartCreate: () => void;
  onOpenAdmin?: () => void;
  onOpenTrackOrder?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onNavigateSection,
  onStartCreate,
  onOpenAdmin,
  onOpenTrackOrder,
}) => {
  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';
  const [footerClicks, setFooterClicks] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [visitorCount, setVisitorCount] = useState<number>(1245);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = subscribeVisitorStatsCloud((count) => {
      if (count) setVisitorCount(count);
    });
    return () => unsub();
  }, []);

  // Hidden 5-click easter egg on logo for admin access
  const handleFooterLogoClick = () => {
    setFooterClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        if (onOpenAdmin) onOpenAdmin();
        return 0;
      }
      return next;
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setFooterClicks(0);
    }, 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      aria-label={isRtl ? 'تذييل الموقع' : 'Site Footer'}
      className="bg-[#080808] border-t border-[#C9A86A]/20 text-[#F4EFE7] pt-20 pb-12 relative overflow-hidden"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C9A86A]/6 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Top Editorial Row: Brand Monogram & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-[#C9A86A]/15">
          
          {/* Brand Vision Column */}
          <div className="lg:col-span-6 space-y-5 text-start">
            <div
              onClick={handleFooterLogoClick}
              className="inline-flex items-center gap-3.5 cursor-pointer group select-none"
              title={isRtl ? 'فريدا للدعوات الملكية' : 'FRIDA Royal Invitations'}
            >
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-tr from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] p-[1.5px] overflow-hidden shadow-lg transition-all ${
                  footerClicks > 0 ? 'ring-2 ring-[#C9A86A] scale-110' : ''
                }`}
              >
                <img
                  src="/logo.jpg"
                  alt="FRIDA Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                  }}
                  className="text-2xl sm:text-3xl font-extrabold tracking-wider text-[#F4EFE7] block leading-none"
                >
                  {t.brand.name}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C9A86A] mt-1 block">
                  HAUTE COUTURE INVITATIONS
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#D9C8A5]/80 leading-relaxed max-w-md font-light">
              {t.footer.brandDesc}
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="#instagram"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-[#111111] border border-[#C9A86A]/20 flex items-center justify-center text-[#D9C8A5] hover:text-[#080808] hover:bg-[#C9A86A] transition-all cursor-pointer shadow-sm"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-[#111111] border border-[#C9A86A]/20 flex items-center justify-center text-[#D9C8A5] hover:text-[#080808] hover:bg-[#C9A86A] transition-all cursor-pointer shadow-sm"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#email"
                onClick={(e) => e.preventDefault()}
                className="w-9 h-9 rounded-full bg-[#111111] border border-[#C9A86A]/20 flex items-center justify-center text-[#D9C8A5] hover:text-[#080808] hover:bg-[#C9A86A] transition-all cursor-pointer shadow-sm"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Editorial Newsletter Column */}
          <div className="lg:col-span-6 bg-[#111111] rounded-3xl border border-[#C9A86A]/20 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#C9A86A]">
              <Sparkles className="w-4 h-4" />
              <h3 className="font-semibold text-xs uppercase tracking-widest">
                {isRtl ? 'نشرة الإصدارات الحصرية' : 'EXCLUSIVE RELEASES'}
              </h3>
            </div>
            
            <p className="text-xs text-[#D9C8A5]/80 leading-relaxed font-light">
              {currentLang === 'en'
                ? 'Be the first to preview new couture suites, private acoustic scores, and curation releases.'
                : 'كن أول من يشاهد التصاميم والمقاطع الموسيقية الملكية الجديدة وتحديثات المنصة الموسمية.'}
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center">
                {currentLang === 'ar' ? '✓ تم اشتراكك بنجاح! نورت مجتمع فرِيدا.' : '✓ Subscribed successfully! Welcome to FRIDA.'}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  placeholder={isRtl ? 'بريدك الإلكتروني...' : 'Your email address...'}
                  className="w-full bg-[#080808] border border-[#C9A86A]/30 rounded-xl px-4 py-2.5 text-xs text-[#F4EFE7] placeholder-[#8D8A84] focus:outline-none focus:border-[#C9A86A] transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#C9A86A] to-[#E6D7B8] text-[#080808] text-xs font-bold rounded-xl hover:shadow-[0_0_15px_rgba(201,168,106,0.5)] transition-all cursor-pointer shrink-0"
                >
                  {isRtl ? 'اشترك' : 'Join'}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-start">
          
          {/* Atelier Navigation */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A86A] mb-4 pb-2 border-b border-[#C9A86A]/20 inline-block">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D9C8A5]/80">
              <li>
                <button
                  onClick={() => onNavigateSection('discovery')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {t.nav.explore}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('how-it-works')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {t.nav.howItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={onStartCreate}
                  className="text-[#C9A86A] hover:text-[#F4EFE7] font-semibold transition-colors cursor-pointer text-start flex items-center gap-1"
                >
                  <span>{t.nav.createInvitation}</span>
                  <span>→</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('faq')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {t.nav.faq}
                </button>
              </li>
            </ul>
          </div>

          {/* Occasions / Suites */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A86A] mb-4 pb-2 border-b border-[#C9A86A]/20 inline-block">
              {t.footer.categories}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D9C8A5]/80">
              <li>
                <button
                  onClick={() => onNavigateSection('discovery')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {t.categories.weddings}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('discovery')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {t.categories.engagements}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('discovery')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {t.categories.birthdays}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('discovery')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {t.categories.corporate}
                </button>
              </li>
            </ul>
          </div>

          {/* Order Tracking & Host Service */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A86A] mb-4 pb-2 border-b border-[#C9A86A]/20 inline-block">
              {isRtl ? 'خدمة الضيوف' : 'GUEST SUITE'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D9C8A5]/80">
              {onOpenTrackOrder && (
                <li>
                  <button
                    onClick={onOpenTrackOrder}
                    className="hover:text-[#F4EFE7] text-amber-400 font-semibold transition-colors cursor-pointer text-start flex items-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentLang === 'ar' ? 'تتبع حالة طلبك' : 'Track Order Status'}</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  onClick={() => onNavigateSection('experience')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {isRtl ? 'مزايا التجربة التفاعلية' : 'Interactive Features'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('distribution')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {isRtl ? 'طرق المشاركة وواتساب' : 'WhatsApp Distribution'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('story')}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {isRtl ? 'رؤية فريدا من مصر' : 'The Egyptian Craft'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal, Security & Privacy */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#C9A86A] mb-4 pb-2 border-b border-[#C9A86A]/20 inline-block">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D9C8A5]/80">
              <li>
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem('frida_analytics_consent');
                      window.location.reload();
                    } catch {}
                  }}
                  className="hover:text-[#F4EFE7] transition-colors cursor-pointer text-start"
                >
                  {isRtl ? 'إعدادات ملفات التعريف والخصوصية' : 'Privacy & Cookie Settings'}
                </button>
              </li>
              <li>
                <span className="text-[#D9C8A5]/60 block">
                  {isRtl ? 'دفع مؤمن عبر فودافون كاش & إنستاباي' : 'Vodafone Cash & InstaPay Secured'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-8 border-t border-[#C9A86A]/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#D9C8A5]/70">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-start">
            <p className="font-light">{t.footer.copyright}</p>
            
            {/* Signature Badge: Eng. Mohammed Tarek */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] border border-[#C9A86A]/30 text-[#C9A86A] font-semibold text-[11px] shadow-sm">
              <Code2 className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{t.footer.developedBy}</span>
            </div>

            {/* Live Visitor Count Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] border border-[#C9A86A]/30 text-[#D9C8A5] font-mono text-[11px] shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#C9A86A]" />
              <span>{isRtl ? `الزوار الفعليين: ${visitorCount.toLocaleString()}` : `Live Visitors: ${visitorCount.toLocaleString()}`}</span>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#D9C8A5] hover:text-[#C9A86A] transition-colors cursor-pointer group"
          >
            <span>{currentLang === 'en' ? 'Back to top' : 'العودة للأعلى'}</span>
            <div className="w-7 h-7 rounded-full border border-[#C9A86A]/40 group-hover:border-[#C9A86A] group-hover:bg-[#C9A86A]/10 flex items-center justify-center transition-all">
              <ArrowUp className="w-3.5 h-3.5 text-[#C9A86A]" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};
