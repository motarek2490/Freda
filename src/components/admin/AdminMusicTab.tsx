import React, { useState, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Upload,
  Loader2,
  Star,
  Trash2,
  CheckCircle,
  Scissors,
  AlertTriangle,
  X,
} from 'lucide-react';
import { AdminSettings, Language, MusicTrack } from '../../types';
import { resolveAudioTrackUrl } from '../../lib/audioStorage';
import { uploadAudioFileToCloudStorage } from '../../data/presetMusic';
import { AudioTrimmerModal } from '../AudioTrimmerModal';

interface AdminMusicTabProps {
  currentLang: Language;
  adminTracks: MusicTrack[];
  adminSettings: AdminSettings | null;
  onSaveTrack: (track: MusicTrack) => Promise<void>;
  onDeleteTrack: (trackId: string, trackUrl?: string) => Promise<void>;
  onSetDefaultDemoTrack: (url: string, name: string) => Promise<void>;
}

export const AdminMusicTab: React.FC<AdminMusicTabProps> = ({
  currentLang,
  adminTracks,
  adminSettings,
  onSaveTrack,
  onDeleteTrack,
  onSetDefaultDemoTrack,
}) => {
  const isRtl = currentLang === 'ar';

  const [playingTrackUrl, setPlayingTrackUrl] = useState<string | null>(null);
  const [loadingTrackUrl, setLoadingTrackUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Audio Trimmer State
  const [trimmerAudioBlob, setTrimmerAudioBlob] = useState<Blob | null>(null);
  const [trimmerTrackName, setTrimmerTrackName] = useState<string>('');

  // Delete Confirmation State
  const [trackToDelete, setTrackToDelete] = useState<MusicTrack | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const directFileInputRef = useRef<HTMLInputElement>(null);
  const trimmerFileInputRef = useRef<HTMLInputElement>(null);

  const handlePlayPause = async (rawUrl: string) => {
    if (!rawUrl) return;

    if (playingTrackUrl === rawUrl && audioRef.current) {
      audioRef.current.pause();
      setPlayingTrackUrl(null);
      return;
    }

    try {
      setLoadingTrackUrl(rawUrl);
      const playable = await resolveAudioTrackUrl(rawUrl);
      if (!playable) {
        setLoadingTrackUrl(null);
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setPlayingTrackUrl(null);
        audioRef.current.onerror = () => {
          setPlayingTrackUrl(null);
          setLoadingTrackUrl(null);
        };
      }

      audioRef.current.src = playable;
      await audioRef.current.play();
      setPlayingTrackUrl(rawUrl);
    } catch (err) {
      console.warn('Audio playback error:', err);
      setPlayingTrackUrl(null);
    } finally {
      setLoadingTrackUrl(null);
    }
  };

  const handleDirectFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadFeedback(null);

    try {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').trim();
      const cdnUrl = await uploadAudioFileToCloudStorage(file, cleanName);

      if (cdnUrl) {
        const newTrack: MusicTrack = {
          id: `track-${Date.now()}`,
          name: {
            ar: cleanName,
            en: cleanName,
          },
          label: cleanName,
          url: cdnUrl,
          category: 'classical',
          isDefault: false,
          isCloud: true,
          createdAt: new Date().toISOString(),
        };

        await onSaveTrack(newTrack);
        setUploadFeedback(isRtl ? 'تم رفع المعزوفة وحفظها في السحابة بنجاح! 🎵' : 'Track uploaded successfully!');
      } else {
        setUploadFeedback(isRtl ? 'تعذر الرفع، يرجى المحاولة مرة أخرى.' : 'Upload failed.');
      }
    } catch (err: any) {
      setUploadFeedback(err.message || 'Upload error');
    } finally {
      setIsUploading(false);
      if (directFileInputRef.current) directFileInputRef.current.value = '';
    }
  };

  const handleFileForTrimmer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const cleanName = file.name.replace(/\.[^/.]+$/, '').trim();
    setTrimmerTrackName(cleanName);
    setTrimmerAudioBlob(file);
    if (trimmerFileInputRef.current) trimmerFileInputRef.current.value = '';
  };

  const handleConfirmDelete = async () => {
    if (!trackToDelete) return;

    try {
      setIsDeleting(true);
      await onDeleteTrack(trackToDelete.id || '', trackToDelete.url);
      setUploadFeedback(
        isRtl
          ? `تم حذف معزوفة "${getTrackDisplayName(trackToDelete, 'ar')}" بنجاح 🗑️`
          : 'Track removed from library successfully!'
      );
      setTrackToDelete(null);
    } catch (err: any) {
      console.error('Error deleting track:', err);
      alert(isRtl ? 'حدث خطأ أثناء حذف المعزوفة' : 'Error deleting track');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTrackDisplayName = (t: MusicTrack, lang: 'ar' | 'en') => {
    if (!t.name) return t.label || '';
    if (typeof t.name === 'object') {
      return lang === 'ar' ? t.name.ar : t.name.en;
    }
    return t.name;
  };

  return (
    <div className="space-y-8">
      {/* Upload New Track Card */}
      <div className="bg-[#1F1E1B] rounded-3xl p-6 border border-[#B99A65]/40 shadow-[0_0_30px_rgba(185,154,101,0.1)] space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h4 className="font-playfair text-base font-bold text-[#F7F4EE] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#B99A65]" />
              <span>{isRtl ? 'إدارة ورفع الملفات الصوتية للمكتبة' : 'Music Library & Upload Management'}</span>
            </h4>
            <p className="text-xs text-[#8D8A84] mt-0.5 leading-relaxed">
              {isRtl
                ? 'يمكنك رفع وقص معزوفة باحترافية وتحديد مقطع بالثواني، أو رفع الملف كاملاً، وإدارة وحذف أي أغنية من المكتبة.'
                : 'Upload & trim custom audio clips, or upload full tracks and manage library music.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Option 1: Upload with Trimmer */}
            <input
              type="file"
              ref={trimmerFileInputRef}
              onChange={handleFileForTrimmer}
              accept="audio/*"
              className="hidden"
            />
            <button
              onClick={() => trimmerFileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#d6bd91] hover:from-[#cbb07e] hover:to-[#e2ca9f] text-[#171717] font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Scissors className="w-4 h-4 text-[#171717]" />
              <span>{isRtl ? 'رفع مع قص وتحديد مقطع (قص حر للأدمن ✂️)' : 'Upload & Trim Audio ✂️'}</span>
            </button>

            {/* Option 2: Upload direct without trim */}
            <input
              type="file"
              ref={directFileInputRef}
              onChange={handleDirectFileUpload}
              accept="audio/*"
              className="hidden"
            />
            <button
              onClick={() => directFileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#444] text-[#F7F4EE] font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#B99A65]" />
                  <span>{isRtl ? 'جارِ الرفع السحابي...' : 'Uploading...'}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#B99A65]" />
                  <span>{isRtl ? 'رفع الملف كاملاً مباشرة 📤' : 'Upload Full File Directly'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {uploadFeedback && (
          <div className="p-3 rounded-xl bg-[#171717] border border-[#333] text-xs text-[#B99A65] flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadFeedback}</span>
            </div>
            <button
              onClick={() => setUploadFeedback(null)}
              className="text-[#8D8A84] hover:text-[#F7F4EE] text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Available Music Library Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-playfair text-lg font-bold text-[#F7F4EE] flex items-center gap-2">
            <Music className="w-4 h-4 text-[#B99A65]" />
            <span>{isRtl ? 'المكتبة الصوتية المعتمدة للموقع' : 'Official Website Music Library'}</span>
            <span className="text-xs text-[#8D8A84]">({adminTracks.length})</span>
          </h4>
        </div>

        {adminTracks.length === 0 ? (
          <div className="p-8 text-center bg-[#1F1E1B] rounded-2xl border border-[#2E2C28] text-xs text-[#8D8A84]">
            {isRtl ? 'لا توجد مقطوعات صوتية حالياً. يمكنك رفع مقطوعة جديدة من الأعلى.' : 'No audio tracks found. Upload one above.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminTracks.map((track, idx) => {
              const trackNameAr = getTrackDisplayName(track, 'ar');
              const trackNameEn = getTrackDisplayName(track, 'en');

              const isPlaying = playingTrackUrl === track.url;
              const isLoading = loadingTrackUrl === track.url;
              const isDefaultDemo =
                adminSettings?.defaultDemoTrackUrl === track.url ||
                (adminSettings?.defaultDemoTrackName && adminSettings.defaultDemoTrackName === trackNameAr);

              return (
                <div
                  key={track.id ? `track-${track.id}-${idx}` : `track-item-${idx}`}
                  className={`bg-[#1F1E1B] rounded-2xl p-4 border transition-all space-y-3 relative ${
                    isDefaultDemo
                      ? 'border-[#B99A65] shadow-[0_0_20px_rgba(185,154,101,0.2)]'
                      : 'border-[#2E2C28] hover:border-[#444]'
                  }`}
                >
                  {/* Header & Default Demo Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-[#2E2C28] text-[#8D8A84] text-[10px] font-mono">
                      {track.category || (isRtl ? 'موسيقى ملكية' : 'Royal')}
                    </span>

                    {isDefaultDemo && (
                      <span className="px-2 py-0.5 rounded-full bg-[#B99A65]/20 text-[#B99A65] border border-[#B99A65]/40 text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#B99A65]" />
                        <span>{isRtl ? 'الديمو الافتراضي' : 'Default Demo'}</span>
                      </span>
                    )}
                  </div>

                  {/* Track Name */}
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-xs text-[#F7F4EE] line-clamp-1">
                      {isRtl ? trackNameAr : trackNameEn}
                    </h5>
                    <p className="text-[10px] text-[#8D8A84] truncate font-mono">
                      {track.url.substring(0, 45)}...
                    </p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#2A2722]">
                    {/* Play / Pause */}
                    <button
                      onClick={() => handlePlayPause(track.url)}
                      disabled={isLoading}
                      className="p-2 rounded-xl bg-[#2A2722] hover:bg-[#333] text-[#B99A65] transition-colors cursor-pointer"
                      title={isPlaying ? (isRtl ? 'إيقاف' : 'Pause') : (isRtl ? 'استماع' : 'Play')}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    {/* Set as default demo track button */}
                    {!isDefaultDemo && (
                      <button
                        onClick={() => onSetDefaultDemoTrack(track.url, trackNameAr)}
                        className="px-2.5 py-1.5 rounded-xl bg-[#171717] hover:bg-[#B99A65]/20 border border-[#333] hover:border-[#B99A65] text-[#8D8A84] hover:text-[#B99A65] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title={isRtl ? 'تعيين كمعزوفة افتراضية لجميع الديمو' : 'Set as default demo track'}
                      >
                        <Star className="w-3 h-3" />
                        <span>{isRtl ? 'تعيين كديمو' : 'Set as Demo'}</span>
                      </button>
                    )}

                    {/* Delete Track Button */}
                    <button
                      onClick={() => setTrackToDelete(track)}
                      className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 hover:border-red-600 text-red-400 hover:text-red-200 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ml-auto"
                      title={isRtl ? 'حذف هذه المعزوفة من الموقع' : 'Delete this track from library'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'حذف' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {trackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#171717] border border-red-900/60 rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-800/50 flex items-center justify-center mx-auto text-red-400 shadow-lg">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-playfair text-lg font-bold text-[#F7F4EE]">
                {isRtl ? 'تأكيد حذف المعزوفة الموسيقية' : 'Confirm Track Deletion'}
              </h3>
              <p className="text-xs text-[#8D8A84] leading-relaxed">
                {isRtl ? (
                  <>
                    هل أنت متأكد من رغبتك في حذف معزوفة{' '}
                    <strong className="text-[#F7F4EE]">
                      "{getTrackDisplayName(trackToDelete, 'ar')}"
                    </strong>{' '}
                    نهائياً من مكتبة الموسيقى؟ لن تظهر للمستخدمين مجدداً.
                  </>
                ) : (
                  <>
                    Are you sure you want to permanently delete{' '}
                    <strong className="text-[#F7F4EE]">
                      "{getTrackDisplayName(trackToDelete, 'en')}"
                    </strong>{' '}
                    from the music library?
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTrackToDelete(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-[#2A2722] hover:bg-[#333] text-[#F7F4EE] text-xs font-bold transition-colors cursor-pointer"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{isRtl ? 'جارِ الحذف...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{isRtl ? 'نعم، حذف نهائي' : 'Yes, Delete'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Trimmer Modal with Admin Privileges */}
      {trimmerAudioBlob && (
        <AudioTrimmerModal
          audioBlob={trimmerAudioBlob}
          trackName={trimmerTrackName}
          currentLang={currentLang}
          isAdmin={true}
          onClose={() => setTrimmerAudioBlob(null)}
          onTrackReady={async (newTrack) => {
            await onSaveTrack(newTrack);
            setUploadFeedback(
              isRtl
                ? `تم قص المعزوفة وحفظها بنجاح في السحابة! ✂️🎵`
                : 'Track trimmed and saved to cloud library!'
            );
            setTrimmerAudioBlob(null);
          }}
        />
      )}
    </div>
  );
};
