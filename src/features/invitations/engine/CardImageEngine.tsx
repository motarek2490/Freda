import React from 'react';
import { InvitationData, Language } from '../../../types';
import { TemplateCardImageProps } from '../model/templateContract';
import { ArabicLuxuryCardImage } from '../templates/arabic-luxury/CardImage';
import { RoyalCardImage } from '../templates/royal/CardImage';
import { ButterflyCardImage } from '../templates/butterfly-romance/CardImage';
import { CinematicCardImage } from '../templates/cinematic/CardImage';

interface CardImageEngineProps {
  invitation: InvitationData;
  currentLang?: Language;
  qrDataUrl: string;
  shareUrl: string;
}

export const CardImageEngine: React.FC<CardImageEngineProps> = (props) => {
  const { invitation } = props;
  const layout = invitation.layoutType || (invitation.templateId?.includes('arabic') ? 'arabic' : 'royal');

  const isOfficialDemo =
    invitation.id.startsWith('preview-tmpl-') ||
    invitation.id.startsWith('demo-') ||
    invitation.id === 'vip_1' ||
    Boolean(invitation.slug?.startsWith('preview-tmpl-')) ||
    invitation.hostAccessCode === 'HOST-DEMO';

  const isDraftPreview = invitation.status !== 'published' && !isOfficialDemo;

  let renderedCard: React.ReactElement;
  if (layout === 'arabic' || invitation.templateId?.includes('arabic')) {
    renderedCard = <ArabicLuxuryCardImage {...props} />;
  } else if (layout === 'butterflyRomance' || invitation.templateId?.includes('butterfly')) {
    renderedCard = <ButterflyCardImage {...props} />;
  } else if (layout === 'cinematic' || invitation.templateId?.includes('cinematic')) {
    renderedCard = <CinematicCardImage {...props} />;
  } else {
    renderedCard = <RoyalCardImage {...props} />;
  }

  if (!isDraftPreview) {
    return renderedCard;
  }

  // Security Watermark for unactivated draft invitations
  return (
    <div className="relative w-fit mx-auto overflow-hidden rounded-3xl group shadow-2xl">
      {renderedCard}

      {/* Diagonal Security Watermark Bands */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-12 z-30 overflow-hidden select-none opacity-50">
        <div className="transform -rotate-12 bg-amber-500/20 backdrop-blur-[1px] border-y border-amber-400/40 py-2 text-center text-amber-200 font-extrabold text-xs sm:text-sm tracking-widest shadow-lg">
          FRIDA PREVIEW • مسودة غير مفعلة • FRIDA PREVIEW
        </div>
        <div className="transform -rotate-12 bg-amber-500/20 backdrop-blur-[1px] border-y border-amber-400/40 py-2 text-center text-amber-200 font-extrabold text-xs sm:text-sm tracking-widest shadow-lg">
          DRAFT COPY • معاينة تجريبية • DRAFT COPY
        </div>
      </div>

      {/* Top Floating Security Badge */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-[#171717]/95 border border-amber-400 text-amber-300 text-[10px] font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md">
        <span>🔒 مسودة تجريبية (غير مفعلة)</span>
      </div>
    </div>
  );
};

