import React from 'react';

interface Props {
  wishes: any[]; isRtl: boolean; success?: boolean;
  author: string; setAuthor: (v: string) => void;
  relation: string; setRelation: (v: string) => void;
  message: string; setMessage: (v: string) => void;
  onAdd: (e?: any) => void;
}

export const Guestbook: React.FC<Props> = ({ wishes, isRtl, success, author, setAuthor, relation, setRelation, message, setMessage, onAdd }) => (
  <section className="sg-section">
    <div className="sg-index"><span>05</span><span>{isRtl ? 'دفتر التهاني' : 'Guestbook'}</span></div>
    <div className="sg-fields">
      <input className="sg-input" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={isRtl ? 'اسمك' : 'Your name'} aria-label={isRtl ? 'اسمك' : 'Your name'} />
      <input className="sg-input" value={relation} onChange={(e) => setRelation(e.target.value)} placeholder={isRtl ? 'صلتك بالعروسين' : 'Your relation to the couple'} aria-label={isRtl ? 'صلتك' : 'Relation'} />
      <textarea className="sg-input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={isRtl ? 'اكتب تهنئتك' : 'Write your wish'} aria-label={isRtl ? 'تهنئتك' : 'Your wish'} />
      <button type="button" className="sg-link sg-btn" onClick={(e) => onAdd(e)}>{isRtl ? 'أرسل التهنئة' : 'Send your wish'}</button>
      {success && <p className="sg-small" role="status">{isRtl ? 'وصلت تهنئتك، شكراً لك.' : 'Your wish was sent. Thank you.'}</p>}
    </div>
    <div className="sg-wishes">
      {(wishes || []).map((w, i) => (
        <blockquote className="sg-wish" key={w.id || i}>
          <p>{w.message || w.text}</p>
          <footer className="sg-small">{w.author || w.name}{w.relation ? ` · ${w.relation}` : ''}</footer>
        </blockquote>
      ))}
    </div>
  </section>
);
