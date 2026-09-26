import React from 'react';
import { Clock, ShieldAlert, Phone, Home, Crown, Lock } from 'lucide-react';
import { InvitationData, Language } from '../types';

interface ExpiredInvitationScreenProps {
  invitation: InvitationData;
  currentLang: Language;
  onGoHome?: () => void;
}

export const ExpiredInvitationScreen: React.FC<ExpiredInvitationScreenProps> = ({
  invitation,
  currentLang,
  onGoHome,
}) => {
  const isRtl = currentLang === 'ar';

  const formattedExpiry = invitation.expiresAt
    ? new Date(invitation.expiresAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const handleContactWhatsApp = () => {
    const text = isRtl
      ? `مرحباً فريدا، أود الاستفسار عن تجديد صلاحية دعوتي (${invitation.eventDetails.eventTitle || invitation.title}) - كود: ${invitation.slug || invitation.id}`
      : `Hello FRIDA, I would like to renew the validity period of my invitation (${invitation.eventDetails.eventTitle || invitation.title}) - ID: ${invitation.slug || invitation.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#121212] text-[#F7F4EE] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-[#171717]/95 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-playfair text-xl tracking-[0.2em] font-bold text-[#F7F4EE]">
            FRIDA
          </span>
          <span className="text-[10px] text-[#B99A65] border border-[#B99A65]/40 px-2 py-0.5 rounded-full font-mono">
            ROYAL
          </span>
        </div>

        {/* Expired Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#1F1E1B] border border-red-500/40 flex items-center justify-center shadow-lg">
          <Clock className="w-9 h-9 text-red-400" />
        </div>

        {/* Status Badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border bg-red-500/15 border-red-500/40 text-red-400 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>{isRtl ? 'انتهت صلاحية الدعوة (30 يوماً)' : 'Invitation Expired (30-Day Limit)'}</span>
          </span>
        </div>

        {/* Details Box */}
        <div className="space-y-3">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تم إغلاق وأرشفة هذه الدعوة' : 'This Invitation Has Been Archived'}
          </h1>

          <div className="p-3.5 bg-[#1F1E1B] rounded-2xl border border-[#333] text-xs space-y-1">
            <span className="text-[#8D8A84] block text-[11px]">
              {isRtl ? 'اسم المناسبة:' : 'Event:'}
            </span>
            <span className="font-bold text-[#F7F4EE] text-sm block">
              {invitation.title || invitation.eventDetails.eventTitle}
            </span>
            {formattedExpiry && (
              <span className="text-[11px] text-red-400 font-mono block pt-1">
                {isRtl ? `انتهت الصلاحية بتاريخ: ${formattedExpiry}` : `Expired on: ${formattedExpiry}`}
              </span>
            )}
          </div>

          <p className="text-xs text-[#8D8A84] leading-relaxed pt-1">
            {isRtl
              ? 'حفاظاً على خصوصية وأمان بيانات أصحاب الحفل والضيوف، تنتهي صلاحية رابط الدعوة وبوابة المضيف تلقائياً بعد مرور 30 يوماً من تاريخ التفعيل ولا يمكن فتحها مرة أخرى إلا بعد التجديد من قِبل الإدارة.'
              : 'For privacy and security reasons, active invitation links and host portals automatically expire 30 days after activation.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleContactWhatsApp}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Phone className="w-4 h-4" />
            <span>{isRtl ? 'طلب تجديد الصلاحية عبر الواتساب 📱' : 'Request Validity Extension on WhatsApp'}</span>
          </button>

          <button
            onClick={() => {
              if (onGoHome) onGoHome();
              else window.location.href = '/';
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#1F1E1B] border border-[#333] text-[#F7F4EE] hover:text-[#B99A65] hover:border-[#B99A65] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{isRtl ? 'العودة للصفحة الرئيسية' : 'Back to Home'}</span>
          </button>
        </div>

        {/* Security Notice */}
        <div className="pt-2 border-t border-[#2A2722] text-[10px] text-[#666] flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>
            {isRtl
              ? 'حماية أمنية مشددة: تم إلغاء كافة صلاحيات الدخول وروابط العرض تلقائياً.'
              : 'Security enforcement: Access credentials and preview links are revoked.'}
          </span>
        </div>
      </div>
    </div>
  );
};
