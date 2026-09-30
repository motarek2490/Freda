import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Sparkles,
  Phone,
  Copy,
  CheckCircle,
  Crown,
  ShieldCheck,
  Send,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  MessageCircle,
} from 'lucide-react';
import { Language, InvitationData, OrderData, AdminSettings } from '../types';
import { saveOrderCloud, saveInvitationCloud, getAdminSettingsCloud, DEFAULT_ADMIN_SETTINGS } from '../lib/firestoreService';
import { saveInvitation } from '../lib/storage';
import { ensureAnonymousAuth } from '../lib/firebase';
import { BRAND_NAME, BRAND_NAME_AR } from '../config/brand';
import { trackBeginCheckout, trackPurchase } from '../lib/analytics';

interface PricingModalProps {
  currentLang?: Language;
  invitation?: InvitationData | null;
  onClose: () => void;
  onOrderSubmitted?: (order: OrderData) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  currentLang = 'ar',
  invitation,
  onClose,
  onOrderSubmitted,
}) => {
  const isRtl = currentLang === 'ar';

  const [selectedTier, setSelectedTier] = useState<'basic' | 'royal_vip' | 'diamond'>('royal_vip');
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Form Fields
  const [customerName, setCustomerName] = useState(
    invitation ? invitation.eventDetails.hostNames || '' : ''
  );
  const [customerPhone, setCustomerPhone] = useState('');
  const [vodafoneCashSender, setVodafoneCashSender] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');

  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<OrderData | null>(null);

  // Load Admin Settings (Vodafone cash number and prices)
  useEffect(() => {
    getAdminSettingsCloud()
      .then((settings) => {
        if (settings) {
          setAdminSettings(settings);
        } else {
          setAdminSettings(null);
        }
      })
      .catch(() => setAdminSettings(null))
      .finally(() => setLoadingSettings(false));
  }, []);

  const hasValidVodafoneNumber =
    Boolean(adminSettings?.vodafoneCashNumber) &&
    adminSettings?.vodafoneCashNumber !== '01012345678' &&
    adminSettings?.vodafoneCashNumber !== '010XXXXXXXX';

  const currentPrices = {
    basic: adminSettings?.basicPriceEGP ?? 0,
    royal_vip: adminSettings?.royalPriceEGP ?? 0,
    diamond: adminSettings?.diamondPriceEGP ?? 0,
  };

  const plans = [
    {
      id: 'basic' as const,
      name: isRtl ? 'الباقة الأساسية' : 'Essential Starter',
      price: currentPrices.basic,
      currency: 'ج.م',
      period: isRtl ? 'لحفل عائلي هادئ' : 'Intimate Celebrations',
      features: isRtl
        ? [
            'بطاقة دعوة تفاعلية كاملة مع عد تنازلي',
            'لوكيشن القاعة على خرائط Google وتوجيه فوري',
            'تسجيل حضور حتى 50 معزوم في لوحة تحكمك',
            'رابط شغال ومتاح لمدة 30 يوم',
          ]
        : [
            'Official interactive invitation',
            'Countdown & Google Maps location',
            'Up to 50 RSVP confirmations',
            '30-day link availability',
          ],
    },
    {
      id: 'royal_vip' as const,
      name: isRtl ? 'الباقة الملكية (VIP)' : 'Royal VIP Celebration',
      price: currentPrices.royal_vip,
      currency: 'ج.م',
      recommended: true,
      period: isRtl ? 'الأنسب لأفراح القاعات الكبرى — الأكثر طلباً' : 'Most Popular for Ballrooms',
      features: isRtl
        ? [
            'كل مميزات الباقة الأساسية',
            'روابط مخصصة باسم كل معزوم (VIP)',
            'فك ختم الشمع الملكي وموسيقى تصويرية في الخلفية',
            'تسجيل وتأكيد حضور (RSVP) غير محدود',
            'كشف معازيم إكسل قابل للتنزيل فوراً لأمن القاعة',
            'دفتر تبريكات رقمي وكارت صورة للمشاركة عبر واتساب',
          ]
        : [
            'All Essential features included',
            'Personalized Guest VIP Name links',
            'Ambient background music & royal envelope',
            'Unlimited RSVP guest confirmations',
            'Excel export & printable security checklist',
            'Guestbook wishes board & card image export',
          ],
    },
    {
      id: 'diamond' as const,
      name: isRtl ? 'الباقة الماسية' : 'Diamond VIP Signature',
      price: currentPrices.diamond,
      currency: 'ج.م',
      period: isRtl ? 'خدمة مخصصة بالكامل' : 'Bespoke Custom',
      features: isRtl
        ? [
            'كل مميزات الباقة الملكية',
            'رابط خاص باسم العروسين بدون أي علامات إضافية',
            'كود QR شخصي لكل مدعو للدخول السريع',
            'تنسيق وقص مقطع الزفة أو الموسيقى الخاصة بمعرفتنا',
            'متابعة ومساعد شخصي لتجهيز وتنسيق دعوتك خطوة بخطوة',
          ]
        : [
            'Everything in Royal VIP',
            'Dedicated Custom Domain / Link',
            'Automated QR Code passes for guests',
            'Custom music arrangement or audio track',
            '24/7 dedicated concierge assistant',
          ],
    },
  ];

  const currentPlan = plans.find((p) => p.id === selectedTier) || plans[1];

  // Track begin_checkout event on modal mount & tier change
  useEffect(() => {
    trackBeginCheckout(selectedTier, currentPlan.price);
  }, [selectedTier, currentPlan.price]);

  const handleCopyNumber = () => {
    if (!adminSettings?.vodafoneCashNumber) return;
    navigator.clipboard.writeText(adminSettings.vodafoneCashNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const generateOrderId = (): string => {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return 'ORD-' + crypto.randomUUID().split('-')[0].toUpperCase();
      }
    } catch {}
    return 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !vodafoneCashSender.trim()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    const orderId = generateOrderId();

    try {
      // 0. Ensure user has an active Firebase Auth session (with short timeout so it never blocks)
      let user: any = null;
      try {
        user = await Promise.race([
          ensureAnonymousAuth(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
        ]);
      } catch {}

      // 1. Prepare and save invitation to local storage & cloud
      let targetInv: InvitationData;
      if (invitation) {
        targetInv = {
          ...invitation,
          status: 'pending_approval',
          planTier: selectedTier,
          hostUsername: customerPhone.trim(),
          ownerUid: user?.uid || invitation.ownerUid || `anon-${Date.now()}`,
        };
      } else {
        targetInv = {
          id: `inv-${crypto.randomUUID()}`,
          templateId: 'frida-royal-001',
          layoutType: 'royal',
          title: 'دعوة جديدة',
          language: currentLang || 'ar',
          themeStyle: 'luxury',
          customColors: { primary: '#B99A65', background: '#0F0E0D', text: '#F7F4EE', accent: '#D4AF37', bg: '#0F0E0D', cardBg: '#1A1918' },
          customFont: 'font-amiri',
          eventDetails: {
            groomName: customerName.trim(),
            brideName: '',
            hostNames: customerName.trim(),
            eventTitle: 'مناسبة خاصة',
            eventDate: new Date().toISOString().split('T')[0],
            eventTime: '20:00',
            venueName: 'قاعة الاحتفالات',
            address: 'القاهرة، مصر',
          },
          status: 'pending_approval',
          ownerUid: user?.uid || `anon-${Date.now()}`,
          createdAt: new Date().toISOString(),
          slug: `inv-${Date.now()}`,
          planTier: selectedTier,
          hostUsername: customerPhone.trim(),
        };
      }

      // Save invitation locally first
      saveInvitation(targetInv);

      // Attempt cloud sync for invitation (non-blocking)
      try {
        await Promise.race([
          saveInvitationCloud(targetInv),
          new Promise((resolve) => setTimeout(resolve, 2500))
        ]);
      } catch (cloudErr) {
        console.warn('Cloud invitation sync deferred:', cloudErr);
      }

      // 2. Prepare order data
      const finalOrder: OrderData = {
        id: orderId,
        invitationId: targetInv.id,
        invitationTitle: targetInv.title || targetInv.eventDetails?.eventTitle || 'دعوة خاصة',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        vodafoneCashSender: vodafoneCashSender.trim(),
        transactionReference: transactionRef.trim() || undefined,
        notes: notes.trim() || undefined,
        amount: currentPlan.price,
        currency: 'EGP',
        planTier: selectedTier,
        status: 'pending',
        createdAt: new Date().toISOString(),
        invitationSnapshot: JSON.parse(JSON.stringify(targetInv)),
      };

      // Save order locally in localStorage immediately
      try {
        const storedOrders = JSON.parse(localStorage.getItem('frida_orders') || '[]');
        localStorage.setItem('frida_orders', JSON.stringify([finalOrder, ...storedOrders]));
      } catch {}

      // Attempt cloud order sync (non-blocking)
      try {
        await Promise.race([
          saveOrderCloud(finalOrder),
          new Promise((resolve) => setTimeout(resolve, 2500))
        ]);
      } catch (orderCloudErr) {
        console.warn('Cloud order sync deferred, stored locally:', orderCloudErr);
      }

      // Trigger analytics purchase event (Zero-PII)
      try {
        trackPurchase(orderId, selectedTier, currentPlan.price);
      } catch {}

      // Successfully saved and confirmed
      setOrderSuccess(finalOrder);
      if (onOrderSubmitted) {
        onOrderSubmitted(finalOrder);
      }
    } catch (err: any) {
      console.error('Error submitting order (fallback triggered):', err);
      // Even in case of any unexpected exception, ensure order success state is displayed with local fallback
      const fallbackOrder: OrderData = {
        id: orderId,
        invitationId: invitation?.id || `inv-${Date.now()}`,
        invitationTitle: invitation?.title || 'دعوة خاصة',
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        vodafoneCashSender: vodafoneCashSender.trim(),
        amount: currentPlan.price,
        currency: 'EGP',
        planTier: selectedTier,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setOrderSuccess(fallbackOrder);
      if (onOrderSubmitted) {
        onOrderSubmitted(fallbackOrder);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppConfirmation = () => {
    if (!orderSuccess) return;
    const whatsappNum = adminSettings?.contactWhatsapp || '201012345678';
    const msg = encodeURIComponent(
      `مرحباً، قمت بتحويل مبلغ ${orderSuccess.amount} ج.م عبر فودافون كاش لطلب تفعيل دعوتي في ${BRAND_NAME_AR}:\n- رقم الطلب: ${orderSuccess.id}\n- اسم العميل: ${orderSuccess.customerName}\n- الرقم المحول منه: ${orderSuccess.vodafoneCashSender}\n- الباقة: ${orderSuccess.planTier}\nيرجى مراجعة التحويل واعتماد الدعوة.`
    );
    const whatsappUrl = `https://wa.me/${whatsappNum}?text=${msg}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenSupportWhatsApp = () => {
    const whatsappNum = adminSettings?.contactWhatsapp || '201012345678';
    const msg = encodeURIComponent(
      `مرحباً، أود الاستفسار عن الدفع عبر فودافون كاش لتفعيل دعوتي في ${BRAND_NAME_AR} (باقة: ${currentPlan.name} - ${currentPlan.price} ج.م).`
    );
    window.open(`https://wa.me/${whatsappNum}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-4 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {orderSuccess ? (
          /* Success Screen after Order Submission */
          <div className="text-center py-6 space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#F7F4EE]">
                {isRtl ? 'تم استلام طلبك بنجاح!' : 'Order Received Successfully!'}
              </h3>
              <p className="text-xs sm:text-sm text-[#8D8A84] leading-relaxed">
                {isRtl
                  ? 'تم تسجيل بيانات التحويل الخاصة بك. سيقوم فريق الإدارة بمراجعة العملية وتفعيل رابط الدعوة بشكل فوري.'
                  : 'Your transfer details have been submitted. Our team will verify and activate your link shortly.'}
              </p>
            </div>

            {/* Order Card Summary */}
            <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-4 text-xs space-y-2 text-right">
              <div className="flex justify-between border-b border-[#333]/60 pb-2">
                <span className="text-[#8D8A84]">{isRtl ? 'رقم الطلب للمتابعة:' : 'Order ID:'}</span>
                <strong className="text-[#F7F4EE] font-mono text-sm">{orderSuccess.id}</strong>
              </div>
              <div className="flex justify-between border-b border-[#333]/60 pb-2">
                <span className="text-[#8D8A84]">{isRtl ? 'الباقة المختارة:' : 'Plan:'}</span>
                <span className="text-[#E9E1D5] font-semibold">{orderSuccess.planTier}</span>
              </div>
              <div className="flex justify-between border-b border-[#333]/60 pb-2">
                <span className="text-[#8D8A84]">{isRtl ? 'المبلغ المحول:' : 'Amount:'}</span>
                <strong className="text-[#B99A65]">{orderSuccess.amount} جنيه مصري</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8D8A84]">{isRtl ? 'رقم المحفظة المحول منها:' : 'Sender Wallet:'}</span>
                <strong className="text-[#F7F4EE] font-mono">{orderSuccess.vodafoneCashSender}</strong>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleOpenWhatsAppConfirmation}
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>{isRtl ? 'إرسال إشعار تأكيد عبر واتساب للإدارة فوراً' : 'Notify Admin via WhatsApp'}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-[#333] text-xs text-[#8D8A84] hover:text-[#F7F4EE] transition-colors cursor-pointer"
              >
                {isRtl ? 'إغلاق ومتابعة لوحة التحكم' : 'Close and Back to Dashboard'}
              </button>
            </div>
          </div>
        ) : (
          /* Selection & Order Form */
          <>
            {/* Header */}
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E60000]/20 border border-[#E60000] text-[#ff4d4d] text-xs font-semibold uppercase">
                <Crown className="w-3.5 h-3.5 text-[#B99A65]" />
                <span>{isRtl ? 'الدفع عبر فودافون كاش (Vodafone Cash)' : 'Pay via Vodafone Cash'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
                {isRtl ? 'اختر باقتك وقم بالدفع عبر فودافون كاش' : 'Choose Plan & Pay via Vodafone Cash'}
              </h2>
              <p className="text-xs text-[#8D8A84]">
                {isRtl
                  ? 'حوّل قيمة الباقة إلى محفظة فودافون كاش الموضحة أدناه، وسيتم تأكيد طلبك وتفعيل الرابط فوراً.'
                  : 'Transfer the package amount to our Vodafone Cash wallet and submit details for instant approval.'}
              </p>
            </div>

            {/* Pricing Tiers Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const isSelected = selectedTier === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedTier(plan.id)}
                    className={`relative rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1F1E1B] border-[#B99A65] shadow-[0_0_25px_rgba(185,154,101,0.25)] ring-2 ring-[#B99A65]/40'
                        : 'bg-[#171717] border-[#333] hover:border-[#B99A65]/50'
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#B99A65] to-[#d6bd91] text-[#171717] text-[10px] font-extrabold uppercase tracking-wider shadow">
                        {isRtl ? 'الأكثر طلباً ومبيعاً' : 'Most Popular'}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#F7F4EE]">
                          {plan.name}
                        </h3>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#B99A65] bg-[#B99A65] text-[#171717]'
                              : 'border-[#444]'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-[#F7F4EE]">
                          {plan.price}
                        </span>
                        <span className="text-xs text-[#8D8A84]">{plan.currency}</span>
                        <span className="text-[10px] text-[#8D8A84]/70 mr-2">/ {plan.period}</span>
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-[#333]/50 text-xs text-[#8D8A84]">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-[#B99A65] shrink-0 mt-0.5" />
                            <span className="text-[#E9E1D5]">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vodafone Cash Transfer Steps */}
            <div className="bg-[#1F1E1B] border border-[#E60000]/40 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#333] pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#8D8A84] flex items-center gap-1.5 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-[#ff4d4d]" />
                    <span>{isRtl ? 'رقم محفظة فودافون كاش المعتمدة للتحويل:' : 'Official Vodafone Cash Wallet:'}</span>
                  </span>

                  {hasValidVodafoneNumber ? (
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl font-mono font-bold text-[#F7F4EE] tracking-wider">
                        {adminSettings?.vodafoneCashNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="px-2.5 py-1 rounded-lg bg-[#E60000]/20 border border-[#E60000] text-[#ff4d4d] hover:bg-[#E60000] hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        {copiedNumber ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedNumber ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرقم' : 'Copy')}</span>
                      </button>
                    </div>
                  ) : (
                    /* Phase 1 Item 9: Never fallback to 01012345678; show WhatsApp button instead */
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleOpenSupportWhatsApp}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/60 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all text-xs font-semibold"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isRtl ? 'تواصل معنا عبر واتساب للحصول على رقم المحفظة الحالي فوراً' : 'Contact on WhatsApp for current wallet number'}</span>
                      </button>
                    </div>
                  )}

                  {hasValidVodafoneNumber && adminSettings?.vodafoneCashHolderName && (
                    <span className="text-[11px] text-[#8D8A84] block">
                      {adminSettings.vodafoneCashHolderName}
                    </span>
                  )}
                </div>

                <div className="bg-[#171717] border border-[#333] rounded-xl p-3 text-right space-y-1 shrink-0">
                  <span className="text-[#8D8A84] block">{isRtl ? 'المبلغ المطلوب تحويله:' : 'Required Amount:'}</span>
                  <span className="text-xl font-bold text-[#B99A65]">
                    {currentPlan.price} جنيه مصري
                  </span>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <h4 className="text-xs font-bold text-[#F7F4EE] uppercase tracking-wider">
                  {isRtl ? 'بيانات التحويل وتأكيد الطلب:' : 'Transfer Details & Confirmation:'}
                </h4>

                {submissionError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{submissionError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmissionError(null)}
                      className="text-xs underline hover:text-white"
                    >
                      {isRtl ? 'حسناً' : 'Dismiss'}
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                      {isRtl ? 'اسم صاحب الدعوة / العميل *' : 'Customer Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isRtl ? 'مثال: طارق الشناوي' : 'e.g. Tariq'}
                      className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                      {isRtl ? 'رقم هاتف العميل (واتساب للتواصل واستلام الرابط) *' : 'Customer Phone (WhatsApp) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="010xxxxxxxx"
                      className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#ff4d4d] mb-1">
                      {isRtl ? 'رقم محفظة فودافون كاش التي حولت منها *' : 'Sender Vodafone Cash Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={vodafoneCashSender}
                      onChange={(e) => setVodafoneCashSender(e.target.value)}
                      placeholder="010xxxxxxxx"
                      className="w-full bg-[#171717] border border-[#E60000]/60 rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#E60000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                      {isRtl ? 'كود العملية / الرقم المرجعي للتحويل' : 'Transaction Ref / SMS Code'}
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder={isRtl ? 'مثال: 94821038' : 'e.g. 94821038'}
                      className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                    {isRtl ? 'ملاحظات إضافية على الطلب' : 'Additional Notes'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isRtl
                        ? 'أي تفاصيل خاصة ترغب في إضافتها إلى طلب التفعيل...'
                        : 'Any special requests or instructions...'
                    }
                    className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#d6bd91] text-[#171717] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isRtl ? 'جارٍ تسجيل الطلب...' : 'Submitting Order...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isRtl ? 'تأكيد التحويل وإرسال الطلب للمراجعة' : 'Confirm Transfer & Submit Order'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto py-3 px-5 rounded-xl border border-[#333] text-xs text-[#8D8A84] hover:text-[#F7F4EE] transition-colors cursor-pointer"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
