import React from 'react';
import {
  Shield,
  Crown,
  FileText,
  Users,
  Sparkles,
  Music,
  Star,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { Language } from '../../types';
import { auth } from '../../lib/firebase';

export type AdminTab = 'orders' | 'all_invitations' | 'settings' | 'music' | 'reviews' | 'templates';

interface AdminHeaderProps {
  currentLang: Language;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingOrdersCount: number;
  totalOrdersCount: number;
  totalInvitationsCount: number;
  reviewsCount: number;
  onLogout: () => void;
  onClose: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentLang,
  activeTab,
  setActiveTab,
  pendingOrdersCount,
  totalOrdersCount,
  totalInvitationsCount,
  reviewsCount,
  onLogout,
  onClose,
}) => {
  const isRtl = currentLang === 'ar';
  const currentUser = auth.currentUser;

  return (
    <header className="sticky top-0 z-30 bg-[#171717]/95 backdrop-blur-md border-b border-[#2A2722] px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B99A65]/30 to-[#B99A65]/10 border border-[#B99A65] flex items-center justify-center text-[#B99A65] shadow-md">
              <Shield className="w-5 h-5 text-[#B99A65]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-playfair text-lg font-bold text-[#F7F4EE]">
                  {isRtl ? 'لوحة تحكم الإدارة الملكية' : 'FRIDA Royal Admin'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-[#B99A65]/20 text-[#B99A65] text-[10px] font-bold border border-[#B99A65]/40 flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>VIP</span>
                </span>
              </div>
              <p className="text-[11px] text-[#8D8A84] truncate max-w-xs">
                {currentUser?.email || (isRtl ? 'حساب الأدمن المعتمد' : 'Verified Admin')}
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#242424] border border-[#333] text-[#8D8A84] hover:text-[#F7F4EE]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {/* Orders */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#2E2C28]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isRtl ? 'طلبات الدفع' : 'Orders'}</span>
            {pendingOrdersCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-extrabold animate-pulse">
                {pendingOrdersCount}
              </span>
            ) : (
              <span className="text-[10px] opacity-75">({totalOrdersCount})</span>
            )}
          </button>

          {/* All Invitations */}
          <button
            onClick={() => setActiveTab('all_invitations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'all_invitations'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#2E2C28]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{isRtl ? 'كافة الدعوات' : 'Invitations'}</span>
            <span className="text-[10px] opacity-75">({totalInvitationsCount})</span>
          </button>

          {/* Custom Templates */}
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#2E2C28]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRtl ? 'القوالب المخصصة' : 'Templates'}</span>
          </button>

          {/* Music Library */}
          <button
            onClick={() => setActiveTab('music')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'music'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#2E2C28]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{isRtl ? 'المكتبة الصوتية' : 'Music'}</span>
          </button>

          {/* Reviews */}
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#2E2C28]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>{isRtl ? 'التقييمات' : 'Reviews'}</span>
            <span className="text-[10px] opacity-75">({reviewsCount})</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#2E2C28]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isRtl ? 'الإعدادات' : 'Settings'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={isRtl ? 'تسجيل الخروج' : 'Logout'}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isRtl ? 'خروج' : 'Logout'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1F1E1B] hover:bg-[#2A2722] border border-[#333] text-[#F7F4EE] hover:text-[#B99A65] transition-colors cursor-pointer"
            title={isRtl ? 'إغلاق اللوحة' : 'Close Panel'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
