import React, { useState } from 'react';
import { Member, Language, EventLog, NewsLog, DonationLog, Volunteer } from '../types';
import { User, ShieldCheck, CreditCard, PenTool, ClipboardList, PlusCircle, Check, X, FilePlus, CalendarPlus, ImagePlus, UserCheck, AlertTriangle, Printer, Download, Eye, Clock, Phone, Key, Bell, Users, Coins, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SVGEmblem from './SVGEmblem';

interface DashboardProps {
  language: Language;
  user: any; // Logged in user payload
  adminStats: any; // Load stats
  onApproveMember: (id: string, decision: 'Approved' | 'Declined') => Promise<void>;
  onAddNews: (payload: any) => Promise<boolean>;
  onAddEvent: (payload: any) => Promise<boolean>;
  onAddGallery: (payload: any) => Promise<boolean>;
  onUpdateBio: (bioPayload: any) => Promise<void>;
  allEvents: EventLog[];
}

export default function DashboardViews({
  language,
  user,
  adminStats,
  onApproveMember,
  onAddNews,
  onAddEvent,
  onAddGallery,
  onUpdateBio,
  allEvents
}: DashboardProps) {
  const isBn = language === 'bn';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-8">
      {isAdmin ? (
        <AdminDashboardView
          language={language}
          stats={adminStats}
          onApproveMember={onApproveMember}
          onAddNews={onAddNews}
          onAddEvent={onAddEvent}
          onAddGallery={onAddGallery}
        />
      ) : (
        <MemberDashboardView
          language={language}
          member={user}
          onUpdateBio={onUpdateBio}
          allEvents={allEvents}
        />
      )}
    </div>
  );
}

