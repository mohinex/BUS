import React, { useState } from 'react';
import { EventLog, NewsLog, Language } from '../types';
import { Calendar, Clock, MapPin, Search, ChevronRight, CheckCircle2, Ticket, FileDown, Eye, FileText, Bell, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EventNewsProps {
  language: Language;
  events: EventLog[];
  news: NewsLog[];
  userEmail: string | null;
  onEventRSVP: (eventId: string) => Promise<{ success: boolean; message: string; error?: string }>;
}

// EVENTS & PROGRAMS COMPONENT
export function EventsProgramsView({ language, events, userEmail, onEventRSVP }: EventNewsProps) {
  const isBn = language === 'bn';
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  const [rsvpSuccessEvent, setRsvpSuccessEvent] = useState<EventLog | null>(null);
  const [selectedEventDetails, setSelectedEventDetails] = useState<EventLog | null>(null);

  const filteredEvents = events.filter(e => e.status === activeTab);

  const handleRSVPClick = async (e: React.MouseEvent, event: EventLog) => {
    e.stopPropagation(); // Avoid opening details modal
    if (!userEmail) {
      alert(isBn ? 'অনুগ্রহ করে ইভেন্টে রেজিস্ট্রেশন করতে প্রথমে মেম্বার পোর্টালে লগইন করুন।' : 'Please log into the Member Panel first to RSVP.');
      return;
    }

    setRsvpLoading(event.id);
    try {
      const resp = await onEventRSVP(event.id);
      if (resp.success) {
        setRsvpSuccessEvent(event);
      } else {
        alert(resp.error || "Reg error");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRsvpLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-dark-blue font-sans tracking-tight">
          {isBn ? 'ইভেন্ট ও কর্মসূচী' : 'Events & Programs'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed">
          {isBn
            ? 'ঢাকায় বসবাসরত সদস্যদের সামাজিক উন্নয়ন, সেবামূলক প্রজেক্ট এবং বার্ষিক আনন্দ উৎসবের বিবরণ।'
            : 'Explore, register, and sync our upcoming humanitarian work, blood donation drives, and cultural assemblies.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('Upcoming')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'Upcoming' ? 'bg-primary-blue text-white shadow-sm' : 'text-slate-505 hover:text-slate-800'
            }`}
          >
            {isBn ? 'আসন্ন ইভেন্টসমূহ' : 'Upcoming Work'}
          </button>
          <button
            onClick={() => setActiveTab('Past')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === 'Past' ? 'bg-primary-blue text-white shadow-sm' : 'text-slate-505 hover:text-slate-800'
            }`}
          >
            {isBn ? 'সম্পন্ন ইভেন্টসমূহ' : 'Past Events'}
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-150">
          <Calendar className="w-12 h-12 text-slate-350 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-sans">
            {isBn ? 'আপাতত কোনো ইভেন্ট নেই।' : `No ${activeTab.toLowerCase()} event items found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const hasAttended = userEmail ? evt.attendees.includes(userEmail) : false;
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventDetails(evt)}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md cursor-pointer transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                    <img src={evt.bannerUrl} alt={evt.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
                    <div className="absolute top-2 right-2 bg-dark-blue/80 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-lg">
                      {evt.fee === 0 ? (isBn ? 'ফ্রি ইভেন্ট' : 'Free Entry') : (isBn ? `ফি: ৳${evt.fee}` : `Fee: BDT ${evt.fee}`)}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-snug group-hover:text-primary-blue transition-colors">
                      {isBn ? evt.titleBn : evt.title}
                    </h4>
                    
                    <p className="text-slate-500 text-xs font-sans line-clamp-2">
                      {isBn ? evt.descriptionBn : evt.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 space-y-4">
                  {/* Specs */}
                  <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-650 font-sans border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary-blue" />
                      <span className="font-semibold">{isBn ? new Date(evt.date).toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : new Date(evt.date).toDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? evt.timeBn : evt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{isBn ? evt.venueBn : evt.venue}</span>
                    </div>
                  </div>

                  {/* Booking Link / Status Button */}
                  {evt.status === 'Upcoming' && (
                    <button
                      onClick={(e) => handleRSVPClick(e, evt)}
                      disabled={rsvpLoading === evt.id || hasAttended}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5 border ${
                        hasAttended
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-primary-blue hover:bg-dark-blue text-white shadow-sm border-transparent'
                      }`}
                    >
                      {rsvpLoading === evt.id ? (
                        <span>{isBn ? 'প্রসেসিং হচ্ছে...' : 'Processing...'}</span>
                      ) : hasAttended ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{isBn ? 'বুকিং নিশ্চিত' : 'Registered / RSVP-ed'}</span>
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4" />
                          <span>{isBn ? 'রেজিস্ট্রেশন করুন' : 'Confirm Attend / RSVP'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Details Overlay Popup */}
      <AnimatePresence>
        {selectedEventDetails && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-150 text-slate-800 flex flex-col max-h-[90vh]"
            >
              {/* Image banner details */}
              <div className="h-48 sm:h-64 bg-slate-100 overflow-hidden relative">
                <img src={selectedEventDetails.bannerUrl} alt={selectedEventDetails.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedEventDetails(null)}
                  className="absolute right-4 top-4 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/60 p-2 rounded-full text-white transition-colors"
                >
                  ✕
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white text-sans">
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                    {selectedEventDetails.status}
                  </span>
                  <h4 className="text-lg sm:text-2xl font-bold mt-1">
                    {isBn ? selectedEventDetails.titleBn : selectedEventDetails.title}
                  </h4>
                </div>
              </div>

              {/* Scrolling Details description */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <p className="text-slate-600 text-sm leading-relaxed font-sans font-light">
                  {isBn ? selectedEventDetails.descriptionBn : selectedEventDetails.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1">
                    <span className="text-slate-400 block">{isBn ? "ভেন্যু ঠিকানা" : "Venue Location"}</span>
                    <span className="font-semibold text-slate-700">{isBn ? selectedEventDetails.venueBn : selectedEventDetails.venue}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1">
                    <span className="text-slate-400 block">{isBn ? "তারিখ ও সময়" : "Schedule Date & Time"}</span>
                    <span className="font-semibold text-slate-700">
                      {selectedEventDetails.date} ({isBn ? selectedEventDetails.timeBn : selectedEventDetails.time})
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1">
                    <span className="text-slate-400 block">{isBn ? "প্রবেশ ফি (টাকা)" : "Entry Ticket Charge"}</span>
                    <span className="font-bold text-dark-blue">
                      {selectedEventDetails.fee === 0 ? (isBn ? 'ফ্রি এন্ট্রি' : 'Free Entry') : `${selectedEventDetails.fee} BDT`}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-1">
                    <span className="text-slate-400 block">{isBn ? "মোট বুকিং সংখ্যা" : "Attendee Registrations"}</span>
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {selectedEventDetails.attendeesCount} {isBn ? 'জন নিবন্ধিত' : 'registered'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Footer bar */}
              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-t border-slate-150">
                <span className="text-[10px] text-slate-400">ID: {selectedEventDetails.id}</span>
                <button
                  onClick={() => setSelectedEventDetails(null)}
                  className="bg-primary-blue hover:bg-dark-blue text-white text-xs font-bold px-6 py-2 rounded-xl transition-colors"
                >
                  {isBn ? 'ফিরে যান' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RSVP Ticket confirmation popup */}
      <AnimatePresence>
        {rsvpSuccessEvent && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ rotate: -5, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              className="bg-gradient-to-b from-blue-50 to-white text-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-sm text-center relative shadow-2xl border border-slate-200"
            >
              <div className="p-3 bg-emerald-50 text-brand-green rounded-full w-fit mx-auto mb-4 border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-800 font-sans">
                {isBn ? 'বুকিং সফল হয়েছে!' : 'Seat Confirmed Successfully!'}
              </h4>
              <p className="text-xs text-slate-500 mt-2 font-sans">
                {isBn
                  ? 'আপনার ইভেন্ট পাসের টিকিট জেনারেট করা হয়েছে। এটি মেম্বার ড্যাশবোর্ডে সংরক্ষিত থাকবে।'
                  : 'Your automated digital entry slip has been compiled, searchable under your member panel.'}
              </p>

              {/* Render visual slip style ticket wrapper */}
              <div className="my-6 border-2 border-dashed border-slate-250 p-4 rounded-2xl bg-white text-slate-700 text-left space-y-3 font-sans relative">
                <div className="absolute -top-3 -left-3 w-5 h-5 bg-blue-50 rounded-full border-r border-slate-200" />
                <div className="absolute -top-3 -right-3 w-5 h-5 bg-blue-50 rounded-full border-l border-slate-200" />
                
                <h5 className="font-extrabold text-xs text-dark-blue truncate">
                  {isBn ? rsvpSuccessEvent.titleBn : rsvpSuccessEvent.title}
                </h5>
                <div className="flex justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-[9px] text-slate-400">{isBn ? "তারিখ" : "DATE"}</span>
                    <span className="font-bold">{rsvpSuccessEvent.date}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400">{isBn ? "ভেন্যু হল" : "HALL GATE"}</span>
                    <span className="font-bold truncate">{isBn ? "ইঞ্জিনিয়ার্স হল" : "IEB Gate 1"}</span>
                  </div>
                </div>

                {/* QR barcode mockup */}
                <div className="flex justify-center pt-3 border-t border-dashed border-slate-150">
                  <div className="w-24 h-24 bg-slate-50 border border-slate-200 p-2 flex items-center justify-center">
                    {/* Simulated pixel QR block */}
                    <div className="grid grid-cols-5 gap-1.5 w-full h-full opacity-70">
                      {[...Array(25)].map((_, idx) => (
                        <div key={idx} className={`w-full h-full ${idx % 3 === 0 || idx % 7 === 1 ? 'bg-slate-800' : 'bg-transparent'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRsvpSuccessEvent(null)}
                className="w-full bg-primary-blue hover:bg-dark-blue text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-sm"
              >
                {isBn ? 'টিকিট বন্ধ করুন' : 'Got It, Close'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// NEWS & NOTICES SYSTEM
export function NewsNoticesView({ language, news }: { language: Language; news: NewsLog[] }) {
  const isBn = language === 'bn';
  const [newsFilter, setNewsFilter] = useState<'All' | 'Notice' | 'News' | 'Scholarship'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsLog | null>(null);

  const filteredNews = news.filter(n => {
    const matchesFilter = newsFilter === 'All' || n.category === newsFilter;
    const textToMatch = `${n.title} ${n.titleBn} ${n.summary} ${n.summaryBn} ${n.category} ${n.details} ${n.detailsBn}`.toLowerCase();
    const matchesSearch = textToMatch.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-dark-blue font-sans tracking-tight">
          {isBn ? 'সংবাদ, নোটিশ ও বিজ্ঞপ্তি' : 'News & Notice Board'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans">
          {isBn
            ? 'উপজেলা সমিতির সর্বশেষ কার্যক্রম, সাধারণ সভার নোটিশ, মেধাবৃত্তি বিজ্ঞপ্তি এবং জরুরি সার্কুলার প্রাঙ্গণ।'
            : 'Access official corporate directories, policy drafts, PDF circulars, and ongoing charity reports.'}
        </p>
      </div>

      {/* Categories Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-150 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={isBn ? 'খবর ও নোটিশ খুঁজুন...' : 'Search news, circulars...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['All', 'Notice', 'News', 'Scholarship'].map((cat) => (
            <button
              key={cat}
              onClick={() => setNewsFilter(cat as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                newsFilter === cat
                  ? 'bg-primary-blue text-white shadow-sm'
                  : 'bg-slate-103 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'All' ? (isBn ? 'সব নোটিশ' : 'All Board') :
               cat === 'Notice' ? (isBn ? 'জরুরি নোটিশ' : 'Notices') :
               cat === 'News' ? (isBn ? 'সমিতির খবর' : 'News Reports') : (isBn ? 'মেধাবৃত্তি' : 'Scholarships')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of articles */}
      {filteredNews.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-150">
          <FileText className="w-12 h-12 text-slate-350 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-sans">
            {isBn ? 'কোনো খবর বা নোটিশ পাওয়া যায়নি।' : 'No articles match your selection filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((art, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={art.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-primary-blue hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Meta properties */}
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className={`px-2 py-0.5 rounded-md font-bold ${
                    art.category === 'Notice' ? 'bg-red-50 text-red-650' :
                    art.category === 'Scholarship' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-primary-blue'
                  }`}>
                    {isBn ? art.categoryBn : art.category}
                  </span>
                  <span className="text-slate-400">{art.date}</span>
                </div>

                <h4 className="font-bold text-slate-800 text-base sm:text-lg leading-snug">
                  {isBn ? art.titleBn : art.title}
                </h4>

                <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed line-clamp-3">
                  {isBn ? art.summaryBn : art.summary}
                </p>
              </div>

              {/* Actions pane */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                {art.pdfUrl ? (
                  <a
                    href={art.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-rose-600 font-semibold hover:underline flex items-center gap-1 font-sans"
                  >
                    <FileDown className="w-4 h-4 shrink-0" />
                    <span>{isBn ? 'PDF ডাউনলোড করুন' : 'Download PDF Circular'}</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-slate-400 font-mono">BUSD-CORP-NOTICE-{art.id}</span>
                )}

                <button
                  onClick={() => setActiveArticle(art)}
                  className="text-xs font-bold text-primary-blue hover:text-dark-blue flex items-center gap-0.5 uppercase tracking-wide"
                >
                  <span>{isBn ? 'বিস্তারিত পড়ুন' : 'Read Article'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Article Detail Large popup model */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-xl overflow-hidden border border-slate-150 text-slate-800 flex flex-col max-h-[85vh]"
            >
              <div className="bg-gradient-official text-white px-6 py-5 relative">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="absolute right-4 top-4 hover:bg-white/10 p-1.5 rounded-full text-white/80 transition-colors"
                >
                  ✕
                </button>
                <div className="flex items-center gap-2 mb-1 text-xs">
                  <span className="bg-white/20 text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {isBn ? activeArticle.categoryBn : activeArticle.category}
                  </span>
                  <span className="text-white/70">{activeArticle.date}</span>
                </div>
                <h4 className="text-base sm:text-xl font-bold leading-snug font-sans">
                  {isBn ? activeArticle.titleBn : activeArticle.title}
                </h4>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1 font-sans">
                <div className="text-slate-700 text-sm leading-relaxed space-y-3 font-sans font-light white-space-pre-line">
                  {isBn 
                    ? (activeArticle.detailsBn || activeArticle.details).split('\n').map((para, i) => <p key={i}>{para}</p>)
                    : activeArticle.details.split('\n').map((para, i) => <p key={i}>{para}</p>)}
                </div>

                {activeArticle.pdfUrl && (
                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-center justify-between text-xs text-rose-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-rose-650" />
                      <div>
                        <span className="font-bold block">{isBn ? "অফিসিয়াল গেজেট কপি" : "Official Notice Circular.pdf"}</span>
                        <span className="opacity-70 text-[10px]">{isBn ? "সাইজ: ২.৪ এমবি" : "Size: 2.4 MB"}</span>
                      </div>
                    </div>
                    <a
                      href={activeArticle.pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>{isBn ? "ডাউনলোড" : "Download"}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center text-xs text-slate-400">
                <span>{isBn ? "বালিয়াকান্দি উপজেলা সমিতি, ঢাকা" : "Baliakandi Upazila Samiti Office"}</span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-primary-blue hover:bg-dark-blue text-white font-semibold px-4 py-1.5 rounded-lg"
                >
                  {isBn ? "ঠিক আছে" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
