import React from 'react';

export const GiftRegistry: React.FC<{ onOpen: () => void; isRtl: boolean }> = ({ onOpen, isRtl }) => (
  <section className="sg-section">
    <div className="sg-index"><span>06</span><span>{isRtl ? 'الهدايا' : 'Gifts'}</span></div>
    <p className="sg-big">{isRtl ? 'حضوركم هو أجمل هدية.' : 'Your presence is the gift.'}</p>
    <p className="sg-small" style={{ margin: '1rem 0' }}>
      {isRtl ? 'ومن أراد أن يشاركنا الفرحة بهدية، فهذه التفاصيل.' : 'If you wish to give something more, the details are here.'}
    </p>
    <button type="button" className="sg-link sg-btn" onClick={onOpen}>{isRtl ? 'عرض تفاصيل الهدايا' : 'View gift details'}</button>
  </section>
);
