export type Language = 'en' | 'ar';

export type Category =
  | 'all'
  | 'weddings'
  | 'engagements'
  | 'birthdays'
  | 'anniversaries'
  | 'baby_showers'
  | 'graduations'
  | 'corporate'
  | 'cultural'
  | 'royal'
  | 'floral'
  | 'minimal'
  | 'botanical'
  | 'boho'
  | 'romantic'
  | 'artistic'
  | 'playful'
  | 'cinematic'
  | 'arabic'
  | 'interactive'
  | 'custom';

export type ThemeStyle =
  | 'luxury'
  | 'romantic'
  | 'minimal'
  | 'floral'
  | 'modern'
  | 'classic'
  | 'dark'
  | 'cultural'
  | 'botanical'
  | 'boho'
  | 'artistic'
  | 'playful'
  | 'cinematic'
  | 'arabic'
  | 'interactive';

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
}

export type TimelineItem = ScheduleItem;

export type PaymentAccountType = 'vodafone_cash' | 'instapay' | 'bank_transfer' | 'e_wallet' | 'other';

export interface PaymentAccount {
  id: string;
  type: PaymentAccountType;
  title: string; // e.g. "فودافون كاش - العريس" or "حساب InstaPay" or "البنك الأهلي"
  accountNumber: string; // Phone number, InstaPay IPA, or IBAN
  accountHolder?: string; // Name of account owner
  qrCodeUrl?: string; // Optional QR code image
  notes?: string; // Optional instructions
}

export interface BankGiftDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
}

export interface GuestWish {
  id: string;
  invitationId: string;
  authorName: string;
  relationship?: string;
  message: string;
  createdAt: string;
  approved?: boolean;
}

export interface EventDetails {
  eventTitle: string;
  hostNames: string;

  // Groom & Bride / Host Couple details (ChungDoi style)
  groomName?: string;
  brideName?: string;
  groomParents?: string;
  brideParents?: string;
  groomAvatarUrl?: string;
  brideAvatarUrl?: string;

  eventDate: string; // YYYY-MM-DD
  eventTime: string; // e.g., "19:00" or "7:00 PM"
  venueName: string;
  address: string;
  venueAddress?: string;
  googleMapsUrl?: string;
  venueMapUrl?: string;
  dressCode?: string;
  customMessage?: string;
  mainMessage?: string;
  rsvpDeadline?: string;
  coverImageUrl?: string;
  musicTrackUrl?: string;
  musicTrackName?: string;

  // Additional ChungDoi Interactive Modules
  enableGallery?: boolean;
  galleryImages?: string[];
  enableSchedule?: boolean;
  scheduleTimeline?: ScheduleItem[];

  // Bank Transfer / Cash / InstaPay / Gift Registry
  enableGiftRegistry?: boolean;
  giftRegistryUrl?: string;
  paymentAccounts?: PaymentAccount[];
  bankDetailsGroom?: BankGiftDetails;
  bankDetailsBride?: BankGiftDetails;

  // Guestbook / Wishes Board
  enableGuestbook?: boolean;
  wishesList?: GuestWish[];

  // Post-Event Wedding Memory Archive
  enableMemories?: boolean;
  memoriesList?: { id: string; url: string; caption?: string; date?: string }[];
  postEventNote?: string;

  enableRSVP?: boolean;
  allowPlusOne?: boolean;
}

export interface CustomThemeColors {
  bg: string;
  cardBg: string;
  text: string;
  accent: string;
  primary?: string;
  secondary?: string;
  background?: string;
}

export type TemplateLayoutType =
  | 'royal'
  | 'minimalist'
  | 'cinematic'
  | 'arabic'
  | 'floral'
  | 'boho'
  | 'interactive'
  | 'playful'
  | 'burgundy'
  | 'crystal'
  | 'cherry'
  | 'baroque'
  | 'citrus'
  | 'confetti'
  | 'emerald'
  | 'ocean'
  | 'autumn'
  | 'starlit'
  | 'lace'
  | 'roseVelvet'
  | 'lavenderFields'
  | 'sunflowerMeadow'
  | 'jasmineNight'
  | 'wisteriaDream'
  | 'celestialEclipse'
  | 'editorialNoir'
  | 'enchantedBotanical'
  | 'opalDream'
  | 'royalArabicEditorial';

