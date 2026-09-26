import React, { useRef } from 'react';
import { Music, Play, Pause, Volume2, Upload, Scissors, Sparkles, Loader2 } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header & Quick Play/Pause */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#171717] rounded-2xl border border-[#2E2C28]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePreview}
            disabled={!selectedTrackUrl}
            className="w-11 h-11 rounded-xl bg-[#B99A65] hover:bg-[#d6bd91] text-[#171717] flex items-center justify-center transition-all cursor-pointer shadow-md disabled:opacity-40"
            title={isPlayingPreview ? 'إيقاف' : 'استماع للمقطوعة المحددة'}
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
            <span>{isRtl ? 'رفع أغنية خاصة وقصها' : 'Upload & Trim Audio'}</span>
          </button>
        </div>
      </div>

      {/* Available Tracks Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B99A65]" />
          <span>{isRtl ? 'اختر معزوفة من المكتبة الملكية المعتمدة:' : 'Select from Royal Library:'}</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
          {musicTracks.map((t) => {
            const isSelected = selectedTrackUrl === t.url;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTrack(t)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#B99A65]/15 border-[#B99A65] text-[#F7F4EE]'
                    : 'bg-[#171717] border-[#333] text-[#8D8A84] hover:text-[#F7F4EE]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#B99A65] text-[#171717]' : 'bg-[#242424] text-[#8D8A84]'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#F7F4EE] line-clamp-1">
                      {t.label || (typeof t.name === 'object' ? (isRtl ? t.name.ar : t.name.en) : t.name) || ''}
                    </p>
                    <span className="text-[10px] text-[#8D8A84] uppercase font-mono">{t.category}</span>
                  </div>
                </div>

                {isSelected && (
                  <span className="px-2 py-0.5 rounded-md bg-[#B99A65] text-[#171717] text-[10px] font-bold">
                    {isRtl ? 'مختارة' : 'Active'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
