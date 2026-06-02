import React, { useState } from 'react';
import { Language } from '../types';
import { Phone, Mail, MapPin, Facebook, Youtube, Menu, X, ChevronDown, LogIn, User, Heart, Settings } from 'lucide-react';
import SVGEmblem from './SVGEmblem';
import { AnimatePresence } from 'motion/react';

interface LayoutProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Layout({
  language,
  setLanguage,
  activeTab,
  setActiveTab,
  isLoggedIn,
  user,
  onLogout,
  children
}: LayoutProps) {
  const isBn = language === 'bn';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleTabSelect = (tabName: string) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const menuItems = [
    { id: 'home', title: 'Home', titleBn: 'হোম' },
    {
      id: 'about',
      title: 'About Us',
      titleBn: 'পরিচিতি',
      dropdown: [
        { id: 'about_us', title: 'Who We Are', titleBn: 'আমাদের পরিচিতি' },
        { id: 'mission_vision', title: 'Mission & Vision', titleBn: 'লক্ষ্য ও উদ্দেশ্য' },
        { id: 'projects_activities', title: 'Projects & Activities', titleBn: 'কার্যক্রম ও প্রকল্প' }
      ]
    },
    {
      id: 'committees',
      title: 'Committees',
      titleBn: 'কমিটি',
      dropdown: [
        { id: 'exec_committee', title: 'Executive Committee', titleBn: 'কার্যনির্বাহী পরিষদ' },
        { id: 'advisory_committee', title: 'Advisory Committee', titleBn: 'উপদেষ্টা পরিষদ' }
      ]
    },
    {
      id: 'members',
      title: 'Members',
      titleBn: 'সদস্য',
      dropdown: [
        { id: 'member_directory', title: 'Member Directory', titleBn: 'সদস্য ডিরেক্টরি' },
        { id: 'member_registration', title: 'Online Registration', titleBn: 'অনলাইন নিবন্ধন ফরম' }
      ]
    },
    { id: 'events_programs', title: 'Events', titleBn: 'ইভেন্টসমূহ' },
    { id: 'news_notices', title: 'Notices', titleBn: 'নোটিশ বোর্ড' },
    {
      id: 'media',
      title: 'Media',
      titleBn: 'গ্যালারি',
      dropdown: [
        { id: 'photo_gallery', title: 'Photo Gallery', titleBn: 'ছবি গ্যালারি' },
        { id: 'video_gallery', title: 'Video Gallery', titleBn: 'ভিডিও গ্যালারি' }
      ]
    },
    {
      id: 'welfare',
      title: 'Welfare',
      titleBn: 'কল্যাণ সেবা',
      dropdown: [
        { id: 'donation', title: 'Welfare Donation', titleBn: 'তহবিলে অনুদান দিন' },
        { id: 'volunteer_registration', title: 'Volunteer Portal', titleBn: 'স্বেচ্ছাসেবী আবেদন' }
      ]
    },
    { id: 'contact', title: 'Contact Us', titleBn: 'যোগাযোগ' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans select-text bg-[#F8FAFC]">
      {/* 1. TOP HEADER CONTACT BAND */}
      <header className="bg-gradient-official text-white text-[11px] font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          {/* Contacts info */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 opacity-90 font-sans">
            <a href="tel:+8801700112233" className="flex items-center gap-1.5 hover:text-cyan-200 transition-colors">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>+8801700112233</span>
            </a>
            <a href="mailto:info@baliakandisociety.org" className="flex items-center gap-1.5 hover:text-cyan-200 transition-colors">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>info@baliakandisociety.org</span>
            </a>
            <div className="hidden md:flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Mirpur-11, Dhaka, Bangladesh</span>
            </div>
          </div>

          {/* Social connections & language selector */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 border-r border-white/20 pr-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-cyan-150 transition-colors">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Language Quick switch button */}
            <div className="flex bg-white/10 rounded overflow-hidden p-0.5 border border-white/20">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase transition-colors shrink-0 ${
                  isBn ? 'bg-white text-dark-blue shadow' : 'text-white/80 hover:text-white'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-sm font-bold text-[9px] uppercase transition-colors shrink-0 ${
                  !isBn ? 'bg-white text-dark-blue shadow' : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. STICKY MAIN NAVBAR */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur shadow-sm z-40 border-b border-slate-150 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo area */}
            <div
              onClick={() => handleTabSelect('home')}
              className="flex items-center gap-3 cursor-pointer select-none shrink-0"
            >
              <SVGEmblem size={50} />
              <div className="leading-tight">
                <h1 className="text-sm sm:text-base font-extrabold text-[#0A4E9E] tracking-tight font-sans">
                  বালিয়াকান্দি উপজেলা সমিতি
                </h1>
                <p className="text-[10px] text-brand-green font-bold tracking-wider font-sans mt-0.5">
                  ঢাকা • BALIAKANDI UPZILA SAMITI DHAKA
                </p>
              </div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              {menuItems.map(item => {
                const isNavDropdown = !!item.dropdown;
                const isTabActive = activeTab === item.id || item.dropdown?.some(d => d.id === activeTab);
                
                return (
                  <div key={item.id} className="relative group/nav">
                    {isNavDropdown ? (
                      /* Dropdown items toggler */
                      <button className={`px-2.5 py-2 rounded-lg flex items-center gap-1 hover:bg-slate-50 transition-colors cursor-pointer ${
                        isTabActive ? 'text-[#0E72C8] font-bold bg-blue-50/40' : 'text-slate-650'
                      }`}>
                        <span>{isBn ? item.titleBn : item.title}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    ) : (
                      /* Standard flat items links triggers */
                      <button
                        onClick={() => handleTabSelect(item.id)}
                        className={`px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-all cursor-pointer ${
                          activeTab === item.id ? 'text-[#0E72C8] bg-blue-50/50 font-extrabold' : 'text-slate-650'
                        }`}
                      >
                        {isBn ? item.titleBn : item.title}
                      </button>
                    )}

                    {/* Render Desktop dropdown panel box */}
                    {isNavDropdown && (
                      <div className="absolute top-full left-0 bg-white rounded-2xl border border-slate-200/80 shadow-lg min-w-[200px] py-2 mt-1 hidden group-hover/nav:block animate-fade-in text-sans">
                        {item.dropdown?.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => handleTabSelect(sub.id)}
                            className={`w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-semibold block transition-colors cursor-pointer ${
                              activeTab === sub.id ? 'text-primary-blue bg-blue-50/30' : 'text-slate-650'
                            }`}
                          >
                            {isBn ? sub.titleBn : sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* CTAs Bar: Member login/Dashboard and Quick Donation buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => handleTabSelect('donation')}
                className="bg-brand-green/10 text-brand-green hover:bg-brand-green/20 font-extrabold px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1 capitalize transition-colors cursor-pointer shrink-0"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{isBn ? 'অনুদান' : 'Donation'}</span>
              </button>

              {isLoggedIn ? (
                /* Already Logged In Profile Link or Admin panel button */
                <button
                  onClick={() => handleTabSelect('dashboard')}
                  className={`px-4 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                    user?.role === 'admin' 
                      ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                      : 'bg-primary-blue text-white hover:bg-dark-blue'
                  }`}
                >
                  {user?.role === 'admin' ? <Settings className="w-3.5 h-3.5 shrink-0" /> : <User className="w-3.5 h-3.5 shrink-0" />}
                  <span className="truncate max-w-[80px]">
                    {user?.role === 'admin' ? (isBn ? 'প্যানেল' : 'Admin Panel') : (isBn ? 'ড্যাশবোর্ড' : 'Profile')}
                  </span>
                </button>
              ) : (
                /* Login Link default guest action icon */
                <button
                  onClick={() => handleTabSelect('login')}
                  className="bg-primary-blue text-white hover:bg-dark-blue font-extrabold px-5 py-2.5 rounded-full text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{isBn ? 'লগইন' : 'Member Login'}</span>
                </button>
              )}
            </div>

            {/* Mobile navigation toggle button */}
            <div className="flex xl:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. MOBILE BURGER DRAWER MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Overlay background panel */}
            <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />

            {/* Drawer body container */}
            <div className="fixed top-0 bottom-0 right-0 w-72 bg-white p-6 shadow-2xl flex flex-col justify-between z-10 font-sans">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="font-extrabold text-dark-blue text-xs uppercase tracking-wider">{isBn ? 'নেভিগেশন মেনু' : 'Menu Navigation'}</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                    <X className="w-5 h-5 text-slate-550" />
                  </button>
                </div>

                {/* Splicing links scrolling area */}
                <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar py-2 text-xs">
                  {menuItems.map(item => {
                    const hasSub = !!item.dropdown;
                    const isOpen = activeDropdown === item.id;
                    return (
                      <div key={item.id} className="space-y-1">
                        {hasSub ? (
                          <div className="space-y-1">
                            <button
                              onClick={() => toggleDropdown(item.id)}
                              className="w-full font-bold py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-800 text-left flex justify-between items-center"
                            >
                              <span>{isBn ? item.titleBn : item.title}</span>
                              <ChevronDown className={`w-4 h-4 opacity-50 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isOpen && (
                              <div className="bg-slate-50 p-2 rounded-xl border border-slate-150 space-y-1 ml-2">
                                {item.dropdown?.map(sub => (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleTabSelect(sub.id)}
                                    className="w-full text-left px-3 py-2 text-slate-650 text-xs font-semibold block hover:text-primary-blue"
                                  >
                                    {isBn ? sub.titleBn : sub.title}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleTabSelect(item.id)}
                            className="w-full text-left font-bold py-2.5 px-3 rounded-xl hover:bg-slate-50 text-slate-850"
                          >
                            {isBn ? item.titleBn : item.title}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile CTA log out / Log In box */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleTabSelect('dashboard')}
                      className="w-full bg-primary-blue text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5"
                    >
                      <User className="w-4 h-4" />
                      <span>{isBn ? 'মেম্বার ড্যাশবোর্ড' : 'Profile Panel'}</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl font-bold font-sans"
                    >
                      {isBn ? 'লগ আউট করুন' : 'Log Out Account'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleTabSelect('login')}
                    className="w-full bg-primary-blue text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isBn ? 'মেম্বার লগইন' : 'Member Login'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. MAIN BODY INNERS CONTENT PANES */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
        {children}
      </main>

      {/* 5. FOOTER COMPONENT */}
      <footer className="bg-[#0A4E9E] text-white pt-12 pb-6 border-t-4 border-brand-green font-sans mt-12 bg-gradient-to-t from-[#052F63] to-[#0A4E9E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-white/10 pb-10">
          
          {/* Logo & address detail segment */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SVGEmblem size={55} />
              <div className="leading-tight">
                <h3 className="font-extrabold text-[13px] tracking-tight">{isBn ? 'বালিয়াকান্দি উপজেলা সমিতি, ঢাকা' : 'Baliakandi Upazila Samiti'}</h3>
                <p className="text-[9px] text-emerald-450 font-bold uppercase tracking-wider font-mono">ESTD. 2008</p>
              </div>
            </div>
            <p className="text-[11px] text-white/75 leading-relaxed font-sans font-light">
              {isBn
                ? "আমাদের মূল চালিকা শক্তি সৌহার্দ্য ও ভ্রাতৃত্ববোধ। ঢাকায় বসবাসরত সকল উপজেলাবাসীদের পারস্পরিক সহযোগিতা এবং জন্মভূমির সমাজ ও শিক্ষা উন্নয়নে প্রতিজ্ঞাবদ্ধ।"
                : "United in fellowship and progress, our welfare trust works non-stop to represent Southwest Rajbari natives in Dhaka while empowering school stipends."}
            </p>
            <div className="text-[10px] space-y-1.5 opacity-90 font-sans">
              <div className="flex gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-200" />
                <span>{isBn ? 'মিরপুর-১১, ঢাকা-১২১৬, বাংলাদেশ' : 'Block D, Mirpur-11, Dhaka, Bangladesh'}</span>
              </div>
            </div>
          </div>

          {/* Quick linkages lists column */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 border-b border-white/15 pb-1.5 w-fit">
              {isBn ? 'গুরুত্বপূর্ণ সংযুক্তি' : 'Quick Useful Links'}
            </h4>
            <ul className="space-y-2 text-[10px] text-white/80 font-sans font-medium">
              <li>
                <button onClick={() => setActiveTab('about_us')} className="hover:text-cyan-200 cursor-pointer block">{isBn ? 'আমাদের ইতিহাস ও লক্ষ্য' : 'Who We Are'}</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('exec_committee')} className="hover:text-cyan-200 cursor-pointer block">{isBn ? 'সম্মানিত কার্যনির্বাহী পরিষদ' : 'Executive Committee'}</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('member_directory')} className="hover:text-cyan-200 cursor-pointer block">{isBn ? 'সদস্য সন্ধান ডিরেক্টরি' : 'Approved Members Directory'}</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('member_registration')} className="hover:text-cyan-200 cursor-pointer block text-emerald-430 font-bold">{isBn ? 'অনলাইন সদস্য নিবন্ধন ফরম' : 'Online Application form'}</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('donation')} className="hover:text-cyan-200 cursor-pointer block text-amber-350">{isBn ? 'মানবসেবা ট্রাস্ট ফান্ড' : 'Welfare Donation Portal'}</button>
              </li>
            </ul>
          </div>

          {/* Useful local government links columns */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 border-b border-white/15 pb-1.5 w-fit">
              {isBn ? 'সরকারী পোর্টাল লিংক' : 'Corporate Govt. Portals'}
            </h4>
            <ul className="space-y-2 text-[10px] text-white/80 font-sans">
              <li>
                <a href="https://baliakandi.rajbari.gov.bd" target="_blank" rel="noreferrer" className="hover:text-cyan-200 block">বালিয়াকান্দি উপজেলা জাতীয় বাতায়ন</a>
              </li>
              <li>
                <a href="https://www.rajbari.gov.bd" target="_blank" rel="noreferrer" className="hover:text-cyan-200 block">রাজবাড়ী জেলা প্রশাসন দপ্তর</a>
              </li>
              <li>
                <a href="https://www.bangladesh.gov.bd" target="_blank" rel="noreferrer" className="hover:text-cyan-200 block">বাংলাদেশ জাতীয় তথ্য বাতায়ন</a>
              </li>
              <li>
                <a href="http://www.coop.gov.bd" target="_blank" rel="noreferrer" className="hover:text-cyan-200 block">সমবায় অধিদপ্তর</a>
              </li>
            </ul>
          </div>

          {/* SIMULATED VECTOR OUTLINE RAJBARI MAP ACCENT - JAW DROPPING VISUAL EXTRA */}
          <div className="space-y-3 font-sans">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300 border-b border-white/15 pb-1.5 w-fit">
              {isBn ? 'ভৌগোলিক মানচিত্র' : 'Regional Geographic Map'}
            </h4>
            
            {/* Outline map of Rajbari with pin on Baliakandi */}
            <div className="bg-white/10 rounded-2xl p-3 border border-white/5 flex flex-col items-center">
              <svg width="100%" height="80" viewBox="0 0 160 80" className="opacity-80">
                {/* Simulated southwestern regional curves */}
                <path d="M10,40 Q40,10 70,30 T130,20 Q150,50 120,70 T60,50 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,3" />
                <path d="M45,35 Q60,25 75,35 T105,45" fill="none" stroke="#22C55E" strokeWidth="2" />
                
                {/* Baliakandi pinpoint */}
                <g transform="translate(75, 38)">
                  <circle cx="0" cy="0" r="4" fill="#F59E0B" className="animate-ping" />
                  <circle cx="0" cy="0" r="3" fill="#EF4444" />
                  <text x="6" y="-3" fontSize="6" fontFamily="sans-serif" fill="#FBBF24" fontWeight="bold">বালিয়াকান্দি</text>
                </g>
              </svg>
              <span className="text-[8px] text-white/50 text-center mt-1 leading-none">GPS: 23.63° N, 89.54° E • Southern Padma Delta</span>
            </div>
          </div>
        </div>

        {/* Outer legal licensing copy */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/50 gap-2 border-t border-white/5 pt-4">
          <span>Copyright © {new Date().getFullYear()} Baliakandi Upazila Samiti, Dhaka. All rights reserved.</span>
          <span className="font-sans">Developed with highest standards of humanitarian welfare in Bangladesh.</span>
        </div>
      </footer>
    </div>
  );
}
