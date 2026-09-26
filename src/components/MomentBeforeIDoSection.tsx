import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Volume2, Calendar, Clock, MapPin, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, InvitationData } from '../types';
import { colors, typography } from '../styles/designTokens';

interface MomentBeforeIDoSectionProps {
  currentLang: Language;
  onOpenLivePreview: (sample: InvitationData) => void;
  onStartCreate: () => void;
}

export const MomentBeforeIDoSection: React.FC<MomentBeforeIDoSectionProps> = ({
  currentLang,
  onOpenLivePreview,
  onStartCreate,
}) => {
  const isRtl = currentLang === 'ar';
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // Clearly marked demo invitation data
  const demoInvitation: InvitationData = {
    id: 'demo-mohamed-farida',
    templateId: 'frida-royal-001',
    layoutType: 'royal',
    title: isRtl ? 'حفل زفاف محمد وفريدة' : 'The Wedding of Mohamed & Farida',
    language: currentLang,
    themeStyle: 'luxury',
    customColors: {
      bg: '#0E0E0E',
      cardBg: '#171614',
      text: '#F4EFE7',
      accent: '#C9A86A',
    },
    customFont: "'Amiri', 'Playfair Display', serif",
    eventDetails: {
      eventTitle: isRtl ? 'حفل زفاف العمر' : 'Royal Wedding Celebration',
      hostNames: isRtl ? 'محمد & فريدة' : 'Mohamed & Farida',
      eventDate: '2026-11-20',
      eventTime: '08:00 PM',
      venueName: isRtl ? 'قصر البارون إمبان — القاهرة' : 'Baron Empain Palace — Cairo',
      address: isRtl ? 'شارع العروبة، مصر الجديدة، القاهرة' : 'Orouba St, Heliopolis, Cairo',
      googleMapsUrl: 'https://maps.google.com/?q=Baron+Empain+Palace',
      customMessage: isRtl
        ? 'بكل حب وسرور، نتمنى مشاركتكم لنا فرحة العمر في هذه الليلة الاستثنائية.'
        : 'With great joy, we invite you to share our lifetime celebration.',
      dressCode: isRtl ? 'ملكي رسمي (Black Tie)' : 'Black Tie / Royal Formal',
      enableRSVP: true,
      allowPlusOne: true,
      rsvpDeadline: '2026-11-10',
      musicTrackName: 'Royal Overture & String Quartet',
    },
    status: 'published',
    createdAt: new Date().toISOString(),
    slug: 'mohamed-farida',
  };

  return (
    <section
      id="moment-before"
      aria-label={isRtl ? 'اللحظة التي تسبق نعم' : 'The Moment Before I Do'}
      className="py-28 sm:py-36 bg-[#080808] text-[#F4EFE7] relative overflow-hidden border-t border-[#C9A86A]/15"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-[#C9A86A]/7 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Massive Editorial Cinematic Headline */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <span className="text-xs font-mono tracking-[0.4em] uppercase text-[#C9A86A] block">
            CINEMATIC PRELUDE
          </span>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4EFE7] leading-none"
          >
            {isRtl ? (
              <>
                اللحظة <br />
                التي تسبق <br />
                <span className="italic gold-shimmer-text">"نعم"</span>
              </>
            ) : (
              <>
                THE MOMENT <br />
                BEFORE <br />
                <span className="italic gold-shimmer-text">"I DO"</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-xl mx-auto pt-2">
            {isRtl ? 'هكذا سيعيش ضيوفك دعوتك.' : 'This is how your guests will experience it.'}
          </p>
        </div>

        {/* Realistic Demo Reveal Stage */}
        <div className="max-w-3xl mx-auto bg-[#111111] rounded-3xl border border-[#C9A86A]/30 p-8 sm:p-14 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-[10px] font-mono text-[#D9C8A5]/60 bg-[#161616] px-3 py-1 rounded-full border border-[#C9A86A]/20">
            {isRtl ? 'نموذج محاكاة واقعي' : 'OFFICIAL DEMO PREVIEW'}
          </div>

          <div className="space-y-8 text-center pt-4">
            
            {/* Monogram & Title */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#C9A86A] block">
                {isRtl ? 'دعوة زفاف خاصة' : 'ROYAL INVITATION'}
              </span>

              <h3
                style={{
                  fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
                }}
                className="text-3xl sm:text-5xl font-bold text-[#F4EFE7] tracking-wide"
              >
                {isRtl ? 'محمد & فريدة' : 'MOHAMED & FARIDA'}
              </h3>

              <p className="text-xs sm:text-sm text-[#D9C8A5]/80 font-light max-w-md mx-auto italic">
                {isRtl
                  ? '«بكل حب وسرور، نتمنى مشاركتكم لنا فرحة العمر في هذه الليلة الاستثنائية»'
                  : '“With great joy, we request the honor of your presence to celebrate our union.”'}
              </p>
            </div>

            {/* Event Coordinates */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#D9C8A5] py-4 border-y border-[#C9A86A]/15">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A86A]" />
                <span>{isRtl ? 'الجمعة، ٢٠ نوفمبر ٢٠٢٦' : 'Friday, Nov 20, 2026'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9A86A]" />
                <span>{isRtl ? 'الساعة ٨:٠٠ مساءً' : '8:00 PM'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C9A86A]" />
                <span>{isRtl ? 'قصر البارون — القاهرة' : 'Baron Palace — Cairo'}</span>
              </div>
            </div>

            {/* Interaction Callouts */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onOpenLivePreview(demoInvitation)}
                data-cursor="OPEN"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#C9A86A] to-[#E6D7B8] text-[#080808] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(201,168,106,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#080808]" />
                <span>{isRtl ? 'افتح هذه الدعوة الحية بالكامل' : 'Open This Full Live Demo'}</span>
              </button>

              <button
                onClick={onStartCreate}
                data-cursor="CREATE"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#C9A86A]/40 text-[#F4EFE7] hover:bg-[#C9A86A]/10 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              >
                {isRtl ? 'ابدأ بتصميم دعوتك' : 'Begin Designing Yours'}
              </button>
            </div>

            <p className="text-[11px] font-mono text-[#D9C8A5]/60 pt-2">
              {isRtl
                ? 'تشمل المحاكاة: ختم الشمع التفاعلي، انسياب الموسيقى، الخرائط، وتأكيد الحضور الذكي.'
                : 'Includes: interactive wax seal, ambient score, GPS navigation, and smart RSVP.'}
            </p>

          </div>
        </div>

      </div>
    </section>
  );
};
