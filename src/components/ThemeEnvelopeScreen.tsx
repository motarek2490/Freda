import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown, Flower2, Gem, Sun, PartyPopper, Waves, Flame, Moon, Heart } from 'lucide-react';
import { InvitationData, TemplateLayoutType } from '../types';

interface ThemeEnvelopeScreenProps {
  invitation: InvitationData;
  guestNameParam: string | null;
  isRtl: boolean;
  onOpen: () => void;
}

export const ThemeEnvelopeScreen: React.FC<ThemeEnvelopeScreenProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onOpen,
}) => {
  const details = invitation.eventDetails;
  const layout = (invitation.layoutType || 'royal') as TemplateLayoutType;
  const customColors = invitation.customColors;

  const accent = customColors?.accent || '#B99A65';

  // Customize envelope styling and seals per layout type
  const getThemeEnvelopeConfig = () => {
    switch (layout) {
      case 'roseVelvet':
        return {
          bg: '#1A050B',
          cardBg: '#2A0A12',
          borderColor: '#E6A15C',
          icon: (
            <svg viewBox="0 0 50 50" className="w-8 h-8 fill-current text-rose-500 animate-pulse">
              <path d="M25 5 C15 5 10 15 15 25 C20 35 30 35 35 25 C40 15 35 5 25 5 Z M25 12 C28 12 30 16 28 20 C26 24 22 24 20 20 C18 16 22 12 25 12 Z" />
            </svg>
          ),
          titleColor: '#E6A15C',
          badgeText: isRtl ? 'ظرف الورد المخملي الملكي' : 'Royal Velvet Rose Wax Seal Envelope',
          buttonBg: 'linear-gradient(to right, #80091B, #E6A15C)',
          buttonTextColor: '#FFFFFF',
        };
      case 'lavenderFields':
        return {
          bg: '#1A1326',
          cardBg: '#261C38',
          borderColor: '#C084FC',
          icon: (
            <svg viewBox="0 0 40 40" className="w-8 h-8 fill-current text-purple-400 animate-bounce">
              <path d="M20 38 L20 10 M17 30 C15 28, 15 25, 20 25 C25 25, 25 28, 23 30 Z M16 22 C14 20, 14 17, 20 17 C26 17, 26 20, 24 22 Z" />
            </svg>
          ),
          titleColor: '#C084FC',
          badgeText: isRtl ? 'ظرف حقول اللافندر الحالم' : 'Lavender Sprig Enchanted Envelope',
          buttonBg: 'linear-gradient(to right, #A855F7, #C084FC)',
          buttonTextColor: '#FFFFFF',
        };
      case 'sunflowerMeadow':
        return {
          bg: '#1F180A',
          cardBg: '#2E230E',
          borderColor: '#EAB308',
          icon: <Sun className="w-8 h-8 text-yellow-400 animate-spin-slow" />,
          titleColor: '#FACC15',
          badgeText: isRtl ? 'ظرف عباد الشمس المشرق' : 'Sunny Sunflower Meadow Envelope',
          buttonBg: 'linear-gradient(to right, #EAB308, #F97316)',
          buttonTextColor: '#1F180A',
        };
      case 'jasmineNight':
        return {
          bg: '#081C15',
          cardBg: '#0F2E23',
          borderColor: '#6EE7B7',
          icon: (
            <svg viewBox="0 0 50 50" className="w-8 h-8 fill-current text-emerald-200 animate-pulse drop-shadow-[0_0_8px_#6EE7B7]">
              <path d="M25 5 C23 15, 15 23, 5 25 C15 27, 23 35, 25 45 C27 35, 35 27, 45 25 C35 23, 27 15, 25 5 Z" />
            </svg>
          ),
          titleColor: '#6EE7B7',
          badgeText: isRtl ? 'ظرف ليلة الياسمين المتوهج' : 'Glow Jasmine Night Envelope',
          buttonBg: 'linear-gradient(to right, #059669, #6EE7B7)',
          buttonTextColor: '#081C15',
        };
      case 'wisteriaDream':
        return {
          bg: '#0F172A',
          cardBg: '#1E293B',
          borderColor: '#818CF8',
          icon: <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />,
          titleColor: '#818CF8',
          badgeText: isRtl ? 'ظرف الويستيريا الحالم الساحر' : 'Wisteria Dream Cascading Envelope',
          buttonBg: 'linear-gradient(to right, #6366F1, #818CF8)',
          buttonTextColor: '#FFFFFF',
        };
      case 'cherry':
        return {
          bg: '#FFF0F5',
          cardBg: '#FFFFFF',
          borderColor: '#F472B6',
          icon: <Flower2 className="w-8 h-8 text-pink-500 animate-pulse" />,
          titleColor: '#D946EF',
          badgeText: isRtl ? 'ظرف ورود ليلك رومانسي' : 'Romantic Blossom Envelope',
          buttonBg: 'linear-gradient(to right, #EC4899, #D946EF)',
          buttonTextColor: '#FFFFFF',
        };
      case 'crystal':
        return {
          bg: 'rgba(6, 16, 30, 0.95)',
          cardBg: 'rgba(10, 25, 47, 0.85)',
          borderColor: 'rgba(229, 193, 88, 0.6)',
          icon: <Gem className="w-8 h-8 text-amber-300 animate-bounce" />,
          titleColor: '#E5C158',
          badgeText: isRtl ? 'ظرف زجاجي كريستالي شفاف' : 'Crystal Glassmorphic Envelope',
          buttonBg: 'linear-gradient(to right, #E5C158, #F59E0B)',
          buttonTextColor: '#06101E',
        };
      case 'baroque':
      case 'royal':
        return {
          bg: '#0A080C',
          cardBg: '#141017',
          borderColor: '#D4AF37',
          icon: <Crown className="w-8 h-8 text-amber-400 animate-pulse" />,
          titleColor: '#D4AF37',
          badgeText: isRtl ? 'ظرف الزفاف الملكي الفاخر VIP' : 'Imperial Royal Wax Seal Envelope',
          buttonBg: 'linear-gradient(to right, #D4AF37, #F59E0B)',
          buttonTextColor: '#0A080C',
        };
      case 'citrus':
        return {
          bg: '#FFF8F0',
          cardBg: '#FFFFFF',
          borderColor: '#FF7043',
          icon: <Sun className="w-8 h-8 text-orange-500 animate-spin-slow" />,
          titleColor: '#FF7043',
          badgeText: isRtl ? 'ظرف الحفل المشرق المنعش' : 'Sunny Daytime Citrus Envelope',
          buttonBg: 'linear-gradient(to right, #FF7043, #F97316)',
          buttonTextColor: '#FFFFFF',
        };
      case 'confetti':
        return {
          bg: '#0D0B18',
          cardBg: '#18142A',
          borderColor: '#A855F7',
          icon: <PartyPopper className="w-8 h-8 text-purple-400 animate-bounce" />,
          titleColor: '#06B6D4',
          badgeText: isRtl ? 'ظرف الليالي الاحتفالية العصري' : 'Modern Party Burst Envelope',
          buttonBg: 'linear-gradient(to right, #A855F7, #06B6D4)',
          buttonTextColor: '#FFFFFF',
        };
      case 'emerald':
        return {
          bg: '#062C21',
          cardBg: '#0A3C2F',
          borderColor: '#E5C158',
          icon: (
            <svg className="w-8 h-8 text-amber-300 fill-current animate-pulse" viewBox="0 0 50 50">
              <path d="M25 25 C15 5, 2 10, 5 25 C8 32, 20 30, 25 25 Z" />
              <path d="M25 25 C35 5, 48 10, 45 25 C42 32, 30 30, 25 25 Z" />
            </svg>
          ),
          titleColor: '#E5C158',
          badgeText: isRtl ? 'ظرف الحديقة الزمردية الملكية' : 'Emerald Garden Gold Leaf Envelope',
          buttonBg: 'linear-gradient(to right, #E5C158, #D4AF37)',
          buttonTextColor: '#062C21',
        };
      case 'ocean':
        return {
          bg: '#E6F4F1',
          cardBg: '#FFFFFF',
          borderColor: '#00A896',
          icon: <Waves className="w-8 h-8 text-teal-600 animate-pulse" />,
          titleColor: '#00A896',
          badgeText: isRtl ? 'ظرف الزفاف الساحلي اللؤلؤي' : 'Ocean Pearl Coastal Envelope',
          buttonBg: 'linear-gradient(to right, #00A896, #028090)',
          buttonTextColor: '#FFFFFF',
        };
      case 'autumn':
        return {
          bg: '#2D0B12',
          cardBg: '#3D121B',
          borderColor: '#E67E22',
          icon: <Flame className="w-8 h-8 text-amber-500 animate-bounce" />,
          titleColor: '#E67E22',
          badgeText: isRtl ? 'ظرف الزفاف الخريفي الدافئ' : 'Autumn Rustic Maple Envelope',
          buttonBg: 'linear-gradient(to right, #E67E22, #D35400)',
          buttonTextColor: '#FFFFFF',
        };
      case 'starlit':
        return {
          bg: '#0B0C1B',
          cardBg: '#13152E',
          borderColor: '#60A5FA',
          icon: <Moon className="w-8 h-8 text-blue-400 animate-pulse" />,
          titleColor: '#60A5FA',
          badgeText: isRtl ? 'ظرف ليلة النجوم والكواكب' : 'Starlit Constellation Envelope',
          buttonBg: 'linear-gradient(to right, #60A5FA, #3B82F6)',
          buttonTextColor: '#FFFFFF',
        };
      case 'lace':
        return {
          bg: '#FFF9F5',
          cardBg: '#FFFFFF',
          borderColor: '#C88EA7',
          icon: (
            <svg className="w-8 h-8 text-rose-400 fill-current" viewBox="0 0 60 40">
              <path d="M 30 18 C 22 8, 8 10, 12 22 C 15 30, 26 22, 30 20 C 34 22, 45 30, 48 22 C 52 10, 38 8, 30 18 Z M 30 20 C 26 28, 15 38, 10 38 C 12 30, 24 24, 30 20 Z" />
            </svg>
          ),
          titleColor: '#C88EA7',
          badgeText: isRtl ? 'ظرف الدانتيل العتيق الفاخر' : 'Vintage Lace Ribbon Envelope',
          buttonBg: 'linear-gradient(to right, #C88EA7, #B56576)',
          buttonTextColor: '#FFFFFF',
        };
      case 'celestialEclipse':
        return {
          bg: '#0B0C16',
          cardBg: '#131526',
          borderColor: '#D4AF37',
          icon: (
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current text-amber-300 animate-pulse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="45" cy="50" r="28" fill="#0B0C16" />
              <path d="M50 20 L52 35 L65 37 L52 39 L50 54 L48 39 L35 37 L48 35 Z" fill="#D4AF37" />
            </svg>
          ),
          titleColor: '#F7F4EE',
          badgeText: isRtl ? 'ظرف ليلة الكسوف والنجوم الكونية' : 'Celestial Eclipse Solar Wax Seal',
          buttonBg: 'linear-gradient(to right, #0F172A, #D4AF37)',
          buttonTextColor: '#0B0C16',
        };
      case 'editorialNoir':
        return {
          bg: '#121212',
          cardBg: '#1A1A1A',
          borderColor: '#80091B',
          icon: (
            <div className="text-sm font-serif font-extrabold tracking-tighter text-[#80091B]">NOIR</div>
          ),
          titleColor: '#F7F4EE',
          badgeText: isRtl ? 'غلاف المجلة السوداء الفاخر' : 'Editorial Noir Silk Embossed Shield',
          buttonBg: 'linear-gradient(to right, #1A1A1A, #80091B)',
          buttonTextColor: '#FFFFFF',
        };
      case 'enchantedBotanical':
        return {
          bg: '#1F2922',
          cardBg: '#2E3D33',
          borderColor: '#A2AD91',
          icon: (
            <svg viewBox="0 0 30 30" className="w-8 h-8 fill-current text-[#A2AD91]">
              <path d="M5 25 C10 15, 15 10, 25 5 C20 12, 12 20, 5 25" />
            </svg>
          ),
          titleColor: '#E6EFE9',
          badgeText: isRtl ? 'ظرف بستان الياسمين والورق العضوي' : 'Enchanted Botanical Sage Leaf Wax Seal',
          buttonBg: 'linear-gradient(to right, #1F2922, #A2AD91)',
          buttonTextColor: '#1F2922',
        };
      case 'opalDream':
        return {
          bg: '#171520',
          cardBg: '#221E31',
          borderColor: '#DDD6FE',
          icon: (
            <div className="text-base animate-pulse">💎</div>
          ),
          titleColor: '#DDD6FE',
          badgeText: isRtl ? 'ظرف حلم الأوبال المتوهج' : 'Opalescent Dream Iridescent Pearl Seal',
          buttonBg: 'linear-gradient(to right, #DDD6FE, #FBCFE8)',
          buttonTextColor: '#171520',
        };
      case 'royalArabicEditorial':
        return {
          bg: '#1C1610',
          cardBg: '#2C2219',
          borderColor: '#D4AF37',
          icon: (
            <svg viewBox="0 0 30 30" className="w-8 h-8 fill-current text-[#D4AF37]">
              <path d="M5 5 L25 5 L25 15 A10 10 0 0 1 5 15 Z" />
            </svg>
          ),
          titleColor: '#F7F4EE',
          badgeText: isRtl ? 'ظرف الأقواس العربية الملكية VIP' : 'Contemporary Arabic Royal Editorial Seal',
          buttonBg: 'linear-gradient(to right, #1C1610, #D4AF37)',
          buttonTextColor: '#1C1610',
        };
      case 'minimalist':
        return {
          bg: '#F9F6F0',
          cardBg: '#FFFFFF',
          borderColor: '#A39B8B',
          icon: <Heart className="w-8 h-8 text-stone-600" />,
          titleColor: '#2D2B2A',
          badgeText: isRtl ? 'ظرف بساطة البيج العتيق' : 'Minimalist Cream Envelope',
          buttonBg: '#2D2B2A',
          buttonTextColor: '#FFFFFF',
        };
      default:
        return {
          bg: '#121212',
          cardBg: '#1F1E1B',
          borderColor: accent,
          icon: <Sparkles className="w-8 h-8 text-amber-400 animate-bounce" />,
          titleColor: accent,
          badgeText: isRtl ? 'ظرف الدعوة الرسمية VIP' : 'Official VIP Invitation Envelope',
          buttonBg: `linear-gradient(to right, ${accent}, #D6BD91)`,
          buttonTextColor: '#171717',
        };
    }
  };

  const config = getThemeEnvelopeConfig();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-xl text-center"
      style={{ backgroundColor: config.bg }}
    >
      <div
        className="relative max-w-md w-full p-8 rounded-3xl border shadow-[0_30px_90px_rgba(0,0,0,0.8)] space-y-6 overflow-hidden"
        style={{ backgroundColor: config.cardBg, borderColor: config.borderColor }}
      >
        {/* Custom Theme Seal Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto border shadow-md relative"
          style={{ backgroundColor: `${config.borderColor}20`, borderColor: config.borderColor }}
        >
          {config.icon}
        </div>

        {/* VIP Guest Badge if link is personalized */}
        {guestNameParam && (
          <div
            className="py-2 px-4 rounded-full border text-xs font-semibold inline-flex items-center gap-2 mx-auto shadow-inner animate-pulse"
            style={{ backgroundColor: `${config.borderColor}15`, borderColor: config.borderColor, color: config.titleColor }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isRtl
                ? `دعوة خاصة موجهة إلى: ${guestNameParam}`
                : `Exclusive VIP Invitation for: ${guestNameParam}`}
            </span>
          </div>
        )}

        <div>
          <span
            className="text-[10px] tracking-[0.3em] uppercase font-bold block mb-2 opacity-90"
            style={{ color: config.titleColor }}
          >
            {config.badgeText}
          </span>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold" style={{ color: config.titleColor }}>
            {details.eventTitle}
          </h1>
        </div>

        <p className="text-xs opacity-80 font-light max-w-xs mx-auto">
          {isRtl
            ? 'يسرنا دعوتكم لحضور حفلنا، انقر أدناه لفتح الظرف واستعراض الدعوة التفاعلية.'
            : 'Cordially requests your presence. Tap below to unseal your interactive invitation.'}
        </p>

        <button
          onClick={onOpen}
          className="w-full py-4 px-6 rounded-2xl font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer transform hover:scale-[1.02]"
          style={{
            background: config.buttonBg,
            color: config.buttonTextColor,
          }}
        >
          {isRtl ? 'فتح الظرف والدعوة الرسمية ✨' : 'Unseal Invitation Envelope ✨'}
        </button>
      </div>
    </motion.div>
  );
};
