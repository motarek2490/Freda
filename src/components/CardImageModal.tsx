import React, { useEffect, useState, useRef } from 'react';
import { X, Copy, Check, Sparkles, Printer, Download, FileText, Loader2, Lock, Crown } from 'lucide-react';
import { InvitationData, Language } from '../types';
import { generateQrCodeDataUrl } from '../lib/qrHelper';
import { CardImageEngine } from '../features/invitations/engine/CardImageEngine';

interface CardImageModalProps {
  invitation: InvitationData;
  currentLang?: Language;
  onClose: () => void;
  onOpenPricing?: (invitation: InvitationData) => void;
}

export const CardImageModal: React.FC<CardImageModalProps> = ({
  invitation,
  currentLang = 'ar',
  onClose,
  onOpenPricing,
}) => {
  const isRtl = currentLang === 'ar';
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportAction, setExportAction] = useState<'image' | 'pdf' | 'print' | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const isOfficialDemo =
    invitation.id.startsWith('preview-tmpl-') ||
    invitation.id.startsWith('demo-') ||
    invitation.id === 'vip_1' ||
    Boolean(invitation.slug?.startsWith('preview-tmpl-')) ||
    invitation.hostAccessCode === 'HOST-DEMO';

  const isDraftPreview = invitation.status !== 'published' && !isOfficialDemo;

  const colors = invitation.customColors || {
    bg: '#171717',
    cardBg: '#1F1E1B',
    text: '#F7F4EE',
    accent: '#B99A65',
  };

  const accent = colors.accent || '#B99A65';
  const shareUrl = `${window.location.origin}/i/${encodeURIComponent(invitation.slug || invitation.id)}`;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    generateQrCodeDataUrl(shareUrl).then(setQrDataUrl);
  }, [shareUrl]);

  // Generate high-DPI canvas from the card component
  const captureCardCanvas = async () => {
    if (!cardContainerRef.current) return null;
    const html2canvas = (await import('html2canvas')).default;
    return await html2canvas(cardContainerRef.current, {
      scale: 3, // 3x ultra-sharp export
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
  };

  const getCleanFileName = (extension: string) => {
    const groom = invitation.eventDetails.groomName || (isRtl ? 'دعوة' : 'wedding');
    const bride = invitation.eventDetails.brideName || (isRtl ? 'زفاف' : 'card');
    const prefix = isDraftPreview ? 'draft_preview_' : '';
    return `${prefix}${groom}_${bride}_card.${extension}`.replace(/[^\w\u0600-\u06FF.-]+/g, '_');
  };

  const handleDownloadImage = async () => {
    setIsExporting(true);
    setExportAction('image');
    try {
      const canvas = await captureCardCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = getCleanFileName('png');
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn('Failed to export card image:', err);
    } finally {
      setIsExporting(false);
      setExportAction(null);
    }
  };

  const handleSavePdf = async () => {
    setIsExporting(true);
    setExportAction('pdf');
    try {
      const canvas = await captureCardCanvas();
      if (!canvas) return;
      const imgData = canvas.toDataURL('image/png');

      const { jsPDF } = await import('jspdf');
      // Calculate dimensions for A5 / portrait matching the aspect ratio
      const imgWidth = 148; // mm (A5 width)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(getCleanFileName('pdf'));
    } catch (err) {
      console.warn('Failed to generate PDF:', err);
      // Fallback to direct print
      handlePrintCard();
    } finally {
      setIsExporting(false);
      setExportAction(null);
    }
  };

  const handlePrintCard = async () => {
    setIsExporting(true);
    setExportAction('print');
    try {
      const canvas = await captureCardCanvas();
      if (!canvas) {
        window.print();
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');

      // Create isolated print frame so ONLY the card prints cleanly without app UI
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const frameDoc = printIframe.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${invitation.eventDetails.eventTitle || 'Invitation'}</title>
              <style>
                @page { size: auto; margin: 8mm; }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  background: #fff;
                }
                img {
                  max-width: 100%;
                  max-height: 96vh;
                  object-fit: contain;
                  display: block;
                  border-radius: 12px;
                }
              </style>
            </head>
            <body>
              <img src="${dataUrl}" alt="Invitation Card" />
            </body>
          </html>
        `);
        frameDoc.close();

        setTimeout(() => {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(printIframe);
          }, 1500);
        }, 500);
      } else {
        window.print();
      }
    } catch (err) {
      console.warn('Print error fallback:', err);
      window.print();
    } finally {
      setIsExporting(false);
      setExportAction(null);
    }
  };

  const handleCopyText = () => {
    const textToCopy = `${invitation.eventDetails.hostNames}\n${invitation.eventDetails.eventTitle}\n📅 ${invitation.eventDetails.eventDate} | 📍 ${invitation.eventDetails.venueName}\n💌 ${shareUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-[#171717] border border-[#B99A65] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 my-4 max-h-[94vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer z-30"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B99A65]/20 border border-[#B99A65] text-[#B99A65] text-[11px] font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'بطاقة الدعوة الثابتة للواتساب والطباعة' : 'Static Invitation Card Graphic'}</span>
          </div>
          <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
            {isRtl ? 'كرت الدعوة المصور' : 'Printable Invitation Card'}
          </h3>
          <p className="text-xs text-[#8D8A84]">
            {isRtl
              ? 'صورة عالية الفخامة مطابقة لهوية دعوتك جاهزة للنشر في ستوري واتساب أو الطباعة'
              : 'Stationery card matching your theme, ready for WhatsApp status & printing.'}
          </p>
        </div>

        {/* Unactivated Draft Warning & Activation CTA */}
        {isDraftPreview && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-center sm:text-start">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                {isRtl
                  ? 'كرت الدعوة في وضع المعاينة (مسودة) ويحمل علامة مائية. لتفعيل الكرت بجودة الطباعة الفائقة وإزالة العلامة يرجى تفعيل الدعوة.'
                  : 'Card is in Draft Preview with security watermark. Activate to get clean print file.'}
              </span>
            </div>
            {onOpenPricing && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing(invitation);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E60000] to-[#ff3333] text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>{isRtl ? 'تفعيل الكرت الآن 💳' : 'Activate Card 💳'}</span>
              </button>
            )}
          </div>
        )}

        {/* Template-Specific Photo Card Image Component wrapped with print target ref */}
        <div ref={cardContainerRef} className="printable-card-target w-full">
          <CardImageEngine
            invitation={invitation}
            currentLang={currentLang}
            qrDataUrl={qrDataUrl}
            shareUrl={shareUrl}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* Download Image Button (Direct PNG for WhatsApp & Mobile) */}
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="py-2.5 px-2.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#E6D7B8] to-[#B99A65] text-[#11100F] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {isExporting && exportAction === 'image' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isRtl ? (isDraftPreview ? 'تحميل المعاينة' : 'تحميل PNG') : 'Save PNG'}</span>
          </button>

          {/* Save PDF Button */}
          <button
            type="button"
            onClick={handleSavePdf}
            disabled={isExporting}
            className="py-2.5 px-2.5 rounded-xl bg-[#1F1E1B] border border-[#B99A65] text-[#F7F4EE] hover:text-[#B99A65] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer hover:bg-[#2A2925] active:scale-95 disabled:opacity-50"
          >
            {isExporting && exportAction === 'pdf' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B99A65]" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-[#B99A65]" />
            )}
            <span>{isRtl ? (isDraftPreview ? 'معاينة PDF' : 'حفظ PDF') : 'Save PDF'}</span>
          </button>

          {/* Print Card Button */}
          <button
            type="button"
            onClick={handlePrintCard}
            disabled={isExporting}
            className="py-2.5 px-2.5 rounded-xl bg-[#1F1E1B] border border-[#B99A65]/60 hover:border-[#B99A65] text-[#E9E1D5] hover:text-[#B99A65] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isExporting && exportAction === 'print' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B99A65]" />
            ) : (
              <Printer className="w-3.5 h-3.5 text-[#B99A65]" />
            )}
            <span>{isRtl ? 'طباعة' : 'Print'}</span>
          </button>

          {/* Copy Text Button */}
          <button
            type="button"
            onClick={handleCopyText}
            className="py-2.5 px-2.5 rounded-xl bg-[#1F1E1B] border border-[#333] hover:border-[#B99A65] text-[#F7F4EE] hover:text-[#B99A65] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ النص' : 'Copy')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

