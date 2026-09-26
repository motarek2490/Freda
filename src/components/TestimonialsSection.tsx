import React, { useEffect, useState } from 'react';
import {
  Star,
  MessageSquarePlus,
  Sparkles,
  Quote,
  CheckCircle,
  HeartHandshake,
} from 'lucide-react';
import { WebsiteReview, Language } from '../types';
import { subscribeWebsiteReviewsCloud } from '../lib/firestoreService';
import { ReviewModal } from './ReviewModal';
import { BRAND_NAME, BRAND_NAME_AR } from '../config/brand';
import { colors, typography } from '../styles/designTokens';

interface TestimonialsSectionProps {
  currentLang: Language;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ currentLang }) => {
  const isRtl = currentLang === 'ar';
  const [reviews, setReviews] = useState<WebsiteReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const unsub = subscribeWebsiteReviewsCloud((cloudReviews) => {
      // ONLY keep truly approved reviews verified in Firestore
      const approvedOnly = (cloudReviews || []).filter((r) => r.approved === true);
      setReviews(approvedOnly);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const hasReviews = reviews.length > 0;

  // Real Average Rating based strictly on real reviews
  const avgRating = hasReviews
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section
      id="reviews"
      aria-label={isRtl ? 'لحظات شاركوها معنا' : 'Moments Shared With Us'}
      className="relative py-24 sm:py-32 bg-[#080808] text-[#F4EFE7] border-t border-[#C9A86A]/15 overflow-hidden"
    >
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#C9A86A]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C9A86A]/30 bg-[#111111] text-[#C9A86A] text-xs font-semibold tracking-widest uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'شهادات وتجارب معتمدة' : 'VERIFIED EXPERIENCES'}</span>
          </div>

          <h2
            style={{
              fontFamily: isRtl ? typography.fonts.display.ar : typography.fonts.display.en,
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F4EFE7] leading-tight"
          >
            {isRtl ? (
              <>
                لحظات <span className="gold-shimmer-text italic">شاركوها معنا</span>
              </>
            ) : (
              <>
                Moments <span className="gold-shimmer-text italic">Shared With Us</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#D9C8A5]/80 font-light leading-relaxed max-w-2xl mx-auto">
            {isRtl
              ? 'انطباعات وكلمات صادقة من أصحاب الدعوات الذين وثّقوا مناسباتهم الملكية عبر فريدا.'
              : 'Genuine words and impressions from hosts who elevated their celebrations with FRIDA.'}
          </p>

          {/* Genuine Real Metric Banner (Only rendered when real reviews exist in Firestore) */}
          {hasReviews && avgRating && (
            <div className="inline-flex items-center gap-4 bg-[#111111] border border-[#C9A86A]/30 rounded-2xl px-5 py-2.5 shadow-xl mt-2">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-base text-[#F4EFE7]">{avgRating}</span>
                <span className="text-xs text-[#D9C8A5]/60">/ 5.0</span>
              </div>
              <div className="h-4 w-px bg-[#C9A86A]/20" />
              <span className="text-xs text-[#D9C8A5] font-semibold">
                {reviews.length} {isRtl ? 'تقييم معتمد من العملاء' : 'Verified Reviews'}
              </span>
            </div>
          )}
        </div>

        {/* Real Reviews Cards Grid or Honest Clean Invite State */}
        {hasReviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {reviews.map((rev) => (
              <article
                key={rev.id}
                className="bg-[#111111] border border-[#C9A86A]/20 hover:border-[#C9A86A]/60 transition-all duration-300 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative group shadow-xl hover:-translate-y-1"
              >
                <Quote className="w-8 h-8 text-[#C9A86A]/20 absolute top-6 right-6 pointer-events-none" />

                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div
                    className="flex items-center gap-1 text-amber-400"
                    aria-label={`${rev.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (rev.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-[#F4EFE7]/90 leading-relaxed font-light italic">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-[#C9A86A]/15 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#F4EFE7]">{rev.customerName}</h3>
                    {rev.designTitle && (
                      <span className="text-xs text-[#C9A86A] block mt-0.5">{rev.designTitle}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#C9A86A] bg-[#C9A86A]/10 border border-[#C9A86A]/30 px-2 py-0.5 rounded-full font-mono">
                    <CheckCircle className="w-3 h-3 text-[#C9A86A]" />
                    <span>{isRtl ? 'موثق' : 'Verified'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* When no reviews yet, show an honest and dignified invitation to review without fake data */
          <div className="max-w-xl mx-auto bg-[#111111] rounded-3xl border border-[#C9A86A]/20 p-8 sm:p-10 text-center space-y-4 shadow-xl">
            <HeartHandshake className="w-10 h-10 text-[#C9A86A] mx-auto" />
            <h3 className="text-xl font-bold text-[#F4EFE7]">
              {isRtl ? 'شاركونا لحظاتكم وتجربتكم' : 'Share Your Celebration Experience'}
            </h3>
            <p className="text-xs sm:text-sm text-[#D9C8A5]/80 font-light leading-relaxed">
              {isRtl
                ? 'نقدّر كل كلمة وانطباع يتركه أصحاب الدعوات الكرام. شاركنا رأيك الصادق ليظهر هنا بعد اعتماده.'
                : 'We cherish genuine feedback from hosts celebrating with FRIDA. Share your thoughts to be featured.'}
            </p>
          </div>
        )}

        {/* Add Review CTA */}
        <div className="text-center pt-2">
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] border border-[#C9A86A]/40 text-[#D9C8A5] hover:text-[#080808] hover:bg-[#C9A86A] transition-all text-xs font-semibold cursor-pointer shadow-md"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{isRtl ? 'أضف تقييمك وتجربتك معنا' : 'Write a Review'}</span>
          </button>
        </div>

      </div>

      {showReviewModal && (
        <ReviewModal
          currentLang={currentLang}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </section>
  );
};
