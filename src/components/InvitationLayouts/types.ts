import React from 'react';
import { InvitationData, Language, GuestWish } from '../../types';
import { useTranslation } from '../../data/translations';

export interface TemplateLayoutProps {
  invitation: InvitationData;
  lang: Language;
  isRtl: boolean;
  t: ReturnType<typeof useTranslation>;
  customColors: { bg: string; cardBg: string; text: string; accent: string };
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
  wishes: GuestWish[];
  onOpenRsvp: () => void;
  onOpenBank: () => void;
  onAddWish: (e: React.FormEvent) => void;
  newWishAuthor: string;
  setNewWishAuthor: (v: string) => void;
  newWishRelation: string;
  setNewWishRelation: (v: string) => void;
  newWishMessage: string;
  setNewWishMessage: (v: string) => void;
  wishSuccess: boolean;
  setActiveLightboxImg: (img: string | null) => void;
  getGoogleCalendarUrl: () => string;
}
