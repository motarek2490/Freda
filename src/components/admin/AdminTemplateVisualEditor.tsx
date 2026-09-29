import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Save,
  Trash2,
  Plus,
  Upload,
  Layers,
  Palette,
  Type,
  Eye,
  Crown,
  Heart,
  Gem,
  Sun,
  Moon,
  Flower2,
  Gift,
  Award,
  Star,
  Film,
  Music,
  Download,
  FileCode2,
  Check,
  Loader2,
  Move,
} from 'lucide-react';
import { CustomTemplate, CustomTemplateCanvasElement, Category, ThemeStyle, Language } from '../../types';
import { processAndUploadImage } from '../../lib/imageUploader';

interface AdminTemplateVisualEditorProps {
  currentLang: Language;
  template: CustomTemplate;
  onSave: (updatedTemplate: CustomTemplate) => Promise<void>;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'Crown', Icon: Crown },
  { name: 'Heart', Icon: Heart },
  { name: 'Sparkles', Icon: Sparkles },
  { name: 'Gem', Icon: Gem },
  { name: 'Sun', Icon: Sun },
  { name: 'Moon', Icon: Moon },
  { name: 'Flower2', Icon: Flower2 },
  { name: 'Gift', Icon: Gift },
  { name: 'Award', Icon: Award },
  { name: 'Star', Icon: Star },
  { name: 'Film', Icon: Film },
];

const INTRO_TYPE_OPTIONS = [
  { value: 'wax-seal', label: 'ختم شمعي ملكي (Wax Seal)' },
  { value: 'butterfly', label: 'فراشة العمر (Butterfly)' },
  { value: 'ribbon', label: 'فيونكة مخملية (Ribbon Bow)' },
  { value: 'royal-gate', label: 'بوابة القصر الأندلسي (Royal Gate)' },
  { value: 'petals', label: 'تفتق بتلات الورد (Petals Bloom)' },
  { value: 'curtain', label: 'ستارة المسرح والفيلم (Cinematic Curtain)' },
  { value: 'lanterns-stars', label: 'فوانيس وشهب السماء (Lanterns & Stars)' },
  { value: 'celestial-eclipse', label: 'الكسوف السماوي (Celestial Eclipse)' },
  { value: 'ocean-pearl', label: 'لؤلؤة الصدفة البحرية (Ocean Pearl)' },
  { value: 'scroll-book', label: 'المخطوطة الملكية (Scroll Journal)' },
  { value: 'lace-veil', label: 'طرحة الدانتيل العتيقة (Lace Veil)' },
  { value: 'crystal-prism', label: 'الكريستال الألماسي (Crystal Prism)' },
  { value: 'gift-unboxing', label: 'صندوق الهدايا والكونفيتي (Gift Box)' },
  { value: 'baby-cradle', label: 'مهد المولود والغيوم (Baby Cradle)' },
  { value: 'graduation-scroll', label: 'قبعة وثيقة التخرج (Graduation)' },
  { value: 'autumn-leaves', label: 'أوراق الخريف العقدة الريفية (Autumn)' },
];

const FONT_OPTIONS = [
  'Amiri', 'El Messiri', 'Reem Kufi', 'Tajawal', 'Cairo',
  'Noto Kufi Arabic', 'Lateef', 'Ruwudu', 'Beiruti', 'Zain',
  'Cormorant Garamond', 'Playfair Display', 'Great Vibes',
  'Bodoni Moda', 'Cinzel', 'Marcellus', 'Italiana', 'Montserrat',
  'Lora', 'Dancing Script',
];

