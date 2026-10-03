export interface Petal { x: number; y: number; z: number; vx: number; vy: number; rot: number; vr: number; col: string }
const COLS = ['rgba(244,183,163,', 'rgba(233,166,166,', 'rgba(255,249,240,', 'rgba(207,194,223,'];

export const makePetal = (w: number, h: number, i: number, anywhere = true): Petal => ({
  x: Math.random() * w, y: anywhere ? Math.random() * h : -20, z: 0.4 + Math.random() * 0.9,
  vx: 6 + Math.random() * 10, vy: 8 + Math.random() * 10, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.8, col: COLS[i % COLS.length],
});

export function stepPetals(ps: Petal[], dt: number, w: number, h: number, gust: number) {
  ps.forEach((p, i) => {
    p.x += (p.vx + gust * 40) * p.z * dt; p.y += (p.vy - gust * 30) * p.z * dt; p.rot += p.vr * dt;
    p.z += Math.sin(p.rot) * 0.0008;
    if (p.x > w + 30 || p.y > h + 30) Object.assign(p, makePetal(w, h, i, false), { x: -20 + Math.random() * w * 0.5 });
  });
}

export function drawPetals(ctx: CanvasRenderingContext2D, ps: Petal[]) {
  for (const p of ps) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.6 + 0.4 * Math.cos(p.rot * 1.3));
    ctx.fillStyle = p.col + '0.7)';
    ctx.beginPath(); ctx.ellipse(0, 0, 9 * p.z, 5 * p.z, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}
