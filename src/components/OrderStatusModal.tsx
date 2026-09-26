import React, { useState } from 'react';
import { X, Search, Clock, CheckCircle2, XCircle, AlertCircle, Phone, Sparkles } from 'lucide-react';
import { Language, OrderData } from '../types';
import { getOrderCloudById } from '../lib/firestoreService';
import { BRAND_NAME, BRAND_NAME_AR } from '../config/brand';

interface OrderStatusModalProps {
  currentLang: Language;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  currentLang,
  onClose,
  initialOrderId = '',
}) => {
  const isRtl = currentLang === 'ar';
  const [orderId, setOrderId] = useState(initialOrderId);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const found = await getOrderCloudById(orderId.trim());
      if (found) {
        setOrder(found);
      } else {
        setOrder(null);
        setError(
          isRtl
            ? 'لم يتم العثور على طلب بهذا الرقم. يرجى التأكد من كتابة كود الطلب بشكل صحيح.'
            : 'No order found with this ID. Please double check your order reference code.'
        );
      }
    } catch (err: any) {
      setError(
        isRtl
          ? 'حدث خطأ أثناء فحص حالة الطلب. يرجى المحاولة لاحقاً.'
          : 'Failed to look up order. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderData['status']) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/50 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isRtl ? 'تمت الموافقة وتفعيل الدعوة بنجاح' : 'Approved & Activated'}</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-600/50 text-rose-400 text-xs font-bold">
            <XCircle className="w-4 h-4" />
            <span>{isRtl ? 'تم رفض الطلب' : 'Rejected'}</span>
          </div>
        );
      case 'pending':
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-600/50 text-amber-400 text-xs font-bold">
            <Clock className="w-4 h-4 animate-spin" />
            <span>{isRtl ? 'قيد المراجعة والتحقق من فودافون كاش' : 'Pending Review'}</span>
          </div>
        );
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#171717] border border-[#B99A65]/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#1F1E1B] border border-[#333] flex items-center justify-center text-[#F7F4EE] hover:text-[#B99A65] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F1E1B] border border-[#B99A65]/40 text-[#B99A65] text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'متابعة حالة الطلب' : 'Track Order Status'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#F7F4EE]">
            {isRtl ? `تتبع طلبك في ${BRAND_NAME_AR}` : `Track your ${BRAND_NAME} Order`}
          </h3>
          <p className="text-xs text-[#8D8A84]">
            {isRtl
              ? 'أدخل كود الطلب (ORD-...) للاطلاع على حالة المراجعة وتأكيد الدفع'
              : 'Enter your order ID (ORD-...) to check review and activation status.'}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            required
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="ORD-XXXXXX"
            className="flex-1 bg-[#1F1E1B] border border-[#333] rounded-xl px-4 py-2.5 text-xs text-[#F7F4EE] font-mono focus:outline-none focus:border-[#B99A65]"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs hover:bg-[#d6bd91] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? (isRtl ? 'فحص...' : 'Checking...') : isRtl ? 'بحث' : 'Search'}</span>
          </button>
        </form>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {order && (
          <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#333] pb-3">
              <span className="text-[#8D8A84]">{isRtl ? 'حالة الطلب:' : 'Status:'}</span>
              {getStatusBadge(order.status)}
            </div>

            <div className="space-y-2 text-[#E9E1D5]">
              <div className="flex justify-between">
                <span className="text-[#8D8A84]">{isRtl ? 'رقم الطلب:' : 'Order ID:'}</span>
                <span className="font-mono font-bold text-[#F7F4EE]">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8D8A84]">{isRtl ? 'صاحب الطلب:' : 'Customer:'}</span>
                <span>{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8D8A84]">{isRtl ? 'قيمة الباقة:' : 'Amount:'}</span>
                <strong className="text-[#B99A65]">{order.amount} EGP ({order.planTier})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8D8A84]">{isRtl ? 'تاريخ الطلب:' : 'Date:'}</span>
                <span>{new Date(order.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
              </div>
            </div>

            {order.status === 'approved' && order.invitationId && (
              <div className="pt-2">
                <a
                  href={`/i/${order.invitationId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500 transition-all"
                >
                  <span>{isRtl ? 'فتح رابط الدعوة المفعّلة الآن' : 'Open Activated Invitation'}</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
