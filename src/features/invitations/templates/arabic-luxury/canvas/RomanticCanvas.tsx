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
  onReveal?: () => void;
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
  const isVisibleRef = useRef(true);
  const sizeRef = useRef({ w: 0, h: 0 });
  const onRevealRef = useRef(onReveal);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    onRevealRef.current = onReveal;
  }, [onReveal]);

  // Setup Canvas Buffer & Systems
  const updateSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth || document.documentElement.clientWidth || 600;
    const h = window.innerHeight || document.documentElement.clientHeight || 800;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    sizeRef.current = { w: canvas.width, h: canvas.height };

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    const isMobile = w < 640;

    if (heartPointsRef.current.length === 0) {
      heartPointsRef.current = generateHeartPath(300);
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = mq.matches;

    if (!controllerRef.current) {
      controllerRef.current = new AnimationController(reducedMotion);
    }

    atmosphereRef.current.init({
      count: isMobile ? 25 : 50,
      canvasWidth: w,
      canvasHeight: h,
      color: accentColor,
      reducedMotion,
    });

    petalsRef.current.init({
      count: isMobile ? 5 : 10,
      canvasWidth: w,
      canvasHeight: h,
      color: accentColor,
      reducedMotion,
    });
  }, [accentColor]);

  // Main Render Loop
  useEffect(() => {
    updateSize();
    lastTimeRef.current = performance.now();

    const loop = (timestamp: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const controller = controllerRef.current;

      if (!canvas || !ctx || !controller) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const { w, h } = sizeRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = w / dpr || window.innerWidth || 600;
      const displayH = h / dpr || window.innerHeight || 800;

      // Update state
      controller.update(dt);
      const state = controller.state;

      // Trigger reveal when reveal phase starts
      if (state.revealOpacity > 0.05 && !hasRevealedRef.current) {
        hasRevealedRef.current = true;
        if (onRevealRef.current) {
          onRevealRef.current();
        }
      }

      // Smooth mouse parallax
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // ── Clear ──
      ctx.clearRect(0, 0, displayW, displayH);

      // ── 1. Luxury Dark Gradient Background ──
      const bgGrad = ctx.createLinearGradient(0, 0, 0, displayH);
      bgGrad.addColorStop(0, '#191512');
      bgGrad.addColorStop(0.35, '#131110');
      bgGrad.addColorStop(0.7, '#100E0D');
      bgGrad.addColorStop(1, '#0C0A09');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, displayW, displayH);

      // ── 2. Heart Positioning & Scale (Transitions from Center to Top) ──
      const isMobile = displayW < 640;
      const baseScale = Math.min(displayW, displayH) * (isMobile ? 0.14 : 0.12);
      const heartScale = baseScale * state.scaleMultiplier;
      
      const heartCx = displayW * 0.5 + mouse.x * 0.02;
      const heartCy = displayH * state.yOffsetMultiplier + mouse.y * 0.015;

      // ── 3. Ambient Glow behind Heart ──
      const heroLightGrad = ctx.createRadialGradient(
        heartCx,
        heartCy,
        0,
        heartCx,
        heartCy,
        Math.min(displayW * 0.65, 300) * state.scaleMultiplier * 0.8,
      );
      heroLightGrad.addColorStop(0, `rgba(201, 164, 106, ${0.14 * state.glowIntensity})`);
      heroLightGrad.addColorStop(0.5, `rgba(201, 164, 106, ${0.03 * state.glowIntensity})`);
      heroLightGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = heroLightGrad;
      ctx.fillRect(0, 0, displayW, displayH);

      // ── 4. Atmospheric Particles & Falling Petals ──
      atmosphereRef.current.update(dt, mouse.x * 0.01, mouse.y * 0.01);
      atmosphereRef.current.draw(ctx, accentColor);

      petalsRef.current.update(dt, state.globalTime);
      petalsRef.current.draw(ctx);

      // ── 5. Draw Romantic Heart ──
      const effectiveGlow = Math.min(state.glowIntensity + state.clickPulse * 0.5, 1.8);

      drawHeart(
        ctx,
        heartPointsRef.current,
        state.heartProgress,
        heartCx,
        heartCy,
        heartScale,
        accentColor,
        effectiveGlow,
        1.0,
      );

      // ── 6. Click Pulse Ring ──
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

      // ── 7. Burst Particles ──
      burstRef.current = updateBurstParticles(burstRef.current, dt);
      drawBurstParticles(ctx, burstRef.current);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    const handleResize = () => updateSize();
    window.addEventListener('resize', handleResize, { passive: true });

    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (isVisibleRef.current) {
        lastTimeRef.current = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - cx) / cx;
      mouseRef.current.targetY = (e.clientY - cy) / cy;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [updateSize, accentColor]);

  // Click Handler
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
      const heartCy = displayH * controller.state.yOffsetMultiplier;
      const heartRadius = Math.min(displayW * 0.3, 100);

      if (isNearHeart(x, y, heartCx, heartCy, heartRadius)) {
        controller.triggerClickPulse();
        burstRef.current = [
          ...burstRef.current,
          ...atmosphereRef.current.emitBurst(heartCx, heartCy, 18, accentColor),
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
        style={{ width: '100vw', height: '100vh', display: 'block' }}
      />
    </div>
  );
};
