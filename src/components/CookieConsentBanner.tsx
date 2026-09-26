import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Lock } from 'lucide-react';
import { getAnalyticsConsent, setAnalyticsConsent } from '../lib/analytics';
import { Language } from '../types';

interface CookieConsentBannerProps {
  currentLang?: Language;
  onOpenPrivacyModal?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  currentLang = 'ar',
  onOpenPrivacyModal,
}) => {
  const isRtl = currentLang === 'ar';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show banner on first visit if consent choice not saved
    const consent = getAnalyticsConsent();
    if (consent === null) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    } else if (consent === 'granted') {
      // Automatically trigger analytics initialization if previously granted
      setAnalyticsConsent('granted');
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    setAnalyticsConsent('granted');
    setVisible(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent('denied');
    setVisible(false);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-in slide-in-from-bottom duration-500 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto bg-[#171717]/95 border border-[#B99A65]/50 rounded-3xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#F7F4EE]">
        
        {/* Text Content */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-[#B99A65]/15 border border-[#B99A65]/40 flex items-center justify-center text-[#B99A65] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#F7F4EE]">
                {isRtl ? 'إعدادات الخصوصية والتحليل' : 'Privacy & Analytics Consent'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#B99A65]/10 border border-[#B99A65]/30 text-[#B99A65] text-[10px] font-semibold">
                {isRtl ? 'خصوصية فائقة' : 'Zero PII'}
              </span>
            </div>
            <p className="text-xs text-[#8D8A84] leading-relaxed">
              {isRtl
                ? 'نستخدم أدوات تحليلية مجهولة (Google Analytics & Meta) لتحسين تجربتك وقياس أداء الدعوات دون جمع أي بيانات شخصية أو أرقام هاتف.'
                : 'We use anonymous analytics tools (Google Analytics & Meta) to improve performance without collecting personal phone numbers or private data.'}
              {onOpenPrivacyModal && (
                <button
                  onClick={onOpenPrivacyModal}
                  className="text-[#B99A65] hover:underline font-medium mx-1 cursor-pointer"
                >
                  {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#333]/50">
          <button
            onClick={handleDecline}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1F1E1B] border border-[#333] text-[#8D8A84] hover:text-[#F7F4EE] hover:border-[#555] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            <span>{isRtl ? 'رفض' : 'Decline'}</span>
          </button>
          
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#D4AF37] text-[#171717] font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isRtl ? 'موافق' : 'Accept'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
