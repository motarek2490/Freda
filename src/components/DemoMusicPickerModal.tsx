import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Music,
  Play,
  Pause,
  X,
  Sparkles,
  Check,
  Search,
  Volume2,
  Disc3,
  SlidersHorizontal,
} from 'lucide-react';
import { getAllAvailableTracks, getCloudMusicLibrary, MusicTrack } from '../data/presetMusic';
import { Language } from '../types';

interface DemoMusicPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  activeTrackUrl?: string;
  activeTrackName?: string;
  onSelectTrack: (trackUrl: string, trackTitle: string) => void;
}

export const DemoMusicPickerModal: React.FC<DemoMusicPickerModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  activeTrackUrl,
  activeTrackName,
  onSelectTrack,
}) => {
  const isRtl = currentLang === 'ar';
  const [tracks, setTracks] = useState<MusicTrack[]>(() => getAllAvailableTracks());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewingTrackId, setPreviewingTrackId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch updated cloud tracks if available
  useEffect(() => {
    if (!isOpen) return;
    getCloudMusicLibrary().then((cloudTracks) => {
      if (cloudTracks && cloudTracks.length > 0) {
        setTracks(getAllAvailableTracks());
      }
    }).catch(() => {});
  }, [isOpen]);

  // Clean up preview audio on modal close or unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = useMemo(() => [
    { id: 'all', labelAr: 'جميع المعزوفات', labelEn: 'All Tracks' },
    { id: 'royal', labelAr: 'ملكي فاخر 👑', labelEn: 'Royal Gala 👑' },
    { id: 'wedding', labelAr: 'أعراس كلاسيكية 💍', labelEn: 'Classic Wedding 💍' },
    { id: 'engagement', labelAr: 'رومانسي وهادئ 💖', labelEn: 'Romantic & Soft 💖' },
    { id: 'classic', labelAr: 'أوركسترا عالمية 🎻', labelEn: 'Orchestral 🎻' },
    { id: 'floral', labelAr: 'أنغام الطبيعة 🌿', labelEn: 'Serene Nature 🌿' },
    { id: 'birthday', labelAr: 'احتفالي ومبهج 🎉', labelEn: 'Celebration 🎉' },
  ], []);

  const filteredTracks = useMemo(() => {
    return tracks.filter((t) => {
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
        (t.category && (t.category || '').toLowerCase().includes(q)) ||
        (t.label && (t.label || '').toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [tracks, selectedCategory, searchQuery]);

  const handleTogglePreview = (track: MusicTrack, e: React.MouseEvent) => {
    e.stopPropagation();
    const trackUrl = track.audioUrl || track.url;
    if (!trackUrl) return;

    if (previewingTrackId === track.id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPreviewingTrackId(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(trackUrl);
      previewAudioRef.current = audio;
      audio.play().then(() => {
        setPreviewingTrackId(track.id || track.url);
      }).catch(() => {
        setPreviewingTrackId(null);
      });
      audio.onended = () => {
        setPreviewingTrackId(null);
      };
    }
  };

  const handleChooseTrack = (track: MusicTrack) => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setPreviewingTrackId(null);

    const targetUrl = track.audioUrl || track.url;
    const targetTitle =
      track.title ||
      (typeof t_name(track) === 'string' ? t_name(track) : '') ||
      track.label ||
      'معزوفة فريدا الملكية';

    onSelectTrack(targetUrl, targetTitle);
    onClose();
  };

  const t_name = (track: MusicTrack) => {
    if (track.title) return track.title;
    if (typeof track.name === 'object' && track.name) {
      return isRtl ? track.name.ar : track.name.en || track.name.ar;
    }
    return track.name || track.label || '';
  };

  const isCurrentActive = (track: MusicTrack) => {
    const mainUrl = track.audioUrl || track.url;
    return Boolean(
      activeTrackUrl &&
        (activeTrackUrl === mainUrl ||
          (track.id && activeTrackUrl.includes(track.id)))
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-[#141416] border border-[#2E2C28] rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[88vh]"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-7 border-b border-[#2E2C28] bg-gradient-to-b from-[#1C1A17] to-[#141416]">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-1/4 w-60 h-24 bg-[#B99A65]/10 blur-3xl pointer-events-none rounded-full" />

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#B99A65]/15 border border-[#B99A65]/40 flex items-center justify-center text-[#B99A65] shadow-inner">
                  <Disc3 className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B99A65]/15 text-[#B99A65] text-[11px] font-mono font-medium mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{isRtl ? 'معزوفات التجربة الحية' : 'Live Demo Soundtrack'}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#F7F4EE] tracking-tight">
                    {isRtl ? 'اختر أغنية أو معزوفة لتشغيلها على الدعوة' : 'Select Soundtrack for this Invitation'}
                  </h3>
                  <p className="text-xs text-[#A8A49C] mt-0.5">
                    {isRtl
                      ? 'يمكنك تجربة جميع المقطوعات وسماع تناغمها مع التصميم مباشرة'
                      : 'Preview and listen to how each melody complements this design'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[#201F1D] border border-[#333] hover:border-[#B99A65] text-[#A8A49C] hover:text-[#F7F4EE] flex items-center justify-center transition-all cursor-pointer shadow-sm"
                title={isRtl ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Currently Playing Bar (if any) */}
            {activeTrackName && (
              <div className="mt-4 p-2.5 px-3.5 rounded-xl bg-[#201E1A] border border-[#B99A65]/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#E9E1D5] truncate">
                  <Volume2 className="w-4 h-4 text-[#B99A65] shrink-0 animate-pulse" />
                  <span className="text-[#A8A49C]">{isRtl ? 'المعزوفة الحالية:' : 'Current Track:'}</span>
                  <span className="font-semibold text-[#B99A65] truncate">{activeTrackName}</span>
                </div>
                <span className="hidden sm:inline-block text-[10px] text-[#A8A49C] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/5">
                  {isRtl ? 'مشغلة الآن' : 'Active'}
                </span>
              </div>
            )}

            {/* Search Input */}
            <div className="mt-4 relative">
              <Search className={`w-4 h-4 text-[#A8A49C] absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRtl ? 'ابحث باسم الأغنية أو النمط...' : 'Search by track name or style...'}
                className={`w-full py-2.5 rounded-xl bg-[#0F0E10] border border-[#2E2C28] text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65] transition-all shadow-inner ${
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 text-xs text-[#888] hover:text-[#fff] ${isRtl ? 'left-3' : 'right-3'}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Categories Scrollable Row */}
            <div className="mt-3.5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#B99A65] text-[#171717] font-bold shadow-md'
                      : 'bg-[#1C1A17] text-[#A8A49C] hover:text-[#F7F4EE] border border-[#2E2C28]'
                  }`}
                >
                  {isRtl ? cat.labelAr : cat.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Tracks List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 custom-scrollbar">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-12 text-[#888] space-y-2">
                <Music className="w-10 h-10 mx-auto opacity-30 text-[#B99A65]" />
                <p className="text-xs">{isRtl ? 'لم يتم العثور على معزوفات مطابقة للبحث' : 'No matching tracks found'}</p>
              </div>
            ) : (
              filteredTracks.map((track) => {
                const isSelected = isCurrentActive(track);
                const isPreviewing = previewingTrackId === track.id;
                const trackName = t_name(track);

                return (
                  <div
                    key={track.id}
                    onClick={() => handleChooseTrack(track)}
                    className={`group relative p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#221F1A] border-[#B99A65] shadow-[0_0_20px_rgba(185,154,101,0.25)]'
                        : 'bg-[#1A1816]/70 border-[#2A2722] hover:bg-[#201D1A] hover:border-[#B99A65]/50'
                    }`}
                  >
                    {/* Left/Start side: Play button & info */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Preview Play/Pause button */}
                      <button
                        type="button"
                        onClick={(e) => handleTogglePreview(track, e)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm ${
                          isPreviewing
                            ? 'bg-[#B99A65] text-[#171717] scale-105 shadow-[0_0_12px_rgba(185,154,101,0.5)]'
                            : isSelected
                            ? 'bg-[#B99A65]/20 text-[#B99A65] border border-[#B99A65]/40 hover:bg-[#B99A65] hover:text-[#171717]'
                            : 'bg-[#2A2722] text-[#A8A49C] group-hover:bg-[#B99A65]/20 group-hover:text-[#B99A65]'
                        }`}
                        title={isPreviewing ? (isRtl ? 'إيقاف المعاينة' : 'Pause Preview') : (isRtl ? 'استماع سريع' : 'Quick Preview')}
                      >
                        {isPreviewing ? (
                          <Pause className="w-4 h-4 fill-current" />
                        ) : (
                          <Play className="w-4 h-4 fill-current translate-x-0.5 rtl:-translate-x-0.5" />
                        )}
                      </button>

                      {/* Track Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs sm:text-sm font-bold truncate ${
                              isSelected ? 'text-[#B99A65]' : 'text-[#F7F4EE] group-hover:text-[#B99A65]'
                            }`}
                          >
                            {trackName}
                          </h4>
                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#171717] bg-[#B99A65] px-2 py-0.5 rounded-full shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>{isRtl ? 'الحالية' : 'Active'}</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-[#888] mt-0.5 font-mono">
                          {track.category && (
                            <span className="capitalize px-1.5 py-0.5 rounded bg-black/30 border border-white/5 text-[10px]">
                              {track.category}
                            </span>
                          )}
                          {track.artist && <span>• {track.artist}</span>}
                          {track.duration && <span>• {track.duration}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Right/End side: Action Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChooseTrack(track);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                          isSelected
                            ? 'bg-[#B99A65]/20 text-[#B99A65] border border-[#B99A65]/50'
                            : 'bg-[#B99A65] text-[#171717] hover:bg-[#d6bd91]'
                        }`}
                      >
                        {isSelected
                          ? isRtl ? 'مشغلة الآن 🎶' : 'Playing 🎶'
                          : isRtl ? 'تشغيل على الدعوة' : 'Apply to Demo'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3.5 px-6 border-t border-[#2E2C28] bg-[#101012] flex items-center justify-between text-[11px] text-[#888]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isRtl ? 'الموسيقى تتغير فورياً بدون إعادة تحميل الصفحة' : 'Soundtrack updates live without reloading'}</span>
            </div>
            <button
              onClick={onClose}
              className="text-xs text-[#A8A49C] hover:text-[#F7F4EE] underline cursor-pointer"
            >
              {isRtl ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
