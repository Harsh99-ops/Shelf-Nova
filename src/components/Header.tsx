import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  Search, 
  Plus, 
  RotateCcw, 
  ChevronDown, 
  Sparkles,
  Crown
} from 'lucide-react';

interface HeaderProps {
  onOpenAddBatch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddBatch }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    alerts, 
    resetAllData,
    setCurrentTab
  } = useWarehouse();

  const [confirmReset, setConfirmReset] = useState(false);
  const [managerDropdown, setManagerDropdown] = useState(false);

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;

  return (
    <header className="sticky top-0 z-30 bg-[#fff9fa]/95 backdrop-blur-md border-b-2 border-pink-200/80 px-3 sm:px-6 py-2.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Manager Controls matching screenshot */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Cupcake + ShelfNova Logo */}
          <div 
            onClick={() => setCurrentTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            {/* Cupcake Icon with Crown */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-200 via-rose-100 to-amber-100 p-1 border-2 border-pink-300 shadow-sm group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                {/* Crown over cupcake */}
                <path d="M16 6L18 8L20 4L22 8L24 6L23 10H17L16 6Z" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                {/* Strawberry top */}
                <path d="M20 13C21 13 23 11 23 9C23 7.5 21.5 7 20 7C18.5 7 17 7.5 17 9C17 11 19 13 20 13Z" fill="#EF4444" />
                <circle cx="19" cy="9" r="0.5" fill="#FEF08A" />
                <circle cx="21" cy="9" r="0.5" fill="#FEF08A" />
                <path d="M19.5 7V5.5" stroke="#15803D" strokeWidth="1" strokeLinecap="round" />
                {/* Fluffy pink frosting */}
                <path d="M11 21C10 21 8 19.5 8 18C8 16 10 15 12 15C12 13 14 11 17 11C18 11 19 11.5 20 12C21 11.5 22 11 23 11C26 11 28 13 28 15C30 15 32 16 32 18C32 19.5 30 21 29 21C26 23 14 23 11 21Z" fill="#F472B6" stroke="#DB2777" strokeWidth="1" />
                {/* Frosting sprinkles */}
                <circle cx="15" cy="16" r="0.75" fill="#FEF08A" />
                <circle cx="24" cy="17" r="0.75" fill="#67E8F9" />
                <circle cx="20" cy="18" r="0.75" fill="#FFF" />
                {/* Cupcake baking wrapper */}
                <path d="M10 22L13 34C13.2 34.8 14 35.5 15 35.5H25C26 35.5 26.8 34.8 27 34L30 22H10Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
                <line x1="14" y1="23" x2="16" y2="34" stroke="#D97706" strokeWidth="0.8" />
                <line x1="20" y1="23" x2="20" y2="35" stroke="#D97706" strokeWidth="0.8" />
                <line x1="26" y1="23" x2="24" y2="34" stroke="#D97706" strokeWidth="0.8" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-candy font-extrabold text-xl sm:text-2xl tracking-tight text-[#3d1a10] drop-shadow-xs">
                  ShelfNova
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-pink-100 text-pink-700 border border-pink-300 shadow-xs uppercase tracking-wider">
                  AI WMS
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#78350f]/80">
                Smart Quality & Inventory
              </p>
            </div>
          </div>

          {/* Right Mobile Status: Manager Pill & Red Strawberry Bell (Exact match to screenshot) */}
          <div className="flex items-center gap-2">
            {/* Manager Pill Button */}
            <div className="relative">
              <button
                onClick={() => setManagerDropdown(!managerDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fff4de] hover:bg-[#ffecce] border border-[#fbd38d] text-[#78350f] text-xs font-bold shadow-xs transition cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>Manager</span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
              </button>

              {/* Manager Dropdown */}
              {managerDropdown && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white border-2 border-amber-200 shadow-xl p-2 z-50 text-xs space-y-1">
                  <div className="px-2 py-1 font-bold text-[#78350f] border-b border-amber-100">
                    Warehouse Lead
                  </div>
                  <button 
                    onClick={() => { setCurrentTab('alerts'); setManagerDropdown(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-pink-50 text-slate-700 flex items-center justify-between"
                  >
                    <span>Compliance Logs</span>
                    <span className="text-[10px] bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-full font-bold">HACCP</span>
                  </button>
                  <button 
                    onClick={() => { onOpenAddBatch(); setManagerDropdown(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-pink-50 text-slate-700 flex items-center gap-1"
                  >
                    <span>+ Intake New Batch</span>
                  </button>
                </div>
              )}
            </div>

            {/* Red Strawberry Bell with Notification Count (Matches Screenshot) */}
            <button
              onClick={() => setCurrentTab('alerts')}
              className="relative p-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200 transition cursor-pointer shadow-xs"
              title="Audit Alerts & Compliance"
            >
              {/* Strawberry Bell SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-rose-500 stroke-rose-600" strokeWidth="0.5">
                <path d="M12 2C10.9 2 10 2.9 10 4C7.8 4.6 6 6.6 6 9V14L4 16V17H20V16L18 14V9C18 6.6 16.2 4.6 14 4C14 2.9 13.1 2 12 2Z" />
                <path d="M9 19C9 20.7 10.3 22 12 22C13.7 22 15 20.7 15 19H9Z" />
              </svg>

              {/* Red Badge with Count */}
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-bold font-mono shadow-sm border border-white">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Search Bar (Pastel Confectionery Theme) */}
        <div className="w-full md:max-w-md relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search produce, batches, SKUs, or zones..."
            className="w-full pl-10 pr-8 py-2 rounded-2xl text-xs sm:text-sm bg-white/90 border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 text-[#4a2215] placeholder:text-pink-300 font-medium transition shadow-xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pink-400 hover:text-pink-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Reset Demo Data button */}
          {confirmReset ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  resetAllData();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="p-2 rounded-2xl bg-white hover:bg-pink-50 text-pink-400 hover:text-pink-600 border-2 border-pink-200 shadow-xs transition cursor-pointer"
              title="Reset Sample Produce Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Add Batch Button (Glossy Berry Button) */}
          <button
            onClick={onOpenAddBatch}
            className="candy-btn-gloss candy-pill-pink flex items-center gap-1.5 px-4 py-2 rounded-2xl text-white text-xs font-bold shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Intake Batch</span>
          </button>
        </div>
      </div>
    </header>
  );
};

