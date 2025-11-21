
import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import VirtualTryOn from './components/VirtualTryOn';
import FashionChat from './components/FashionChat';
import UserProfileComponent from './components/UserProfile';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedGarment, setSelectedGarment] = useState<string | null>(null);

  const handleOutfitSelect = (imageUrl: string) => {
    setSelectedGarment(imageUrl);
    setCurrentView(AppView.TRY_ON);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onSelectOutfit={handleOutfitSelect} setCurrentView={setCurrentView} />;
      case AppView.TRY_ON:
        return <VirtualTryOn initialGarment={selectedGarment} />;
      case AppView.CHAT:
        return <FashionChat />;
      case AppView.PROFILE:
        return <UserProfileComponent />;
      default:
        return <Dashboard onSelectOutfit={handleOutfitSelect} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-purple-200 selection:text-purple-900 font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Background decorative elements - Light Theme */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] opacity-60"></div>
      </div>
    </div>
  );
};

export default App;