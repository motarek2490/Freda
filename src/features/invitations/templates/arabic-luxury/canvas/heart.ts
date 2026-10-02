/**
 * FRIDA — Heart Drawing Engine
 * Generates and renders a luminous hand-drawn heart on Canvas 2D.
 */

export interface HeartPoint {
  x: number;
  y: number;
}

/**
 * Generate heart path points using the parametric heart equation.
 * Returns normalized points centered at origin, scaled to ~[-1, 1].
 */
export function generateHeartPath(numPoints: number = 300): HeartPoint[] {
  const points: HeartPoint[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    // Normalize to roughly [-1, 1] range (heart spans ~[-16,16] x, ~[-17,13] y)
    points.push({ x: x / 17, y: y / 17 });
  }
  return points;
}

/**
 * Draw the heart progressively on a Canvas 2D context.
 *
 * @param ctx        Canvas 2D rendering context
 * @param points     Pre-computed heart path points
 * @param progress   0–1 how much of the heart to draw
 * @param cx         Center X in canvas pixels
 * @param cy         Center Y in canvas pixels
 * @param scale      Size multiplier in pixels
 * @param color      Accent color (e.g. '#C9A46A')
 * @param glowAmount 0–1 glow intensity
 * @param breathScale Subtle breathing scale multiplier (1.0 = normal)
 */
export function drawHeart(
  ctx: CanvasRenderingContext2D,
  points: HeartPoint[],
  progress: number,
  cx: number,
  cy: number,
  scale: number,
  color: string,
  glowAmount: number,
  breathScale: number = 1.0,
): void {
  if (progress <= 0 || points.length < 2) return;

  const drawCount = Math.max(2, Math.floor(points.length * Math.min(progress, 1)));
  const effectiveScale = scale * breathScale;

  ctx.save();
  ctx.translate(cx, cy);

  // ── Glow layers (drawn behind the main stroke) ──
  if (glowAmount > 0) {
    const glowLayers = [
      { width: 12, alpha: 0.04 * glowAmount },
      { width: 8, alpha: 0.08 * glowAmount },
      { width: 4, alpha: 0.15 * glowAmount },
    ];

    for (const layer of glowLayers) {
      ctx.beginPath();
      ctx.moveTo(points[0].x * effectiveScale, points[0].y * effectiveScale);
      for (let i = 1; i < drawCount; i++) {
        ctx.lineTo(points[i].x * effectiveScale, points[i].y * effectiveScale);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = layer.width;
      ctx.globalAlpha = layer.alpha;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }

  // ── Main stroke ──
  ctx.beginPath();
  ctx.moveTo(points[0].x * effectiveScale, points[0].y * effectiveScale);
  for (let i = 1; i < drawCount; i++) {
    ctx.lineTo(points[i].x * effectiveScale, points[i].y * effectiveScale);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4;
  ctx.globalAlpha = 0.98;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowBlur = 18 * Math.max(glowAmount, 0.4);
  ctx.shadowColor = color;
  ctx.stroke();

  // ── Bright tip (the "pen" point) ──
  if (progress < 1) {
    const tip = points[drawCount - 1];
    const tipX = tip.x * effectiveScale;
    const tipY = tip.y * effectiveScale;

    ctx.beginPath();
    ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.fill();

    // Outer glow ring at tip
    ctx.beginPath();
    ctx.arc(tipX, tipY, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Check if a point (px, py) is near the heart center.
 */
export function isNearHeart(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number,
): boolean {
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy < radius * radius;
}
