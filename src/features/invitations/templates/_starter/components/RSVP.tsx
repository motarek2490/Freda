import React, { useState } from 'react';

export const RSVP: React.FC<{ onOpen: () => void; isRtl: boolean }> = ({ onOpen, isRtl }) => {
  const [drawn, setDrawn] = useState(0);
  const click = () => { setDrawn((n) => n + 1); window.setTimeout(onOpen, 450); };
  return (
    <section className="sg-section sg-rsvp">
      <div className="sg-wrap">
        <button type="button" className="sg-capsule" onClick={click}>
          <span>{isRtl ? 'تأكيد الحضور' : 'Confirm attendance'}</span>
        </button>
        {drawn > 0 && (
          <svg key={drawn} className="sg-vine" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden>
            <path pathLength={1} d="M150 4 C250 0 296 20 296 40 C296 62 240 76 150 76 C60 76 4 62 4 40 C4 20 50 0 150 4 Z" />
          </svg>
        )}
      </div>
    </section>
  );
};
