const COLS = [['244,183,163', 0.22], ['216,188,138', 0.2], ['255,249,240', 0.5], ['233,166,166', 0.16]] as const;

/** Translucent silk: area between two phase-shifted sine edges, drawn with a soft gradient. */
export function drawRibbons(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, scroll: number, count: number, speed: number, push: number) {
  for (let i = 0; i < count; i++) {
    const [rgb, a] = COLS[i % COLS.length];
    const base = h * (0.25 + i * 0.22) - scroll * (0.05 + i * 0.03);
    const amp = h * 0.07 + push * 12;
    const ph = t * 0.00022 * speed + i * 2.1;
    const width = 26 + i * 12;
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, `rgba(${rgb},0)`);
    g.addColorStop(0.5, `rgba(${rgb},${a})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    const step = Math.max(12, w / 40);
    for (let x = 0; x <= w; x += step) ctx.lineTo(x, base + Math.sin(x * 0.006 + ph) * amp);
    for (let x = w; x >= 0; x -= step) ctx.lineTo(x, base + width + Math.sin(x * 0.006 + ph + 0.5) * amp * 1.15);
    ctx.closePath();
    ctx.fill();
  }
}
