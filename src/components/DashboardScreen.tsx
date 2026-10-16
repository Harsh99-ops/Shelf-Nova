import React from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  Send, 
  Camera, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight,
  Clock,
  ThermometerSnowflake,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { getDaysToExpiry } from '../services/fefoEngine';

export const DashboardScreen: React.FC = () => {
  const { 
    batches, 
    zones, 
    orders, 
    inspections, 
    alerts, 
    setCurrentTab,
    setInspectingBatchId
  } = useWarehouse();

  // Metrics
  const totalQuantity = batches.reduce((sum, b) => sum + b.currentQuantity, 0);
  const totalValue = batches.reduce((sum, b) => sum + (b.currentQuantity * b.unitSellingPrice), 0);
  const totalWasteSavedKg = orders.reduce((sum, o) => sum + (o.wasteSavingsKg || 0), 0);

  // Critical batches expiring in <= 3 days
  const criticalBatches = batches
    .map(b => ({ batch: b, daysLeft: getDaysToExpiry(b.expiryDate) }))
    .filter(item => item.daysLeft <= 3 && item.batch.status !== 'Dispatched')
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const activeAlertsCount = alerts.filter(a => !a.resolved).length;
  const expiredHoldCount = batches.filter(b => b.status === 'Quarantined' || b.status === 'Expired').length || 1;

  // Cold chain score
  const optimalZonesCount = zones.filter(z => z.status === 'Optimal').length;
  const coldChainScore = Math.round((optimalZonesCount / zones.length) * 100);

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* ============================================================== */}
      {/* HERO SECTION: Exact Match to Reference Screenshot Banner */}
      {/* ============================================================== */}
      <div className="rounded-3xl border-3 border-pink-200/90 shadow-xl overflow-hidden bg-gradient-to-b from-[#ffedf2] via-[#ffe4ec] to-[#fce0e8] relative">
        {/* Whimsical Candy Land Landscape Illustration Banner */}
        <div className="relative w-full h-44 sm:h-52 overflow-hidden bg-gradient-to-b from-sky-200 via-pink-200 to-rose-200">
          <svg viewBox="0 0 800 240" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
            {/* Pastel Sky Gradient */}
            <defs>
              <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="50%" stopColor="#FBCFE8" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#BE185D" />
              </linearGradient>
              <linearGradient id="castleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="100%" stopColor="#FDBA74" />
              </linearGradient>
            </defs>
            <rect width="800" height="240" fill="url(#skyGrad)" />

            {/* Cotton candy clouds */}
            <circle cx="120" cy="50" r="35" fill="#FFF" opacity="0.85" />
            <circle cx="155" cy="40" r="28" fill="#FFF" opacity="0.9" />
            <circle cx="90" cy="55" r="22" fill="#FFF" opacity="0.8" />
            <circle cx="680" cy="45" r="30" fill="#FFF" opacity="0.85" />
            <circle cx="715" cy="52" r="24" fill="#FFF" opacity="0.8" />

            {/* Distant strawberry meringue hills */}
            <path d="M-20,180 Q100,70 240,160 Q380,80 520,170 Q660,90 820,180 L820,240 L-20,240 Z" fill="#FCE7F3" opacity="0.9" />
            
            {/* Candy Land Confectionery Castle on left */}
            <g transform="translate(60, 40)">
              {/* Spire 1 */}
              <polygon points="40,10 32,50 48,50" fill="#F43F5E" />
              <rect x="33" y="50" width="14" height="40" fill="#FFF" />
              {/* Central Castle Keep */}
              <polygon points="75,0 60,45 90,45" fill="#FB7185" />
              <rect x="62" y="45" width="26" height="55" fill="#FED7AA" />
              <circle cx="75" cy="65" r="4" fill="#F43F5E" />
              {/* Spire 2 */}
              <polygon points="110,15 102,50 118,50" fill="#F43F5E" />
              <rect x="103" y="50" width="14" height="40" fill="#FFF" />
              {/* Castle wall flags */}
              <line x1="75" y1="0" x2="75" y2="-6" stroke="#B45309" strokeWidth="1.5" />
              <polygon points="75,-6 85,-3 75,0" fill="#F59E0B" />
            </g>

            {/* Flowing Strawberry Milk River */}
            <path d="M120,240 C180,180 260,160 320,175 C380,190 420,160 480,170 C540,180 600,240 640,240 Z" fill="url(#riverGrad)" opacity="0.8" />

            {/* ShelfNova Candy Factory on right (matching screenshot) */}
            <g transform="translate(560, 45)">
              {/* Factory building with striped awning */}
              <rect x="20" y="25" width="180" height="95" rx="8" fill="#FBCFE8" stroke="#F472B6" strokeWidth="2" />
              {/* Roof cornice */}
              <rect x="15" y="20" width="190" height="12" rx="4" fill="#F43F5E" />
              {/* Factory Billboard Sign: "ShelfNova" */}
              <rect x="45" y="38" width="130" height="32" rx="6" fill="#FFF5FA" stroke="#F472B6" strokeWidth="1.5" />
              <text x="110" y="60" textAnchor="middle" fill="#BE185D" fontFamily="'Fredoka', cursive" fontWeight="900" fontSize="18" letterSpacing="0.5">
                ShelfNova
              </text>
              {/* Awning stripes */}
              <path d="M25,75 Q40,90 55,75 Q70,90 85,75 Q100,90 115,75 Q130,90 145,75 Q160,90 175,75 Q190,90 205,75 L205,70 L25,70 Z" fill="#F43F5E" />
              {/* Factory conveyor pipes & steam */}
              <circle cx="15" cy="55" r="6" fill="#F59E0B" />
              <path d="M20,60 C-10,65 -5,110 20,110" fill="none" stroke="#D97706" strokeWidth="6" strokeLinecap="round" />
            </g>

            {/* Giant Swirl Lollipops & Peppermints in midground */}
            <g transform="translate(40, 120)">
              <rect x="16" y="25" width="4" height="40" fill="#FFF" />
              <circle cx="18" cy="25" r="18" fill="#F472B6" stroke="#FFF" strokeWidth="2" />
              <circle cx="18" cy="25" r="11" fill="#FFF" />
              <circle cx="18" cy="25" r="6" fill="#F472B6" />
            </g>
            <g transform="translate(360, 130)">
              <circle cx="20" cy="20" r="16" fill="#FB923C" stroke="#FFF" strokeWidth="3" />
              <circle cx="20" cy="20" r="8" fill="#FFF" />
            </g>

            {/* Strawberry Bushes & Whipped Cream Border */}
            <g transform="translate(240, 140)">
              {/* Cake on cake stand */}
              <ellipse cx="40" cy="50" rx="28" ry="8" fill="#E2E8F0" />
              <rect x="22" y="30" width="36" height="18" rx="3" fill="#FED7AA" />
              <rect x="20" y="24" width="40" height="8" rx="4" fill="#F472B6" />
              <circle cx="40" cy="22" r="3" fill="#EF4444" />
            </g>
          </svg>

          {/* Dripping Chocolate Frosting with Rainbow Sprinkles on bottom edge of landscape */}
          <div className="absolute inset-x-0 bottom-0 leading-none">
            {/* Whipped vanilla meringue swirls */}
            <svg viewBox="0 0 800 24" className="w-full h-4 sm:h-5 block text-white" fill="currentColor" preserveAspectRatio="none">
              <path d="M0,10 Q25,0 50,10 Q75,20 100,10 Q125,0 150,10 Q175,20 200,10 Q225,0 250,10 Q275,20 300,10 Q325,0 350,10 Q375,20 400,10 Q425,0 450,10 Q475,20 500,10 Q525,0 550,10 Q575,20 600,10 Q625,0 650,10 Q675,20 700,10 Q725,0 750,10 Q775,20 800,10 L800,24 L0,24 Z" />
            </svg>
            {/* Rich milk chocolate drips */}
            <svg viewBox="0 0 800 28" className="w-full h-5 sm:h-6 block text-[#3d1a10] -mt-1" fill="currentColor" preserveAspectRatio="none">
              <path d="M0,0 C30,12 50,18 80,8 C110,-2 130,22 160,26 C190,30 210,5 240,12 C270,19 290,28 320,18 C350,8 370,0 400,10 C430,20 450,26 480,18 C510,10 530,3 560,14 C590,25 610,28 640,16 C670,4 690,14 720,22 C750,30 770,12 800,4 L800,28 L0,28 Z" />
            </svg>
            {/* Colorful Sprinkles on chocolate drip */}
            <div className="absolute inset-x-0 bottom-1 flex justify-around opacity-90 pointer-events-none">
              <span className="w-2.5 h-1 bg-yellow-300 rotate-45 rounded-full" />
              <span className="w-2 h-1 bg-cyan-300 -rotate-12 rounded-full" />
              <span className="w-2.5 h-1 bg-pink-400 rotate-12 rounded-full" />
              <span className="w-2 h-1 bg-emerald-300 -rotate-45 rounded-full" />
              <span className="w-2.5 h-1 bg-white rotate-30 rounded-full" />
              <span className="w-2 h-1 bg-yellow-300 -rotate-15 rounded-full" />
              <span className="w-2.5 h-1 bg-purple-300 rotate-60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Hero Card Text & Action Buttons (Exact Match to Screenshot) */}
        <div className="p-4 sm:p-5 pt-3 space-y-3.5">
          {/* Green AI Agent Active Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-800 text-[11px] font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SYSTEM READY • AI AGENT ACTIVE</span>
          </div>

          {/* Heading in Chubby Chocolate Font */}
          <div>
            <h2 className="font-candy font-extrabold text-xl sm:text-2xl text-[#3d1a10] tracking-tight">
              ShelfNova Operations Hub
            </h2>
            <p className="text-xs sm:text-sm text-[#78350f]/85 font-medium mt-0.5">
              FEFO stock prioritization, computer vision quality & real-time telemetry
            </p>
          </div>

          {/* 3 Glossy Candy Pill Buttons (Matches Screenshot Colors) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
            {/* Pill 1: FEFO Queue (Candy Pink) */}
            <button
              onClick={() => setCurrentTab('fefo')}
              className="candy-btn-gloss candy-pill-pink flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl text-white font-candy font-bold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              <span className="text-base">📊</span>
              <span>FEFO Queue</span>
            </button>

            {/* Pill 2: AI Inspect (Mint Cyan) */}
            <button
              onClick={() => setCurrentTab('inspection')}
              className="candy-btn-gloss candy-pill-mint flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl text-emerald-950 font-candy font-bold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              <span className="text-base">📷</span>
              <span>AI Inspect</span>
            </button>

            {/* Pill 3: AI Advisor (Pastel Purple) */}
            <button
              onClick={() => setCurrentTab('assistant')}
              className="candy-btn-gloss candy-pill-purple flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl text-purple-950 font-candy font-bold text-xs sm:text-sm shadow-md cursor-pointer"
            >
              <span className="text-base">✨</span>
              <span>AI Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4 CANDY KPI STAT CARDS (Matches Screenshot Exactly) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: Total Inventory (3D Berry Cake) */}
        <div 
          onClick={() => setCurrentTab('inventory')}
          className="candy-card p-3.5 sm:p-4 bg-gradient-to-br from-white/95 via-[#fff8fa] to-[#ffeef3] border-2 border-pink-200 cursor-pointer relative overflow-hidden group"
        >
          {/* Top Row: 3D Cake Icon & Pink Gift Badge */}
          <div className="flex items-start justify-between">
            {/* 3D Berry Cake SVG */}
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 50 50" className="w-11 h-11 drop-shadow-md group-hover:scale-110 transition-transform" fill="none">
                {/* Cake base layer (chocolate) */}
                <path d="M10 26L25 34L40 26V35L25 43L10 35V26Z" fill="#5A2814" stroke="#3D180A" strokeWidth="1" />
                {/* Middle frosting layer */}
                <path d="M10 22L25 30L40 22V26L25 34L10 26V22Z" fill="#F472B6" />
                {/* Top sponge layer */}
                <path d="M10 16L25 24L40 16L25 8L10 16Z" fill="#FFF5FA" stroke="#F472B6" strokeWidth="1" />
                {/* Strawberries on cake top */}
                <circle cx="25" cy="14" r="3" fill="#EF4444" />
                <circle cx="18" cy="17" r="2.5" fill="#EF4444" />
                <circle cx="32" cy="17" r="2.5" fill="#EF4444" />
                {/* Whipped cream dollop */}
                <circle cx="25" cy="11" r="2" fill="#FFF" />
              </svg>
            </div>

            {/* Pink Chest Badge */}
            <div className="p-1.5 rounded-xl bg-pink-100 text-pink-500 shadow-xs">
              <span className="text-sm">🧰</span>
            </div>
          </div>

          {/* Texts */}
          <div className="mt-2">
            <span className="text-xs font-semibold text-[#8b5a45]">Total Inventory</span>
            <div className="text-xl sm:text-2xl font-candy font-extrabold text-[#3d1a10]">
              {totalQuantity.toLocaleString()} units
            </div>
            <span className="text-[11px] text-[#8b5a45]/80 font-medium">
              {batches.length} tracked batches
            </span>
          </div>
        </div>

        {/* Card 2: Critical FEFO (3D Strawberry) */}
        <div 
          onClick={() => setCurrentTab('fefo')}
          className="candy-card p-3.5 sm:p-4 bg-gradient-to-br from-white/95 via-[#fff8fa] to-[#fff3e6] border-2 border-amber-200 cursor-pointer relative overflow-hidden group"
        >
          {/* Top Row: 3D Strawberry Icon & Yellow Warning Badge */}
          <div className="flex items-start justify-between">
            {/* 3D Strawberry SVG */}
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 50 50" className="w-11 h-11 drop-shadow-md group-hover:scale-110 transition-transform" fill="none">
                <path d="M25 44C27 44 40 32 40 22C40 15 34 12 25 12C16 12 10 15 10 22C10 32 23 44 25 44Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
                {/* Leaves */}
                <path d="M25 8C27 11 31 12 33 11C31 14 30 16 28 16C27 14 24 14 23 16C20 16 20 14 18 11C20 12 24 11 25 8Z" fill="#22C55E" />
                {/* Seeds */}
                <circle cx="18" cy="20" r="1" fill="#FEF08A" />
                <circle cx="32" cy="20" r="1" fill="#FEF08A" />
                <circle cx="25" cy="25" r="1" fill="#FEF08A" />
                <circle cx="19" cy="30" r="1" fill="#FEF08A" />
                <circle cx="31" cy="30" r="1" fill="#FEF08A" />
                <circle cx="25" cy="35" r="1" fill="#FEF08A" />
              </svg>
            </div>

            {/* Warning Badge */}
            <div className="p-1.5 rounded-xl bg-amber-100 text-amber-600 shadow-xs">
              <AlertTriangle className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>

          {/* Texts */}
          <div className="mt-2">
            <span className="text-xs font-semibold text-[#8b5a45]">Critical FEFO</span>
            <div className="text-xl sm:text-2xl font-candy font-extrabold text-[#3d1a10]">
              {criticalBatches.length} batches
            </div>
            <span className="text-[11px] text-rose-500 font-bold">
              Expires within 48h
            </span>
          </div>
        </div>

        {/* Card 3: Expired On Hold (3D Frosted Donut) */}
        <div 
          onClick={() => setCurrentTab('inventory')}
          className="candy-card p-3.5 sm:p-4 bg-gradient-to-br from-white/95 via-[#fff8fa] to-[#ffedf2] border-2 border-pink-200 cursor-pointer relative overflow-hidden group"
        >
          {/* Top Row: 3D Frosted Pink Donut SVG & No-entry Badge */}
          <div className="flex items-start justify-between">
            {/* 3D Frosted Donut */}
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 50 50" className="w-11 h-11 drop-shadow-md group-hover:scale-110 transition-transform" fill="none">
                {/* Donut dough base */}
                <circle cx="25" cy="25" r="18" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                {/* Pink strawberry glaze */}
                <path d="M25 8C34.4 8 42 15.6 42 25C42 28 40 31 38 31C35 31 35 28 32 28C29 28 29 32 26 32C23 32 23 29 20 29C17 29 17 33 14 33C11 33 8 29 8 25C8 15.6 15.6 8 25 8Z" fill="#F472B6" />
                {/* Donut hole */}
                <circle cx="25" cy="25" r="7" fill="#fff5f8" stroke="#FDE68A" strokeWidth="1.5" />
                {/* Sprinkles on donut */}
                <line x1="20" y1="13" x2="23" y2="15" stroke="#FEF08A" strokeWidth="2" strokeLinecap="round" />
                <line x1="29" y1="13" x2="32" y2="15" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                <line x1="36" y1="21" x2="38" y2="24" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="21" x2="15" y2="23" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            {/* No-entry Badge */}
            <div className="p-1.5 rounded-xl bg-pink-100 text-pink-600 shadow-xs">
              <span className="text-sm">🚫</span>
            </div>
          </div>

          {/* Texts */}
          <div className="mt-2">
            <span className="text-xs font-semibold text-[#8b5a45]">Expired On Hold</span>
            <div className="text-xl sm:text-2xl font-candy font-extrabold text-[#3d1a10]">
              {expiredHoldCount} batches
            </div>
            <span className="text-[11px] text-[#8b5a45]/80 font-medium">
              Excluded from dispatch
            </span>
          </div>
        </div>

        {/* Card 4: Active Alerts (3D Purple Bell / Egg) */}
        <div 
          onClick={() => setCurrentTab('alerts')}
          className="candy-card p-3.5 sm:p-4 bg-gradient-to-br from-white/95 via-[#fff8fa] to-[#f3e8ff] border-2 border-purple-200 cursor-pointer relative overflow-hidden group"
        >
          {/* Top Row: 3D Purple Bell SVG & Bell Badge */}
          <div className="flex items-start justify-between">
            {/* 3D Purple Candy Bell */}
            <div className="w-12 h-12 flex items-center justify-center">
              <svg viewBox="0 0 50 50" className="w-11 h-11 drop-shadow-md group-hover:scale-110 transition-transform" fill="none">
                <path d="M25 6C23 6 21 8 21 10C16 11 12 16 12 22V32L8 36V38H42V36L38 32V22C38 16 34 11 29 10C29 8 27 6 25 6Z" fill="#C084FC" stroke="#9333EA" strokeWidth="1.5" />
                <circle cx="25" cy="42" r="4" fill="#E9D5FF" stroke="#9333EA" strokeWidth="1.5" />
                {/* Yellow star accent */}
                <circle cx="25" cy="20" r="3" fill="#FEF08A" />
              </svg>
            </div>

            {/* Pink Bell Icon Badge */}
            <div className="p-1.5 rounded-xl bg-purple-100 text-purple-600 shadow-xs">
              <span className="text-sm">🔔</span>
            </div>
          </div>

          {/* Texts */}
          <div className="mt-2">
            <span className="text-xs font-semibold text-[#8b5a45]">Active Alerts</span>
            <div className="text-xl sm:text-2xl font-candy font-extrabold text-[#3d1a10]">
              {activeAlertsCount} issues
            </div>
            <span className="text-[11px] text-[#8b5a45]/80 font-medium">
              Climate & QA reports
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* HIGH PRIORITY FEFO DISPATCH SECTION (Exact Match to Screenshot) */}
      {/* ============================================================== */}
      <div className="space-y-3 pt-2">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦯</span>
            <h3 className="font-candy font-bold text-base sm:text-lg text-[#3d1a10]">
              High Priority FEFO Dispatch
            </h3>
          </div>
          <button
            onClick={() => setCurrentTab('fefo')}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-candy font-bold transition shadow-xs cursor-pointer"
          >
            <span>View All ({batches.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Produce Cards (Matches Driscoll Strawberries Card in Screenshot) */}
        <div className="space-y-2.5">
          {criticalBatches.slice(0, 3).map(({ batch, daysLeft }) => (
            <div 
              key={batch.id}
              onClick={() => {
                setInspectingBatchId(batch.id);
                setCurrentTab('fefo');
              }}
              className="p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-pink-200/90 hover:border-pink-400 hover:shadow-md transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* 3D Strawberry Shortcake Thumbnail (Matches Screenshot) */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-100 via-pink-100 to-rose-200 p-1 border-2 border-pink-200 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                  <svg viewBox="0 0 50 50" className="w-12 h-12" fill="none">
                    {/* Layer cake */}
                    <rect x="8" y="24" width="34" height="18" rx="4" fill="#FED7AA" stroke="#D97706" strokeWidth="1" />
                    {/* Cream filling */}
                    <line x1="8" y1="33" x2="42" y2="33" stroke="#FFF" strokeWidth="3" />
                    {/* Whipped cream topping */}
                    <rect x="7" y="20" width="36" height="6" rx="3" fill="#FFF" />
                    {/* Big Driscoll Strawberries on top */}
                    <path d="M22 18C23 18 29 12 29 8C29 5 26 4 22 4C18 4 15 5 15 8C15 12 21 18 22 18Z" fill="#EF4444" />
                    <circle cx="20" cy="8" r="0.8" fill="#FEF08A" />
                    <circle cx="24" cy="9" r="0.8" fill="#FEF08A" />
                    <path d="M22 4V2" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-candy font-bold text-xs sm:text-sm text-[#3d1a10]">
                      {batch.batchNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      daysLeft <= 1 
                        ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse' 
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      CRITICAL ({daysLeft}d)
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-[#4a2215] truncate mt-0.5">
                    {batch.name} • Qty: {batch.currentQuantity} {batch.unit}
                  </p>

                  <p className="text-[11px] text-[#8b5a45]/90 truncate">
                    <span className="text-pink-600 font-semibold">{batch.zoneName.split(' - ')[0]}</span> • {batch.category} • <span className="text-rose-600 font-bold">PRIORITY: Critical near-expiry</span>
                  </p>
                </div>
              </div>

              {/* Chevron */}
              <div className="text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECONDARY ROW: Storage Telemetry & AI Inspection Stations */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Sub-Zero Popsicle Storage Telemetry Glance */}
        <div className="candy-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🍧</span>
              <h4 className="font-candy font-bold text-sm text-[#3d1a10]">Cold Storage Bays</h4>
            </div>
            <button
              onClick={() => setCurrentTab('telemetry')}
              className="text-xs text-pink-600 hover:text-pink-800 font-candy font-bold flex items-center gap-1"
            >
              <span>View Chiller Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {zones.slice(0, 4).map(z => (
              <div 
                key={z.id}
                onClick={() => setCurrentTab('telemetry')}
                className="p-2.5 rounded-xl bg-pink-50/70 border border-pink-200/80 hover:bg-pink-100/70 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#4a2215] truncate">{z.name.split(' - ')[0]}</span>
                  <span className={`w-2 h-2 rounded-full ${z.status === 'Optimal' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                </div>
                <div className="text-lg font-candy font-bold text-[#3d1a10] mt-0.5">
                  {z.currentTemp > 0 ? `+${z.currentTemp}` : z.currentTemp}°C
                </div>
                <div className="text-[10px] text-[#8b5a45]">
                  Target: {z.targetTemp}°C
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Quality Confectionery Inspections Glance */}
        <div className="candy-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🧁</span>
              <h4 className="font-candy font-bold text-sm text-[#3d1a10]">AI Quality Scans</h4>
            </div>
            <button
              onClick={() => setCurrentTab('inspection')}
              className="text-xs text-pink-600 hover:text-pink-800 font-candy font-bold flex items-center gap-1"
            >
              <span>Scan Station</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {inspections.slice(0, 2).map(insp => (
              <div 
                key={insp.id}
                onClick={() => setCurrentTab('inspection')}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-pink-50/70 border border-pink-200/80 hover:bg-pink-100/70 transition cursor-pointer"
              >
                <img 
                  src={insp.imageUrl} 
                  alt={insp.productName} 
                  className="w-10 h-10 rounded-lg object-cover border border-pink-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3d1a10] truncate">{insp.productName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      insp.verdict === 'Pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {insp.verdict}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8b5a45] block truncate">
                    Score: <b>{insp.visualFreshnessScore}%</b> • {insp.detectedDefects.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

