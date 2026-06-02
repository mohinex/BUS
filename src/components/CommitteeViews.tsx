import React, { useState } from 'react';
import { CommitteeMember, Language } from '../types';
import { User, Phone, Mail, MapPin, Search, Grid, List } from 'lucide-react';
import { motion } from 'motion/react';

interface CommitteeProps {
  language: Language;
  committeeMembers: CommitteeMember[];
  type: 'Executive' | 'Advisory';
}

export default function CommitteeViews({ language, committeeMembers, type }: CommitteeProps) {
  const isBn = language === 'bn';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnion, setSelectedUnion] = useState('All');
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');

  // Filter members by type (Executive vs Advisory)
  const committeeFiltered = committeeMembers.filter(m => m.type === type);

  // Filter based on search query and union
  const filteredList = committeeFiltered.filter(m => {
    const textToSearch = `${m.name} ${m.nameBn} ${m.designation} ${m.designationBn} ${m.village} ${m.villageBn}`.toLowerCase();
    const matchesSearch = textToSearch.includes(searchTerm.toLowerCase());
    
    // Union mapping (using the village/villageBn fields)
    const matchesUnion = selectedUnion === 'All' || m.villageBn.includes(selectedUnion) || m.village.toLowerCase().includes(selectedUnion.toLowerCase());
    
    return matchesSearch && matchesUnion;
  });

  const unionsList = isBn 
    ? ['All', 'বালিয়াকান্দি', 'বহরপুর', 'জামালপুর', 'ইসলামপুর', 'নবাবপুর', 'নারুয়া', 'জঙ্গল']
    : ['All', 'Baliakandi', 'Baharpur', 'Jamalpur', 'Islampur', 'Nawabpur', 'Narua', 'Jangal'];

  return (
    <div className="space-y-8">
      {/* Introduction text */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-dark-blue font-sans tracking-tight">
          {type === 'Executive' 
            ? (isBn ? 'সম্মানিত কার্যনির্বাহী পরিষদ ২০২৬' : 'Executive Committee Session 2026')
            : (isBn ? 'সম্মানিত উপদেষ্টা পরিষদ' : 'Advisory Committee Council')}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans">
          {type === 'Executive'
            ? (isBn 
                ? 'সংগঠনের সার্বিক সিদ্ধান্ত গ্রহণ এবং উন্নয়নমূলক কার্যক্রম পরিচালনার দায়িত্বে নিয়োজিত কার্যনির্বাহী পরিষদের তালিকা।' 
                : 'The dedicated leadership board overseeing strategic directions and community integrations.')
            : (isBn 
                ? 'অভিজ্ঞ ও প্রবীণ ব্যক্তিত্ববৃন্দের সমন্বয়ে গঠিত উপদেষ্টা পরিষদ, যারা সংগঠনকে সঠিক পরামর্শ প্রদান করেন।' 
                : 'Highly respected seniors guiding the association through experience and wisdom.')}
        </p>
      </div>

      {/* Advanced Filter Panel */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-150 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={isBn ? 'নাম বা পদবী দিয়ে খুঁজুন...' : 'Search by name/designation...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue bg-slate-50/50"
          />
        </div>

        {/* Filter Union Dropdown */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            {isBn ? 'ইউনিয়ন:' : 'Union:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {unionsList.map((union) => (
              <button
                key={union}
                onClick={() => setSelectedUnion(union)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  (selectedUnion === union || (union === 'All' && selectedUnion === 'All'))
                    ? 'bg-primary-blue text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {union === 'All' ? (isBn ? 'সব ইউনিয়ন' : 'All Unions') : union}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle Icon */}
        <div className="hidden sm:flex items-center gap-1 border border-slate-200 p-1 rounded-xl">
          <button
            onClick={() => setViewStyle('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewStyle === 'grid' ? 'bg-slate-100 text-primary-blue' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewStyle('list')}
            className={`p-1.5 rounded-lg transition-colors ${viewStyle === 'list' ? 'bg-slate-100 text-primary-blue' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Member Listing Grid/List */}
      {filteredList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-150">
          <p className="text-slate-400 text-sm font-sans">{isBn ? 'কোনো সদস্য খুঁজে পাওয়া যায়নি।' : 'No committee members match your search factors.'}</p>
        </div>
      ) : viewStyle === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredList.map((member, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-primary-blue hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                {/* Photo Header */}
                <div className="relative rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-slate-50 border border-slate-100 max-w-[200px] mx-auto sm:max-w-none">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <User className="w-14 h-14 text-slate-350" />
                  )}
                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-brand-green text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                    {isBn ? member.villageBn : member.village}
                  </div>
                </div>

                {/* Info Text */}
                <div className="text-center space-y-1">
                  <h4 className="font-bold text-slate-800 text-base leading-snug group-hover:text-primary-blue transition-colors">
                    {isBn ? member.nameBn : member.name}
                  </h4>
                  <div className="text-xs bg-blue-50 text-primary-blue px-2 py-0.5 rounded-md font-semibold inline-block">
                    {isBn ? member.designationBn : member.designation}
                  </div>
                </div>
              </div>

              {/* Contact Details footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 font-sans">
                {member.phone && (
                  <div className="flex items-center gap-1.5 justify-center">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{member.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 justify-center">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{isBn ? member.presentAddressBn : member.presentAddress}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {filteredList.map((member) => (
            <div key={member.id} className="p-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-slate-50/55 transition-colors">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                  {isBn ? member.nameBn : member.name}
                </h4>
                <p className="text-xs text-slate-400">
                  {isBn ? member.villageBn : member.village} • {isBn ? 'উৎসব' : 'Union'}
                </p>
              </div>
              <div className="text-center sm:text-left bg-blue-50/70 text-primary-blue font-bold px-3 py-1 rounded-lg text-xs">
                {isBn ? member.designationBn : member.designation}
              </div>
              <div className="text-xs text-slate-500 flex flex-col sm:items-end font-sans">
                {member.phone && <span>{member.phone}</span>}
                <span>{isBn ? member.presentAddressBn : member.presentAddress}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
