import React, { useState, useEffect } from 'react';
import { CloudSun, ShoppingBag, TrendingUp, Zap, MapPin, Calendar, Heart, X, Palette, ArrowRight, Sparkles, Dumbbell, Trophy, PartyPopper, Briefcase, Shirt, Play, Pause, Palmtree, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { AppView, OutfitTemplate } from '../types';

interface DashboardProps {
  onSelectOutfit?: (imageUrl: string) => void;
  setCurrentView?: (view: AppView) => void;
}

const SAVED_OUTFITS = [
  { id: 1, event: "Cousin's Wedding", date: 'Oct 24', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop', notes: 'Gold Lehenga with emeralds' },
  { id: 2, event: 'Tech Conference', date: 'Nov 05', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=400&auto=format&fit=crop', notes: 'Power Suit - Navy Blue' },
  { id: 3, event: 'Diwali Party', date: 'Nov 12', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=400&auto=format&fit=crop', notes: 'Classic Silk Saree' }
];

const COLOR_SHADES = [
  { name: 'Royal Blue', hex: '#4169E1', tag: 'Power' },
  { name: 'Emerald', hex: '#50C878', tag: 'Harmony' },
  { name: 'Mustard', hex: '#FFDB58', tag: 'Vibrant' },
  { name: 'Ruby Red', hex: '#E0115F', tag: 'Bold' },
  { name: 'Deep Purple', hex: '#36013F', tag: 'Luxury' },
  { name: 'Terracotta', hex: '#E2725B', tag: 'Earthy' },
  { name: 'Teal', hex: '#008080', tag: 'Calm' },
  { name: 'Champagne', hex: '#F7E7CE', tag: 'Elegant' }
];

const OUTFIT_TEMPLATES: OutfitTemplate[] = [
  // Beach
  { id: 'beach1', name: 'Boho Maxi Dress', category: 'Beach', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80' },
  { id: 'beach2', name: 'Linen Resort Set', category: 'Beach', image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=600&q=80' },
  { id: 'beach3', name: 'Summer Kaftan', category: 'Beach', image: 'https://images.unsplash.com/photo-1585416774997-e5450c2c3b34?auto=format&fit=crop&w=600&q=80' },

  // Gym / Sports
  { id: 'gym1', name: 'High Impact Set', category: 'Gym', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=600&q=80' },
  { id: 'gym2', name: 'Yoga Flow', category: 'Gym', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80' },
  { id: 'sport1', name: 'Tennis Whites', category: 'Sports', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80' },
  { id: 'sport2', name: 'Running Gear', category: 'Sports', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80' },

  // Wedding / Festival
  { id: 'wed1', name: 'Bridal Lehenga', category: 'Wedding', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' },
  { id: 'wed2', name: 'Sherwani Gold', category: 'Wedding', image: 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?auto=format&fit=crop&w=600&q=80' },
  { id: 'fest1', name: 'Silk Saree', category: 'Festival', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
  { id: 'fest2', name: 'Kurta Set', category: 'Festival', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80' },

  // Party
  { id: 'party1', name: 'Sequined Dress', category: 'Party', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80' },
  { id: 'party2', name: 'Velvet Blazer', category: 'Party', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80' },

  // Casual
  { id: 'cas1', name: 'Linen Summer', category: 'Casual', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
  { id: 'cas2', name: 'Denim Jacket', category: 'Casual', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80' },
  
  // Formal
  { id: 'form1', name: 'Office Chic', category: 'Formal', image: 'https://images.unsplash.com/photo-1548271987-55c87b9f16a7?auto=format&fit=crop&w=600&q=80' },
  { id: 'form2', name: 'Navy Suit', category: 'Formal', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80' },
];

const RECOMMENDED_STREAM = [
    { id: 1, type: 'outfit', title: 'Minimalist Linen Suit', subtitle: 'Trending in Hyderabad', image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa5e7?auto=format&fit=crop&w=600&q=80' },
    { id: 2, type: 'ornament', title: 'Rose Gold Watch', subtitle: 'Matches your skin tone', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80' },
    { id: 3, type: 'outfit', title: 'Floral Summer Dress', subtitle: 'Perfect for 29°C', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80' },
    { id: 4, type: 'ornament', title: 'Pearl Drop Earrings', subtitle: 'Elegance for Evenings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
    { id: 5, type: 'outfit', title: 'Athleisure Set', subtitle: 'For your morning gym', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=600&q=80' }
];

const HERO_SLIDES = [
  { image: "https://images.unsplash.com/photo-1583391725988-64305c218a1d?q=80&w=2070&auto=format&fit=crop", label: "Wedding" },
  { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop", label: "Beach" },
  { image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop", label: "Gym" },
  { image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2070&auto=format&fit=crop", label: "Party" },
  { image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2070&auto=format&fit=crop", label: "Casual" },
  { image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=2070&auto=format&fit=crop", label: "Sports" }
];

const Dashboard: React.FC<DashboardProps> = ({ onSelectOutfit, setCurrentView }) => {
  const [activeModal, setActiveModal] = useState<'none' | 'saved' | 'palette' | 'curate'>('none');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Animation state for recommended stream
  const [streamIndex, setStreamIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Hero background animation state
  const [heroIndex, setHeroIndex] = useState(0);

  // Stream Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isPaused) {
      interval = setInterval(() => {
        setStreamIndex((prev) => (prev + 1) % RECOMMENDED_STREAM.length);
      }, 3500); // Change every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  // Hero Background Timer
  useEffect(() => {
    const timer = setInterval(() => {
        setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change background every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleTemplateSelect = (imageUrl: string) => {
    if (onSelectOutfit) {
      onSelectOutfit(imageUrl);
    }
  };

  const handleCategoryClick = (category: string) => {
      setFilterCategory(category);
      setActiveModal('curate');
  };

  const handleSavedOutfitDiscover = () => {
      setFilterCategory('All');
      setActiveModal('curate');
  };

  const filteredTemplates = filterCategory === 'All' 
    ? OUTFIT_TEMPLATES 
    : OUTFIT_TEMPLATES.filter(t => t.category === filterCategory);

  const currentStreamItem = RECOMMENDED_STREAM[streamIndex];

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      
      {/* Modals Overlay */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')}>
          <div className="bg-white w-full max-w-5xl rounded-2xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            
            {/* Saved Outfits Modal */}
            {activeModal === 'saved' && (
              <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                    <ShoppingBag className="text-pink-500" /> Upcoming Events & Fits
                  </h3>
                  <button onClick={() => setActiveModal('none')} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X size={20}/></button>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                  {SAVED_OUTFITS.map(item => (
                    <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group flex shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-1/3 h-full relative">
                         <img src={item.image} alt={item.notes} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 w-2/3 flex flex-col justify-center">
                        <div className="text-xs font-mono text-purple-600 mb-1">{item.date}</div>
                        <h4 className="font-bold text-lg text-slate-900 mb-1">{item.event}</h4>
                        <p className="text-sm text-slate-500">{item.notes}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Discover More Button inside Modal */}
                  <button 
                    onClick={handleSavedOutfitDiscover}
                    className="bg-white rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-6 hover:border-purple-500 transition-colors group"
                  >
                     <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-purple-50 transition-colors">
                        <Sparkles size={24} className="text-slate-400 group-hover:text-purple-600" />
                     </div>
                     <h4 className="font-semibold text-slate-700 group-hover:text-purple-700">Discover More Templates</h4>
                     <p className="text-xs text-slate-400 mt-1">Find looks for your next event</p>
                  </button>
                </div>
              </>
            )}

            {/* Color Palette Modal */}
            {activeModal === 'palette' && (
               <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                    <Palette className="text-blue-500" /> Your Skin Tone Palette
                  </h3>
                  <button onClick={() => setActiveModal('none')} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X size={20}/></button>
                </div>
                <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
                   <p className="text-slate-600 mb-6">
                     Based on your <strong>Wheatish</strong> skin tone, these curated shades will enhance your natural glow.
                   </p>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {COLOR_SHADES.map((shade, idx) => (
                       <div key={idx} className="group cursor-pointer">
                         <div 
                            className="h-24 w-full rounded-xl shadow-lg mb-2 transform transition-transform group-hover:-translate-y-1 border border-black/5" 
                            style={{ backgroundColor: shade.hex }}
                         ></div>
                         <div className="flex justify-between items-end">
                            <div>
                              <h4 className="font-medium text-slate-800 text-sm">{shade.name}</h4>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{shade.hex}</span>
                            </div>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
               </>
            )}

            {/* Curate / Templates Modal */}
            {activeModal === 'curate' && (
               <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                      <Zap className="text-purple-500" /> Curate Your Look
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-slate-500">Select a template to try on.</p>
                        {filterCategory !== 'All' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                                {filterCategory}
                            </span>
                        )}
                    </div>
                  </div>
                  <button onClick={() => setActiveModal('none')} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"><X size={20}/></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50">
                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                     {filteredTemplates.length > 0 ? filteredTemplates.map((t) => (
                       <div 
                          key={t.id} 
                          onClick={() => handleTemplateSelect(t.image)}
                          className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-purple-500 transition-all shadow-sm hover:shadow-lg"
                       >
                         <img src={t.image} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
                         <div className="absolute bottom-0 left-0 w-full p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <span className="text-[10px] uppercase tracking-widest text-purple-300 font-bold mb-1 block">{t.category}</span>
                            <h4 className="text-white font-semibold leading-tight">{t.name}</h4>
                            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                              Try On <ArrowRight size={12}/>
                            </div>
                         </div>
                       </div>
                     )) : (
                         <div className="col-span-full py-12 text-center text-slate-500">
                             <p>No templates found for {filterCategory}.</p>
                             <button onClick={() => setFilterCategory('All')} className="text-purple-600 hover:underline mt-2 text-sm">View All</button>
                         </div>
                     )}
                   </div>
                </div>
               </>
            )}

          </div>
        </div>
      )}

      {/* Hero Section with Animated Models Background - All Occasions */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 min-h-[520px] flex items-center p-8 sm:p-12 group shadow-xl transition-all duration-500">
        {/* Background Slideshow */}
        {HERO_SLIDES.map((slide, idx) => (
            <div 
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === heroIndex ? 'opacity-100' : 'opacity-0'}`}
            >
                 {/* High-key overlay for light theme, darker at bottom/left for text readability */}
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/30 to-transparent z-10"></div>
                 <img 
                    src={slide.image} 
                    alt={slide.label} 
                    className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${idx === heroIndex ? 'scale-110' : 'scale-100'}`}
                 />
                 {/* Label Badge */}
                 <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wider uppercase z-20 shadow-lg">
                    {slide.label} Collection
                 </div>
            </div>
        ))}

        <div className="relative z-20 max-w-3xl text-white">
          <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tight font-display leading-tight drop-shadow-xl">
             Namaste, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">Anna</span>
          </h1>
          <p className="text-2xl sm:text-3xl text-slate-100 font-light italic font-serif mb-4 drop-shadow-lg">
            "Elegance is an algorithm. Discover yours."
          </p>
          <p className="text-base text-slate-200 max-w-xl leading-relaxed drop-shadow-md">
             Styllen curates styles that speak your language, blending tradition with AI-driven precision. From weddings to workouts to beach days, we have your perfect fit.
          </p>
          <div className="flex gap-4 mt-10">
              <button 
                onClick={() => { setFilterCategory('All'); setActiveModal('curate'); }}
                className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                <Zap size={20} className="fill-slate-900" />
                Curate New Look
              </button>
          </div>
        </div>

        {/* Related Images UI - Thumbnails for manual control */}
        <div className="absolute bottom-8 right-8 z-30 flex gap-3 bg-black/20 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
            {HERO_SLIDES.map((slide, idx) => (
                <button 
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 relative group/thumb ${heroIndex === idx ? 'border-white scale-110 shadow-lg ring-2 ring-white/50' : 'border-white/30 opacity-70 hover:opacity-100 hover:scale-105'}`}
                    title={slide.label}
                >
                    <img src={slide.image} className="w-full h-full object-cover" alt={slide.label} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                        <span className="text-[8px] text-white font-bold uppercase">{slide.label}</span>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Grid Stats & Features - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Widget */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-orange-300 transition-all group cursor-default shadow-sm hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-500 group-hover:bg-orange-100 transition-colors">
              <CloudSun size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <MapPin size={10} /> HYDERABAD
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Hyderabad</h3>
          <p className="text-3xl font-bold mt-2 text-slate-900">29°C</p>
          <p className="text-sm text-slate-500 mt-1">Sunny. Perfect for Linens.</p>
        </div>

        {/* Interactive Saved Outfits Card */}
        <div 
          onClick={() => setActiveModal('saved')}
          className="bg-white p-6 rounded-xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
        >
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <ArrowRight size={16} className="text-pink-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-pink-50 rounded-lg text-pink-500 group-hover:bg-pink-100 transition-colors">
              <ShoppingBag size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400">UPCOMING</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Saved Outfits</h3>
          <div className="flex items-end gap-2 mt-2">
            <p className="text-3xl font-bold text-slate-900">3</p>
            <span className="text-xs text-pink-500 mb-1.5 font-medium">Events Planned</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Click to manage your event looks.</p>
        </div>

        {/* Interactive Skin Tone Card */}
        <div 
          onClick={() => setActiveModal('palette')}
          className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
        >
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <ArrowRight size={16} className="text-blue-500" />
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500 group-hover:bg-blue-100 transition-colors">
              <TrendingUp size={24} />
            </div>
            <span className="text-xs font-mono text-slate-400">AI INSIGHT</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Skin Tone Match</h3>
          <div className="flex items-end gap-2 mt-2">
             <div className="flex -space-x-2">
                {COLOR_SHADES.slice(0,3).map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-white shadow-sm" style={{backgroundColor: c.hex}}></div>
                ))}
             </div>
             <span className="text-xs text-blue-500 mb-1.5 font-medium">+5 More</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Wheatish Tone. Tap to view palette.</p>
        </div>
      </div>

      {/* Shop by Occasion */}
      <div className="space-y-4">
         <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900">
            <Calendar size={20} className="text-purple-500"/> 
            Shop by Occasion
         </h2>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
                { name: 'Wedding', category: 'Wedding', icon: <Heart size={16} />, img: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=300&q=80' },
                { name: 'Festival', category: 'Festival', icon: <Sparkles size={16} />, img: 'https://images.unsplash.com/photo-1514222709107-a180c68d72b4?auto=format&fit=crop&w=300&q=80' },
                { name: 'Gym', category: 'Gym', icon: <Dumbbell size={16} />, img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=300&q=80' },
                { name: 'Sports', category: 'Sports', icon: <Trophy size={16} />, img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=300&q=80' },
                { name: 'Party', category: 'Party', icon: <PartyPopper size={16} />, img: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=300&q=80' },
                { name: 'Casual', category: 'Casual', icon: <Shirt size={16} />, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80' },
                { name: 'Formal', category: 'Formal', icon: <Briefcase size={16} />, img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=300&q=80' },
                { name: 'Beach', category: 'Beach', icon: <Palmtree size={16} />, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80' }
            ].map((item, idx) => (
                <div 
                    key={idx} 
                    onClick={() => handleCategoryClick(item.category)}
                    className="relative h-36 rounded-xl overflow-hidden group cursor-pointer border border-slate-200 hover:border-purple-400 transition-all shadow-sm hover:shadow-lg"
                >
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex flex-col items-center justify-center gap-2">
                        <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-900 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg">
                            {item.icon}
                        </div>
                        <span className="font-bold text-sm tracking-wide text-white drop-shadow-md">{item.name}</span>
                    </div>
                </div>
            ))}
         </div>
      </div>

      {/* Recommended Style Stream (Animation Video Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900">
                    <Play size={20} className="text-red-500 fill-red-500" />
                    Recommended Style Stream
                </h2>
                <button onClick={() => setIsPaused(!isPaused)} className="text-slate-400 hover:text-slate-900">
                    {isPaused ? <Play size={18} /> : <Pause size={18} />}
                </button>
             </div>
             
             <div className="relative h-[400px] w-full bg-slate-900 group">
                {/* Animated Background Layer */}
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
                    style={{ 
                        backgroundImage: `url(${currentStreamItem.image})`,
                        filter: 'blur(20px) brightness(0.4)'
                    }}
                ></div>

                {/* Main Content Content */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl w-full">
                        {/* Image Card */}
                        <div key={streamIndex} className="relative w-64 md:w-80 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/20 transform transition-all duration-500 ease-out">
                            <img 
                                src={currentStreamItem.image} 
                                alt={currentStreamItem.title} 
                                className="w-full h-full object-cover animate-ken-burns" 
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wider shadow-sm">
                                {currentStreamItem.type}
                            </div>
                        </div>
                        
                        {/* Text Info */}
                        <div key={streamIndex + 'text'} className="flex-1 text-center md:text-left space-y-4 animate-fade-in-up">
                            <div>
                                <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Just For You</span>
                                <h3 className="text-4xl md:text-5xl font-black text-white mt-2 leading-tight font-display drop-shadow-lg">{currentStreamItem.title}</h3>
                            </div>
                            <p className="text-xl text-slate-200 font-light italic">{currentStreamItem.subtitle}</p>
                            
                            <div className="flex gap-4 justify-center md:justify-start pt-4">
                                <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-lg">
                                    View Details
                                </button>
                                <button className="px-6 py-3 border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors">
                                    Save Look
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                    {RECOMMENDED_STREAM.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-500 ${idx === streamIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'}`}
                        ></div>
                    ))}
                </div>
             </div>
          </div>
      </div>
      
    </div>
  );
};

export default Dashboard;