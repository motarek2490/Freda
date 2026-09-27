import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Wand2,
  Check,
  RefreshCw,
  MessageSquare,
  Palette,
  Layout,
  Crown,
} from 'lucide-react';
import {
  suggestDesignConfigWithAI,
  generateWordingWithAI,
  AIDesignRecommendation,
} from '../lib/fridaAI';

interface FridaAIDirectorModalProps {
  onApplyRecommendation: (rec: AIDesignRecommendation) => void;
  onClose: () => void;
  isRtl?: boolean;
}

export const FridaAIDirectorModal: React.FC<FridaAIDirectorModalProps> = ({
  onApplyRecommendation,
  onClose,
  isRtl = true,
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIDesignRecommendation | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const rec = await suggestDesignConfigWithAI(prompt);
      setRecommendation(rec);
    } catch (err) {
      console.warn('AI Creative Director error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!recommendation) return;
    onApplyRecommendation(recommendation);
    onClose();
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-xl bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99A65]/20 border border-[#B99A65] text-[#C9A86A] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{isRtl ? 'المخرج الفني الذكي — FRIDA AI' : 'Frida AI Creative Director'}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'صمم تجربة زفافك بالذكاء الاصطناعي' : 'Design Your Wedding Experience with AI'}
          </h2>
          <p className="text-xs text-[#8D8A84]">
            {isRtl
              ? 'صف في جمل بسيطة رؤيتك وأجواء الفرح التي تحلم بها، وسيقوم المخرج الذكي باختيار الثيم، الألوان، النمط والتصميم الخاطف للأنفاس.'
              : 'Describe your dream wedding vibe and AI will formulate the perfect design configuration.'}
          </p>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isRtl
                ? 'مثال: عايز فرح كلاسيكي ملكي فخم باللون الكحلي والذهبي مع افتتاحية شمع ملكية وأبيات شعر راقية...'
                : 'e.g. I want a classic royal wedding in navy & gold with interactive wax seal...'
            }
            className="w-full bg-[#1F1E1B] border border-[#333] focus:border-[#B99A65] rounded-2xl p-4 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none leading-relaxed"
          />

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#E6D7B8] to-[#B99A65] text-[#171717] font-mono font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#171717]" />
                <span>{isRtl ? 'جاري تحليل الرؤية وصياغة التصميم...' : 'Designing with AI...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-[#171717]" />
                <span>{isRtl ? 'توليد الرؤية والتصميم الفني ✨' : 'Generate Design Concept'}</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Recommendation Card */}
        {recommendation && (
          <div className="p-5 rounded-2xl bg-[#1F1E1B] border border-[#B99A65]/60 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#333] pb-3">
              <span className="text-xs font-bold text-[#C9A86A] flex items-center gap-1.5">
                <Crown className="w-4 h-4" />
                <span>{isRtl ? 'توصيات المخرج الذكي المعتمدة:' : 'AI Design Output:'}</span>
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[#2A2722] text-[#E9E1D5]">
                {recommendation.wordingTone}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#171717] border border-[#333]">
                <span className="text-[10px] text-[#8D8A84] block mb-1">
                  {isRtl ? 'الألوان المقترحة:' : 'Color Palette:'}
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: recommendation.colors.bg }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: recommendation.colors.cardBg }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-white/20"
                    style={{ backgroundColor: recommendation.colors.accent }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#171717] border border-[#333]">
                <span className="text-[10px] text-[#8D8A84] block mb-1">
                  {isRtl ? 'افتتاحية المغلف:' : 'Opening:'}
                </span>
                <strong className="text-[#F7F4EE] font-mono text-[11px]">
                  {recommendation.openingExperience}
                </strong>
              </div>
            </div>

            {recommendation.suggestedPoeticMessage && (
              <div className="p-3.5 rounded-xl bg-[#171717] border border-[#333] text-xs space-y-1">
                <span className="text-[10px] text-[#C9A86A] font-bold block">
                  {isRtl ? 'البيت الشعري المقترح:' : 'Suggested Greeting:'}
                </span>
                <p className="text-[#E9E1D5] font-serif italic leading-relaxed">
                  "{recommendation.suggestedPoeticMessage}"
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isRtl ? 'تطبيق هذا التصميم فوراً على دعوتي ✨' : 'Apply AI Concept Now'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
