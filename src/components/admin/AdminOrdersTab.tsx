import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  Copy,
  Crown,
  Share2,
  AlertTriangle,
  FileText,
  DollarSign,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { OrderData, InvitationData, Language } from '../../types';
import { getInvitationUrl } from '../../lib/urlUtils';

interface AdminOrdersTabProps {
  currentLang: Language;
  orders: OrderData[];
  invitations: InvitationData[];
  onApproveOrder: (order: OrderData) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onPreviewInvitation?: (inv: InvitationData) => void;
  onOpenHandoverModal: (invitation: InvitationData, order?: OrderData) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  currentLang,
  orders,
  invitations,
  onApproveOrder,
  onRejectOrder,
  onDeleteOrder,
  onPreviewInvitation,
  onOpenHandoverModal,
}) => {
  const isRtl = currentLang === 'ar';

  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
      return false;
    }
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase().trim();
    return (
      (order.customerName || '').toLowerCase().includes(q) ||
      (order.customerPhone || '').toLowerCase().includes(q) ||
      (order.vodafoneCashSender || '').toLowerCase().includes(q) ||
      (order.transactionReference || '').toLowerCase().includes(q) ||
      (order.invitationTitle || '').toLowerCase().includes(q) ||
      (order.id || '').toLowerCase().includes(q)
    );
  });

  const handleCopyLink = (inv: InvitationData) => {
    const url = getInvitationUrl(inv.slug || inv.id);
    navigator.clipboard.writeText(url);
    setCopiedOrderId(inv.id);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  const confirmReject = (orderId: string) => {
    if (!rejectionReason.trim()) return;
    onRejectOrder(orderId, rejectionReason.trim());
    setRejectingOrderId(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1F1E1B] p-4 rounded-2xl border border-[#2E2C28]">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className={`w-4 h-4 text-[#8D8A84] absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            value={orderSearchQuery}
            onChange={(e) => setOrderSearchQuery(e.target.value)}
            placeholder={isRtl ? 'بحث باسم العميل، الهاتف، أو الرقم المحول...' : 'Search by client, phone, or sender...'}
            className={`w-full bg-[#171717] border border-[#333] rounded-xl py-2 text-xs text-[#F7F4EE] placeholder-[#666] focus:outline-none focus:border-[#B99A65] transition-colors ${
              isRtl ? 'pr-9 pl-3' : 'pl-9 pr-3'
            }`}
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setOrderStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                orderStatusFilter === st
                  ? 'bg-[#B99A65] text-[#171717] shadow-md'
                  : 'bg-[#171717] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#333]'
              }`}
            >
              {st === 'all' && (isRtl ? 'الكل' : 'All')}
              {st === 'pending' && (isRtl ? '⏳ قيد المراجعة' : '⏳ Pending')}
              {st === 'approved' && (isRtl ? '✅ معتمد' : '✅ Approved')}
              {st === 'rejected' && (isRtl ? '❌ مرفوض' : '❌ Rejected')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-[#1F1E1B] rounded-3xl border border-[#2E2C28] p-8 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-[#333] flex items-center justify-center text-[#8D8A84] mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h4 className="text-[#F7F4EE] font-bold text-sm">
            {isRtl ? 'لا توجد طلبات تطابق هذا التصنيف' : 'No orders found'}
          </h4>
          <p className="text-xs text-[#8D8A84] max-w-sm mx-auto">
            {isRtl ? 'ستظهر هنا كافة طلبات الدفع عبر فودافون كاش فور إرسالها من العملاء.' : 'Vodafone cash orders will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order, idx) => {
            const linkedInv = invitations.find((i) => i.id === order.invitationId);
            const isApproved = order.status === 'approved';
            const isRejected = order.status === 'rejected';
            const isPending = order.status === 'pending';

            return (
              <div
                key={order.id ? `order-${order.id}-${idx}` : `order-item-${idx}`}
                className={`bg-[#1F1E1B] rounded-2xl p-5 border transition-all space-y-4 relative ${
                  isPending
                    ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                    : isApproved
                    ? 'border-emerald-500/30'
                    : 'border-red-500/20 opacity-80'
                }`}
              >
                {/* Status Badge & Tier */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {isPending && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-extrabold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{isRtl ? 'بانتظار التأكيد' : 'Pending Review'}</span>
                      </span>
                    )}
                    {isApproved && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>{isRtl ? 'معتمد ومسلم' : 'Approved & Handed'}</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2.5 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-extrabold flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        <span>{isRtl ? 'مرفوض' : 'Rejected'}</span>
                      </span>
                    )}
                  </div>

                  <span className="px-2 py-0.5 rounded-lg bg-[#2E2C28] text-[#B99A65] text-[10px] font-mono font-bold uppercase">
                    {order.planTier || 'royal'}
                  </span>
                </div>

                {/* Title & Customer Details */}
                <div className="space-y-1.5">
                  <h4 className="font-playfair text-base font-bold text-[#F7F4EE] line-clamp-1">
                    {order.invitationTitle || linkedInv?.title || (isRtl ? 'دعوة ملكية فاخرة' : 'Royal Invitation')}
                  </h4>
                  <p className="text-xs text-[#B99A65] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{order.customerName}</span>
                  </p>
                </div>

                {/* Financial & Payment Info Box */}
                <div className="p-3 rounded-xl bg-[#171717] border border-[#2A2722] space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#8D8A84]">
                    <span>{isRtl ? 'المبلغ المطلوب:' : 'Amount:'}</span>
                    <span className="text-[#F7F4EE] font-extrabold text-sm text-emerald-400">
                      {order.amount} {order.currency || 'EGP'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#8D8A84]">
                    <span>{isRtl ? 'هاتف العميل:' : 'Phone:'}</span>
                    <span className="text-[#F7F4EE] font-mono text-[11px]">{order.customerPhone}</span>
                  </div>

                  <div className="flex items-center justify-between text-[#8D8A84]">
                    <span>{isRtl ? 'رقم المحفظة المحول منها:' : 'Sender Wallet:'}</span>
                    <span className="text-amber-400 font-mono font-bold text-[11px]">{order.vodafoneCashSender}</span>
                  </div>

                  {order.transactionReference && (
                    <div className="flex items-center justify-between text-[#8D8A84] pt-1 border-t border-[#222]">
                      <span>{isRtl ? 'رقم العملية:' : 'Tx Ref:'}</span>
                      <span className="text-[#8D8A84] font-mono text-[10px] truncate max-w-[130px]">
                        {order.transactionReference}
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] text-[#666] pt-1">
                    {new Date(order.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-[#2A2722]">
                  {isPending && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onApproveOrder(order)}
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'اعتماد وتسليم 👑' : 'Approve & Handover'}</span>
                      </button>

                      <button
                        onClick={() => setRejectingOrderId(order.id)}
                        className="py-2.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-950/70 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'رفض الطلب' : 'Reject'}</span>
                      </button>
                    </div>
                  )}

                  {isApproved && linkedInv && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onOpenHandoverModal(linkedInv, order)}
                        className="py-2 px-3 rounded-xl bg-[#B99A65]/20 hover:bg-[#B99A65]/30 border border-[#B99A65]/50 text-[#B99A65] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{isRtl ? 'بيانات التسليم' : 'Credentials'}</span>
                      </button>

                      <button
                        onClick={() => handleCopyLink(linkedInv)}
                        className="py-2 px-3 rounded-xl bg-[#2A2722] hover:bg-[#333] text-[#F7F4EE] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#B99A65]" />
                        <span>{copiedOrderId === linkedInv.id ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'رابط الدعوة' : 'Share Link')}</span>
                      </button>
                    </div>
                  )}

                  {/* Secondary actions: Preview & Delete */}
                  <div className="flex items-center justify-between pt-1">
                    {linkedInv && onPreviewInvitation && (
                      <button
                        onClick={() => onPreviewInvitation(linkedInv)}
                        className="text-[11px] text-[#8D8A84] hover:text-[#F7F4EE] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-[#B99A65]" />
                        <span>{isRtl ? 'معاينة الدعوة' : 'Preview'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteOrder(order.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{isRtl ? 'حذف السجل' : 'Delete'}</span>
                    </button>
                  </div>
                </div>

                {/* Rejection Sub-Modal Inline */}
                {rejectingOrderId === order.id && (
                  <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl space-y-2 mt-2 animate-in fade-in">
                    <p className="text-[11px] text-red-300 font-bold">
                      {isRtl ? 'سبب الرفض (يظهر للعميل):' : 'Rejection Reason:'}
                    </p>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={isRtl ? 'مثال: لم يصل التحويل على الرقم المحدد...' : 'e.g. Transfer not received...'}
                      className="w-full bg-[#171717] border border-red-500/40 rounded-lg px-2.5 py-1.5 text-xs text-[#F7F4EE] focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setRejectingOrderId(null)}
                        className="px-2.5 py-1 text-[11px] text-[#8D8A84] hover:text-[#F7F4EE]"
                      >
                        {isRtl ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        onClick={() => confirmReject(order.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] rounded-lg"
                      >
                        {isRtl ? 'تأكيد الرفض' : 'Confirm Reject'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