export interface Template {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: Category;
  themeStyle: ThemeStyle;
  layoutType?: TemplateLayoutType;
  coverImage: string;
  previewImage?: string;
  galleryPreview: string[];
  supportedLanguages: Language[];
  isFeatured?: boolean;
  isNew?: boolean;
  defaultColors: CustomThemeColors;
  defaultFont: string;
  defaultData: EventDetails;
}

export interface InvitationData {
  id: string;
  templateId: string;
  userId?: string;
  ownerUid?: string;
  customerPhone?: string;
  title: string;
  language: Language;
  themeStyle: ThemeStyle;
  layoutType?: TemplateLayoutType;
  customColors: CustomThemeColors;
  customFont: string;
  eventDetails: EventDetails;
  status: 'draft' | 'pending_approval' | 'published' | 'expired' | 'rejected';
  createdAt: string;
  slug: string;
  rsvpCount?: number;
  guestCount?: number;
  musicTrackUrl?: string;
  musicTrackName?: string;
  galleryImages?: string[];
  hostAccessCode?: string;
  hostUsername?: string;
  expiresAt?: string; // 30-day validity timestamp
  isExpired?: boolean;
  approvedAt?: string;
  planTier?: 'basic' | 'royal_vip' | 'diamond';
  rejectionReason?: string;
}

export interface OrderData {
  id: string;
  invitationId: string;
  invitationTitle: string;
  customerName: string;
  customerPhone: string;
  vodafoneCashSender: string;
  transactionReference?: string;
  notes?: string;
  amount: number;
  currency: string;
  planTier: 'basic' | 'royal_vip' | 'diamond';
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  hostCredentials?: {
    username: string;
    password: string;
    accessCode: string;
    validUntil: string;
  };
  invitationSnapshot?: Partial<InvitationData>;
}

export interface AdminSettings {
  vodafoneCashNumber: string;
  vodafoneCashHolderName: string;
  contactWhatsapp: string;
  basicPriceEGP: number;
  royalPriceEGP: number;
  diamondPriceEGP: number;
  defaultDemoTrackUrl?: string;
  defaultDemoTrackName?: string;
  hiddenTrackIds?: string[];
  siteTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface PricingPlan {
  id: 'basic' | 'royal_vip' | 'diamond';
  name: Record<Language, string>;
  price: number;
  currency: string;
  badge?: Record<Language, string>;
  features: Record<Language, string[]>;
  recommended?: boolean;
}

export interface RSVPResponse {
  id: string;
  invitationId: string;
  guestName: string;
  email?: string;
  phone?: string;
  status: 'attending' | 'declined' | 'maybe';
  guestCount: number;
  plusOneName?: string;
  dietaryNotes?: string;
  tableNumber?: string;
  checkedIn?: boolean;
  checkedInAt?: string;
  personalLink?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface SongDocument {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  previewUrl: string;
  audioUrl: string;
  coverUrl?: string;
  category: string;
  isActive?: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicTrack {
  id?: string;
  title?: string;
  name?: string | { ar: string; en: string };
  artist?: string;
  duration?: number;
  previewUrl?: string;
  audioUrl?: string;
  coverUrl?: string;
  category: string;
  label?: string;
  url: string;
  isActive?: boolean;
  isCloud?: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WebsiteReview {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  eventType?: string;
  designTitle?: string;
  invitationTitle?: string;
  createdAt: string;
  approved?: boolean;
}

export interface CustomTemplate {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: Category;
  themeStyle: ThemeStyle;
  layoutType?: TemplateLayoutType;
  coverImage: string;
  galleryPreview: string[];
  supportedLanguages: Language[];
  isFeatured?: boolean;
  isNew?: boolean;
  defaultColors: CustomThemeColors;
  defaultFont: string;
  createdAt: string;
}


