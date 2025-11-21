import React, { useState, useRef } from 'react';
import { Save, User, Ruler, Palette, Sun, Camera, Upload, Calendar, Clock, Plus, Check, X } from 'lucide-react';
import { UserProfile, BodyMeasurements, SkinTone } from '../types';

const SKIN_TONE_PALETTES: Record<SkinTone, { colors: string[], description: string }> = {
  'Fair': {
    colors: ['#E6E6FA', '#FFB6C1', '#50C878', '#000080', '#40E0D0'],
    description: 'Pastels, jewel tones, and cool blues complement fair skin perfectly.'
  },
  'Wheatish': {
    colors: ['#FFD700', '#DC143C', '#008080', '#F5DEB3', '#FF7F50'],
    description: 'Warm earth tones, golds, and vibrant reds bring out the glow in wheatish skin.'
  },
  'Medium': {
    colors: ['#B8860B', '#800000', '#4169E1', '#D2691E', '#556B2F'],
    description: 'Deep metallics, ochre, and royal blues create a striking contrast.'
  },
  'Dusky': {
    colors: ['#FF00FF', '#FF4500', '#2E8B57', '#4B0082', '#C71585'],
    description: 'Bold, saturated colors like magenta, emerald, and cobalt look stunning.'
  },
  'Dark': {
    colors: ['#FFFF00', '#FFFFFF', '#0000FF', '#800080', '#FF0000'],
    description: 'High contrast colors like bright yellow, white, and rich violet pop beautifully.'
  }
};

