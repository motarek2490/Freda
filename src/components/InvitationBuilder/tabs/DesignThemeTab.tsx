import React, { useRef, useState } from 'react';
import { Palette, Type, Image as ImageIcon, Sparkles, Upload, Check, Camera, Loader2, Trash2 } from 'lucide-react';
import { CustomThemeColors, Language } from '../../../types';
import { processAndUploadImage } from '../../../lib/imageUploader';

interface DesignThemeTabProps {
  currentLang: Language;
  themeColors: CustomThemeColors;
  setThemeColors: React.Dispatch<React.SetStateAction<CustomThemeColors>>;
  customFont: string;
  setCustomFont: (font: string) => void;
  coverImageUrl?: string;
  onCoverImageUpload?: (file: File) => void;
  onCoverImageUrlChange?: (url: string) => void;
}

const COLOR_PRESETS = [
  { name: 'Royal Gold', primary: '#B99A65', secondary: '#171717', accent: '#F7F4EE', background: '#0D0D0D' },
  { name: 'Rose Gold Luxury', primary: '#D4AF37', secondary: '#24141E', accent: '#E8C5B8', background: '#12090F' },
  { name: 'Emerald Velvet', primary: '#2E7D32', secondary: '#1B2E1D', accent: '#E0F2E9', background: '#0B140D' },
  { name: 'Midnight Sapphire', primary: '#1976D2', secondary: '#0D1E3A', accent: '#DDF0FF', background: '#070E1A' },
  { name: 'Burgundy Velvet', primary: '#881337', secondary: '#2A0812', accent: '#FCE7F3', background: '#140308' },
  { name: 'Pearl Minimal', primary: '#78716C', secondary: '#F5F5F4', accent: '#292524', background: '#FAFAF9' },
];

const ARABIC_FONTS = [
  { label: 'Amiri (أميري عثماني فاخر)', value: 'Amiri', preview: 'ألف ليلة وليلة - دعوة ملكية' },
  { label: 'El Messiri (المسيري ناعم وأنيق)', value: 'El Messiri', preview: 'حفل زفاف مبارك وميمون' },
  { label: 'Reem Kufi (ريم كوفي هندسي راقٍ)', value: 'Reem Kufi', preview: 'ليلة العمر والبهجة والسرور' },
  { label: 'Tajawal (تجوال عصري وحديث)', value: 'Tajawal', preview: 'يشرفنا حضوركم ومشاركتنا' },
  { label: 'Cairo (كايرو واضح ومميز)', value: 'Cairo', preview: 'فرحتنا تكتمل بوجودكم' },
  { label: 'Noto Kufi Arabic (نوتو كوفي رسمي)', value: 'Noto Kufi Arabic', preview: 'أجمل ليالي الفرح والسرور' },
  { label: 'Lateef (لطيف رشيق وانسيابي)', value: 'Lateef', preview: 'لحظات استثنائية لا تُنسى' },
  { label: 'Ruwudu (رودو نسخي فخم)', value: 'Ruwudu', preview: 'أهلاً وسهلاً بضيوفنا الكرام' },
  { label: 'Beiruti (بيروتي لمسة عريقة)', value: 'Beiruti', preview: 'موعدنا في ليلة الأحلام' },
  { label: 'Zain (زين جذاب وممتلئ)', value: 'Zain', preview: 'طابت لياليكم بكل خير' },
];

