import React, { useState, useRef, useEffect } from 'react';
import { Upload, Wand2, Loader2, Info, Box, ScanFace, ChevronRight, CheckCircle, ShoppingCart, Calendar, Palette, Search, Sparkles, AlertCircle, Maximize2, X } from 'lucide-react';
import { TryOnState, BodyMeasurements, Occasion, SkinTone } from '../types';
import { generateStylingAnalysis, generateVirtualTryOn } from '../services/gemini';

interface VirtualTryOnProps {
  initialGarment?: string | null;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ initialGarment }) => {
  const [state, setState] = useState<TryOnState>({
    faceImage: null,
    garmentImage: null,
    generatedImage: null,
    measurements: { height: '175', weight: '70', chest: '95', waist: '80', hips: '96' },
    skinTone: 'Wheatish',
    occasion: 'Casual',
    isGenerating: false,
    step: 'input',
    result: null,
  });

  const [viewImage, setViewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const faceFileInputRef = useRef<HTMLInputElement>(null);
  const garmentFileInputRef = useRef<HTMLInputElement>(null);

  // Convert URL to Base64 for API usage
  const convertUrlToBase64 = async (url: string) => {
    try {
      setImageLoading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image", error);
      return null;
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (initialGarment) {
      const processInitialGarment = async () => {
        if (initialGarment.startsWith('http')) {
          const base64 = await convertUrlToBase64(initialGarment);
          if (base64) {
            setState(prev => ({ ...prev, garmentImage: base64, generatedImage: null, result: null }));
          }
        } else {
          setState(prev => ({ ...prev, garmentImage: initialGarment, generatedImage: null, result: null }));
        }
      };
      processInitialGarment();
    }
  }, [initialGarment]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'garment') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          [type === 'face' ? 'faceImage' : 'garmentImage']: reader.result as string,
          result: null,
          generatedImage: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMeasurementChange = (key: keyof BodyMeasurements, value: string) => {
    setState(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [key]: value }
    }));
  };

  const handleGenerate = async () => {
    if (!state.faceImage || !state.garmentImage) return;

    setState(prev => ({ ...prev, isGenerating: true, step: 'avatar', generatedImage: null }));

    try {
      // Run Styling Analysis and Image Generation in parallel
      const [stylingResult, tryOnImage] = await Promise.all([
        generateStylingAnalysis(
          JSON.stringify(state.measurements),
          state.skinTone,
          state.occasion,
          state.garmentImage
        ),
        generateVirtualTryOn(state.faceImage, state.garmentImage)
      ]);

      setState(prev => ({
        ...prev,
        isGenerating: false,
        step: 'result',
        result: stylingResult,
        generatedImage: tryOnImage, // Set the AI generated image
      }));
    } catch (error) {
      console.error("Generation failed", error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const getAmazonLink = (query: string) => {
      return `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
  };

  const getGoogleShoppingLink = (query: string) => {
      return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative pb-12">
      {/* Image Lightbox */}
      {viewImage && (
        <div className="fixed inset-0 z-[100] bg-white/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewImage(null)}>
            <button 
                className="absolute top-6 right-6 text-slate-900 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                onClick={() => setViewImage(null)}
            >
                <X size={24} />
            </button>
            <img 
                src={viewImage} 
                className="max-w-full max-h-[90vh] rounded-lg shadow-2xl border border-slate-200 object-contain" 
                alt="Full size try-on" 
                onClick={(e) => e.stopPropagation()}
            />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <Box className="text-purple-500" />
            3D Suitability & Styling Studio
          </h2>
          <p className="text-slate-500 text-sm">Check outfit suitability, generate virtual try-on with your photo, and get accessory recommendations.</p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <div className={`flex items-center gap-2 ${state.step === 'input' ? 'text-purple-600 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${state.step === 'input' ? 'border-purple-600 bg-purple-50' : 'border-slate-300'}`}>1</span>
            Config
          </div>
          <ChevronRight size={14} className="text-slate-300" />
          <div className={`flex items-center gap-2 ${state.step === 'avatar' ? 'text-purple-600 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${state.step === 'avatar' ? 'border-purple-600 bg-purple-50' : 'border-slate-300'}`}>2</span>
            Check Suitability
          </div>
           <ChevronRight size={14} className="text-slate-300" />
          <div className={`flex items-center gap-2 ${state.step === 'result' ? 'text-purple-600 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${state.step === 'result' ? 'border-purple-600 bg-purple-50' : 'border-slate-300'}`}>3</span>
            Shop Look
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* Column 1: Configuration */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="font-semibold flex items-center gap-2 text-blue-600 border-b border-slate-100 pb-2 mb-4">
             <ScanFace size={18} /> Avatar & Context
           </h3>
           
           <div className="space-y-4">
             {/* Measurements */}
             <div className="grid grid-cols-2 gap-4">
               {Object.entries(state.measurements).slice(0,4).map(([key, val]) => (
                   <div key={key}>
                     <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block">{key}</label>
                     <input 
                        type="number" 
                        value={val}
                        onChange={(e) => handleMeasurementChange(key as keyof BodyMeasurements, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:border-purple-500 outline-none transition-colors text-slate-900"
                     />
                   </div>
               ))}
             </div>

             {/* Context Selectors */}
             <div className="grid grid-cols-1 gap-4 pt-2">
                 <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block flex items-center gap-1"><Calendar size={10}/> Occasion</label>
                    <select 
                        value={state.occasion}
                        onChange={(e) => setState(prev => ({...prev, occasion: e.target.value as Occasion}))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-900 focus:border-purple-500 outline-none"
                    >
                        <option value="Casual">Casual Day Out</option>
                        <option value="Wedding">Wedding / Sangeet</option>
                        <option value="Party">Party / Clubbing</option>
                        <option value="Festival">Festival (Diwali/Eid)</option>
                        <option value="Formal">Office / Formal</option>
                        <option value="Date Night">Date Night</option>
                        <option value="Gym">Gym / Workout</option>
                        <option value="Sports">Sports / Active</option>
                        <option value="Beach">Beach / Vacation</option>
                    </select>
                 </div>
                 <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 block flex items-center gap-1"><Palette size={10}/> Skin Tone</label>
                    <select 
                        value={state.skinTone}
                        onChange={(e) => setState(prev => ({...prev, skinTone: e.target.value as SkinTone}))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-900 focus:border-purple-500 outline-none"
                    >
                        <option value="Fair">Fair</option>
                        <option value="Wheatish">Wheatish</option>
                        <option value="Medium">Medium</option>
                        <option value="Dusky">Dusky</option>
                        <option value="Dark">Dark</option>
                    </select>
                 </div>
             </div>

             {/* Face Upload */}
             <div className="pt-4 border-t border-slate-100">
                <label className="text-sm font-medium block mb-2 text-slate-600">Face Photo (For Try-On Match)</label>
                <div 
                  onClick={() => faceFileInputRef.current?.click()}
                  className="h-24 rounded-lg border border-dashed border-slate-300 hover:border-blue-500 transition-colors bg-slate-50 flex flex-row items-center justify-center cursor-pointer overflow-hidden relative gap-2 group"
                >
                  {state.faceImage ? (
                    <>
                        <img src={state.faceImage} alt="Face" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                        <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={10}/> Uploaded</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <span className="text-xs text-slate-400 group-hover:text-slate-600">Upload Selfie</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={faceFileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'face')}
                  />
                </div>
             </div>
           </div>
        </div>

        {/* Column 2: Garment Input */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
           <h3 className="font-semibold flex items-center gap-2 text-purple-600 border-b border-slate-100 pb-2 mb-4">
             <Upload size={18} /> Garment Selection
           </h3>

           <div 
              onClick={() => garmentFileInputRef.current?.click()}
              className={`flex-1 min-h-[250px] rounded-xl border-2 border-dashed transition-colors bg-slate-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group ${state.garmentImage ? 'border-purple-400' : 'border-slate-300 hover:border-purple-400'}`}
            >
              {imageLoading ? (
                <div className="flex flex-col items-center text-slate-500">
                  <Loader2 className="animate-spin mb-2" />
                  <span className="text-xs">Loading Template...</span>
                </div>
              ) : state.garmentImage ? (
                <img src={state.garmentImage} alt="Garment" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-center p-4">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md transition-all">
                    <Upload size={24} className="text-slate-400 group-hover:text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Upload Outfit to Check Suitability</p>
                  <p className="text-xs text-slate-400 mt-1">Does this suit me? (Dresses, Suits, Ethnic)</p>
                </div>
              )}
               <input 
                type="file" 
                ref={garmentFileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'garment')}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!state.faceImage || !state.garmentImage || state.isGenerating}
              className={`w-full px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                !state.faceImage || !state.garmentImage
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20'
              }`}
            >
              {state.isGenerating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Wand2 size={20} />
              )}
              {state.isGenerating ? 'Simulating & Analyzing...' : 'Check Suitability & Style'}
            </button>
        </div>

        {/* Column 3: AI Styling Results */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-0 flex flex-col overflow-hidden h-full">
          <div className="p-6 pb-2 border-b border-slate-100">
            <h3 className="font-semibold flex items-center gap-2 text-green-600">
                <Info size={18} />
                Suitability & Styling Report
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {state.step === 'result' && state.result ? (
              <div className="space-y-6 animate-fade-in">
                 {/* Virtual Avatar Result View (Real AI Generated Image) */}
                 <div 
                    className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-lg group cursor-pointer"
                    onClick={() => state.generatedImage && setViewImage(state.generatedImage)}
                 >
                    {state.generatedImage ? (
                      <img 
                        src={state.generatedImage} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt="AI Generated Try-On" 
                      />
                    ) : (
                      // Fallback if AI generation fails or returns null
                      <>
                        <img 
                          src={state.garmentImage!} 
                          className="w-full h-full object-cover opacity-90 grayscale-[0.2]" 
                          alt="Try On Result - Outfit" 
                        />
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl overflow-hidden z-10">
                            <img 
                              src={state.faceImage!} 
                              className="w-full h-full object-cover" 
                              alt="Try On Result - Face" 
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 pointer-events-none">
                            <div className="bg-white/90 px-4 py-2 rounded-lg flex items-center gap-2 text-amber-600 text-xs font-bold shadow-sm">
                                <AlertCircle size={14}/> AI Image Gen Unavailable
                            </div>
                        </div>
                      </>
                    )}
                    
                    {/* Gradient Overlay for Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

                    {/* Result Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-green-200 text-green-600 p-2 rounded-full shadow-lg">
                       <CheckCircle size={18} />
                    </div>

                    {/* Zoom Hint */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-lg">
                        <Maximize2 size={18} />
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                         <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                {state.generatedImage ? 'AI Generated Try-On' : 'Visual Match Estimate'}
                            </span>
                         </div>
                         <p className="text-sm text-white font-medium leading-snug drop-shadow-md">
                            Matched your face with the outfit. Tap image to view full screen.
                         </p>
                    </div>
                </div>

                {/* Fit Analysis */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fit & Compatibility</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-blue-50 p-3 rounded-lg border-l-2 border-blue-500">
                        {state.result.fitAnalysis}
                    </p>
                </div>

                {/* Color Suggestions */}
                 <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color Palette ({state.skinTone})</h4>
                    <p className="text-sm text-slate-600 mb-2">{state.result.colorAnalysis}</p>
                    <div className="flex gap-2">
                        {state.result.colorSuggestions.map((color, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-700 border border-slate-200 font-medium">
                                {color}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Ornament Recommendations */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Sparkles size={16} /> Accessories & Ornaments
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        {state.result.ornaments.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:bg-white hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-base font-semibold text-slate-900 block">{item.name}</span>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider bg-white px-2 py-0.5 rounded mt-1 inline-block border border-slate-200">{item.type}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 italic mb-3">"{item.reason}"</p>
                                
                                <div className="flex gap-2 mt-2">
                                    <a 
                                        href={getAmazonLink(item.searchQuery)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-[#FF9900] hover:bg-[#e68a00] text-black text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <ShoppingCart size={12} /> Amazon
                                    </a>
                                     <a 
                                        href={getGoogleShoppingLink(item.searchQuery)} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Search size={12} /> Shop All
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

              </div>
            ) : state.step === 'avatar' ? (
                 <div className="h-full flex flex-col items-center justify-center space-y-6 text-center p-8">
                    <div className="relative w-24 h-24">
                         <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Wand2 size={32} className="text-purple-500 animate-pulse" />
                         </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-semibold text-slate-900">Generating Virtual Try-On...</p>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                           Styllen AI is fusing your photo with the outfit and curating accessories (rings, ties, footwear, etc.).
                        </p>
                    </div>
                 </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-60">
                <Box size={48} strokeWidth={1} />
                <p className="text-center text-sm">
                    Configure your avatar and upload an outfit<br/>to check suitability and find ornaments.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;