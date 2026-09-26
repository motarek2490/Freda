import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Plus, Trash2, Upload, Sparkles, Camera, Loader2 } from 'lucide-react';
import { Language } from '../../../types';
import { processAndUploadImage } from '../../../lib/imageUploader';

interface GalleryTabProps {
  currentLang: Language;
  galleryImages: string[];
  onChangeGallery: (images: string[]) => void;
  onUploadImageFile?: (file: File) => void;
}

export const GalleryTab: React.FC<GalleryTabProps> = ({
  currentLang,
  galleryImages,
  onChangeGallery,
}) => {
  const isRtl = currentLang === 'ar';
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    onChangeGallery([...galleryImages, urlInput.trim()]);
    setUrlInput('');
  };

  const handleRemove = (index: number) => {
    onChangeGallery(galleryImages.filter((_, i) => i !== index));
  };

  const handleMobilePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const fileArray = Array.from(files);
    const newUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      setUploadProgressText(
        isRtl
          ? `جارٍ رفع ومعالجة الصورة (${i + 1} من ${fileArray.length})...`
          : `Processing & uploading photo (${i + 1} of ${fileArray.length})...`
      );
      try {
        const result = await processAndUploadImage(fileArray[i], `gallery_${i}`);
        if (result.url) {
          newUrls.push(result.url);
        }
      } catch (err) {
        console.warn('Error processing phone image:', err);
      }
    }

    if (newUrls.length > 0) {
      onChangeGallery([...galleryImages, ...newUrls]);
    }

    setIsUploading(false);
    setUploadProgressText('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Mobile-First Image Upload Box */}
      <div className="p-5 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#B99A65]" />
            <span>{isRtl ? 'معرض صور المناسبة الملكي:' : 'Event Royal Photo Gallery:'}</span>
          </h4>
          <span className="text-[11px] text-[#B99A65] font-mono font-bold bg-[#B99A65]/10 px-2.5 py-0.5 rounded-full border border-[#B99A65]/20">
            {galleryImages.length} {isRtl ? 'صور' : 'photos'}
          </span>
        </div>

        {/* Primary Action: Direct Phone Gallery / Camera Upload */}
        <div className="p-4 bg-gradient-to-r from-[#1F1E1B] to-[#171717] rounded-xl border border-[#B99A65]/30 space-y-3">
          <p className="text-xs text-[#E8DFC8] leading-relaxed">
            {isRtl
              ? '📸 يمكنك اختيار ورفع صور المناسبة مباشرة من ألبوم هاتفك أو الكاميرا بدقة فائقة وبشكل فوري:'
              : '📸 Upload event photos directly from your mobile gallery or camera in high definition:'}
          </p>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleMobilePhotosUpload}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#D4AF37] hover:from-[#d6bd91] hover:to-[#B99A65] text-[#171717] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#171717]" />
                <span>{uploadProgressText || (isRtl ? 'جارٍ رفع الصور...' : 'Uploading...')}</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 text-[#171717]" />
                <span>{isRtl ? 'اختيار صور من ألبوم الهاتف / الكاميرا (متعدد)' : 'Upload Photos from Mobile (Multi-Select)'}</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary: URL input */}
        <div className="pt-2 border-t border-[#2A2722] space-y-2">
          <label className="text-[11px] text-[#8D8A84] font-medium">
            {isRtl ? 'أو إضافة رابط صورة خارجي:' : 'Or add external image URL:'}
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-2 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#444] text-[#F7F4EE] font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#B99A65]" />
              <span>{isRtl ? 'إضافة' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of gallery images */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#F7F4EE]">
          {isRtl ? `معاينة صور المعرض (${galleryImages.length}):` : `Gallery Photos Preview (${galleryImages.length}):`}
        </label>

        {galleryImages.length === 0 ? (
          <div className="p-6 text-center rounded-xl border border-dashed border-[#333] bg-[#171717]">
            <ImageIcon className="w-8 h-8 text-[#666] mx-auto mb-2 opacity-60" />
            <p className="text-xs text-[#8D8A84]">
              {isRtl ? 'لم تتم إضافة صور للمعرض بعد. اضغط الزر الذهبي أعلاه لاختيار الصور من هاتفك.' : 'No photos added yet. Tap the gold button above to upload from your phone.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="relative group rounded-xl overflow-hidden aspect-square border border-[#333] bg-black/40 shadow-sm"
              >
                <img src={img} alt={`Gallery item ${i}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(i)}
                    className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer shadow-lg"
                    title={isRtl ? 'حذف الصورة' : 'Delete photo'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
