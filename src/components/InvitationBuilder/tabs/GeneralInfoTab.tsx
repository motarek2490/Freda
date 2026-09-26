import React, { useRef, useState } from 'react';
import { Calendar, MapPin, User, Heart, Sparkles, Globe, Clock, Camera, Upload, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { EventDetails, Language } from '../../../types';
import { processAndUploadImage } from '../../../lib/imageUploader';

interface GeneralInfoTabProps {
  currentLang: Language;
  invitationLanguage: Language;
  setInvitationLanguage: (lang: Language) => void;
  invitationTitle: string;
  setInvitationTitle: (title: string) => void;
  eventDetails: EventDetails;
  onChangeDetail: (key: keyof EventDetails, value: any) => void;
}

export const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({
  currentLang,
  invitationLanguage,
  setInvitationLanguage,
  invitationTitle,
  setInvitationTitle,
  eventDetails,
  onChangeDetail,
}) => {
  const isRtl = currentLang === 'ar';
  const groomInputRef = useRef<HTMLInputElement>(null);
  const brideInputRef = useRef<HTMLInputElement>(null);
  const [uploadingGroom, setUploadingGroom] = useState(false);
  const [uploadingBride, setUploadingBride] = useState(false);

  const handleGroomPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGroom(true);
    try {
      const res = await processAndUploadImage(file, 'groom_photo');
      onChangeDetail('groomAvatarUrl', res.url);
    } catch (err) {
      console.warn('Groom photo upload error:', err);
    } finally {
      setUploadingGroom(false);
    }
  };

  const handleBridePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBride(true);
    try {
      const res = await processAndUploadImage(file, 'bride_photo');
      onChangeDetail('brideAvatarUrl', res.url);
    } catch (err) {
      console.warn('Bride photo upload error:', err);
    } finally {
      setUploadingBride(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Language */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'عنوان الدعوة الملكية:' : 'Invitation Title:'}</span>
          </label>
          <input
            type="text"
            value={invitationTitle}
            onChange={(e) => setInvitationTitle(e.target.value)}
            placeholder={isRtl ? 'مثال: حفل زفاف كريم ومريم الملكي' : 'e.g. Royal Wedding of Karim & Maryam'}
            className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'لغة عرض الدعوة:' : 'Language:'}</span>
          </label>
          <select
            value={invitationLanguage}
            onChange={(e) => setInvitationLanguage(e.target.value as Language)}
            className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
          >
            <option value="ar">العربية (Arabic)</option>
            <option value="en">English (الإنجليزية)</option>
          </select>
        </div>
      </div>

      {/* Groom & Bride Details with Mobile Photo Upload */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Groom Section */}
        <div className="p-4 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-3">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'العريس / المضيف:' : 'Groom / Host:'}</span>
          </label>
          <input
            type="text"
            value={eventDetails.groomName || ''}
            onChange={(e) => onChangeDetail('groomName', e.target.value)}
            placeholder={isRtl ? 'اسم العريس' : 'Groom Name'}
            className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
          />

          {/* Groom Photo Picker from Phone */}
          <div className="flex items-center gap-3 pt-1">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#B99A65]/50 bg-black/40 shrink-0">
              {eventDetails.groomAvatarUrl ? (
                <img
                  src={eventDetails.groomAvatarUrl}
                  alt="Groom"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#666]">
                  <User className="w-6 h-6" />
                </div>
              )}
              {uploadingGroom && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-[#B99A65] animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="file"
                ref={groomInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleGroomPhoto}
              />
              <button
                type="button"
                onClick={() => groomInputRef.current?.click()}
                disabled={uploadingGroom}
                className="px-3 py-1.5 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#444] text-[#F7F4EE] text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[#B99A65]" />
                <span>{isRtl ? '📸 صورة العريس من الهاتف' : '📸 Groom Photo'}</span>
              </button>

              {eventDetails.groomAvatarUrl && (
                <button
                  type="button"
                  onClick={() => onChangeDetail('groomAvatarUrl', '')}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 transition-colors"
                  title={isRtl ? 'حذف الصورة' : 'Remove'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bride Section */}
        <div className="p-4 bg-[#171717] rounded-2xl border border-[#2E2C28] space-y-3">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'العروس / الشريكة:' : 'Bride / Partner:'}</span>
          </label>
          <input
            type="text"
            value={eventDetails.brideName || ''}
            onChange={(e) => onChangeDetail('brideName', e.target.value)}
            placeholder={isRtl ? 'اسم العروس' : 'Bride Name'}
            className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
          />

          {/* Bride Photo Picker from Phone */}
          <div className="flex items-center gap-3 pt-1">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#B99A65]/50 bg-black/40 shrink-0">
              {eventDetails.brideAvatarUrl ? (
                <img
                  src={eventDetails.brideAvatarUrl}
                  alt="Bride"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#666]">
                  <Heart className="w-6 h-6" />
                </div>
              )}
              {uploadingBride && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-[#B99A65] animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="file"
                ref={brideInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleBridePhoto}
              />
              <button
                type="button"
                onClick={() => brideInputRef.current?.click()}
                disabled={uploadingBride}
                className="px-3 py-1.5 rounded-xl bg-[#2A2722] hover:bg-[#333] border border-[#444] text-[#F7F4EE] text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Camera className="w-3.5 h-3.5 text-[#B99A65]" />
                <span>{isRtl ? '📸 صورة العروس من الهاتف' : '📸 Bride Photo'}</span>
              </button>

              {eventDetails.brideAvatarUrl && (
                <button
                  type="button"
                  onClick={() => onChangeDetail('brideAvatarUrl', '')}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/40 transition-colors"
                  title={isRtl ? 'حذف الصورة' : 'Remove'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'تاريخ المناسبة:' : 'Event Date:'}</span>
          </label>
          <input
            type="date"
            value={eventDetails.eventDate || ''}
            onChange={(e) => onChangeDetail('eventDate', e.target.value)}
            className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'وقت البدء:' : 'Event Time:'}</span>
          </label>
          <input
            type="time"
            value={eventDetails.eventTime || ''}
            onChange={(e) => onChangeDetail('eventTime', e.target.value)}
            className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
          />
        </div>
      </div>

      {/* Location Details */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#F7F4EE] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#B99A65]" />
            <span>{isRtl ? 'اسم القاعة أو المكان:' : 'Venue Name:'}</span>
          </label>
          <input
            type="text"
            value={eventDetails.venueName || ''}
            onChange={(e) => onChangeDetail('venueName', e.target.value)}
            placeholder={isRtl ? 'مثال: فندق الفورسيزونز - القاعة الملكية' : 'e.g. Four Seasons Royal Ballroom'}
            className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'العنوان التفصيلي:' : 'Venue Address:'}
            </label>
            <input
              type="text"
              value={eventDetails.venueAddress || ''}
              onChange={(e) => onChangeDetail('venueAddress', e.target.value)}
              placeholder={isRtl ? 'كورنيش النيل، القاهرة' : 'Nile Corniche, Cairo'}
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F7F4EE]">
              {isRtl ? 'رابط خرائط جوجل (Google Maps Link):' : 'Google Maps URL:'}
            </label>
            <input
              type="url"
              value={eventDetails.venueMapUrl || ''}
              onChange={(e) => onChangeDetail('venueMapUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
          </div>
        </div>
      </div>

      {/* Main Message / Story */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#F7F4EE]">
          {isRtl ? 'نص رسالة الترحيب والدعوة الرئيسية:' : 'Main Invitation Message:'}
        </label>
        <textarea
          rows={3}
          value={eventDetails.mainMessage || ''}
          onChange={(e) => onChangeDetail('mainMessage', e.target.value)}
          placeholder={isRtl ? 'يسرنا ويسعدنا دعوتكم لمشاركتنا فرحتنا...' : 'We cordially invite you to celebrate with us...'}
          className="w-full bg-[#171717] border border-[#333] rounded-xl px-3.5 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
        />
      </div>
    </div>
  );
};
