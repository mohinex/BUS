import React from 'react';
import { Language } from '../types';
import { BookOpen, Award, ShieldAlert, Heart, Calendar, ArrowRight, Target, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface ViewProps {
  language: Language;
}

// 1. ABOUT US PAGE
export function AboutUsView({ language }: ViewProps) {
  const isBn = language === 'bn';

  return (
    <div className="space-y-12">
      {/* Hero Banner Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
        <img
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80"
          alt="Baliakandi Landscape"
          className="w-full h-80 object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-blue/90 via-dark-blue/40 to-transparent flex flex-col justify-end p-8 text-white">
          <span className="bg-brand-green/90 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider w-fit mb-3">
            {isBn ? "পরিচিতি ও ঐতিহ্য" : "Geography & Heritage"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-sans">
            {isBn ? "বালিয়াকান্দি উপজেলা সমিতি, ঢাকা" : "Baliakandi Upazila Samiti, Dhaka"}
          </h2>
          <p className="text-slate-200 text-sm sm:text-base mt-2 max-w-2xl font-sans font-light leading-relaxed">
            {isBn
              ? "ঐতিহ্যের সৌরভে বিকশিত রাজবাড়ী জেলার অতি প্রাচীন জনপদ বালিয়াকান্দি। ঢাকায় বসবাসরত এই অঞ্চলের সুনাগরিকদের পারস্পরিক সৌহার্দ্য ও সাম্য প্রতিষ্ঠার বাতিঘর।"
              : "A premier cultural, social, and humanitarian bridge representing the proud citizens of Baliakandi Upazila in Rajbari residing in the capital city Dhaka."}
          </p>
        </div>
      </div>

      {/* Grid: Details & Local History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-xl font-bold text-dark-blue flex items-center gap-2 border-b border-slate-100 pb-3 font-sans">
              <BookOpen className="text-primary-blue w-5 h-5" />
              {isBn ? "সংক্ষিপ্ত ইতিহাস ও লক্ষ্য" : "Brief History and Purpose"}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              {isBn
                ? "বালিয়াকান্দি উপজেলা সমিতি, ঢাকা ২০০৮ সালে একটি অরাজনৈতিক, অলাভজনক এবং সম্পূর্ণ সমাজকল্যাণমূলক স্বেচ্ছাসেবী সংগঠন হিসেবে প্রতিষ্ঠিত হয়। সমিতির মূল উদ্দেশ্য হলো ঢাকায় বসবাসরত বালিয়াকান্দিকে সম্পৃক্ত করে আমাদের শিক্ষা, সংস্কৃতি, আদর্শিক ও সামাজিক বন্ধনকে মজবুত করা। আমরা ঢাকার বুকে এক টুকরো বালিয়াকান্দি, যেখানে আমরা একে অপরের সুখ-দুঃখের অংশীদার।"
                : "Baliakandi Upazila Samiti, Dhaka was founded in 2008 as a non-political, non-profit, and purely humanitarian welfare association. The central purpose is to build absolute solidarity among the natives of Baliakandi Upazila living in Dhaka, creating a cohesive platform for human development, career networking, student mentoring, and emergency rural aid."}
            </p>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
              {isBn
                ? "আমাদের উপজেলাটি বৈচিত্র্যময় লোক-ঐতিহ্য, মিষ্টি দই, পান চাষ এবং সোনালী পাটের জন্য অত্যন্ত বিখ্যাত। এই উর্বর মাটির মানুষকে ঢাকায় এক নিয়মতান্ত্রিক সাংগঠনিক বৃত্তে নিয়ে আসার লক্ষ্যে এই সমিতি নিরলসভাবে কাজ করে চলেছে এবং উপজেলার উন্নয়নে অবদান রাখছে।"
                : "Baliakandi Upazila, nestled inside the Rajbari District, is highly renowned across Southwestern Bangladesh for its local sweet yogurt, betel leaf cultivation, and high-quality jute production. The association works tirelessly to elevate our community while funding local development projects back home."}
            </p>
          </div>

          {/* Quick Core Values */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-dark-blue font-sans">
              {isBn ? "আমাদের মূল ভিত্তি" : "Our Core Pillars"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="p-2 h-fit bg-blue-50 text-primary-blue rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{isBn ? "ভ্রাতৃত্ববোধ" : "Brotherhood"}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{isBn ? "পারস্পরিক সহযোগিতা ও সুসম্পর্ক" : "Mutual support and empathy"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="p-2 h-fit bg-emerald-50 text-brand-green rounded-xl">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{isBn ? "মানবসেবা" : "Social Welfare"}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{isBn ? "দরিদ্র ও শিক্ষার্থীদের পাশে দাঁড়ানো" : "Financial, medical and education aid"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Info Cards: Geography at a glance */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-dark-blue to-primary-blue text-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-bold mb-4 font-sans border-b border-white/20 pb-2">
              {isBn ? "বালিয়াকান্দি এক নজরে" : "Baliakandi at a Glance"}
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm font-sans">
              <li className="flex justify-between border-b border-white/10 pb-1">
                <span className="opacity-80">{isBn ? "জেলা" : "District"}</span>
                <span className="font-semibold">{isBn ? "রাজবাড়ী" : "Rajbari"}</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1">
                <span className="opacity-80">{isBn ? "ইউনিয়ন সংখ্যা" : "Unions"}</span>
                <span className="font-semibold">{isBn ? "৭ টি" : "7 Unions"}</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1">
                <span className="opacity-80">{isBn ? "উপজেলা আয়তন" : "Area"}</span>
                <span className="font-semibold">{isBn ? "২৪২.৫৩ বর্গ কিমি" : "242.53 Sq-Km"}</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-1">
                <span className="opacity-80">{isBn ? "প্রতিষ্ঠাকাল" : "Estd."}</span>
                <span className="font-semibold">{isBn ? "১৯৮৩ (থানা ১৯৮২)" : "1983 (Police 1982)"}</span>
              </li>
              <li className="flex justify-between">
                <span className="opacity-80">{isBn ? "বিখ্যাত" : "Famous For"}</span>
                <span className="font-bold text-amber-350">{isBn ? "মিষ্টি দই, পান ও পাট" : "Curd, Jute, Betel Leaf"}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm mb-2">{isBn ? "সমিতির প্রধান কার্যালয়" : "Dhaka Association Office"}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {isBn
                ? "বাসা নং ১২, রোড নং ৫, ব্লক-ডি, মিরপুর-১১, ঢাকা-১২১৬, বাংলাদেশ"
                : "House 12, Road 5, Block-D, Mirpur-11, Dhaka-1216, Bangladesh"}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-primary-blue font-bold">
              <span>{isBn ? "অফিস হটলাইন:" : "Phone:"}</span>
              <span>+8801700112233</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. MISSION & VISION PAGE
export function MissionVisionView({ language }: ViewProps) {
  const isBn = language === 'bn';

  return (
    <div className="space-y-12">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission */}
        <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100/30 rounded-bl-full flex items-center justify-end p-4 text-primary-blue/30">
            <Target className="w-12 h-12" />
          </div>
          <div className="p-3 bg-blue-50 text-primary-blue w-fit rounded-2xl mb-6">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-dark-blue font-sans mb-4">
            {isBn ? "আমাদের রূপকল্প (Our Vision)" : "Our Vision"}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans font-normal">
            {isBn
              ? "একটি শান্তিময়, সমৃদ্ধশীল ও জ্ঞানভিত্তিক স্বনির্ভর বালিয়াকান্দি গড়ে তোলা, যেখানে ঢাকার নাগরিক ও উপজেলার স্থানীয় সর্বস্তরের মানুষ একে অপরের সহায়ক হবে এবং শিক্ষা, স্বাস্থ্য ও কর্মসংস্থানে কোনো বৈষম্য থাকবে না।"
              : "To nurture a peaceful, economically empowered, and self-sufficient community where knowledge prevails. We envision Baliakandi as an ideal sub-district with zero educational, health, and economic gaps by uniting resources."}
          </p>
        </div>

        {/* Vision */}
        <div className="bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-sm border border-slate-200/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/30 rounded-bl-full flex items-center justify-end p-4 text-brand-green/30">
            <Users className="w-12 h-12" />
          </div>
          <div className="p-3 bg-emerald-50 text-brand-green w-fit rounded-2xl mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-dark-blue font-sans mb-4">
            {isBn ? "আমাদের মিশন (Our Mission)" : "Our Mission"}
          </h3>
          <ul className="space-y-3 font-sans text-sm sm:text-base text-slate-600">
            <li className="flex gap-2">
              <span className="text-brand-green font-bold">•</span>
              {isBn
                ? "ঢাকায় বসবাসরত বালিয়াকান্দির নাগরিকদের এক বিশাল ভ্রাতৃত্বপূর্ণ বন্ধনে আবদ্ধ করা।"
                : "Organizing all natives into a strong fellowship and assistance directory."}
            </li>
            <li className="flex gap-2">
              <span className="text-brand-green font-bold">•</span>
              {isBn
                ? "অ অস্বচ্ছল কৃতি শিক্ষার্থীদের মেধাবৃত্তি প্রদানের মাধ্যমে শিক্ষা সহায়তা প্রদান করা।"
                : "Distributing annual educational scholarships to empower marginalized rural students."}
            </li>
            <li className="flex gap-2">
              <span className="text-brand-green font-bold">•</span>
              {isBn
                ? "চিকিৎসা সেবা বঞ্চিত মানুষের জন্য ফ্রী চক্ষু এবং স্বাস্থ্য পরীক্ষা শিবিরের আয়োজন করা।"
                : "Conducting dynamic free healthcare consultation projects and emergency clinic camps."}
            </li>
            <li className="flex gap-2">
              <span className="text-brand-green font-bold">•</span>
              {isBn
                ? "হঠাৎ কোনো দুর্যোগ বা বন্যায় দ্রুত ত্রাণ কার্য পরিচালনা করা ও আর্থিক সহায়তা পাঠানো।"
                : "Delivering rapid-response relief resources and rehabilitation funds during natural calamities."}
            </li>
          </ul>
        </div>
      </div>

      {/* Structured Milestones */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <h3 className="text-xl font-bold text-dark-blue text-center font-sans">
          {isBn ? "সমিতির প্রধান উদ্দেশ্য ও কর্মপরিকল্পনা" : "Our Strategic Core Agenda"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <div className="text-2xl font-black text-primary-blue/30 font-mono">01</div>
            <h4 className="font-bold text-slate-800 text-sm">{isBn ? "উপাধি উপ তহবিল গঠন" : "Specialist Trust Funds"}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {isBn ? "স্থায়ী সঞ্চয় নিশ্চিত করতে মেধা কল্যাণ এবং চিকিৎসা সহায়তা ট্রাস্ট তহবিল গঠন।" : "Building ring-fenced trusts with permanent donations specifically targeting healthcare and students."}
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <div className="text-2xl font-black text-brand-green/30 font-mono">02</div>
            <h4 className="font-bold text-slate-800 text-sm">{isBn ? "ডিজিটাল ডিরেক্টরি কার্ড" : "Real-time Verified Directory"}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {isBn ? "ঢাকায় বসবাসরত সদস্যদের ডাটাবেজ ডিজিটাল ও স্মার্ট পরিচয়পত্র প্রদান।" : "Issuing standardized digital membership ID passes with QR authorization systems."}
            </p>
          </div>
          <div className="p-5 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <div className="text-2xl font-black text-amber-500/30 font-mono">03</div>
            <h4 className="font-bold text-slate-800 text-sm">{isBn ? "বার্ষিক মিলন মেলা" : "Generational Integration"}</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              {isBn ? "বার্ষিক সম্মেলন, ক্রীড়া কৌতুক ও বনভোজনের আয়োজন করে সম্পর্ক মজবুত করা।" : "Bringing multi-generational families together in the capital to secure safe roots."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. PROJECTS & ACTIVITIES PAGE
export function ProjectsView({ language }: ViewProps) {
  const isBn = language === 'bn';

  const projects = [
    {
      id: "P1",
      title: "Medhabritti Trust Project",
      titleBn: "মেধাবৃত্তি ও শিক্ষা উপকরণ ট্রাস্ট",
      budget: "BDT 5,00,000",
      progress: 85,
      icon: BookOpen,
      color: "blue",
      desc: "Annual scholarship given to students of Rajbari families pursuing engineering and medical curriculum in Dhaka.",
      descBn: "ঢাকায় উচ্চশিক্ষা বা প্রযুক্তিগত কোর্সে অধ্যয়নরত অস্বচ্ছল এবং কৃতি শিক্ষার্থীদের জন্য বাৎসরিক আর্থিক অনুদান বরাদ্দ স্কিম।",
      beneficiaries: "120+ Students"
    },
    {
      id: "P2",
      title: "Free Healthcare & Eye Surgery Clinics",
      titleBn: "স্থায়ী ফ্রী চক্ষু ও চিকিৎসা ক্যাম্প",
      budget: "BDT 3,50,000",
      progress: 100,
      icon: Heart,
      color: "emerald",
      desc: "Comprehensive diagnostic eye surgeries, power tests, and free medicines distribution in different Baliakandi unions.",
      descBn: "অভিজ্ঞ চোখের ডাক্তার ও বিশেষজ্ঞ টিমের মাধ্যমে প্রতি বছর আমাদের চরাঞ্চলের রোগীদের বিনামূল্যে চোখের ছানি ও লেন্স অপারেশন।",
      beneficiaries: "5,000+ Patient Checkups"
    },
    {
      id: "P3",
      title: "Char Emergency Relief Aid",
      titleBn: "চরাঞ্চলে বন্যা ও দুর্যোগে জরুরী ত্রাণ তহবিল",
      budget: "BDT 4,00,000",
      progress: 60,
      icon: ShieldAlert,
      color: "amber",
      desc: "Direct support distribution of corrugated iron sheets (ঢেউটিন) and monetary assistance to river erosion victims in Narua.",
      descBn: "পদ্মা এবং গড়াই নদীর আকস্মিক ঢল ও ভাঙনের শিকার অসহায় গৃহহারা পরিবারগুলোকে ঢেউটিন ও পুনর্বাসনের নগদ সাহায্য প্রদান প্রকল্প।",
      beneficiaries: "800+ Families Saved"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-100 max-w-3xl mx-auto text-center space-y-3">
        <h3 className="text-2xl font-bold text-dark-blue font-sans">
          {isBn ? "আমাদের সমাজকল্যাণমূলক প্রকল্পসমূহ" : "Our Social Benefit Initiatives"}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed font-sans">
          {isBn
            ? "উপজেলা সমিতির মূল আয়ের সম্পূর্ণ অংশ সরাসরি বালিয়াকান্দি অঞ্চলের অবহেলিত মানুষ ও শিক্ষার্থীদের সামাজিক উন্নয়নে ব্যয় করা হয়ে থাকে। প্রতিটি প্রজেক্টের স্বচ্ছ রিপোর্ট প্রকাশ করা হয়।"
            : "Every single fund received from general membership registry is channeled back into targeted village welfare actions with audited financial transparency reports."}
        </p>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((proj) => {
          const Icon = proj.icon;
          return (
            <div key={proj.id} className="bg-white rounded-2xl shadow-sm border border-slate-200/70 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className={`p-3 rounded-2xl w-fit ${
                  proj.color === 'blue' ? 'bg-blue-50 text-primary-blue' :
                  proj.color === 'emerald' ? 'bg-emerald-50 text-brand-green' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 font-sans leading-snug">
                  {isBn ? proj.titleBn : proj.title}
                </h4>
                <p className="text-slate-500 text-xs sm:text-sm font-sans line-clamp-3">
                  {isBn ? proj.descBn : proj.desc}
                </p>
              </div>

              <div className="mt-6 space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">{isBn ? "প্রজেক্ট সম্পন্ন:" : "Project Done:"}</span>
                  <span className="text-dark-blue">{proj.progress}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      proj.color === 'blue' ? 'bg-primary-blue' :
                      proj.color === 'emerald' ? 'bg-brand-green' : 'bg-amber-500'
                    }`}
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <div>
                    <div className="text-slate-400">{isBn ? "উপকারভোগী" : "Beneficiaries"}</div>
                    <div className="font-bold text-slate-750 mt-0.5">{proj.beneficiaries}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400">{isBn ? "বাজেট তহবিল" : "Budget Fund"}</div>
                    <div className="font-bold text-dark-blue mt-0.5">{proj.budget}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
