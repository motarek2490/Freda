// ... (الاستيرادات كما هي)

export const RomanticCanvas: React.FC<RomanticCanvasProps> = ({
  accentColor = '#C9A46A',
  onReveal,
  interactive = true,
}) => {
  // ... (كل الـ refs كما هي)

  const render = useCallback((timestamp: number) => {
    // ... (حساب dt و التحقق من isVisible كما هو)

    const { w, h } = sizeRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = w / dpr;
    const displayH = h / dpr;

    controller.update(dt);
    const state = controller.state;

    if (state.revealOpacity > 0.5 && !revealedRef.current) {
      revealedRef.current = true;
      onReveal();
    }

    // ... (رسم الخلفية والجسيمات كما هو)

    // ── Heart Drawing & Positioning ──
    // الحجم يتغير من 1.8 إلى 1.0 بناءً على المرحلة
    const baseScale = Math.min(displayW, displayH) * 0.12;
    const heartScale = baseScale * state.scaleMultiplier;
    
    // الموقع يتحرك من المنتصف (0.5) إلى الأعلى قليلاً (0.35)
    const heartCx = displayW * 0.5;
    const heartCy = displayH * state.yOffsetMultiplier;

    const effectiveGlow = Math.min(state.glowIntensity + state.clickPulse * 0.5, 1.5);

    drawHeart(
      ctx,
      heartPointsRef.current,
      state.heartProgress,
      heartCx,
      heartCy,
      heartScale,
      accentColor,
      effectiveGlow,
      1.0 // التنفس يُدار الآن عبر scaleMultiplier في وضع الـ idle
    );

    // ... (رسم حلقة النقر والجسيمات المتفجرة كما هي)

    rafRef.current = requestAnimationFrame(render);
  }, [accentColor, onReveal]);

  // ... (بقية الكود كما هو)
};
