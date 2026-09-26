import React from 'react';
import { Lock, Clock, XCircle, AlertTriangle, Phone, ArrowRight, ArrowLeft, Home, Sparkles } from 'lucide-react';
import { InvitationData, Language } from '../types';

interface PendingApprovalScreenProps {
  invitation: InvitationData;
  currentLang: Language;
  onOpenPricing?: () => void;
  onGoHome?: () => void;
}

export const PendingApprovalScreen: React.FC<PendingApprovalScreenProps> = ({
  invitation,
  currentLang,
  onOpenPricing,
  onGoHome,
}) => {
  const isRtl = currentLang === 'ar';
  const status = invitation.status;

  const getStatusDetails = () => {
    switch (status) {
      case 'pending_approval':
        return {
          icon: <Clock className="w-8 h-8 text-amber-400" />,
          title: isRtl ? 'الدعوة بانتظار تأكيد الدفع والاعتماد ⏳' : 'Pending Payment & Admin Approval ⏳',
          badgeText: isRtl ? 'قيد المراجعة والاعتماد' : 'Pending Admin Approval',
          badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
          description: isRtl
            ? 'تم استلام طلب هذه الدعوة، وهي حالياً قيد مراجعة وتأكيد تحويل فودافون كاش من قبل إدارة الموقع. ستصبح متاحة ومباشرة لجميع المدعوين فور الموافقة عليها.'
            : 'This invitation is pending payment verification via Vodafone Cash. It will become live for guests once approved by management.',
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-8 h-8 text-red-400" />,
          title: isRtl ? 'الدعوة غير مفعلة (تم رفض الطلب) ✕' : 'Invitation Not Active (Rejected) ✕',
          badgeText: isRtl ? 'طلب مرفوض' : 'Order Rejected',
          badgeClass: 'bg-red-500/15 border-red-500/40 text-red-400',
          description: isRtl
            ? 'تم رفض طلب نشر هذه الدعوة لعدم اكتمال التحويل أو عدم تطابق كود العملية. يرجى التواصل مع الإدارة أو إعادة الدفع لتفعيلها.'
            : 'This invitation order was rejected. Please contact support or retry Vodafone Cash payment to activate.',
        };
      default:
        return {
          icon: <Lock className="w-8 h-8 text-[#B99A65]" />,
          title: isRtl ? 'الدعوة مقفلة وغير منشورة 🔒' : 'Invitation Locked & Unpublished 🔒',
          badgeText: isRtl ? 'مسودة غير مفعلة' : 'Unpublished Draft',
          badgeClass: 'bg-[#B99A65]/15 border-[#B99A65]/40 text-[#B99A65]',
          description: isRtl
            ? 'هذه الدعوة ما زالت في مرحلة الإعداد ولم يتم دفع رسوم تفعيلها عبر فودافون كاش بعد. لا يمكن للضيوف استعراض تفاصيلها حتى يتم تأكيد الدفع.'
            : 'This invitation is currently unpublished. It must be paid via Vodafone Cash and approved before guests can access it.',
        };
    }
  };

  const statusInfo = getStatusDetails();

  const handleContactWhatsApp = () => {
    const text = isRtl
      ? `مرحباً، أود الاستفسار عن تفعيل دعوتي (${invitation.eventDetails.eventTitle || invitation.title}) - كود الدعوة: ${invitation.slug || invitation.id}`
      : `Hello, inquiring about my invitation activation (${invitation.eventDetails.eventTitle || invitation.title}) - ID: ${invitation.slug || invitation.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#121212] text-[#F7F4EE] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
    >
      {/* Background ambient luxury lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B99A65]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-[#171717]/95 border border-[#B99A65]/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2">
          <span className="font-playfair text-xl tracking-[0.2em] font-bold text-[#F7F4EE]">
            FRIDA
          </span>
          <span className="text-[10px] text-[#B99A65] border border-[#B99A65]/40 px-2 py-0.5 rounded-full font-mono">
            ROYAL
          </span>
        </div>

        {/* Lock / Status Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-[#1F1E1B] border border-[#B99A65]/30 flex items-center justify-center shadow-lg">
          <div className="absolute inset-0 rounded-3xl bg-[#B99A65]/10 animate-ping opacity-25" />
          {statusInfo.icon}
        </div>

        {/* Status Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeClass}`}>
            <Lock className="w-3.5 h-3.5" />
            <span>{statusInfo.badgeText}</span>
          </span>
        </div>

        {/* Title & Invitation Target Info */}
        <div className="space-y-2">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
            {statusInfo.title}
          </h1>

          <div className="p-3 bg-[#1F1E1B] rounded-2xl border border-[#333] text-xs">
            <span className="text-[#8D8A84] block text-[11px] mb-1">
              {isRtl ? 'اسم المناسبة / العروسين:' : 'Occasion / Event Title:'}
            </span>
            <span className="font-bold text-[#F7F4EE] text-sm">
              {invitation.title || invitation.eventDetails.eventTitle}
            </span>
            {invitation.eventDetails.hostNames && (
              <span className="text-xs text-[#B99A65] block mt-0.5">
                {invitation.eventDetails.hostNames}
              </span>
            )}
          </div>

          <p className="text-xs text-[#8D8A84] leading-relaxed pt-2">
            {statusInfo.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E60000] via-[#ff3333] to-[#E60000] text-white font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(230,0,0,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>{isRtl ? 'الدفع وتأكيد التحويل عبر فودافون كاش 💳' : 'Pay via Vodafone Cash to Activate'}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleContactWhatsApp}
              className="flex-1 py-3 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{isRtl ? 'تواصل مع الإدارة' : 'Contact Support'}</span>
            </button>

            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex-1 py-3 px-3 rounded-xl bg-[#1F1E1B] border border-[#333] text-[#F7F4EE] hover:text-[#B99A65] hover:border-[#B99A65] font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>{isRtl ? 'الرئيسية' : 'Home'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="pt-2 border-t border-[#2A2722] text-[10px] text-[#666] flex items-center justify-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500/60" />
          <span>
            {isRtl
              ? 'تتم حماية محتوى الدعوة والبيانات الخاصة حتى اعتماد الطلب بنجاح.'
              : 'Invitation details and RSVPs remain protected until payment approval.'}
          </span>
        </div>
      </div>
    </div>
  );
};