export const AdminTemplateVisualEditor: React.FC<AdminTemplateVisualEditorProps> = ({
  currentLang,
  template,
  onSave,
  onClose,
}) => {
  const isRtl = currentLang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable Form State
  const [tmplData, setTmplData] = useState<CustomTemplate>({
    ...template,
    title: { ar: template.title?.ar || '', en: template.title?.en || '' },
    description: { ar: template.description?.ar || '', en: template.description?.en || '' },
    defaultColors: {
      primary: template.defaultColors?.primary || '#B99A65',
      secondary: template.defaultColors?.secondary || '#171717',
      background: template.defaultColors?.background || '#0D0D0D',
      accent: template.defaultColors?.accent || '#F7F4EE',
      text: template.defaultColors?.text || '#F7F4EE',
      bg: template.defaultColors?.bg || '#0D0D0D',
      cardBg: template.defaultColors?.cardBg || '#171717',
    },
    defaultFont: template.defaultFont || 'Playfair Display',
    introType: template.introType || template.openingStyle || 'wax-seal',
    canvasElements: template.canvasElements || [
      { id: 'elem-1', type: 'icon', content: 'Crown', position: { x: 50, y: 15 } },
      { id: 'elem-2', type: 'text', content: 'VIP Inviation', position: { x: 50, y: 85 } },
    ],
    defaultData: {
      eventTitle: template.defaultData?.eventTitle || template.title?.ar || 'حفل زفاف ملكي',
      groomName: template.defaultData?.groomName || 'كريم الشناوي',
      brideName: template.defaultData?.brideName || 'فريدة الشاذلي',
      customMessage: template.defaultData?.customMessage || 'يسعدنا ويشرفنا دعوتكم لحضور حفل زفافنا الميمون',
      venueName: template.defaultData?.venueName || 'فندق القصر الملكي',
      address: template.defaultData?.address || 'القاهرة، مصر',
      dressCode: template.defaultData?.dressCode || 'Black Tie & Royal Gold',
      ...(template.defaultData || {}),
    },
  });

  const [activeTab, setActiveTab] = useState<'visual' | 'canvas' | 'colors' | 'details'>('visual');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Handle Asset Upload from Device / Phone
  const handleUploadAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await processAndUploadImage(file, 'images/templates');
      if (res.url) {
        // Add new image/frame element to canvas
        const newElem: CustomTemplateCanvasElement = {
          id: `elem-${Date.now()}`,
          type: 'image',
          content: res.url,
          position: { x: 50, y: 50 },
          style: { width: '120px', height: '120px' },
        };
        setTmplData((prev) => ({
          ...prev,
          coverImage: prev.coverImage || res.url,
          canvasElements: [...(prev.canvasElements || []), newElem],
        }));
      }
    } catch (err: any) {
      console.warn('Asset upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Canvas Layer Management
  const handleAddIconElement = (iconName: string) => {
    const newElem: CustomTemplateCanvasElement = {
      id: `elem-${Date.now()}`,
      type: 'icon',
      content: iconName,
      position: { x: 50, y: 50 },
    };
    setTmplData((prev) => ({
      ...prev,
      canvasElements: [...(prev.canvasElements || []), newElem],
    }));
  };

  const handleRemoveElement = (id: string) => {
    setTmplData((prev) => ({
      ...prev,
      canvasElements: (prev.canvasElements || []).filter((el) => el.id !== id),
    }));
  };

  const handleUpdateElementPos = (id: string, dx: number, dy: number) => {
    setTmplData((prev) => ({
      ...prev,
      canvasElements: (prev.canvasElements || []).map((el) => {
        if (el.id !== id) return el;
        const newX = Math.min(90, Math.max(10, el.position.x + dx));
        const newY = Math.min(90, Math.max(10, el.position.y + dy));
        return { ...el, position: { x: newX, y: newY } };
      }),
    }));
  };

  // Save Template Changes and Republish
  const handleSaveAndPublish = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      await onSave(tmplData);
      setSaveStatus(isRtl ? 'تم حفظ القالب وإعاده نشره بنجاح! 👑' : 'Template saved and republished!');
      setTimeout(() => {
        setSaveStatus(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setSaveStatus(err.message || 'Error saving template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col overflow-hidden text-[#F7F4EE] animate-in fade-in duration-300"
    >
      {/* Editor Header Bar */}
      <div className="bg-[#171717] border-b border-[#333] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#B99A65]/20 border border-[#B99A65]/40 flex items-center justify-center text-[#B99A65]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-playfair text-lg font-bold text-[#F7F4EE]">
              {isRtl ? 'محرر القوالب الحية والكانفز الملكي' : 'Live Canvas & Visual Template Editor'}
            </h3>
            <p className="text-xs text-[#8D8A84]">
              {tmplData.title?.ar || tmplData.title?.en || tmplData.id}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs font-bold text-[#25D366] bg-[#25D366]/10 px-3 py-1.5 rounded-full border border-[#25D366]/30">
              {saveStatus}
            </span>
          )}

          <button
            onClick={handleSaveAndPublish}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(185,154,101,0.5)] flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isRtl ? 'حفظ ونشر القالب' : 'Save & Publish Template'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#8D8A84] hover:text-[#F7F4EE] hover:border-[#B99A65] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body Grid: Control Sidebar + Live Canvas Preview */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left/Right Sidebar Control Tabs */}
        <div className="lg:col-span-5 bg-[#121212] border-r border-[#222] flex flex-col overflow-hidden">
          
          {/* Sub Tab Navigation */}
          <div className="flex items-center border-b border-[#222] bg-[#171717] p-2 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-[#B99A65] text-[#171717]'
                  : 'text-[#8D8A84] hover:text-[#F7F4EE]'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{isRtl ? 'التنسيق والخطوط' : 'Style & Font'}</span>
            </button>

            <button
              onClick={() => setActiveTab('canvas')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-[#B99A65] text-[#171717]'
                  : 'text-[#8D8A84] hover:text-[#F7F4EE]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isRtl ? 'طبقات الكانفز' : 'Canvas Layers'}</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 min-w-[90px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-[#B99A65] text-[#171717]'
                  : 'text-[#8D8A84] hover:text-[#F7F4EE]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{isRtl ? 'البيانات والافتتاحية' : 'Intro & Data'}</span>
            </button>
          </div>

          {/* Sidebar Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. Style & Colors Tab */}
            {activeTab === 'visual' && (
              <div className="space-y-6">
                {/* Titles */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#E9E1D5]">
                    {isRtl ? 'اسم القالب (عربي وإنجليزي):' : 'Template Title:'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={tmplData.title?.ar || ''}
                      onChange={(e) =>
                        setTmplData((prev) => ({
                          ...prev,
                          title: { ...prev.title, ar: e.target.value },
                        }))
                      }
                      placeholder="العنوان بالعربية"
                      className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none"
                    />
                    <input
                      type="text"
                      value={tmplData.title?.en || ''}
                      onChange={(e) =>
                        setTmplData((prev) => ({
                          ...prev,
                          title: { ...prev.title, en: e.target.value },
                        }))
                      }
                      placeholder="Title in English"
                      className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none"
                    />
                  </div>
                </div>

                {/* Font Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#E9E1D5] flex items-center justify-between">
                    <span>{isRtl ? 'خط القالب الرئيسي (20 خطاً ملكياً):' : 'Primary Font Family:'}</span>
                    <span className="text-[#B99A65] font-semibold">{tmplData.defaultFont}</span>
                  </label>
                  <select
                    value={tmplData.defaultFont}
                    onChange={(e) =>
                      setTmplData((prev) => ({ ...prev, defaultFont: e.target.value }))
                    }
                    className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none cursor-pointer"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Pickers */}
                <div className="p-4 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-4">
                  <h4 className="text-xs font-bold text-[#E9E1D5] flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#B99A65]" />
                    <span>{isRtl ? 'تخصيص الألوان الافتراضية:' : 'Default Color Palette:'}</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[11px] text-[#8D8A84] block mb-1">اللون الرئيسي (Primary):</span>
                      <input
                        type="color"
                        value={tmplData.defaultColors?.primary || '#B99A65'}
                        onChange={(e) =>
                          setTmplData((prev) => ({
                            ...prev,
                            defaultColors: {
                              ...prev.defaultColors,
                              primary: e.target.value,
                              accent: e.target.value,
                            },
                          }))
                        }
                        className="w-full h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-[#8D8A84] block mb-1">خلفية الكرت (Card Bg):</span>
                      <input
                        type="color"
                        value={tmplData.defaultColors?.secondary || '#171717'}
                        onChange={(e) =>
                          setTmplData((prev) => ({
                            ...prev,
                            defaultColors: {
                              ...prev.defaultColors,
                              secondary: e.target.value,
                              cardBg: e.target.value,
                            },
                          }))
                        }
                        className="w-full h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-[#8D8A84] block mb-1">خلفية الصفحة (Background):</span>
                      <input
                        type="color"
                        value={tmplData.defaultColors?.background || '#0D0D0D'}
                        onChange={(e) =>
                          setTmplData((prev) => ({
                            ...prev,
                            defaultColors: {
                              ...prev.defaultColors,
                              background: e.target.value,
                              bg: e.target.value,
                            },
                          }))
                        }
                        className="w-full h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-[#8D8A84] block mb-1">لون النصوص (Text):</span>
                      <input
                        type="color"
                        value={tmplData.defaultColors?.text || '#F7F4EE'}
                        onChange={(e) =>
                          setTmplData((prev) => ({
                            ...prev,
                            defaultColors: {
                              ...prev.defaultColors,
                              text: e.target.value,
                            },
                          }))
                        }
                        className="w-full h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Image Asset from Phone */}
                <div className="p-4 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-3">
                  <label className="text-xs font-bold text-[#E9E1D5] block">
                    {isRtl ? 'رفع صورة غلاف أو كانفز من الهاتف:' : 'Upload Image / Frame Asset:'}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAsset}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-3 px-4 rounded-xl bg-[#24221D] border border-[#B99A65]/40 hover:border-[#B99A65] text-[#B99A65] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    <span>{isRtl ? 'اختيار صورة/كانفز من الهاتف 📱' : 'Upload File From Phone 📱'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Canvas Layers Tab */}
            {activeTab === 'canvas' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#E9E1D5]">
                    {isRtl ? 'إضافة عناصر وأيقونات للكانفز:' : 'Add Canvas Elements & Icons:'}
                  </label>
                </div>

                {/* Add Quick Icons Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleAddIconElement(name)}
                      className="p-3 rounded-xl bg-[#171717] border border-[#333] hover:border-[#B99A65] hover:text-[#B99A65] flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center"
                    >
                      <Icon className="w-5 h-5 text-[#B99A65]" />
                      <span className="text-[10px] text-[#8D8A84] truncate">{name}</span>
                    </button>
                  ))}
                </div>

                {/* Active Canvas Elements List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#E9E1D5]">
                    {isRtl ? 'العناصر الحالية على القالب:' : 'Active Layer List:'}
                  </h4>

                  {(!tmplData.canvasElements || tmplData.canvasElements.length === 0) && (
                    <p className="text-xs text-[#8D8A84] italic text-center py-4">
                      {isRtl ? 'لا توجد عناصر إضافية في الكانفز حالياً.' : 'No canvas elements added.'}
                    </p>
                  )}

                  {tmplData.canvasElements?.map((el, idx) => (
                    <div
                      key={el.id}
                      className="p-3.5 rounded-2xl bg-[#171717] border border-[#2E2C28] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="w-6 h-6 rounded-full bg-[#B99A65]/20 text-[#B99A65] text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <span className="text-xs font-bold text-[#F7F4EE] block capitalize">
                            {el.type}: {el.content}
                          </span>
                          <span className="text-[10px] text-[#8D8A84]">
                            Pos: X {el.position.x}% | Y {el.position.y}%
                          </span>
                        </div>
                      </div>

                      {/* Nudge / Move / Delete Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateElementPos(el.id, 0, -5)}
                          className="px-2 py-1 bg-[#222] text-[10px] rounded hover:bg-[#333]"
                          title="Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateElementPos(el.id, 0, 5)}
                          className="px-2 py-1 bg-[#222] text-[10px] rounded hover:bg-[#333]"
                          title="Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveElement(el.id)}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete Element"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Intro Animation & Event Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Intro Animation Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#E9E1D5] block">
                    {isRtl ? 'نوع افتتاحية القالب (Intro Animation):' : 'Intro Opening Animation:'}
                  </label>
                  <select
                    value={tmplData.introType || 'wax-seal'}
                    onChange={(e) =>
                      setTmplData((prev) => ({
                        ...prev,
                        introType: e.target.value,
                        openingStyle: e.target.value,
                      }))
                    }
                    className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none cursor-pointer"
                  >
                    {INTRO_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Default Event Title & Names */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#E9E1D5] block">
                    {isRtl ? 'الأسماء والعناوين الافتراضية:' : 'Default Names & Title:'}
                  </label>
                  <input
                    type="text"
                    value={tmplData.defaultData?.eventTitle || ''}
                    onChange={(e) =>
                      setTmplData((prev) => ({
                        ...prev,
                        defaultData: { ...prev.defaultData, eventTitle: e.target.value },
                      }))
                    }
                    placeholder="عنوان المناسبة"
                    className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={tmplData.defaultData?.groomName || ''}
                      onChange={(e) =>
                        setTmplData((prev) => ({
                          ...prev,
                          defaultData: { ...prev.defaultData, groomName: e.target.value },
                        }))
                      }
                      placeholder="اسم العريس"
                      className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none"
                    />
                    <input
                      type="text"
                      value={tmplData.defaultData?.brideName || ''}
                      onChange={(e) =>
                        setTmplData((prev) => ({
                          ...prev,
                          defaultData: { ...prev.defaultData, brideName: e.target.value },
                        }))
                      }
                      placeholder="اسم العروس"
                      className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none"
                    />
                  </div>
                </div>

                {/* Custom Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#E9E1D5] block">
                    {isRtl ? 'رسالة الترحيب الافتراضية:' : 'Custom Greeting Message:'}
                  </label>
                  <textarea
                    rows={3}
                    value={tmplData.defaultData?.customMessage || ''}
                    onChange={(e) =>
                      setTmplData((prev) => ({
                        ...prev,
                        defaultData: { ...prev.defaultData, customMessage: e.target.value },
                      }))
                    }
                    className="w-full bg-[#171717] border border-[#333] rounded-xl p-3 text-xs text-[#F7F4EE] focus:border-[#B99A65] outline-none resize-none"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Live Canvas Interactive Preview Panel */}
        <div className="lg:col-span-7 bg-[#0D0D0D] flex flex-col items-center justify-center p-6 relative overflow-hidden">
          
          <div className="w-full max-w-sm aspect-[9/16] rounded-3xl border-2 border-[#B99A65]/60 shadow-[0_20px_60px_rgba(0,0,0,0.9)] p-6 relative flex flex-col justify-between overflow-hidden text-center"
               style={{
                 backgroundColor: tmplData.defaultColors?.background || '#0D0D0D',
                 color: tmplData.defaultColors?.text || '#F7F4EE',
                 fontFamily: tmplData.defaultFont || 'serif',
               }}>
            
            {/* Background Image if available */}
            {tmplData.coverImage && (
              <img
                src={tmplData.coverImage}
                alt="Template Cover"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Overlay Canvas Elements */}
            {tmplData.canvasElements?.map((el) => {
              if (el.type === 'icon') {
                const iconObj = AVAILABLE_ICONS.find((i) => i.name === el.content);
                const IconComponent = iconObj ? iconObj.Icon : Crown;
                return (
                  <div
                    key={el.id}
                    className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-lg"
                    style={{ left: `${el.position.x}%`, top: `${el.position.y}%` }}
                  >
                    <IconComponent className="w-8 h-8 text-[#B99A65]" />
                  </div>
                );
              }
              if (el.type === 'image') {
                return (
                  <div
                    key={el.id}
                    className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ left: `${el.position.x}%`, top: `${el.position.y}%` }}
                  >
                    <img src={el.content} alt="Canvas Asset" className="w-16 h-16 object-contain rounded-lg border border-[#B99A65]" />
                  </div>
                );
              }
              return (
                <div
                  key={el.id}
                  className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-[#B99A65] bg-black/60 px-3 py-1 rounded-full border border-[#B99A65]/40"
                  style={{ left: `${el.position.x}%`, top: `${el.position.y}%` }}
                >
                  {el.content}
                </div>
              );
            })}

            {/* Live Template Mock Body */}
            <div className="relative z-10 space-y-3 mt-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A65]/20 text-[#B99A65] border border-[#B99A65]/40 text-[10px] font-bold">
                <Crown className="w-3 h-3" />
                <span>{tmplData.title?.ar || 'معاينة حية للقالب'}</span>
              </div>

              <h2 className="text-2xl font-bold tracking-wide" style={{ color: tmplData.defaultColors?.primary || '#B99A65' }}>
                {tmplData.defaultData?.eventTitle || 'دعوة زفاف ملكية'}
              </h2>

              <p className="text-lg font-serif italic text-[#FAF7F2]">
                {tmplData.defaultData?.groomName} & {tmplData.defaultData?.brideName}
              </p>
            </div>

            <div className="relative z-10 space-y-2 mb-6">
              <p className="text-xs text-[#E9E1D5] italic opacity-90 px-4">
                "{tmplData.defaultData?.customMessage}"
              </p>
              <div className="pt-3 border-t border-[#B99A65]/30 text-[10px] font-mono text-[#B99A65]">
                {tmplData.defaultData?.venueName} • {tmplData.defaultData?.dressCode}
              </div>
            </div>

          </div>

          <p className="text-xs text-[#8D8A84] mt-4 font-mono">
            {isRtl ? '💡 أي تغيير في التنسيق أو الكانفز يظهر حياً فوراً في المعاينة' : '💡 Any edit renders live instantly in the canvas preview'}
          </p>

        </div>

      </div>
    </div>
  );
};
