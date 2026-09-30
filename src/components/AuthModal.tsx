import React, { useState } from 'react';
import { X, KeyRound, Lock, User, Phone, ShieldCheck, AlertCircle, Clock, Loader2, Sparkles } from 'lucide-react';
import { Language, UserProfile, InvitationData } from '../types';
import { setStoredUser } from '../lib/storage';
import { authenticateClientCredentialsCloud } from '../lib/firestoreService';
import { trackSignUp } from '../lib/analytics';

interface AuthModalProps {
  currentLang: Language;
  onClose: () => void;
  onSuccess: (user: UserProfile, invitation?: InvitationData) => void;
  onOpenAdmin?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ currentLang, onClose, onSuccess, onOpenAdmin }) => {
  const isRtl = currentLang === 'ar';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpiredError, setIsExpiredError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setIsExpiredError(false);

    try {
      const result = await authenticateClientCredentialsCloud(identifier, password);

      if (result.success && result.invitation) {
        const loggedUser: UserProfile = {
          id: result.invitation.id,
          name: result.invitation.eventDetails.groomName || result.invitation.title || (isRtl ? 'المضيف الملكي' : 'Royal Host'),
          email: result.invitation.customerPhone || `${result.invitation.id}@frida.app`,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        };

        // User authenticated via Firebase Auth custom token from hostLogin Cloud Function
        setStoredUser(loggedUser);
        trackSignUp('host_portal');
        onSuccess(loggedUser, result.invitation);
        onClose();
      } else if (result.error === 'expired') {
        setIsExpiredError(true);
        const expDate = result.expiresAt
          ? new Date(result.expiresAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : '';
        setErrorMessage(
          isRtl
            ? `عفواً، انتهت فترة صلاحية هذا الحساب والدعوة (30 يوماً${expDate ? ` - انتهت في ${expDate}` : ''}). تم إيقاف صلاحية الدخول وأرشفة الدعوة تلقائياً.`
            : `This account and invitation have expired (30-day limit). Access has been revoked.`
        );
      } else {
        setErrorMessage(
          isRtl
            ? 'بيانات الدخول غير صحيحة! يرجى التأكد من كتابة اسم المستخدم أو رقم الهاتف المسجل به الطلب وكلمة المرور/كود الدخول التي أرسلتها لك الإدارة.'
            : 'Invalid credentials! Please enter the exact username/phone and password sent by admin.'
        );
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(
        isRtl
          ? 'حدث خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة مرة أخرى.'
          : 'A connection error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContactWhatsApp = () => {
    const text = isRtl
      ? `مرحباً فريدا، أود الاستفسار عن بيانات الدخول أو تجديد صلاحية حسابي - المعرف: ${identifier}`
      : `Hello FRIDA, inquiring about login credentials or account renewal - ID: ${identifier}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(185,154,101,0.2)] space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B99A65]/20 via-[#B99A65]/10 to-transparent border border-[#B99A65] flex items-center justify-center text-[#B99A65] mx-auto shadow-lg">
            <KeyRound className="w-7 h-7 text-[#B99A65]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B99A65]/15 border border-[#B99A65]/30 text-[#B99A65] text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isRtl ? 'بوابة دخول أصحاب الدعوات الملكية' : 'Host VIP Client Portal'}</span>
          </div>
          <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تسجيل دخول المضيف' : 'Host Login'}
          </h3>
          <p className="text-xs text-[#8D8A84] max-w-xs mx-auto">
            {isRtl
              ? 'أدخل بيانات الدخول (اسم المستخدم وكلمة المرور) المرسلة إليك من إدارة فريدا للوصول لبوابتك الملكية.'
              : 'Enter the username and password provided by FRIDA administration to access your host portal.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Username / Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#B99A65]" />
              <span>{isRtl ? 'رقم الهاتف / اسم المستخدم المسجل به الطلب:' : 'Registered Phone / Username:'}</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={isRtl ? 'مثال: 01012345678 أو اسم المستخدم' : 'e.g. 01012345678 or username'}
              className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-4 py-3 text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65] transition-colors"
            />
          </div>

          {/* Password / Access Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#B99A65]" />
                <span>{isRtl ? 'كلمة المرور / كود المضيف (Access Code):' : 'Password / Host Access Code:'}</span>
              </span>
            </label>
            <input
              type="text"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isRtl ? 'مثال: HOST-123456 أو كلمة المرور' : 'e.g. HOST-123456'}
              className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-4 py-3 text-[#F7F4EE] placeholder-[#666] font-mono tracking-wider focus:outline-none focus:border-[#B99A65] transition-colors"
            />
          </div>

          <p className="text-[10px] text-[#8D8A84] leading-relaxed">
            {isRtl
              ? '💡 تجد كود المضيف (HOST-XXXXXX) واسم المستخدم في رسالة تسليم الدعوة التي وصلتك عبر الواتساب من الإدارة.'
              : '💡 Find your Host Access Code (HOST-XXXXXX) in the invitation delivery WhatsApp message sent by admin.'}
          </p>

          {/* Error Message */}
          {errorMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
                isExpiredError
                  ? 'bg-red-950/40 border-red-500/50 text-red-300'
                  : 'bg-red-950/30 border-red-500/40 text-red-400'
              }`}
            >
              {isExpiredError ? (
                <Clock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <p className="leading-relaxed">{errorMessage}</p>
                {isExpiredError && (
                  <button
                    type="button"
                    onClick={handleContactWhatsApp}
                    className="mt-1.5 text-xs text-amber-400 underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRtl ? 'طلب تجديد الصلاحية عبر الواتساب' : 'Contact Support to Renew'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(185,154,101,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#171717]" />
                <span>{isRtl ? 'جارِ التحقق وتأكيد الصلاحية...' : 'Verifying Credentials...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#171717]" />
                <span>{isRtl ? 'دخول البوابة الملكية 👑' : 'Enter Royal Host Portal 👑'}</span>
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-2 border-t border-[#2A2722] text-center space-y-2">
          <p className="text-[11px] text-[#8D8A84] leading-relaxed">
            {isRtl
              ? '🔒 حسابات المضيف مخصصة فقط لمن تم تسليمهم بيانات الاعتماد بعد اعتماد طلبهم الملكي، وتظل صالحة لمدة 30 يوماً.'
              : '🔒 Host access is strictly restricted to approved clients with active 30-day validity.'}
          </p>

          <div className="flex items-center justify-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={handleContactWhatsApp}
              className="text-[#8D8A84] hover:text-[#B99A65] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>{isRtl ? 'الدعم الفني 💬' : 'Contact Support 💬'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