const UserProfileComponent: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Dara Anna',
    age: '24',
    birthday: '1999-08-15',
    profilePicture: null,
    skinTone: 'Wheatish',
    stylePreferences: ['Minimalist', 'Indo-Western', 'Streetwear'],
    favoriteColors: ['Black', 'Navy', 'Emerald'],
    defaultMeasurements: {
      height: '175',
      weight: '70',
      chest: '96',
      waist: '80',
      hips: '95'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#6366f1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMeasurementChange = (key: keyof BodyMeasurements, value: string) => {
    setProfile(prev => ({
      ...prev,
      defaultMeasurements: {
        ...prev.defaultMeasurements,
        [key]: value
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = () => {
    if (newColorHex) {
      setProfile(prev => ({
        ...prev,
        favoriteColors: [...prev.favoriteColors, newColorHex]
      }));
      setIsAddingColor(false);
    }
  };

  const handleRemoveColor = (indexToRemove: number) => {
    setProfile(prev => ({
        ...prev,
        favoriteColors: prev.favoriteColors.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const recommendedPalette = SKIN_TONE_PALETTES[profile.skinTone];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-900">
            <User className="text-purple-600" size={32} />
            My Profile
          </h2>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-slate-200"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity */}
        <div className="lg:col-span-1 space-y-6">
           {/* Profile Picture Card */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center text-center relative overflow-hidden group shadow-sm">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-xl">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={64} className="w-full h-full p-6 text-slate-400" />
                    )}
                </div>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-colors shadow-lg border-2 border-white"
                >
                    <Camera size={16} />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
              
              <div className="w-full space-y-3 text-left mt-4">
                 <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Full Name</label>
                    <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({...prev, name: e.target.value}))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-purple-500 outline-none mt-1"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                            <Calendar size={10} /> Birthday
                        </label>
                        <input 
                            type="date" 
                            value={profile.birthday}
                            onChange={(e) => setProfile(prev => ({...prev, birthday: e.target.value}))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-purple-500 outline-none mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                            <Clock size={10} /> Age
                        </label>
                        <input 
                            type="number" 
                            value={profile.age}
                            onChange={(e) => setProfile(prev => ({...prev, age: e.target.value}))}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-purple-500 outline-none mt-1"
                        />
                    </div>
                 </div>
              </div>
           </div>

           {/* Style Stats */}
           <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Palette size={16} className="text-pink-500"/> Your Vibe
              </h4>
              <div className="flex flex-wrap gap-2">
                  {profile.stylePreferences.map((style, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm border border-slate-200 transition-colors cursor-pointer">
                        {style}
                    </span>
                  ))}
                  <button className="px-3 py-1.5 border border-dashed border-slate-300 rounded-lg text-sm text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors">
                    + Add Tag
                  </button>
              </div>
           </div>
        </div>

        {/* Right Column: Physical & Style Logic */}
        <div className="lg:col-span-2 space-y-6">
            {/* Skin Tone & Dynamic Palette */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900">
                        <Sun size={20} className="text-orange-500" />
                        Skin Tone Analysis
                    </h3>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm text-slate-500 mb-3">Select Skin Tone</label>
                        <div className="grid grid-cols-5 gap-3">
                            {(['Fair', 'Wheatish', 'Medium', 'Dusky', 'Dark'] as SkinTone[]).map((tone) => (
                                <button
                                    key={tone}
                                    onClick={() => setProfile(p => ({...p, skinTone: tone}))}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all group ${
                                        profile.skinTone === tone 
                                        ? 'bg-purple-50 border-purple-500 scale-105 shadow-lg' 
                                        : 'border-transparent bg-slate-50 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full shadow-inner border border-black/5`} style={{
                                        backgroundColor: 
                                            tone === 'Fair' ? '#F5E0D7' :
                                            tone === 'Wheatish' ? '#E8C4A6' :
                                            tone === 'Medium' ? '#C69C84' :
                                            tone === 'Dusky' ? '#8D5524' : '#4F301F'
                                    }}></div>
                                    <span className={`text-xs font-medium ${profile.skinTone === tone ? 'text-purple-900' : 'text-slate-500 group-hover:text-slate-700'}`}>{tone}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Color Recommendations */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-sm font-bold text-slate-900">Recommended Palette</h4>
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase tracking-wider border border-purple-200">
                                Based on {profile.skinTone}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 italic">"{recommendedPalette.description}"</p>
                        <div className="flex gap-3">
                            {recommendedPalette.colors.map((color, idx) => (
                                <div key={idx} className="group relative">
                                    <div 
                                        className="w-12 h-12 rounded-full shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Measurements */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                    <Ruler size={20} className="text-blue-500" />
                    <h3 className="font-semibold text-lg text-slate-900">Body Measurements</h3>
                </div>
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {Object.entries(profile.defaultMeasurements).map(([key, val]) => (
                        <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200 hover:border-blue-400 transition-colors">
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">{key} (cm/kg)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={val}
                                    onChange={(e) => handleMeasurementChange(key as keyof BodyMeasurements, e.target.value)}
                                    className="w-full bg-transparent text-xl font-semibold text-slate-900 focus:outline-none placeholder-slate-400"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Manual Favorite Colors */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                 <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Palette size={16} className="text-slate-400" /> My Saved Colors
                 </h4>
                 <div className="flex flex-wrap gap-3 items-center">
                    {profile.favoriteColors.map((color, idx) => (
                        <div key={idx} className="relative group">
                            <div className="flex items-center gap-2 bg-slate-100 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer">
                                <div className={`w-6 h-6 rounded-full border border-white shadow-sm`} style={{ 
                                    backgroundColor: color.toLowerCase() === 'navy' ? '#000080' : 
                                                    color.toLowerCase() === 'emerald' ? '#50c878' : 
                                                    color 
                                }}></div>
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 capitalize">{color}</span>
                            </div>
                            <button 
                                onClick={() => handleRemoveColor(idx)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                            >
                                <X size={10} />
                            </button>
                        </div>
                    ))}
                    
                    {isAddingColor ? (
                         <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200 animate-fade-in">
                             <input 
                                type="color" 
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                                className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none"
                             />
                             <button 
                                onClick={handleAddColor}
                                className="w-8 h-8 flex items-center justify-center bg-green-600 rounded-full hover:bg-green-500 text-white transition-colors"
                             >
                                 <Check size={16} />
                             </button>
                             <button 
                                onClick={() => setIsAddingColor(false)}
                                className="w-8 h-8 flex items-center justify-center bg-red-600/80 rounded-full hover:bg-red-500 text-white transition-colors"
                             >
                                 <X size={16} />
                             </button>
                         </div>
                    ) : (
                        <button 
                            onClick={() => setIsAddingColor(true)}
                            className="w-8 h-8 rounded-full border border-dashed border-slate-400 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-600 hover:bg-slate-100 transition-all"
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfileComponent;