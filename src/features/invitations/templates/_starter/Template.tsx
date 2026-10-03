import React, { useRef } from 'react';
import { InvitationTemplateProps } from '../../model/templateContract';
import { SunlitCanvas, SunlitCanvasHandle } from './canvas/SunlitCanvas';
import { Hero } from './components/Hero';
import { EditorialDetails } from './components/EditorialDetails';
import { Countdown } from './components/Countdown';
import { Gallery } from './components/Gallery';
import { RSVP } from './components/RSVP';
import { Guestbook } from './components/Guestbook';
import { GiftRegistry } from './components/GiftRegistry';
import './styles.css';

export const SunlitGardenTemplate: React.FC<InvitationTemplateProps> = ({
  invitation, isRtl, customColors, timeLeft, wishes, onOpenRsvp, onOpenBank, onAddWish, newWishAuthor, setNewWishAuthor,
  newWishRelation, setNewWishRelation, newWishMessage, setNewWishMessage, wishSuccess, getGoogleCalendarUrl,
}) => {
  const d = invitation.eventDetails;
  const canvas = useRef<SunlitCanvasHandle>(null);
  const calm = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  // Gallery field name is not visible in the shared files; adjust if your model differs.
  const inv: any = invitation;
  const images: string[] = (inv.gallery?.images || inv.gallery || inv.galleryImages || []).filter((s: unknown) => typeof s === 'string');

  const vars = {
    '--sg-bg': customColors?.bg && customColors.bg !== '#11100F' ? customColors.bg : '#FFF9F0',
    '--sg-text': customColors?.text && customColors.text !== '#F7F1E8' ? customColors.text : '#3A302A',
    '--sg-accent': customColors?.accent || '#D8BC8A',
  } as React.CSSProperties;

  return (
    <div className={`template-sunlit-garden ${calm ? 'sg-calm' : ''}`} dir={isRtl ? 'rtl' : 'ltr'} lang={isRtl ? 'ar' : 'en'} style={vars}>
      <SunlitCanvas ref={canvas} reducedMotion={calm} />
      <main className="sg-content">
        <div className="sg-index sg-index-top"><span>01</span><span>{isRtl ? 'البداية' : 'The Beginning'}</span></div>
        <Hero
          groomName={d.groomName || ''} brideName={d.brideName || ''} eventTitle={d.eventTitle || ''}
          hostNames={d.hostNames} customMessage={d.customMessage} isRtl={isRtl}
          onBloom={(x, y) => canvas.current?.bloom(x, y)}
        />
        <EditorialDetails date={d.eventDate} time={d.eventTime} venue={d.venueName} address={d.address} isRtl={isRtl} />
        <Countdown {...timeLeft} isRtl={isRtl} calendarUrl={getGoogleCalendarUrl()} />
        <Gallery images={images} isRtl={isRtl} calm={!!calm} />
        <Guestbook wishes={wishes as any[]} isRtl={isRtl} success={!!wishSuccess}
          author={newWishAuthor} setAuthor={setNewWishAuthor} relation={newWishRelation} setRelation={setNewWishRelation}
          message={newWishMessage} setMessage={setNewWishMessage} onAdd={onAddWish as any} />
        {/* Flag name is a guess; adjust to your eventDetails field. */}
        {((d as any).enableGiftRegistry ?? (d as any).enableBank) && <GiftRegistry onOpen={onOpenBank} isRtl={isRtl} />}
        {d.enableRSVP && <RSVP onOpen={onOpenRsvp} isRtl={isRtl} />}
      </main>
    </div>
  );
};

export default SunlitGardenTemplate;
