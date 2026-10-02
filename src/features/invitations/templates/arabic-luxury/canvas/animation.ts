export type AnimationPhase = 'draw_large' | 'shrink_and_position' | 'reveal' | 'idle';

export interface AnimationState {
  phase: AnimationPhase;
  globalTime: number;
  heartProgress: number; // 0 to 1
  scaleMultiplier: number; // Starts at ~1.8, shrinks to 1.0
  yOffsetMultiplier: number; // Starts at 0.5 (center), moves to ~0.22 (up)
  glowIntensity: number; // 0 to 1
  revealOpacity: number; // 0 to 1
  clickPulse: number;
}

const PHASE_DURATIONS: Record<AnimationPhase, number> = {
  draw_large: 2.8,          // 2.8s draws the grand heart in the center
  shrink_and_position: 1.4, // 1.4s shrinks and glides up into place
  reveal: 0.9,              // 0.9s text blossom & reveal
  idle: Infinity,
};

const PHASE_ORDER: AnimationPhase[] = ['draw_large', 'shrink_and_position', 'reveal', 'idle'];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export class AnimationController {
  private phaseIndex = 0;
  private phaseTime = 0;
  private _state: AnimationState;
  private reducedMotion: boolean;

  constructor(reducedMotion: boolean = false) {
    this.reducedMotion = reducedMotion;
    this._state = this.getInitialState();

    if (reducedMotion) {
      this.phaseIndex = 3;
      this._state.phase = 'idle';
      this._state.heartProgress = 1;
      this._state.scaleMultiplier = 1;
      this._state.yOffsetMultiplier = 0.22;
      this._state.glowIntensity = 0.7;
      this._state.revealOpacity = 1;
    }
  }

  private getInitialState(): AnimationState {
    return {
      phase: 'draw_large',
      globalTime: 0,
      heartProgress: 0,
      scaleMultiplier: 1.7, // Starts large in the center
      yOffsetMultiplier: 0.5, // Center of viewport
      glowIntensity: 0.4,
      revealOpacity: 0,
      clickPulse: 0,
    };
  }

  get state(): AnimationState {
    return this._state;
  }

  get shouldReveal(): boolean {
    return this._state.revealOpacity > 0.05;
  }

  triggerClickPulse(): void {
    this._state.clickPulse = 1.0;
  }

  update(dt: number): void {
    if (this.reducedMotion) {
      this._state.globalTime += dt;
      this._state.clickPulse = Math.max(0, this._state.clickPulse - dt * 2);
      return;
    }

    this._state.globalTime += dt;
    this.phaseTime += dt;

    const phase = PHASE_ORDER[this.phaseIndex];
    const duration = PHASE_DURATIONS[phase];
    const t = duration === Infinity ? 0 : Math.min(this.phaseTime / duration, 1);

    switch (phase) {
      case 'draw_large':
        this._state.heartProgress = easeOutQuart(t);
        this._state.scaleMultiplier = 1.7;
        this._state.yOffsetMultiplier = 0.5;
        this._state.glowIntensity = 0.4 + easeOutQuart(t) * 0.4;
        break;

      case 'shrink_and_position':
        this._state.heartProgress = 1;
        // Smooth shrink from 1.7 down to 1.0
        this._state.scaleMultiplier = 1.7 - easeInOutCubic(t) * 0.7;
        // Smooth rise from center (0.5) to upper header (0.22)
        this._state.yOffsetMultiplier = 0.5 - easeInOutCubic(t) * 0.28;
        this._state.glowIntensity = 0.8 + Math.sin(t * Math.PI) * 0.3;
        break;

      case 'reveal':
        this._state.heartProgress = 1;
        this._state.scaleMultiplier = 1.0;
        this._state.yOffsetMultiplier = 0.22;
        this._state.revealOpacity = easeOutExpo(t);
        this._state.glowIntensity = 0.8;
        break;

      case 'idle':
        this._state.heartProgress = 1;
        this._state.scaleMultiplier = 1.0 + Math.sin(this._state.globalTime * 0.8) * 0.015;
        this._state.yOffsetMultiplier = 0.22;
        this._state.glowIntensity = 0.7 + Math.sin(this._state.globalTime * 0.8) * 0.15;
        this._state.revealOpacity = 1;
        break;
    }

    this._state.clickPulse = Math.max(0, this._state.clickPulse - dt * 1.8);

    if (t >= 1 && phase !== 'idle') {
      this.phaseIndex++;
      this.phaseTime = 0;
      this._state.phase = PHASE_ORDER[this.phaseIndex];
    }
  }
}
