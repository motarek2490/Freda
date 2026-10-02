/**
 * FRIDA — Animation State Machine & Easing Utilities
 * Orchestrates the cinematic opening sequence.
 */

export type AnimationPhase =
  | 'fade_in'
  | 'draw_heart'
  | 'heart_glow'
  | 'zoom_in'
  | 'zoom_out_reveal'
  | 'idle';

export interface AnimationState {
  phase: AnimationPhase;
  globalTime: number;
  heartProgress: number;
  glowIntensity: number;
  zoomLevel: number;
  breathScale: number;
  revealOpacity: number;
  clickPulse: number;
}

// ─── Phase Timeline (seconds) ───

const PHASE_DURATIONS: Record<AnimationPhase, number> = {
  fade_in: 1.0,
  draw_heart: 3.0,
  heart_glow: 1.0,
  zoom_in: 1.5,
  zoom_out_reveal: 2.0,
  idle: Infinity,
};

const PHASE_ORDER: AnimationPhase[] = [
  'fade_in',
  'draw_heart',
  'heart_glow',
  'zoom_in',
  'zoom_out_reveal',
  'idle',
];

// ─── Easing Functions ───

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// ─── Animation Controller ───

export class AnimationController {
  private phaseIndex = 0;
  private phaseTime = 0;
  private _state: AnimationState;
  private reducedMotion: boolean;

  constructor(reducedMotion: boolean = false) {
    this.reducedMotion = reducedMotion;
    this._state = this.getInitialState();

    if (reducedMotion) {
      // Skip to idle immediately with everything visible
      this.phaseIndex = PHASE_ORDER.length - 1;
      this._state.phase = 'idle';
      this._state.heartProgress = 1;
      this._state.glowIntensity = 0.6;
      this._state.zoomLevel = 1;
      this._state.revealOpacity = 1;
      this._state.breathScale = 1;
    }
  }

  private getInitialState(): AnimationState {
    return {
      phase: 'fade_in',
      globalTime: 0,
      heartProgress: 0,
      glowIntensity: 0,
      zoomLevel: 1,
      breathScale: 1,
      revealOpacity: 0,
      clickPulse: 0,
    };
  }

  get state(): AnimationState {
    return this._state;
  }

  get currentPhase(): AnimationPhase {
    return PHASE_ORDER[this.phaseIndex];
  }

  /** Returns true when the reveal phase begins (names should appear) */
  get shouldReveal(): boolean {
    return this._state.revealOpacity > 0.01;
  }

  triggerClickPulse(): void {
    this._state.clickPulse = 1.0;
  }

  update(dt: number): void {
    if (this.reducedMotion) {
      // Minimal breathing only
      this._state.globalTime += dt;
      this._state.breathScale = 1 + Math.sin(this._state.globalTime * 0.8) * 0.008;
      this._state.clickPulse = Math.max(0, this._state.clickPulse - dt * 2);
      return;
    }

    this._state.globalTime += dt;
    this.phaseTime += dt;

    const phase = PHASE_ORDER[this.phaseIndex];
    const duration = PHASE_DURATIONS[phase];
    const t = duration === Infinity ? 0 : Math.min(this.phaseTime / duration, 1);

    switch (phase) {
      case 'fade_in':
        // Just waiting, ambient particles fade in via their own logic
        break;

      case 'draw_heart':
        this._state.heartProgress = easeInOutCubic(t);
        this._state.glowIntensity = t * 0.3;
        break;

      case 'heart_glow':
        this._state.heartProgress = 1;
        this._state.glowIntensity = 0.3 + easeOutQuart(t) * 0.7;
        break;

      case 'zoom_in':
        this._state.glowIntensity = 1.0 - t * 0.2;
        this._state.zoomLevel = 1 + easeInOutSine(t) * 0.15;
        break;

      case 'zoom_out_reveal':
        this._state.zoomLevel = 1.15 - easeOutExpo(t) * 0.15;
        this._state.glowIntensity = 0.8 - t * 0.2;
        this._state.revealOpacity = easeOutQuart(t);
        break;

      case 'idle':
        this._state.heartProgress = 1;
        this._state.glowIntensity = 0.5 + Math.sin(this._state.globalTime * 0.6) * 0.1;
        this._state.zoomLevel = 1;
        this._state.revealOpacity = 1;
        // Breathing: very subtle scale oscillation
        this._state.breathScale =
          1 + Math.sin(this._state.globalTime * 0.8) * 0.012;
        break;
    }

    // Decay click pulse
    this._state.clickPulse = Math.max(0, this._state.clickPulse - dt * 1.8);

    // Advance phase
    if (t >= 1 && phase !== 'idle') {
      this.phaseIndex++;
      this.phaseTime = 0;
      this._state.phase = PHASE_ORDER[this.phaseIndex];
    }
  }
}
