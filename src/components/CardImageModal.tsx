import React, { useEffect, useRef, useState } from 'react';
import { X, Copy, Check, Sparkles, Printer } from 'lucide-react';
import { InvitationData, Language, TemplateLayoutType } from '../types';
import { generateQrCodeDataUrl } from '../lib/qrHelper';

interface CardImageModalProps {
  invitation: InvitationData;
  currentLang?: Language;
  onClose: () => void;
}

/**
 * Render static layout-specific corner decorations matching invitation.layoutType.
 * All decorations are static SVGs/CSS for clean image export and direct printing.
 */
const renderCardDecorations = (layoutType: string, accentColor: string) => {
  const norm = (layoutType || 'royal').toLowerCase();

  if (norm.includes('baroque') || norm.includes('royal')) {
    return (
      <>
        <div className="absolute top-2 left-2 w-7 h-7 pointer-events-none" style={{ color: accentColor }}>
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
            <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-7 h-7 pointer-events-none" style={{ color: accentColor }}>
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current scale-x-[-1]">
            <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-7 h-7 pointer-events-none" style={{ color: accentColor }}>
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current scale-y-[-1]">
            <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-7 h-7 pointer-events-none" style={{ color: accentColor }}>
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current scale-[-1]">
            <path d="M0 0 v25 c5 -10, 15 -20, 25 -25 h-25 Z M5 5 h15 v5 h-10 v10 h-5 v-15 Z" />
          </svg>
        </div>
      </>
    );
  }

  if (norm.includes('cherry')) {
    return (
      <>
        <div className="absolute top-2 left-2 w-6 h-6 text-pink-400 opacity-80">
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M15 0 C10 8, 2 10, 5 20 C8 28, 20 25, 15 30 C10 25, 22 28, 25 20 C28 10, 20 8, 15 0 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 text-pink-400 opacity-80 transform rotate-90">
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M15 0 C10 8, 2 10, 5 20 C8 28, 20 25, 15 30 C10 25, 22 28, 25 20 C28 10, 20 8, 15 0 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 text-pink-400 opacity-80 transform -rotate-90">
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M15 0 C10 8, 2 10, 5 20 C8 28, 20 25, 15 30 C10 25, 22 28, 25 20 C28 10, 20 8, 15 0 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6 text-pink-400 opacity-80 transform rotate-180">
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M15 0 C10 8, 2 10, 5 20 C8 28, 20 25, 15 30 C10 25, 22 28, 25 20 C28 10, 20 8, 15 0 Z" />
          </svg>
        </div>
      </>
    );
  }

  if (norm.includes('crystal')) {
    return (
      <>
        <div className="absolute inset-0 border border-white/25 rounded-2xl pointer-events-none shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]" />
        <div className="absolute top-2 left-2 text-amber-300 opacity-80 text-xs">💎</div>
        <div className="absolute top-2 right-2 text-amber-300 opacity-80 text-xs">💎</div>
        <div className="absolute bottom-2 left-2 text-amber-300 opacity-80 text-xs">💎</div>
        <div className="absolute bottom-2 right-2 text-amber-300 opacity-80 text-xs">💎</div>
      </>
    );
  }

  if (norm.includes('floral') || norm.includes('botanical') || norm.includes('emerald')) {
    return (
      <>
        <div className="absolute top-2 left-2 w-8 h-8 pointer-events-none opacity-80" style={{ color: accentColor }}>
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M5 35 C10 20, 20 10, 35 5 C25 15, 15 25, 5 35 Z M12 22 C18 18, 25 18, 28 12 C22 18, 18 22, 12 22 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-8 h-8 pointer-events-none opacity-80 scale-x-[-1]" style={{ color: accentColor }}>
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M5 35 C10 20, 20 10, 35 5 C25 15, 15 25, 5 35 Z M12 22 C18 18, 25 18, 28 12 C22 18, 18 22, 12 22 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-8 h-8 pointer-events-none opacity-80 scale-y-[-1]" style={{ color: accentColor }}>
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M5 35 C10 20, 20 10, 35 5 C25 15, 15 25, 5 35 Z M12 22 C18 18, 25 18, 28 12 C22 18, 18 22, 12 22 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-8 h-8 pointer-events-none opacity-80 scale-[-1]" style={{ color: accentColor }}>
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M5 35 C10 20, 20 10, 35 5 C25 15, 15 25, 5 35 Z M12 22 C18 18, 25 18, 28 12 C22 18, 18 22, 12 22 Z" />
          </svg>
        </div>
      </>
    );
  }

  if (norm.includes('starlit')) {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#60A5FA_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute top-2 left-3 text-blue-300 opacity-80 text-xs">✨</div>
        <div className="absolute top-2 right-3 text-blue-300 opacity-80 text-xs">🌙</div>
        <div className="absolute bottom-2 left-3 text-blue-300 opacity-80 text-xs">✦</div>
        <div className="absolute bottom-2 right-3 text-blue-300 opacity-80 text-xs">✨</div>
      </>
    );
  }

  if (norm.includes('ocean')) {
    return (
      <>
        <div className="absolute top-2 left-2 text-teal-600 opacity-80 text-xs">🐚</div>
        <div className="absolute top-2 right-2 text-teal-600 opacity-80 text-xs">🐚</div>
        <div className="absolute bottom-2 left-2 text-teal-600 opacity-80 text-xs">🌊</div>
        <div className="absolute bottom-2 right-2 text-teal-600 opacity-80 text-xs">🌊</div>
      </>
    );
  }

  if (norm.includes('autumn')) {
    return (
      <>
        <div className="absolute top-2 left-2 text-amber-500 opacity-80 text-xs">🍁</div>
        <div className="absolute top-2 right-2 text-amber-500 opacity-80 text-xs">🍁</div>
        <div className="absolute bottom-2 left-2 text-amber-500 opacity-80 text-xs">🍁</div>
        <div className="absolute bottom-2 right-2 text-amber-500 opacity-80 text-xs">🍁</div>
      </>
    );
  }

  if (norm.includes('lace')) {
    return (
      <>
        <div className="absolute top-1 left-0 right-0 h-1 bg-[radial-gradient(#C88EA7_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
        <div className="absolute bottom-1 left-0 right-0 h-1 bg-[radial-gradient(#C88EA7_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
        <div className="absolute top-2 left-2 text-rose-400 opacity-80 text-xs">🎀</div>
        <div className="absolute top-2 right-2 text-rose-400 opacity-80 text-xs">🎀</div>
      </>
    );
  }

  if (norm.includes('citrus')) {
    return (
      <>
        <div className="absolute top-2 left-2 text-orange-400 opacity-80 text-xs">☀️</div>
        <div className="absolute top-2 right-2 text-orange-400 opacity-80 text-xs">🍊</div>
        <div className="absolute bottom-2 left-2 text-orange-400 opacity-80 text-xs">🍊</div>
        <div className="absolute bottom-2 right-2 text-orange-400 opacity-80 text-xs">☀️</div>
      </>
    );
  }

  if (norm.includes('confetti')) {
    return (
      <>
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#A855F7_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="absolute top-2 left-2 text-purple-400 text-xs">🎉</div>
        <div className="absolute top-2 right-2 text-cyan-400 text-xs">✨</div>
        <div className="absolute bottom-2 left-2 text-cyan-400 text-xs">✨</div>
        <div className="absolute bottom-2 right-2 text-purple-400 text-xs">🎉</div>
      </>
    );
  }

  if (norm.includes('boho')) {
    return (
      <>
        <div className="absolute top-2 left-2 text-amber-700 opacity-70 text-xs">🌿</div>
        <div className="absolute top-2 right-2 text-amber-700 opacity-70 text-xs">🌿</div>
        <div className="absolute bottom-2 left-2 text-amber-700 opacity-70 text-xs">☀️</div>
        <div className="absolute bottom-2 right-2 text-amber-700 opacity-70 text-xs">☀️</div>
      </>
    );
  }

  if (norm.includes('rosevelvet') || norm.includes('velvet')) {
    return (
      <>
        <div className="absolute top-2 left-2 w-6 h-6 text-rose-500 opacity-90">
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
            <path d="M25 5 C15 5 10 15 15 25 C20 35 30 35 35 25 C40 15 35 5 25 5 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 text-rose-500 opacity-90 scale-x-[-1]">
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
            <path d="M25 5 C15 5 10 15 15 25 C20 35 30 35 35 25 C40 15 35 5 25 5 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 text-rose-500 opacity-90 scale-y-[-1]">
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
            <path d="M25 5 C15 5 10 15 15 25 C20 35 30 35 35 25 C40 15 35 5 25 5 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6 text-rose-500 opacity-90 scale-[-1]">
          <svg viewBox="0 0 50 50" className="w-full h-full fill-current">
            <path d="M25 5 C15 5 10 15 15 25 C20 35 30 35 35 25 C40 15 35 5 25 5 Z" />
          </svg>
        </div>
      </>
    );
  }

  if (norm.includes('lavender')) {
    return (
      <>
        <div className="absolute top-2 left-2 w-6 h-6 text-purple-400 opacity-80">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M20 38 L20 10 M17 30 C15 28, 15 25, 20 25 C25 25, 25 28, 23 30 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 text-purple-400 opacity-80 scale-x-[-1]">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M20 38 L20 10 M17 30 C15 28, 15 25, 20 25 C25 25, 25 28, 23 30 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-6 h-6 text-purple-400 opacity-80 scale-y-[-1]">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M20 38 L20 10 M17 30 C15 28, 15 25, 20 25 C25 25, 25 28, 23 30 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-6 h-6 text-purple-400 opacity-80 scale-[-1]">
          <svg viewBox="0 0 40 40" className="w-full h-full fill-current">
            <path d="M20 38 L20 10 M17 30 C15 28, 15 25, 20 25 C25 25, 25 28, 23 30 Z" />
          </svg>
        </div>
      </>
    );
  }

  if (norm.includes('sunflower')) {
    return (
      <>
        <div className="absolute top-2 left-2 text-yellow-400 opacity-90 text-sm">🌻</div>
        <div className="absolute top-2 right-2 text-yellow-400 opacity-90 text-sm">🌻</div>
        <div className="absolute bottom-2 left-2 text-amber-500 opacity-70 text-xs">✦</div>
        <div className="absolute bottom-2 right-2 text-amber-500 opacity-70 text-xs">✦</div>
      </>
    );
  }

  if (norm.includes('jasmine')) {
    return (
      <>
        <div className="absolute top-2 left-2 text-emerald-200 opacity-90 text-xs">🌸</div>
        <div className="absolute top-2 right-2 text-emerald-200 opacity-90 text-xs">🌸</div>
        <div className="absolute bottom-2 left-2 text-emerald-200 opacity-90 text-xs">🌸</div>
        <div className="absolute bottom-2 right-2 text-emerald-200 opacity-90 text-xs">🌸</div>
      </>
    );
  }

  if (norm.includes('wisteria')) {
    return (
      <>
        <div className="absolute top-1 left-2 text-indigo-300 opacity-80 text-xs">🪻</div>
        <div className="absolute top-1 right-2 text-indigo-300 opacity-80 text-xs">🪻</div>
        <div className="absolute bottom-2 left-2 text-indigo-300 opacity-70 text-xs">✨</div>
        <div className="absolute bottom-2 right-2 text-indigo-300 opacity-70 text-xs">✨</div>
      </>
    );
  }

  if (norm.includes('celestialeclipse') || norm.includes('eclipse')) {
    return (
      <div className="absolute top-2 right-2 w-6 h-6 pointer-events-none opacity-85" style={{ color: accentColor }}>
        {/* Crescent moon surrounded by three star points */}
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          {/* Crescent Moon */}
          <path d="M12 3a9 9 0 0 0 9 9 9.005 9.005 0 0 1-9-9Z" />
          {/* Three star points */}
          <circle cx="6" cy="6" r="1" fill={accentColor} />
          <circle cx="10" cy="18" r="0.75" fill={accentColor} />
          <circle cx="18" cy="18" r="0.8" fill={accentColor} />
        </svg>
      </div>
    );
  }

  if (norm.includes('editorialnoir') || norm.includes('noir')) {
    return (
      <div className="absolute bottom-2 left-2 w-10 h-10 pointer-events-none opacity-80" style={{ color: accentColor }}>
        {/* Unfinished thin editorial corner frame */}
        <svg viewBox="0 0 40 40" className="w-full h-full stroke-current fill-none" strokeWidth="1">
          <line x1="5" y1="35" x2="35" y2="35" />
          <line x1="5" y1="5" x2="5" y2="35" />
          <circle cx="5" cy="5" r="1.5" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (norm.includes('enchantedbotanical') || norm.includes('enchanted')) {
    return (
      <>
        <div className="absolute top-2 left-2 w-7 h-7 pointer-events-none opacity-80" style={{ color: accentColor }}>
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M5 25 C10 15, 15 10, 25 5 C20 12, 12 20, 5 25" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-7 h-7 pointer-events-none opacity-80 scale-[-1]" style={{ color: accentColor }}>
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M5 25 C10 15, 15 10, 25 5 C20 12, 12 20, 5 25" />
          </svg>
        </div>
      </>
    );
  }

  if (norm.includes('opaldream') || norm.includes('opal')) {
    return (
      <>
        <div className="absolute top-2 left-2 opacity-85 text-xs text-blue-200">💎</div>
        <div className="absolute top-2 right-2 opacity-85 text-xs text-pink-200">💎</div>
        <div className="absolute bottom-2 left-2 opacity-85 text-xs text-purple-200">💎</div>
        <div className="absolute bottom-2 right-2 opacity-85 text-xs text-teal-200">💎</div>
      </>
    );
  }

  if (norm.includes('royalarabiceditorial') || norm.includes('royalarabic')) {
    return (
      <>
        <div className="absolute top-2 left-2 w-6 h-6 pointer-events-none opacity-80" style={{ color: accentColor }}>
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M5 5 L25 5 L25 15 A10 10 0 0 1 5 15 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-6 h-6 pointer-events-none opacity-80 scale-x-[-1]" style={{ color: accentColor }}>
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M5 5 L25 5 L25 15 A10 10 0 0 1 5 15 Z" />
          </svg>
        </div>
      </>
    );
  }

  if (norm.includes('arabic')) {
    return (
      <>
        <div className="absolute top-2 left-2 text-amber-400 opacity-80 text-xs font-bold">☪</div>
        <div className="absolute top-2 right-2 text-amber-400 opacity-80 text-xs font-bold">☪</div>
        <div className="absolute bottom-2 left-2 text-amber-400 opacity-80 text-xs">🕌</div>
        <div className="absolute bottom-2 right-2 text-amber-400 opacity-80 text-xs">🕌</div>
      </>
    );
  }

  if (norm.includes('minimalist') || norm.includes('minimal')) {
    // Pure minimalist, zero corner decorations
    return null;
  }

  // Default subtle corner diamonds for other themes
  return (
    <>
      <div className="absolute top-2 left-2 opacity-60 text-xs font-serif" style={{ color: accentColor }}>✦</div>
      <div className="absolute top-2 right-2 opacity-60 text-xs font-serif" style={{ color: accentColor }}>✦</div>
      <div className="absolute bottom-2 left-2 opacity-60 text-xs font-serif" style={{ color: accentColor }}>✦</div>
      <div className="absolute bottom-2 right-2 opacity-60 text-xs font-serif" style={{ color: accentColor }}>✦</div>
    </>
  );
};

export const CardImageModal: React.FC<CardImageModalProps> = ({
  invitation,
  currentLang = 'ar',
  onClose,
}) => {
  const isRtl = currentLang === 'ar';
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [copied, setCopied] = useState(false);

  const colors = invitation.customColors || {
    bg: '#171717',
    cardBg: '#1F1E1B',
    text: '#F7F4EE',
    accent: '#B99A65',
  };

  const bg = colors.bg || '#171717';
  const cardBg = colors.cardBg || '#1F1E1B';
  const accent = colors.accent || '#B99A65';
  const text = colors.text || '#F7F4EE';
  const fontClass = invitation.customFont || 'font-playfair';
  const layoutType = invitation.layoutType || 'royal';

  const shareUrl = `${window.location.origin}/i/${encodeURIComponent(invitation.slug || invitation.id)}`;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    generateQrCodeDataUrl(shareUrl).then(setQrDataUrl);
  }, [shareUrl]);

  // Mouse / Touch Parallax helper
  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    let x = 0, y = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    mouseRef.current.targetX = (x / rect.width) - 0.5;
    mouseRef.current.targetY = (y / rect.height) - 0.5;
  };

  const handlePointerLeave = () => {
    mouseRef.current.targetX = 0;
    mouseRef.current.targetY = 0;
  };

  // Dynamic Ambient Canvas background logic matching active layoutType
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const norm = layoutType.toLowerCase();

    interface P {
      x: number;
      y: number;
      size: number;
      speed: number;
      angle: number;
      opacity: number;
      color?: string;
      custom?: any;
    }

    const particles: P[] = [];
    const count = 30; // perfectly optimized count for modal preview card

    if (norm.includes('celestial') || norm.includes('eclipse')) {
      for (let i = 0; i < count; i++) {
        const isOrbiting = Math.random() > 0.5;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.15 + 0.05,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.6 + 0.2,
          custom: {
            orbitRadius: isOrbiting ? Math.random() * 100 + 30 : undefined,
            orbitSpeed: isOrbiting ? (Math.random() * 0.001 + 0.0003) * (Math.random() > 0.5 ? 1 : -1) : undefined
          }
        });
      }
    } else if (norm.includes('noir')) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.1 + 0.05,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.3 + 0.1,
          custom: { type: Math.random() > 0.7 ? 'cross' : 'dot' }
        });
      }
    } else if (norm.includes('botanical') || norm.includes('enchanted')) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 4 + 1.5,
          speed: Math.random() * 0.35 + 0.15,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.45 + 0.15,
          custom: {
            swaySpeed: Math.random() * 0.01 + 0.005,
            swayRange: Math.random() * 8 + 4,
            rotation: Math.random() * Math.PI
          }
        });
      }
    } else if (norm.includes('opal')) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 5 + 3,
          speed: Math.random() * 0.2 + 0.1,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.35 + 0.15,
          color: `hsla(${Math.random() * 60 + 260}, 85%, 85%, 1)`
        });
      }
    } else if (norm.includes('royalarabic') || norm.includes('arabic')) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.3 + 0.4,
          speed: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    } else if (norm.includes('crystal')) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 0.05 + 0.02,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    } else if (norm.includes('confetti')) {
      for (let i = 0; i < count; i++) {
        const colors = ['#FBCFE8', '#DDD6FE', '#BFDBFE', '#FDE047', '#A7F3D0'];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 2,
          speed: Math.random() * 0.5 + 0.25,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.7 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          custom: { rotationSpeed: Math.random() * 0.02 - 0.01, rotation: Math.random() * Math.PI }
        });
      }
    } else if (norm.includes('starlit')) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.1 + 0.05,
          angle: Math.random() * Math.PI * 2,
          opacity: Math.random() * 0.7 + 0.3
        });
      }
    } else if (norm.includes('rosevelvet') || norm.includes('velvet')) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 5 + 3,
          speed: Math.random() * 0.4 + 0.2,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.6 + 0.2,
          custom: { rotation: Math.random() * Math.PI, spin: Math.random() * 0.01 + 0.005 }
        });
      }
    } else if (norm.includes('lavender')) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 15 + 5,
          speed: Math.random() * 0.2 + 0.1,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.15 + 0.05
        });
      }
    } else if (norm.includes('sunflower')) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1.5,
          speed: Math.random() * 0.25 + 0.1,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.5 + 0.2
        });
      }
    } else if (norm.includes('jasmine')) {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 0.3 + 0.1,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.6 + 0.2,
          custom: { rotation: Math.random() * Math.PI, spin: Math.random() * 0.008 + 0.002 }
        });
      }
    } else if (norm.includes('wisteria')) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3.5 + 1.5,
          speed: Math.random() * 0.35 + 0.15,
          angle: Math.random() * Math.PI,
          opacity: Math.random() * 0.5 + 0.2,
          custom: { rotation: Math.random() * Math.PI, spin: Math.random() * 0.01 + 0.003 }
        });
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Celestial Background Eclipse specific soft glow sweep
      if (norm.includes('celestial') || norm.includes('eclipse')) {
        const cX = width / 2 + mouse.x * 20;
        const cY = height * 0.35 + mouse.y * 15;
        const grad = ctx.createRadialGradient(cX, cY, 5, cX, cY, 150);
        grad.addColorStop(0, `${accent}15`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Render/update each particle
      particles.forEach((p) => {
        p.angle += 0.005;

        if (norm.includes('celestial') || norm.includes('eclipse')) {
          if (p.custom?.orbitRadius) {
            p.angle += p.custom.orbitSpeed;
            const cX = width / 2 + mouse.x * 20;
            const cY = height * 0.35 + mouse.y * 15;
            p.x = cX + Math.cos(p.angle) * p.custom.orbitRadius;
            p.y = cY + Math.sin(p.angle) * p.custom.orbitRadius;
          } else {
            p.y -= p.speed;
            if (p.y < -5) {
              p.y = height + 5;
              p.x = Math.random() * width;
            }
          }
          const drawX = p.x - mouse.x * 8;
          const drawY = p.y - mouse.y * 8;
          ctx.fillStyle = `rgba(247, 244, 238, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (norm.includes('noir')) {
          p.y -= p.speed;
          if (p.y < -5) {
            p.y = height + 5;
            p.x = Math.random() * width;
          }
          const drawX = p.x + mouse.x * 4;
          const drawY = p.y + mouse.y * 4;
          ctx.strokeStyle = `rgba(128, 9, 27, ${p.opacity})`;
          ctx.fillStyle = `rgba(128, 9, 27, ${p.opacity})`;
          ctx.lineWidth = 0.5;

          if (p.custom?.type === 'cross') {
            ctx.beginPath();
            ctx.moveTo(drawX - p.size, drawY);
            ctx.lineTo(drawX + p.size, drawY);
            ctx.moveTo(drawX, drawY - p.size);
            ctx.lineTo(drawX, drawY + p.size);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        } 
        else if (norm.includes('botanical') || norm.includes('enchanted')) {
          p.angle += p.custom?.swaySpeed || 0.005;
          p.y += p.speed;
          const driftX = Math.sin(p.angle) * (p.custom?.swayRange || 3) + mouse.x * 6;
          
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x + driftX, p.y + mouse.y * 6);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(162, 173, 145, ${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } 
        else if (norm.includes('opal')) {
          p.y -= p.speed;
          const xDrift = Math.sin(p.angle) * 1.5 + mouse.x * 5;
          if (p.y < -15) {
            p.y = height + 15;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x + xDrift, p.y + mouse.y * 3);
          const pGrad = ctx.createRadialGradient(-p.size * 0.3, -p.size * 0.3, p.size * 0.1, 0, 0, p.size);
          pGrad.addColorStop(0, `rgba(255, 255, 255, ${p.opacity + 0.2})`);
          pGrad.addColorStop(0.5, p.color || 'rgba(255, 255, 255, 0.4)');
          pGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = pGrad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } 
        else if (norm.includes('royalarabic') || norm.includes('arabic')) {
          p.y += p.speed;
          const driftX = Math.sin(p.angle) * 0.3 + mouse.x * 4;
          if (p.y > height + 5) {
            p.y = -5;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x + driftX, p.y + mouse.y * 3, p.size, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (norm.includes('crystal')) {
          const drawX = p.x + mouse.x * 5;
          const drawY = p.y + mouse.y * 5;
          ctx.save();
          ctx.translate(drawX, drawY);
          ctx.rotate(p.angle);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (0.6 + Math.sin(p.angle * 2) * 0.4)})`;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.5, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.5, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } 
        else if (norm.includes('confetti')) {
          p.y += p.speed;
          if (p.custom) {
            p.custom.rotation += p.custom.rotationSpeed;
          }
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          ctx.save();
          ctx.translate(p.x + mouse.x * 4, p.y + mouse.y * 4);
          ctx.rotate(p.custom?.rotation || 0);
          ctx.fillStyle = p.color || '#FFF';
          ctx.globalAlpha = p.opacity;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
          ctx.globalAlpha = 1.0;
        } 
        else if (norm.includes('starlit')) {
          p.y -= p.speed;
          if (p.y < -5) {
            p.y = height + 5;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(224, 242, 254, ${p.opacity * (0.7 + Math.sin(p.angle) * 0.3)})`;
          ctx.beginPath();
          ctx.arc(p.x - mouse.x * 10, p.y - mouse.y * 10, p.size, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (norm.includes('rosevelvet') || norm.includes('velvet')) {
          p.y += p.speed;
          if (p.custom) p.custom.rotation += p.custom.spin;
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          ctx.save();
          ctx.translate(p.x + mouse.x * 5, p.y + mouse.y * 5);
          ctx.rotate(p.custom?.rotation || 0);
          ctx.fillStyle = `rgba(239, 68, 68, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI, true);
          ctx.bezierCurveTo(-p.size, p.size, p.size, p.size, 0, 0);
          ctx.fill();
          ctx.restore();
        } 
        else if (norm.includes('lavender')) {
          p.y -= p.speed;
          if (p.y < -p.size) {
            p.y = height + p.size;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(192, 132, 252, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x + mouse.x * 3, p.y + mouse.y * 3, p.size, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (norm.includes('sunflower')) {
          p.y -= p.speed;
          if (p.y < -5) {
            p.y = height + 5;
            p.x = Math.random() * width;
          }
          ctx.fillStyle = `rgba(251, 191, 36, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x - mouse.x * 4, p.y - mouse.y * 4, p.size, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (norm.includes('jasmine')) {
          p.y += p.speed;
          if (p.custom) p.custom.rotation += p.custom.spin;
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          ctx.save();
          ctx.translate(p.x + mouse.x * 6, p.y + mouse.y * 6);
          ctx.rotate(p.custom?.rotation || 0);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } 
        else if (norm.includes('wisteria')) {
          p.y += p.speed;
          if (p.custom) p.custom.rotation += p.custom.spin;
          if (p.y > height + 10) {
            p.y = -10;
            p.x = Math.random() * width;
          }
          ctx.save();
          ctx.translate(p.x + mouse.x * 5, p.y + mouse.y * 5);
          ctx.rotate(p.custom?.rotation || 0);
          ctx.fillStyle = `rgba(165, 180, 252, ${p.opacity})`;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Trigger initial size evaluation
    handleResize();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [layoutType, accent]);

  const handlePrintCard = () => {
    window.print();
  };

  const handleCopyText = () => {
    const textToCopy = `${invitation.eventDetails.hostNames}\n${invitation.eventDetails.eventTitle}\n📅 ${invitation.eventDetails.eventDate} | 📍 ${invitation.eventDetails.venueName}\n💌 ${shareUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-[#171717] border border-[#B99A65] rounded-3xl p-6 shadow-2xl space-y-5 my-4 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A65]/20 border border-[#B99A65] text-[#B99A65] text-[11px] font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'بطاقة الدعوة الثابتة للواتساب والطباعة' : 'Static Invitation Card Graphic'}</span>
          </div>
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
            {isRtl ? 'كرت الدعوة المصور' : 'Printable Invitation Card'}
          </h3>
          <p className="text-xs text-[#8D8A84]">
            {isRtl
              ? 'صورة عالية الفخامة مطابقة لهوية دعوتك جاهزة للنشر في ستوري واتساب أو الطباعة'
              : 'Stationery card matching your theme, ready for WhatsApp status & printing.'}
          </p>
        </div>

        {/* The Digital Card Element (Dynamic Theme Colors & Font) */}
        <div
          ref={cardRef}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          className={`relative border-4 border-double rounded-2xl p-8 text-center shadow-2xl space-y-6 overflow-hidden ${fontClass}`}
          style={{
            background: `linear-gradient(145deg, ${cardBg} 0%, ${bg} 100%)`,
            borderColor: accent,
            color: text,
          }}
        >
          {/* Interactive Background Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-2xl opacity-75"
          />

          {/* Dynamic Static Corner Ornaments for Theme */}
          {renderCardDecorations(layoutType, accent)}

          <div className="space-y-2 relative z-10">
            <span className="text-[11px] tracking-[0.3em] uppercase font-bold block" style={{ color: accent }}>
              {isRtl ? 'بسم الله الرحمن الرحيم' : 'IN THE NAME OF GOD'}
            </span>
            <div className="w-12 h-0.5 mx-auto" style={{ backgroundColor: `${accent}60` }} />
            <p className="text-xs font-light pt-2" style={{ color: text, opacity: 0.85 }}>
              {isRtl ? 'تتشرف عائلة' : 'The families of'}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: accent }}>
              {invitation.eventDetails.hostNames}
            </h2>
            <p className="text-xs" style={{ color: text, opacity: 0.75 }}>
              {isRtl
                ? 'بدعوتكم لمشاركتهم فرحتهم الكبرى بمناسبة'
                : 'request the pleasure of your company to celebrate'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold py-1" style={{ color: text }}>
              {invitation.eventDetails.eventTitle}
            </h1>
          </div>

          <div
            className="py-4 border-y grid grid-cols-2 gap-4 text-xs relative z-10"
            style={{ borderColor: `${accent}40` }}
          >
            <div>
              <span className="text-[10px] uppercase block" style={{ color: text, opacity: 0.7 }}>
                {isRtl ? 'الموعد' : 'Date'}
              </span>
              <strong className="block font-semibold text-sm" style={{ color: text }}>
                {invitation.eventDetails.eventDate}
              </strong>
              <span className="text-[11px] font-semibold" style={{ color: accent }}>
                {invitation.eventDetails.eventTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase block" style={{ color: text, opacity: 0.7 }}>
                {isRtl ? 'المكان' : 'Venue'}
              </span>
              <strong className="block font-semibold text-sm line-clamp-1" style={{ color: text }}>
                {invitation.eventDetails.venueName}
              </strong>
              <span className="text-[11px] line-clamp-1" style={{ color: text, opacity: 0.8 }}>
                {invitation.eventDetails.address}
              </span>
            </div>
          </div>

          {/* QR Code Container with Accent Border */}
          <div className="flex flex-col items-center justify-center space-y-1 relative z-10">
            <div
              className="p-2 bg-white rounded-xl shadow-md inline-block border-2"
              style={{ borderColor: accent }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />
              )}
            </div>
            <span className="text-[10px] font-semibold" style={{ color: accent }}>
              {isRtl ? 'امسح الرمز لفتح الدعوة وتأكيد الحضور (RSVP)' : 'Scan QR for RSVP & Google Maps'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrintCard}
            className="py-3 px-4 rounded-xl bg-[#1F1E1B] border border-[#333] hover:border-[#B99A65] text-[#E9E1D5] hover:text-[#B99A65] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isRtl ? 'طباعة الكرت أو حفظ PDF' : 'Print / Save PDF'}</span>
          </button>

          <button
            onClick={handleCopyText}
            className="py-3 px-4 rounded-xl text-[#171717] font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            style={{ backgroundColor: accent }}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ نص الكرت' : 'Copy Card Text')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
