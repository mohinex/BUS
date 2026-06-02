import React, { useState } from 'react';
import { DonationLog, Language } from '../types';
import { 
  Heart, Landmark, Smartphone, Users, CheckCircle2, Award, ClipboardCheck, ArrowRight, 
  ShieldCheck, Coins, BookOpen, CreditCard, Search, Printer, Download, Eye, HelpCircle, 
  RefreshCw, Check, Info, ShieldAlert, FileText 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SVGEmblem from './SVGEmblem';

interface DonateProps {
  language: Language;
  donations: DonationLog[];
  onDonateSubmit: (donationData: any) => Promise<{ success: boolean; donation: DonationLog; error?: string }>;
  onVolunteerSubmit: (volData: any) => Promise<{ success: boolean; error?: string }>;
}

const FUNDS = [
  { id: 'Scholarship', title: 'Education Scholarship Trust', titleBn: 'শিক্ষাবৃত্তি ও ট্রাস্ট তহবিল', target: 500050, current: 425000, color: 'blue' },
  { id: 'Medical', title: 'Free Medical Camps & Medicine', titleBn: 'বিনামূল্যে চিকিৎসা ও ক্যাম্প তহবিল', target: 300050, current: 220000, color: 'emerald' },
  { id: 'Relief', title: 'Emergency Calamity & Disaster Relief', titleBn: 'জরুরি ত্রাণ ও দুর্যোগ কল্যাণ তহবিল', target: 400050, current: 250000, color: 'rose' }
];

const PAYMENT_METHODS = [
  { id: 'bKash', label: 'bKash (বিকাশ)', color: 'bg-pink-600', icon: 'MFS' },
  { id: 'Nagad', label: 'Nagad (নগদ)', color: 'bg-orange-500', icon: 'MFS' },
  { id: 'Rocket', label: 'Rocket (রকেট)', color: 'bg-violet-700', icon: 'MFS' },
  { id: 'Bank', label: 'Bank Transfer (ব্যাংক ট্রান্সফার)', color: 'bg-teal-600', icon: 'Bank' },
  { id: 'Card', label: 'Credit / Debit Card (ক্রেডিট/ডেবিট কার্ড)', color: 'bg-blue-600', icon: 'Card' }
];

// DONATION SECTION WITH SIMULATED SECURE GATEWAY CHECKOUTS
export function DonationWelfareView({ language, donations, onDonateSubmit }: { language: Language; donations: DonationLog[]; onDonateSubmit: any }) {
  const isBn = language === 'bn';
  
  // Tab control: 'donate' or 'lookup'
  const [activeTab, setActiveTab] = useState<'donate' | 'lookup'>('donate');

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', amount: '', paymentMethod: 'bKash' as any, isAnonymous: false, message: '', referenceNo: 'Hospitality support'
  });
  const [selectedFund, setSelectedFund] = useState('Scholarship');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'mfs_input' | 'card_input' | 'card_3ds' | 'bank_input' | 'processing' | 'receipt'>('form');
  const [generatedTrx, setGeneratedTrx] = useState<any | null>(null);
  
  // Custom interactive payment gateway states
  const [mfsPhone, setMfsPhone] = useState('');
  const [mfsPin, setMfsPin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [mfsOtp, setMfsOtp] = useState('');

  // Card specific details
  const [cardData, setCardData] = useState({
    number: '', name: '', expiry: '', cvc: ''
  });
  const [cardFocused, setCardFocused] = useState<'number' | 'name' | 'expiry' | 'cvc'>('number');
  const [cardOtp, setCardOtp] = useState('');
  const [cardOtpError, setCardOtpError] = useState('');

  // Bank Specific Details
  const [bankSenderInfo, setBankSenderInfo] = useState({
    senderBank: 'Dutch-Bangla Bank PLC.',
    senderAccount: '',
    senderName: '',
    bankTrxRef: ''
  });

  // Receipt Search / Lookup States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [viewingReceiptModal, setViewingReceiptModal] = useState<any | null>(null);

  const activeFund = FUNDS.find(f => f.id === selectedFund) || FUNDS[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFundSelect = (id: string) => {
    setSelectedFund(id);
  };

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    setCardData({ ...cardData, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length > 2) {
      formatted = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardData({ ...cardData, expiry: formatted });
  };

  const getCardBrand = (num: string) => {
    const cleanNum = num.replace(/\s/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (cleanNum.startsWith('5')) return 'Mastercard';
    if (cleanNum.startsWith('3')) return 'American Express';
    if (cleanNum.startsWith('6')) return 'UnionPay';
    return 'Credit Card';
  };

  const handleStartDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      alert(isBn ? 'দয়া করে সঠিক অনুদানের পরিমাণ লিখুন।' : 'Please enter a valid donation value.');
      return;
    }

    if (['bKash', 'Nagad', 'Rocket'].includes(formData.paymentMethod)) {
      setCheckoutStep('mfs_input');
    } else if (formData.paymentMethod === 'Card') {
      setCheckoutStep('card_input');
    } else if (formData.paymentMethod === 'Bank') {
      setCheckoutStep('bank_input');
    } else {
      triggerSubmit({});
    }
  };

  const triggerSubmit = async (additionalMeta: any) => {
    setCheckoutStep('processing');
    try {
      const payload = {
        ...formData,
        referenceNo: isBn ? activeFund.titleBn : activeFund.title,
        amount: Number(formData.amount),
        ...additionalMeta
      };
      
      const resp = await onDonateSubmit(payload);
      if (resp.success) {
        setGeneratedTrx(resp.donation);
        setCheckoutStep('receipt');
        
        // Add to fund metric local copy
        activeFund.current += Number(formData.amount);
        
        // Reset inputs
        setFormData({ name: '', phone: '', email: '', amount: '', paymentMethod: 'bKash', isAnonymous: false, message: '', referenceNo: 'Hospitality support' });
        setMfsPhone('');
        setMfsPin('');
        setOtpSent(false);
        setMfsOtp('');
        setCardData({ number: '', name: '', expiry: '', cvc: '' });
        setBankSenderInfo({ senderBank: 'Dutch-Bangla Bank PLC.', senderAccount: '', senderName: '', bankTrxRef: '' });
      } else {
        alert(resp.error || "Submitting error");
        setCheckoutStep('form');
      }
    } catch (err: any) {
      alert(err.message);
      setCheckoutStep('form');
    }
  };

  const handleMfsSubmit = () => {
    if (!mfsPhone || !mfsPin) return;
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    if (!mfsOtp) return;
    
    triggerSubmit({
      gateway: 'SSLCommerz (MFS)',
      senderAccount: mfsPhone,
      trxId: `MFS-${formData.paymentMethod.toUpperCase()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
    });
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvc) {
      alert(isBn ? 'দয়া করে সব কার্ডের তথ্য সঠিক উপায়ে লিখুন।' : 'Fill out all card fields.');
      return;
    }
    setCheckoutStep('card_3ds');
    setCardOtpError('');
  };

  const handleCard3DsConfirm = () => {
    if (!cardOtp) {
      setCardOtpError(isBn ? 'দয়া করে সিকিউরিটি কোড লিখুন।' : 'Enter secure validation OTP.');
      return;
    }
    
    const brand = getCardBrand(cardData.number);
    const last4 = cardData.number.slice(-4);
    triggerSubmit({
      gateway: 'Stripe Secure',
      cardLast4: last4,
      cardBrand: brand,
      trxId: `STR-${brand.toUpperCase().substring(0,3)}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
    });
  };

  const handleBankConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankSenderInfo.senderAccount || !bankSenderInfo.senderName) {
      alert(isBn ? 'প্রেরক হিসেব এবং অ্যাকাউন্টের নাম আবশ্যক।' : 'Account number and sender name are required.');
      return;
    }
    
    triggerSubmit({
      gateway: 'Direct Net Banking',
      bankName: bankSenderInfo.senderBank,
      senderAccount: bankSenderInfo.senderAccount,
      trxId: bankSenderInfo.bankTrxRef || `EFT-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
    });
  };

  const handleReceiptSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    setSearchResults([]);

    try {
      const resp = await fetch(`/api/receipt/search?q=${encodeURIComponent(searchQuery.trim())}`);
      const data = await resp.json();
      if (data.success) {
        setSearchResults(data.results || []);
        if (data.results.length === 0) {
          setSearchError(isBn ? 'কোন অনুদানের তথ্য পাওয়া যায়নি।' : 'No donation matches found in our registry.');
        }
      } else {
        setSearchError(data.error || 'Query lookup failed.');
      }
    } catch {
      setSearchError('Network failure query.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        @media print {
          body * { visibility: hidden; }
          .printable-receipt-area, .printable-receipt-area * { visibility: visible; }
          .printable-receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .non-printable { display: none !important; }
        }
      `}</style>

      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-xl mx-auto non-printable">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-dark-blue font-sans tracking-tight">
          {isBn ? 'স্মার্ট কল্যাণ ও অনুদান পোর্টাল' : 'Smart Donation & Welfare Port'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
          {isBn
            ? 'বালিয়াকান্দি সমিতির শিক্ষাবৃত্তি, বিনামূল্যে চক্ষু অপারেশন ও জরুরি ত্রাণ তহবিলে সরাসরি যুক্ত হোন। আপনার প্রতিটি লেনদেন নিশ্চিত করে ডিজিটাল রসিদ।'
            : 'Explore secure, audited donation flows. Invest directly in local Upazila scholarships, free eye clinics, and crisis shields with automated receipts.'}
        </p>

        {/* Toggle navigation for donation vs. lookup */}
        <div className="flex justify-center pt-2">
          <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('donate')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'donate'
                  ? 'bg-white text-dark-blue shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              {isBn ? 'অনুদান প্রদান' : 'Make Donation'}
            </button>
            <button
              onClick={() => {
                setActiveTab('lookup');
                setSearchError('');
                setSearchResults([]);
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'lookup'
                  ? 'bg-white text-dark-blue shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              {isBn ? 'রসিদ অনুসন্ধান' : 'Receipt Verification'}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'donate' ? (
        <div className="space-y-8 non-printable">
          {/* Funds metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FUNDS.map(fund => {
              const isSelected = selectedFund === fund.id;
              const percent = Math.min(100, Math.round((fund.current / fund.target) * 100));
              return (
                <div
                  key={fund.id}
                  onClick={() => handleFundSelect(fund.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-primary-blue bg-blue-50/25 shadow-sm'
                      : 'border-slate-200 hover:border-slate-350 bg-white'
                  }`}
                >
                  <div className="space-y-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      fund.color === 'blue' ? 'bg-blue-100 text-primary-blue' :
                      fund.color === 'emerald' ? 'bg-emerald-100 text-brand-green' : 'bg-rose-100 text-rose-650'
                    }`}>
                      {isBn ? 'বাৎসরিক লক্ষ্যভিত্তিক খাত' : 'Target Trust Fund'}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-snug">
                      {isBn ? fund.titleBn : fund.title}
                    </h4>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex justify-between text-[11px] text-slate-600 font-sans">
                        <span>{isBn ? "সংগৃহীত তহবিল:" : "Collected:"}</span>
                        <span className="font-bold text-dark-blue">
                          ৳{fund.current.toLocaleString()} / ৳{fund.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          fund.color === 'blue' ? 'bg-primary-blue' :
                          fund.color === 'emerald' ? 'bg-brand-green' : 'bg-rose-600'
                        }`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 text-blue-100/40 rounded-bl-full flex items-center justify-end p-4">
                <Coins className="w-12 h-12" />
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-105 pb-3.5 mb-6 font-sans">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                {isBn ? fundActiveTitleBn(selectedFund) : activeFund.title}
              </h3>

              <AnimatePresence mode="wait">
                {checkoutStep === 'form' && (
                  <motion.form
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleStartDonate}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'দাতার পুরো নাম' : 'Donor Full Name'}</label>
                        <input
                          type="text"
                          name="name"
                          placeholder={isBn ? 'মোঃ আশরাফুল ইসলাম (বা খালি রাখুন)' : 'Full Name (or leave empty)'}
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-slate-250 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'রসিদের জন্য মোবাইল নম্বর' : 'Phone Number (for Receipt/SMS)'}</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+8801XXXXXXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-slate-250 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="donor@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-slate-250 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'অনুদানের পরিমাণ (টাকা)*' : 'Donation Amount (BDT)*'}</label>
                        <input
                          required
                          type="number"
                          name="amount"
                          placeholder="5000"
                          min="10"
                          value={formData.amount}
                          onChange={handleInputChange}
                          className="w-full p-2.5 border border-slate-250 rounded-xl font-bold font-mono text-dark-blue text-sm"
                        />
                      </div>
                    </div>

                    <div className="text-xs font-sans">
                      <label className="block text-slate-600 mb-2.5 font-semibold">
                        {isBn ? 'নিরাপদ গেটওয়ে পেমেন্ট চ্যানেল চয়ন করুন' : 'Select Secure Payment Gateway'}
                        <span className="ml-1 text-[10px] text-brand-green font-medium">(SSLCommerz & Stripe Integrated)</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {PAYMENT_METHODS.map(pm => (
                          <label key={pm.id} className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                            formData.paymentMethod === pm.id ? 'border-primary-blue bg-blue-50/40 text-primary-blue font-bold shadow-sm' : 'border-slate-200 hover:border-slate-350 bg-slate-50/50'
                          }`}>
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={pm.id}
                              checked={formData.paymentMethod === pm.id}
                              onChange={handleInputChange}
                              className="text-primary-blue focus:ring-primary-blue"
                            />
                            <div className="flex flex-col">
                              <span className="text-[10px] leading-tight shrink-0 font-sans">{pm.label}</span>
                              <span className="text-[8px] opacity-65 font-mono">{pm.icon === 'MFS' ? 'Mobile Banking' : pm.icon}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs font-sans">
                      <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'দোয়া / সংক্ষিপ্ত শুভকামনা' : 'Message of Wellwisher (Wishes)'}</label>
                      <textarea
                        name="message"
                        rows={2}
                        placeholder={isBn ? 'সমিতির সর্বাঙ্গীন মঙ্গল কামনা করছি...' : 'Write messages or dedications here...'}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full p-2.5 border border-slate-250 rounded-xl"
                      />
                    </div>

                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        name="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                        className="rounded border-slate-300 text-primary-blue focus:ring-primary-blue w-4 h-4"
                      />
                      <span className="text-xs text-slate-500 font-medium">
                        {isBn ? 'ডোনার ওয়ালে আমার নামটি প্রকাশ করবেন না (Anonymous Donor)' : 'Keep my identity anonymous on the public donor page'}
                      </span>
                    </label>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-gradient-official text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-md text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <span>{isBn ? 'নিরাপদ পেমেন্ট ধাপে যান' : 'Proceed to Gateway'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* Secure Visual Card Checkout (Stripe style) */}
                {checkoutStep === 'card_input' && (
                  <motion.form
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleCardSubmit}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1 text-slate-705 text-xs font-bold">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Stripe Core Secure Interface</span>
                      </div>
                      <button type="button" onClick={() => setCheckoutStep('form')} className="text-xs text-slate-400 hover:text-slate-600">
                        {isBn ? 'ফিরে যান' : 'Change Channel'}
                      </button>
                    </div>

                    <div className="w-full max-w-sm mx-auto perspective-1000 select-none">
                      <div className={`relative w-full h-44 rounded-3xl shadow-xl transition-all duration-500 transform-style-3d ${
                        cardFocused === 'cvc' ? 'rotate-y-180' : ''
                      } bg-gradient-to-br from-slate-900 via-slate-805 to-indigo-950 text-white font-mono`}>
                        
                        {/* Front face of Card */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-between backface-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[7px] uppercase tracking-widest opacity-60">Baliakandi Samity Welfare Card</span>
                              <div className="w-8 h-6 bg-amber-400/80 rounded mt-1" />
                            </div>
                            <span className="font-extrabold text-xs text-amber-200">{getCardBrand(cardData.number)}</span>
                          </div>
                          
                          <div className="text-base tracking-[0.18em] text-center font-bold py-1">
                            {cardData.number || '•••• •••• •••• ••••'}
                          </div>
                          
                          <div className="flex justify-between text-[10px]">
                            <div>
                              <div className="text-[6px] opacity-50 uppercase">Cardholder</div>
                              <div className="font-bold truncate max-w-[120px] uppercase">{cardData.name || 'YOUR NAME'}</div>
                            </div>
                            <div>
                              <div className="text-[6px] opacity-50 uppercase">Expires</div>
                              <div className="font-bold">{cardData.expiry || 'MM/YY'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Back face of Card */}
                        <div className="absolute inset-x-0 inset-y-0 rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 backface-hidden rotate-y-180 py-4 flex flex-col justify-between">
                          <div className="w-full h-8 bg-black/95" />
                          <div className="px-5 space-y-2">
                            <div className="flex items-center justify-end bg-slate-200 h-7 rounded text-black text-right pr-2.5 font-semibold text-xs italic relative">
                              <span className="absolute left-1 text-[7px] text-slate-505 font-sans tracking-tight">Security CVC</span>
                              {cardData.cvc || '•••'}
                            </div>
                            <p className="text-[5.5px] text-slate-400 leading-normal">
                              Sandbox simulated credit gateway module. Never enter credentials containing real funds. Protected by AES-256 standard.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'কার্ড নম্বর' : 'Card Number'}</label>
                        <input
                          required
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          value={cardData.number}
                          onChange={handleCardNumberChange}
                          onFocus={() => setCardFocused('number')}
                          className="w-full p-2.5 border border-slate-250 rounded-xl font-bold font-mono text-dark-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'কার্ডধারীর নাম' : 'Cardholder Name'}</label>
                        <input
                          required
                          type="text"
                          placeholder="MD ASHRAFUL ISLAM"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          onFocus={() => setCardFocused('name')}
                          className="w-full p-2.5 border border-slate-250 rounded-xl uppercase font-bold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'মেয়াদ (MM/YY)' : 'Expiry (MM/YY)'}</label>
                          <input
                            required
                            type="text"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            onFocus={() => setCardFocused('expiry')}
                            className="w-full p-2.5 border border-slate-250 rounded-xl font-bold font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 mb-1 font-semibold">CVC/CVV</label>
                          <input
                            required
                            type="password"
                            placeholder="***"
                            maxLength={3}
                            value={cardData.cvc}
                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '') })}
                            onFocus={() => setCardFocused('cvc')}
                            className="w-full p-2.5 border border-slate-250 rounded-xl font-bold font-mono text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl flex items-center justify-center gap-1.5 transition-colors text-xs uppercase"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isBn ? `৳${formData.amount} নিরাপদ পেমেন্ট করুন` : `Pay BDT ${formData.amount} securely`}</span>
                    </button>
                  </motion.form>
                )}

                {/* 3DS Authentication dialog */}
                {checkoutStep === 'card_3ds' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-205 text-slate-800 space-y-4 max-w-sm mx-auto font-sans shadow-sm"
                  >
                    <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                      <div className="text-[10px] font-bold text-blue-800 uppercase flex items-center gap-1">
                        <LockSecureBadge />
                        <span>Verified 3D Secure</span>
                      </div>
                      <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-black">Stripe Check</span>
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-slate-400 text-[10px] uppercase tracking-wide">{isBn ? 'লেনদেন পেমেন্ট সার্টিফাইড' : 'Baliakandi Samiti Account'}</p>
                      <h4 className="font-extrabold text-xs text-slate-850">{isBn ? 'বালিয়াকান্দি উপজেলা সমিতি, ঢাকা' : 'Baliakandi Association Trust, Dhaka'}</h4>
                      <p className="font-black text-blue-600 text-base font-mono">BDT {formData.amount}.00</p>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                      <p className="leading-relaxed text-slate-600 font-medium">
                        {isBn 
                          ? 'আপনার ভার্চুয়াল মোবাইল নাম্বারে একটি ৬-ডিজিটের অনলাইন সিকিউরিটি কোড (OTP) পাঠানো হয়েছে।'
                          : 'A simulated 6-digit verification code has been dispatched via SMS.'}
                      </p>
                      <div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder={isBn ? 'কোড লিখুন (উদা_ ১২৩৪৫৬)' : 'Enter Code (e.g. 123456)'}
                          value={cardOtp}
                          onChange={(e) => setCardOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full p-2.5 rounded-xl border border-slate-350 font-bold font-mono tracking-[0.4em] text-center text-sm"
                        />
                        {cardOtpError && <p className="text-red-500 text-[10px] mt-1 font-semibold">{cardOtpError}</p>}
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-1.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('card_input')}
                        className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 py-2.5 rounded-xl text-xs font-bold transition-colors"
                      >
                        {isBn ? 'আগের ধাপে' : 'Back'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCard3DsConfirm}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-extrabold transition-colors uppercase"
                      >
                        {isBn ? 'নিশ্চিত করুন' : 'Verify'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Direct Bank Transfer portal detail panels */}
                {checkoutStep === 'bank_input' && (
                  <motion.form
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleBankConfirm}
                    className="space-y-4 text-xs font-sans text-slate-800"
                  >
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
                        <Landmark className="w-4 h-4 text-teal-600" />
                        <span>Direct Bank Wire / EFT Transfer</span>
                      </div>
                      <button type="button" onClick={() => setCheckoutStep('form')} className="text-xs text-slate-400 hover:text-slate-600">
                        {isBn ? 'ফিরে যান' : 'Cancel'}
                      </button>
                    </div>

                    <div className="bg-teal-50/50 border border-teal-100 p-4 rounded-2xl space-y-2 text-xs text-teal-850">
                      <h4 className="font-extrabold text-teal-900 uppercase tracking-wide">{isBn ? 'সমিতির অফিশিয়াল ব্যাংক হিসাব' : "Samiti Official Accounts Details"}</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5 border-t border-teal-100/50 leading-relaxed">
                        <div>
                          <span className="opacity-70 block text-[10px]">{isBn ? 'হিসাবের নাম:' : 'Account Title:'}</span>
                          <span className="font-extrabold text-[12px] block text-teal-950">Baliakandi Upazila Samity Dhaka</span>
                        </div>
                        <div>
                          <span className="opacity-70 block text-[10px]">{isBn ? 'অ্যাকাউন্ট নম্বর:' : 'Account No:'}</span>
                          <span className="font-extrabold text-[12px] font-mono block tracking-wider text-teal-950">102.120.459381.01</span>
                        </div>
                        <div>
                          <span className="opacity-70 block text-[10px]">{isBn ? 'ব্যাংকের নাম:' : 'Bank Name:'}</span>
                          <span className="font-extrabold text-[12px] block text-teal-950">Dutch-Bangla Bank PLC.</span>
                        </div>
                        <div>
                          <span className="opacity-70 block text-[10px]">{isBn ? 'রাউটিং নং ও শাখা:' : 'Routing & Branch:'}</span>
                          <span className="font-semibold text-[11px] block text-teal-900">Kawran Bazar Branch, Dhaka (090261432)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h5 className="font-bold text-slate-705 border-b border-slate-100 pb-1.5">{isBn ? 'আপনার প্রেরিত ব্যাংকিং লেনদেনের তথ্য নিশ্চিত করুন' : 'Confirm Your Sent Transactions Memo'}</h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'প্রেরক ব্যাংকের নাম*' : 'Your Bank Name*'}</label>
                          <select
                            required
                            value={bankSenderInfo.senderBank}
                            onChange={(e) => setBankSenderInfo({ ...bankSenderInfo, senderBank: e.target.value })}
                            className="w-full p-2.5 border border-slate-250 rounded-xl bg-white"
                          >
                            <option value="Dutch-Bangla Bank PLC.">Dutch-Bangla Bank PLC.</option>
                            <option value="Sonali Bank PLC.">Sonali Bank PLC.</option>
                            <option value="BRAC Bank PLC.">BRAC Bank PLC.</option>
                            <option value="Eastern Bank PLC.">Eastern Bank PLC.</option>
                            <option value="Dhaka Bank Ltd.">Dhaka Bank Ltd.</option>
                            <option value="City Bank PLC.">City Bank PLC.</option>
                            <option value="Islami Bank Bangladesh PLC.">Islami Bank Bangladesh PLC.</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'প্রেরক হিসাব নম্বর*' : 'Your Account Number*'}</label>
                          <input
                            required
                            type="text"
                            placeholder="120.151.XXXX"
                            value={bankSenderInfo.senderAccount}
                            onChange={(e) => setBankSenderInfo({ ...bankSenderInfo, senderAccount: e.target.value })}
                            className="w-full p-2.5 border border-slate-250 rounded-xl font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'অ্যাকাউন্ট হোল্ডারের নাম*' : 'Account Holder Name*'}</label>
                          <input
                            required
                            type="text"
                            placeholder="MD. ASHRAFUL ISLAM"
                            value={bankSenderInfo.senderName}
                            onChange={(e) => setBankSenderInfo({ ...bankSenderInfo, senderName: e.target.value })}
                            className="w-full p-2.5 border border-slate-250 rounded-xl uppercase font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'EFT / চেক স্লিপ রেফারেন্স*' : 'EFT / Check Reference*'}</label>
                          <input
                            required
                            type="text"
                            placeholder="EFT15903212"
                            value={bankSenderInfo.bankTrxRef}
                            onChange={(e) => setBankSenderInfo({ ...bankSenderInfo, bankTrxRef: e.target.value })}
                            className="w-full p-2.5 border border-slate-250 rounded-xl font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-colors text-xs uppercase"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isBn ? 'ব্যাংক ট্রান্সফার ডিপোজিট নিশ্চিত করুন' : 'Submit Deposit Reference Memo'}</span>
                    </button>
                  </motion.form>
                )}

                {/* MFS (bKash/Nagad/Rocket) checkout steps integration screen */}
                {checkoutStep === 'mfs_input' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`p-6 rounded-2xl text-white ${
                      formData.paymentMethod === 'bKash' ? 'bg-pink-600 bg-gradient-to-b from-pink-600 to-pink-700' : formData.paymentMethod === 'Nagad' ? 'bg-orange-500 bg-gradient-to-b from-orange-500 to-orange-600' : 'bg-indigo-700 bg-gradient-to-b from-indigo-700 to-indigo-800'
                    } max-w-sm mx-auto space-y-4 shadow-xl border border-white/10 font-sans`}
                  >
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="font-extrabold uppercase text-amber-300">{formData.paymentMethod} Secure Gateway</span>
                      <button type="button" onClick={() => setCheckoutStep('form')} className="p-1 hover:bg-white/15 rounded transition-colors">✕</button>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="text-[9px] opacity-75 uppercase">{isBn ? 'নিরাপদ দান' : 'Contribution Value'}</div>
                      <div className="text-2xl font-black font-mono">BDT {formData.amount}.00</div>
                      <div className="text-[9px] opacity-75">{activeFund.title}</div>
                    </div>

                    <div className="space-y-3 pt-1 text-xs">
                      {!otpSent ? (
                        <>
                          <div>
                            <label className="block text-[10px] opacity-85 font-extrabold mb-1">{isBn ? `আপনার ${formData.paymentMethod} ওয়ালেট মোবাইল নম্বর` : `${formData.paymentMethod} Wallet Mobile No`}</label>
                            <input
                              required
                              type="tel"
                              placeholder="017XXXXXXXX"
                              maxLength={11}
                              value={mfsPhone}
                              onChange={(e) => setMfsPhone(e.target.value.replace(/\D/g, ''))}
                              className="w-full p-2.5 rounded-xl border border-white/20 bg-black/25 text-white text-center font-bold text-sm tracking-widest placeholder:opacity-30 placeholder:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] opacity-85 font-extrabold mb-1">{isBn ? 'গোপন পিন কোড (Demo PIN)' : 'Enter PIN (Simulated Gateway)'}</label>
                            <input
                              required
                              type="password"
                              placeholder="****"
                              maxLength={5}
                              value={mfsPin}
                              onChange={(e) => setMfsPin(e.target.value.replace(/\D/g, ''))}
                              className="w-full p-2.5 rounded-xl border border-white/20 bg-black/25 text-white text-center font-bold text-sm tracking-widest placeholder:opacity-30 placeholder:text-white"
                            />
                          </div>

                          <div className="bg-black/15 p-2.5 rounded-lg text-[9.5px] text-white/70 font-light leading-relaxed">
                            {isBn
                              ? 'নিরাপত্তা বার্তা: এই গেটওয়েটি পেমেন্ট চ্যানেলের ডেমো সিমুলেশন। কোনো আসল চার্জ বা মোবাইল পিন ভ্যালিডেশন করা হবে না।'
                              : 'Security Notice: This client sandbox simulates SSLCommerz mobile integration securely. No authentic currency will be charged.'}
                          </div>

                          <button
                            type="button"
                            onClick={handleMfsSubmit}
                            disabled={mfsPhone.length < 11 || !mfsPin}
                            className="w-full bg-white hover:bg-slate-100 text-slate-800 disabled:opacity-50 font-extrabold py-3 rounded-xl shadow transition-colors text-xs uppercase"
                          >
                            {isBn ? 'পরবর্তী ধাপে যান (Verify OTP)' : 'Send Secure SMS OTP'}
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="bg-white/10 p-2.5 rounded-xl text-center space-y-1">
                            <span className="text-[10px] text-amber-200 font-bold">OTP Sent successfully to +88{mfsPhone}</span>
                            <p className="text-[9.5px] opacity-80">{isBn ? 'লেনদেন ইন্টিগ্রেট করতে ওটিপি কোড লিখুন' : 'Demo Code: Enter 123456 or any 6 digits'}</p>
                          </div>

                          <div>
                            <input
                              required
                              type="text"
                              placeholder="******"
                              maxLength={6}
                              value={mfsOtp}
                              onChange={(e) => setMfsOtp(e.target.value.replace(/\D/g, ''))}
                              className="w-full p-2.5 rounded-xl border border-white/20 bg-black/25 text-white text-center font-bold text-sm tracking-wider placeholder:opacity-30 placeholder:text-white"
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setOtpSent(false)}
                              className="flex-1 border border-white/20 text-white hover:bg-white/10 py-2 rounded-lg"
                            >
                              {isBn ? 'পুনরায় লিখুন' : 'Back'}
                            </button>
                            <button
                              type="button"
                              onClick={handleMfsSubmit}
                              disabled={mfsOtp.length < 4}
                              className="flex-1 bg-white hover:bg-slate-100 text-slate-800 font-extrabold py-2 rounded-lg uppercase"
                            >
                              {isBn ? 'নিশ্চিত করুন' : 'Confirm'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Loading / cryptographically securing ledger state animation */}
                {checkoutStep === 'processing' && (
                  <div className="py-16 text-center space-y-3 font-sans">
                    <div className="w-12 h-12 border-4 border-slate-205 border-t-primary-blue rounded-full animate-spin mx-auto" />
                    <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider animate-pulse">
                      {isBn ? 'SSLCommerz পেমেন্ট প্রসেস হচ্ছে...' : 'Stripe & SSLCommerz Routing secure handshakes...'}
                    </p>
                  </div>
                )}

                {/* Print Friendly Automated Receipts view */}
                {checkoutStep === 'receipt' && generatedTrx && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-1"
                  >
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-brand-green font-bold max-w-md mx-auto mb-6">
                      <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
                      <div>
                        <span className="block">{isBn ? 'অনুদানের অর্থ সফলভাবে গৃহীত হয়েছে!' : 'Welfare Contribution Approved!'}</span>
                        <span className="text-[10px] font-normal opacity-90 block">{isBn ? 'আপনার ডিজিটাল রসিদ স্বয়ংক্রিয়ভাবে জেনারেট হয়েছে।' : 'Digital receipt has been securely authorized.'}</span>
                      </div>
                    </div>
                    
                    {/* Render Receipt Certificate */}
                    <ReceiptCertificate receipt={generatedTrx} className="mx-auto" />

                    <div className="pt-5 flex gap-3 max-w-md mx-auto">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-705 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        {isBn ? 'রসিদ প্রিন্ট করুন' : 'Print Certificate'}
                      </button>
                      <button
                        onClick={() => setCheckoutStep('form')}
                        className="flex-1 bg-gradient-official text-white py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center justify-center gap-1 shadow cursor-pointer hover:opacity-90"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        {isBn ? 'আরেকবার দান' : 'Donate Again'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Public Donor wall ledger */}
            <div className="space-y-6 non-printable">
              <div className="bg-gradient-to-br from-dark-blue to-primary-blue text-white p-6 rounded-3xl shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full" />
                <h3 className="text-base sm:text-lg font-bold font-sans flex items-center gap-1.5 border-b border-white/10 pb-3 mb-4">
                  <Award className="text-yellow-400 w-5 h-5 fill-yellow-400" />
                  {isBn ? "সম্মানিত দানবীর তালিকা (Ledger)" : "Hall of Generous Donors"}
                </h3>

                {/* List */}
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {donations.map((don) => (
                    <div key={don.id} onClick={() => { if (don.trxId) setViewingReceiptModal(don); }} className="text-xs space-y-1 bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/5 font-sans transition-colors cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span className="font-bold truncate max-w-[155px]">
                          {don.isAnonymous ? (isBn ? 'নাম প্রকাশে অনিচ্ছুক' : 'Anonymous Wellwisher') : don.name}
                        </span>
                        <span className="font-black text-amber-300 font-mono">৳{don.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-white/70 italic line-clamp-1">"{don.message || 'May the community prosper.'}"</p>
                      
                      <div className="flex justify-between text-[9px] text-white/50 pt-1.5 border-t border-white/5">
                        <span className="truncate max-w-[130px] font-semibold">{don.referenceNo || 'Association Fund'}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-2.5 h-2.5 text-amber-305 text-emerald-300" />
                          {isBn ? 'রসিদ' : 'Receipt'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 text-xs font-sans text-slate-605 space-y-2.5 shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm mb-1">{isBn ? "অনুদানের হিসাব নিরীক্ষা" : "Secured Accounting Ledger"}</h4>
                <p className="leading-relaxed">
                  {isBn
                    ? "উপজেলা সমিতির সমাজকল্যাণ ট্রাস্টের যাবতীয় হিসাব নিবন্ধিত চার্টার্ড অ্যাকাউন্ট্যান্টস দ্বারা বাৎসরিক নিরীক্ষা সম্পন্ন করা হয় এবং সর্বসাধারণের জন্য প্রকাশ করা হয়।"
                    : "All donation receipts are tracked transparently. Periodic balances and audit files are processed openly by board executive officers."}
                </p>
                <div className="flex items-center gap-1.5 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 text-[10px] text-primary-blue font-bold">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verified Secure SSL/Stripe TLS v1.3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* RECEIPT LOOKUP PORTAL / SEARCH TAB */
        <div className="max-w-3xl mx-auto space-y-6 non-printable">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-sans">
            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-slate-850">{isBn ? 'ডিজিটাল রসিদ যাচাই ও অনুসন্ধান' : 'Online Document Verification Portal'}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                {isBn 
                  ? 'আপনার কোনো পূর্ববর্তী ট্রানজেকশন আইডি (TrxID), মোবাইল নাম্বার অথবা ইমেইল অ্যাড্রেস লিখে খোঁজ করুন এবং রসিদপত্র ডাউনলোড করুন।'
                  : 'Lookup and download historical donation certs by entering your TrxID, phone number, or donor email address.'}
              </p>
            </div>

            <form onSubmit={handleReceiptSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  required
                  type="text"
                  placeholder={isBn ? 'উদা_ MFS-BKASH-XXXX, অথবা ০১৭XXXXXXXX' : 'e.g. MFS-BKASH-XXXX, 01711223344, or email...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={searchLoading}
                className="bg-gradient-official text-white px-5 sm:px-7 rounded-xl text-xs font-bold font-sans hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow"
              >
                {searchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>{isBn ? 'অনুসন্ধান' : 'Search Documents'}</span>
              </button>
            </form>

            {searchError && (
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-2 text-xs text-orange-850">
                <Info className="w-5 h-5 shrink-0 text-orange-600" />
                <span>{searchError}</span>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center text-xs text-slate-500 font-sans font-bold text-slate-700">
                  <span>{isBn ? 'প্রাপ্ত মোট ফলাফল:' : 'Query hits found:'} {searchResults.length}</span>
                  <span className="text-brand-green">● Official Ledgers Synchronized</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-205 rounded-2xl bg-slate-50/50 overflow-hidden text-xs">
                  {searchResults.map((receipt) => (
                    <div key={receipt.id || receipt.trxId} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50 transition-colors">
                      <div className="space-y-1 font-sans">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                          <span>{receipt.isAnonymous ? (isBn ? 'নাম প্রকাশে অনিচ্ছুক (আজ্ঞাত)' : 'Anonymous Wellwisher') : receipt.name}</span>
                          <span className="text-[10px] bg-blue-105 text-primary-blue px-2 py-0.2 rounded font-mono font-black">{receipt.paymentMethod}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">TrxID: {receipt.trxId} | Base BDT: {receipt.amount} | Date: {receipt.date}</p>
                      </div>

                      <button
                        onClick={() => setViewingReceiptModal(receipt)}
                        className="bg-white hover:bg-slate-100 border border-slate-200 shadow-sm text-slate-700 py-1.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1 justify-center w-full sm:w-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary-blue" />
                        <span>{isBn ? 'রসিদপত্র দেখুন' : 'View receipt'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Viewing receipt modal popup detail viewport block */}
      {viewingReceiptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 non-printable">
              <span className="text-xs font-black text-dark-blue flex items-center gap-1.5 font-sans uppercase">
                <Check className="w-4 h-4 text-brand-green animate-pulse" />
                {isBn ? 'অফিশিয়াল ডিজিটাল রসিদ' : 'Verified Donation Certificate Ledger'}
              </span>
              <button
                onClick={() => setViewingReceiptModal(null)}
                className="text-xs text-slate-400 hover:text-slate-600 bg-slate-100/80 hover:bg-slate-200 p-1.5 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Receipt certificate standard rendering for Printing */}
            <div className="printable-receipt-area">
              <ReceiptCertificate receipt={viewingReceiptModal} />
            </div>

            <div className="flex gap-2.5 pt-2 non-printable">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-white hover:bg-slate-100 border border-slate-350 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-slate-705 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                {isBn ? 'রসিদ প্রিন্ট' : 'Print receipt'}
              </button>
              <button
                onClick={() => setViewingReceiptModal(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                {isBn ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================== DETAILED RECEIPT SUB-COMPONENT (PRINT-FRIENDLY) ================== */
interface CertificateProps {
  receipt: any;
  className?: string;
}

export function ReceiptCertificate({ receipt, className = '' }: CertificateProps) {
  const isBn = true; // Bilingual Bengali receipt official template
  const amountVal = Number(receipt.amount || 0);

  // Convert numbers to Words helper
  const getAmountInWords = (num: number) => {
    if (num === 500) return "পাঁচশত টাকা মাত্র (Five Hundred BDT Only)";
    if (num === 1000) return "এক হাজার টাকা মাত্র (One Thousand BDT Only)";
    if (num === 2000) return "দুই হাজার টাকা মাত্র (Two Thousand BDT Only)";
    if (num === 3000) return "তিন হাজার টাকা মাত্র (Three Thousand BDT Only)";
    if (num === 5000) return "পাঁচ হাজার টাকা মাত্র (Five Thousand BDT Only)";
    if (num === 10000) return "দশ হাজার টাকা মাত্র (Ten Thousand BDT Only)";
    if (num === 15000) return "পনেরো হাজার টাকা মাত্র (Fifteen Thousand BDT Only)";
    if (num === 20000) return "বিশ হাজার টাকা মাত্র (Twenty Thousand BDT Only)";
    if (num === 25000) return "পঁচিশ হাজার টাকা মাত্র (Twenty-Five Thousand BDT Only)";
    if (num === 50000) return "পঞ্চাশ হাজার টাকা মাত্র (Fifty Thousand BDT Only)";
    if (num === 100000) return "এক লক্ষ টাকা মাত্র (One Hundred Thousand BDT Only)";
    return num.toLocaleString('bn-BD') + " টাকা মাত্র (BDT " + num.toLocaleString('en-US') + " Only)";
  };

  return (
    <div className={`p-6 sm:p-8 rounded-2xl bg-white border-4 border-double border-primary-blue/30 relative overflow-hidden shadow-sm max-w-md w-full tracking-wide ${className}`}>
      {/* Background Watermark */}
      <div className="absolute inset-x-0 inset-y-0 opacity-[0.035] flex items-center justify-center pointer-events-none select-none scale-150">
        <SVGEmblem size={255} />
      </div>

      {/* Outer borders matching official layout */}
      <div className="absolute top-2 left-2 right-2 bottom-2 border border-slate-200 pointer-events-none rounded-xl" />

      {/* Certificate Content */}
      <div className="space-y-4 relative z-10 text-slate-800">
        
        {/* Header Block with Emblems */}
        <div className="flex flex-col items-center text-center space-y-1">
          <SVGEmblem size={65} />
          
          <div className="pt-1 select-none text-center">
            <h1 className="text-xs sm:text-sm font-extrabold text-blue-900 leading-tight uppercase font-sans tracking-wide">
              বালিয়াকান্দি উপজেলা সমিতি, ঢাকা
            </h1>
            <p className="text-[9.5px] font-black text-brand-green uppercase tracking-widest font-mono">
              Baliakandi Upazila Samity Dhaka, Bangladesh
            </p>
            <span className="text-[7.5px] text-slate-400 block font-sans">
              Estd: 2008 • Gov. Society Reg No: DHA-9284 / Tax Exempt Accredit
            </span>
          </div>
        </div>

        {/* Certificate Title Badge */}
        <div className="text-center py-1 bg-blue-50 border-t border-b border-primary-blue/20">
          <span className="text-[10px] font-black uppercase text-dark-blue tracking-[0.2em]">
            অনুদানের রসিদ • DONATION OFFICIAL RECEIPT
          </span>
        </div>

        {/* Audit Details */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[9px] text-slate-600 font-sans border-b border-slate-105 pb-2.5">
          <div>
            <span className="opacity-70 block">রসিদ নম্বর (Invoice No):</span>
            <span className="font-bold text-slate-800 font-mono">BUSD-{receipt.id || 'REC-WELF'}</span>
          </div>
          <div>
            <span className="opacity-70 block">তারিখ (Charge Date):</span>
            <span className="font-bold text-slate-800 font-mono">{receipt.date || '2026-06-01'}</span>
          </div>
          <div>
            <span className="opacity-70 block">পেমেন্ট গেটওয়ে (Channel):</span>
            <span className="font-bold text-primary-blue font-mono flex items-center gap-1 uppercase">
              <ShieldCheck className="w-3 h-3 text-brand-green" />
              {receipt.paymentMethod} {receipt.gateway ? `(${receipt.gateway})` : ''}
            </span>
          </div>
          <div>
            <span className="opacity-70 block">ট্রানজেকশন আইডি (TrxID):</span>
            <span className="font-bold text-brand-green font-mono tracking-wider">{receipt.trxId || 'N/A'}</span>
          </div>
        </div>

        {/* Donor Statement Profile Block */}
        <div className="space-y-4 font-sans py-1.5 border-b border-slate-100">
          
          <div className="space-y-1.5 text-xs">
            <p className="leading-relaxed">
              <span className="text-slate-500">{isBn ? 'সম্মানিত দাতার নাম (Donor Name):' : 'Donor Name:'}</span>
              <strong className="block text-slate-800 text-sm font-extrabold uppercase pt-0.5">
                {receipt.isAnonymous ? 'আজ্ঞাত দানবীর (Anonymous Wellwisher)' : receipt.name}
              </strong>
            </p>

            <div className="grid grid-cols-2 gap-x-2 text-[10px] text-slate-600 font-sans">
              <p>
                <span className="opacity-70">{isBn ? 'মোবাইল (Phone):' : 'Phone:'}</span>
                <span className="block font-semibold font-mono text-slate-800">{receipt.phone || 'N/A'}</span>
              </p>
              <p>
                <span className="opacity-70">{isBn ? 'ইমেইল (Email):' : 'Email Address:'}</span>
                <span className="block font-semibold text-slate-800 truncate">{receipt.email || 'N/A'}</span>
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-205 rounded-xl space-y-1.5 text-xs">
            <div className="flex justify-between items-center bg-white p-1 px-2 rounded-lg border border-slate-100">
              <span className="text-slate-500 font-semibold text-[10px] uppercase">{isBn ? 'অনুদানের পরিমাণ' : 'Welfare Contribution'}</span>
              <h3 className="font-extrabold text-blue-800 text-sm font-mono">BDT {amountVal.toLocaleString()}.00</h3>
            </div>
            
            <p className="text-[10px] leading-relaxed">
              <span className="text-slate-400 block">{isBn ? 'টাকা কথায় (In Words):' : 'In Words:'}</span>
              <span className="font-bold text-slate-700 italic block">{getAmountInWords(amountVal)}</span>
            </p>

            <div className="text-[9.5px] border-t border-slate-100 pt-1.5 flex justify-between gap-1 items-start leading-snug">
              <div>
                <span className="text-slate-400 block text-[8px]">{isBn ? 'বরাদ্দকৃত ওয়েলফেয়ার ফান্ড খাত:' : 'Welfare Allocation Fund:'}</span>
                <strong className="text-slate-700 font-sans text-xs">{receipt.referenceNo || 'Association Scholarship and Trust Funds'}</strong>
              </div>
              <span className="bg-green-105 text-brand-green px-2 py-0.5 rounded font-black text-[7.5px] shrink-0">PAID SECURE</span>
            </div>
          </div>
        </div>

        {/* QR secure code & message */}
        <div className="flex items-center gap-3 py-1 font-sans">
          <div className="w-14 h-14 border border-slate-200 rounded p-0.5 bg-white shrink-0 select-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800">
              <rect x="0" y="0" width="25" height="25" fill="currentColor" />
              <rect x="5" y="5" width="15" height="15" fill="white" />
              <rect x="75" y="0" width="25" height="25" fill="currentColor" />
              <rect x="80" y="5" width="15" height="15" fill="white" />
              <rect x="0" y="75" width="25" height="25" fill="currentColor" />
              <rect x="5" y="80" width="15" height="15" fill="white" />
              <rect x="35" y="35" width="30" height="30" fill="currentColor" />
              <rect x="40" y="40" width="20" height="20" fill="white" />
              <rect x="10" y="35" width="10" height="10" fill="currentColor" />
              <rect x="35" y="10" width="15" height="5" fill="currentColor" />
              <rect x="55" y="5" width="10" height="10" fill="currentColor" />
              <rect x="85" y="35" width="10" height="15" fill="currentColor" />
              <rect x="15" y="55" width="10" height="10" fill="currentColor" />
              <rect x="35" y="75" width="15" height="15" fill="currentColor" />
              <rect x="65" y="85" width="15" height="10" fill="currentColor" />
              <rect x="75" y="55" width="15" height="15" fill="currentColor" />
            </svg>
          </div>
          <p className="text-[8px] text-slate-550 font-light leading-relaxed">
            {isBn 
              ? 'নিরাপত্তা ও সত্যায়ন বারকোড: এটি সমিতির সেন্ট্রাল পেমেন্ট লেজার ডাটাবেজ দ্বারা সার্টিফাইড ডিজিটাল রসিদ। উপরে বর্ণিত কিউআর কোড স্ক্যান করে অনলাইন পোর্টালে এই অনুদানের রসিদটি যেকোনো সময় ভেরিফাই করতে পারবেন।'
              : 'Tamper Protection Secure Badge: Scan QR block to fetch live verification and ledger logs directly from BUSD central database.'}
          </p>
        </div>

        {/* Footer Seal & Signatories */}
        <div className="flex justify-between items-end pt-5 border-t border-slate-100 text-center font-sans tracking-tight">
          <div className="space-y-1">
            <span className="block h-5 text-indigo-750 italic text-[11px] font-serif pr-2 select-none">
              Kamrul Islam
            </span>
            <div className="w-20 border-t border-slate-310 mx-auto" />
            <span className="text-[7.5px] uppercase font-bold text-slate-500 block">
              Md. Kamrul Islam, FCA
            </span>
            <span className="text-[6.5px] text-slate-400 block">{isBn ? 'অর্থ সম্পাদক (Treasurer)' : 'Treasurer'}</span>
          </div>

          <div className="w-14 h-14 rounded-full border border-dashed border-red-500/80 p-0.5 flex items-center justify-center relative rotate-[-12deg] select-none text-red-500/90 leading-tight">
            <div className="w-12 h-12 rounded-full border border-red-400/85 flex flex-col items-center justify-center text-[5.5px] uppercase font-black text-center">
              <span>BUSD DHAKA</span>
              <span className="text-[4px] border-t border-b border-red-400/80 my-0.2">APPROVED</span>
              <span>ESTD 2008</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="block h-5 text-indigo-750 italic text-[11.5px] font-serif pl-2 select-none">
              Dr. Ashraful Islam
            </span>
            <div className="w-20 border-t border-slate-310 mx-auto" />
            <span className="text-[7.5px] uppercase font-bold text-slate-500 block">
              Dr. Md. Ashraful Islam
            </span>
            <span className="text-[6.5px] text-slate-400 block">{isBn ? 'সভাপতি (President)' : 'President'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helpers
function fundActiveTitleBn(fundId: string) {
  if (fundId === 'Scholarship') return 'শিক্ষাবৃত্তি ও ট্রাস্ট তহবিল (Education Scholarship Trust)';
  if (fundId === 'Medical') return 'বিনামূল্যে চিকিৎসা ও ক্যাম্প তহবিল (Free Medical Camps)';
  return 'জরুরি ত্রাণ ও দুর্যোগ কল্যাণ তহবিল (Emergency Disaster Relief)';
}

function LockSecureBadge() {
  return (
    <svg className="w-3.5 h-3.5 text-blue-620 shrink-0 fill-blue-620/10" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}


// VOLUNTEER REGISTRATION FORM
export function VolunteerRegistrationForm({ language, onVolunteerSubmit }: DonateProps) {
  const isBn = language === 'bn';

  const [formData, setFormData] = useState({
    name: '', nameBn: '', phone: '', email: '', skills: [] as string[], message: ''
  });

  const [volSuccess, setVolSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const skillOptions = isBn
    ? ['মেডিকেল ক্যম্প সহায়তা', 'ইভেন্ট ও গেট ম্যানেজমেন্ট', 'শীতার্তদের ত্রাণ বিতরণ', 'তথ্য ও সোশ্যাল মিডিয়া মডারেটর', 'মেধাবৃত্তি ফাইল পর্যালোচনা']
    : ['Medical Clinical Help', 'Event & Gate Management', 'Disaster Relief Distribution', 'Media & IT Support', 'Scholarship File Review'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillToggle = (skill: string) => {
    const list = [...formData.skills];
    if (list.includes(skill)) {
      setFormData({ ...formData, skills: list.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...list, skill] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email) {
      alert(isBn ? 'দয়া করে সব প্রয়োজনীয় তথ্য সরবরাহ করুন।' : 'Full credentials are required.');
      return;
    }

    setLoading(true);
    try {
      const resp = await onVolunteerSubmit(formData);
      if (resp.success) {
        setVolSuccess(true);
        setFormData({ name: '', nameBn: '', phone: '', email: '', skills: [], message: '' });
      } else {
        alert(resp.error || "Sending error");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
      <div className="text-center space-y-2 border-b border-slate-100 pb-5 mb-8">
        <div className="p-3 bg-emerald-50 text-brand-green rounded-full w-fit mx-auto mb-2">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-sans tracking-tight">
          {isBn ? 'স্বেচ্ছাসেবী হিসেবে যোগ দিন' : 'Volunteer Registration'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed max-w-xl mx-auto">
          {isBn
            ? 'আমাদের উপজেলার শীতার্ত মানুষকে সাহায্য দিতে কিংবা মেডিকেল ক্যাম্প পরিচালনায় হাত বাড়ান। আপনার সামান্য সময় একটি সুন্দর পরিবর্তনের জন্ম দিতে পারে।'
            : 'Contribute your time and skillset back home. Join our operational corps handling physical food packaging, disaster rescue, and health camps.'}
        </p>
      </div>

      {volSuccess ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3 max-w-md mx-auto animate-pulse"
        >
          <div className="p-2.5 bg-brand-green text-white rounded-full w-fit mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">{isBn ? 'রেজিস্ট্রেশন সফল হয়েছে!' : 'Application Sent!'}</h4>
          <p className="text-xs text-emerald-805 font-sans">
            {isBn
              ? 'আমরা আপনার তথ্য ড্যাশবোর্ডে পেয়েছি। সমিতির পরবর্তী স্বেচ্ছাসেবক মিটিং বা ত্রাণ কার্যক্রমে ফোনে যোগাযোগ করা হবে।'
              : 'Our management desk has saved your active skills. We will phone/email you prior to our next local village relief drive.'}
          </p>
          <button
            onClick={() => setVolSuccess(false)}
            className="bg-brand-green hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            {isBn ? 'নতুন আবেদন' : 'Submit Another'}
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-slate-750">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'আপনার নাম (বাংলায়)*' : 'Your Name (Bangla)*'}</label>
              <input
                required
                type="text"
                name="nameBn"
                placeholder="মোঃ তানভীর রহমান"
                value={formData.nameBn}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-250 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'আপনার নাম (ইংরেজি)*' : 'Your Name (English)*'}</label>
              <input
                required
                type="text"
                name="name"
                placeholder="MD. TANVIR RAHMAN"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-250 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'মোবাইল নম্বর*' : 'Mobile Phone No*'}</label>
              <input
                required
                type="tel"
                name="phone"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-250 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'ইমেইল অ্যাড্রেস*' : 'Email Address*'}</label>
              <input
                required
                type="email"
                name="email"
                placeholder="tanvir@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-slate-250 rounded-xl"
              />
            </div>
          </div>

          <div className="text-xs font-sans">
            <label className="block text-slate-600 mb-2 font-semibold">{isBn ? 'আপনি কোন কোন কার্যক্রমে সেবা দিতে ইচ্ছুক?' : 'Select Areas of Support'}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {skillOptions.map((skill) => {
                const isChecked = formData.skills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                      isChecked
                        ? 'border-brand-green bg-green-50/30 text-brand-green font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSkillToggle(skill)}
                      className="rounded border-slate-300 text-brand-green focus:ring-brand-green w-4 h-4"
                    />
                    <span className="text-[11px] leading-tight">{skill}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="text-xs font-sans">
            <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'আপনার কোনো বার্তা বা বিশেষ অভিজ্ঞতা' : 'Short Message / Prior Engagements'}</label>
            <textarea
              name="message"
              rows={3}
              placeholder={isBn ? 'আমি ইতিপূর্বে রেডক্রিসেন্ট ক্লাবে কাজ করেছি...' : 'Summarize your social welfare experiences...'}
              value={formData.message}
              onChange={handleInputChange}
              className="w-full p-2.5 border border-slate-250 rounded-xl"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-official text-white font-extrabold px-8 py-3 rounded-2xl shadow shadow-blue-200 text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:opacity-95"
            >
              <span>{loading ? (isBn ? 'পাঠানো হচ্ছে...' : 'Submitting Idea...') : (isBn ? 'স্বেচ্ছাসেবী আবেদন জমা দিন' : 'Register as Volunteer')}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
