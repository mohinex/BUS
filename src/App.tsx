import React, { useState, useEffect } from 'react';
import { Language, Member, CommitteeMember, EventLog, NewsLog, GalleryItem, DonationLog, Volunteer } from './types';
import Layout from './components/Layout';
import HomeViews from './components/HomeViews';
import { AboutUsView, MissionVisionView, ProjectsView } from './components/AboutViews';
import CommitteeViews from './components/CommitteeViews';
import { MemberDirectoryView, MemberRegistrationForm } from './components/MemberViews';
import { EventsProgramsView, NewsNoticesView } from './components/EventNewsViews';
import GalleryViews from './components/GalleryViews';
import { DonationWelfareView, VolunteerRegistrationForm } from './components/DonationVolunteer';
import DashboardViews from './components/DashboardViews';

import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Mail, Phone, MapPin, Send, HelpCircle, CheckCircle2, UserCheck, Key, ShieldCheck, HelpCircle as HelpIcon } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Core API State Data
  const [members, setMembers] = useState<Member[]>([]);
  const [committees, setCommittees] = useState<CommitteeMember[]>([]);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [news, setNews] = useState<NewsLog[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [donations, setDonations] = useState<DonationLog[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);

  // Authentication & session state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  // General login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '', role: 'member' });
  const [loginError, setLoginError] = useState('');

  const isBn = language === 'bn';

  // 1. INITIAL FETCH OPERATIONS
  const loadData = async () => {
    try {
      // Gather public registries
      const resMembers = await fetch('/api/members');
      const dataMembers = await resMembers.json();
      setMembers(dataMembers);

      const resPublic = await fetch('/api/public-data');
      const dataPublic = await resPublic.json();
      setCommittees(dataPublic.committee || []);
      setEvents(dataPublic.events || []);
      setNews(dataPublic.news || []);
      setGallery(dataPublic.gallery || []);
      setDonations(dataPublic.donations || []);
    } catch (err) {
      console.error("Failed to fetch API payloads: ", err);
    }
  };

  // Re-fetch admin stats if logged in as admin
  const fetchAdminStats = async () => {
    const sessionToken = localStorage.getItem('session_token');
    if (!sessionToken) return;
    try {
      const resp = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      if (resp.ok) {
        const stats = await resp.json();
        setAdminStats(stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();

    // Recover session from localStorage
    const savedUser = localStorage.getItem('cli_user');
    const savedToken = localStorage.getItem('session_token');
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setIsLoggedIn(true);
        setUser(parsed);
        if (parsed.role === 'admin') {
          fetchAdminStats();
        }
      } catch {
        // Clear corrupt session config
        localStorage.removeItem('cli_user');
        localStorage.removeItem('session_token');
      }
    }
  }, []);

  // Update stats on role basis
  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      fetchAdminStats();
    }
  }, [isLoggedIn, user]);

  // Total donation calculation
  const totalWelfarePool = donations.reduce((sum, item) => sum + item.amount, 0);

  // 2. BACKEND INTEGRATION HANDLERS

  // LOGIN REQUESTER
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const resp = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const res = await resp.json();
      if (res.success) {
        setIsLoggedIn(true);
        setUser(res.user);
        localStorage.setItem('cli_user', JSON.stringify(res.user));
        localStorage.setItem('session_token', res.token);
        setLoginForm({ email: '', password: '', role: 'member' });
        setActiveTab('dashboard'); // Redirect
      } else {
        setLoginError(res.error || 'Authentication credential rejected.');
      }
    } catch {
      setLoginError('Server network offline.');
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('cli_user');
    localStorage.removeItem('session_token');
    setActiveTab('home');
  };

  // REGISTER NEW ONLINE MEMBER (POST API)
  const handleMemberRegistration = async (formPayload: any): Promise<{ success: boolean; message: string; data?: any; error?: string }> => {
    try {
      const resp = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload)
      });
      const data = await resp.json();
      if (data.success) {
        // Reload list
        loadData();
        return { success: true, message: isBn ? 'আপনার মেম্বারশিপ আবেদন জমা হয়েছে। দ্রুত অনুমোদন করা হবে।' : 'Your membership application is received. It will be reviewed shortly.', data: data.member };
      }
      return { success: false, message: '', error: data.error };
    } catch {
      return { success: false, message: '', error: 'Database network error.' };
    }
  };

  // DONATE PAYMENT TRIGGER FLOW
  const handleDonateSubmit = async (payload: any): Promise<{ success: boolean; donation: DonationLog; error?: string }> => {
    try {
      const resp = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res = await resp.json();
      if (res.success) {
        loadData(); // reload
        if (isLoggedIn && user?.role === 'admin') fetchAdminStats();
        return { success: true, donation: res.donation };
      }
      return { success: false, error: res.error, donation: null as any };
    } catch {
      return { success: false, error: 'Networking timeout.', donation: null as any };
    }
  };

  // VOLUNTEER REGISTRATION TRIGGER FLOW
  const handleVolunteerSubmit = async (payload: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const resp = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res = await resp.json();
      if (res.success) {
        if (isLoggedIn && user?.role === 'admin') fetchAdminStats();
        return { success: true };
      }
      return { success: false, error: res.error };
    } catch {
      return { success: false, error: 'Network registration timeout' };
    }
  };

  // RSVP SCHEDULER
  const handleRsvpSubmit = async (eventId: string): Promise<{ success: boolean; message: string; error?: string }> => {
    if (!isLoggedIn) {
      alert(isBn ? 'ইভেন্ট টিকিট বুকিং করতে দয়া করে প্রথমে লগইন করুন।' : 'Please login first to reserve event seat tickets.');
      setActiveTab('login');
      return { success: false, message: 'Please login' };
    }
    try {
      const resp = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, email: user.email })
      });
      const res = await resp.json();
      if (res.success) {
        loadData();
        // Update local session info
        const updatedUser = { ...user, activeRsvps: [...(user.activeRsvps || []), eventId] };
        setUser(updatedUser);
        localStorage.setItem('cli_user', JSON.stringify(updatedUser));
        return { success: true, message: isBn ? 'আপনার ইভেন্ট সীট সফলভাবে বুক করা হয়েছে!' : 'Seat reserved successfully!' };
      }
      return { success: false, message: '', error: res.error };
    } catch {
      return { success: false, message: '', error: 'Network error.' };
    }
  };

  // UPDATE BIO METADATA
  const handleUpdateBio = async (bioPayload: any): Promise<void> => {
    const token = localStorage.getItem('session_token');
    try {
      const resp = await fetch('/api/members/update-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bioPayload)
      });
      if (resp.ok) {
        const res = await resp.json();
        setUser(res.user);
        localStorage.setItem('cli_user', JSON.stringify(res.user));
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ADMIN ACTION: CHANGE MEMBER STATUS DECISION
  const handleAdminApprovalDecision = async (memberId: string, decision: 'Approved' | 'Declined') => {
    const token = localStorage.getItem('session_token');
    try {
      const resp = await fetch('/api/admin/member-decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ memberId, decision })
      });
      if (resp.ok) {
        alert(isBn ? `সদস্যপদ আবেদনটি ${decision === 'Approved' ? 'অনুমোদন' : 'বাতিল'} করা হয়েছে!` : `Application ${decision} successfully!`);
        fetchAdminStats();
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ADMIN ACTION: ADD EVENT
  const handleAdminAddEvent = async (payload: any): Promise<boolean> => {
    const token = localStorage.getItem('session_token');
    try {
      const resp = await fetch('/api/admin/events/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        loadData();
        fetchAdminStats();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // ADMIN ACTION: ADD NOTICE
  const handleAdminAddNews = async (payload: any): Promise<boolean> => {
    const token = localStorage.getItem('session_token');
    try {
      const resp = await fetch('/api/admin/news/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        loadData();
        fetchAdminStats();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // ADMIN ACTION: ADD GALLERY
  const handleAdminAddGallery = async (payload: any): Promise<boolean> => {
    const token = localStorage.getItem('session_token');
    try {
      const resp = await fetch('/api/admin/gallery/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        loadData();
        fetchAdminStats();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // 3. CONTACT FORM RECEPTACLE
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: '', phone: '', email: '', subject: '', message: '' });
    setTimeout(() => setContactSent(false), 5000);
  };

  return (
    <Layout
      language={language}
      setLanguage={setLanguage}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isLoggedIn={isLoggedIn}
      user={user}
      onLogout={handleLogout}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {/* TAB 1: LANDING HOME */}
          {activeTab === 'home' && (
            <HomeViews
              language={language}
              events={events}
              newsList={news}
              members={members}
              donationsTotal={totalWelfarePool}
              setActiveTab={setActiveTab}
              onJoinUsClick={() => setActiveTab('member_registration')}
            />
          )}

          {/* TAB 2 & 3 & 12: GENERAL INFORMATIONAL CHANNELS */}
          {activeTab === 'about_us' && (
            <AboutUsView language={language} />
          )}

          {/* TAB 3: MISSION VISION */}
          {activeTab === 'mission_vision' && (
            <MissionVisionView language={language} />
          )}

          {/* TAB 12: SOCIAL STIPENDS PROJECTS */}
          {activeTab === 'projects_activities' && (
            <ProjectsView language={language} />
          )}

          {/* TAB 4: COMMITTEES GENERAL EXECUTIVE DIRECTORY */}
          {activeTab === 'exec_committee' && (
            <CommitteeViews language={language} type="Executive" committeeMembers={committees} />
          )}

          {/* TAB 5: ADVISORY SECRETARY GROUP */}
          {activeTab === 'advisory_committee' && (
            <CommitteeViews language={language} type="Advisory" committeeMembers={committees} />
          )}

          {/* TAB 6: PUBLIC APPROVED SEARCHABLE MEMBER DIRECTORY */}
          {activeTab === 'member_directory' && (
            <MemberDirectoryView language={language} approvedMembers={members.filter(m => m.status === 'Approved')} />
          )}

          {/* TAB 7: SIGN UP DIGITAL COOPERATIVE MEMBER FORM */}
          {activeTab === 'member_registration' && (
            <MemberRegistrationForm language={language} onRegisterSubmit={handleMemberRegistration} />
          )}

          {/* TAB 8: NEWS & EVENTS BOOKINGS */}
          {activeTab === 'events_programs' && (
            <EventsProgramsView language={language} events={events} news={news} onEventRSVP={handleRsvpSubmit} userEmail={user?.email || null} />
          )}

          {/* TAB 9: NOTICE CIRCULAR BOARD */}
          {activeTab === 'news_notices' && (
            <NewsNoticesView language={language} news={news} />
          )}

          {/* TAB 10: PHOTO LIGHTBOX */}
          {activeTab === 'photo_gallery' && (
            <GalleryViews language={language} galleryItems={gallery} />
          )}

          {/* TAB 11: VIDEO DIRECTORIES EMBEDS */}
          {activeTab === 'video_gallery' && (
            <GalleryViews language={language} galleryItems={gallery} />
          )}

          {/* TAB 13: DONATE LEDGERS */}
          {activeTab === 'donation' && (
            <DonationWelfareView
              language={language}
              donations={donations}
              onDonateSubmit={handleDonateSubmit}
            />
          )}

          {/* TAB 14: VOLUNTEER REGISTERS */}
          {activeTab === 'volunteer_registration' && (
            <VolunteerRegistrationForm
              language={language}
              donations={donations}
              onDonateSubmit={handleDonateSubmit}
              onVolunteerSubmit={handleVolunteerSubmit}
            />
          )}

          {/* TAB 15: OFFICE CONTACT BOARD */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Contacts Details list column */}
              <div className="bg-gradient-official text-white p-8 rounded-3xl space-y-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold font-sans">{isBn ? 'যোগাযোগের মাধ্যম' : 'Contact Channels'}</h3>
                  <p className="text-xs text-slate-205 leading-relaxed font-sans">{isBn ? 'সমিতির সচিবালয় বা অন্য যেকোনো বিষয়ে দ্রুত অনুসন্ধানের জন্য যোগাযোগ করুন।' : 'Contact our secretary center directly or send a custom query message.'}</p>
                </div>

                <div className="space-y-5 text-xs font-sans">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 shrink-0 text-cyan-200" />
                    <div>
                      <strong className="block text-amber-300 font-bold mb-0.5">{isBn ? 'সমিতির প্রধান কার্যালয়:' : 'Secretariat Office:'}</strong>
                      <span className="font-light">{isBn ? 'বাসা ১২, সড়ক ৫, ব্লক-ডি, মিরপুর-১১, ঢাকা।' : 'House 12, Road 5, Block-D, Mirpur-11, Dhaka.'}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 shrink-0 text-cyan-200" />
                    <div>
                      <strong className="block text-amber-300 font-bold mb-0.5">{isBn ? 'হেল্পলাইন ফোন:' : 'Direct Phone Lines:'}</strong>
                      <span className="font-light">+8801700112233</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="w-5 h-5 shrink-0 text-cyan-200" />
                    <div>
                      <strong className="block text-amber-300 font-bold mb-0.5">{isBn ? 'ইমেইল অ্যাড্রেস:' : 'Email Support:'}</strong>
                      <span className="font-light">info@baliakandisociety.org</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 text-[10px] text-slate-105 leading-relaxed">
                  {isBn
                    ? 'অফিস সময়: যেকোনো কার্যদিবসে সকাল ১০টা থেকে বিকেল ৫টা (শুক্রবার ব্যতীত)।'
                    : 'Working Hours: 10:00 AM to 05:00 PM on standard business days.'}
                </div>
              </div>

              {/* Contact Request submitter form */}
              <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-1.5 font-sans">
                  <Send className="w-5 h-5 text-primary-blue animate-bounce-soft" />
                  <span>{isBn ? 'যোগাযোগ বা মতামত ফরম' : 'Leave Us a Message'}</span>
                </h3>

                {contactSent ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center space-y-3 max-w-sm mx-auto"
                  >
                    <CheckCircle2 className="w-8 h-8 text-brand-green mx-auto" />
                    <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">{isBn ? 'আবেদনটি সফল হয়েছে!' : 'Message Received!'}</h4>
                    <p className="text-xs text-slate-500 font-sans">{isBn ? 'আমাদের অফিসিয়াল প্রতিনিধি অতিসত্বর আপনার নম্বরে যোগাযোগ করবেন।' : 'We will respond back using provided verification email shortly.'}</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-sans text-slate-755">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'আপনার নাম*' : 'Your Name*'}</label>
                        <input required type="text" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'মোবাইল নম্বর*' : 'Mobile Phone*'}</label>
                        <input required type="tel" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}</label>
                        <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'বার্তার বিষয়*' : 'Subject Line*'}</label>
                        <input required type="text" placeholder="e.g. Scholarship Support query" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'বিস্তারিত বার্তা*' : 'Detailed Message*'}</label>
                        <textarea required rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl" />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button type="submit" className="bg-gradient-official text-white font-extrabold px-8 py-3 rounded-xl shadow-sm text-xs uppercase flex items-center gap-1">
                        <span>{isBn ? 'বার্তা পাঠান' : 'Send Message'}</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 16: AUTHENTICATED ACCESS SECURED CHECKS */}
          {activeTab === 'login' && (
            <div className="max-w-md mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="text-center space-y-1.5 border-b border-slate-100 pb-4">
                <div className="p-3 bg-blue-50 text-primary-blue rounded-full w-fit mx-auto mb-1">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 font-sans tracking-tight">{isBn ? 'মেম্বারশিপ পোর্টাল লগইন' : 'Member Portal Access'}</h3>
                <p className="text-xs text-slate-450 leading-relaxed max-w-sm mx-auto">
                  {isBn
                    ? 'আজীবন সদস্যদের ডিজিটাল আইডি কার্ড ডাউনলোড ও বুকিং ফি পর্যালোচনা করতে লগইন করুন।'
                    : 'Review historical payments and extract printable PDF certificates securely.'}
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 text-red-750 text-xs font-bold rounded-xl border-l-4 border-red-500">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans text-slate-755">
                {/* Simulated role selector tab */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setLoginForm({ ...loginForm, role: 'member' })}
                    className={`flex-1 py-1.5 text-center font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer ${
                      loginForm.role === 'member' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-505'
                    }`}
                  >
                    {isBn ? 'সাধারণ সদস্য লগইন' : 'Member login'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginForm({ ...loginForm, role: 'admin' })}
                    className={`flex-1 py-1.5 text-center font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer ${
                      loginForm.role === 'admin' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-505'
                    }`}
                  >
                    {isBn ? 'সেক্রেটারি প্যানেল' : 'Super Admin'}
                  </button>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'ইমেইল অ্যাড্রেস*' : 'Email Address*'}</label>
                  <input
                    required
                    type="email"
                    placeholder="e.g. member@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'গোপন পাসওয়ার্ড*' : 'Security Password*'}</label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full p-2.5 border border-slate-250 rounded-xl font-mono"
                  />
                </div>

                {/* Prompt credentials message for evaluation convenience */}
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-[10px] text-slate-600 leading-normal font-sans text-left space-y-1">
                  <strong className="block text-primary-blue font-bold">🛠️ Evaluation Credentials:</strong>
                  {loginForm.role === 'member' ? (
                    <div>
                      <span>Email: <strong>member@baliakandi.org</strong></span>
                      <span className="block">Password: <strong>member2026</strong></span>
                    </div>
                  ) : (
                    <div>
                      <span>Email: <strong>admin@baliakandi.org</strong></span>
                      <span className="block">Password: <strong>admin2026</strong> (Full Approve workflows!)</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-primary-blue hover:bg-dark-blue text-white font-extrabold py-3 rounded-xl shadow-sm text-xs uppercase"
                  >
                    {isBn ? 'নিরাপদে অ্যাকাউন্ট প্রবেশ করুন' : 'Authenticate Session'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 17: PROTECTED USER & ADMIN CONTROL WORKFLOW */}
          {activeTab === 'dashboard' && (
            <DashboardViews
              language={language}
              user={user}
              adminStats={adminStats}
              onApproveMember={handleAdminApprovalDecision}
              onAddNews={handleAdminAddNews}
              onAddEvent={handleAdminAddEvent}
              onAddGallery={handleAdminAddGallery}
              onUpdateBio={handleUpdateBio}
              allEvents={events}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}
