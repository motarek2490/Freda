import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { drawSunlight, Bloom } from './sunlight';
import { makeFlowers, drawFlowers, Flower } from './flowers';
import { drawRibbons } from './ribbons';
import { makePetal, stepPetals, drawPetals, Petal } from './petals';

export interface SunlitCanvasHandle { bloom: (x: number, y: number) => void }

/** Fixed, pointer-transparent artwork layer. All animation state lives in refs: no React renders per frame. */
export const SunlitCanvas = forwardRef<SunlitCanvasHandle, { reducedMotion?: boolean }>(({ reducedMotion = false }, ref) => {
  const cv = useRef<HTMLCanvasElement>(null);
  const bloomRef = useRef<Bloom | null>(null);
  useImperativeHandle(ref, () => ({
    bloom: (x, y) => { bloomRef.current = { t0: performance.now(), x, y }; },
  }));

  useEffect(() => {
    const canvas = cv.current!;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0, raf = 0, last = performance.now(), running = true, mobile = false;
    let flowers: Flower[] = [], petals: Petal[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight; mobile = w < 640;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      flowers = makeFlowers(w, h, mobile ? 3 : 6);
      petals = Array.from({ length: reducedMotion ? 0 : mobile ? 5 : 9 }, (_, i) => makePetal(w, h, i));
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const b = bloomRef.current;
      const k = b ? Math.max(0, 1 - (now - b.t0) / 2200) : 0;
      const scroll = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      drawSunlight(ctx, w, h, now, scroll, b);
      drawRibbons(ctx, w, h, now, scroll, mobile ? 2 : 4, reducedMotion ? 0.15 : 1, k);
      drawFlowers(ctx, flowers, now, scroll, k, reducedMotion);
      stepPetals(petals, dt, w, h, k);
      drawPetals(ctx, petals);
      raf = requestAnimationFrame(frame);
    };

    const onVis = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);
    return () => {
      running = false; cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reducedMotion]);

  return <canvas ref={cv} aria-hidden="true" className="sg-canvas" />;
});
