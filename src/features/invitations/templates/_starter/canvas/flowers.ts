export interface Flower { x: number; y: number; r: number; n: number; hue: string; phase: number; stem: number }
const HUES = ['#F4B7A3', '#E9A6A6', '#CFC2DF', '#F6D98B'];

export function makeFlowers(w: number, h: number, count: number): Flower[] {
  const spots = [[0.12, 0.2], [0.88, 0.3], [0.08, 0.62], [0.9, 0.78], [0.5, 0.9], [0.78, 0.08]];
  return spots.slice(0, count).map(([fx, fy], i) => ({
    x: w * fx, y: h * fy, r: Math.min(w, h) * (0.07 + 0.03 * (i % 3) / 2),
    n: 5 + (i % 2), hue: HUES[i % HUES.length], phase: i * 1.7, stem: h * 0.28,
  }));
}

/** Gentle sway; `lift` (0..1) is the bloom reaction after a tap. */
export function drawFlowers(ctx: CanvasRenderingContext2D, fl: Flower[], t: number, scroll: number, lift: number, calm: boolean) {
  for (const f of fl) {
    const s = calm ? 0 : Math.sin(t * 0.0007 + f.phase);
    const sway = s * 7 + lift * 6 * Math.sin(f.phase);
    const ty = f.y - scroll * 0.06 * (1 + (f.phase % 1));
    ctx.strokeStyle = 'rgba(160,178,130,0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(f.x + sway * 2, ty + f.stem);
    ctx.quadraticCurveTo(f.x - sway * 3, ty + f.stem * 0.5, f.x + sway, ty);
    ctx.stroke();
    // translucent leaf
    ctx.fillStyle = 'rgba(200,215,178,0.45)';
    ctx.beginPath();
    ctx.ellipse(f.x + sway * 1.5 + 10, ty + f.stem * 0.45, f.r * 0.7, f.r * 0.22, 0.5 + s * 0.08, 0, Math.PI * 2);
    ctx.fill();
    const open = 1 + 0.05 * s + lift * 0.12;
    const rot = s * 0.05 + f.phase;
    for (let i = 0; i < f.n; i++) {
      const a = rot + (i / f.n) * Math.PI * 2;
      ctx.save();
      ctx.translate(f.x + sway, ty);
      ctx.rotate(a);
      ctx.fillStyle = f.hue + 'AA';
      ctx.beginPath();
      ctx.ellipse(f.r * 0.55 * open, 0, f.r * 0.6, f.r * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#F6D98B';
    ctx.beginPath();
    ctx.arc(f.x + sway, ty, f.r * 0.14, 0, Math.PI * 2);
    ctx.fill();
  }
}
