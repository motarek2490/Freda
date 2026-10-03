export interface Bloom { t0: number; x: number; y: number }

/** Warm light drifting slowly across the canvas; a tap adds a soft expanding glow. */
export function drawSunlight(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, scroll: number, bloom: Bloom | null) {
  const x = w * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.00006 + scroll * 0.0004)));
  const y = h * (0.15 + 0.1 * Math.sin(t * 0.00004));
  const r = Math.max(w, h) * 0.75;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(246,217,139,0.34)');
  g.addColorStop(0.5, 'rgba(244,183,163,0.10)');
  g.addColorStop(1, 'rgba(255,249,240,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  if (bloom) {
    const k = (t - bloom.t0) / 2200;
    if (k < 1) {
      const e = 1 - Math.pow(1 - k, 3);
      const br = 60 + e * Math.max(w, h) * 0.45;
      const bg = ctx.createRadialGradient(bloom.x, bloom.y, 0, bloom.x, bloom.y, br);
      bg.addColorStop(0, `rgba(255,236,190,${0.55 * (1 - k)})`);
      bg.addColorStop(1, 'rgba(255,236,190,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    }
  }
}
