import React, { useState } from 'react';
import {
  KeyRound,
  Copy,
  Check,
  Share2,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Lock,
  Crown,
  Sparkles,
  X,
  Phone,
  Link,
  QrCode,
} from 'lucide-react';
import { InvitationData, OrderData, Language } from '../types';
import { getInvitationUrl, getPortalUrl } from '../lib/urlUtils';

interface ClientHandoverModalProps {
  order?: OrderData | null;
  invitation?: InvitationData | null;
  currentLang: Language;
  onClose: () => void;
}

export const ClientHandoverModal: React.FC<ClientHandoverModalProps> = ({
  order,
  invitation,
  currentLang,
  onClose,
}) => {
  const isRtl = currentLang === 'ar';

  const clientName = order?.customerName || invitation?.eventDetails?.groomName || 'العميل الكريم';
  const clientPhone = order?.customerPhone || order?.vodafoneCashSender || invitation?.hostUsername || '';
  const invIdOrSlug = invitation?.slug || invitation?.id || order?.invitationId || '';

  // Credentials
  const username = invitation?.hostUsername || clientPhone || 'client';
  const password = invitation?.hostAccessCode || order?.hostCredentials?.accessCode || order?.hostCredentials?.password || '••••••••';
  
  // Expiry calculation (30 days)
  const expirationDate = invitation?.expiresAt || order?.expiresAt || (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString();
  })();

  const formattedExpiry = new Date(expirationDate).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicLink = getInvitationUrl(invIdOrSlug, origin);
  const portalLink = getPortalUrl(invIdOrSlug, origin);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Luxury Formatted WhatsApp Message
  const fullWhatsAppMessage = isRtl
    ? `✨ *مرحباً بك ${clientName} في فريدا (FRIDA ROYAL)* ✨
تهانينا الخالصة! تم تأكيد وتفعيل دعوتكم الملكية الفاخرة بنجاح 👑

═══════════════════════
🔗 *رابط الدعوة المباشر للمعازيم:*
${publicLink}
*(يمكنكم إرسال هذا الرابط لجميع ضيوفكم الكرام لفتح الدعوة التفاعلية وتأكيد الحضور)*

═══════════════════════
🚪 *رابط بوابة المضيف (لوحة تحكمك لمتابعة المعازيم):*
${portalLink}

👤 *اسم المستخدم (Username):* ${username}
🔑 *كلمة المرور / كود الدخول:* ${password}

⏳ *صلاحية الدعوة والبوابة:*
صالحة لمدة 30 يوماً حتى: ${formattedExpiry}
═══════════════════════

💐 *مميزات بوابتكم الملكية:*
✓ متابعة تأكيدات الحضور (RSVP) لحظة بلحظة
✓ استقبال وقراءة تهاني وتبريكات الضيوف في سجل الذكريات
✓ تصدير كشف المعازيم والحضور إلى ملف Excel بنقرة واحدة
✓ إنشاء روابط مخصصة بأسماء كبار الشخصيات (VIP)

نرجو لكم ولأحبابكم فرحة دائمة وليلة من أجمل ليالي العمر! 💫`
    : `✨ *Welcome ${clientName} to FRIDA ROYAL* ✨
Congratulations! Your royal wedding invitation has been approved & activated 👑

═══════════════════════
🔗 *Public Invitation Link for Guests:*
${publicLink}

═══════════════════════
🚪 *Host Management Portal:*
${portalLink}

👤 *Username:* ${username}
🔑 *Password / Access Code:* ${password}

⏳ *Validity:* 30 Days (Valid until: ${formattedExpiry})
═══════════════════════

Wishing you a lifetime of joy and happiness! 💫`;

  const handleSendWhatsApp = () => {
    const cleanPhone = clientPhone.replace(/[^0-9+]/g, '');
    const encoded = encodeURIComponent(fullWhatsAppMessage);
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-lg">
            <Crown className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'تم الاعتماد والتفعيل بنجاح (صالح 30 يوماً)' : 'Approved & Activated (30 Days Validity)'}</span>
          </div>
          <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'بيانات وروابط تسليم الدعوة للعميل' : 'Client Handover Credentials & Links'}
          </h2>
          <p className="text-xs text-[#8D8A84]">
            {isRtl
              ? `تم إنشاء حساب المضيف ورابط الدعوة لـ "${clientName}". يمكنك نسخ البيانات أو إرسالها له مباشرة عبر الواتساب.`
              : `Handover credentials for "${clientName}". Send directly via WhatsApp or copy below.`}
          </p>
        </div>

        {/* Credentials Box */}
        <div className="bg-[#1F1E1B] border border-[#B99A65]/40 rounded-2xl p-5 space-y-4 shadow-inner">
          {/* Validity Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#171717] border border-[#333] text-xs">
            <span className="flex items-center gap-2 text-[#8D8A84]">
              <Clock className="w-4 h-4 text-[#B99A65]" />
              <span>{isRtl ? 'فترة الصلاحية والتفعيل:' : 'Validity Period:'}</span>
            </span>
            <span className="font-bold text-[#B99A65]">
              {isRtl ? `30 يوماً (حتى ${formattedExpiry})` : `30 Days (Until ${formattedExpiry})`}
            </span>
          </div>

          {/* Public Link For Guests */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-[#B99A65]" />
                <span>{isRtl ? '1. رابط الدعوة المباشر للمعازيم (الضيوف):' : '1. Public Guest Invitation Link:'}</span>
              </span>
              <a
                href={publicLink}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#B99A65] hover:underline flex items-center gap-1"
              >
                <span>{isRtl ? 'فتح وتجربة' : 'Open'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicLink}
                className="flex-1 bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs font-mono text-[#F7F4EE] select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(publicLink, 'public_link')}
                className="px-3.5 py-2 rounded-xl bg-[#2A2722] border border-[#444] text-[#F7F4EE] hover:text-[#B99A65] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {copiedField === 'public_link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isRtl ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Portal Link & Credentials */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isRtl ? '2. رابط بوابة المضيف (لوحة تحكم العميل لمتابعة المعازيم):' : '2. Host Portal Link:'}</span>
              </span>
              <a
                href={portalLink}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#B99A65] hover:underline flex items-center gap-1"
              >
                <span>{isRtl ? 'دخول البوابة' : 'Open Portal'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={portalLink}
                className="flex-1 bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs font-mono text-[#F7F4EE] select-all"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(portalLink, 'portal_link')}
                className="px-3.5 py-2 rounded-xl bg-[#2A2722] border border-[#444] text-[#F7F4EE] hover:text-[#B99A65] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {copiedField === 'portal_link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isRtl ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Username & Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-[#171717] p-3 rounded-xl border border-[#333] space-y-1">
              <span className="text-[11px] text-[#8D8A84] flex items-center gap-1">
                <User className="w-3 h-3 text-[#B99A65]" />
                <span>{isRtl ? 'اسم المستخدم / هاتف العميل:' : 'Username / Phone:'}</span>
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#F7F4EE] text-sm">{username}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(username, 'username')}
                  className="p-1 text-[#8D8A84] hover:text-[#B99A65] cursor-pointer"
                >
                  {copiedField === 'username' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="bg-[#171717] p-3 rounded-xl border border-[#333] space-y-1">
              <span className="text-[11px] text-[#8D8A84] flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-[#B99A65]" />
                <span>{isRtl ? 'كلمة المرور / كود الدخول (PIN):' : 'Password / Access Code:'}</span>
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 text-sm tracking-wider">{password}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(password, 'password')}
                  className="p-1 text-[#8D8A84] hover:text-[#B99A65] cursor-pointer"
                >
                  {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: WhatsApp & Copy Full Message */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-extrabold text-sm uppercase tracking-wider hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xl"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>
              {isRtl
                ? `إرسال البيانات فوراً للعميل عبر الواتساب (${clientPhone || 'واتساب'}) 📱`
                : 'Send Credentials Directly via WhatsApp 📱'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(fullWhatsAppMessage, 'full_message')}
            className="w-full py-3 px-4 rounded-xl bg-[#2A2722] border border-[#444] text-[#F7F4EE] hover:text-[#B99A65] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            {copiedField === 'full_message' ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">{isRtl ? '✓ تم نسخ كامل رسالة التفعيل بنجاح!' : '✓ Message Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{isRtl ? 'نسخ كامل نص الرسالة والبيانات 📋' : 'Copy Full Formatted Message 📋'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
