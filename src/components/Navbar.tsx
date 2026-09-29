import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LayoutDashboard, Search, Sparkles } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { useTranslation } from '../data/translations';
import { BackgroundMusicPlayer } from './BackgroundMusicPlayer';
import { colors, typography } from '../styles/designTokens';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  onStartCreate: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
  onOpenTrackOrder?: () => void;
  bgTrackUrl?: string;
  bgTrackName?: string;
  isAudioSuppressed?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  user,
  onOpenAuth,
  onOpenDashboard,
  onStartCreate,
  onNavigateSection,
  onOpenAdmin,
  onOpenTrackOrder,
  bgTrackUrl,
  bgTrackName,
  isAudioSuppressed = false,
}) => {
  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hidden 5-Click Secret Trigger on Brand Logo for Admin Login
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoSecretClick = () => {
    const nextClicks = logoClicks + 1;
    if (nextClicks >= 5) {
      setLogoClicks(0);
      if (onOpenAdmin) onOpenAdmin();
    } else {
      setLogoClicks(nextClicks);
    }

    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => setLogoClicks(0), 2500);

    onNavigateSection('hero');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const toggleLanguage = () => {
    onLanguageChange(currentLang === 'en' ? 'ar' : 'en');
  };

  return (
    <>
      <header
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#080808]/90 backdrop-blur-md border-b border-[#C9A86A]/15 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-transparent py-5 sm:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Identity (Minimal Luxury) */}
            <div
              onClick={handleLogoSecretClick}
              className="flex items-center gap-3 cursor-pointer group select-none"
              title={isRtl ? 'فريدا — هوت كوتور الدعوات' : 'FRIDA — Digital Couture'}
              data-cursor="FRIDA"
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#C9A86A] via-[#E6D7B8] to-[#C9A86A] p-[1.5px] overflow-hidden transition-all duration-300 ${
                  logoClicks > 0 ? 'ring-2 ring-[#C9A86A] scale-110' : ''
                }`}
              >
                <img
                  src="/logo.jpg"
                  alt="FRIDA"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span
                  style={{
                    fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                  }}
                  className="text-xl sm:text-2xl font-bold tracking-widest text-[#F4EFE7] group-hover:text-[#C9A86A] transition-colors leading-none"
                >
                  FRIDA
                </span>
                <span className="text-[8px] font-mono tracking-[0.25em] text-[#C9A86A]/80 uppercase mt-0.5">
                  DIGITAL COUTURE
                </span>
              </div>
            </div>

            {/* Center: Editorial Navigation Links (Desktop - Zero Pills) */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-medium tracking-wider">
              <button
                onClick={() => onNavigateSection('atelier')}
                className="text-[#D9C8A5]/80 hover:text-[#F4EFE7] transition-colors cursor-pointer py-1 relative group"
                data-cursor="ATELIER"
              >
                <span>{isRtl ? 'الأتيليه' : 'Atelier'}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C9A86A] group-hover:w-full transition-all duration-300" />
              </button>

              <button
                onClick={() => onNavigateSection('feel')}
                className="text-[#D9C8A5]/80 hover:text-[#F4EFE7] transition-colors cursor-pointer py-1 relative group"
              >
                <span>{isRtl ? 'العوالم' : 'Atmospheres'}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C9A86A] group-hover:w-full transition-all duration-300" />
              </button>

              <button
                onClick={() => onNavigateSection('experience')}
                className="text-[#D9C8A5]/80 hover:text-[#F4EFE7] transition-colors cursor-pointer py-1 relative group"
              >
                <span>{isRtl ? 'التجربة' : 'Experience'}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C9A86A] group-hover:w-full transition-all duration-300" />
              </button>

              <button
                onClick={() => onNavigateSection('how-it-works')}
                className="text-[#D9C8A5]/80 hover:text-[#F4EFE7] transition-colors cursor-pointer py-1 relative group"
              >
                <span>{isRtl ? 'كيف يعمل' : 'Journey'}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C9A86A] group-hover:w-full transition-all duration-300" />
              </button>

              <button
                onClick={() => onNavigateSection('story')}
                className="text-[#D9C8A5]/80 hover:text-[#F4EFE7] transition-colors cursor-pointer py-1 relative group"
              >
                <span>{isRtl ? 'رؤيتنا' : 'Story'}</span>
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C9A86A] group-hover:w-full transition-all duration-300" />
              </button>
            </nav>

            {/* Right: Actions, Audio, Language, Create */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Ambient Audio Player */}
              <div className="hidden sm:block">
                <BackgroundMusicPlayer
                  currentLang={currentLang}
                  isSuppressed={isAudioSuppressed}
                  trackUrl={bgTrackUrl}
                  trackName={bgTrackName}
                />
              </div>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="text-xs font-mono font-medium text-[#D9C8A5]/80 hover:text-[#F4EFE7] transition-colors px-2 py-1 cursor-pointer"
                title={isRtl ? 'Switch to English' : 'التحويل للغة العربية'}
              >
                {currentLang === 'en' ? 'العربية' : 'EN'}
              </button>

              {/* User Dashboard / Sign In */}
              {user ? (
                <button
                  onClick={onOpenDashboard}
                  className="hidden md:flex items-center gap-1.5 text-xs text-[#D9C8A5] hover:text-[#F4EFE7] transition-colors cursor-pointer px-2 py-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#C9A86A]" />
                  <span className="max-w-[80px] truncate">{user.name?.split(' ')[0]}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="hidden md:block text-xs text-[#D9C8A5]/80 hover:text-[#F4EFE7] transition-colors cursor-pointer px-2 py-1"
                >
                  {t.nav.signIn}
                </button>
              )}

              {/* Primary Call to Action: Craft Your Moment */}
              <button
                onClick={onStartCreate}
                data-cursor="CREATE"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#C9A86A] to-[#E6D7B8] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(201,168,106,0.4)] transition-all cursor-pointer"
              >
                <span>{isRtl ? 'اصنع دعوتك' : 'Create'}</span>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#D9C8A5] hover:text-[#F4EFE7] cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Luxury Drawer */}
      {mobileMenuOpen && (
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[100] bg-[#080808]/98 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-300"
        >
          <div className="flex items-center justify-between border-b border-[#C9A86A]/20 pb-4">
            <span
              style={{
                fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
              }}
              className="text-2xl font-bold tracking-widest text-[#F4EFE7]"
            >
              FRIDA
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-10 h-10 rounded-full border border-[#C9A86A]/30 flex items-center justify-center text-[#F4EFE7] hover:bg-[#C9A86A]/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-6 text-xl sm:text-2xl font-bold py-8">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('atelier');
              }}
              className="text-start text-[#F4EFE7] hover:text-[#C9A86A] transition-colors"
            >
              {isRtl ? 'أتيليه التصاميم (٤١ قالباً)' : 'The Atelier (41 Suites)'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('feel');
              }}
              className="text-start text-[#F4EFE7] hover:text-[#C9A86A] transition-colors"
            >
              {isRtl ? 'عوالم التصميم والأجواء' : 'What Will They Feel?'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('experience');
              }}
              className="text-start text-[#F4EFE7] hover:text-[#C9A86A] transition-colors"
            >
              {isRtl ? 'ليست بطاقة.. إنها تجربة' : 'The Interactive Suite'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('how-it-works');
              }}
              className="text-start text-[#F4EFE7] hover:text-[#C9A86A] transition-colors"
            >
              {isRtl ? 'كيف تصنع دعوتك' : 'How It Works'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('story');
              }}
              className="text-start text-[#F4EFE7] hover:text-[#C9A86A] transition-colors"
            >
              {isRtl ? 'رؤية فريدا من مصر' : 'The FRIDA Story'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('faq');
              }}
              className="text-start text-[#F4EFE7] hover:text-[#C9A86A] transition-colors"
            >
              {isRtl ? 'الأسئلة الشائعة' : 'FAQ'}
            </button>
            {onOpenTrackOrder && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTrackOrder();
                }}
                className="text-start text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>{isRtl ? 'تتبع حالة طلبك' : 'Track Order Status'}</span>
              </button>
            )}
          </nav>

          {/* Bottom Drawer Actions */}
          <div className="space-y-4 pt-4 border-t border-[#C9A86A]/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onStartCreate();
              }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#C9A86A] to-[#E6D7B8] text-[#080808] font-bold text-sm uppercase tracking-wider text-center"
            >
              {isRtl ? 'اصنع لحظتك الآن' : 'Craft Your Moment Now'}
            </button>

            <div className="flex items-center justify-between text-xs text-[#D9C8A5]">
              <button onClick={toggleLanguage} className="underline">
                {currentLang === 'en' ? 'التحويل للغة العربية' : 'Switch to English'}
              </button>
              {user ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="underline cursor-pointer hover:text-[#C9A86A] transition-colors"
                >
                  {t.nav.dashboard}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="underline cursor-pointer hover:text-[#C9A86A] transition-colors"
                >
                  {t.nav.signIn}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