// 1. MEMBER INTEGRATED DASHBOARD
function MemberDashboardView({ language, member, onUpdateBio, allEvents }: { language: Language; member: any; onUpdateBio: any; allEvents: EventLog[] }) {
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'id_card' | 'edit_profile' | 'events'>('id_card');

  // Bio fields states
  const [bio, setBio] = useState(member.bio || '');
  const [bioBn, setBioBn] = useState(member.bioBn || '');
  const [fb, setFb] = useState(member.fbProfile || '');
  const [blood, setBlood] = useState(member.bloodGroup || 'O+');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Find events RSVP'd by this user
  const userRSVPs = allEvents.filter(e => e.attendees.includes(member.email));

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg('');
    try {
      await onUpdateBio({
        email: member.email,
        bio,
        bioBn,
        fbProfile: fb,
        bloodGroup: blood
      });
      setUpdateMsg(isBn ? 'প্রোফাইল সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!');
    } catch {
      setUpdateMsg(isBn ? 'ত্রুটি ঘটেছে।' : 'Failed to update.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile summary widget */}
      <div className="bg-gradient-official p-6 sm:p-8 rounded-3xl text-white flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-white/20 flex-shrink-0">
          <img src={member.profilePhoto} alt={member.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-xl sm:text-2xl font-bold font-sans">
            {isBn ? member.nameBn || member.name : member.name}
          </h3>
          <p className="text-xs text-white/80 font-mono tracking-wider">MEMBER ID: {member.id}</p>
          <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
            <span className="bg-white/20 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
              {isBn ? 'আজীবন / সাধারণ' : member.category + ' Member'}
            </span>
            <span className="bg-brand-green text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {isBn ? 'সক্রিয় সদস্য' : 'Active Profile'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('id_card')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase border-b-2 text-center transition-all cursor-pointer ${
            activeTab === 'id_card' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-slate-500'
          }`}
        >
          <CreditCard className="w-4 h-4 inline-block mr-1.5 shrink-0" />
          <span>{isBn ? 'স্মার্ট আইডি কার্ড' : 'Digital ID Card'}</span>
        </button>

        <button
          onClick={() => setActiveTab('edit_profile')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase border-b-2 text-center transition-all cursor-pointer ${
            activeTab === 'edit_profile' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-slate-500'
          }`}
        >
          <PenTool className="w-4 h-4 inline-block mr-1.5 shrink-0" />
          <span>{isBn ? 'বায়ো ও প্রোফাইল' : 'Update Profile'}</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold uppercase border-b-2 text-center transition-all cursor-pointer ${
            activeTab === 'events' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-slate-500'
          }`}
        >
          <Clock className="w-4 h-4 inline-block mr-1.5 shrink-0" />
          <span>{isBn ? 'বুকিং টিকেটসমূহ' : 'My Event RSVPs'}</span>
        </button>
      </div>

      {/* Content views */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[300px]">
        {/* VIEW 1: DIGITAL ID CARD - THE FLAGSHIP PIECE */}
        {activeTab === 'id_card' && (
          <div className="space-y-8 flex flex-col items-center">
            <div className="text-center max-w-sm space-y-1">
              <h4 className="font-bold text-slate-800 text-sm sm:text-base">{isBn ? 'আপনার ডিজিটাল মেম্বারশিপ কার্ড' : 'Printable Membership ID'}</h4>
              <p className="text-xs text-slate-400 leading-normal">
                {isBn
                  ? 'এটি সংগঠনের অফিসিয়াল গেট পাস। নিচের প্রিন্ট বাটনে চাপার মাধ্যমে সরাসরি আইডি কার্ড প্রিন্ট করতে পারবেন।'
                  : 'Authorized digital badge file. Press Print button below to output standard envelope passcard.'}
              </p>
            </div>

            {/* TWO SIDED PREMIUM PRINTABLE ID CARD FRAME */}
            <div id="printArea" className="flex flex-col md:flex-row gap-6 items-center">
              {/* FRONT SIDE */}
              <div className="w-[340px] h-[216px] bg-gradient-official text-white rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden border border-white/10 shrink-0">
                {/* Background design pattern */}
                <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none opacity-40" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />

                {/* Header */}
                <div className="flex gap-2.5 items-center justify-between border-b border-white/20 pb-2">
                  <SVGEmblem size={44} />
                  <div className="text-right">
                    <h5 className="font-extrabold text-[12px] font-sans tracking-tight">বালিয়াকান্দি উপজেলা সমিতি, ঢাকা</h5>
                    <p className="text-[7px] text-brand-green font-bold tracking-widest uppercase font-mono mt-0.5">Baliakandi Upazila Samiti, Dhaka</p>
                  </div>
                </div>

                {/* Grid Details */}
                <div className="flex gap-4 items-center flex-1 py-1.5 text-slate-100">
                  <div className="w-16 h-18 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 bg-slate-50/5 p-0.5">
                    <img src={member.profilePhoto} alt={member.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="text-[10px] space-y-0.5 leading-tight font-sans">
                    <span className="block font-black text-white text-[12px] truncate max-w-[150px]">{isBn ? member.nameBn || member.name : member.name}</span>
                    <span className="block opacity-85 text-[8px] tracking-wide font-mono uppercase text-amber-300">ID: {member.id}</span>
                    <span className="block opacity-80">{isBn ? 'ইউনিয়ন' : 'Union'}: {isBn ? 'বহরপুর ইউনিয়ন' : member.union}</span>
                    <span className="block opacity-80">{isBn ? 'রক্তের গ্রুপ' : 'Blood'}: <strong className="text-red-400 font-bold">{blood}</strong></span>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="border-t border-white/10 pt-1.5 flex justify-between items-center text-[8px] text-white/70 font-sans">
                  <span>Category: <strong>{member.category} Member</strong></span>
                  <span className="bg-brand-green px-1.5 py-0.5 rounded text-white font-bold uppercase text-[7px] leading-none">ACTIVE PLEDGE</span>
                </div>
              </div>

              {/* CARD BACK SIDE */}
              <div className="w-[340px] h-[216px] bg-slate-100 text-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg border border-slate-200 shrink-0 relative overflow-hidden text-sans text-[8px] leading-snug">
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                    <span className="font-bold text-dark-blue">INSTRUCTIONS & TERMS</span>
                    <span className="text-[6px] text-slate-400 font-mono">SERIAL: {member.id.replace('BUSD-','')}</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-0.5 text-slate-500 font-sans pl-1">
                    <li>This card represents active affiliation with Baliakandi Upazila Samiti, Dhaka.</li>
                    <li>Not transferable. In case of emergency, please phone: +8801700112233.</li>
                    <li>If found, kindly drop in near mail boxes or return back to: House 12, Road 5, Block-D, Mirpur-11, Dhaka.</li>
                  </ol>
                </div>

                {/* Back content signatures & barcode */}
                <div className="flex justify-between items-end border-t border-slate-200 pt-3">
                  {/* barcode mockup */}
                  <div className="space-y-1">
                    <div className="h-5 w-24 bg-white border border-slate-200 p-0.5 flex gap-0.5 items-center">
                      {[...Array(14)].map((_, idx) => (
                        <div key={idx} className={`h-full bg-slate-900`} style={{ width: idx % 3 === 0 ? '3px' : '1px' }} />
                      ))}
                    </div>
                    <span className="block text-[6px] text-slate-400 font-mono font-medium text-center">BUSD-SECURE-ID-CY26</span>
                  </div>

                  {/* signature */}
                  <div className="text-center relative">
                    <div className="font-mono text-dark-blue italic text-[8px] -mb-1 select-none">Shafiqul Rahman</div>
                    <div className="w-16 border-t border-slate-400 block mx-auto text-[6px] text-slate-400 uppercase font-sans">GS Signature</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print trigger button */}
            <div className="pt-4 flex gap-4 w-full justify-center">
              <button
                onClick={() => {
                  window.print();
                }}
                className="bg-white hover:bg-slate-50 border border-slate-250 py-2 px-5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>{isBn ? 'কার্ড প্রিন্ট করুন' : 'Print ID Card'}</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: BIOMETRIC BIO AND PROFILE PANEL */}
        {activeTab === 'edit_profile' && (
          <form onSubmit={handleUpdate} className="space-y-6 max-w-xl mx-auto">
            <h4 className="font-bold text-slate-800 text-sm border-l-4 border-primary-blue pl-2 mb-4">
              {isBn ? 'আপনার ব্যক্তিগত প্রোফাইল আপডেট' : 'Update Profile Metadata'}
            </h4>

            {updateMsg && (
              <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs sm:text-sm rounded-xl font-sans font-semibold border-l-4 border-emerald-500">
                {updateMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
                <select value={blood} onChange={(e) => setBlood(e.target.value)} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white">
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'ফেসবুক প্রোফাইল লিংক' : 'Facebook Page URL'}</label>
                <input type="url" placeholder="https://facebook.com/username" value={fb} onChange={(e) => setFb(e.target.value)} className="w-full p-2.5 border border-slate-250 rounded-xl" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'আপনার প্রোফাইল সংক্ষিপ্ত বায়ো (ইংরেজি)' : 'Your Profile Short Bio (English)'}</label>
                <textarea
                  rows={2}
                  placeholder="Software Developer living in Dhaka, representing Baliakandi upazila."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'আপনার প্রোফাইল সংক্ষিপ্ত বায়ো (বাংলায়)' : 'Your Profile Short Bio (Bangla)'}</label>
                <textarea
                  rows={2}
                  placeholder="ঢাকায় চাকুরীরত, বালিয়াকান্দি সমিতির উন্নয়নে অবদান রাখতে সর্বদা সচেষ্ট।"
                  value={bioBn}
                  onChange={(e) => setBioBn(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="bg-primary-blue hover:bg-dark-blue text-white font-bold p-3 px-8 rounded-xl text-xs uppercase"
              >
                {updating ? 'Saving...' : (isBn ? 'সংরক্ষণ করুন' : 'Save Profiles')}
              </button>
            </div>
          </form>
        )}

        {/* VIEW 3: RSVP TICKETS LIST */}
        {activeTab === 'events' && (
          <div className="space-y-6 max-w-xl mx-auto">
            <h4 className="font-bold text-slate-800 text-sm border-l-4 border-primary-blue pl-2 mb-4">
              {isBn ? 'আপনার বুকিংকৃত ইভেন্ট টিকেটসমূহ' : 'My Scheduled Event Bookings'}
            </h4>

            {userRSVPs.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-bounce-soft" />
                <p className="text-xs font-sans">{isBn ? 'আপাতত আপনার কোনো ইভেন্ট টিকেট জেনারেট করা নেই।' : 'You have not registered for any upcoming meetings yet.'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userRSVPs.map((evt) => (
                  <div key={evt.id} className="p-4 bg-slate-50 border border-slate-205 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden font-sans">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="text-[9px] bg-emerald-50 text-brand-green border border-emerald-100 font-bold uppercase px-2 py-0.5 rounded-md">RSVP CONFIRMED</span>
                      <h5 className="font-extrabold text-sm text-slate-800 leading-tight">{isBn ? evt.titleBn : evt.title}</h5>
                      <div className="text-[10px] text-slate-550 flex items-center gap-1 mt-1 justify-center sm:justify-start">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{isBn ? evt.venueBn : evt.venue}</span>
                      </div>
                    </div>

                    <div className="text-center sm:text-right shrink-0">
                      <div className="text-xs text-primary-blue font-bold font-mono">TICKET ID: BUSD-{evt.id}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{evt.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 2. SUPER ADMIN INTEGRATED DASHBOARD
function AdminDashboardView({
  language,
  stats,
  onApproveMember,
  onAddNews,
  onAddEvent,
  onAddGallery
}: {
  language: Language;
  stats: any;
  onApproveMember: any;
  onAddNews: any;
  onAddEvent: any;
  onAddGallery: any;
}) {
  const isBn = language === 'bn';
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'queue' | 'add_event' | 'add_news' | 'donations' | 'gallery'>('queue');

  // Stats fallbacks
  const pendingQueue = stats?.allMembers?.filter((m: Member) => m.status === 'Pending') || [];
  const approvedList = stats?.allMembers?.filter((m: Member) => m.status === 'Approved') || [];
  const totalAmount = stats?.totalDonations || 0;
  const volunteersList = stats?.volunteers || [];
  const logs = stats?.auditLogs || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Visual Counters Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-white font-sans">
        <div className="p-5 bg-gradient-to-tr from-indigo-750 to-indigo-600 rounded-3xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-xs font-bold leading-none">{isBn ? 'নিবন্ধন অপেক্ষমান' : 'Pending Approvals'}</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">{pendingQueue.length}</div>
          <span className="block text-[10px] text-indigo-200">Needs instant review</span>
        </div>

        <div className="p-5 bg-gradient-to-tr from-emerald-700 to-emerald-500 rounded-3xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-xs font-bold leading-none">{isBn ? 'সক্রিয় সদস্য' : 'Approved Members'}</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">{approvedList.length}</div>
          <span className="block text-[10px] text-emerald-100">Official general database</span>
        </div>

        <div className="p-5 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-3xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-xs font-bold leading-none">{isBn ? 'সংগৃহীত অনুদান' : 'Donations Pool'}</span>
            <Coins className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">৳{totalAmount.toLocaleString()}</div>
          <span className="block text-[10px] text-amber-100">Social welfare ledger</span>
        </div>

        <div className="p-5 bg-gradient-to-tr from-rose-700 to-rose-500 rounded-3xl space-y-1.5 shadow-sm">
          <div className="flex justify-between items-center opacity-70">
            <span className="text-xs font-bold text-rose-100 leading-none">{isBn ? 'স্বেচ্ছাসেবী কর্মী' : 'Registered Volunteers'}</span>
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono">{volunteersList.length}</div>
          <span className="block text-[10px] text-rose-100">Active mobilization corps</span>
        </div>
      </div>

      {/* Admin Menu bar */}
      <div className="flex overflow-x-auto border-b border-slate-200 no-scrollbar gap-2 pb-1 text-xs">
        <button
          onClick={() => setActiveAdminSubTab('queue')}
          className={`px-4 py-2 font-bold rounded-lg shrink-0 ${
            activeAdminSubTab === 'queue' ? 'bg-primary-blue text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {isBn ? `আবেদন কিউ (${pendingQueue.length})` : `Application Queue (${pendingQueue.length})`}
        </button>

        <button
          onClick={() => setActiveAdminSubTab('add_event')}
          className={`px-4 py-2 font-bold rounded-lg shrink-0 ${
            activeAdminSubTab === 'add_event' ? 'bg-primary-blue text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {isBn ? 'ইভেন্ট শিডিউল করুন' : 'Schedule Event'}
        </button>

        <button
          onClick={() => setActiveAdminSubTab('add_news')}
          className={`px-4 py-2 font-bold rounded-lg shrink-0 ${
            activeAdminSubTab === 'add_news' ? 'bg-primary-blue text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {isBn ? 'বিজ্ঞপ্তি / নোটিশ প্রেরণ' : 'Publish Notice'}
        </button>

        <button
          onClick={() => setActiveAdminSubTab('gallery')}
          className={`px-4 py-2 font-bold rounded-lg shrink-0 ${
            activeAdminSubTab === 'gallery' ? 'bg-primary-blue text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {isBn ? 'গ্যালারি সংযোজন' : 'Gallery Upload'}
        </button>

        <button
          onClick={() => setActiveAdminSubTab('donations')}
          className={`px-4 py-2 font-bold rounded-lg shrink-0 ${
            activeAdminSubTab === 'donations' ? 'bg-primary-blue text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          {isBn ? 'হিসাব অডিট ও লগ' : 'Audit Logs & Ledger'}
        </button>
      </div>

      {/* ADMIN SUB VIEWS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[300px]">
        {/* SUB 1: QUEUE REVIEW WORKFLOW */}
        {activeAdminSubTab === 'queue' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-650 pl-2">
              {isBn ? 'নিবন্ধন করতে অপেক্ষমান আবেদনকারীদের প্রোফাইল মূল্যায়ন' : 'Review Pending Member Registrations'}
            </h4>

            {pendingQueue.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Check className="p-3 bg-emerald-50 text-brand-green border border-emerald-100 rounded-full w-fit mx-auto mb-2" />
                <p className="text-xs font-semibold">{isBn ? 'অপেক্ষমান কোনো আবেদন নেই। সব সফলভাবে রিভিউ করা হয়েছে!' : 'Application queue is empty. All profiles reviewed.'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingQueue.map((m: Member) => (
                  <div key={m.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between font-sans">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-12 h-12 rounded-xl overflow-hidden tracking-wider text-slate-400 shrink-0 border border-slate-200">
                        <img src={m.profilePhoto} alt={m.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-xs text-slate-505 leading-snug">
                        <strong className="block text-slate-800 text-sm font-bold font-sans">{isBn ? m.nameBn : m.name}</strong>
                        <span>{m.email} / {m.phone}</span>
                        <span className="block opacity-80 mt-1 font-semibold text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 p-0.5 rounded w-fit">
                          Category: {m.category} Member • Home Union: {m.union}
                        </span>
                      </div>
                    </div>

                    {/* Actions bar for Approval decision */}
                    <div className="flex gap-2 w-full md:w-auto justify-end">
                      <button
                        onClick={async () => {
                          if (confirm(isBn ? 'আবেদনটি বাতিল করতে চান?' : 'Are you sure to decline this application?')) {
                            await onApproveMember(m.id, 'Declined');
                          }
                        }}
                        className="bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 flex items-center gap-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={async () => {
                          await onApproveMember(m.id, 'Approved');
                        }}
                        className="bg-brand-green hover:bg-emerald-700 text-white px-5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve member</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUB 2: CREATE EVENT */}
        {activeAdminSubTab === 'add_event' && (
          <AdminAddEventForm onAddEvent={onAddEvent} language={language} />
        )}

        {/* SUB 3: CREATE NEWS / NOTICE */}
        {activeAdminSubTab === 'add_news' && (
          <AdminAddNewsForm onAddNews={onAddNews} language={language} />
        )}

        {/* SUB 4: ADD GALLERY MEDIA */}
        {activeAdminSubTab === 'gallery' && (
          <AdminAddGalleryForm onAddGallery={onAddGallery} language={language} />
        )}

        {/* SUB 5: AUDIT LOGS LEDGER LISTS */}
        {activeAdminSubTab === 'donations' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-800 text-sm border-l-4 border-slate-300 pl-2">
              {isBn ? 'সিস্টেম কার্যক্রম অডিট লগ ও অনুদান রিপোর্ট' : 'Audit Logs & Contributions ledger'}
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-sans">
              {/* Audit occurrences logs scrollbar */}
              <div className="space-y-4">
                <span className="font-extrabold text-slate-500 uppercase tracking-wide">System Activities (Real-time Audit Logs)</span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-[300px] overflow-y-auto space-y-2.5 font-mono">
                  {logs.map((lg: any) => (
                    <div key={lg.id} className="text-[10px] text-slate-600 border-b border-slate-100 pb-1.5 space-y-0.5">
                      <div className="text-slate-400 font-mono text-[9px]">{new Date(lg.timestamp).toLocaleString()}</div>
                      <p className="font-medium text-slate-700">{lg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Volunteer records list */}
              <div className="space-y-4">
                <span className="font-extrabold text-slate-500 uppercase tracking-wide">Registered Volunteer Corps ({volunteersList.length})</span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-h-[300px] overflow-y-auto space-y-2">
                  {volunteersList.length === 0 ? (
                    <p className="text-slate-400 italic">No volunteers registered yet.</p>
                  ) : (
                    volunteersList.map((v: Volunteer) => (
                      <div key={v.id} className="p-2 bg-white rounded-xl border border-slate-150 space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{isBn ? v.nameBn : v.name} ({v.phone})</span>
                          <span className="text-[9px] bg-green-50 text-brand-green border border-green-100 px-1.5 py-0.5 rounded uppercase">Verified</span>
                        </div>
                        <p className="text-[10px] text-slate-500">Skills Selected: <strong className="font-bold">{v.skills.join(', ')}</strong></p>
                        {v.message && <p className="text-[10px] italic text-slate-400">"{v.message}"</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============== ADMIN PANEL INTERCHANGEABLE FORMS ============

function AdminAddEventForm({ onAddEvent, language }: { onAddEvent: any; language: Language }) {
  const isBn = language === 'bn';
  const [fields, setFields] = useState({
    title: '', titleBn: '', date: '', time: '', timeBn: '', venue: '', venueBn: '', description: '', descriptionBn: '', fee: '0', bannerUrl: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddEvent({ ...fields, fee: Number(fields.fee) });
    if (ok) {
      setSuccess(true);
      setFields({ title: '', titleBn: '', date: '', time: '', timeBn: '', venue: '', venueBn: '', description: '', descriptionBn: '', fee: '0', bannerUrl: '' });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto text-xs font-sans">
      <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2 mb-4">
        {isBn ? 'নতুন ইভেন্ট এর শিডিউল তথ্য' : 'Schedule New Event Program'}
      </h4>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
          Event scheduled and saved in database ledger!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Event Title (English)*</label>
          <input required type="text" placeholder="e.g. Free Medical eye Camp" value={fields.title} onChange={(e) => setFields({ ...fields, title: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Event Title (Bangla)*</label>
          <input required type="text" placeholder="উদা: ফ্রী আই চিকিৎসা ক্যাম্প" value={fields.titleBn} onChange={(e) => setFields({ ...fields, titleBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Date*</label>
          <input required type="date" value={fields.date} onChange={(e) => setFields({ ...fields, date: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Venue (English)*</label>
          <input required type="text" placeholder="IEB Hall, Ramna Dhaka" value={fields.venue} onChange={(e) => setFields({ ...fields, venue: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Venue (Bangla)*</label>
          <input required type="text" placeholder="ইঞ্জিনিয়ার্স ইনস্টিটিউট হলরুম, রমনা ঢাকা" value={fields.venueBn} onChange={(e) => setFields({ ...fields, venueBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Reg Ticket Fee (0 is free)</label>
          <input type="number" placeholder="0" value={fields.fee} onChange={(e) => setFields({ ...fields, fee: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white font-mono" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-600 mb-1 font-semibold">Cover Banner Image URL</label>
          <input type="url" placeholder="https://images.unsplash.com/photo-X" value={fields.bannerUrl} onChange={(e) => setFields({ ...fields, bannerUrl: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-600 mb-1 font-semibold">Program details description (English)</label>
          <textarea rows={2} value={fields.description} onChange={(e) => setFields({ ...fields, description: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-600 mb-1 font-semibold">Program details description (Bangla)</label>
          <textarea rows={2} value={fields.descriptionBn} onChange={(e) => setFields({ ...fields, descriptionBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary-blue hover:bg-dark-blue text-white font-bold p-3 px-8 rounded-xl text-xs uppercase flex items-center gap-1">
          <CalendarPlus className="w-4 h-4" />
          <span>Save Event Calendar</span>
        </button>
      </div>
    </form>
  );
}

function AdminAddNewsForm({ onAddNews, language }: { onAddNews: any; language: Language }) {
  const isBn = language === 'bn';
  const [fields, setFields] = useState({
    title: '', titleBn: '', category: 'Notice', summary: '', summaryBn: '', details: '', detailsBn: '', isFeatured: false, pdfUrl: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddNews(fields);
    if (ok) {
      setSuccess(true);
      setFields({ title: '', titleBn: '', category: 'Notice', summary: '', summaryBn: '', details: '', detailsBn: '', isFeatured: false, pdfUrl: '' });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto text-xs font-sans">
      <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2 mb-4">
        {isBn ? 'নতুন বিজ্ঞপ্তি বা সংবাদ প্রকাশনা' : 'Publish New Notice Circular / News'}
      </h4>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
          Announcement published and saved on live frontend screen!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Title (English)*</label>
          <input required type="text" placeholder="e.g. Member AGM Open" value={fields.title} onChange={(e) => setFields({ ...fields, title: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Title (Bangla)*</label>
          <input required type="text" placeholder="উদা: সাধারণ পরিষদ আবেদন খোলা" value={fields.titleBn} onChange={(e) => setFields({ ...fields, titleBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Category Type</label>
          <select value={fields.category} onChange={(e) => setFields({ ...fields, category: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white">
            <option value="Notice">Notice (অফিসিয়াল বিজ্ঞপ্তি)</option>
            <option value="News">News (সমিতির সংবাদ রিপোর্টিং)</option>
            <option value="Scholarship">Scholarship (মেধাবৃত্তি ও স্টাইপেন্ড)</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">PDF Gazette attachment URL (Optional)</label>
          <input type="url" placeholder="https://www.w3.org/WAI/resources/test.pdf" value={fields.pdfUrl} onChange={(e) => setFields({ ...fields, pdfUrl: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-600 mb-1 font-semibold">Summary (Bangla)</label>
          <input type="text" placeholder="Summary sentence..." value={fields.summaryBn} onChange={(e) => setFields({ ...fields, summaryBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-600 mb-1 font-semibold">Full details script (English)*</label>
          <textarea required rows={3} value={fields.details} onChange={(e) => setFields({ ...fields, details: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-slate-600 mb-1 font-semibold">Full details script (Bangla)*</label>
          <textarea required rows={3} value={fields.detailsBn} onChange={(e) => setFields({ ...fields, detailsBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer col-span-2">
          <input type="checkbox" checked={fields.isFeatured} onChange={(e) => setFields({ ...fields, isFeatured: e.target.checked })} className="rounded border-slate-300 text-primary-blue w-4 h-4" />
          <span className="font-semibold text-slate-700">Display this in featured banner list</span>
        </label>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary-blue hover:bg-dark-blue text-white font-bold p-3 px-8 rounded-xl text-xs uppercase flex items-center gap-1">
          <FilePlus className="w-4 h-4" />
          <span>Publish Notice board</span>
        </button>
      </div>
    </form>
  );
}

function AdminAddGalleryForm({ onAddGallery, language }: { onAddGallery: any; language: Language }) {
  const isBn = language === 'bn';
  const [fields, setFields] = useState({
    title: '', titleBn: '', type: 'photo', url: '', category: 'Reunion', categoryBn: 'মিলন মেলা'
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddGallery(fields);
    if (ok) {
      setSuccess(true);
      setFields({ title: '', titleBn: '', type: 'photo', url: '', category: 'Reunion', categoryBn: 'মিলন মেলা' });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto text-xs font-sans">
      <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2 mb-4">
        {isBn ? 'নতুন ফটো বা ভিডিও গ্যালারি সংযোজন' : 'Add New Gallery Photo/Video'}
      </h4>

      {success && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
          Media item successfully loaded to gallery!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Title (English)*</label>
          <input required type="text" placeholder="Inauguration speech" value={fields.title} onChange={(e) => setFields({ ...fields, title: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Title (Bangla)*</label>
          <input required type="text" placeholder="উদ্বোধনী বক্তব্য" value={fields.titleBn} onChange={(e) => setFields({ ...fields, titleBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Media Format</label>
          <select value={fields.type} onChange={(e) => setFields({ ...fields, type: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white">
            <option value="photo">Photo (স্থির চিত্র)</option>
            <option value="video">Video embed (ইউটিউব ভিডিও)</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">
            {fields.type === 'photo' ? 'Photo Image URL*' : 'YouTube Video ID (11 chars)*'}
          </label>
          <input required type="text" placeholder={fields.type === 'photo' ? 'https://images.unsplash.com/...' : 'dQw4w9WgXcQ'} value={fields.url} onChange={(e) => setFields({ ...fields, url: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Category (English)*</label>
          <input required type="text" placeholder="Reunion" value={fields.category} onChange={(e) => setFields({ ...fields, category: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
        <div>
          <label className="block text-slate-600 mb-1 font-semibold">Category (Bangla)*</label>
          <input required type="text" placeholder="মিলন মেলা" value={fields.categoryBn} onChange={(e) => setFields({ ...fields, categoryBn: e.target.value })} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" className="bg-primary-blue hover:bg-dark-blue text-white font-bold p-3 px-8 rounded-xl text-xs uppercase flex items-center gap-1">
          <ImagePlus className="w-4 h-4" />
          <span>Upload media</span>
        </button>
      </div>
    </form>
  );
}
