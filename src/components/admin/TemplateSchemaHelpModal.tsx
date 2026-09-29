import React, { useState, useRef } from 'react';
import { X, FileCode2, Upload, Download, Check, AlertCircle, Copy } from 'lucide-react';
import { CustomTemplate, Language } from '../../types';

interface TemplateSchemaHelpModalProps {
  currentLang: Language;
  onClose: () => void;
  onImportTemplate: (importedTemplate: CustomTemplate) => Promise<void>;
}

export const TemplateSchemaHelpModal: React.FC<TemplateSchemaHelpModalProps> = ({
  currentLang,
  onClose,
  onImportTemplate,
}) => {
  const isRtl = currentLang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Sample JSON Schema Template
  const exampleSchema = {
    id: "tmpl-custom-royal-001",
    title: {
      ar: "قالب الزفاف الملكي الفاخر",
      en: "Royal Luxury Wedding Template"
    },
    description: {
      ar: "تصميم ملكي فاخر بختم شمعي وإمكانية التحكم الكامل في العناصر والألوان",
      en: "Luxury royal template with wax seal and full live canvas control"
    },
    category: "weddings",
    themeStyle: "luxury",
    layoutType: "royal",
    introType: "wax-seal",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    defaultColors: {
      primary: "#B99A65",
      secondary: "#171717",
      background: "#0D0D0D",
      accent: "#F7F4EE",
      text: "#F7F4EE"
    },
    defaultFont: "Amiri",
    canvasElements: [
      {
        id: "elem-1",
        type: "icon",
        content: "Crown",
        position: { x: 50, y: 15 }
      }
    ],
    defaultData: {
      eventTitle: "حفل زفاف كريم وفريدة",
      groomName: "كريم الشناوي",
      brideName: "فريدة الشاذلي",
      customMessage: "يسعدنا دعوتكم لمشاركتنا أسعد لحظات العمر"
    }
  };

  const sampleJsonString = JSON.stringify(exampleSchema, null, 2);

  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleJsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const rawJson = evt.target?.result as string;
        const parsed = JSON.parse(rawJson);

        if (!parsed.title || (!parsed.title.ar && !parsed.title.en)) {
          throw new Error(isRtl ? 'ملف القالب يفتقد لعنوان القالب title (ar/en)' : 'Template JSON missing title');
        }

        const validTmpl: CustomTemplate = {
          id: parsed.id || `tmpl-import-${Date.now()}`,
          title: {
            ar: parsed.title?.ar || parsed.title?.en || 'قالب مستورد',
            en: parsed.title?.en || parsed.title?.ar || 'Imported Template',
          },
          description: {
            ar: parsed.description?.ar || 'قالب مستورد بملف JSON',
            en: parsed.description?.en || 'Imported via JSON',
          },
          category: parsed.category || 'weddings',
          themeStyle: parsed.themeStyle || 'luxury',
          layoutType: parsed.layoutType || 'royal',
          introType: parsed.introType || parsed.openingStyle || 'wax-seal',
          coverImage: parsed.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          galleryPreview: parsed.galleryPreview || [],
          supportedLanguages: ['ar', 'en'],
          defaultColors: {
            bg: parsed.defaultColors?.bg || parsed.defaultColors?.background || '#0D0D0D',
            cardBg: parsed.defaultColors?.cardBg || parsed.defaultColors?.secondary || '#171717',
            primary: parsed.defaultColors?.primary || '#B99A65',
            secondary: parsed.defaultColors?.secondary || '#171717',
            background: parsed.defaultColors?.background || '#0D0D0D',
            accent: parsed.defaultColors?.accent || '#F7F4EE',
            text: parsed.defaultColors?.text || '#F7F4EE',
          },
          defaultFont: parsed.defaultFont || 'Playfair Display',
          defaultData: parsed.defaultData || {},
          canvasElements: parsed.canvasElements || [],
          createdAt: new Date().toISOString(),
        };

        await onImportTemplate(validTmpl);
        setImportStatus(isRtl ? 'تم استيراد ونشر القالب بنجاح! 👑' : 'Template imported and published!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (err: any) {
        setImportError(err.message || 'Invalid Template JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-2xl bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(185,154,101,0.2)] space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B99A65]/20 border border-[#B99A65]/40 flex items-center justify-center text-[#B99A65]">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'رفع واستيراد قالب بملف JSON' : 'Import Template via JSON Schema'}
            </h3>
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'المواصفات والصيغة المقبولة لرفع قوالب جديدة للموقع' : 'Exact accepted schema format for uploading templates'}
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {importStatus && (
          <div className="p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        {importError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{importError}</span>
          </div>
        )}

        {/* File Upload Trigger */}
        <div className="p-5 rounded-2xl bg-[#1F1E1B] border border-[#B99A65]/40 space-y-3 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(185,154,101,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>{isRtl ? 'رفع ملف قالب (.json) من الهاتف أو الكمبيوتر' : 'Upload Template (.json) File'}</span>
          </button>
          <p className="text-[11px] text-[#8D8A84]">
            {isRtl ? 'يقبل الموقع ملفات JSON القياسية المحتوية على ألوان وخطوط وافتتاحية القالب' : 'Accepts standard JSON template configuration with colors & font defaults'}
          </p>
        </div>

        {/* JSON Schema Guide */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#B99A65]">
              {isRtl ? 'الصيغة المقبولة (Accepted JSON Schema):' : 'Accepted JSON Schema Format:'}
            </h4>
            <button
              onClick={handleCopySample}
              className="px-3 py-1 rounded-lg bg-[#222] border border-[#444] text-[#F7F4EE] hover:border-[#B99A65] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5 text-[#B99A65]" />}
              <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ النموذج' : 'Copy Sample')}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#0D0D0D] border border-[#2E2C28] text-xs font-mono text-[#E9E1D5] max-h-60 overflow-y-auto dir-ltr text-left">
            {sampleJsonString}
          </pre>
        </div>

      </div>
    </div>
  );
};
