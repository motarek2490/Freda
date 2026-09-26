import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices, respect reduced motion
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hasTouch || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check for elements with data-cursor or specific interactive tags
      const target = (e.target as HTMLElement).closest('[data-cursor], button, a, input, select');
      if (target) {
        const customLabel = target.getAttribute('data-cursor');
        if (customLabel) {
          setCursorText(customLabel);
          setIsHovered(true);
        } else if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          setCursorText('');
          setIsHovered(true);
        } else {
          setCursorText('');
          setIsHovered(false);
        }
      } else {
        setCursorText('');
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // Smooth interpolation for fluid cinematic feel
      const ease = 0.2;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      style={{ willChange: 'transform' }}
    >
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out border ${
          isHovered
            ? 'w-14 h-14 bg-[#C9A86A]/20 backdrop-blur-sm border-[#C9A86A] scale-110 shadow-[0_0_20px_rgba(201,168,106,0.3)]'
            : 'w-3.5 h-3.5 bg-[#C9A86A] border-[#F4EFE7]/50 shadow-[0_0_10px_rgba(201,168,106,0.5)]'
        }`}
      >
        {cursorText && (
          <span
            ref={textRef}
            className="text-[9px] font-mono font-bold tracking-widest text-[#F4EFE7] uppercase select-none scale-90"
          >
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
