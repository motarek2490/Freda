import React from 'react';
import { Loader2, Sparkles, Home } from 'lucide-react';
import { Language } from '../types';

interface InvitationLoadingScreenProps {
  currentLang?: Language;
  onGoHome?: () => void;
}

export const InvitationLoadingScreen: React.FC<InvitationLoadingScreenProps> = ({
  currentLang = 'ar',
  onGoHome,
}) => {
  const isRtl = currentLang === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#121212] text-[#F7F4EE] flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B99A65]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center text-center space-y-6 max-w-sm mx-auto animate-in fade-in duration-300">
        {/* Animated Brand Emblem */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#B99A65] via-[#E9E1D5] to-[#B99A65] p-[2px] shadow-[0_0_30px_rgba(185,154,101,0.3)] animate-spin-slow">
            <img
              src="/logo.jpg"
              alt="FRIDA"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#1F1E1B] border border-[#B99A65] flex items-center justify-center text-[#B99A65] shadow-lg animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'فريدا للمناسبات الملكية' : 'FRIDA Royal Invitations'}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs text-[#B99A65]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>
              {isRtl
                ? 'جارِ التحقق وتحميل تفاصيل الدعوة...'
                : 'Verifying & loading invitation details...'}
            </span>
          </div>
        </div>

        {/* Fallback button if network is slow */}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="pt-4 text-xs text-[#8D8A84] hover:text-[#F7F4EE] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{isRtl ? 'العودة للصفحة الرئيسية' : 'Return to Home'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
