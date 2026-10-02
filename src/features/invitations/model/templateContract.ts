import React from 'react';
import {
  InvitationData,
  Language,
  GuestWish,
  Category,
  ThemeStyle,
  TemplateLayoutType,
  CustomThemeColors,
} from '../../../types';
import { useTranslation } from '../../../data/translations';

/**
 * Standard Contract Props passed to all Invitation Templates.
 * 100% backward compatible with existing TemplateLayoutProps.
 */
export interface InvitationTemplateProps {
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

// Alias for seamless backward compatibility
export type TemplateLayoutProps = InvitationTemplateProps;

/**
 * Configuration & Metadata for an isolated template module
 */
export interface TemplateConfig {
  id: string;
  name: Record<Language, string>;
  version: string;
  layoutType: TemplateLayoutType;
  category: Category;
  themeStyle: ThemeStyle;
  defaultColors: CustomThemeColors;
  defaultFont: string;
  supportedLanguages: Language[];
  supportsRTL: boolean;
  supportsRSVP: boolean;
  supportsMusic: boolean;
  supportsGiftRegistry: boolean;
  supportsGallery: boolean;
  supportsTimeline: boolean;
  supportsGuestbook: boolean;
  introType?: string;
  author?: string;
  description?: Record<Language, string>;
}
