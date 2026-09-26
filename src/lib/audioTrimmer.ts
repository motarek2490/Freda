/**
 * Audio Trimming & MP3/128kbps Quality Optimization Utility
 * Cuts audio to chosen window client-side using Web Audio API + LAME MP3 encoder
 */

import { Mp3Encoder } from '@breezystack/lamejs';

export interface TrimResult {
  dataUrl: string;
  blob: Blob;
  duration: number;
  originalDuration: number;
  sizeKb: number;
  format: string;
}

/**
 * Valid sample rates supported by LAME MP3 Encoder
 */
const SUPPORTED_MP3_SAMPLE_RATES = new Set([8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000]);

/**
 * Encodes an AudioBuffer into standard MP3 format (10x smaller than WAV)
 * At 96-128kbps, a 60s song is only ~700-900KB and loads instantly!
 */
export function audioBufferToMp3(buffer: AudioBuffer, kbps: number = 96): Blob {
  const numChannels = Math.min(buffer.numberOfChannels, 2);
  let sampleRate = buffer.sampleRate;

  // Ensure sample rate is valid for MP3 encoder
  if (!SUPPORTED_MP3_SAMPLE_RATES.has(sampleRate)) {
    sampleRate = sampleRate >= 44100 ? 44100 : 32000;
  }

  // LAME MP3 Encoder requires (channels, sampleRate, kbps)
  const encoder = new Mp3Encoder(numChannels, sampleRate, kbps);
  const mp3Data: Uint8Array[] = [];

  const leftChannel = buffer.getChannelData(0);
  const rightChannel = numChannels > 1 ? buffer.getChannelData(1) : undefined;

  // Convert Float32 [-1.0, 1.0] to Int16 [-32768, 32767]
  const leftInt16 = new Int16Array(leftChannel.length);
  for (let i = 0; i < leftChannel.length; i++) {
    const s = Math.max(-1, Math.min(1, leftChannel[i]));
    leftInt16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  let rightInt16: Int16Array | undefined;
  if (rightChannel) {
    rightInt16 = new Int16Array(rightChannel.length);
    for (let i = 0; i < rightChannel.length; i++) {
      const s = Math.max(-1, Math.min(1, rightChannel[i]));
      rightInt16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }

  // Encode in 1152-sample chunks (LAME standard block size)
  const blockSize = 1152;
  for (let i = 0; i < leftInt16.length; i += blockSize) {
    const leftChunk = leftInt16.subarray(i, i + blockSize);
    const rightChunk = rightInt16 ? rightInt16.subarray(i, i + blockSize) : undefined;
    const mp3buf = encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf && mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const flushed = encoder.flush();
  if (flushed && flushed.length > 0) {
    mp3Data.push(flushed);
  }

  return new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mpeg' });
}

/**
 * Fallback: Encodes an AudioBuffer into standard 16-bit PCM WAV
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = Math.min(buffer.numberOfChannels, 2);
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const numSamples = buffer.length * numChannels;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * bytesPerSample;
  const bufferLength = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // Write RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  const channelData: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channelData.push(buffer.getChannelData(ch));
  }

  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Loads an audio File or Blob, decodes it, slices it strictly to a chosen window,
 * and encodes it into an optimized lightweight audio stream.
 */
export async function trimAndCompressAudioFile(
  fileOrBlob: File | Blob,
  startTimeSec: number = 0,
  maxDurationSec: number = 101
): Promise<TrimResult> {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  const audioContext = new AudioCtx();

  try {
    const arrayBuffer = await fileOrBlob.arrayBuffer();
    const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);

    const originalDuration = decodedAudio.duration;
    const actualStartTime = Math.max(0, Math.min(startTimeSec, Math.max(0, originalDuration - 0.5)));
    const sliceDuration = Math.min(maxDurationSec, Math.max(0.5, originalDuration - actualStartTime));

    // Target sample rate matching decoded sample rate (typically 44100 or 48000)
    let targetSampleRate = decodedAudio.sampleRate || 44100;
    if (!SUPPORTED_MP3_SAMPLE_RATES.has(targetSampleRate)) {
      targetSampleRate = 44100;
    }

    const targetLength = Math.max(1, Math.floor(sliceDuration * targetSampleRate));
    // Use mono (1 channel) for mobile web: cuts file size in half with zero loss in vocal clarity
    const numChannels = 1;

    const offlineCtx = new OfflineAudioContext(numChannels, targetLength, targetSampleRate);

    // Create buffer source
    const source = offlineCtx.createBufferSource();
    source.buffer = decodedAudio;

    // Connect and start at offset
    source.connect(offlineCtx.destination);
    source.start(0, actualStartTime, sliceDuration);

    const renderedBuffer = await offlineCtx.startRendering();

    // Encode to compressed MP3 (with WAV fallback if needed)
    let audioBlob: Blob;
    let format = 'audio/mpeg';
    try {
      audioBlob = audioBufferToMp3(renderedBuffer, 96);
    } catch (mp3Err) {
      console.warn('LAME MP3 encoding fallback to WAV:', mp3Err);
      audioBlob = audioBufferToWav(renderedBuffer);
      format = 'audio/wav';
    }

    // Convert to Data URL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });

    const sizeKb = Math.round(audioBlob.size / 1024);

    return {
      dataUrl,
      blob: audioBlob,
      duration: Math.round(sliceDuration * 10) / 10,
      originalDuration: Math.round(originalDuration * 10) / 10,
      sizeKb,
      format,
    };
  } finally {
    if (audioContext.state !== 'closed') {
      await audioContext.close().catch(() => {});
    }
  }
}

/**
 * Calculates audio duration and metadata from a File or Blob
 */
export async function getAudioFileDuration(fileOrBlob: File | Blob): Promise<number> {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return 101;

  const audioContext = new AudioCtx();
  try {
    const arrayBuffer = await fileOrBlob.arrayBuffer();
    const decodedAudio = await audioContext.decodeAudioData(arrayBuffer);
    return Math.round(decodedAudio.duration);
  } catch (err) {
    console.warn('Failed to get audio duration:', err);
    return 101;
  } finally {
    if (audioContext.state !== 'closed') {
      await audioContext.close().catch(() => {});
    }
  }
}

/**
 * Generates a clean fingerprint string for deduplication (name + normalized size/duration)
 */
export function generateTrackFingerprint(title: string, durationSec: number): string {
  const cleanTitle = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '');
  return `${cleanTitle}_${Math.round(durationSec)}`;
}
