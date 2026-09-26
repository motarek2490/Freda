import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  Palette,
  CheckCircle,
  Loader2,
  FolderPlus,
} from 'lucide-react';
import { CustomTemplate, Category, ThemeStyle, Language } from '../../types';
import { TEMPLATES } from '../../data/templates';

interface AdminTemplatesTabProps {
  currentLang: Language;
  customTemplates: CustomTemplate[];
  onSaveTemplate: (template: CustomTemplate) => Promise<void>;
  onDeleteTemplate: (templateId: string) => Promise<void>;
}

export const AdminTemplatesTab: React.FC<AdminTemplatesTabProps> = ({
  currentLang,
  customTemplates,
  onSaveTemplate,
  onDeleteTemplate,
}) => {
  const isRtl = currentLang === 'ar';

  const [form, setForm] = useState({
    titleAr: '',
    titleEn: '',
    category: 'weddings' as Category,
    themeStyle: 'luxury' as ThemeStyle,
    coverImage: '',
    primaryColor: '#B99A65',
    fontFamily: 'Playfair Display',
    descriptionAr: '',
    descriptionEn: '',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleAr.trim() && !form.titleEn.trim()) return;

    setSaving(true);
    setFeedback(null);

    const newTmpl: CustomTemplate = {
      id: `tmpl-custom-${Date.now()}`,
      title: {
        ar: form.titleAr.trim() || form.titleEn.trim(),
        en: form.titleEn.trim() || form.titleAr.trim(),
      },
      category: form.category,
      themeStyle: form.themeStyle,
      coverImage: form.coverImage.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      description: {
        ar: form.descriptionAr.trim() || 'تصميم ملكي فاخر',
        en: form.descriptionEn.trim() || 'Luxury Royal Design',
      },
      defaultColors: {
        bg: '#0D0D0D',
        cardBg: '#171717',
        accent: form.primaryColor || '#B99A65',
        primary: form.primaryColor,
        secondary: '#171717',
        background: '#0D0D0D',
        text: '#F7F4EE',
      },
      defaultFont: form.fontFamily,
      galleryPreview: [],
      supportedLanguages: ['ar', 'en'],
      createdAt: new Date().toISOString(),
    };

    try {
      await onSaveTemplate(newTmpl);
      setFeedback(isRtl ? 'تمت إضافة القالب بنجاح! 👑' : 'Template added successfully!');
      setForm({
        titleAr: '',
        titleEn: '',
        category: 'weddings',
        themeStyle: 'luxury',
        coverImage: '',
        primaryColor: '#B99A65',
        fontFamily: 'Playfair Display',
        descriptionAr: '',
        descriptionEn: '',
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      setFeedback(err.message || 'Error saving template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Custom Template Card */}
      <div className="bg-[#1F1E1B] rounded-3xl p-6 border border-[#B99A65]/40 shadow-[0_0_30px_rgba(185,154,101,0.1)] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65]">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-playfair text-lg font-bold text-[#F7F4EE]">
              {isRtl ? 'إضافة قالب إلكتروني جديد للمنصة' : 'Add New Custom Template'}
            </h3>
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'إنشاء تصميم مخصص يظهر في معرض القوالب لجميع الزوار.' : 'Create a custom template for public gallery.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Title AR */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'اسم القالب (بالعربية):' : 'Template Title (AR):'}
            </label>
            <input
              type="text"
              required
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              placeholder="مثال: ليلة العمر الملكية"
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Title EN */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'اسم القالب (بالإنجليزية):' : 'Template Title (EN):'}
            </label>
            <input
              type="text"
              required
              value={form.titleEn}
              onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              placeholder="e.g. Royal Golden Night"
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'التصنيف:' : 'Category:'}
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
            >
              <option value="weddings">{isRtl ? 'حفلات زفاف وعقد قران' : 'Weddings'}</option>
              <option value="birthdays">{isRtl ? 'أعياد ميلاد وحفلات خاصة' : 'Birthdays'}</option>
              <option value="anniversaries">{isRtl ? 'ذكرى سنوية وخطوبة' : 'Anniversaries'}</option>
              <option value="corporate">{isRtl ? 'مؤتمرات وفعاليات شركات' : 'Corporate'}</option>
              <option value="special">{isRtl ? 'مناسبات عامة وتخرج' : 'Special Events'}</option>
            </select>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-[#B99A65]" />
              <span>{isRtl ? 'رابط صورة الغلاف (Cover Image URL):' : 'Cover Image URL:'}</span>
            </label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Primary Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-[#B99A65]" />
              <span>{isRtl ? 'اللون الأساسي:' : 'Primary Color:'}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
                className="w-full bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-[#F7F4EE] font-mono text-xs"
              />
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className="sm:col-span-full p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          )}

          {/* Submit */}
          <div className="sm:col-span-full pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#d6bd91] text-[#171717] font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#171717]" />
                  <span>{isRtl ? 'جارِ الحفظ السحابي...' : 'Saving to Cloud...'}</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 text-[#171717]" />
                  <span>{isRtl ? 'حفظ ونشر القالب' : 'Save & Publish Template'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Custom Templates List */}
      <div className="space-y-4">
        <h4 className="font-playfair text-lg font-bold text-[#F7F4EE] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#B99A65]" />
          <span>{isRtl ? 'القوالب المخصصة المضافة' : 'Custom Templates Library'}</span>
          <span className="text-xs text-[#8D8A84]">({customTemplates.length})</span>
        </h4>

        {customTemplates.length === 0 ? (
          <div className="p-8 text-center bg-[#1F1E1B] rounded-2xl border border-[#2E2C28] text-xs text-[#8D8A84]">
            {isRtl ? 'لم تتم إضافة قوالب مخصصة بعد. استخدم النموذج أعلاه لإضافة أول قالب.' : 'No custom templates added yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {customTemplates.map((t, idx) => (
              <div
                key={t.id ? `tmpl-${t.id}-${idx}` : `tmpl-item-${idx}`}
                className="bg-[#1F1E1B] rounded-2xl overflow-hidden border border-[#2E2C28] hover:border-[#B99A65]/50 transition-all space-y-3"
              >
                <div className="relative h-36 overflow-hidden bg-black/40">
                  <img
                    src={t.coverImage}
                    alt={t.title.ar}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[#B99A65] text-[10px] font-bold">
                    {t.category}
                  </div>
                </div>

                <div className="p-4 pt-0 space-y-3">
                  <div>
                    <h5 className="font-playfair font-bold text-sm text-[#F7F4EE] line-clamp-1">
                      {isRtl ? t.title.ar : t.title.en}
                    </h5>
                    <p className="text-[11px] text-[#8D8A84] line-clamp-1 mt-0.5">
                      {isRtl ? t.description?.ar : t.description?.en}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2722]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: t.defaultColors?.accent || t.defaultColors?.primary || '#B99A65' }}
                      />
                      <span className="text-[10px] text-[#8D8A84] font-mono">
                        {t.defaultFont || 'Playfair'}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTemplate(t.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title={isRtl ? 'حذف القالب' : 'Delete Template'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