const ENGLISH_FONTS = [
  { label: 'Cormorant Garamond (Royal Aristocratic)', value: 'Cormorant Garamond', preview: 'Together with their families' },
  { label: 'Playfair Display (Classic High-End)', value: 'Playfair Display', preview: 'Save the Date for Our Wedding' },
  { label: 'Great Vibes (Romantic Script Calligraphy)', value: 'Great Vibes', preview: 'Forever & Always in Love' },
  { label: 'Bodoni Moda (Couture & High Fashion)', value: 'Bodoni Moda', preview: 'An Evening of Luxury' },
  { label: 'Cinzel (Majestic Roman Carving)', value: 'Cinzel', preview: 'The Royal Wedding Gala' },
  { label: 'Marcellus (Athenian Elegance)', value: 'Marcellus', preview: 'Honored to Invite You' },
  { label: 'Italiana (Ultra-Refined Milanese)', value: 'Italiana', preview: 'A Grand Celebration of Love' },
  { label: 'Montserrat (Modern Editorial Sans)', value: 'Montserrat', preview: 'Celebrate with Us' },
  { label: 'Lora (Warm Literary Romance)', value: 'Lora', preview: 'Request the Pleasure of Your Company' },
  { label: 'Dancing Script (Playful & Joyful Flow)', value: 'Dancing Script', preview: 'Join Us for a Magical Night' },
];

const FONT_OPTIONS = [...ARABIC_FONTS, ...ENGLISH_FONTS];

