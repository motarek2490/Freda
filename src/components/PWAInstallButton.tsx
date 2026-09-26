import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Smartphone, Download, X, Sparkles, Share, PlusSquare } from 'lucide-react';

interface PWAInstallButtonProps {
  currentLang?: 'ar' | 'en';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ currentLang = 'ar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  const isRtl = currentLang === 'ar';

  // If already installed, don't show anything
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
    } else {
      await install();
    }
  };

  return (
    <>
      {/* Premium Desktop & Mobile Action Button */}
      <button
        onClick={handleInstallClick}
        className="relative group overflow-hidden px-3 py-1.5 rounded-full bg-[#1A1815] border border-[#B99A65]/40 text-[#B99A65] hover:text-[#171717] hover:border-[#B99A65] hover:bg-[#B99A65] shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(185,154,101,0.25)] transition-all duration-300 flex items-center gap-1.5 font-bold text-[11px] cursor-pointer"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        <Smartphone className="w-3.5 h-3.5 animate-pulse group-hover:scale-110 transition-transform duration-300" />
        <span className="tracking-wide">
          {isRtl ? 'تطبيق فريدا 📱' : 'FRIDA App 📱'}
        </span>
      </button>

      {/* Luxury iOS Guided Setup Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={() => setShowIOSGuide(false)} 
          />
          
          {/* Content Card */}
          <div className="relative bg-[#1A1815] border border-[#B99A65]/40 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-5 animate-scaleIn">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 left-4 text-[#8D8A84] hover:text-[#F7F4EE] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Header */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B99A65]/20 to-black border border-[#B99A65]/40 flex items-center justify-center text-[#B99A65]">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-playfair text-lg font-bold text-[#F7F4EE]">
                {isRtl ? 'تثبيت فريدا على جهاز الـ iOS 🍏' : 'Install FRIDA on iOS 🍏'}
              </h3>
              <p className="text-xs text-[#8D8A84] leading-relaxed">
                {isRtl 
                  ? 'اتبع هذه الخطوات البسيطة لتثبيت التطبيق على هاتف الآيفون الخاص بك والوصول إليه بسرعة فائقة:' 
                  : 'Follow these quick steps to add FRIDA to your iPhone Home Screen for instant access:'}
              </p>
            </div>

            {/* Visual Guide Steps */}
            <div className="space-y-3.5 text-right text-xs bg-[#12110F] p-4 rounded-2xl border border-[#2B2925] font-medium text-[#F7F4EE]">
              <div className="flex items-start gap-3 justify-end">
                <span className="order-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#B99A65]/10 border border-[#B99A65]/30 flex items-center justify-center text-[#B99A65] font-bold text-[10px]">١</span>
                <p className="order-1 text-[#F7F4EE] leading-relaxed">
                  {isRtl ? (
                    <>
                      اضغط على زر المشاركة <span className="inline-block bg-[#24221E] px-1.5 py-0.5 rounded border border-[#444] mx-1"><Share className="w-3.5 h-3.5 inline text-[#3b82f6]" /></span> في متصفح Safari بالأسفل.
                    </>
                  ) : (
                    <>
                      Tap the share button <span className="inline-block bg-[#24221E] px-1.5 py-0.5 rounded border border-[#444] mx-1"><Share className="w-3.5 h-3.5 inline text-[#3b82f6]" /></span> at the bottom of Safari browser.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <span className="order-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#B99A65]/10 border border-[#B99A65]/30 flex items-center justify-center text-[#B99A65] font-bold text-[10px]">٢</span>
                <p className="order-1 text-[#F7F4EE] leading-relaxed">
                  {isRtl ? (
                    <>
                      مرر للأسفل واختر <strong className="text-[#B99A65]">"إضافة إلى الشاشة الرئيسية"</strong> <span className="inline-block bg-[#24221E] px-1.5 py-0.5 rounded border border-[#444] mx-1"><PlusSquare className="w-3.5 h-3.5 inline text-white" /></span>.
                    </>
                  ) : (
                    <>
                      Scroll down and select <strong className="text-[#B99A65]">"Add to Home Screen"</strong> <span className="inline-block bg-[#24221E] px-1.5 py-0.5 rounded border border-[#444] mx-1"><PlusSquare className="w-3.5 h-3.5 inline text-white" /></span>.
                    </>
                  )}
                </p>
              </div>

              <div className="flex items-start gap-3 justify-end">
                <span className="order-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#B99A65]/10 border border-[#B99A65]/30 flex items-center justify-center text-[#B99A65] font-bold text-[10px]">٣</span>
                <p className="order-1 text-[#F7F4EE] leading-relaxed">
                  {isRtl ? (
                    <>
                      اضغط على <strong className="text-[#B99A65]">"إضافة"</strong> في الزاوية العلوية لتأكيد التثبيت! 🎉
                    </>
                  ) : (
                    <>
                      Tap <strong className="text-[#B99A65]">"Add"</strong> in the top right corner to complete! 🎉
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action Confirmation Button */}
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-extrabold text-xs tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              {isRtl ? 'حسناً، فهمت!' : 'Okay, I got it!'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
