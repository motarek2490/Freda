import React from 'react';

interface HeroProps {
  groomName: string; brideName: string; eventTitle: string; hostNames?: string;
  customMessage?: string; isRtl: boolean; onBloom: (x: number, y: number) => void;
}

export const Hero: React.FC<HeroProps> = ({ groomName, brideName, eventTitle, hostNames, customMessage, isRtl, onBloom }) => (
  <header className="sg-hero">
    <p className="sg-small sg-fade">
      {hostNames || (isRtl ? 'بصحبة عائلتينا الكريمتين' : 'Together with their families')}
    </p>
    <button
      type="button"
      className="sg-artwork"
      aria-label={isRtl ? 'المس اللوحة' : 'Touch the artwork'}
      onClick={(e) => onBloom(e.clientX, e.clientY)}
    >
      <span className="sg-name sg-print" style={{ animationDelay: '1.6s' }}>{groomName || (isRtl ? 'أحمد' : 'Ahmed')}</span>
      <span className="sg-amp sg-print" style={{ animationDelay: '2.1s' }}>&amp;</span>
      <span className="sg-name sg-print" style={{ animationDelay: '2.5s' }}>{brideName || (isRtl ? 'ليلى' : 'Layla')}</span>
    </button>
    <p className="sg-lede sg-fade" style={{ animationDelay: '3.2s' }}>
      {customMessage || (isRtl ? `ندعوكم لمشاركتنا فرحة ${eventTitle || 'زفافنا'}` : `Invite you to celebrate ${eventTitle ? eventTitle.toLowerCase() : 'their wedding'}`)}
    </p>
  </header>
);
