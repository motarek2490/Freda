import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music, Sparkles, Loader2 } from 'lucide-react';
import { Language } from '../types';
import { resolveAudioTrackUrl } from '../lib/audioStorage';

interface BackgroundMusicPlayerProps {
  currentLang: Language;
  trackUrl?: string;
  trackName?: string;
  isSuppressed?: boolean; // When an invitation, builder, or admin panel is active
}

const DEFAULT_AMBIENT_TRACK_URL = '/music/royal-wedding-waltz.mp3';
const DEFAULT_AMBIENT_TRACK_NAME = 'المعزوفة الملكية الحالمة (Royal Ambient)';

const STORAGE_MUTED_KEY = 'frida_site_bg_music_muted';

export const BackgroundMusicPlayer: React.FC<BackgroundMusicPlayerProps> = ({
  currentLang,
  trackUrl,
  trackName,
  isSuppressed = false,
}) => {
  const isRtl = currentLang === 'ar';
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // User manual preference (defaults to unmuted / active)
  const [isManuallyMuted, setIsManuallyMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_MUTED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string>(DEFAULT_AMBIENT_TRACK_URL);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const rawTrackUrl =
    typeof trackUrl === 'string' && trackUrl.trim()
      ? trackUrl.trim()
      : DEFAULT_AMBIENT_TRACK_URL;
  const activeTrackName =
    typeof trackName === 'string' && trackName.trim()
      ? trackName.trim()
      : isRtl
      ? DEFAULT_AMBIENT_TRACK_NAME
      : 'FRIDA Royal Ambient';

  // Resolve raw track URL (handling frida-audio://, storage references, data URLs, remote URLs)
  useEffect(() => {
    let isCancelled = false;
    setIsLoadingAudio(true);

    resolveAudioTrackUrl(rawTrackUrl)
      .then((playableUrl) => {
        if (!isCancelled) {
          setResolvedAudioUrl(playableUrl || DEFAULT_AMBIENT_TRACK_URL);
          setIsLoadingAudio(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setResolvedAudioUrl(DEFAULT_AMBIENT_TRACK_URL);
          setIsLoadingAudio(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [rawTrackUrl]);

  // Initialize and handle playback state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.25; // Gentle, low but clearly audible ambient volume
    audio.loop = true;

    // If suppressed (in invitation preview, builder, admin, or portal) or manually muted by user -> pause
    if (isSuppressed || isManuallyMuted) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    // Otherwise, attempt playback once URL is resolved
    if (resolvedAudioUrl) {
      const attemptPlay = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          // Autoplay policy blocked; will play on first click/scroll/touch
          setIsPlaying(false);
        }
      };
      attemptPlay();
    }
  }, [isSuppressed, isManuallyMuted, resolvedAudioUrl]);

  // Global listener for first user interaction to unlock autoplay on restricted mobile/desktop browsers
  useEffect(() => {
    if (hasUserInteracted || isManuallyMuted || isSuppressed) return;

    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      const audio = audioRef.current;
      if (audio && !isSuppressed && !isManuallyMuted && audio.paused) {
        audio.volume = 0.25;
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true });

    return removeListeners;
  }, [hasUserInteracted, isManuallyMuted, isSuppressed]);

  // Toggle Play / Mute
  const togglePlayMute = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsManuallyMuted(true);
      try {
        localStorage.setItem(STORAGE_MUTED_KEY, 'true');
      } catch {}
    } else {
      audio.volume = 0.25;
      try {
        await audio.play();
        setIsPlaying(true);
        setIsManuallyMuted(false);
        try {
          localStorage.setItem(STORAGE_MUTED_KEY, 'false');
        } catch {}
      } catch (err) {
        console.warn('Audio playback error:', err);
      }
    }
  };

  return (
    <>
      {/* Hidden Audio Player with resolved playable URL */}
      <audio
        ref={audioRef}
        src={resolvedAudioUrl}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Top Header Music Controller Button */}
      <div
        className="relative inline-flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          onClick={togglePlayMute}
          aria-label={isPlaying ? (isRtl ? 'إيقاف موسيقى الموقع' : 'Pause background music') : (isRtl ? 'تشغيل موسيقى الموقع' : 'Play background music')}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer backdrop-blur-md text-xs font-medium select-none ${
            isPlaying
              ? 'bg-[#B99A65]/15 border-[#B99A65]/50 text-[#F7F4EE] shadow-[0_0_15px_rgba(185,154,101,0.25)] ring-1 ring-[#B99A65]/30'
              : 'bg-[#171717]/80 border-[#333] text-[#8D8A84] hover:text-[#E9E1D5] hover:border-[#B99A65]/40'
          }`}
          title={
            isPlaying
              ? isRtl
                ? `موسيقى الخلفية: ${activeTrackName} (انقر للإيقاف)`
                : `Playing: ${activeTrackName} (Click to pause)`
              : isRtl
              ? 'تشغيل موسيقى الموقع الملكية'
              : 'Play background music'
          }
        >
          {/* Animated Equalizer Wave / Icon */}
          <div className="relative w-4 h-4 flex items-center justify-center">
            {isLoadingAudio ? (
              <Loader2 className="w-3.5 h-3.5 text-[#B99A65] animate-spin" />
            ) : isPlaying ? (
              <div className="flex items-end justify-center gap-[2px] h-3.5">
                <span className="w-[2.5px] bg-[#B99A65] rounded-full animate-[equalizer_0.8s_ease-in-out_infinite] h-full" />
                <span className="w-[2.5px] bg-[#E9E1D5] rounded-full animate-[equalizer_1.1s_ease-in-out_infinite_0.2s] h-2/3" />
                <span className="w-[2.5px] bg-[#B99A65] rounded-full animate-[equalizer_0.9s_ease-in-out_infinite_0.4s] h-4/5" />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#8D8A84] group-hover:text-[#B99A65] transition-colors" />
            )}
          </div>

          {/* Label Text */}
          <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide">
            {isPlaying
              ? isRtl
                ? 'موسيقى الموقع'
                : 'Site Music'
              : isRtl
              ? 'تشغيل الموسيقى'
              : 'Play Music'}
          </span>

          {/* Glowing pulse dot when active */}
          {isPlaying && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
        </button>

        {/* Hover Floating Tooltip */}
        {showTooltip && (
          <div
            className={`absolute top-full mt-2 z-50 ${
              isRtl ? 'right-0' : 'left-0'
            } w-52 p-2.5 rounded-xl bg-[#171717]/95 border border-[#B99A65]/40 shadow-2xl backdrop-blur-md text-[11px] space-y-1 animate-in fade-in duration-200 pointer-events-none`}
          >
            <div className="flex items-center gap-1.5 text-[#B99A65] font-bold">
              <Music className="w-3.5 h-3.5" />
              <span>{isRtl ? 'موسيقى فريدا الملكية' : 'FRIDA Royal Music'}</span>
            </div>
            <p className="text-[#E9E1D5] line-clamp-1 text-[10px]">
              {activeTrackName}
            </p>
            <p className="text-[#8D8A84] text-[9px] border-t border-[#333] pt-1">
              {isPlaying
                ? isRtl
                  ? 'صوت هادئ • تتوقف تلقائياً عند فتح المعاينات'
                  : 'Gentle ambiance • Auto-pauses on previews'
                : isRtl
                ? 'انقر لتشغيل المعزوفة الملكية في الخلفية'
                : 'Click to start ambient background music'}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes equalizer {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
      `}</style>
    </>
  );
};
