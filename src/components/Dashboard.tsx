import React, { useState } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Eye,
  Edit3,
  Share2,
  Trash2,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Download,
  X,
  Copy,
  Crown,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import { InvitationData, Language, RSVPResponse } from '../types';
import { deleteInvitation, getStoredRSVPs } from '../lib/storage';
import { useTranslation } from '../data/translations';

interface DashboardProps {
  invitations: InvitationData[];
  currentLang: Language;
  onStartCreate: () => void;
  onEditInvitation: (invitation: InvitationData) => void;
  onPreviewInvitation: (invitation: InvitationData) => void;
  onShareInvitation: (invitation: InvitationData) => void;
  onRefreshList: () => void;
  onOpenPortal?: (invitation: InvitationData) => void;
  onOpenCardImage?: (invitation: InvitationData) => void;
  onOpenPricing?: (invitation: InvitationData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  invitations,
  currentLang,
  onStartCreate,
  onEditInvitation,
  onPreviewInvitation,
  onShareInvitation,
  onRefreshList,
  onOpenPortal,
  onOpenCardImage,
  onOpenPricing,
}) => {
  const t = useTranslation(currentLang);
  const isRtl = currentLang === 'ar';

  const [activeRsvpModalInvitation, setActiveRsvpModalInvitation] = useState<InvitationData | null>(null);
  const [selectedRsvps, setSelectedRsvps] = useState<RSVPResponse[]>([]);

  const handleDelete = (id: string) => {
    if (confirm(isRtl ? 'هل أنت تأكد من رغبتك في حذف هذه الدعوة؟' : 'Are you sure you want to delete this invitation?')) {
      deleteInvitation(id);
      onRefreshList();
    }
  };

  const handleOpenGuestList = (invitation: InvitationData) => {
    const rsvps = getStoredRSVPs(invitation.id);
    setSelectedRsvps(rsvps);
    setActiveRsvpModalInvitation(invitation);
  };

  const calculateTotalAttending = (rsvps: RSVPResponse[]) => {
    return rsvps.filter((r) => r.status === 'attending').reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#171717] text-[#F7F4EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-[#333]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f1e1b] border border-[#B99A65]/30 text-[#B99A65] text-xs font-semibold uppercase tracking-widest mb-2">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.nav.dashboard}</span>
            </div>
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold">
              {t.dashboard.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#8D8A84] mt-1">
              {t.dashboard.subtitle}
            </p>
          </div>

          <button
            onClick={onStartCreate}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(185,154,101,0.4)] flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.dashboard.createNew}</span>
          </button>
        </div>

        {/* Invitation Cards List */}
        {invitations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {invitations.map((inv) => {
              const rsvps = getStoredRSVPs(inv.id);
              const attendingCount = calculateTotalAttending(rsvps);

              return (
                <div
                  key={inv.id}
                  className="bg-[#1F1E1B] border border-[#B99A65]/20 hover:border-[#B99A65]/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          inv.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                            : inv.status === 'pending_approval'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 animate-pulse'
                            : inv.status === 'rejected'
                            ? 'bg-red-500/15 text-red-400 border-red-500/30'
                            : 'bg-[#333] text-[#8D8A84] border-[#444]'
                        }`}
                      >
                        {inv.status === 'published' && (isRtl ? 'معتمدة ومفعلة ✅' : 'Active & Published')}
                        {inv.status === 'pending_approval' && (isRtl ? 'بانتظار تأكيد فودافون كاش ⏳' : 'Pending Payment')}
                        {inv.status === 'rejected' && (isRtl ? 'تم الرفض ✕' : 'Rejected')}
                        {inv.status === 'draft' && (isRtl ? 'مسودة' : 'Draft')}
                      </span>

                      <span className="text-[10px] text-[#8D8A84]">
                        {inv.eventDetails.eventDate}
                      </span>
                    </div>

                    {inv.status === 'pending_approval' && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 leading-relaxed">
                        {isRtl
                          ? 'جاري مراجعة تحويل فودافون كاش من قبل الإدارة. سيصلك إشعار التفعيل والرابط فوراً.'
                          : 'Payment transfer is under review. The active link will be sent upon verification.'}
                      </div>
                    )}

                    {inv.status === 'rejected' && inv.rejectionReason && (
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-[11px] text-red-300">
                        <strong>{isRtl ? 'سبب الرفض:' : 'Reason:'}</strong> {inv.rejectionReason}
                      </div>
                    )}

                    <h3 className="font-playfair text-xl font-bold text-[#F7F4EE] line-clamp-1">
                      {inv.title || inv.eventDetails.eventTitle}
                    </h3>

                    <p className="text-xs text-[#8D8A84] truncate">
                      {inv.eventDetails.hostNames} • {inv.eventDetails.venueName}
                    </p>

                    {/* Stats summary & Host Portal Action */}
                    <div className="bg-[#171717] rounded-xl p-3 border border-[#333] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[#E9E1D5]">
                        <Users className="w-4 h-4 text-[#B99A65]" />
                        <span>ردود الحضور: <strong className="text-[#F7F4EE]">{rsvps.length}</strong> ({attendingCount} مؤكد)</span>
                      </div>
                      {onOpenPortal ? (
                        <button
                          onClick={() => onOpenPortal(inv)}
                          className="px-2.5 py-1 rounded-lg bg-[#B99A65]/15 text-[#B99A65] border border-[#B99A65]/30 hover:bg-[#B99A65] hover:text-[#171717] text-[11px] font-bold transition-all cursor-pointer"
                        >
                          {isRtl ? 'بوابة المعازيم 👑' : 'Host Portal 👑'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenGuestList(inv)}
                          className="text-[11px] text-[#B99A65] font-semibold hover:underline"
                        >
                          {t.dashboard.actions.rsvps} →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-[#333] flex items-center justify-between text-xs gap-1.5 flex-wrap">
                    <button
                      onClick={() => onPreviewInvitation(inv)}
                      className="p-2 rounded-lg bg-[#171717] border border-[#333] text-[#E9E1D5] hover:text-[#B99A65] flex items-center gap-1 text-[11px] cursor-pointer"
                      title={t.dashboard.actions.preview}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.dashboard.actions.preview}</span>
                    </button>

                    <button
                      onClick={() => onEditInvitation(inv)}
                      className="p-2 rounded-lg bg-[#171717] border border-[#333] text-[#E9E1D5] hover:text-[#B99A65] flex items-center gap-1 text-[11px] cursor-pointer"
                      title={t.dashboard.actions.edit}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.dashboard.actions.edit}</span>
                    </button>

                    {onOpenCardImage && (
                      <button
                        onClick={() => onOpenCardImage(inv)}
                        className="p-2 rounded-lg bg-[#171717] border border-[#333] text-[#E9E1D5] hover:text-[#B99A65] flex items-center gap-1 text-[11px] cursor-pointer"
                        title={isRtl ? 'كرت صورة للواتساب' : 'Static Card Image'}
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-[#B99A65]" />
                        <span>{isRtl ? 'كرت صورة' : 'Card'}</span>
                      </button>
                    )}

                    {onOpenPricing && (
                      <button
                        onClick={() => onOpenPricing(inv)}
                        className={`p-2 rounded-lg border flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-all ${
                          inv.status === 'published'
                            ? 'bg-[#B99A65]/10 border-[#B99A65]/30 text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717]'
                            : inv.status === 'pending_approval'
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-[#171717]'
                            : 'bg-emerald-600/20 border-emerald-500 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                        }`}
                        title={isRtl ? 'دفع وتفعيل فودافون كاش' : 'Vodafone Cash Payment'}
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>
                          {inv.status === 'published'
                            ? isRtl ? 'ترقية' : 'Upgrade'
                            : inv.status === 'pending_approval'
                            ? isRtl ? 'متابعة الدفع' : 'Payment Status'
                            : isRtl ? 'تفعيل وفودافون كاش 💰' : 'Activate (Cash)'}
                        </span>
                      </button>
                    )}

                    {inv.status === 'published' && (
                      <button
                        onClick={() => onShareInvitation(inv)}
                        className="p-2 rounded-lg bg-[#B99A65]/20 border border-[#B99A65] text-[#B99A65] hover:bg-[#B99A65] hover:text-[#171717] transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                        title={t.dashboard.actions.share}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{t.dashboard.actions.share}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-[11px] cursor-pointer ml-auto rtl:mr-auto rtl:ml-0"
                      title={t.dashboard.actions.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#1F1E1B] rounded-3xl border border-[#333] mt-8 space-y-4 max-w-lg mx-auto">
            <Sparkles className="w-12 h-12 text-[#B99A65] mx-auto animate-pulse" />
            <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
              {t.dashboard.noInvitations}
            </h3>
            <p className="text-xs text-[#8D8A84] max-w-xs mx-auto leading-relaxed">
              {t.dashboard.noInvitationsDesc}
            </p>
            <button
              onClick={onStartCreate}
              className="px-6 py-3 rounded-2xl bg-[#B99A65] text-[#171717] font-bold text-xs uppercase"
            >
              {t.dashboard.createNew}
            </button>
          </div>
        )}

      </div>

      {/* Guest RSVP Responses Tracker Modal */}
      {activeRsvpModalInvitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#171717] border border-[#B99A65] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setActiveRsvpModalInvitation(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#333] pb-4">
              <h3 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
                {t.dashboard.guestListModalTitle}
              </h3>
              <p className="text-xs text-[#8D8A84] mt-1">
                {activeRsvpModalInvitation.title}
              </p>
            </div>

            {/* Responses summary bar */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-3">
                <span className="font-playfair text-xl font-bold text-[#B99A65] block">
                  {selectedRsvps.length}
                </span>
                <span className="text-[10px] text-[#8D8A84] uppercase">{t.dashboard.totalRSVPs}</span>
              </div>

              <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-3">
                <span className="font-playfair text-xl font-bold text-emerald-400 block">
                  {calculateTotalAttending(selectedRsvps)}
                </span>
                <span className="text-[10px] text-[#8D8A84] uppercase">{t.dashboard.attendingCount}</span>
              </div>

              <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-3">
                <span className="font-playfair text-xl font-bold text-amber-400 block">
                  {selectedRsvps.filter((r) => r.status === 'declined').length}
                </span>
                <span className="text-[10px] text-[#8D8A84] uppercase">{t.dashboard.declinedCount}</span>
              </div>
            </div>

            {/* Guests Table */}
            {selectedRsvps.length > 0 ? (
              <div className="overflow-x-auto border border-[#333] rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1F1E1B] text-[#B99A65] uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Guest Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Count</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Dietary / Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333]">
                    {selectedRsvps.map((r) => (
                      <tr key={r.id} className="hover:bg-[#1F1E1B]/50">
                        <td className="p-3 font-semibold text-[#F7F4EE]">{r.guestName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === 'attending'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : r.status === 'declined'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-[#E9E1D5]">{r.guestCount}</td>
                        <td className="p-3 text-[#8D8A84]">{r.phone || r.email || 'N/A'}</td>
                        <td className="p-3 text-[#8D8A84] truncate max-w-xs">{r.dietaryNotes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-xs text-[#8D8A84] py-8">
                {isRtl ? 'لم يتم تسجيل أي ردود حتى الآن.' : 'No guest responses recorded yet.'}
              </p>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
