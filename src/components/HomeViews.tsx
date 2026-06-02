import React from 'react';
import { Language, Member, EventLog, NewsLog, GalleryItem } from '../types';
import { Calendar, MapPin, ArrowRight, ShieldCheck, Heart, Award, Sparkles, BookOpen, Clock, Users, ArrowUpRight, Megaphone } from 'lucide-react';
import { motion } from 'motion/react';
import SVGEmblem from './SVGEmblem';

interface HomeProps {
  language: Language;
  events: EventLog[];
  newsList: NewsLog[];
  members: Member[];
  donationsTotal: number;
  setActiveTab: (tab: string) => void;
  onJoinUsClick: () => void;
}

export default function HomeViews({
  language,
  events,
  newsList,
  members,
  donationsTotal,
  setActiveTab,
  onJoinUsClick
}: HomeProps) {
  const isBn = language === 'bn';

  // Slice featured news and events
  const featuredNotices = newsList.filter(n => n.category === 'Notice' || n.isFeatured).slice(0, 3);
  const featuredEvents = events.slice(0, 2);

  return (
    <div className="space-y-16">
      {/* 1. HERO MAIN SECTOR BANNER */}
      <div className="relative bg-gradient-to-r from-[#0A4E9E] to-[#39A0FF] rounded-[32px] overflow-hidden shadow-xl p-8 sm:p-12 lg:p-16 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,0 50,50 T100,50 L100,100 L0,100 Z" fill="white"/>
          </svg>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-white/10 font-sans">
              {isBn ? 'অফিসিয়াল ওয়েব পোর্টাল' : 'Welcome to Official Website'}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight drop-shadow-sm font-sans">
                {isBn ? 'বালিয়াকান্দি উপজেলা সমিতি' : 'Baliakandi Upazila Samiti'}
              </h1>
              <div className="text-xl sm:text-2xl font-bold text-yellow-300 font-sans opacity-95">
                {isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}
              </div>
            </div>
            
            <p className="text-blue-50 text-base sm:text-lg font-light italic border-l-4 border-[#15803D] pl-4 py-1 leading-relaxed">
              {isBn ? '“ঐক্যে শক্তি, সমাজ উন্নয়নে প্রতিশ্রুতিবদ্ধ”' : '“United in Fellowship, Committed to Social Growth”'}
            </p>
            
            <p className="text-blue-100 text-xs sm:text-sm font-light leading-relaxed max-w-xl font-sans">
              {isBn
                ? 'রাজবাড়ী জেলার ঐতিহাসিক বালিয়াকান্দি উপজেলার ঢাকায় বসবাসরত বাসিন্দাদের পারস্পরিক সহযোগিতা, সৌহার্দ্য ও সামাজিক কল্যাণ নিশ্চিতকরণের একটি নিরলস অরাজনৈতিক চালিকাশক্তি।'
                : 'A premium community trust strengthening absolute social solidarity, mutual assistance, and education welfare of Baliakandi Upazila natives living in Dhaka Metro.'}
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={onJoinUsClick}
                className="bg-white text-[#0E72C8] hover:bg-blue-50 font-extrabold px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all text-xs uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>{isBn ? 'সদস্যপদ নিবন্ধন করুন' : 'Apply Online Member'}</span>
                <ArrowRight className="w-4 h-4 text-[#0E72C8]" />
              </button>

              <button
                onClick={() => setActiveTab('donation')}
                className="bg-[#15803D] hover:bg-emerald-700 text-white font-extrabold px-6 sm:px-8 py-3 rounded-xl shadow-lg flex items-center gap-2 transition-all text-xs uppercase cursor-pointer"
              >
                <span>{isBn ? 'অনুদানের মাধ্যমে পাশে থাকুন' : 'Contribute to Fund'}</span>
                <Heart className="w-4 h-4 text-white fill-white" />
              </button>
            </div>
          </div>
          
          {/* Hero Right Decorative Column */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 bg-white/10 rounded-full flex items-center justify-center p-4 border border-white/20">
              <div className="w-full h-full bg-white rounded-full p-6 shadow-2xl flex flex-col items-center justify-center text-center">
                <div className="text-[#15803D] mb-2 animate-pulse-soft">
                  <SVGEmblem size={90} />
                </div>
                <span className="text-[#0A4E9E] font-bold text-sm tracking-tighter block mt-2">
                  {isBn ? 'স্থাপিত: ২০০৮' : 'Established: 2008'}
                </span>
                <div className="h-1 w-12 bg-[#15803D] my-1.5"></div>
                <span className="text-slate-500 text-[9px] font-bold uppercase tracking-wider font-mono">BADC Affiliated</span>
              </div>
            </div>
            
            {/* Floating Dynamic Statistics Badge */}
            <div className="absolute -top-2 right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-pulse-soft">
              <div className="w-10 h-10 bg-blue-105/90 text-[#0E72C8] rounded-full flex items-center justify-center bg-blue-50">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left font-sans">
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">
                  {isBn ? '২,৫০০+' : '2,500+'}
                </div>
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                  {isBn ? 'সক্রিয় সদস্য' : 'Active Members'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC COUNTER STATISTICS BAR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-sans">
        <div className="space-y-1">
          <div className="p-3 bg-blue-50 text-primary-blue rounded-2xl w-fit mx-auto mb-1">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-sans text-dark-blue">
            {isBn ? '৯০০+' : '900+'}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{isBn ? 'নিবন্ধিত সদস্য' : 'Active Members'}</div>
        </div>

        <div className="space-y-1">
          <div className="p-3 bg-emerald-50 text-brand-green rounded-2xl w-fit mx-auto mb-1">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-sans text-dark-blue">
            ৳{donationsTotal.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{isBn ? 'সংগৃহীত অনুদান' : 'Donations Pooled'}</div>
        </div>

        <div className="space-y-1">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mx-auto mb-1">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-sans text-dark-blue">
            {isBn ? '১৫+' : '15+'}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{isBn ? 'বার্ষিক উন্নয়ন প্রজেক্ট' : 'Active Welfare Projects'}</div>
        </div>

        <div className="space-y-1">
          <div className="p-3 bg-red-50 text-red-500 rounded-2xl w-fit mx-auto mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-xl sm:text-2xl font-black font-sans text-dark-blue">
            {isBn ? '০৮+' : '08+'}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{isBn ? 'মেডিকেল ও ত্রাণ সামগ্রী ক্যাম্প' : 'Medical Camp runs'}</div>
        </div>
      </div>

      {/* 3. INTRODUCTORY CARD Splitter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-5">
          <span className="text-[10px] font-bold text-primary-blue bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
            {isBn ? 'স্বাগতম ও আমাদের মিশন' : 'Welcome Note'}
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 leading-tight tracking-tight font-sans">
            {isBn
              ? 'ঐতিহাসিক বালিয়াকান্দি উপজেলাবাসীর সামাজিক ঐক্যের মেলবন্ধন'
              : 'Empowering the South-Bengal Diaspora in Dhaka.'}
          </h3>
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-sans font-light">
            {isBn
              ? 'বালিয়াকান্দি উপজেলা সমিতি, ঢাকা পারস্পরিক সাহায্য, সৌহার্দ্য এবং জন্মভূমি বালিয়াকান্দির সার্বিক কল্যাণ সাধনে বদ্ধপরিকর। আমরা মেধাবী শিক্ষার্থীদের বৃত্তি প্রদান, অসহায় উপজেলাবাসীকে বিনামূল্যে চিকিৎসাসেবা এবং দুর্যোগকালীন ত্রাণ বিতরণসহ নানাবিধ গঠনমূলক কাজ করে আসছি।'
              : 'Our objective is deeply rooted in social brotherhood. Formed in 2008, the association works actively as a beacon of emergency support, offering monthly clinical camps, textbooks distribution, and student welfare initiatives.'}
          </p>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('about_us')}
              className="text-primary-blue hover:text-dark-blue font-extrabold text-xs uppercase flex items-center gap-1 leading-none select-none cursor-pointer"
            >
              <span>{isBn ? 'বিস্তারিত আমাদের সম্পর্কে জানুন' : 'Explore Who We Are'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic decorative vector badge */}
        <div className="bg-gradient-to-tr from-slate-50 to-white hover:border-slate-300 transition-colors p-8 rounded-3xl border border-slate-205 shadow-sm space-y-4">
          <BookOpen className="w-10 h-10 text-brand-green" />
          <h4 className="font-extrabold text-slate-800 text-sm sm:text-base font-sans">{isBn ? 'শিক্ষাবৃত্তি ও ট্রাস্ট তহবিল কার্যক্রম' : 'Education Scholarship Trust Fund'}</h4>
          <p className="text-xs text-slate-505 leading-relaxed font-sans">
            {isBn
              ? 'সমিতির অধীনে একটি স্থায়ী ট্রাস্ট তহবিল গঠিত হয়েছে। রাজবাড়ী চরাঞ্চলের অতি মেধাবী অথচ দরিদ্র শিক্ষার্থীদের এইচএসসি ও উচ্চ শিক্ষার ধারা সচল রাখতে প্রতি বছর নগদ শিক্ষাবৃত্তি প্রদান করা হয়ে থাকে।'
              : 'Under our social welfare trust, we support talented yet economically challenged students from local villages to complete higher board education.'}
          </p>
        </div>
      </div>

      {/* 4. RECENT NOTICES SLIDER SECTION */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest font-sans flex items-center gap-1.5 animate-pulse">
              <Megaphone className="w-3.5 h-3.5" />
              {isBn ? 'সদ্য প্রকাশিত নোটিশ' : 'Latest Gazette Circular'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-sans tracking-tight">
              {isBn ? 'নোটিশ বোর্ড ও সংবাদসমূহ' : 'Notice Board & Official Gazette'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('news_notices')}
            className="text-primary-blue hover:text-dark-blue font-bold text-[11px] uppercase whitespace-nowrap lg:block cursor-pointer"
          >
            {isBn ? 'সব নোটিশ দেখুন' : 'View All Notices'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredNotices.map((n) => (
            <div
              key={n.id}
              onClick={() => setActiveTab('news_notices')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-primary-blue hover:shadow-sm cursor-pointer transition-all space-y-3"
            >
              <div className="flex justify-between items-center text-[10px]">
                <span className="bg-red-50 text-red-650 px-2 py-0.5 rounded font-bold font-sans uppercase">
                  {n.category}
                </span>
                <span className="text-slate-400 font-mono">{n.date}</span>
              </div>
              <h4 className="font-bold text-slate-850 text-sm leading-snug line-clamp-2">
                {isBn ? n.titleBn : n.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal line-clamp-3">
                {isBn ? n.summaryBn : n.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. UPCOMING SESSIONS AND EVENTS */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider font-sans">
              {isBn ? 'পরবর্তী কর্মসূচি' : 'Upcoming Programs'}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-sans tracking-tight">
              {isBn ? 'ইভেন্ট ও সাধারণ সভা' : 'Events & Townhalls'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('events_programs')}
            className="text-primary-blue hover:text-dark-blue font-bold text-[11px] uppercase whitespace-nowrap cursor-pointer"
          >
            {isBn ? 'সব ইভেন্ট' : 'All Events'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredEvents.map((e) => (
            <div
              key={e.id}
              onClick={() => setActiveTab('events_programs')}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-primary-blue hover:shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row"
            >
              {/* Event Cover Image wrapper */}
              <div className="sm:w-2/5 aspect-square sm:aspect-auto bg-slate-100 relative">
                <img src={e.bannerUrl} alt={e.title} className="w-full h-full object-cover" />
              </div>

              {/* Event Descriptions */}
              <div className="p-6 flex flex-col justify-between space-y-4 sm:w-3/5 font-sans">
                <div className="space-y-1.5">
                  <div className="flex gap-2 items-center text-[9px] text-slate-400 font-mono leading-none">
                    <Calendar className="w-3.5 h-3.5 text-slate-350" />
                    <span>{e.date}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm leading-snug">
                    {isBn ? e.titleBn : e.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {isBn ? e.descriptionBn : e.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1 text-slate-505">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[100px]">{isBn ? e.venueBn : e.venue}</span>
                  </div>
                  <span className="text-primary-blue font-bold uppercase">{isBn ? 'বুকিং দিন' : 'Register Now'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
