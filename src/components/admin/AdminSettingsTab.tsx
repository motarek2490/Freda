import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Phone,
  MessageCircle,
  Globe,
  Save,
  CheckCircle,
  Loader2,
  Sparkles,
  Music,
} from 'lucide-react';
import { AdminSettings, Language } from '../../types';
import { DEFAULT_PLAN_PRICES } from '../../config/brand';

interface AdminSettingsTabProps {
  currentLang: Language;
  adminSettings: AdminSettings;
  onSaveSettings: (settings: AdminSettings) => Promise<void>;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  currentLang,
  adminSettings,
  onSaveSettings,
}) => {
  const isRtl = currentLang === 'ar';

  const [form, setForm] = useState<AdminSettings>({
    vodafoneCashNumber: adminSettings?.vodafoneCashNumber || '01012345678',
    vodafoneCashHolderName: adminSettings?.vodafoneCashHolderName || 'محفظة فودافون كاش الرسمية',
    contactWhatsapp: adminSettings?.contactWhatsapp || '201012345678',
    basicPriceEGP: adminSettings?.basicPriceEGP || DEFAULT_PLAN_PRICES.basic,
    royalPriceEGP: adminSettings?.royalPriceEGP || DEFAULT_PLAN_PRICES.royal_vip,
    diamondPriceEGP: adminSettings?.diamondPriceEGP || DEFAULT_PLAN_PRICES.diamond,
    defaultDemoTrackUrl: adminSettings?.defaultDemoTrackUrl || '',
    defaultDemoTrackName: adminSettings?.defaultDemoTrackName || '',
    websiteBackgroundMusicUrl: adminSettings?.websiteBackgroundMusicUrl || '',
    websiteBackgroundMusicName: adminSettings?.websiteBackgroundMusicName || '',
    websiteBackgroundMusicAutoplay: adminSettings?.websiteBackgroundMusicAutoplay ?? true,
    siteTitle: adminSettings?.siteTitle || 'FRIDA (فريدا) — Premium Digital Invitation Platform',
    metaDescription:
      adminSettings?.metaDescription ||
      'Create, customize, and share ultra-elegant digital invitations with FRIDA (فريدا).',
    ogTitle: adminSettings?.ogTitle || 'FRIDA (فريدا) — Premium Digital Invitation Platform',
    ogDescription: adminSettings?.ogDescription || 'Ultra-elegant digital invitations for luxury weddings and events.',
    ogImage: adminSettings?.ogImage || '/logo.jpg',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      await onSaveSettings(form);
      setFeedback(isRtl ? 'تم حفظ كافة الإعدادات في السحابة بنجاح! ✨' : 'Settings saved successfully!');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Vodafone Cash & Financial Settings */}
      <div className="bg-[#1F1E1B] rounded-3xl p-6 border border-[#2E2C28] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-playfair text-base font-bold text-[#F7F4EE]">
              {isRtl ? 'إعدادات محفظة فودافون كاش واستلام المدفوعات' : 'Vodafone Cash & Payment Settings'}
            </h4>
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'الرقم والبيانات التي تظهر للعميل في نافذة الدفع وتأكيد الحجز.' : 'Wallet details shown on checkout modal.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Vodafone Cash Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#B99A65]" />
              <span>{isRtl ? 'رقم محفظة فودافون كاش:' : 'Vodafone Cash Number:'}</span>
            </label>
            <input
              type="text"
              required
              value={form.vodafoneCashNumber}
              onChange={(e) => setForm({ ...form, vodafoneCashNumber: e.target.value })}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] font-mono focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Account Holder Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'اسم صاحب المحفظة (الذي يظهر للعميل):' : 'Wallet Holder Name:'}
            </label>
            <input
              type="text"
              required
              value={form.vodafoneCashHolderName}
              onChange={(e) => setForm({ ...form, vodafoneCashHolderName: e.target.value })}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* WhatsApp Support Number */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'رقم واتساب خدمة العملاء (مع كود الدولة):' : 'WhatsApp Support Number:'}</span>
            </label>
            <input
              type="text"
              required
              value={form.contactWhatsapp}
              onChange={(e) => setForm({ ...form, contactWhatsapp: e.target.value })}
              placeholder="201012345678"
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] font-mono focus:outline-none focus:border-[#B99A65]"
            />
          </div>
        </div>
      </div>

      {/* Pricing Packages Settings (EGP) */}
      <div className="bg-[#1F1E1B] rounded-3xl p-6 border border-[#2E2C28] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-playfair text-base font-bold text-[#F7F4EE]">
              {isRtl ? 'أسعار باقات الدعوات (بالجنيه المصري EGP)' : 'Pricing Packages (EGP)'}
            </h4>
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'تحديد أسعار الباقات التي تظهر لجميع الزوار.' : 'Set pricing plans shown to customers.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Basic */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-[#171717] border border-[#333]">
            <label className="text-xs font-bold text-[#8D8A84] block">
              {isRtl ? 'سعر الباقة الأساسية (Basic):' : 'Basic Plan Price:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={form.basicPriceEGP}
                onChange={(e) => setForm({ ...form, basicPriceEGP: Number(e.target.value) })}
                className="w-full bg-[#1F1E1B] border border-[#444] rounded-xl px-3 py-2 text-emerald-400 font-extrabold text-base font-mono focus:outline-none focus:border-[#B99A65]"
              />
              <span className="text-xs text-[#8D8A84] font-bold">EGP</span>
            </div>
          </div>

          {/* Royal */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-[#171717] border border-[#B99A65]/40 shadow-[0_0_15px_rgba(185,154,101,0.1)]">
            <label className="text-xs font-bold text-[#B99A65] block">
              {isRtl ? 'سعر الباقة الملكية (Royal VIP):' : 'Royal VIP Plan Price:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={form.royalPriceEGP}
                onChange={(e) => setForm({ ...form, royalPriceEGP: Number(e.target.value) })}
                className="w-full bg-[#1F1E1B] border border-[#B99A65]/60 rounded-xl px-3 py-2 text-[#B99A65] font-extrabold text-base font-mono focus:outline-none focus:border-[#B99A65]"
              />
              <span className="text-xs text-[#8D8A84] font-bold">EGP</span>
            </div>
          </div>

          {/* Diamond */}
          <div className="space-y-1.5 p-4 rounded-2xl bg-[#171717] border border-[#333]">
            <label className="text-xs font-bold text-[#8D8A84] block">
              {isRtl ? 'سعر الباقة الماسية (Diamond):' : 'Diamond Plan Price:'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={form.diamondPriceEGP}
                onChange={(e) => setForm({ ...form, diamondPriceEGP: Number(e.target.value) })}
                className="w-full bg-[#1F1E1B] border border-[#444] rounded-xl px-3 py-2 text-cyan-400 font-extrabold text-base font-mono focus:outline-none focus:border-[#B99A65]"
              />
              <span className="text-xs text-[#8D8A84] font-bold">EGP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Website Background & Demo Music Settings */}
      <div className="bg-[#1F1E1B] rounded-3xl p-6 border border-[#2E2C28] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65]">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-playfair text-base font-bold text-[#F7F4EE]">
              {isRtl ? 'إعدادات موسيقى الموقع والدعوات التجريبية' : 'Website Background & Demo Music Settings'}
            </h4>
            <p className="text-xs text-[#8D8A84]">
              {isRtl
                ? 'تعيين المعزوفة الصوتية التي تعمل في خلفية الموقع العام والمعزوفة الافتراضية للدعوات التجريبية.'
                : 'Configure background ambient music for the entire website and the default track for demo previews.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Website Background Music URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'رابط موسيقى خلفية الموقع (Website BG Music):' : 'Website BG Music URL:'}
            </label>
            <input
              type="text"
              placeholder="/audio/library/... or https://..."
              value={form.websiteBackgroundMusicUrl || ''}
              onChange={(e) => setForm({ ...form, websiteBackgroundMusicUrl: e.target.value })}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] font-mono focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Website Background Music Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'اسم معزوفة خلفية الموقع:' : 'Website BG Music Name:'}
            </label>
            <input
              type="text"
              placeholder={isRtl ? 'معزوفة فريدا الملكية' : 'FRIDA Royal Ambient'}
              value={form.websiteBackgroundMusicName || ''}
              onChange={(e) => setForm({ ...form, websiteBackgroundMusicName: e.target.value })}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Default Demo Track URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#B99A65]">
              {isRtl ? 'رابط معزوفة الديمو الافتراضية (Default Demo Track):' : 'Default Demo Track URL:'}
            </label>
            <input
              type="text"
              placeholder="/audio/library/... or https://..."
              value={form.defaultDemoTrackUrl || ''}
              onChange={(e) => setForm({ ...form, defaultDemoTrackUrl: e.target.value })}
              className="w-full bg-[#171717] border border-[#B99A65]/40 rounded-xl px-3.5 py-2.5 text-[#F7F4EE] font-mono focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Default Demo Track Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#B99A65]">
              {isRtl ? 'اسم معزوفة الديمو الافتراضية:' : 'Default Demo Track Name:'}
            </label>
            <input
              type="text"
              placeholder={isRtl ? 'معزوفة زفاف فريدا الملكية' : 'FRIDA Royal Waltz'}
              value={form.defaultDemoTrackName || ''}
              onChange={(e) => setForm({ ...form, defaultDemoTrackName: e.target.value })}
              className="w-full bg-[#171717] border border-[#B99A65]/40 rounded-xl px-3.5 py-2.5 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            />
          </div>
        </div>

        {/* Autoplay Toggle */}
        <div className="flex items-center gap-3 bg-[#171717] p-3.5 rounded-2xl border border-[#333]">
          <input
            type="checkbox"
            id="bgMusicAutoplay"
            checked={form.websiteBackgroundMusicAutoplay ?? true}
            onChange={(e) => setForm({ ...form, websiteBackgroundMusicAutoplay: e.target.checked })}
            className="w-4 h-4 rounded text-[#B99A65] focus:ring-[#B99A65] bg-[#1F1E1B] border-[#444] cursor-pointer"
          />
          <label htmlFor="bgMusicAutoplay" className="text-xs text-[#F7F4EE] font-medium cursor-pointer">
            {isRtl
              ? 'تشغيل موسيقى الموقع تلقائياً عند تفاعل الزائر مع الصفحة (Autoplay with User Gesture)'
              : 'Enable automatic background music playback upon user first interaction'}
          </label>
        </div>
      </div>

      {/* SEO & Demo Settings */}
      <div className="bg-[#1F1E1B] rounded-3xl p-6 border border-[#2E2C28] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-playfair text-base font-bold text-[#F7F4EE]">
              {isRtl ? 'إعدادات تحسين محركات البحث (SEO & Metadata)' : 'SEO & Metadata Settings'}
            </h4>
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'العناوين والأوصاف التي تظهر في محركات البحث وبطاقات المشاركة في واتساب.' : 'Title & descriptions for search engines and social cards.'}
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'عنوان الموقع (Site Title):' : 'Site Title:'}
            </label>
            <input
              type="text"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'وصف الموقع (Meta Description):' : 'Meta Description:'}
            </label>
            <textarea
              rows={2}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            />
          </div>
        </div>
      </div>

      {/* Save Button & Feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{feedback}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(185,154,101,0.4)] transition-all ml-auto disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#171717]" />
              <span>{isRtl ? 'جارِ الحفظ السحابي...' : 'Saving to Cloud...'}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-[#171717]" />
              <span>{isRtl ? 'حفظ كافة التغييرات في السحابة 💾' : 'Save Global Settings 💾'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
