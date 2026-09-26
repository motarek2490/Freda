import React from 'react';
import { SearchX, Home, Sparkles, Phone } from 'lucide-react';
import { Language } from '../types';

interface InvitationNotFoundScreenProps {
  currentLang?: Language;
  identifier?: string;
  onGoHome?: () => void;
}

export const InvitationNotFoundScreen: React.FC<InvitationNotFoundScreenProps> = ({
  currentLang = 'ar',
  identifier,
  onGoHome,
}) => {
  const isRtl = currentLang === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#121212] text-[#F7F4EE] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B99A65]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#171717]/95 border border-[#333] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-[#1F1E1B] border border-[#333] flex items-center justify-center mx-auto text-[#8D8A84]">
          <SearchX className="w-8 h-8 text-[#B99A65]" />
        </div>

        <div className="space-y-2">
          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'لم يتم العثور على الدعوة' : 'Invitation Not Found'}
          </h2>
          <p className="text-xs text-[#8D8A84] leading-relaxed">
            {isRtl
              ? 'عفواً، لم نتمكن من العثور على هذه الدعوة أو ربما تم تغيير الرابط أو حذفه.'
              : 'The requested invitation could not be found or the link may have been updated.'}
          </p>
          {identifier && (
            <span className="text-[11px] text-[#B99A65] font-mono block">
              ID: {identifier}
            </span>
          )}
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              if (onGoHome) onGoHome();
              else window.location.href = '/';
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(185,154,101,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>{isRtl ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
