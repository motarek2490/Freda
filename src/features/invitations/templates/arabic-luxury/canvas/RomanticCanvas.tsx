import React, { useRef, useEffect, useCallback } from 'react';
import { generateHeartPath, drawHeart, isNearHeart, type HeartPoint } from './heart';
import {
  AtmosphericSystem,
  PetalSystem,
  updateBurstParticles,
  drawBurstParticles,
  type BurstParticle,
} from './particles';
import { AnimationController } from './animation';

interface RomanticCanvasProps {
  accentColor: string;
  onReveal: () => void;
  interactive?: boolean;
}

export const RomanticCanvas: React.FC<RomanticCanvasProps> = ({
  accentColor = '#C9A46A',
  onReveal,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const controllerRef = useRef<AnimationController | null>(null);
  const heartPointsRef = useRef<HeartPoint[]>([]);
  const atmosphereRef = useRef(new AtmosphericSystem());
  const petalsRef = useRef(new PetalSystem());
  const burstRef = useRef<BurstParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const lastTimeRef = useRef(0);
  const revealedRef = useRef(false);
  const isVisibleRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  // ─── Setup ───
  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    sizeRef.current = { w: w * dpr, h: h * dpr };

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Detect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mq.matches;

    // Initialize systems
    const isMobile = w < 640;
    heartPointsRef.current = generateHeartPath(300);

    atmosphereRef.current.init({
      count: isMobile ? 25 : 55,
      canvasWidth: w,
      canvasHeight: h,
      color: accentColor,
      reducedMotion: reducedMotionRef.current,
    });

    petalsRef.current.init({
      count: isMobile ? 4 : 8,
      canvasWidth: w,
      canvasHeight: h,
      color: accentColor,
      reducedMotion: reducedMotionRef.current,
    });

    controllerRef.current = new AnimationController(reducedMotionRef.current);
  }, [accentColor]);

  // ─── Render Loop ───
  const render = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const controller = controllerRef.current;
      if (!canvas || !ctx || !controller) return;

      // Delta time (capped to avoid jumps)
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const { w, h } = sizeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = w / dpr;
      const displayH = h / dpr;

      // Update animation state
      controller.update(dt);
      const state = controller.state;

      // Fire reveal callback
      if (state.revealOpacity > 0.5 && !revealedRef.current) {
        revealedRef.current = true;
        onReveal();
      }

      // Smooth mouse parallax
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // ── Clear ──
      ctx.clearRect(0, 0, displayW, displayH);

      // ── Background gradient ──
      const bgGrad = ctx.createRadialGradient(
        displayW * 0.5,
        displayH * 0.4,
        0,
        displayW * 0.5,
        displayH * 0.5,
        displayW * 0.7,
      );
      bgGrad.addColorStop(0, '#1A1612');
      bgGrad.addColorStop(0.5, '#131110');
      bgGrad.addColorStop(1, '#0D0C0B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, displayW, displayH);

      // ── Ambient warm light ──
      const lightGrad = ctx.createRadialGradient(
        displayW * 0.5,
        displayH * 0.38,
        0,
        displayW * 0.5,
        displayH * 0.38,
        displayW * 0.35,
      );
      lightGrad.addColorStop(0, `rgba(201, 164, 106, ${0.04 * state.glowIntensity})`);
      lightGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, displayW, displayH);

      // ── Atmospheric particles (background layer) ──
      atmosphereRef.current.update(dt, mouse.x * 0.01, mouse.y * 0.01);
      atmosphereRef.current.draw(ctx, accentColor);

      // ── Petals (midground) ──
      petalsRef.current.update(dt, state.globalTime);
      petalsRef.current.draw(ctx);

      // ── Heart ──
      const heartCx = displayW * 0.5 + mouse.x * 0.02;
      const heartCy = displayH * 0.38 + mouse.y * 0.015;
      const heartScale = Math.min(displayW, displayH) * 0.12 * state.zoomLevel;
      const effectiveGlow = Math.min(
        state.glowIntensity + state.clickPulse * 0.5,
        1.5,
      );

      drawHeart(
        ctx,
        heartPointsRef.current,
        state.heartProgress,
        heartCx,
        heartCy,
        heartScale,
        accentColor,
        effectiveGlow,
        state.breathScale + state.clickPulse * 0.03,
      );

      // ── Click pulse ring ──
      if (state.clickPulse > 0.01) {
        const ringRadius = heartScale * (1.5 + (1 - state.clickPulse) * 2);
        ctx.beginPath();
        ctx.arc(heartCx, heartCy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = state.clickPulse * 0.3;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // ── Burst particles ──
      burstRef.current = updateBurstParticles(burstRef.current, dt);
      drawBurstParticles(ctx, burstRef.current);

      // ── Vignette ──
      const vigGrad = ctx.createRadialGradient(
        displayW * 0.5,
        displayH * 0.5,
        displayW * 0.25,
        displayW * 0.5,
        displayH * 0.5,
        displayW * 0.75,
      );
      vigGrad.addColorStop(0, 'transparent');
      vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, displayW, displayH);

      rafRef.current = requestAnimationFrame(render);
    },
    [accentColor, onReveal],
  );

  // ─── Lifecycle ───
  useEffect(() => {
    setup();
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(render);

    // Resize observer
    const canvas = canvasRef.current;
    const resizeObserver = new ResizeObserver(() => {
      setup();
    });
    if (canvas) resizeObserver.observe(canvas);

    // Visibility API
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (isVisibleRef.current) {
        lastTimeRef.current = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Mouse parallax (desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - cx) / cx;
      mouseRef.current.targetY = (e.clientY - cy) / cy;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setup, render]);

  // ─── Click Handler ───
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const controller = controllerRef.current;
      if (!controller || controller.state.phase !== 'idle') return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = sizeRef.current.w / dpr;
      const displayH = sizeRef.current.h / dpr;

      const heartCx = displayW * 0.5;
      const heartCy = displayH * 0.38;
      const heartRadius = Math.min(displayW, displayH) * 0.15;

      if (isNearHeart(x, y, heartCx, heartCy, heartRadius)) {
        controller.triggerClickPulse();
        burstRef.current = [
          ...burstRef.current,
          ...atmosphereRef.current.emitBurst(heartCx, heartCy, 16, accentColor),
        ];
      }
    },
    [accentColor],
  );

  return (
    <div
      className={`frida-canvas-wrap ${interactive ? 'interactive' : ''}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
