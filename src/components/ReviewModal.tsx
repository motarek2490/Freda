import React, { useState } from 'react';
import { Star, X, CheckCircle, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { WebsiteReview, Language } from '../types';
import { saveWebsiteReviewCloud } from '../lib/firestoreService';

interface ReviewModalProps {
  currentLang: Language;
  invitationTitle?: string;
  designTitle?: string;
  onClose: () => void;
  onSubmitted?: (review: WebsiteReview) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  currentLang,
  invitationTitle,
  designTitle,
  onClose,
  onSubmitted,
}) => {
  const isRtl = currentLang === 'ar';
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    const newReview: WebsiteReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      customerName: customerName.trim(),
      rating,
      comment: comment.trim(),
      invitationTitle,
      designTitle,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveWebsiteReviewCloud(newReview);
      setSubmitted(true);
      if (onSubmitted) onSubmitted(newReview);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.warn('Failed to submit review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#1E1E1E] border border-[#B99A65]/50 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-[#F7F4EE]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 sm:left-6 text-[#8D8A84] hover:text-[#F7F4EE] transition-colors p-2 rounded-full hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-xl">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="font-playfair text-2xl font-bold gold-shimmer-text">
              {isRtl ? 'شُكراً لتقييمك الرائع! 🌟' : 'Thank You for Your Review!'}
            </h3>
            <p className="text-xs text-[#8D8A84] leading-relaxed max-w-xs mx-auto">
              {isRtl
                ? 'تم حفظ تقييمك وتعليقك بنجاح وسيظهر في قسم آراء وتقييمات العملاء المتميزة.'
                : 'Your review has been saved successfully and will appear in our featured customer testimonials.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99A65]/15 border border-[#B99A65]/30 text-[#B99A65] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRtl ? 'تقييم تجربة فريدا' : 'Rate Your Experience'}</span>
              </div>

              <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
                {isRtl ? 'كيف كانت تجربتك في تصميم دعوتك؟' : 'How was your experience?'}
              </h3>
              
              <p className="text-xs text-[#8D8A84]">
                {isRtl
                  ? 'رأيك يهمنا لمساعدتنا في تقديم أرقى التصميمات والخدمات الملكية'
                  : 'Your feedback helps us continuously refine our royal digital invitation templates'}
              </p>
            </div>

            {/* Interactive Star Rating */}
            <div className="flex flex-col items-center gap-2 bg-[#171717] p-4 rounded-2xl border border-[#333]">
              <span className="text-xs text-[#B99A65] font-semibold">
                {isRtl ? 'اختر عدد النجوم:' : 'Select Star Rating:'}
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          active
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                            : 'text-neutral-600 fill-transparent'
                        } transition-colors`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] text-[#8D8A84]">
                {rating === 5 && (isRtl ? 'ممتاز جداً 🌟🌟🌟🌟🌟' : 'Outstanding')}
                {rating === 4 && (isRtl ? 'جيد جداً 🌟🌟🌟🌟' : 'Very Good')}
                {rating === 3 && (isRtl ? 'جيد 🌟🌟🌟' : 'Good')}
                {rating === 2 && (isRtl ? 'مقبول 🌟🌟' : 'Fair')}
                {rating === 1 && (isRtl ? 'يحتاج تحسين 🌟' : 'Needs Improvement')}
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-4 text-start">
              <div>
                <label className="block text-xs font-semibold text-[#E9E1D5] mb-1.5">
                  {isRtl ? 'اسمك الكامل أو المضيف:' : 'Your Name / Host Name'} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isRtl ? 'مثال: أ. محمد العتيبي' : 'e.g., Mohammed Al-Otaibi'}
                  className="w-full bg-[#171717] border border-[#333] focus:border-[#B99A65] rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E9E1D5] mb-1.5">
                  {isRtl ? 'تعليقك وتقييمك للتصميم والمنصة:' : 'Your Comment & Feedback'} <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={isRtl ? 'اكتب رأيك وانطباعك عن تصميم الدعوة وسهولة الاستخدام...' : 'Write your feedback about the design and user experience...'}
                  className="w-full bg-[#171717] border border-[#333] focus:border-[#B99A65] rounded-xl p-3 text-xs text-[#F7F4EE] placeholder-[#666] outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !customerName.trim() || !comment.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_25px_rgba(185,154,101,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isSubmitting ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال التقييم والتعليق 🌟' : 'Submit Review')}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
