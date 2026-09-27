import React, { useState } from 'react';
import {
  X,
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { InvitationData, RSVPResponse } from '../../types';

interface LiveCheckInModalProps {
  invitation: InvitationData;
  rsvps: RSVPResponse[];
  onCheckInGuest: (rsvpId: string) => void;
  onClose: () => void;
  isRtl?: boolean;
}

export const LiveCheckInModal: React.FC<LiveCheckInModalProps> = ({
  invitation,
  rsvps,
  onCheckInGuest,
  onClose,
  isRtl = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scannedResult, setScannedResult] = useState<RSVPResponse | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<RSVPResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const checkedInCount = rsvps.filter((r) => r.checkedIn).length;
  const totalAttending = rsvps.filter((r) => r.status === 'attending').length;

  const filteredGuests = rsvps.filter((r) =>
    r.guestName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
    (r.phone && r.phone.includes(searchTerm.trim()))
  );

  const handleSelectGuest = (guest: RSVPResponse) => {
    if (guest.checkedIn) {
      setDuplicateWarning(guest);
      setScannedResult(null);
    } else {
      setDuplicateWarning(null);
      setScannedResult(guest);
    }
  };

  const handleConfirmCheckIn = () => {
    if (!scannedResult) return;
    onCheckInGuest(scannedResult.id);
    setScannedResult(null);
  };

  const handleSimulateQrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Pick first attending guest for simulation
      const attending = rsvps.find((r) => r.status === 'attending') || rsvps[0];
      if (attending) {
        handleSelectGuest(attending);
      }
    }, 1200);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B99A65]/20 border border-[#B99A65] text-[#C9A86A] text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A86A]" />
            <span>{isRtl ? 'وضع الاستقبال المباشر — يوم الزفاف' : 'FRIDA Live Wedding Mode'}</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? 'تسجيل دخول المدعوين ومسح الـ QR' : 'Guest Event Check-In'}
          </h2>
          <p className="text-xs text-[#8D8A84]">
            {invitation.title || invitation.eventDetails.eventTitle}
          </p>
        </div>

        {/* Stats Counter Bar */}
        <div className="grid grid-cols-2 gap-3 bg-[#1F1E1B] border border-[#333] rounded-2xl p-4 text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] text-[#8D8A84] uppercase tracking-wider block font-mono">
              {isRtl ? 'تم تسجيل دخولهم الآن' : 'Checked In'}
            </span>
            <span className="text-2xl font-mono font-bold text-emerald-400">{checkedInCount}</span>
          </div>
          <div className="space-y-0.5 border-r border-[#333]">
            <span className="text-[10px] text-[#8D8A84] uppercase tracking-wider block font-mono">
              {isRtl ? 'إجمالي التأكيدات' : 'Total Confirmed'}
            </span>
            <span className="text-2xl font-mono font-bold text-[#B99A65]">{totalAttending}</span>
          </div>
        </div>

        {/* Duplicate Scan Warning Modal Alert */}
        {duplicateWarning && (
          <div className="p-4 rounded-2xl bg-amber-950/50 border-2 border-amber-500 text-amber-200 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{isRtl ? '⚠️ تنبيه: تم تسجيل الدخول المسبق!' : '⚠️ Already Checked In!'}</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed">
              {isRtl
                ? `الضيف (${duplicateWarning.guestName}) تمت مراجعة كود الـ QR الخاص به مسبقاً وتأكيد دخوله للقاعة.`
                : `Guest (${duplicateWarning.guestName}) has already checked in.`}
            </p>
            <div className="bg-black/40 p-3 rounded-xl text-xs space-y-1 font-mono">
              <div>الطاولة: {duplicateWarning.tableNumber || 'غير محددة'}</div>
              <div>عدد المقاعد: {duplicateWarning.guestCount || 1}</div>
              <div>
                توقيت الدخول: {duplicateWarning.checkedInAt ? new Date(duplicateWarning.checkedInAt).toLocaleTimeString('ar-EG') : 'تم سابقاً'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDuplicateWarning(null)}
              className="w-full py-2 rounded-xl bg-amber-500 text-[#171717] font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              {isRtl ? 'حسناً، فهمت' : 'Dismiss Warning'}
            </button>
          </div>
        )}

        {/* Selected Scanned Guest Action Box */}
        {scannedResult && !duplicateWarning && (
          <div className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500 text-emerald-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-emerald-300">
                  {isRtl ? 'دعوة معتمدة وسليمة ✨' : 'Valid Invitation Verified'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-mono font-bold">
                VIP GUEST
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{scannedResult.guestName}</h3>
              <p className="text-xs text-emerald-200/80">
                {scannedResult.plusOneName ? `مرافق: ${scannedResult.plusOneName}` : 'دعوة فردية / عائلية'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-black/40 p-3 rounded-xl text-xs font-mono">
              <div>🪑 الطاولة: <strong className="text-emerald-300">{scannedResult.tableNumber || 'طاولة عامة'}</strong></div>
              <div>👥 المقاعد: <strong className="text-emerald-300">{scannedResult.guestCount || 1}</strong></div>
            </div>

            <button
              type="button"
              onClick={handleConfirmCheckIn}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isRtl ? 'تأكيد ودخول القاعة الآن 🎟️' : 'Confirm Check-In Now'}</span>
            </button>
          </div>
        )}

        {/* QR Scanner Controls & Search */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleSimulateQrScan}
            disabled={isScanning}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B99A65] via-[#E6D7B8] to-[#B99A65] text-[#171717] font-mono font-bold text-xs uppercase tracking-widest hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#171717]" />
                <span>{isRtl ? 'جاري مسح كود الـ QR...' : 'Scanning QR Code...'}</span>
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5 text-[#171717]" />
                <span>{isRtl ? 'مسح كود الـ QR للضيف (كاميرا الهاتف)' : 'Scan Guest QR Code'}</span>
              </>
            )}
          </button>

          {/* Search Guest Manually */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8D8A84] absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder={isRtl ? 'ابحث باسم الضيف أو رقم الهاتف للبحث والتحقق المباشر...' : 'Search guest name...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1F1E1B] border border-[#333] rounded-xl pr-10 pl-4 py-2.5 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65]"
            />
          </div>

          {/* Guest List Results */}
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {filteredGuests.length === 0 ? (
              <div className="p-4 text-center text-xs text-[#666]">
                {isRtl ? 'لا يوجد مدعوين مطابقين للبحث' : 'No matching guests'}
              </div>
            ) : (
              filteredGuests.map((guest) => (
                <div
                  key={guest.id}
                  onClick={() => handleSelectGuest(guest)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                    guest.checkedIn
                      ? 'bg-[#1A1918] border-[#333] opacity-60'
                      : 'bg-[#1F1E1B] border-[#333] hover:border-[#B99A65]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-[#F7F4EE] flex items-center gap-2">
                      <span>{guest.guestName}</span>
                      {guest.tableNumber && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#2A2722] text-[#B99A65] font-mono">
                          طاولة {guest.tableNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#8D8A84] font-mono">
                      {guest.guestCount || 1} {isRtl ? 'مقاعد' : 'seats'}
                    </div>
                  </div>

                  {guest.checkedIn ? (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{isRtl ? 'تم الدخول' : 'Checked In'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#2A2722] text-[#C9A86A] border border-[#B99A65]/40 font-mono">
                      {isRtl ? 'تسجيل دخول' : 'Check In'}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
