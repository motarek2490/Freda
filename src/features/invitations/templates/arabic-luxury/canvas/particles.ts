/**
 * FRIDA — Particle & Petal Systems
 * Atmospheric particles and floating petals for the living canvas.
 */

export interface ParticleConfig {
  count: number;
  canvasWidth: number;
  canvasHeight: number;
  color: string;
  reducedMotion: boolean;
}

// ─── Atmospheric Particle ───

interface AtmosphericParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  depth: number; // 0 = far, 1 = near (parallax)
}

export class AtmosphericSystem {
  private particles: AtmosphericParticle[] = [];
  private w = 0;
  private h = 0;

  init(config: ParticleConfig): void {
    this.w = config.canvasWidth;
    this.h = config.canvasHeight;
    this.particles = [];

    if (config.reducedMotion) return;

    const count = Math.min(config.count, 80);
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      this.particles.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.15 * (0.3 + depth * 0.7),
        vy: -Math.random() * 0.2 * (0.3 + depth * 0.7) - 0.05,
        size: 0.5 + depth * 1.5,
        opacity: 0,
        baseOpacity: 0.1 + depth * 0.25,
        depth,
      });
    }
  }

  update(dt: number, parallaxX: number, parallaxY: number): void {
    for (const p of this.particles) {
      p.x += p.vx * dt * 60 + parallaxX * p.depth * 0.3;
      p.y += p.vy * dt * 60 + parallaxY * p.depth * 0.2;

      // Fade in gently
      if (p.opacity < p.baseOpacity) {
        p.opacity = Math.min(p.opacity + 0.002 * dt * 60, p.baseOpacity);
      }

      // Wrap around
      if (p.y < -10) p.y = this.h + 10;
      if (p.x < -10) p.x = this.w + 10;
      if (p.x > this.w + 10) p.x = -10;
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string): void {
    for (const p of this.particles) {
      if (p.opacity <= 0) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  resize(w: number, h: number): void {
    this.w = w;
    this.h = h;
  }

  /** Emit burst particles from a point (for heart click interaction) */
  emitBurst(x: number, y: number, count: number, color: string): BurstParticle[] {
    const burst: BurstParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1 + Math.random() * 2;
      burst.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.01 + Math.random() * 0.015,
        size: 1 + Math.random() * 2,
        color,
      });
    }
    return burst;
  }
}

// ─── Burst Particle (for click interaction) ───

export interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
}

export function updateBurstParticles(particles: BurstParticle[], dt: number): BurstParticle[] {
  const alive: BurstParticle[] = [];
  for (const p of particles) {
    p.x += p.vx * dt * 60;
    p.y += p.vy * dt * 60;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.life -= p.decay * dt * 60;
    if (p.life > 0) alive.push(p);
  }
  return alive;
}

export function drawBurstParticles(ctx: CanvasRenderingContext2D, particles: BurstParticle[]): void {
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life * 0.6;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ─── Petal System ───

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmount: number;
  color: string;
}

export class PetalSystem {
  private petals: Petal[] = [];
  private w = 0;
  private h = 0;

  init(config: ParticleConfig): void {
    this.w = config.canvasWidth;
    this.h = config.canvasHeight;
    this.petals = [];

    if (config.reducedMotion) return;

    const count = Math.min(config.count, 10);
    const petalColors = ['#B98282', '#D7B58A', '#C9A46A', 'rgba(185,130,130,0.6)'];

    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h * 1.5 - this.h * 0.25,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.2 + Math.random() * 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: 4 + Math.random() * 6,
        opacity: 0.15 + Math.random() * 0.2,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.5 + Math.random() * 0.5,
        swayAmount: 15 + Math.random() * 25,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
      });
    }
  }

  update(dt: number, time: number): void {
    for (const p of this.petals) {
      p.x += (p.vx + Math.sin(time * p.swaySpeed + p.swayPhase) * 0.3) * dt * 60;
      p.y += p.vy * dt * 60;
      p.rotation += p.rotationSpeed * dt * 60;

      // Reset when off screen
      if (p.y > this.h + 20) {
        p.y = -20;
        p.x = Math.random() * this.w;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    for (const p of this.petals) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      // Draw a simple petal shape
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  resize(w: number, h: number): void {
    this.w = w;
    this.h = h;
  }
}
