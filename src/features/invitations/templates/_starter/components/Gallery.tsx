import React, { useEffect, useRef } from 'react';

const SHAPES = ['60% 40% 55% 45% / 50% 60% 40% 50%', '45% 55% 40% 60% / 60% 40% 55% 45%', '55% 45% 60% 40% / 40% 55% 45% 60%'];

export const Gallery: React.FC<{ images: string[]; isRtl: boolean; calm: boolean }> = ({ images, isRtl, calm }) => {
  const refs = useRef<(HTMLFigureElement | null)[]>([]);
  useEffect(() => {
    if (calm || !images.length) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - window.innerHeight / 2) * (0.04 + (i % 3) * 0.03);
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      }));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { window.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [images, calm]);
  if (!images.length) return null;
  return (
    <section className="sg-section">
      <div className="sg-index"><span>04</span><span>{isRtl ? 'الذكريات' : 'The Memories'}</span></div>
      <div className="sg-gallery">
        {images.slice(0, 6).map((src, i) => (
          <figure key={src + i} ref={(el) => { refs.current[i] = el; }} className={`sg-photo sg-photo-${i % 3}`}
            style={{ borderRadius: SHAPES[i % 3] }}>
            <img src={src} alt="" loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
};
