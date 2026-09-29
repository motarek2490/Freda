import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  Palette,
  CheckCircle,
  Loader2,
  FolderPlus,
  Edit3,
  Download,
  Upload,
  FileCode2,
  Layers,
  Crown,
  Eye,
} from 'lucide-react';
import { CustomTemplate, Category, ThemeStyle, Language } from '../../types';
import { TEMPLATES, getMergedTemplates } from '../../data/templates';
import { AdminTemplateVisualEditor } from './AdminTemplateVisualEditor';
import { TemplateSchemaHelpModal } from './TemplateSchemaHelpModal';

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

  // State for Visual Canvas Editor Modal
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null);

  // State for Schema Help & JSON Import Modal
  const [showImportSchemaModal, setShowImportSchemaModal] = useState(false);

  // Quick New Template Form State
  const [form, setForm] = useState({
    titleAr: '',
    titleEn: '',
    category: 'weddings' as Category,
    themeStyle: 'luxury' as ThemeStyle,
    coverImage: '',
    primaryColor: '#B99A65',
    fontFamily: 'Playfair Display',
    introType: 'wax-seal',
    descriptionAr: '',
    descriptionEn: '',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Convert Merged Templates to CustomTemplate format for full admin editing without duplicates
  const allTemplatesMap: CustomTemplate[] = useMemo(() => {
    const merged = getMergedTemplates(customTemplates);
    return merged.map((t) => {
      const ct = customTemplates.find((c) => c.id === t.id);
      if (ct) return ct;
      return {
        id: t.id,
        title: t.title,
        description: t.description || { ar: 'تصميم ملكي فاخر', en: 'Luxury Royal Template' },
        category: t.category,
        themeStyle: t.themeStyle,
        layoutType: t.layoutType,
        openingStyle: t.openingStyle,
        introType: t.openingStyle || 'wax-seal',
        coverImage: t.coverImage,
        galleryPreview: t.galleryPreview || [],
        supportedLanguages: t.supportedLanguages || ['ar', 'en'],
        isFeatured: t.isFeatured,
        isNew: t.isNew,
        defaultColors: t.defaultColors,
        defaultFont: t.defaultFont || 'Playfair Display',
        defaultData: t.defaultData,
        canvasElements: t.canvasElements,
        createdAt: new Date().toISOString(),
      };
    });
  }, [customTemplates]);

  // Quick Create Submission
  const handleSubmitQuick = async (e: React.FormEvent) => {
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
      introType: form.introType,
      coverImage: form.coverImage.trim() || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      description: {
        ar: form.descriptionAr.trim() || 'تصميم ملكي فريدا فاخر',
        en: form.descriptionEn.trim() || 'Luxury Royal FRIDA Design',
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
      setFeedback(isRtl ? 'تمت إضافة ونشر القالب بنجاح! 👑' : 'Template added and published!');
      setForm({
        titleAr: '',
        titleEn: '',
        category: 'weddings',
        themeStyle: 'luxury',
        coverImage: '',
        primaryColor: '#B99A65',
        fontFamily: 'Playfair Display',
        introType: 'wax-seal',
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

  // Launch Blank Template in Visual Canvas Editor directly
  const handleLaunchBlankEditor = () => {
    const blankTmpl: CustomTemplate = {
      id: `tmpl-canvas-${Date.now()}`,
      title: { ar: 'قالب كانفز حقيقي جديد', en: 'New Live Canvas Template' },
      description: { ar: 'تصميم كانفز تفاعلي مخصص', en: 'Custom live canvas template' },
      category: 'weddings',
      themeStyle: 'luxury',
      introType: 'wax-seal',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      galleryPreview: [],
      supportedLanguages: ['ar', 'en'],
      defaultColors: {
        bg: '#0D0D0D',
        cardBg: '#171717',
        primary: '#B99A65',
        secondary: '#171717',
        background: '#0D0D0D',
        accent: '#F7F4EE',
        text: '#F7F4EE',
      },
      defaultFont: 'Amiri',
      canvasElements: [
        { id: 'el-1', type: 'icon', content: 'Crown', position: { x: 50, y: 15 } },
      ],
      createdAt: new Date().toISOString(),
    };
    setEditingTemplate(blankTmpl);
  };

  // Export Template JSON File
  const handleExportTemplateJson = (t: CustomTemplate) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(t, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${t.id || 'template'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      
      {/* Top Action Bar: Create with Canvas, Import JSON, Schema Guide */}
      <div className="bg-[#1F1E1B] rounded-3xl p-6 border border-[#B99A65]/40 shadow-[0_0_30px_rgba(185,154,101,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65] shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'محرر ومصمم القوالب التفاعلية (Canvas & Live Control)' : 'Visual Canvas & Live Template Suite'}
            </h3>
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'تحكم كامل في جميع القوالب، حذف وإضافة عناصر وحفظ ونشر فورياً' : 'Full visual control over all templates, live edit & republish'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleLaunchBlankEditor}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-bold text-xs flex items-center gap-2 hover:shadow-[0_0_20px_rgba(185,154,101,0.4)] cursor-pointer transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#171717]" />
            <span>{isRtl ? 'إنشاء كانفز جديد حياً' : 'Create Live Canvas'}</span>
          </button>

          <button
            onClick={() => setShowImportSchemaModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#292621] border border-[#B99A65]/50 text-[#B99A65] font-bold text-xs flex items-center gap-2 hover:bg-[#B99A65] hover:text-[#171717] cursor-pointer transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>{isRtl ? 'رفع واستيراد قالب (.json)' : 'Upload JSON Template'}</span>
          </button>
        </div>
      </div>

      {/* Quick Add Custom Template Form */}
      <div className="bg-[#171717] rounded-3xl p-6 border border-[#2E2C28] space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B99A65]/10 border border-[#B99A65]/40 flex items-center justify-center text-[#B99A65]">
            <FolderPlus className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-playfair text-base font-bold text-[#F7F4EE]">
              {isRtl ? 'إضافة قالب سريع للمنصة' : 'Quick Add Custom Template'}
            </h4>
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'إضافة سريعة بالألوان والخط لإظهاره فوراً لجميع الزوار.' : 'Quick setup with default font and color palette.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitQuick} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
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
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
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
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
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
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
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
              className="w-full bg-[#121212] border border-[#333] rounded-xl px-3.5 py-2.5 text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
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
                className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-[#F7F4EE] font-mono text-xs"
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

      {/* Full Grid Library of All Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-playfair text-lg font-bold text-[#F7F4EE] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B99A65]" />
            <span>{isRtl ? 'مكتبة القوالب الحالية' : 'Templates Library'}</span>
            <span className="text-xs text-[#8D8A84]">({allTemplatesMap.length})</span>
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allTemplatesMap.map((t, idx) => (
            <div
              key={t.id ? `tmpl-${t.id}-${idx}` : `tmpl-item-${idx}`}
              className="bg-[#1F1E1B] rounded-2xl overflow-hidden border border-[#2E2C28] hover:border-[#B99A65]/60 transition-all flex flex-col justify-between group shadow-lg"
            >
              {/* Cover Thumbnail */}
              <div className="relative h-40 overflow-hidden bg-black/40">
                <img
                  src={t.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'}
                  alt={t.title?.ar || t.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#B99A65] text-[10px] font-bold border border-[#B99A65]/30">
                  {t.category}
                </div>
                {t.introType && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#F7F4EE] text-[9px] font-mono border border-white/20">
                    🎬 {t.introType}
                  </div>
                )}
              </div>

              {/* Template Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="font-playfair font-bold text-sm text-[#F7F4EE] line-clamp-1">
                    {isRtl ? t.title?.ar : t.title?.en}
                  </h5>
                  <p className="text-[11px] text-[#8D8A84] line-clamp-2 mt-1">
                    {isRtl ? t.description?.ar : t.description?.en}
                  </p>
                </div>

                {/* Color & Font Indicators */}
                <div className="flex items-center justify-between pt-2 border-t border-[#2A2722]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.defaultColors?.accent || t.defaultColors?.primary || '#B99A65' }}
                    />
                    <span className="text-[10px] text-[#E9E1D5] font-semibold">
                      {t.defaultFont || 'Playfair'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Live Canvas Edit, Export JSON, Delete */}
                <div className="grid grid-cols-3 gap-1.5 pt-2">
                  <button
                    onClick={() => setEditingTemplate(t)}
                    className="col-span-2 py-2 px-2 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-[10px] flex items-center justify-center gap-1 hover:bg-[#d6bd91] cursor-pointer transition-all shadow-md"
                    title={isRtl ? 'تعديل حقيقي بالكانفز المباشر' : 'Live Canvas Edit'}
                  >
                    <Edit3 className="w-3 h-3 text-[#171717]" />
                    <span>{isRtl ? 'تعديل كانفز' : 'Edit Canvas'}</span>
                  </button>

                  <button
                    onClick={() => handleExportTemplateJson(t)}
                    className="p-2 rounded-xl bg-[#2A2722] border border-[#444] text-[#E9E1D5] hover:text-[#B99A65] hover:border-[#B99A65] flex items-center justify-center cursor-pointer transition-colors"
                    title={isRtl ? 'تصدير كملف JSON' : 'Export JSON'}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Custom Template Delete Action */}
                {customTemplates.some((ct) => ct.id === t.id) && (
                  <button
                    onClick={() => onDeleteTemplate(t.id)}
                    className="w-full py-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900/60 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors mt-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{isRtl ? 'حذف القالب نهائياً' : 'Delete Template'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Canvas Editor Modal */}
      {editingTemplate && (
        <AdminTemplateVisualEditor
          currentLang={currentLang}
          template={editingTemplate}
          onSave={onSaveTemplate}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      {/* Schema Help & JSON Import Modal */}
      {showImportSchemaModal && (
        <TemplateSchemaHelpModal
          currentLang={currentLang}
          onClose={() => setShowImportSchemaModal(false)}
          onImportTemplate={onSaveTemplate}
        />
      )}

    </div>
  );
};
