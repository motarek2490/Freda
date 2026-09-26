import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, QrCode, ExternalLink, UserCheck, Sparkles, MessageSquare, Lock } from 'lucide-react';
import { InvitationData, Language } from '../types';
import { useTranslation } from '../data/translations';
import { getInvitationUrl } from '../lib/urlUtils';
import { generateQrCodeDataUrl } from '../lib/qrHelper';

interface ShareModalProps {
  invitation: InvitationData | null;
  currentLang: Language;
  onClose: () => void;
  onOpenPricing?: (invitation: InvitationData) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  invitation,
  currentLang,
  onClose,
  onOpenPricing,
}) => {
  if (!invitation) return null;

  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';

  // If invitation is NOT published yet, block sharing completely
  if (invitation.status !== 'published') {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
      >
        <div className="relative w-full max-w-md bg-[#171717] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl text-center space-y-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'المشاركة غير متاحة بعد 🔒' : 'Sharing is Locked'}
            </h3>
            <p className="text-xs text-[#8D8A84] leading-relaxed">
              {isRtl
                ? 'لا يمكنك مشاركة رابط الدعوة أو إرساله للضيوف حتى يتم تأكيد تحويل فودافون كاش واعتماد الدعوة من قبل الإدارة.'
                : 'This invitation cannot be shared until it is approved by management following Vodafone Cash payment.'}
            </p>
          </div>

          <div className="p-3 bg-[#1F1E1B] rounded-2xl border border-[#333] text-xs">
            <span className="text-[#8D8A84] block mb-1">
              {isRtl ? 'حالة الدعوة الحالية:' : 'Current Status:'}
            </span>
            <span className="font-bold text-amber-400">
              {invitation.status === 'pending_approval'
                ? isRtl ? '⏳ قيد مراجعة وتأكيد الدفع' : 'Pending Payment Approval'
                : invitation.status === 'rejected'
                ? isRtl ? '✕ تم رفض الطلب (يرجى مراجعة الإدارة)' : 'Rejected'
                : isRtl ? 'مسودة (لم يتم الدفع بعد)' : 'Draft (Unpaid)'}
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {onOpenPricing && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPricing(invitation);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E60000] to-[#ff3333] text-white font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(230,0,0,0.4)] transition-all cursor-pointer"
              >
                {isRtl ? 'الدفع وتأكيد التحويل عبر فودافون كاش 💳' : 'Pay via Vodafone Cash'}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl border border-[#333] text-xs text-[#8D8A84] hover:text-[#F7F4EE] transition-colors cursor-pointer"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'general' | 'personalized'>('general');
  const [guestName, setGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const shareSlug = invitation.slug || invitation.id;
  const baseUrl = getInvitationUrl(shareSlug, window.location.origin);
  
  // If personalized, append ?guest=...
  const activeUrl =
    activeTab === 'personalized' && guestName.trim()
      ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}guest=${encodeURIComponent(guestName.trim())}`
      : baseUrl;

  useEffect(() => {
    generateQrCodeDataUrl(activeUrl).then(setQrDataUrl);
  }, [activeUrl]);

  // Formatted invitation announcement text for WhatsApp & Telegram
  const invitationMessageText = isRtl
    ? `✨ *دعوة خاصة لحضور ${invitation.eventDetails.eventTitle}* ✨\n\n` +
      (activeTab === 'personalized' && guestName.trim()
        ? `عزيزنا / *${guestName.trim()}*،\n`
        : '') +
      `بتشرف عائلة (${invitation.eventDetails.hostNames}) بدعوتك لمشاركتنا فرحة العمر.\n\n` +
      `📅 *الميعاد:* ${invitation.eventDetails.eventDate} الساعة ${invitation.eventDetails.eventTime}\n` +
      `📍 *المكان:* ${invitation.eventDetails.venueName}\n\n` +
      `💌 *افتح ظرف دعوتك الملكي وسجّل حضورك من هنا:*\n` +
      `${activeUrl}`
    : `✨ *Cordially Invited: ${invitation.eventDetails.eventTitle}* ✨\n\n` +
      (activeTab === 'personalized' && guestName.trim()
        ? `Dear *${guestName.trim()}*,\n`
        : '') +
      `The families of (${invitation.eventDetails.hostNames}) request the pleasure of your company on our celebratory day.\n\n` +
      `📅 *Date:* ${invitation.eventDetails.eventDate} at ${invitation.eventDetails.eventTime}\n` +
      `📍 *Venue:* ${invitation.eventDetails.venueName}\n\n` +
      `💌 *View Interactive Invitation & Confirm RSVP:*\n` +
      `${activeUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(invitationMessageText);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(invitationMessageText);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#171717] border border-[#B99A65] rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 text-center my-4 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65] mx-auto shadow-[0_0_15px_rgba(185,154,101,0.3)]">
          <Share2 className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
            {isRtl ? 'مشاركة وإرسال الدعوة للمدعوين' : 'Share & Distribute Invitation'}
          </h3>
          <p className="text-xs text-[#8D8A84] mt-1">
            {invitation.title || invitation.eventDetails.eventTitle}
          </p>
        </div>

        {/* Mode Selector Tabs: General vs Personalized */}
        <div className="flex rounded-2xl bg-[#1F1E1B] p-1 border border-[#333]">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-[#B99A65] text-[#171717] shadow-md font-bold'
                : 'text-[#8D8A84] hover:text-[#F7F4EE]'
            }`}
          >
            {isRtl ? '🔗 رابط عام لكل المعازيم' : '🔗 General Public Link'}
          </button>
          <button
            onClick={() => setActiveTab('personalized')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'personalized'
                ? 'bg-[#B99A65] text-[#171717] shadow-md font-bold'
                : 'text-[#8D8A84] hover:text-[#F7F4EE]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? '👑 تخصيص باسم الضيف (VIP)' : '👑 Guest VIP Name'}</span>
          </button>
        </div>

        {/* Personalized Guest Input */}
        {activeTab === 'personalized' && (
          <div className="bg-[#1F1E1B] border border-[#B99A65]/40 rounded-2xl p-3.5 text-right space-y-2 animate-in fade-in">
            <label className="block text-xs font-semibold text-[#B99A65]">
              {isRtl ? 'اكتب اسم الضيف الذي سترسل له:' : 'Enter Guest Name:'}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={isRtl ? 'مثال: سعادة المستشار أحمد المنصور وعائلته' : 'e.g., Mr. David & Mrs. Sarah Jenkins'}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
              />
              <UserCheck className="w-4 h-4 text-[#8D8A84] absolute left-3 top-2.5 rtl:right-auto" />
            </div>
            <p className="text-[11px] text-[#8D8A84] font-light">
              {isRtl
                ? '💡 سيظهر اسم الضيف بشكل فخم على الظرف المغلق، وسيُملأ اسمه تلقائياً في استمارة الحضور (RSVP)!'
                : '💡 The guest name will appear gilded on the envelope and auto-fill into their RSVP form!'}
            </p>
          </div>
        )}

        {/* Link Copy Box */}
        <div className="flex items-center gap-2 p-1.5 bg-[#1F1E1B] border border-[#333] rounded-2xl">
          <input
            type="text"
            readOnly
            value={activeUrl}
            className="flex-grow bg-transparent px-3 py-1.5 text-xs text-[#F7F4EE] focus:outline-none select-all"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-[#B99A65] text-[#171717] text-xs font-bold rounded-xl hover:bg-[#d6bd91] transition-all cursor-pointer flex items-center gap-1"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{isRtl ? 'نسخ الرابط' : 'Copy'}</span>
          </button>
        </div>

        {/* Action Buttons: WhatsApp + Copy Message + Open Test */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleWhatsApp}
            className="w-full py-3 rounded-2xl bg-[#25D366] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all cursor-pointer shadow-lg"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {isRtl
                ? activeTab === 'personalized' && guestName.trim()
                  ? `إرسال الدعوة لـ (${guestName.trim()}) عبر واتساب`
                  : 'مشاركة الدعوة عبر واتساب'
                : 'Share Invitation via WhatsApp'}
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyMessage}
              className="py-2.5 px-3 rounded-xl bg-[#1F1E1B] border border-[#333] hover:border-[#B99A65] text-[#E9E1D5] hover:text-[#B99A65] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5" />}
              <span>{copiedMessage ? (isRtl ? 'تم نسخ النص!' : 'Copied!') : (isRtl ? 'نسخ رسالة الترحيب' : 'Copy Message')}</span>
            </button>

            <a
              href={activeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-[#1F1E1B] border border-[#333] hover:border-[#B99A65] text-[#E9E1D5] hover:text-[#B99A65] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isRtl ? 'معاينة كضيف' : 'Preview as Guest'}</span>
            </a>
          </div>

          {/* QR Code preview */}
          <div className="p-3 bg-[#FFFFFF] rounded-2xl inline-block border border-[#B99A65]/30 shadow-md">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-28 h-28 mx-auto"
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center text-xs text-zinc-400">Loading...</div>
            )}
            <span className="text-[10px] text-[#171717] font-semibold block mt-1">
              {isRtl ? 'رمز QR خاص بالدعوة' : 'Invitation QR Code'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
