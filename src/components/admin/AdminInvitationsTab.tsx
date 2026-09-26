import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  Copy,
  Share2,
  QrCode,
  Sparkles,
  ExternalLink,
  Crown,
  KeyRound,
} from 'lucide-react';
import { InvitationData, Language } from '../../types';
import { getInvitationUrl } from '../../lib/urlUtils';

interface AdminInvitationsTabProps {
  currentLang: Language;
  invitations: InvitationData[];
  onUpdateStatus: (id: string, status: 'published' | 'draft' | 'pending_approval' | 'expired') => void;
  onDeleteInvitation: (id: string) => void;
  onPreviewInvitation?: (inv: InvitationData) => void;
  onOpenHandoverModal: (invitation: InvitationData) => void;
}

export const AdminInvitationsTab: React.FC<AdminInvitationsTabProps> = ({
  currentLang,
  invitations,
  onUpdateStatus,
  onDeleteInvitation,
  onPreviewInvitation,
  onOpenHandoverModal,
}) => {
  const isRtl = currentLang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredInvitations = invitations.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (inv.title || '').toLowerCase().includes(q) ||
      (inv.slug || '').toLowerCase().includes(q) ||
      (inv.eventDetails?.groomName || '').toLowerCase().includes(q) ||
      (inv.eventDetails?.brideName || '').toLowerCase().includes(q) ||
      (inv.id || '').toLowerCase().includes(q)
    );
  });

  const handleCopyInvitationLink = (inv: InvitationData) => {
    const url = getInvitationUrl(inv.slug || inv.id);
    navigator.clipboard.writeText(url);
    setCopiedId(inv.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1F1E1B] p-4 rounded-2xl border border-[#2E2C28]">
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 text-[#8D8A84] absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث باسم العروسين، عنوان الدعوة، أو الرابط...' : 'Search invitations...'}
            className={`w-full bg-[#171717] border border-[#333] rounded-xl py-2 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65] transition-colors ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'published', 'pending_approval', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#B99A65] text-[#171717] shadow-md'
                  : 'bg-[#171717] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#333]'
              }`}
            >
              {st === 'all' && (isRtl ? 'الكل' : 'All')}
              {st === 'published' && (isRtl ? '✨ منشورة رسمياً' : '✨ Published')}
              {st === 'pending_approval' && (isRtl ? '⏳ بانتظار الاعتماد' : '⏳ Pending')}
              {st === 'draft' && (isRtl ? '📝 مسودات' : '📝 Drafts')}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations Grid */}
      {filteredInvitations.length === 0 ? (
        <div className="text-center py-16 bg-[#1F1E1B] rounded-3xl border border-[#2E2C28] p-8 space-y-3">
          <h4 className="text-[#F7F4EE] font-bold text-sm">
            {isRtl ? 'لا توجد دعوات مسجلة تطابق البحث' : 'No invitations found'}
          </h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvitations.map((inv, idx) => {
            const isPublished = inv.status === 'published';
            const isPending = inv.status === 'pending_approval';

            return (
              <div
                key={inv.id ? `inv-${inv.id}-${idx}` : `inv-item-${idx}`}
                className="bg-[#1F1E1B] rounded-2xl p-5 border border-[#2E2C28] hover:border-[#B99A65]/50 transition-all space-y-4"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                      isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isPending
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {isPublished ? '✨ منشورة' : isPending ? '⏳ قيد المراجعة' : '📝 مسودة'}
                  </span>

                  <span className="text-[10px] text-[#8D8A84] font-mono">
                    {new Date(inv.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
                  </span>
                </div>

                {/* Title & Couple */}
                <div>
                  <h4 className="font-playfair text-base font-bold text-[#F7F4EE] line-clamp-1">
                    {inv.title || (isRtl ? 'دعوة بدون عنوان' : 'Untitled Invitation')}
                  </h4>
                  {(inv.eventDetails?.groomName || inv.eventDetails?.brideName) && (
                    <p className="text-xs text-[#B99A65] font-semibold mt-0.5">
                      {inv.eventDetails?.groomName} & {inv.eventDetails?.brideName}
                    </p>
                  )}
                  {inv.eventDetails?.eventDate && (
                    <p className="text-[11px] text-[#8D8A84] mt-1">
                      📅 {inv.eventDetails.eventDate}
                    </p>
                  )}
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-[#171717] rounded-xl border border-[#282622]">
                  <button
                    onClick={() => onUpdateStatus(inv.id, 'published')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      inv.status === 'published'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-[#8D8A84] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {isRtl ? 'نشر رسمي' : 'Publish'}
                  </button>
                  <button
                    onClick={() => onUpdateStatus(inv.id, 'pending_approval')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      inv.status === 'pending_approval'
                        ? 'bg-amber-600 text-white shadow'
                        : 'text-[#8D8A84] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {isRtl ? 'تعليق' : 'Pending'}
                  </button>
                  <button
                    onClick={() => onUpdateStatus(inv.id, 'draft')}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                      inv.status === 'draft'
                        ? 'bg-zinc-700 text-white shadow'
                        : 'text-[#8D8A84] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {isRtl ? 'مسودة' : 'Draft'}
                  </button>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onOpenHandoverModal(inv)}
                    className="py-2 px-3 rounded-xl bg-[#B99A65]/20 hover:bg-[#B99A65]/30 border border-[#B99A65]/50 text-[#B99A65] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'بيانات البوابة' : 'Credentials'}</span>
                  </button>

                  <button
                    onClick={() => handleCopyInvitationLink(inv)}
                    className="py-2 px-3 rounded-xl bg-[#2A2722] hover:bg-[#333] text-[#F7F4EE] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#B99A65]" />
                    <span>{copiedId === inv.id ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ الرابط' : 'Copy Link')}</span>
                  </button>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[#2A2722]">
                  {onPreviewInvitation && (
                    <button
                      onClick={() => onPreviewInvitation(inv)}
                      className="text-[11px] text-[#8D8A84] hover:text-[#F7F4EE] flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-[#B99A65]" />
                      <span>{isRtl ? 'معاينة حية' : 'Live Preview'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteInvitation(inv.id)}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer ml-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{isRtl ? 'حذف الدعوة' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
