import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Scissors,
  Play,
  Pause,
  Volume2,
  Check,
  AlertCircle,
  Sparkles,
  Cloud,
  Clock,
  Music,
  ShieldCheck,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { Language, MusicTrack } from '../types';
import {
  trimAndCompressAudioFile,
  getAudioFileDuration,
  TrimResult,
} from '../lib/audioTrimmer';
import { saveTrackToCloudLibrary, getCloudMusicLibrary, uploadAudioFileToCloudStorage } from '../data/presetMusic';

interface AudioTrimmerModalProps {
  audioFile?: File | null;
  audioBlob?: Blob | File | null;
  trackName?: string;
  currentLang: Language;
  onClose: () => void;
  onTrackReady?: (track: MusicTrack) => void;
  onSave?: (trimmedBlob: any) => Promise<void>;
  isAdmin?: boolean;
}

export const AudioTrimmerModal: React.FC<AudioTrimmerModalProps> = ({
  audioFile: rawAudioFile,
  audioBlob,
  trackName: initialTrackName,
  currentLang,
  onClose,
  onTrackReady,
  onSave,
  isAdmin = false,
}) => {
  const audioFile = (rawAudioFile || audioBlob) as File | null;
  if (!audioFile) return null;

  const isRtl = currentLang === 'ar';

  const [trackName, setTrackName] = useState<string>(
    audioFile.name.replace(/\.[^/.]+$/, '').trim()
  );
  const [originalDuration, setOriginalDuration] = useState<number>(0);
  const USER_LIMIT = 101;
  const MAX_LIMIT_SECONDS = isAdmin ? (originalDuration ? Math.max(originalDuration, 1800) : 1800) : USER_LIMIT;
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(isAdmin ? 1800 : USER_LIMIT);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [playbackCurrentTime, setPlaybackCurrentTime] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [duplicateTrack, setDuplicateTrack] = useState<MusicTrack | null>(null);

  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize duration and check for duplicates in cloud
  useEffect(() => {
    let isMounted = true;
    objectUrlRef.current = URL.createObjectURL(audioFile);

    // 1. Get original audio duration
    getAudioFileDuration(audioFile).then((dur) => {
      if (isMounted) {
        setOriginalDuration(dur);
        const limit = isAdmin ? Math.max(1800, dur) : USER_LIMIT;
        const defaultStart = 0;
        const defaultEnd = Math.min(dur, limit);
        setStartTime(defaultStart);
        setEndTime(defaultEnd);
      }
    });

    // 2. Check cloud library for duplicates by clean name
    getCloudMusicLibrary().then((cloudTracks) => {
      if (!isMounted) return;
      const cleanInput = trackName.toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '');
      const found = cloudTracks.find((t) => {
        const cleanExisting = (t.label || '').toLowerCase().replace(/[^\w\u0600-\u06FF]+/g, '');
        return cleanExisting === cleanInput && cleanInput.length > 2;
      });
      if (found) {
        setDuplicateTrack(found);
      }
    });

    return () => {
      isMounted = false;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioFile]);

  // Track playback time update to stop strictly at endTime
  const updatePlaybackProgress = () => {
    if (audioPreviewRef.current && isPlayingPreview) {
      const current = audioPreviewRef.current.currentTime;
      setPlaybackCurrentTime(current);

      if (current >= endTime || audioPreviewRef.current.ended) {
        audioPreviewRef.current.pause();
        setIsPlayingPreview(false);
        setPlaybackCurrentTime(startTime);
        return;
      }

      animationFrameRef.current = requestAnimationFrame(updatePlaybackProgress);
    }
  };

  useEffect(() => {
    if (isPlayingPreview) {
      animationFrameRef.current = requestAnimationFrame(updatePlaybackProgress);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlayingPreview, endTime, startTime]);

  // Handle start time change
  const handleStartTimeChange = (newStart: number) => {
    const clampedStart = Math.max(0, Math.min(newStart, originalDuration - 1));
    setStartTime(clampedStart);

    // If endTime exceeds the 60s limit or is less than startTime
    if (endTime <= clampedStart) {
      setEndTime(Math.min(originalDuration, clampedStart + MAX_LIMIT_SECONDS));
    } else if (endTime - clampedStart > MAX_LIMIT_SECONDS) {
      setEndTime(clampedStart + MAX_LIMIT_SECONDS);
    }

    if (audioPreviewRef.current && isPlayingPreview) {
      audioPreviewRef.current.currentTime = clampedStart;
    }
  };

  // Handle end time change
  const handleEndTimeChange = (newEnd: number) => {
    const clampedEnd = Math.min(originalDuration, Math.max(newEnd, startTime + 1));
    
    // Ensure duration doesn't exceed 60s
    if (clampedEnd - startTime > MAX_LIMIT_SECONDS) {
      setStartTime(Math.max(0, clampedEnd - MAX_LIMIT_SECONDS));
    }
    setEndTime(clampedEnd);

    if (audioPreviewRef.current && isPlayingPreview && audioPreviewRef.current.currentTime >= clampedEnd) {
      audioPreviewRef.current.currentTime = startTime;
    }
  };

  // Quick preset duration click (e.g., 15s, 30s, 45s, 60s)
  const handleApplyPresetDuration = (durationSeconds: number) => {
    const targetDuration = Math.min(durationSeconds, MAX_LIMIT_SECONDS);
    let newEnd = startTime + targetDuration;
    let newStart = startTime;

    if (newEnd > originalDuration) {
      newEnd = originalDuration;
      newStart = Math.max(0, originalDuration - targetDuration);
    }

    setStartTime(Math.round(newStart));
    setEndTime(Math.round(newEnd));

    if (audioPreviewRef.current && isPlayingPreview) {
      audioPreviewRef.current.currentTime = newStart;
    }
  };

  // Toggle Live Audio Preview
  const handleTogglePlay = () => {
    if (!objectUrlRef.current) return;

    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio(objectUrlRef.current);
      audioPreviewRef.current.onended = () => {
        setIsPlayingPreview(false);
        setPlaybackCurrentTime(startTime);
      };
    }

    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.currentTime = startTime;
      audioPreviewRef.current.play()
        .then(() => {
          setIsPlayingPreview(true);
        })
        .catch((err) => console.warn('Preview play failed:', err));
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = Math.floor(sec % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const selectedDuration = Math.max(1, Math.round(endTime - startTime));

  // If user decides to use the existing cloud track
  const handleUseExistingDuplicate = () => {
    if (!duplicateTrack) return;
    onTrackReady?.(duplicateTrack);
    onClose();
  };

  // Perform client-side trimming + MP3 compression and instant save
  const handleConfirmTrimAndSave = async () => {
    try {
      setIsProcessing(true);
      setStatusMessage(
        isRtl
          ? `جاري قص المقطع (${selectedDuration} ثانية) وضغط الصوت بصيغة MP3 فائقة النقاء...`
          : `Trimming ${selectedDuration}s clip & encoding high-clarity MP3...`
      );

      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        setIsPlayingPreview(false);
      }

      // 1. Process via Web Audio API + LAME MP3 Encoder (super fast, < 250ms)
      const result = await trimAndCompressAudioFile(audioFile, startTime, selectedDuration);

      if (onSave) {
        await onSave(result.blob);
        onClose();
        return;
      }

      setStatusMessage(isRtl ? 'جاري تجهيز وحفظ المعزوفة...' : 'Finalizing audio track...');
      const cloudUrl = await uploadAudioFileToCloudStorage(result.blob, trackName.trim());

      setStatusMessage(isRtl ? 'جاري الحفظ في مكتبة الأغاني...' : 'Adding to music library...');

      // 2. Construct track object
      const trackId = 'trk-' + Date.now();
      const newTrack: MusicTrack = {
        id: trackId,
        category: isRtl ? '🎵 زفات ومقاطع مخصصة' : '🎵 Custom Audio Tracks',
        label: `${trackName.trim()} (${selectedDuration} ثانية)`,
        url: cloudUrl,
        createdAt: new Date().toISOString(),
      };

      // 3. Save to Cloud Firestore & local storage
      await saveTrackToCloudLibrary(newTrack);

      setStatusMessage(isRtl ? 'تم القص والضغط والحفظ بنجاح! ⚡' : 'Successfully processed & saved! ⚡');
      setTimeout(() => {
        onTrackReady?.(newTrack);
        onClose();
      }, 400);
    } catch (err: any) {
      console.error('Audio trim error:', err);
      setStatusMessage(isRtl ? 'حدث خطأ أثناء معالجة الصوت، يرجى المحاولة مرة أخرى.' : 'Failed to process audio, please try again.');
      setIsProcessing(false);
    }
  };

  // Calculate percentage positions for visual timeline
  const startPercent = originalDuration > 0 ? (startTime / originalDuration) * 100 : 0;
  const endPercent = originalDuration > 0 ? (endTime / originalDuration) * 100 : 100;
  const currentProgressPercent =
    originalDuration > 0 ? (playbackCurrentTime / originalDuration) * 100 : startPercent;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#171717] border border-[#B99A65]/50 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-center max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#B99A65]/15 border border-[#B99A65]/30 flex items-center justify-center mx-auto text-[#B99A65] shadow-lg">
          <Scissors className="w-7 h-7" />
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
            {isAdmin 
              ? (isRtl ? 'أداة قص وتحديد مقطع الموسيقى (قص حر للأدمن) ✂️' : 'Audio Trimmer (Free Admin Crop) ✂️')
              : (isRtl ? 'أداة قص وتحديد مقطع الموسيقى (حتى 101 ثانية) ✂️' : 'Audio Trimmer & 101s Optimizer ✂️')}
          </h3>
          <p className="text-xs text-[#8D8A84]">
            {isAdmin 
              ? (isRtl ? 'بصفتك مديراً للموقع، يمكنك تحديد أي طول أو قص الأغنية بحرية دون أي قيود!' : 'As an administrator, you have full control to crop this audio file with no time limit.')
              : (isRtl ? 'حدد وقت البداية والنهاية للمقطع (الحد الأقصى 101 ثانية). سيتم ضغط الصوت بجودة 128kbps لتحميل فوري.' : 'Choose custom start and end time (up to 101 seconds). Audio will be optimized to 128kbps.')}
          </p>
        </div>

        {/* Duplicate warning & option to reuse without duplicate storage */}
        {duplicateTrack && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/40 rounded-2xl text-xs text-amber-300 space-y-2 text-start">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isRtl ? 'هذه الأغنية موجودة مسبقاً في السحابة!' : 'Identical Track Found in Cloud!'}</span>
            </div>
            <p className="text-[11px] text-[#8D8A84] leading-relaxed">
              {isRtl
                ? `تم العثور على معزوفة سابقة بعنوان "${duplicateTrack.label}". يمكنك استخدامها مباشرة لتوفير المساحة وتجنب التكرار.`
                : `A track named "${duplicateTrack.label}" already exists. You can reuse it directly.`}
            </p>
            <button
              onClick={handleUseExistingDuplicate}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isRtl ? 'استخدام النسخة السحابية المتوفرة دون رفع جديد' : 'Reuse Existing Cloud Track'}</span>
            </button>
          </div>
        )}

        {/* Track Title Input */}
        <div className="text-start space-y-1.5">
          <label className="text-[11px] text-[#8D8A84] font-medium flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'اسم المعزوفة / الأغنية:' : 'Track Title:'}</span>
          </label>
          <input
            type="text"
            value={trackName}
            onChange={(e) => setTrackName(e.target.value)}
            placeholder={isRtl ? 'مثال: زفة طلة الملكة' : 'e.g. Wedding Entrance'}
            className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
          />
        </div>

        {/* Audio Scrubbing & Dual Point Timeline */}
        <div className="p-4 bg-[#1F1E1B] border border-[#333] rounded-2xl space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8D8A84]">
              {isRtl ? 'مدة الملف الأصلي:' : 'Original Duration:'}{' '}
              <strong className="text-[#F7F4EE]">{formatSeconds(originalDuration)}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#B99A65]/20 text-[#B99A65] font-bold text-[10px] border border-[#B99A65]/40">
              {isAdmin 
                ? (isRtl ? 'قص حر (الأدمن)' : 'Admin Free Crop')
                : (isRtl ? 'الحد الأقصى: 101 ثانية' : 'Max Clip: 101s')}
            </span>
          </div>

          {/* Visual Timeline Wave Bar */}
          <div className="relative h-10 bg-[#171717] rounded-xl border border-[#333] overflow-hidden flex items-center px-1">
            {/* Background Simulated Sound Wave bars */}
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-25 pointer-events-none">
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#8D8A84] rounded-full"
                  style={{ height: `${20 + ((i * 7) % 65)}%` }}
                />
              ))}
            </div>

            {/* Active Selected Slice Highlight */}
            <div
              className="absolute top-0 bottom-0 bg-gradient-to-r from-[#B99A65]/40 via-[#B99A65]/60 to-[#B99A65]/40 border-x-2 border-[#B99A65] transition-all duration-75"
              style={{
                left: `${startPercent}%`,
                width: `${Math.max(2, endPercent - startPercent)}%`,
              }}
            />

            {/* Current Playing Indicator Line */}
            {isPlayingPreview && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-400 shadow-[0_0_8px_red] z-10"
                style={{ left: `${currentProgressPercent}%` }}
              />
            )}
          </div>

          {/* Dual Sliders: Start and End */}
          <div className="space-y-3 pt-1">
            {/* Start Time Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#8D8A84]">
                <span className="flex items-center gap-1 font-semibold text-[#B99A65]">
                  <Clock className="w-3 h-3" />
                  {isRtl ? 'بداية المقطع:' : 'Start Point:'} {formatSeconds(startTime)}
                </span>
                <span className="text-[10px] font-mono">({startTime} ثانية)</span>
              </div>
              <input
                type="range"
                min={0}
                max={Math.max(0, originalDuration - 1)}
                step={1}
                value={startTime}
                onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
                className="w-full accent-[#B99A65] cursor-pointer"
              />
            </div>

            {/* End Time Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-[#8D8A84]">
                <span className="flex items-center gap-1 font-semibold text-[#B99A65]">
                  <Clock className="w-3 h-3" />
                  {isRtl ? 'نهاية المقطع:' : 'End Point:'} {formatSeconds(endTime)}
                </span>
                <span className="text-[10px] font-mono">({endTime} ثانية)</span>
              </div>
              <input
                type="range"
                min={Math.min(originalDuration, startTime + 1)}
                max={Math.min(originalDuration, startTime + MAX_LIMIT_SECONDS)}
                step={1}
                value={endTime}
                onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
                className="w-full accent-[#B99A65] cursor-pointer"
              />
            </div>
          </div>

          {/* Selected Duration Badge & Quick Length Presets */}
          <div className="pt-2 border-t border-[#333] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8D8A84]">{isRtl ? 'طول المقطع المختار:' : 'Selected Length:'}</span>
              <span className="font-bold text-[#F7F4EE] px-2.5 py-0.5 rounded-lg bg-[#2A2722] border border-[#444]">
                {selectedDuration} {isRtl ? 'ثانية' : 'seconds'} {selectedDuration === 101 ? (isRtl ? '(الحد الأقصى 101ث)' : '(Max 101s)') : ''}
              </span>
            </div>

            {/* Quick Duration Preset Buttons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[10px] text-[#8D8A84]">{isRtl ? 'خيارات سريعة:' : 'Quick:'}</span>
              {[30, 45, 60, 101].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleApplyPresetDuration(sec)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    selectedDuration === sec
                      ? 'bg-[#B99A65] text-[#171717] shadow-sm'
                      : 'bg-[#171717] border border-[#333] text-[#8D8A84] hover:text-[#F7F4EE]'
                  }`}
                >
                  {sec === 101 ? (isRtl ? '101 ثانية' : '101s') : `${sec} ث`}
                </button>
              ))}
            </div>
          </div>

          {/* Listen Preview Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
              isPlayingPreview
                ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-[#171717] border-[#444] text-[#F7F4EE] hover:border-[#B99A65]'
            }`}
          >
            {isPlayingPreview ? (
              <>
                <Pause className="w-4 h-4" />
                <span>{isRtl ? 'إيقاف المعاينة مؤقتاً' : 'Pause Preview'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {isRtl
                    ? `استماع للمقطع المختار (${formatSeconds(startTime)} ➔ ${formatSeconds(endTime)}) 🎧`
                    : `Listen Preview (${formatSeconds(startTime)} ➔ ${formatSeconds(endTime)}) 🎧`}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Compression & Quality Highlights */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8D8A84]">
          <div className="p-2.5 bg-[#1F1E1B] rounded-xl border border-[#2A2722] text-center">
            <span className="block text-[#B99A65] font-bold">MP3 HD (96-128kbps)</span>
            <span>{isRtl ? 'جودة نقية وضغط صوت فوري' : 'High Clarity MP3 Audio'}</span>
          </div>
          <div className="p-2.5 bg-[#1F1E1B] rounded-xl border border-[#2A2722] text-center">
            <span className="block text-emerald-400 font-bold">&lt; 1 MB</span>
            <span>{isRtl ? 'تحميل فوري وسلس للمعازيم' : 'Instant Loading for Guests'}</span>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <p className="text-xs text-[#B99A65] animate-pulse font-medium">
            {statusMessage}
          </p>
        )}

        {/* Action Button: Trim, Compress & Save */}
        <button
          onClick={handleConfirmTrimAndSave}
          disabled={isProcessing || !trackName.trim()}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(185,154,101,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{isRtl ? 'جاري القص والضغط...' : 'Processing Audio...'}</span>
            </>
          ) : (
            <>
              <Scissors className="w-4 h-4" />
              <span>
                {isRtl
                  ? `قص المقطع (${selectedDuration} ثانية) وحفظه في السحابة ✂️✨`
                  : `Trim ${selectedDuration}s & Save to Cloud ✂️✨`}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
