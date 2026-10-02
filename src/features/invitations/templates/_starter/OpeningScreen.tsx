import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { TemplateOpeningScreenProps } from '../../model/templateContract';

/**
 * Starter / Scaffold Opening Screen component for new templates.
 */
export const StarterOpeningScreen: React.FC<TemplateOpeningScreenProps> = ({
  invitation,
  guestNameParam,
  isRtl,
  onComplete,
  shouldReduceMotion,
}) => {
  const accent = invitation.customColors?.accent || '#B99A65';
  const groom = invitation.eventDetails.groomName || (isRtl ? 'العريس' : 'Groom');
  const bride = invitation.eventDetails.brideName || (isRtl ? 'العروس' : 'Bride');

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full p-8 rounded-3xl bg-[#171717]/90 border border-[#B99A65]/40 shadow-2xl backdrop-blur-md space-y-6"
      >
        {/* Guest Badge */}
        {guestNameParam && (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#B99A65]/15 border border-[#B99A65]/40 text-[#B99A65] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? `مرحباً بك: ${guestNameParam}` : `Welcome: ${guestNameParam}`}</span>
          </div>
        )}

        {/* Title / Names */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-[#B99A65] font-bold">
            {invitation.eventDetails.eventTitle || (isRtl ? 'دعوة زفاف خاصة' : 'Wedding Invitation')}
          </p>
          <h1 className="font-playfair text-3xl font-bold text-[#F7F4EE]">
            {groom} <span style={{ color: accent }}>&</span> {bride}
          </h1>
        </div>

        {/* Interactive Open Action */}
        <button
          type="button"
          onClick={onComplete}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#B99A65] via-[#E6D7B8] to-[#B99A65] text-[#11100F] font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          <Heart className="w-4 h-4 fill-current" />
          <span>{isRtl ? 'فتح بطاقة الدعوة' : 'Open Invitation'}</span>
        </button>
      </motion.div>
    </div>
  );
};

export default StarterOpeningScreen;
