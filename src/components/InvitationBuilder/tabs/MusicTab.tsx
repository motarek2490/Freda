import React, { useRef, useState, useMemo } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  Upload,
  Scissors,
  Sparkles,
  Loader2,
  Search,
  Filter,
} from 'lucide-react';
import { MusicTrack } from '../../../data/presetMusic';
import { Language } from '../../../types';

interface MusicTabProps {
  currentLang: Language;
  selectedTrackUrl?: string;
  selectedTrackName?: string;
  musicTracks: MusicTrack[];
  isPlayingPreview: boolean;
  onSelectTrack: (track: MusicTrack) => void;
  onTogglePreview: () => void;
  onUploadCustomFile: (file: File) => void;
}

export const MusicTab: React.FC<MusicTabProps> = ({
  currentLang,
  selectedTrackUrl,
  selectedTrackName,
  musicTracks,
  isPlayingPreview,
  onSelectTrack,
  onTogglePreview,
  onUploadCustomFile,
}) => {
  const isRtl = currentLang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState(16);

  const filteredTracks = useMemo(() => {
    return musicTracks.filter((t) => {
      if (!t) return false;
      const matchCategory =
        selectedCategory === 'all' ||
        (t.category || '').toLowerCase() === (selectedCategory || '').toLowerCase();
      const title = (
        t.title ||
        (typeof t.name === 'object' && t.name ? t.name.ar || t.name.en : t.name) ||
        t.label ||
        ''
      ).toLowerCase();
      const q = (searchQuery || '').toLowerCase().trim();
      const matchSearch =
        !q ||
        title.includes(q) ||
        (t.artist && (t.artist || '').toLowerCase().includes(q)) ||
        (t.label && (t.label || '').toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [musicTracks, selectedCategory, searchQuery]);

  const displayedTracks = useMemo(() => {
    return filteredTracks.slice(0, displayCount);
  }, [filteredTracks, displayCount]);

  return (
    <div className="space-y-5">
      {/* Header & Currently Selected Track */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#171717] rounded-2xl border border-[#2E2C28]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePreview}
            disabled={!selectedTrackUrl}
            className="w-11 h-11 rounded-xl bg-[#B99A65] hover:bg-[#d6bd91] text-[#171717] flex items-center justify-center transition-all cursor-pointer shadow-md disabled:opacity-40"
            title={isPlayingPreview ? (isRtl ? 'إيقاف' : 'Pause') : (isRtl ? 'استماع للمقطوعة المحددة' : 'Play')}
          >
            {isPlayingPreview ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current" />
            )}
          </button>
          <div>
            <h4 className="text-xs font-bold text-[#F7F4EE]">
              {selectedTrackName || (isRtl ? 'لم يتم اختيار مقطوعة موسيقية' : 'No track selected')}
            </h4>
            <p className="text-[11px] text-[#8D8A84] mt-0.5">
              {isRtl ? 'تعمل تلقائياً كخلفية تفاعلية عند فتح الضيف للدعوة.' : 'Plays smoothly in the background.'}
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUploadCustomFile(f);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#444] text-[#F7F4EE] text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'رفع أغنية خاصة وقصها ✂️' : 'Upload & Trim Audio ✂️'}</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-[#171717] p-2.5 rounded-2xl border border-[#2A2722]">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#8D8A84] absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث في مكتبة الموسيقى...' : 'Search music catalog...'}
            className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl pl-3 pr-8 py-1.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#1F1E1B] border border-[#333] rounded-xl px-3 py-1.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
        >
          <option value="all">{isRtl ? 'جميع التصنيفات' : 'All Categories'}</option>
          <option value="royal">{isRtl ? 'ملكي فاخر' : 'Royal'}</option>
          <option value="wedding">{isRtl ? 'زفاف وحفلات' : 'Wedding'}</option>
          <option value="engagement">{isRtl ? 'خطوبة' : 'Engagement'}</option>
          <option value="classic">{isRtl ? 'كلاسيك وهادئ' : 'Classic'}</option>
          <option value="birthday">{isRtl ? 'احتفالات' : 'Celebration'}</option>
        </select>
      </div>

      {/* Available Tracks Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#F7F4EE] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'المكتبة الصوتية المعتمدة:' : 'Royal Music Library:'}</span>
          </span>
          <span className="text-[11px] text-[#8D8A84]">({filteredTracks.length} معزوفة)</span>
        </label>

        {displayedTracks.length === 0 ? (
          <div className="p-6 text-center bg-[#171717] rounded-2xl border border-[#2E2C28] text-xs text-[#8D8A84]">
            {isRtl ? 'لا توجد مقطوعة تطابق البحث الحالي.' : 'No tracks found matching your search.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {displayedTracks.map((t) => {
              const trackAudioUrl = t.audioUrl || t.url;
              const isSelected = selectedTrackUrl === trackAudioUrl || selectedTrackUrl === t.url;
              const title = t.title || (typeof t.name === 'object' ? (isRtl ? t.name.ar : t.name.en) : t.name) || t.label || '';

              return (
                <button
                  key={t.id || t.url}
                  type="button"
                  onClick={() => onSelectTrack(t)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#B99A65]/15 border-[#B99A65] text-[#F7F4EE] shadow-sm'
                      : 'bg-[#171717] border-[#333] text-[#8D8A84] hover:text-[#F7F4EE] hover:border-[#444]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#B99A65] text-[#171717]' : 'bg-[#242424] text-[#8D8A84]'
                      }`}
                    >
                      <Music className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F7F4EE] line-clamp-1">
                        {title}
                      </p>
                      <span className="text-[10px] text-[#8D8A84] uppercase font-mono">{t.category}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-md bg-[#B99A65] text-[#171717] text-[10px] font-bold shrink-0">
                      {isRtl ? 'مختارة' : 'Active'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {filteredTracks.length > displayCount && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setDisplayCount((prev) => prev + 16)}
              className="text-xs text-[#B99A65] hover:underline font-bold"
            >
              {isRtl ? `عرض المزيد (+16)...` : 'Load more...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
