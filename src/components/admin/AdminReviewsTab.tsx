import React, { useState } from 'react';
import {
  Star,
  Search,
  Trash2,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { WebsiteReview, Language } from '../../types';

interface AdminReviewsTabProps {
  currentLang: Language;
  reviews: WebsiteReview[];
  onDeleteReview: (reviewId: string) => Promise<void>;
}

export const AdminReviewsTab: React.FC<AdminReviewsTabProps> = ({
  currentLang,
  reviews,
  onDeleteReview,
}) => {
  const isRtl = currentLang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.comment || '').toLowerCase().includes(q) ||
      (r.eventType || '').toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteReview(id);
    } catch (err) {
      console.warn('Error deleting review:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-[#1F1E1B] p-4 rounded-2xl border border-[#2E2C28]">
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 text-[#8D8A84] absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث في آراء وتقييمات العملاء...' : 'Search reviews...'}
            className={`w-full bg-[#171717] border border-[#333] rounded-xl py-2 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65] transition-colors ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        <div className="text-xs text-[#8D8A84] font-semibold">
          {isRtl ? `إجمالي التقييمات: ${reviews.length}` : `Total Reviews: ${reviews.length}`}
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-[#1F1E1B] rounded-3xl border border-[#2E2C28] p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-[#333] flex items-center justify-center text-[#8D8A84] mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h4 className="text-[#F7F4EE] font-bold text-sm">
            {isRtl ? 'لا توجد تقييمات مسجلة بعد' : 'No reviews recorded yet'}
          </h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((r, idx) => (
            <div
              key={r.id ? `rev-${r.id}-${idx}` : `rev-item-${idx}`}
              className="bg-[#1F1E1B] rounded-2xl p-5 border border-[#2E2C28] space-y-3"
            >
              {/* Header: Name & Stars */}
              <div className="flex items-center justify-between gap-2">
                <h5 className="font-bold text-sm text-[#F7F4EE] line-clamp-1">{r.customerName}</h5>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={`star-${i}`}
                      className={`w-3.5 h-3.5 ${
                        i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Event type & Date */}
              <div className="flex items-center justify-between text-[11px] text-[#8D8A84]">
                <span>{r.eventType || (isRtl ? 'حفل زفاف ملكي' : 'Wedding')}</span>
                <span>{new Date(r.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
              </div>

              {/* Comment */}
              <p className="text-xs text-[#D8D4CC] leading-relaxed bg-[#171717] p-3 rounded-xl border border-[#262420]">
                "{r.comment}"
              </p>

              {/* Delete */}
              <div className="flex justify-end pt-2 border-t border-[#2A2722]">
                <button
                  onClick={() => handleDelete(r.id)}
                  disabled={deletingId === r.id}
                  className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {deletingId === r.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>{isRtl ? 'حذف' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
