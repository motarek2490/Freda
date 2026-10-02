export type AnimationPhase = 'draw_large' | 'shrink_and_position' | 'reveal' | 'idle';

export interface AnimationState {
  phase: AnimationPhase;
  globalTime: number;
  heartProgress: number; // 0 to 1
  scaleMultiplier: number; // Starts at ~1.8, shrinks to 1.0
  yOffsetMultiplier: number; // Starts at 0.5 (center), moves to 0.35 (up)
  revealOpacity: number; // 0 to 1
  clickPulse: number;
}

const PHASE_DURATIONS: Record<AnimationPhase, number> = {
  draw_large: 3.5,          // 3.5 ثواني لرسم القلب بحجم كبير
  shrink_and_position: 1.8, // 1.8 ثانية للانكماش والانتقال للموضع النهائي
  reveal: 1.2,              // 1.2 ثانية لظهور النص
  idle: Infinity,
};

const PHASE_ORDER: AnimationPhase[] = ['draw_large', 'shrink_and_position', 'reveal', 'idle'];

// دوال التسريع (Easing) للفخامة
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
      this.phaseIndex = 3; // اذهب مباشرة للوضع الثابت
      this._state.phase = 'idle';
      this._state.heartProgress = 1;
      this._state.scaleMultiplier = 1;
      this._state.yOffsetMultiplier = 0.35;
      this._state.revealOpacity = 1;
    }
  }

  private getInitialState(): AnimationState {
    return {
      phase: 'draw_large',
      globalTime: 0,
      heartProgress: 0,
      scaleMultiplier: 1.8, // يبدأ كبيراً
      yOffsetMultiplier: 0.5, // في منتصف الشاشة تماماً
      revealOpacity: 0,
      clickPulse: 0,
    };
  }

  get state(): AnimationState { return this._state; }
  get shouldReveal(): boolean { return this._state.revealOpacity > 0.1; }

  triggerClickPulse(): void { this._state.clickPulse = 1.0; }

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
        this._state.scaleMultiplier = 1.8;
        this._state.yOffsetMultiplier = 0.5;
        break;
      case 'shrink_and_position':
        this._state.heartProgress = 1;
        // انكماش أنيق من 1.8 إلى 1.0
        this._state.scaleMultiplier = 1.8 - (easeInOutCubic(t) * 0.8);
        // انتقال سلس للأعلى قليلاً لإفساح المجال للنص
        this._state.yOffsetMultiplier = 0.5 - (easeInOutCubic(t) * 0.15);
        break;
      case 'reveal':
        this._state.scaleMultiplier = 1.0;
        this._state.yOffsetMultiplier = 0.35;
        this._state.revealOpacity = easeOutExpo(t);
        break;
      case 'idle':
        this._state.heartProgress = 1;
        this._state.scaleMultiplier = 1.0 + Math.sin(this._state.globalTime * 0.8) * 0.015; // تنفس خفيف جداً
        this._state.yOffsetMultiplier = 0.35;
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
