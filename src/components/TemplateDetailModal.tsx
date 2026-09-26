import React, { useState, useEffect } from 'react';
import { X, Sparkles, Edit3, Globe, Palette, CheckCircle2, ChevronLeft, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';
import { Template, Language } from '../types';
import { useTranslation } from '../data/translations';
import { trackViewTemplate } from '../lib/analytics';

interface TemplateDetailModalProps {
  template: Template | null;
  currentLang: Language;
  onClose: () => void;
  onStartCustomize: (template: Template) => void;
  onLivePreview?: (template: Template) => void;
}

export const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  template,
  currentLang,
  onClose,
  onStartCustomize,
  onLivePreview,
}) => {
  if (!template) return null;

  const t = useTranslation(currentLang);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (template) {
      trackViewTemplate(
        template.id,
        template.title[currentLang] || template.title.ar || template.title.en,
        template.category
      );
    }
  }, [template?.id, currentLang]);

  const images = template.galleryPreview.length > 0 ? template.galleryPreview : [template.coverImage];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#171717] border border-[#B99A65]/40 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col lg:flex-row">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] hover:border-[#B99A65] transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Large Gallery Image Viewer */}
        <div className="lg:w-1/2 relative bg-[#121212] min-h-[350px] lg:min-h-[500px] flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-[#333]">
          <div className="relative w-full h-full max-h-[420px] rounded-2xl overflow-hidden border border-[#B99A65]/30 shadow-2xl">
            <img
              src={images[activeImageIndex]}
              alt={template.title[currentLang]}
              className="w-full h-full object-cover transition-all duration-500"
            />

            {/* Gallery Navigation Overlay Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#171717]/80 border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#171717]/80 border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Thumbnail dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-[#171717]/80 px-3 py-1.5 rounded-full border border-[#333]">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeImageIndex ? 'bg-[#B99A65] w-5' : 'bg-[#8D8A84]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            
            {/* Badges */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-semibold tracking-widest bg-[#B99A65]/10 text-[#B99A65] border border-[#B99A65]/30 px-3 py-1 rounded-full">
                {t.categories[template.category]}
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest bg-[#1F1E1B] text-[#E9E1D5] border border-[#333] px-3 py-1 rounded-full">
                {t.themes[template.themeStyle]}
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
              {template.title[currentLang]}
            </h2>
            <p className="text-xs sm:text-sm text-[#8D8A84] leading-relaxed">
              {template.description[currentLang]}
            </p>

            {/* Feature Bullet Points */}
            <div className="bg-[#1F1E1B] rounded-2xl p-4 border border-[#333] space-y-2 text-xs text-[#E9E1D5]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B99A65]" />
                <span>
                  {currentLang === 'en' ? 'Bilingual Support (Arabic RTL & English LTR)' : 'دعم كامل للغتين العربية والإنجليزية'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B99A65]" />
                <span>
                  {currentLang === 'en' ? 'Real-time RSVP Confirmation & Guest Tracker' : 'تأكيد حضور تفاعلي وتتبع للضيوف'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B99A65]" />
                <span>
                  {currentLang === 'en' ? 'Interactive Maps, Calendar Sync & Music Ambience' : 'خرائط تفاعلية، ربط تقويم، وخلفية موسيقية'}
                </span>
              </div>
            </div>

            {/* Sample Event Information Preview */}
            <div className="space-y-2 pt-2 border-t border-[#333]">
              <p className="text-xs font-semibold text-[#B99A65] uppercase tracking-wider">
                {currentLang === 'en' ? 'Sample Event Info' : 'نموذج تفاصيل المناسبة'}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#8D8A84]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#B99A65]" />
                  <span>{template.defaultData.eventDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B99A65]" />
                  <span>{template.defaultData.eventTime}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B99A65]" />
                  <span className="truncate">{template.defaultData.venueName}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-[#333] space-y-3">
            {onLivePreview && (
              <button
                onClick={() => {
                  onClose();
                  onLivePreview(template);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#1F1E1B] border border-[#B99A65] text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {currentLang === 'ar'
                    ? 'تجربة الدعوة التفاعلية الكاملة (Live Demo) ✨'
                    : 'Experience Live Interactive Demo ✨'}
                </span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onStartCustomize(template);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(185,154,101,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{t.discovery.customizeNow}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
