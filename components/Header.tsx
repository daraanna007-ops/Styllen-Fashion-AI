
import React from 'react';
import { Shirt, User, Sparkles, Settings } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: <Sparkles size={18} /> },
    { id: AppView.TRY_ON, label: '3D Virtual Try-On', icon: <Shirt size={18} /> },
    { id: AppView.CHAT, label: 'Styllen Chat', icon: <User size={18} /> },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentView(AppView.DASHBOARD)}
          >
            {/* Custom Gold Star Logo Icon */}
            <div className="w-11 h-11 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
               <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  {/* Main 4-Point Star */}
                  <path 
                    d="M50 15C50 15 58 42 85 50C58 58 50 85 50 85C50 85 42 58 15 50C42 42 50 15 50 15Z" 
                    stroke="#ca8a04" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="drop-shadow-sm"
                  />
                  {/* Top Right Sparkle */}
                  <path d="M78 22L86 22M82 18L82 26" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Bottom Left Dot */}
                  <circle cx="22" cy="78" r="3.5" fill="#ca8a04" />
               </svg>
            </div>
            
            {/* Brand Text */}
            <div className="flex flex-col -space-y-0.5 mt-1">
              <span 
                style={{ fontFamily: '"Playfair Display", serif' }} 
                className="text-2xl font-semibold text-slate-900 tracking-tight leading-none"
              >
                Styllen
              </span>
              <span className="text-[0.65rem] text-yellow-600 tracking-[0.35em] font-medium uppercase pl-0.5">
                Fashion AI
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <nav className="flex gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200 hidden md:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-white text-slate-900 border border-slate-200 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {item.icon}
                  <span className="inline">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Profile Button */}
            <button
              onClick={() => setCurrentView(AppView.PROFILE)}
              className={`ml-2 p-2.5 rounded-full border transition-all duration-200 ${
                currentView === AppView.PROFILE
                  ? 'bg-slate-900 border-slate-700 text-white shadow-lg'
                  : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
              }`}
              title="User Profile"
            >
              <Settings size={18} />
            </button>
            
            {/* Mobile Menu Button - Simplified */}
            <div className="md:hidden flex gap-1">
               {navItems.map((item) => (
                  <button key={item.id} onClick={() => setCurrentView(item.id)} className={`p-2 rounded-full ${currentView === item.id ? 'bg-slate-200 text-slate-900' : 'text-slate-400'}`}>
                      {item.icon}
                  </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;