import React from 'react';
import { ShieldAlert, Lock, AlertTriangle, Home, RefreshCw, KeyRound, Phone } from 'lucide-react';
import { Language } from '../types';

interface InvalidTokenScreenProps {
  currentLang: Language;
  targetId?: string;
  reason?: 'invalid_format' | 'tampered_signature' | 'target_mismatch' | 'expired_token' | 'corrupt_payload' | string;
  onGoHome?: () => void;
}

export const InvalidTokenScreen: React.FC<InvalidTokenScreenProps> = ({
  currentLang,
  targetId,
  reason,
  onGoHome,
}) => {
  const isRtl = currentLang === 'ar';

  const getReasonExplanation = () => {
    switch (reason) {
      case 'tampered_signature':
        return isRtl
          ? 'تم الكشف عن تعديل غير مصرح في رابط المعاينة أو التوقيع الرقمي المشفر.'
          : 'The preview signature token appears to have been modified or tampered with.';
      case 'expired_token':
        return isRtl
          ? 'انتهت صلاحية الرمز الرقمي المؤقت لهذه المعاينة. يرجى إعادة طلب الرابط من لوحة التحكم.'
          : 'The digital signature token for this preview has expired.';
      case 'target_mismatch':
        return isRtl
          ? 'التوقيع الرقمي غير مطابق لمعرف القالب أو الدعوة المستهدفة.'
          : 'The digital token does not match the requested invitation identifier.';
      default:
        return isRtl
          ? 'رابط المعاينة لا يحتوي على توقيع رقمي صالح (Missing or Invalid Token).'
          : 'The preview link is missing a valid cryptographic signature token.';
    }
  };

  const handleContactSupport = () => {
    const text = isRtl
      ? `مرحباً فريدا، أواجه مشكلة في فتح رابط المعاينة المشفر: ${targetId || ''}`
      : `Hello FRIDA, I have an issue opening the signed preview link: ${targetId || ''}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#121212] text-[#F7F4EE] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-[#171717]/95 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-playfair text-xl tracking-[0.2em] font-bold text-[#F7F4EE]">
            FRIDA
          </span>
          <span className="text-[10px] text-[#B99A65] border border-[#B99A65]/40 px-2 py-0.5 rounded-full font-mono">
            SECURE PREVIEW
          </span>
        </div>

        {/* Shield Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#1F1E1B] border border-amber-500/40 flex items-center justify-center shadow-lg">
          <ShieldAlert className="w-9 h-9 text-amber-400" />
        </div>

        {/* Status Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border bg-amber-500/15 border-amber-500/40 text-amber-400 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>{isRtl ? 'حماية المعاينة بالتوقيع الرقمي (Token Protected)' : 'Token Protected Preview'}</span>
          </span>
        </div>

        {/* Details Box */}
        <div className="space-y-3">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {isRtl ? 'رابط معاينة غير مصرح أو توقيع غير صالح' : 'Unauthorized Preview Link'}
          </h1>

          <div className="p-3.5 bg-[#1F1E1B] rounded-2xl border border-[#333] text-xs space-y-1 text-start">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{isRtl ? 'سبب الحظر الأمني:' : 'Security Diagnostic:'}</span>
            </div>
            <p className="text-xs text-[#E9E1D5] leading-relaxed">
              {getReasonExplanation()}
            </p>
            {targetId && (
              <span className="text-[11px] text-[#8D8A84] font-mono block pt-1">
                ID: {targetId}
              </span>
            )}
          </div>

          <p className="text-xs text-[#8D8A84] leading-relaxed pt-1">
            {isRtl
              ? 'لحماية التصاميم الملكية وبيانات العملاء من الوصول غير المصرح به، تتطلب روابط المعاينة توقيعاً رقمياً مشفراً صالحاً يتم إنشاؤه عبر منصة فريدا الرسمية.'
              : 'To safeguard proprietary designs and client data, preview links require a verified cryptographic signature.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              if (onGoHome) onGoHome();
              else {
                window.location.href = '/';
              }
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(185,154,101,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>{isRtl ? 'العودة للصفحة الرئيسية لفريدا' : 'Return to FRIDA Home'}</span>
          </button>

          <button
            onClick={handleContactSupport}
            className="w-full py-3 px-4 rounded-xl bg-[#1F1E1B] border border-[#333] text-[#F7F4EE] hover:text-[#B99A65] hover:border-[#B99A65] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'تواصل مع الدعم الفني' : 'Contact Support'}</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="pt-2 border-t border-[#2A2722] text-[10px] text-[#666] flex items-center justify-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-amber-500/60" />
          <span>
            {isRtl
              ? 'نظام أمني مشفر: التحقق من التوقيع الرقمي الصادر من الخادم.'
              : 'Token-based cryptographic signature enforcement.'}
          </span>
        </div>
      </div>
    </div>
  );
};
