import React, { useState } from 'react';
import {
  Shield,
  Lock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Language } from '../../types';
import { loginAdminWithGoogle } from '../../lib/security';

interface AdminLoginModalProps {
  currentLang: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  currentLang,
  onClose,
  onSuccess,
}) => {
  const isRtl = currentLang === 'ar';
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [copiedHost, setCopiedHost] = useState(false);

  const handleGoogleLogin = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setGoogleLoading(true);
    setAuthError('');

    try {
      const res = await loginAdminWithGoogle();
      if (res.success) {
        onSuccess();
      } else {
        setAuthError(res.error || (isRtl ? 'فشل تسجيل الدخول أو الحساب غير مصرح له بالإدارة' : 'Google sign-in failed or account lacks admin permissions'));
      }
    } catch (err: any) {
      setAuthError(err.message || (isRtl ? 'حدث خطأ في Google Login' : 'Google sign-in error'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const copyCurrentDomain = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.hostname);
      setCopiedHost(true);
      setTimeout(() => setCopiedHost(false), 2500);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-[#171717] border border-[#B99A65]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(185,154,101,0.25)] space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#B99A65]/30 via-[#B99A65]/10 to-transparent border border-[#B99A65] flex items-center justify-center text-[#B99A65] mx-auto shadow-lg">
            <Shield className="w-8 h-8 text-[#B99A65]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B99A65]/15 border border-[#B99A65]/30 text-[#B99A65] text-[10px] font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>{isRtl ? 'بوابة الإدارة الملكية المعتمدة' : 'Official Royal Admin Portal'}</span>
          </div>
          <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تسجيل دخول الإدارة' : 'Admin Portal Login'}
          </h3>
          <p className="text-xs text-[#8D8A84] max-w-xs mx-auto">
            {isRtl
              ? 'تسجيل الدخول الإداري مقتصر فقط على حسابات المشرفين المعتمدة عبر Google مع صلاحيات الإدارة المسجلة.'
              : 'Admin access requires an authorized Google account with verified Admin Custom Claims.'}
          </p>
        </div>

        {/* Google Login Only */}
        <div className="space-y-4">
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogleLogin}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#242424] to-[#2A2A2A] hover:border-[#B99A65] border border-[#444] text-[#F7F4EE] font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#B99A65]" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{isRtl ? 'المتابعة والتسجيل عبر حساب Google' : 'Continue with Google Account'}</span>
          </button>

          {/* Error Message */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2.5 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed flex-1">{authError}</p>
              </div>

              {(authError.includes('Authorized Domains') || authError.includes('غير مضاف') || authError.includes('Pop-up Blocked') || authError.includes('حظر')) && (
                <div className="pt-2 border-t border-amber-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] bg-black/40 px-2 py-1 rounded border border-amber-500/30 text-amber-300 truncate max-w-[220px]">
                      {typeof window !== 'undefined' ? window.location.hostname : 'farid.invitationes.workers.dev'}
                    </span>
                    <button
                      type="button"
                      onClick={copyCurrentDomain}
                      className="px-2.5 py-1 rounded bg-[#B99A65] text-[#171717] font-bold text-[10px] hover:bg-[#d6bd91] transition-all cursor-pointer shrink-0"
                    >
                      {copiedHost
                        ? (isRtl ? 'تم النسخ ✓' : 'Copied ✓')
                        : (isRtl ? 'نسخ النطاق' : 'Copy Domain')}
                    </button>
                  </div>
                  <a
                    href="https://console.firebase.google.com/project/frida-ed3b5/authentication/settings"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-[#B99A65] hover:underline flex items-center gap-1 font-medium mt-1"
                  >
                    <span>{isRtl ? 'اضغط هنا لفتح إعدادات النطاقات في فايربيس (Authorized Domains)' : 'Click here to open Firebase Authorized Domains'}</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="pt-2 border-t border-[#2A2722] text-center">
          <p className="text-[11px] text-[#8D8A84] flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>
              {isRtl
                ? 'محمي بقواعد Firebase Security Rules والتحقق المشفر من هوية المسؤول'
                : 'Protected by Firebase Custom Admin Claims & Security Rules'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

