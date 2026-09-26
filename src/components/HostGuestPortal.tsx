import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Printer,
  Search,
  Plus,
  ArrowLeft,
  Share2,
  FileSpreadsheet,
  Check,
  Trash2,
  Utensils,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  Lock,
  Heart,
  MessageSquare,
  KeyRound,
  LogOut,
  Crown,
  Link,
  Copy,
} from 'lucide-react';
import { InvitationData, RSVPResponse, Language, GuestWish } from '../types';
import { getStoredRSVPs, saveRSVP } from '../lib/storage';
import {
  getRSVPsCloud,
  subscribeRSVPsCloud,
  getInvitationCloud,
  authenticateClientCredentialsCloud,
} from '../lib/firestoreService';
import { useTranslation } from '../data/translations';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface HostGuestPortalProps {
  invitation: InvitationData;
  userLang?: Language;
  onBack: () => void;
}

export const HostGuestPortal: React.FC<HostGuestPortalProps> = ({
  invitation: initialInvitation,
  userLang = 'ar',
  onBack,
}) => {
  const isRtl = userLang === 'ar';
  const t = useTranslation(userLang);

  const [invitation, setInvitation] = useState<InvitationData>(initialInvitation);

  // Host Auth Gate State
  const [isHostAuthenticated, setIsHostAuthenticated] = useState<boolean>(false);
  const [loginPhoneOrUser, setLoginPhoneOrUser] = useState('');
  const [loginAccessCode, setLoginAccessCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sync Firebase Auth State
  useEffect(() => {
    const checkUser = async (user: any) => {
      if (!user) {
        setIsHostAuthenticated(false);
        return;
      }
      try {
        const tokenRes = await user.getIdTokenResult();
        const isHostForThisInv = tokenRes.claims?.hostOf === invitation.id || user.uid === `host_${invitation.id}`;
        const isOwner = Boolean(invitation.ownerUid && user.uid === invitation.ownerUid);
        const isAdmin = tokenRes.claims?.admin === true;

        setIsHostAuthenticated(Boolean(isHostForThisInv || isOwner || isAdmin));
      } catch {
        setIsHostAuthenticated(false);
      }
    };

    checkUser(auth.currentUser);
    const unsubscribe = onAuthStateChanged(auth, checkUser);
    return () => unsubscribe();
  }, [invitation.id, invitation.ownerUid]);

  // Host Login Submission via Cloud Function
  const handleHostLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAccessCode.trim()) return;

    // 1. Check 30-Day Expiration
    const isExpired =
      invitation.status === 'expired' ||
      (Boolean(invitation.expiresAt) && new Date(invitation.expiresAt!).getTime() < Date.now());

    if (isExpired) {
      setLoginError(
        isRtl
          ? 'عفواً، لقد انتهت فترة صلاحية هذا الحساب والدعوة (30 يوماً). تم إيقاف صلاحية الدخول تلقائياً.'
          : 'This invitation and host account have expired (30-day validity limit).'
      );
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const targetIdentifier = loginPhoneOrUser.trim() || invitation.slug || invitation.id;
      const res = await authenticateClientCredentialsCloud(targetIdentifier, loginAccessCode.trim());

      if (res.success) {
        setIsHostAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError(res.error || (isRtl ? 'كود المضيف غير صحيح.' : 'Invalid Host Access Code.'));
      }
    } catch (err: any) {
      setLoginError(err.message || (isRtl ? 'تعذر تسجيل الدخول. يرجى إعادة المحاولة.' : 'Authentication error.'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleHostLogout = async () => {
    await signOut(auth);
    setIsHostAuthenticated(false);
  };

  // Active Tab: 'rsvps' | 'wishes' | 'vip_links'
  const [activeTab, setActiveTab] = useState<'rsvps' | 'wishes' | 'vip_links'>('rsvps');

  const [rsvps, setRsvps] = useState<RSVPResponse[]>(() => getStoredRSVPs(invitation.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'maybe'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // VIP personalized link generator state
  const [vipGuestName, setVipGuestName] = useState('');
  const [generatedVipLink, setGeneratedVipLink] = useState('');
  const [copiedVipLink, setCopiedVipLink] = useState(false);

  // New Guest Manual Form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState<'attending' | 'declined' | 'maybe'>('attending');
  const [newCount, setNewCount] = useState(1);
  const [newPlusOne, setNewPlusOne] = useState('');
  const [newDietary, setNewDietary] = useState('');

  // Refresh invitation data from cloud to ensure latest wishes list
  useEffect(() => {
    getInvitationCloud(invitation.id).then((cloudInv) => {
      if (cloudInv) setInvitation(cloudInv);
    });
  }, [invitation.id]);

  // Subscribe to Cloud Firestore updates for RSVPs
  useEffect(() => {
    getRSVPsCloud(invitation.id).then((cloudList) => {
      if (cloudList && cloudList.length > 0) {
        setRsvps(cloudList);
      }
    });

    const unsubscribe = subscribeRSVPsCloud(invitation.id, (newList) => {
      if (newList && newList.length > 0) {
        setRsvps(newList);
      }
    });

    return () => unsubscribe();
  }, [invitation.id]);

  // Calculations
  const attendingList = rsvps.filter((r) => r.status === 'attending');
  const declinedList = rsvps.filter((r) => r.status === 'declined');
  const maybeList = rsvps.filter((r) => r.status === 'maybe');

  const totalHeadsAttending = attendingList.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);

  // Wishes List
  const wishesList: GuestWish[] = invitation.eventDetails.wishesList || [];

  // Filtered List
  const filteredRSVPs = rsvps.filter((r) => {
    const matchesSearch =
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone && r.phone.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Export to CSV (Excel)
  const handleExportCSV = () => {
    const headers = [
      isRtl ? 'اسم الضيف' : 'Guest Name',
      isRtl ? 'حالة الحضور' : 'Status',
      isRtl ? 'عدد الأفراد' : 'Guest Count',
      isRtl ? 'المرافق' : 'Plus One',
      isRtl ? 'رقم الهاتف' : 'Phone',
      isRtl ? 'البريد الإلكتروني' : 'Email',
      isRtl ? 'ملاحظات الوجبات' : 'Dietary Notes',
      isRtl ? 'تاريخ الرد' : 'Date',
    ];

    const rows = rsvps.map((r) => [
      `"${r.guestName}"`,
      r.status,
      r.guestCount,
      `"${r.plusOneName || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.email || ''}"`,
      `"${r.dietaryNotes || ''}"`,
      `"${new Date(r.createdAt).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `frida_guest_list_${invitation.slug || invitation.id}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Attendance Sheet for Security / Venue Staff
  const handlePrint = () => {
    window.print();
  };

  // Add Manual Guest
  const handleAddManualGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const added = saveRSVP({
      invitationId: invitation.id,
      guestName: newName.trim(),
      phone: newPhone.trim() || undefined,
      status: newStatus,
      guestCount: newCount,
      plusOneName: newPlusOne.trim() || undefined,
      dietaryNotes: newDietary.trim() || undefined,
    });

    setRsvps((prev) => [added, ...prev]);
    setNewName('');
    setNewPhone('');
    setNewPlusOne('');
    setNewDietary('');
    setNewCount(1);
    setShowAddModal(false);
  };

  const handleGenerateVipLink = () => {
    if (!vipGuestName.trim()) return;
    const origin = window.location.origin;
    const invId = invitation.slug || invitation.id;
    const encodedGuest = encodeURIComponent(vipGuestName.trim());
    const full = `${origin}/i/${encodeURIComponent(invId)}?guest=${encodedGuest}`;
    setGeneratedVipLink(full);
  };

  const handleCopyVipLink = () => {
    if (!generatedVipLink) return;
    navigator.clipboard.writeText(generatedVipLink);
    setCopiedVipLink(true);
    setTimeout(() => setCopiedVipLink(false), 2000);
  };

  // 1. HOST LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isHostAuthenticated) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen bg-[#121212] flex items-center justify-center p-4 selection:bg-[#B99A65] selection:text-[#171717]"
      >
        <div className="w-full max-w-md bg-[#1F1E1B] border border-[#B99A65]/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(185,154,101,0.15)] space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#B99A65] to-transparent" />

          <div className="w-16 h-16 rounded-2xl bg-[#B99A65]/10 border border-[#B99A65]/30 flex items-center justify-center mx-auto text-[#B99A65]">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="px-3 py-1 rounded-full bg-[#B99A65]/15 border border-[#B99A65]/30 text-[#B99A65] text-[10px] font-bold uppercase tracking-wider">
              {isRtl ? 'لوحة تحكم صاحب الدعوة (Host Portal)' : 'Private Host Portal'}
            </span>
            <h2 className="font-playfair text-2xl font-bold text-[#F7F4EE]">
              {invitation.title || invitation.eventDetails.eventTitle}
            </h2>
            <p className="text-xs text-[#8D8A84]">
              {isRtl
                ? 'يرجى إدخال كود المضيف وكلمة السر لمتابعة إحصائيات الحضور ورسائل التهاني.'
                : 'Enter your Host Access Code to view live attendance & congratulations.'}
            </p>
          </div>

          <form onSubmit={handleHostLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                {isRtl ? 'رقم الهاتف أو اسم العميل (اختياري)' : 'Phone or Host Name'}
              </label>
              <input
                type="text"
                value={loginPhoneOrUser}
                onChange={(e) => setLoginPhoneOrUser(e.target.value)}
                placeholder={isRtl ? 'مثال: 010...' : 'e.g. 010...'}
                className="w-full bg-[#171717] border border-[#333] rounded-xl px-4 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-400 mb-1">
                {isRtl ? 'كود المضيف السري (Host Access Code / Password) *' : 'Secret Host Access Code *'}
              </label>
              <input
                type="password"
                required
                autoFocus
                value={loginAccessCode}
                onChange={(e) => setLoginAccessCode(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#171717] border border-amber-500/40 rounded-xl px-4 py-3 text-center text-sm font-mono tracking-widest text-[#F7F4EE] focus:outline-none focus:border-amber-400"
              />
              {loginError && (
                <p className="text-xs text-red-400 mt-2 font-semibold text-center">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B99A65] via-[#d6bd91] to-[#B99A65] text-[#171717] font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(185,154,101,0.4)] transition-all cursor-pointer shadow-lg"
            >
              {isRtl ? 'دخول لوحة التحكم 👑' : 'Access Host Dashboard 👑'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-2 text-xs text-[#8D8A84] hover:text-[#F7F4EE] transition-colors cursor-pointer text-center"
            >
              {isRtl ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED HOST DASHBOARD
  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#121212] text-[#F7F4EE] py-8 px-4 sm:px-6 lg:px-8 font-sans-body selection:bg-[#B99A65] selection:text-[#171717]"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1F1E1B] border border-[#B99A65]/30 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-1">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs text-[#B99A65] hover:text-[#d6bd91] font-semibold mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isRtl ? 'العودة للموقع' : 'Back to Home'}</span>
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#B99A65]/20 border border-[#B99A65] text-[#B99A65] text-[10px] font-bold uppercase tracking-wider">
                {isRtl ? 'بوابة العميل الخاصة (Host VIP)' : 'Host VIP Portal'}
              </span>
              <span className="text-xs text-[#8D8A84]">
                كود المضيف: <strong className="text-[#F7F4EE] font-mono">{invitation.hostAccessCode || '••••••••'}</strong>
              </span>
              {invitation.expiresAt && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  {isRtl
                    ? `⏳ صالحة حتى: ${new Date(invitation.expiresAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}`
                    : `⏳ Valid until: ${new Date(invitation.expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`}
                </span>
              )}
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F7F4EE]">
              {invitation.title || invitation.eventDetails.eventTitle}
            </h1>
            <p className="text-xs text-[#8D8A84]">
              {invitation.eventDetails.hostNames} • {invitation.eventDetails.eventDate} • {invitation.eventDetails.venueName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#171717] border border-[#B99A65]/40 text-[#E9E1D5] hover:text-[#B99A65] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md hover:border-[#B99A65]"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{isRtl ? 'تصدير إكسل (Excel)' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-[#171717] border border-[#333] hover:border-[#B99A65] text-[#E9E1D5] hover:text-[#B99A65] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4 text-[#B99A65]" />
              <span>{isRtl ? 'طباعة كشف القاعة' : 'Print Checklist'}</span>
            </button>

            <button
              onClick={handleHostLogout}
              className="p-2.5 rounded-xl bg-[#171717] border border-[#333] hover:border-red-500/40 text-[#8D8A84] hover:text-red-400 text-xs transition-all cursor-pointer"
              title={isRtl ? 'تسجيل الخروج من البوابة' : 'Logout'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Attendance Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-5 text-center shadow-lg space-y-1">
            <div className="w-10 h-10 rounded-full bg-[#B99A65]/10 text-[#B99A65] flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-[#8D8A84] font-medium block">
              {isRtl ? 'إجمالي الردود المسجلة' : 'Total Responses'}
            </span>
            <span className="font-playfair text-3xl font-bold text-[#F7F4EE]">
              {rsvps.length}
            </span>
          </div>

          <div className="bg-[#1F1E1B] border border-emerald-500/30 rounded-2xl p-5 text-center shadow-lg space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-emerald-400 font-medium block">
              {isRtl ? 'الحضور المؤكد (أفراد)' : 'Confirmed Heads'}
            </span>
            <span className="font-playfair text-3xl font-bold text-emerald-400">
              {totalHeadsAttending}
            </span>
            <span className="text-[10px] text-[#8D8A84] block">
              ({attendingList.length} {isRtl ? 'دعوة مقبولة' : 'invitations'})
            </span>
          </div>

          <div className="bg-[#1F1E1B] border border-red-500/30 rounded-2xl p-5 text-center shadow-lg space-y-1">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-red-400 font-medium block">
              {isRtl ? 'المعتذرون عن الحضور' : 'Declined'}
            </span>
            <span className="font-playfair text-3xl font-bold text-red-400">
              {declinedList.length}
            </span>
          </div>

          <div className="bg-[#1F1E1B] border border-pink-500/30 rounded-2xl p-5 text-center shadow-lg space-y-1">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center mx-auto mb-2">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-pink-400 font-medium block">
              {isRtl ? 'رسائل التهاني والتبريكات' : 'Wishes & Greetings'}
            </span>
            <span className="font-playfair text-3xl font-bold text-pink-400">
              {wishesList.length}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#333] pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'rsvps'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#333]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isRtl ? 'كشف وتأكيدات الحضور' : 'RSVP Attendance List'}</span>
            <span className="text-[10px] opacity-80">({rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishes')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'wishes'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#333]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>{isRtl ? 'رسائل التهنئة والتبريكات 💌' : 'Wishes & Guestbook 💌'}</span>
            <span className="text-[10px] opacity-80">({wishesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vip_links')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'vip_links'
                ? 'bg-[#B99A65] text-[#171717] shadow-lg'
                : 'bg-[#1F1E1B] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#333]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>{isRtl ? 'إنشاء روابط VIP بأسماء المعازيم 👑' : 'VIP Personalized Links 👑'}</span>
          </button>
        </div>

        {/* TAB 1: RSVPS */}
        {activeTab === 'rsvps' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8D8A84] absolute right-3 top-3 rtl:right-3 rtl:left-auto" />
                <input
                  type="text"
                  placeholder={isRtl ? 'ابحث باسم الضيف أو رقم الهاتف...' : 'Search guest or phone...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#171717] border border-[#333] rounded-xl pr-9 pl-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {(['all', 'attending', 'declined', 'maybe'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === filter
                        ? 'bg-[#B99A65] text-[#171717]'
                        : 'bg-[#171717] text-[#8D8A84] hover:text-[#F7F4EE] border border-[#333]'
                    }`}
                  >
                    {filter === 'all' && (isRtl ? 'الكل' : 'All')}
                    {filter === 'attending' && (isRtl ? 'المؤكدين' : 'Attending')}
                    {filter === 'declined' && (isRtl ? 'المعتذرين' : 'Declined')}
                    {filter === 'maybe' && (isRtl ? 'ربما' : 'Maybe')}
                  </button>
                ))}

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#B99A65] text-[#171717] text-xs font-bold uppercase hover:bg-[#d6bd91] flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isRtl ? 'إضافة ضيف' : 'Add Guest'}</span>
                </button>
              </div>
            </div>

            {/* Guests Table */}
            <div className="bg-[#1F1E1B] border border-[#333] rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#171717] text-[#8D8A84] border-b border-[#333] uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">{isRtl ? 'اسم الضيف' : 'Guest Name'}</th>
                      <th className="p-4">{isRtl ? 'الحالة' : 'Status'}</th>
                      <th className="p-4">{isRtl ? 'عدد الأفراد' : 'Count'}</th>
                      <th className="p-4">{isRtl ? 'المرافق (+1)' : 'Plus One'}</th>
                      <th className="p-4">{isRtl ? 'رقم الهاتف' : 'Phone'}</th>
                      <th className="p-4">{isRtl ? 'ملاحظات الوجبات' : 'Dietary Notes'}</th>
                      <th className="p-4">{isRtl ? 'تاريخ التأكيد' : 'Timestamp'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2926]">
                    {filteredRSVPs.length > 0 ? (
                      filteredRSVPs.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-[#252420] transition-colors">
                          <td className="p-4 font-semibold text-[#F7F4EE]">
                            {rsvp.guestName}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                rsvp.status === 'attending'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : rsvp.status === 'declined'
                                  ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {rsvp.status === 'attending' && <CheckCircle className="w-3 h-3" />}
                              {rsvp.status === 'declined' && <XCircle className="w-3 h-3" />}
                              {rsvp.status === 'maybe' && <Clock className="w-3 h-3" />}
                              <span>
                                {rsvp.status === 'attending'
                                  ? isRtl ? 'مؤكد الحضور' : 'Attending'
                                  : rsvp.status === 'declined'
                                  ? isRtl ? 'معتذر' : 'Declined'
                                  : isRtl ? 'ربما' : 'Maybe'}
                              </span>
                            </span>
                          </td>
                          <td className="p-4 text-[#F7F4EE] font-bold">
                            {rsvp.guestCount || 1}
                          </td>
                          <td className="p-4 text-[#8D8A84]">
                            {rsvp.plusOneName || '—'}
                          </td>
                          <td className="p-4 text-[#8D8A84] font-mono">
                            {rsvp.phone || '—'}
                          </td>
                          <td className="p-4 text-[#8D8A84] max-w-xs truncate">
                            {rsvp.dietaryNotes ? (
                              <span className="inline-flex items-center gap-1 text-amber-300">
                                <Utensils className="w-3 h-3" />
                                <span>{rsvp.dietaryNotes}</span>
                              </span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="p-4 text-[#8D8A84] text-[11px]">
                            {new Date(rsvp.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-[#8D8A84]">
                          {isRtl ? 'لا توجد ردود مطابقة للبحث' : 'No matching RSVP responses found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GUEST WISHES & CONGRATULATIONS */}
        {activeTab === 'wishes' && (
          <div className="space-y-4">
            <div className="bg-[#1F1E1B] border border-[#333] p-5 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-lg font-bold text-[#F7F4EE]">
                  {isRtl ? 'رسائل التهاني والتبريكات من المعازيم 💌' : 'Guestbook Congratulations'}
                </h3>
                <p className="text-xs text-[#8D8A84]">
                  {isRtl
                    ? 'جميع الكلمات الطيبة والدعوات التي أرسلها المعازيم والأحباب'
                    : 'Heartfelt wishes and blessings shared by your guests'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 font-bold text-xs">
                {wishesList.length} {isRtl ? 'رسالة' : 'Wishes'}
              </span>
            </div>

            {wishesList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {wishesList.map((wish, idx) => (
                  <div
                    key={wish.id || idx}
                    className="bg-[#1F1E1B] border border-[#333] hover:border-[#B99A65]/50 rounded-2xl p-5 space-y-3 shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#B99A65]/20 text-[#B99A65] flex items-center justify-center font-bold text-xs">
                          {wish.authorName.charAt(0)}
                        </div>
                        <span className="font-bold text-[#F7F4EE]">{wish.authorName}</span>
                      </div>
                      <span className="text-[10px] text-[#8D8A84]">
                        {wish.createdAt ? new Date(wish.createdAt).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US') : ''}
                      </span>
                    </div>

                    <p className="text-xs text-[#E9E1D5] leading-relaxed italic bg-[#171717] p-3 rounded-xl border border-[#2a2926]">
                      "{wish.message}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#1F1E1B] border border-[#333] rounded-2xl p-12 text-center text-[#8D8A84] space-y-2">
                <Heart className="w-10 h-10 text-[#8D8A84]/40 mx-auto" />
                <p className="text-sm font-semibold">{isRtl ? 'لم تصل أي رسائل تهنئة بعد' : 'No congratulations submitted yet'}</p>
                <p className="text-xs">{isRtl ? 'ستظهر هنا رسائل وتبريكات المعازيم فور إرسالها من صفحة الدعوة' : 'Guest messages will appear here once submitted'}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VIP PERSONALIZED LINKS */}
        {activeTab === 'vip_links' && (
          <div className="max-w-2xl mx-auto bg-[#1F1E1B] border border-[#B99A65]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1 border-b border-[#333] pb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#B99A65]" />
                <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
                  {isRtl ? 'مولّد روابط المعازيم الملكية (Personalized VIP Links)' : 'Personalized VIP Guest Link Generator'}
                </h3>
              </div>
              <p className="text-xs text-[#8D8A84]">
                {isRtl
                  ? 'قم بكتابة اسم الضيف لإنشاء رابط مخصص يرحب به بالاسم عند فتح الدعوة (مثال: أهلاً بك معالي المستشار محمد)'
                  : 'Generate custom links that greet each guest by their title and name.'}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#B99A65] mb-1">
                  {isRtl ? 'اسم الضيف مع اللقب التكريمي *' : 'Guest Name & Title *'}
                </label>
                <input
                  type="text"
                  value={vipGuestName}
                  onChange={(e) => setVipGuestName(e.target.value)}
                  placeholder={isRtl ? 'مثال: سعادة المستشار عبد الرحمن الشمري' : 'e.g. Dr. Arthur Pendelton'}
                  className="w-full bg-[#171717] border border-[#333] rounded-xl px-4 py-3 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateVipLink}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B99A65] to-[#d6bd91] text-[#171717] font-bold text-xs uppercase hover:shadow-[0_0_15px_rgba(185,154,101,0.3)] transition-all cursor-pointer"
              >
                {isRtl ? 'توليد الرابط الملكي المخصص 👑' : 'Generate Custom VIP Link 👑'}
              </button>

              {generatedVipLink && (
                <div className="mt-4 p-4 rounded-2xl bg-[#171717] border border-[#B99A65]/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'الرابط جاهز للإرسال:' : 'Link ready for sharing:'}</span>
                    </span>
                    <span className="font-mono text-[#8D8A84] text-[10px]">{vipGuestName}</span>
                  </div>

                  <div className="p-3 bg-[#121212] rounded-xl border border-[#333] font-mono text-xs text-[#B99A65] break-all select-all">
                    {generatedVipLink}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyVipLink}
                      className="flex-1 py-2.5 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#d6bd91] transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedVipLink ? (isRtl ? 'تم نسخ الرابط بنجاح ✅' : 'Copied!') : (isRtl ? 'نسخ الرابط المخصص' : 'Copy VIP Link')}</span>
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        (isRtl ? `يشرفنا ويسعدنا دعوتكم الكريمة:\n${generatedVipLink}` : `You are cordially invited:\n${generatedVipLink}`)
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500 transition-all cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{isRtl ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Add Manual Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#1F1E1B] border border-[#B99A65] rounded-3xl p-6 shadow-2xl space-y-4 text-right">
            <h3 className="font-playfair text-xl font-bold text-[#F7F4EE]">
              {isRtl ? 'إضافة ضيف يدوياً للقائمة' : 'Add Guest to List'}
            </h3>
            <form onSubmit={handleAddManualGuest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#B99A65] mb-1">
                  {isRtl ? 'اسم الضيف *' : 'Guest Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isRtl ? 'مثال: عبد العزيز الشمري' : 'e.g. John Doe'}
                  className="w-full bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                    {isRtl ? 'رقم الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+966..."
                    className="w-full bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                    {isRtl ? 'حالة الحضور' : 'Status'}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                  >
                    <option value="attending">{isRtl ? 'مؤكد الحضور' : 'Attending'}</option>
                    <option value="declined">{isRtl ? 'معتذر' : 'Declined'}</option>
                    <option value="maybe">{isRtl ? 'ربما' : 'Maybe'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                    {isRtl ? 'عدد الأفراد' : 'Guest Count'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newCount}
                    onChange={(e) => setNewCount(Number(e.target.value))}
                    className="w-full bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                    {isRtl ? 'اسم المرافق' : 'Plus One'}
                  </label>
                  <input
                    type="text"
                    value={newPlusOne}
                    onChange={(e) => setNewPlusOne(e.target.value)}
                    className="w-full bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8D8A84] mb-1">
                  {isRtl ? 'ملاحظات وجبات خاصة' : 'Dietary Notes'}
                </label>
                <input
                  type="text"
                  value={newDietary}
                  onChange={(e) => setNewDietary(e.target.value)}
                  placeholder={isRtl ? 'مثال: وجبة نباتية أو حساسية مكسرات' : 'e.g. Vegetarian'}
                  className="w-full bg-[#171717] border border-[#333] rounded-xl px-3 py-2 text-xs text-[#F7F4EE] focus:outline-none focus:border-[#B99A65]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#333] text-xs text-[#8D8A84] hover:text-[#F7F4EE]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B99A65] text-[#171717] font-bold text-xs uppercase hover:bg-[#d6bd91]"
                >
                  {isRtl ? 'حفظ الضيف' : 'Save Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
