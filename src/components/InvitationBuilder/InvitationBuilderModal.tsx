import React from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Smartphone,
  Monitor,
  Share2,
  Copy,
  Globe,
  Save,
  Lock,
  Crown,
  Clock,
  Star,
} from 'lucide-react';
import { ReviewModal } from '../ReviewModal';
import { Template, InvitationData, Language } from '../../types';
import { TEMPLATES } from '../../data/templates';
import { useTranslation } from '../../data/translations';
import { InvitationRenderer } from '../InvitationRenderer';
import { AudioTrimmerModal } from '../AudioTrimmerModal';

import { useInvitationForm } from './useInvitationForm';
import { GeneralInfoTab } from './tabs/GeneralInfoTab';
import { DesignThemeTab } from './tabs/DesignThemeTab';
import { MusicTab } from './tabs/MusicTab';
import { TimelineTab } from './tabs/TimelineTab';
import { GalleryTab } from './tabs/GalleryTab';

interface InvitationBuilderModalProps {
  initialTemplate?: Template | null;
  existingInvitation?: InvitationData | null;
  currentLang: Language;
  onClose: () => void;
  onSaved: (invitation: InvitationData) => void;
  onOpenPricing?: (invitation: InvitationData) => void;
}

export const InvitationBuilderModal: React.FC<InvitationBuilderModalProps> = ({
  initialTemplate,
  existingInvitation,
  currentLang,
  onClose,
  onSaved,
  onOpenPricing,
}) => {
  const t = useTranslation(currentLang);

  const form = useInvitationForm({
    initialTemplate,
    existingInvitation,
    currentLang,
    onSaved,
  });

  const {
    isRtl,
    currentStep,
    setCurrentStep,
    selectedTemplate,
    invitationLanguage,
    setInvitationLanguage,
    invitationTitle,
    setInvitationTitle,
    eventDetails,
    themeColors,
    setThemeColors,
    customFont,
    setCustomFont,
    previewDeviceMode,
    setPreviewDeviceMode,
    publishedLink,
    copiedLink,
    newGalleryUrl,
    setNewGalleryUrl,
    newAccountType,
    setNewAccountType,
    newAccountTitle,
    setNewAccountTitle,
    newAccountNumber,
    setNewAccountNumber,
    newAccountHolder,
    setNewAccountHolder,
    newAccountNotes,
    setNewAccountNotes,
    savedInvitationData,
    showReviewModal,
    setShowReviewModal,
    groomInputRef,
    brideInputRef,
    coverInputRef,
    galleryInputRef,
    musicFileInputRef,
    musicTracks,
    isPlayingPreview,
    pendingTrimFile,
    setPendingTrimFile,
    showTrimmerModal,
    setShowTrimmerModal,
    handleDetailChange,
    handleTemplateSelect,
    handleAddPaymentAccount,
    handleRemovePaymentAccount,
    handleAudioFileUpload,
    handleTrackReadyFromTrimmer,
    toggleAudioPreview,
    handleSingleFileUpload,
    handleMultipleGalleryUpload,
    handleAddGalleryImage,
    handleRemoveGalleryImage,
    handleAddScheduleItem,
    handleRemoveScheduleItem,
    handleSaveForPayment,
    handleCopyShareLink,
    handleWhatsAppShare,
  } = form;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#171717] border border-[#B99A65]/40 rounded-3xl overflow-hidden shadow-2xl my-4 max-h-[95vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-[#1F1E1B] border-b border-[#333] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#B99A65]/20 border border-[#B99A65] flex items-center justify-center text-[#B99A65]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-playfair text-lg font-bold text-[#F7F4EE]">
                {t.customizer.title}
              </h2>
              <span className="text-[10px] text-[#8D8A84] block">
                {selectedTemplate.title[currentLang]}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#171717] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Stepper Navigation */}
        <div className="bg-[#121212] border-b border-[#333] px-4 py-3 flex items-center justify-between overflow-x-auto scrollbar-none text-xs text-[#8D8A84]">
          {[
            { step: 1, label: t.customizer.step1 },
            { step: 2, label: t.customizer.step2 },
            { step: 3, label: t.customizer.step3 },
            { step: 4, label: t.customizer.step4 },
            { step: 5, label: t.customizer.step5 },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-2 cursor-pointer transition-colors ${
                currentStep === s.step
                  ? 'bg-[#B99A65] text-[#171717] font-bold'
                  : currentStep > s.step
                  ? 'text-[#B99A65]'
                  : 'hover:text-[#F7F4EE]'
              }`}
            >
              <span>{s.label}</span>
              {currentStep > s.step && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>

        {/* Main Step Content Body */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6">
          {/* STEP 1: Template Gallery & Style Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
                  {t.customizer.step1}
                </h3>
                <p className="text-xs text-[#8D8A84]">
                  {isRtl
                    ? 'اختر التصميم الفريد الذي يناسب طابع زفافك الملكي'
                    : 'Choose a unique design matching your royal wedding theme'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES.map((template) => {
                  const isSelected = selectedTemplate.id === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`group relative bg-[#1F1E1B] rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#B99A65] shadow-[0_0_25px_rgba(185,154,101,0.25)] ring-2 ring-[#B99A65]'
                          : 'border-[#333] hover:border-[#B99A65]/50'
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img
                          src={template.coverImage}
                          alt={template.title[currentLang]}
                          onError={(e) => console.warn('Template picker image failed to load:', { src: template.coverImage, currentLang })}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isSelected && (
                          <div className="absolute top-3 right-3 bg-[#B99A65] text-[#171717] px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-lg">
                            <Check className="w-3.5 h-3.5" />
                            <span>{isRtl ? 'المحدد حالياً' : 'Selected'}</span>
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2 bg-[#1F1E1B]">
                        <h4 className="font-playfair font-bold text-[#F7F4EE] text-base">
                          {template.title[currentLang]}
                        </h4>
                        <p className="text-xs text-[#8D8A84] line-clamp-2">
                          {template.description[currentLang]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: General Info & Bride/Groom Details */}
          {currentStep === 2 && (
            <GeneralInfoTab
              currentLang={currentLang}
              invitationLanguage={invitationLanguage}
              setInvitationLanguage={setInvitationLanguage}
              invitationTitle={invitationTitle}
              setInvitationTitle={setInvitationTitle}
              eventDetails={eventDetails}
              onChangeDetail={handleDetailChange}
            />
          )}

          {/* STEP 3: Theme Colors, Custom Fonts & Timeline */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <DesignThemeTab
                currentLang={currentLang}
                themeColors={themeColors}
                setThemeColors={setThemeColors}
                customFont={customFont}
                setCustomFont={setCustomFont}
                coverImageUrl={eventDetails.coverImageUrl}
                onCoverImageUrlChange={(url) => handleDetailChange('coverImageUrl', url)}
              />

              <TimelineTab
                currentLang={currentLang}
                timeline={eventDetails.scheduleTimeline || []}
                onChangeTimeline={(items) => handleDetailChange('scheduleTimeline', items)}
              />
            </div>
          )}

          {/* STEP 4: Audio Track, Gallery Photos & Payment Options */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <MusicTab
                currentLang={currentLang}
                selectedTrackUrl={eventDetails.musicTrackUrl}
                selectedTrackName={eventDetails.musicTrackName}
                musicTracks={musicTracks}
                isPlayingPreview={isPlayingPreview}
                onSelectTrack={(track) => {
                  handleDetailChange('musicTrackUrl', track.url);
                  const trackLabel = track.label || (typeof track.name === 'object' ? (currentLang === 'ar' ? track.name.ar : track.name.en) : track.name) || '';
                  handleDetailChange('musicTrackName', trackLabel);
                }}
                onTogglePreview={toggleAudioPreview}
                onUploadCustomFile={(file) => {
                  const e = { target: { files: [file] } } as any;
                  handleAudioFileUpload(e);
                }}
              />

              <GalleryTab
                currentLang={currentLang}
                galleryImages={eventDetails.galleryImages || []}
                onChangeGallery={(imgs) => handleDetailChange('galleryImages', imgs)}
              />
            </div>
          )}

          {/* STEP 5: Live Preview & Publish Status */}
          {currentStep === 5 && (
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-1.5 rounded-full bg-[#1F1E1B] border border-[#333] w-fit mx-auto text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('mobile')}
                  className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                    previewDeviceMode === 'mobile'
                      ? 'bg-[#B99A65] text-[#171717]'
                      : 'text-[#8D8A84] hover:text-[#F7F4EE]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'عرض الجوال' : 'Mobile View'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewDeviceMode('desktop')}
                  className={`px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                    previewDeviceMode === 'desktop'
                      ? 'bg-[#B99A65] text-[#171717]'
                      : 'text-[#8D8A84] hover:text-[#F7F4EE]'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'عرض الشاشة الكبيرة' : 'Desktop View'}</span>
                </button>
              </div>

              {/* Invitation Realtime Render Canvas */}
              <div
                className={`mx-auto rounded-3xl overflow-hidden border border-[#B99A65]/40 shadow-2xl transition-all duration-300 ${
                  previewDeviceMode === 'mobile' ? 'max-w-sm h-[650px]' : 'w-full h-[700px]'
                }`}
              >
                <InvitationRenderer
                  invitation={{
                    id: existingInvitation?.id || 'inv-preview-custom',
                    templateId: selectedTemplate.id,
                    layoutType: selectedTemplate.layoutType,
                    title: invitationTitle || eventDetails.eventTitle,
                    language: invitationLanguage,
                    themeStyle: selectedTemplate.themeStyle,
                    customColors: themeColors,
                    customFont: customFont,
                    eventDetails: eventDetails,
                    status: existingInvitation?.status || 'draft',
                    createdAt: new Date().toISOString(),
                    slug: existingInvitation?.slug || 'preview-slug',
                    rsvpCount: 0,
                  }}
                  currentLang={invitationLanguage}
                  onOpenPricing={() => {
                    if (onOpenPricing) {
                      const data = savedInvitationData || handleSaveForPayment('draft');
                      onClose();
                      onOpenPricing(data);
                    }
                  }}
                />
              </div>

              {/* Published vs Pending Share Actions */}
              {savedInvitationData?.status === 'published' ? (
                <>
                  <div className="p-4 rounded-2xl bg-[#1F1E1B] border border-[#B99A65]/30 space-y-3">
                    <p className="text-xs text-[#8D8A84]">
                      {isRtl ? 'رابط دعوتك الرقمية المباشر المعتمد:' : 'Live Invitation Shareable Link:'}
                    </p>
                    <div className="flex items-center gap-2 max-w-lg mx-auto">
                      <input
                        type="text"
                        readOnly
                        value={publishedLink}
                        className="w-full bg-[#171717] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] font-mono text-center"
                      />
                      <button
                        onClick={handleCopyShareLink}
                        className="px-4 py-2.5 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs shrink-0 flex items-center gap-1.5"
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copiedLink ? (isRtl ? 'تم النسخ!' : 'Copied!') : isRtl ? 'نسخ' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleWhatsAppShare}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#25D366] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{t.shareModal.whatsappShare}</span>
                    </button>

                    <a
                      href={publishedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#B99A65] text-[#F7F4EE] font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#B99A65]/20 cursor-pointer"
                    >
                      <Globe className="w-4 h-4 text-[#B99A65]" />
                      <span>{t.preview.liveInvitation}</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
                      {isRtl ? 'تم حفظ طلبك! بانتظار الدفع والاعتماد ⏳' : 'Order Saved! Pending Payment & Approval ⏳'}
                    </h3>
                    <p className="text-xs text-[#8D8A84] leading-relaxed">
                      {isRtl
                        ? 'الدعوة غير مفعلة للمدعوين حالياً حتى يتم تأكيد تحويل فودافون كاش وموافقة الإدارة. لا يمكن مشاركة الرابط أو فتحه حتى يتم تفعيلها.'
                        : 'This invitation is locked for guests until Vodafone Cash payment is verified and approved by management.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1F1E1B] border border-amber-500/30 text-xs text-amber-300 space-y-1">
                    <div className="font-bold flex items-center justify-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{isRtl ? 'حالة الدعوة: قيد المراجعة وتأكيد الدفع' : 'Status: Pending Payment Confirmation'}</span>
                    </div>
                    <p className="text-[#8D8A84] text-[11px]">
                      {isRtl
                        ? '🔒 زر المشاركة معطل حتى يوافق الأدمن بعد استلام التحويل.'
                        : 'Sharing is disabled until admin approves the order.'}
                    </p>
                  </div>

                  {onOpenPricing && (
                    <button
                      onClick={() => {
                        if (savedInvitationData) {
                          onClose();
                          onOpenPricing(savedInvitationData);
                        }
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E60000] via-[#ff3333] to-[#E60000] text-white font-extrabold text-sm uppercase tracking-wider hover:shadow-[0_0_25px_rgba(230,0,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl animate-pulse"
                    >
                      <Crown className="w-5 h-5 text-amber-300" />
                      <span>{isRtl ? 'الدفع وتأكيد التحويل عبر فودافون كاش الآن 💳' : 'Pay via Vodafone Cash Now'}</span>
                    </button>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(true)}
                      className="w-full py-3 px-4 rounded-xl bg-[#2A2722] border border-[#B99A65]/40 hover:border-[#B99A65] text-[#B99A65] hover:text-[#F7F4EE] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                    >
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span>{isRtl ? 'تقييم تجربة التصميم والمنصة 🌟' : 'Rate Design & Platform Experience'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation & Save Action Bar */}
        <div className="bg-[#1F1E1B] border-t border-[#333] p-4 px-6 flex items-center justify-between">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl border border-[#333] text-xs font-medium text-[#E9E1D5] hover:text-[#F7F4EE] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.customizer.prevStep}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:bg-[#d6bd91] flex items-center gap-2 cursor-pointer"
              >
                <span>{t.customizer.nextStep}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {currentStep === 4 && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => {
                    handleSaveForPayment('draft');
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#333] text-[#8D8A84] hover:text-[#F7F4EE] hover:border-[#8D8A84] font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isRtl ? 'حفظ كمسودة 💾' : 'Save Draft'}</span>
                </button>

                {existingInvitation?.status === 'published' ? (
                  <button
                    onClick={() => {
                      handleSaveForPayment('published');
                      setCurrentStep(5);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(185,154,101,0.5)] flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isRtl ? 'حفظ التعديلات' : 'Save Changes'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const saved = handleSaveForPayment('pending_approval');
                      if (onOpenPricing) {
                        onClose();
                        onOpenPricing(saved);
                      } else {
                        setCurrentStep(5);
                      }
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E60000] via-[#ff3333] to-[#E60000] text-white font-extrabold text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(230,0,0,0.5)] flex items-center gap-2 cursor-pointer shadow-lg animate-pulse"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>{isRtl ? 'متابعة للدفع عبر فودافون كاش لتفعيل الدعوة 💳' : 'Proceed to Vodafone Cash Payment'}</span>
                  </button>
                )}
              </div>
            )}

            {currentStep === 5 && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs uppercase cursor-pointer"
              >
                {isRtl ? 'تم والعودة للوحة التحكم' : 'Done & Return to Dashboard'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          currentLang={currentLang}
          invitationTitle={invitationTitle || eventDetails.eventTitle}
          designTitle={selectedTemplate.title[currentLang]}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showTrimmerModal && pendingTrimFile && (
        <AudioTrimmerModal
          audioFile={pendingTrimFile}
          currentLang={currentLang}
          onClose={() => {
            setShowTrimmerModal(false);
            setPendingTrimFile(null);
          }}
          onTrackReady={(track) => { handleTrackReadyFromTrimmer(track); }}
        />
      )}
    </div>
  );
};
