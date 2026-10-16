import React from 'react';
import { useWarehouse, ScreenTab } from '../context/WarehouseContext';
import { getDaysToExpiry } from '../services/fefoEngine';

export const CandyBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, batches, alerts } = useWarehouse();

  const criticalCount = batches.filter(b => {
    const d = getDaysToExpiry(b.expiryDate);
    return d <= 3 && b.status !== 'Dispatched';
  }).length;

  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  const navItems: {
    id: ScreenTab;
    label: string;
    badge?: number;
    badgeColor?: string;
    iconSvg: React.ReactNode;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      iconSvg: (
        // Gingerbread House Icon
        <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform group-hover:scale-110" fill="none">
          {/* House body */}
          <path d="M8 20L8 35C8 36.1 8.9 37 10 37H30C31.1 37 32 36.1 32 35V20L20 8L8 20Z" fill="#C67D46" stroke="#87471E" strokeWidth="1.5" />
          {/* Frosted Roof with Drips */}
          <path d="M5 21L20 7L35 21C35 21 33 23 31 22C29 21 27 23 25 22C23 21 21 23 19 22C17 21 15 23 13 22C11 21 9 23 7 22C5 21 5 21 5 21Z" fill="#FFF5FA" stroke="#F472B6" strokeWidth="1.2" />
          {/* Chimney */}
          <rect x="25" y="8" width="4" height="7" rx="1" fill="#C67D46" stroke="#87471E" strokeWidth="1" />
          <ellipse cx="27" cy="8" rx="2.5" ry="1" fill="#FFF5FA" />
          {/* Sugar Door */}
          <path d="M16 26C16 23.8 17.8 22 20 22C22.2 22 24 23.8 24 26V37H16V26Z" fill="#F472B6" stroke="#BE185D" strokeWidth="1" />
          <circle cx="22.5" cy="30" r="1" fill="#FEF08A" />
          {/* Candy Window */}
          <circle cx="20" cy="16" r="3" fill="#6EE7B7" stroke="#FFF" strokeWidth="1" />
          {/* White icing corner dots */}
          <circle cx="10" cy="35" r="1" fill="#FFF" />
          <circle cx="30" cy="35" r="1" fill="#FFF" />
        </svg>
      )
    },
    {
      id: 'inventory',
      label: 'Stock',
      badge: batches.length,
      iconSvg: (
        // Chocolate Bar Icon
        <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform group-hover:scale-110" fill="none">
          {/* Chocolate block base */}
          <rect x="7" y="10" width="26" height="22" rx="4" fill="#5A2814" stroke="#3D180A" strokeWidth="1.5" />
          {/* 6 Squares */}
          <rect x="10" y="13" width="8.5" height="6.5" rx="1.5" fill="#75351A" />
          <rect x="21.5" y="13" width="8.5" height="6.5" rx="1.5" fill="#75351A" />
          <rect x="10" y="22.5" width="8.5" height="6.5" rx="1.5" fill="#75351A" />
          <rect x="21.5" y="22.5" width="8.5" height="6.5" rx="1.5" fill="#75351A" />
          {/* Golden foil wrapper wrap */}
          <path d="M7 25C11 23 18 27 24 24C28 22 31 23 33 24V30C33 31.1 32.1 32 31 32H9C7.9 32 7 31.1 7 30V25Z" fill="url(#goldFoil)" opacity="0.9" />
          <defs>
            <linearGradient id="goldFoil" x1="7" y1="23" x2="33" y2="32">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'fefo',
      label: 'FEFO',
      badge: criticalCount > 0 ? criticalCount : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      iconSvg: (
        // Swirl Lollipop Icon
        <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform group-hover:scale-110" fill="none">
          {/* Lollipop stick */}
          <rect x="18.5" y="22" width="3" height="15" rx="1.5" fill="#FFF" stroke="#E2E8F0" strokeWidth="0.8" />
          {/* Lollipop circle */}
          <circle cx="20" cy="15" r="11" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
          {/* White swirl */}
          <path d="M20 7C16 7 13 10 13 14C13 18 16 21 19 21C22 21 24 19 24 16C24 14 22 12.5 20 12.5C18.5 12.5 17.5 13.5 17.5 14.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bow ribbon */}
          <circle cx="20" cy="23" r="2.5" fill="#38BDF8" />
          <path d="M16 23C17 21 17 25 18 23" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          <path d="M24 23C23 21 23 25 22 23" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'inspection',
      label: 'Inspect',
      iconSvg: (
        // Pastel Candy Camera Icon
        <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform group-hover:scale-110" fill="none">
          {/* Camera body (cyan / mint candy) */}
          <rect x="6" y="12" width="28" height="20" rx="6" fill="#67E8F9" stroke="#06B6D4" strokeWidth="1.5" />
          {/* Camera top flash mound */}
          <path d="M14 12V9C14 7.9 14.9 7 16 7H24C25.1 7 26 7.9 26 9V12H14Z" fill="#A5F3FC" />
          <circle cx="20" cy="9.5" r="1.5" fill="#FEF08A" />
          {/* Big Candy Lens */}
          <circle cx="20" cy="22" r="7" fill="#F472B6" stroke="#FFF" strokeWidth="2" />
          <circle cx="20" cy="22" r="4.5" fill="#4A2215" />
          {/* Specular glare */}
          <circle cx="18" cy="20" r="1.5" fill="#FFF" />
          {/* Corner mint star */}
          <circle cx="29" cy="16" r="1.5" fill="#FFF" />
        </svg>
      )
    },
    {
      id: 'telemetry',
      label: 'IoT',
      iconSvg: (
        // Strawberry Icon
        <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform group-hover:scale-110" fill="none">
          {/* Strawberry berry body */}
          <path d="M20 36C22 36 32 26 32 18C32 12.5 27 10 20 10C13 10 8 12.5 8 18C8 26 18 36 20 36Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.2" />
          {/* Calyx (green leaves) */}
          <path d="M20 7C21 9 24 10 26 9C24 11 24 13 22 13C21 11 19 11 18 13C16 13 16 11 14 9C16 10 19 9 20 7Z" fill="#22C55E" />
          <path d="M20 7V4" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          {/* Golden seeds */}
          <ellipse cx="15" cy="16" rx="0.8" ry="1.2" fill="#FEF08A" />
          <ellipse cx="25" cy="16" rx="0.8" ry="1.2" fill="#FEF08A" />
          <ellipse cx="20" cy="20" rx="0.8" ry="1.2" fill="#FEF08A" />
          <ellipse cx="15" cy="24" rx="0.8" ry="1.2" fill="#FEF08A" />
          <ellipse cx="25" cy="24" rx="0.8" ry="1.2" fill="#FEF08A" />
          <ellipse cx="20" cy="28" rx="0.8" ry="1.2" fill="#FEF08A" />
          {/* Specular gloss */}
          <path d="M12 16C12 14 14 12 17 12" stroke="#FCA5A5" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'assistant',
      label: 'AI Advisor',
      iconSvg: (
        // Frosted Star Cookie Icon
        <svg viewBox="0 0 40 40" className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm transition-transform group-hover:scale-110" fill="none">
          {/* Star cookie shape */}
          <path d="M20 4L24 13.5L34 14.5L26.5 21.5L29 31.5L20 26L11 31.5L13.5 21.5L6 14.5L16 13.5L20 4Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          {/* White sugar frosting */}
          <path d="M20 8L22.5 14.5L29.5 15.5L24.5 20.5L26 27.5L20 23.5L14 27.5L15.5 20.5L10.5 15.5L17.5 14.5L20 8Z" fill="#FFF5FA" />
          {/* Sugar sprinkles dots */}
          <circle cx="20" cy="16" r="1.2" fill="#F43F5E" />
          <circle cx="17" cy="20" r="1.2" fill="#06B6D4" />
          <circle cx="23" cy="20" r="1.2" fill="#8B5CF6" />
          <circle cx="20" cy="22" r="1" fill="#10B981" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 select-none pointer-events-auto">
      {/* Decorative Toppings Sitting on the Chocolate Bar Top Edge */}
      <div className="relative max-w-lg mx-auto h-4 sm:h-5 pointer-events-none">
        {/* Pink Macaron on left */}
        <div className="absolute left-4 -top-3 w-7 h-5 rounded-full bg-pink-400 border border-pink-300 shadow-sm flex items-center justify-center">
          <div className="w-5 h-1 bg-pink-100 rounded-full" />
        </div>
        {/* Tiny Donut */}
        <div className="absolute left-1/4 -top-3 w-6 h-6 rounded-full bg-amber-200 border border-amber-300 shadow-sm flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#3d1a10]" />
          <span className="absolute -top-0.5 right-1 text-[8px]">✨</span>
        </div>
        {/* Mint Jelly Candy in middle */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 w-6 h-4 rounded-xl bg-emerald-400/90 border border-emerald-200 shadow-sm flex items-center justify-center">
          <span className="w-2 h-1 bg-white/70 rounded-full" />
        </div>
        {/* Strawberry on right */}
        <div className="absolute right-1/4 -top-3 text-sm">
          🍓
        </div>
        {/* Blue Macaron on right */}
        <div className="absolute right-4 -top-3 w-7 h-5 rounded-full bg-cyan-400 border border-cyan-200 shadow-sm flex items-center justify-center">
          <div className="w-5 h-1 bg-cyan-100 rounded-full" />
        </div>
      </div>

      {/* Dripping Chocolate Frosting SVG Line */}
      <div className="w-full overflow-hidden leading-none -mb-[1px]">
        <svg 
          viewBox="0 0 1200 40" 
          className="w-full h-4 sm:h-5 block text-[#3d1a10] preserve-3d" 
          fill="currentColor" 
          preserveAspectRatio="none"
        >
          <path d="M0,0 C70,25 100,32 150,15 C200,-2 230,28 280,35 C330,42 360,10 420,20 C480,30 520,38 570,25 C620,12 660,35 710,38 C760,40 810,12 870,22 C930,32 970,36 1020,20 C1070,4 1120,28 1160,25 C1180,23 1200,0 1200,0 L1200,40 L0,40 Z" />
        </svg>
      </div>

      {/* Main Rich Chocolate Bar Navigation Body */}
      <div className="chocolate-fudge-bg px-2 sm:px-4 pt-1.5 pb-2.5 sm:pb-3 border-t-2 border-[#5a2815]">
        {/* Rainbow Sprinkles on chocolate bar */}
        <div className="absolute inset-x-0 top-0 h-2 flex justify-around opacity-75 pointer-events-none">
          <span className="w-2 h-0.5 bg-pink-400 rotate-12 rounded-full" />
          <span className="w-2 h-0.5 bg-yellow-300 -rotate-45 rounded-full" />
          <span className="w-1.5 h-0.5 bg-cyan-300 rotate-6 rounded-full" />
          <span className="w-2 h-0.5 bg-emerald-300 -rotate-12 rounded-full" />
          <span className="w-2 h-0.5 bg-purple-300 rotate-45 rounded-full" />
          <span className="w-1.5 h-0.5 bg-rose-300 -rotate-6 rounded-full" />
          <span className="w-2 h-0.5 bg-yellow-300 rotate-12 rounded-full" />
          <span className="w-2 h-0.5 bg-pink-400 -rotate-30 rounded-full" />
        </div>

        <nav className="max-w-xl mx-auto flex items-center justify-between gap-1 relative z-10">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all duration-200 cursor-pointer relative group ${
                  isActive
                    ? 'scale-105'
                    : 'opacity-85 hover:opacity-100 hover:scale-102'
                }`}
              >
                {/* Active Glowing Pink/White Ring Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-500/35 to-rose-600/20 rounded-2xl border border-pink-400/40 shadow-inner" />
                )}

                {/* Icon Container with Badge */}
                <div className="relative z-10 flex items-center justify-center p-1">
                  {item.iconSvg}

                  {item.badge !== undefined && item.badge > 0 && (
                    <span 
                      className={`absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono shadow-sm border border-white/50 ${
                        item.badgeColor || 'bg-amber-400 text-amber-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] sm:text-xs font-candy tracking-wide transition-colors z-10 ${
                    isActive
                      ? 'text-pink-200 font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
                      : 'text-amber-100/80 group-hover:text-white'
                  }`}
                >
                  {item.label}
                </span>

                {/* Active sugar pearl dot */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-300 mt-0.5 shadow-sm shadow-pink-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
