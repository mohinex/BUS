import React, { useState } from 'react';
import { Member, Language, MembershipCategory } from '../types';
import { Search, MapPin, Briefcase, FileText, Send, CheckCircle, AlertCircle, FilePlus, Users, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemberViewsProps {
  language: Language;
  approvedMembers?: Member[];
  onRegisterSubmit?: (formData: any) => Promise<{ success: boolean; message: string; error?: string }>;
}

const UNIONS = [
  { id: 'Baliakandi', bn: 'বালিয়াকান্দি সদর', en: 'Baliakandi Sadar' },
  { id: 'Baharpur', bn: 'বহরপুর', en: 'Baharpur' },
  { id: 'Jamalpur', bn: 'জামালপুর', en: 'Jamalpur' },
  { id: 'Islampur', bn: 'ইসলামপুর', en: 'Islampur' },
  { id: 'Nawabpur', bn: 'নবাবপুর', en: 'Nawabpur' },
  { id: 'Narua', bn: 'নারুয়া', en: 'Narua' },
  { id: 'Jangal', bn: 'জঙ্গল', en: 'Jangal' }
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// SAMPLE AVATAR CHOICES
const AVATAR_TEMPLATES = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150&auto=format&fit=crop&q=80"
];

// MEMBER DIRECTORY
export function MemberDirectoryView({ language, approvedMembers }: { language: Language; approvedMembers: Member[] }) {
  const isBn = language === 'bn';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('');
  const [activeModalMember, setActiveModalMember] = useState<Member | null>(null);

  // Filter approved members
  const filtered = approvedMembers.filter(m => {
    const searchString = `${m.name} ${m.nameBn} ${m.occupation} ${m.occupationBn} ${m.village} ${m.villageBn} ${m.id}`.toLowerCase();
    const matchSearch = searchString.includes(searchTerm.toLowerCase());
    const matchUnion = !selectedUnion || m.union === selectedUnion;
    const matchCategory = !selectedCategory || m.category === selectedCategory;
    const matchBlood = !selectedBlood || m.bloodGroup === selectedBlood;

    return matchSearch && matchUnion && matchCategory && matchBlood;
  });

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-dark-blue font-sans tracking-tight">
          {isBn ? 'সদস্য ডিরেক্টরি' : 'Approved Member Directory'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans">
          {isBn
            ? 'ঢাকায় কর্মরত বালিয়াকান্দি সমিতির নিবন্ধিত ও সক্রিয় সাধারণ, আজীবন এবং দাতা সদস্যদের তালিকা।'
            : 'Find and connect with fellow registered professionals, students, and elders in Dhaka.'}
        </p>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-150 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={isBn ? 'নাম, আইডি বা পেশা খুঁজুন...' : 'Search by name, ID, job...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue bg-slate-50/50"
          />
        </div>

        {/* Union Filter */}
        <select
          value={selectedUnion}
          onChange={(e) => setSelectedUnion(e.target.value)}
          className="px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
        >
          <option value="">{isBn ? 'সব ইউনিয়নের সদস্য' : 'All Home Unions'}</option>
          {UNIONS.map(u => (
            <option key={u.id} value={u.id}>{isBn ? u.bn : u.en}</option>
          ))}
        </select>

        {/* Membership Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
        >
          <option value="">{isBn ? 'সকল সদস্য ক্যাটাগরি' : 'All Member Categories'}</option>
          <option value="General">{isBn ? 'সাধারণ সদস্য (General)' : 'General Member'}</option>
          <option value="Life">{isBn ? 'আজীবন সদস্য (Life)' : 'Life Member'}</option>
          <option value="Donor">{isBn ? 'দাতা সদস্য (Donor)' : 'Donor Member'}</option>
          <option value="Adviser">{isBn ? 'উপদেষ্টা সদস্য (Adviser)' : 'Advisory Member'}</option>
        </select>

        {/* Blood Group Filter */}
        <select
          value={selectedBlood}
          onChange={(e) => setSelectedBlood(e.target.value)}
          className="px-3 py-2 border border-slate-250 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
        >
          <option value="">{isBn ? 'রক্তের গ্রুপ (সব)' : 'Blood Group (All)'}</option>
          {BLOOD_GROUPS.map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>
      </div>

      {/* Grid Results */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-150">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-450 text-sm font-sans">
            {isBn ? 'কোনো সদস্য ম্যাচ করেনি।' : 'No members found matching your search parameters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="flex gap-4">
                {/* Photo and Status */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-150">
                  <img src={member.profilePhoto} alt={member.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1 min-w-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    member.category === 'Donor' ? 'bg-amber-100 text-amber-700' :
                    member.category === 'Life' ? 'bg-indigo-100 text-indigo-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {isBn ? (member.category === 'Donor' ? 'দাতা সদস্য' : member.category === 'Life' ? 'আজীবন' : 'সাধারণ') : member.category}
                  </span>
                  <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight truncate">
                    {isBn ? member.nameBn : member.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-primary-blue font-mono">ID: {member.id}</p>
                </div>
              </div>

              {/* Specs */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-sans">
                {member.occupation && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{isBn ? member.occupationBn : member.occupation}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">
                    {isBn ? 'ইউনিয়ন' : 'Union'}: {isBn ? (UNIONS.find(u => u.id === member.union)?.bn || member.union) : member.union}
                  </span>
                </div>
                {member.bloodGroup && (
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                      Blood: {member.bloodGroup}
                    </span>
                  </div>
                )}
              </div>

              {/* View Profile Action Link */}
              <button
                onClick={() => setActiveModalMember(member)}
                className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-primary-blue text-xs font-semibold py-2 rounded-xl transition-colors border border-slate-100"
              >
                {isBn ? 'বিস্তারিত প্রোফাইল দেখুন' : 'View Full Profile'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Member Profile Modal Box Lightbox */}
      <AnimatePresence>
        {activeModalMember && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-150 text-slate-800"
            >
              {/* Header card with gradient */}
              <div className="bg-gradient-official text-white p-6 relative">
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="absolute right-4 top-4 hover:bg-white/10 p-1.5 rounded-full text-white/80 transition-colors"
                >
                  ✕
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white bg-slate-50 flex-shrink-0">
                    <img src={activeModalMember.profilePhoto} alt={activeModalMember.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold font-sans">
                      {isBn ? activeModalMember.nameBn : activeModalMember.name}
                    </h4>
                    <p className="text-xs text-white/85 font-mono">ID: {activeModalMember.id}</p>
                    <span className="text-xs mt-1.5 inline-block bg-white/20 text-white px-2 py-0.5 rounded-md font-semibold">
                      {isBn ? 'আজীবন / দাতা ক্যাটাগরি' : activeModalMember.category + ' Member'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {activeModalMember.bio && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-slate-600 text-xs italic">
                    "{isBn ? activeModalMember.bioBn || activeModalMember.bio : activeModalMember.bio}"
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">{isBn ? "পিতা" : "Father's Name"}</span>
                    <span className="font-semibold text-slate-700">{isBn ? activeModalMember.fatherNameBn || activeModalMember.fatherName : activeModalMember.fatherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isBn ? "মাতা" : "Mother's Name"}</span>
                    <span className="font-semibold text-slate-700">{isBn ? activeModalMember.motherNameBn || activeModalMember.motherName : activeModalMember.motherName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isBn ? "পেশা" : "Occupation"}</span>
                    <span className="font-semibold text-slate-700">{isBn ? activeModalMember.occupationBn || activeModalMember.occupation : activeModalMember.occupation}</span>
                  </div>
                  {activeModalMember.workplace && (
                    <div>
                      <span className="text-slate-400 block">{isBn ? "কর্মস্থল" : "Workplace"}</span>
                      <span className="font-semibold text-slate-700">{isBn ? activeModalMember.workplaceBn || activeModalMember.workplace : activeModalMember.workplace}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block">{isBn ? "ইউনিয়ন গ্রাম" : "Home Union & Vill"}</span>
                    <span className="font-semibold text-slate-700">
                      {isBn ? UNIONS.find(u => u.id === activeModalMember.union)?.bn : activeModalMember.union}, {isBn ? activeModalMember.villageBn : activeModalMember.village}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isBn ? "বর্তমান ঠিকানা (ঢাকা)" : "Present Address (Dhaka)"}</span>
                    <span className="font-semibold text-slate-700">{isBn ? activeModalMember.presentAddressBn : activeModalMember.presentAddress}</span>
                  </div>
                  {activeModalMember.bloodGroup && (
                    <div>
                      <span className="text-slate-400 block">{isBn ? "রক্তের গ্রুপ" : "Blood Group"}</span>
                      <span className="font-bold text-red-500">{activeModalMember.bloodGroup}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-400 block">{isBn ? "যোগদান তারিখ" : "Registered Date"}</span>
                    <span className="font-medium text-slate-600">{new Date(activeModalMember.registeredAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Close Button Footer */}
              <div className="bg-slate-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="bg-primary-blue hover:bg-dark-blue text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// MEMBER REGISTRATION FORM
export function MemberRegistrationForm({ language, onRegisterSubmit }: MemberViewsProps) {
  const isBn = language === 'bn';

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    fatherName: '',
    fatherNameBn: '',
    motherName: '',
    motherNameBn: '',
    email: '',
    phone: '',
    category: 'General' as MembershipCategory,
    union: 'Baliakandi',
    village: '',
    villageBn: '',
    presentAddress: '',
    presentAddressBn: '',
    permanentAddress: '',
    permanentAddressBn: '',
    occupation: '',
    occupationBn: '',
    workplace: '',
    workplaceBn: '',
    profilePhoto: AVATAR_TEMPLATES[0],
    password: '',
    confirmPassword: '',
    bloodGroup: 'O+',
    bio: '',
    bioBn: '',
    fbProfile: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; msg?: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarSelect = (url: string) => {
    setFormData({ ...formData, profilePhoto: url });
  };

  // Profile image local Base64 uploader helper
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(isBn ? 'ছবি ২ মেগাবাইটের কম সাইজ হতে হবে।' : 'File size must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setResult({ success: false, msg: isBn ? "পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলেনি।" : "Passwords do not match." });
      return;
    }

    if (!formData.email || !formData.phone || !formData.password) {
      setResult({ success: false, msg: isBn ? "দয়া করে প্রয়োজনীয় সব তথ্য প্রদান করুন।" : "Please provide all required credentials." });
      return;
    }

    setLoading(true);
    try {
      const resp = await onRegisterSubmit(formData);
      if (resp.success) {
        setResult({ success: true, msg: resp.message });
        // Clear except important states
        setFormData({
          name: '', nameBn: '', fatherName: '', fatherNameBn: '', motherName: '', motherNameBn: '',
          email: '', phone: '', category: 'General', union: 'Baliakandi', village: '', villageBn: '',
          presentAddress: '', presentAddressBn: '', permanentAddress: '', permanentAddressBn: '',
          occupation: '', occupationBn: '', workplace: '', workplaceBn: '', profilePhoto: AVATAR_TEMPLATES[0],
          password: '', confirmPassword: '', bloodGroup: 'O+', bio: '', bioBn: '', fbProfile: ''
        });
      } else {
        setResult({ success: false, msg: resp.error || "An error occurred." });
      }
    } catch (err: any) {
      setResult({ success: false, msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-200">
      <div className="text-center space-y-2 border-b border-slate-100 pb-6">
        <div className="p-3 bg-blue-50 text-primary-blue rounded-full w-fit mx-auto mb-2">
          <FilePlus className="w-8 h-8" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-dark-blue font-sans tracking-tight">
          {isBn ? 'সদস্য হতে আবেদন করুন' : 'Online Member Application'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans leading-relaxed max-w-xl mx-auto">
          {isBn
            ? 'ঢাকায় বসবাসরত বালিয়াকান্দিকে সম্পৃক্ত করে আমাদের গৌরবময় সমিতিতে অংশ নিন। ফরম জমা দেয়ার পর কার্যনির্বাহী কমিটির মূল্যায়নে আপনি স্থায়ী ইউনিক মেম্বারশিপ ডিজিটাল আইডি কার্ড পাবেন।'
            : 'Fill out this application to sign up. Once reviewed/approved by the management team, you will receive an official login badge and digital credential ID card.'}
        </p>
      </div>

      {result && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm ${
          result.success ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500' : 'bg-red-50 text-red-800 border-l-4 border-red-500'
        }`}>
          {result.success ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-sans font-medium">{result.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 text-slate-750">
        {/* Membership Criteria */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2">
            {isBn ? '১. মেম্বারশিপ বাৎসরিক ক্যাটাগরি' : '1. Select Membership Category'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              formData.category === 'General' ? 'border-primary-blue bg-blue-50/40 font-semibold' : 'border-slate-200 hover:border-slate-350'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-800">{isBn ? 'সাধারণ সদস্য' : 'General Member'}</span>
                <input
                  type="radio"
                  name="category"
                  value="General"
                  checked={formData.category === 'General'}
                  onChange={handleChange}
                  className="text-primary-blue focus:ring-primary-blue"
                />
              </div>
              <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
                {isBn ? 'বাৎসরিক চাঁদা ১,০০০ টাকা। সামাজিক সকল অনুষ্ঠান ও নির্বাচনে অংশ পাবেন।' : 'Annual Dues BDT 1,000. Grants general entry, voting and networking rights.'}
              </p>
            </label>

            <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              formData.category === 'Life' ? 'border-primary-blue bg-blue-50/40 font-semibold' : 'border-slate-200 hover:border-slate-350'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-indigo-700">{isBn ? 'আজীবন সদস্য' : 'Life Member'}</span>
                <input
                  type="radio"
                  name="category"
                  value="Life"
                  checked={formData.category === 'Life'}
                  onChange={handleChange}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
                {isBn ? 'এককালীন ২০,০০০ টাকা প্রদানের মাধ্যমে আজীবন সম্মাননা সদস্যপদ প্রাপ্তি।' : 'One-time fee of BDT 20,000. Awards lifelong honorary membership validation.'}
              </p>
            </label>

            <label className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              formData.category === 'Donor' ? 'border-primary-blue bg-blue-50/40 font-semibold' : 'border-slate-200 hover:border-slate-350'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-amber-600">{isBn ? 'দাতা সদস্য' : 'Donor Member'}</span>
                <input
                  type="radio"
                  name="category"
                  value="Donor"
                  checked={formData.category === 'Donor'}
                  onChange={handleChange}
                  className="text-amber-600 focus:ring-amber-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
                {isBn ? 'এককালীন ১,০০,০০০+ টাকা দানকারী কল্যাণ তহবিলের বিশেষ সম্মানিত দাতা।' : 'Generous contribution of BDT 1,00,000+. Enshrines core donor privileges.'}
              </p>
            </label>
          </div>
        </div>

        {/* Personal details */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2">
            {isBn ? '২. ব্যক্তিগত বিবরণ' : '2. Personal Information'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'পূর্ণ নাম (ইংরেজি বড় হরফে)*' : 'Full Name (English)*'}</label>
              <input required type="text" name="name" placeholder="MD. ASHRAFUL ISLAM" value={formData.name} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'পূর্ণ নাম (বাংলায়)*' : 'Full Name (Bangla)*'}</label>
              <input required type="text" name="nameBn" placeholder="মোঃ আশরাফুল ইসলাম" value={formData.nameBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'পিতার নাম (ইংরেজি)' : "Father's Name (English)"}</label>
              <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'পিতার নাম (বাংলায়)' : "Father's Name (Bangla)"}</label>
              <input type="text" name="fatherNameBn" value={formData.fatherNameBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'মাতার নাম (বাংলায়)' : "Mother's Name (Bangla)"}</label>
              <input type="text" name="motherNameBn" value={formData.motherNameBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white">
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Contact credentials */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2">
            {isBn ? '৩. যোগাযোগের ঠিকানা ও ইমেইল' : '3. Credentials & Address'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'সক্রিয় মোবাইল নম্বর*' : 'Mobile Phone No*'}</label>
              <input required type="tel" name="phone" placeholder="+88017XXXXXXXX" value={formData.phone} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'ইমেইল অ্যাড্রেস (লগইন আইডি)*' : 'Email Address (Login ID)*'}</label>
              <input required type="email" name="email" placeholder="example@gmail.com" value={formData.email} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'বালিয়াকান্দি হোম ইউনিয়ন*' : 'Home Union (Baliakandi)*'}</label>
              <select name="union" value={formData.union} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl bg-white">
                {UNIONS.map(u => <option key={u.id} value={u.id}>{isBn ? u.bn : u.en}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'স্থায়ী গ্রাম (বাংলায়)' : 'Permanent Village (Bangla)'}</label>
              <input type="text" name="villageBn" placeholder="বহরপুর উত্তরপাড়া" value={formData.villageBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'বর্তমান ঠিকানা (ঢাকা বসবাসরত ঠিকানা)*' : 'Present Address in Dhaka*'}</label>
              <input required type="text" name="presentAddressBn" placeholder="বাড়ি #১২, ফ্ল্যাট #৩এ, ব্লক #বি, উত্তরা, ঢাকা" value={formData.presentAddressBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'স্থায়ী ঠিকানা (রাজবাড়ী)' : 'Permanent Address (Rajbari)'}</label>
              <input type="text" name="permanentAddressBn" placeholder="গ্রাম: বহরপুর বাজার, উপজেলা: বালিয়াকান্দি, জেলা: রাজবাড়ী" value={formData.permanentAddressBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Occupation info */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2">
            {isBn ? '৪. পেশাগত বিবরণ' : '4. Occupational Scope'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'পেশা / পদবী (বাংলায়)' : 'Designation / Occupation (Bangla)'}</label>
              <input type="text" name="occupationBn" placeholder="চাকরিজীবী / ব্যবসায়ী / শিক্ষার্থী" value={formData.occupationBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'কর্মস্থল বা কোম্পানির নাম' : 'Workplace / Institution'}</label>
              <input type="text" name="workplaceBn" placeholder="বাংলাদেশ ব্যাংক / ঢাকা বিশ্ববিদ্যালয়" value={formData.workplaceBn} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'ফেসবুক প্রোফাইল লিংক (ঐচ্ছিক)' : 'Facebook Profile Link (Optional)'}</label>
              <input type="url" name="fbProfile" placeholder="https://facebook.com/username" value={formData.fbProfile} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Profile Photo Uploader */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2">
            {isBn ? '৫. সদস্য প্রোফাইল ছবি আপলোড' : '5. Upload/Choose Profile Photo'}
          </h4>
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
            {/* Display profile photo image */}
            <div className="w-24 h-24 rounded-2xl bg-white border border-slate-150 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <img src={formData.profilePhoto} alt="Member preview" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-3 text-xs w-full">
              <div>
                <span className="block text-slate-500 font-semibold mb-1">{isBn ? 'আপনার কম্পিউটার/মোবাইল থেকে ছবি পছন্দ করুন:' : 'Upload standard image file:'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="file:mr-4 file:py-1 py-1 file:px-3 file:rounded-xl file:border file:border-slate-300 file:text-xs file:bg-white file:hover:bg-slate-100 cursor-pointer block font-sans"
                />
              </div>

              {/* Preset template select */}
              <div>
                <span className="block text-slate-400 mb-1">{isBn ? 'অথবা নিচের যেকোনো একটি ডেমো ছবি পছন্দ করুন:' : 'Or tap one of our sample graphics:'}</span>
                <div className="flex gap-2">
                  {AVATAR_TEMPLATES.map((url, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => handleAvatarSelect(url)}
                      className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${
                        formData.profilePhoto === url ? 'border-primary-blue scale-105 shadow-sm' : 'border-transparent opacity-80'
                      }`}
                    >
                      <img src={url} alt="template" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form state password creation */}
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm sm:text-base border-l-4 border-primary-blue pl-2">
            {isBn ? '৬. পোর্টালে লগইন করতে পাসওয়ার্ড চয়ন করুন' : '6. Create Login Password'}
          </h4>
          <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
            {isBn ? 'লগইন করতে আপনার ইমেইল ও এই পাসওয়ার্ডটি ব্যবহার করবেন। পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' : 'This password combined with your email will authorize access to the Digital Member Dashboard.'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'পাসওয়ার্ড কোড*' : 'Password Code*'}</label>
              <input required type="password" minLength={6} name="password" placeholder="******" value={formData.password} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">{isBn ? 'পাসওয়ার্ড নিশ্চিত করুন*' : 'Confirm Password*'}</label>
              <input required type="password" minLength={6} name="confirmPassword" placeholder="******" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2.5 border border-slate-250 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-[10px] text-slate-400 font-sans sm:max-w-md">
            {isBn
              ? 'নিবন্ধন বাটনে চাপার মাধ্যমে আপনি এই নিশ্চয়তা দিচ্ছেন যে পরিবেশিত সকল ব্যক্তিগত তথ্য সত্য এবং আপনি সমিতির সাধারণ নিয়মাবলী মেনে চলবেন।'
              : 'By clicking Submit, you certify that all entered profile data is true and that you will abide by organization terms.'}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-official hover:opacity-90 shadow text-white font-bold px-8 py-3 rounded-2xl transition-opacity flex items-center justify-center gap-2 text-xs uppercase"
          >
            {loading ? (
              <span>{isBn ? 'আবেদন পাঠানো হচ্ছে...' : 'Submitting Profile...'}</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isBn ? 'আবেদন সাবমিট করুন' : 'Submit Application'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
