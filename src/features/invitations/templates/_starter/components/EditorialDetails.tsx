import React from 'react';
import { MapPin } from 'lucide-react';

interface Props { date?: string; time?: string; venue?: string; address?: string; isRtl: boolean }

export const EditorialDetails: React.FC<Props> = ({ date, time, venue, address, isRtl }) => {
  const rows = [
    { k: isRtl ? 'التاريخ' : 'Date', v: date },
    { k: isRtl ? 'الوقت' : 'Time', v: time },
    { k: isRtl ? 'المكان' : 'Location', v: venue, sub: address },
  ].filter((r) => r.v);
  return (
    <section className="sg-section">
      <div className="sg-index"><span>02</span><span>{isRtl ? 'الاحتفال' : 'The Celebration'}</span></div>
      {rows.map((r) => (
        <div className="sg-row" key={r.k}>
          <span className="sg-small">{r.k}</span>
          <div>
            <p className="sg-big">{r.v}</p>
            {r.sub && <p className="sg-small sg-sub"><MapPin size={12} aria-hidden /> {r.sub}</p>}
          </div>
        </div>
      ))}
    </section>
  );
};
