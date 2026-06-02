import React, { useState } from 'react';
import { GalleryItem, Language } from '../types';
import { Play, Image as ImageIcon, Video, Calendar, Eye, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryProps {
  language: Language;
  galleryItems: GalleryItem[];
}

export default function GalleryViews({ language, galleryItems }: GalleryProps) {
  const isBn = language === 'bn';
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Filter gallery items by active tab (photo / video)
  const itemsByType = galleryItems.filter(item => item.type === mediaType);

  // Get unique categories for this media type to render quick filters
  const categories = ['All', ...Array.from(new Set(itemsByType.map(item => isBn ? item.categoryBn : item.category)))];

  // Filter by selected category
  const filteredItems = itemsByType.filter(item => {
    if (selectedCategory === 'All') return true;
    return isBn ? item.categoryBn === selectedCategory : item.category === selectedCategory;
  });

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-dark-blue font-sans tracking-tight">
          {isBn ? 'মিডিয়া গ্যালারি' : 'Media Gallery'}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-sans lead-relaxed">
          {isBn
            ? 'সমিতির বিভিন্ন সামাজিক সভা, কৃতি সংবর্ধনা, কম্বল বিতরণ কর্মসূচী এবং চরাঞ্চল পরিদর্শনের স্থির চিত্রসমূহ।'
            : 'Take a virtual walk inside our annual programs, student recognition events, and physical disaster management programs.'}
        </p>
      </div>

      {/* Selector Tabs (Photo vs Video) */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            setMediaType('photo');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs uppercase rounded-xl transition-all border ${
            mediaType === 'photo'
              ? 'bg-primary-blue text-white shadow-sm border-transparent'
              : 'bg-white hover:bg-slate-55 text-slate-650 border-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{isBn ? 'সদস্য ফটো গ্যালারি' : 'Photo Gallery'}</span>
        </button>

        <button
          onClick={() => {
            setMediaType('video');
            setSelectedCategory('All');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 font-bold text-xs uppercase rounded-xl transition-all border ${
            mediaType === 'video'
              ? 'bg-primary-blue text-white shadow-sm border-transparent'
              : 'bg-white hover:bg-slate-55 text-slate-650 border-slate-200'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{isBn ? 'ভিডিও প্রামাণ্যচিত্র' : 'Video Gallery'}</span>
        </button>
      </div>

      {/* Category filters */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-150 flex justify-center flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-brand-green text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-150 text-slate-600'
            }`}
          >
            {cat === 'All' ? (isBn ? 'সব ছবি/ভিডিও' : 'All Categories') : cat}
          </button>
        ))}
      </div>

      {/* Grid displays */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-150 max-w-md mx-auto">
          <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-450 text-sm font-sans">{isBn ? 'আপাতত কোনো মিডিয়া আপলোড করা নেই।' : 'No media items found matched this filter.'}</p>
        </div>
      ) : mediaType === 'photo' ? (
        /* Photo Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              initial={ {opacity: 0, scale: 0.95} }
              animate={ {opacity: 1, scale: 1} }
              transition={{ delay: index * 0.03 }}
              key={item.id}
              onClick={() => setActiveLightboxIndex(index)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-205 shadow-sm hover:border-primary-blue hover:shadow cursor-pointer transition-all flex flex-col group relative"
            >
              <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-104 transition-all duration-300" />
                
                {/* Hover overlay magnifying icon */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white">
                    <Eye className="w-5 h-5" />
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white space-y-1">
                <span className="text-[9px] font-bold text-brand-green bg-green-50 px-1.5 py-0.5 rounded uppercase">
                  {isBn ? item.categoryBn : item.category}
                </span>
                <p className="text-xs font-bold text-slate-750 font-sans truncate mt-1">
                  {isBn ? item.titleBn : item.title}
                </p>
                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                  <Calendar className="w-3 h-3 text-slate-300" />
                  <span>{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Video Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-205 overflow-hidden shadow-sm hover:shadow flex flex-col"
            >
              {/* YouTube Mock Custom Embedded iframe Player */}
              <div className="aspect-video bg-black relative">
                {/* Render clean custom preview layout or iframe */}
                <iframe
                  title={item.title}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${item.url}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>

              {/* Specs */}
              <div className="p-4 space-y-1">
                <span className="text-[9px] font-bold text-primary-blue bg-blue-50 px-1.5 py-0.5 rounded uppercase">
                  {isBn ? item.categoryBn : item.category}
                </span>
                <h4 className="font-extrabold text-slate-800 text-sm mt-1">
                  {isBn ? item.titleBn : item.title}
                </h4>
                <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                  Published: {item.date} • Baliakandi Documentary Session
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Lightbox Dialog Overlay */}
      <AnimatePresence>
        {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
          <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-center p-4">
            {/* Top Toolbar */}
            <div className="absolute top-4 inset-x-4 flex justify-between items-center text-white z-20">
              <span className="text-xs bg-slate-800/80 px-3 py-1 rounded-full font-mono">
                {activeLightboxIndex + 1} / {filteredItems.length}
              </span>
              <button
                onClick={() => setActiveLightboxIndex(null)}
                className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-full transition-colors font-bold text-lg cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Main Stage Panel viewport container */}
            <div className="relative w-full max-w-3xl aspect-square sm:aspect-video flex items-center justify-center">
              <motion.img
                key={filteredItems[activeLightboxIndex].id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                src={filteredItems[activeLightboxIndex].url}
                alt={filteredItems[activeLightboxIndex].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg border border-slate-850"
              />

              {/* Prev icon Button */}
              <button
                onClick={handlePrevMedia}
                className="absolute left-2 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white cursor-pointer select-none"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next icon Button */}
              <button
                onClick={handleNextMedia}
                className="absolute right-2 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white cursor-pointer select-none"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-6 bg-slate-900/80 p-5 rounded-2xl max-w-xl text-center text-white border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">
                {isBn ? filteredItems[activeLightboxIndex].categoryBn : filteredItems[activeLightboxIndex].category}
              </span>
              <h5 className="font-sans font-bold text-sm sm:text-base leading-tight">
                {isBn ? filteredItems[activeLightboxIndex].titleBn : filteredItems[activeLightboxIndex].title}
              </h5>
              <p className="text-[10px] text-slate-400 font-sans">
                Source Document: {filteredItems[activeLightboxIndex].date} © Baliakandi Upazila Samiti, Dhaka
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