export const DesignThemeTab: React.FC<DesignThemeTabProps> = ({
  currentLang,
  themeColors,
  setThemeColors,
  customFont,
  setCustomFont,
  coverImageUrl,
  onCoverImageUpload,
  onCoverImageUrlChange,
}) => {
  const isRtl = currentLang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [fontLanguageTab, setFontLanguageTab] = useState<'ar' | 'en'>(isRtl ? 'ar' : 'en');

  const handleMobileCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    try {
      const res = await processAndUploadImage(file, 'cover_image');
      if (res.url && onCoverImageUrlChange) {
        onCoverImageUrlChange(res.url);
      }
    } catch (err) {
      console.warn('Cover photo upload error:', err);
    } finally {
      setIsUploadingCover(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleColorChange = (key: keyof CustomThemeColors, val: string) => {
    setThemeColors((prev) => {
      const updated = { ...prev, [key]: val };
      if (key === 'primary') updated.accent = val;
      if (key === 'background') updated.bg = val;
      if (key === 'secondary') updated.cardBg = val;
      return updated;
    });
  };

  const handleApplyPreset = (p: typeof COLOR_PRESETS[0]) => {
    setThemeColors({
      bg: p.background,
      cardBg: p.secondary,
      text: p.background === '#FAFAF9' ? '#171717' : '#F7F4EE',
      accent: p.primary,
      primary: p.primary,
      secondary: p.secondary,
      background: p.background,
    });
  };

  return (
    <div className="space-y-8">
      {/* Palette Presets */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B99A65]" />
          <span>{isRtl ? 'أنماط ألوان ملكية جاهزة:' : 'Curated Color Presets:'}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-3 rounded-2xl bg-[#171717] border border-[#333] hover:border-[#B99A65] text-left transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="text-xs font-semibold text-[#F7F4EE] group-hover:text-[#B99A65]">
                {p.name}
              </span>
              <div className="flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: p.primary }} />
                <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: p.secondary }} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="p-4 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-4">
        <h4 className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-[#B99A65]" />
          <span>{isRtl ? 'تخصيص لوحة الألوان الدقيقة:' : 'Custom Palette Colors:'}</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {/* Primary */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-[#8D8A84] font-medium">{isRtl ? 'اللون الرئيسي:' : 'Primary:'}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeColors.primary || '#B99A65'}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <span className="text-[11px] text-[#F7F4EE] font-mono">{themeColors.primary}</span>
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-[#8D8A84] font-medium">{isRtl ? 'اللون الثانوي:' : 'Secondary:'}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeColors.secondary || '#171717'}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <span className="text-[11px] text-[#F7F4EE] font-mono">{themeColors.secondary}</span>
            </div>
          </div>

          {/* Background */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-[#8D8A84] font-medium">{isRtl ? 'لون الخلفية:' : 'Background:'}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeColors.background || '#0D0D0D'}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <span className="text-[11px] text-[#F7F4EE] font-mono">{themeColors.background}</span>
            </div>
          </div>

          {/* Accent */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-[#8D8A84] font-medium">{isRtl ? 'لون التمييز:' : 'Accent:'}</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={themeColors.accent || '#F7F4EE'}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer"
              />
              <span className="text-[11px] text-[#F7F4EE] font-mono">{themeColors.accent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'الخط والطباعة الملكية (20 خطاً استثنائياً):' : 'Typography & Royal Font Family (20 Luxury Fonts):'}</span>
          </label>

          {/* Language Category Filter */}
          <div className="flex items-center gap-1 bg-[#171717] p-1 rounded-xl border border-[#333] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFontLanguageTab('ar')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontLanguageTab === 'ar'
                  ? 'bg-[#B99A65] text-[#171717] shadow-sm'
                  : 'text-[#8D8A84] hover:text-[#F7F4EE]'
              }`}
            >
              {isRtl ? 'الخطوط العربية (10)' : 'Arabic Fonts (10)'}
            </button>
            <button
              type="button"
              onClick={() => setFontLanguageTab('en')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                fontLanguageTab === 'en'
                  ? 'bg-[#B99A65] text-[#171717] shadow-sm'
                  : 'text-[#8D8A84] hover:text-[#F7F4EE]'
              }`}
            >
              {isRtl ? 'الخطوط الإنجليزية (10)' : 'English Fonts (10)'}
            </button>
          </div>
        </div>

        {/* Selected Font Indicator */}
        <div className="text-[11px] text-[#B99A65] flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B99A65]/10 border border-[#B99A65]/30">
          <span>{isRtl ? 'الخط المطبق حالياً:' : 'Active Font:'}</span>
          <strong className="font-semibold text-[#F7F4EE]">{customFont || 'Playfair Display'}</strong>
        </div>

        {/* Font Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
          {(fontLanguageTab === 'ar' ? ARABIC_FONTS : ENGLISH_FONTS).map((f) => {
            const isSelected = customFont === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setCustomFont(f.value)}
                className={`p-3.5 rounded-2xl border text-right flex flex-col gap-1.5 transition-all cursor-pointer text-start ${
                  isSelected
                    ? 'bg-[#B99A65]/15 border-[#B99A65] text-[#F7F4EE] shadow-[0_0_15px_rgba(185,154,101,0.2)]'
                    : 'bg-[#171717] border-[#333] text-[#8D8A84] hover:text-[#F7F4EE] hover:border-[#555]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[#E9E1D5]">
                    {f.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[#B99A65] shrink-0" />}
                </div>
                <div
                  style={{ fontFamily: `'${f.value}', sans-serif` }}
                  className="text-base text-[#F7F4EE] tracking-normal pt-1 border-t border-white/5 truncate"
                >
                  {f.preview}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cover Image Upload / URL */}
      <div className="p-4 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'صورة الغلاف وخلفية الدعوة (Cover Background):' : 'Main Cover / Background Image:'}</span>
          </label>
        </div>

        {/* Cover Preview & Mobile Upload Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-28 h-20 rounded-xl overflow-hidden border border-[#B99A65]/40 bg-black/40 shrink-0">
            {coverImageUrl ? (
              <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#666] text-xs">
                {isRtl ? 'لا توجد صورة' : 'No image'}
              </div>
            )}
            {isUploadingCover && (
              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-[#B99A65] animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2 w-full">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleMobileCoverUpload}
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingCover}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#D4AF37] hover:from-[#d6bd91] hover:to-[#B99A65] text-[#171717] text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isRtl ? '📸 رفع صورة الغلاف من الهاتف' : '📸 Upload Cover from Mobile'}</span>
              </button>

              {coverImageUrl && onCoverImageUrlChange && (
                <button
                  type="button"
                  onClick={() => onCoverImageUrlChange('')}
                  className="px-3 py-2 rounded-xl bg-[#2A2722] hover:bg-red-950/40 text-red-400 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'حذف' : 'Remove'}</span>
                </button>
              )}
            </div>

            <input
              type="url"
              value={coverImageUrl || ''}
              onChange={(e) => onCoverImageUrlChange && onCoverImageUrlChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-1.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
