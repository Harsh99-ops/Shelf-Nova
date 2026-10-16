import React from 'react';
import { useWarehouse, ScreenTab } from '../context/WarehouseContext';
import { 
  LayoutDashboard, 
  Layers, 
  Send, 
  Camera, 
  Thermometer, 
  Bot, 
  ShieldAlert, 
  Sparkles,
  Cookie
} from 'lucide-react';
import { getDaysToExpiry } from '../services/fefoEngine';

export const Sidebar: React.FC = () => {
  const { currentTab, setCurrentTab, batches, alerts, zones } = useWarehouse();

  // Calculate live badge counts
  const criticalBatches = batches.filter(b => {
    const days = getDaysToExpiry(b.expiryDate);
    return days <= 3 && b.status !== 'Dispatched';
  }).length;

  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  // Occupancy metrics
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacityPallets, 0);
  const totalOccupied = zones.reduce((sum, z) => sum + z.occupiedPallets, 0);
  const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);

  const navItems: { id: ScreenTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeColor?: string; sublabel: string; emoji: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Operations Hub', 
      icon: LayoutDashboard,
      sublabel: 'Executive Overview',
      emoji: '🏰'
    },
    { 
      id: 'fefo', 
      label: 'FEFO Dispatch Engine', 
      icon: Send, 
      badge: criticalBatches,
      badgeColor: 'bg-rose-500 text-white animate-pulse',
      sublabel: 'Salvage & Picking',
      emoji: '🍭'
    },
    { 
      id: 'inspection', 
      label: 'AI Quality Inspection', 
      icon: Camera, 
      sublabel: 'Computer Vision Scan',
      emoji: '📷'
    },
    { 
      id: 'telemetry', 
      label: 'IoT Storage Telemetry', 
      icon: Thermometer, 
      sublabel: 'Sub-Zero Cold Chain',
      emoji: '🍓'
    },
    { 
      id: 'inventory', 
      label: 'Stock Directory', 
      icon: Layers, 
      badge: batches.length,
      badgeColor: 'bg-pink-100 text-pink-700 border border-pink-300',
      sublabel: 'Produce Lots & SKUs',
      emoji: '🍫'
    },
    { 
      id: 'assistant', 
      label: 'AI RAG Assistant', 
      icon: Bot, 
      sublabel: 'HACCP & Floor SOPs',
      emoji: '⭐'
    },
    { 
      id: 'alerts', 
      label: 'HACCP & Audit Logs', 
      icon: ShieldAlert, 
      badge: unresolvedAlerts,
      badgeColor: unresolvedAlerts > 0 ? 'bg-amber-400 text-amber-950 font-bold' : undefined,
      sublabel: 'Compliance Seals',
      emoji: '🍯'
    }
  ];

  return (
    <aside className="hidden lg:flex w-64 shrink-0 border-r-2 border-pink-200/80 bg-[#fffbfc]/90 backdrop-blur-md p-4 flex-col justify-between select-none">
      <div className="space-y-5">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-candy font-bold tracking-wider text-pink-700/80 uppercase flex items-center justify-between">
            <span>Candy WMS Matrix</span>
            <span>🍬</span>
          </div>
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-200/90 via-rose-100/90 to-amber-100/70 text-[#3d1a10] border-2 border-pink-300 shadow-sm font-bold scale-[1.02]'
                    : 'text-[#6b3724] hover:text-[#3d1a10] hover:bg-pink-50/80 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base group-hover:scale-125 transition-transform">{item.emoji}</span>
                  <div className="truncate">
                    <div className="truncate font-candy text-[13px]">{item.label}</div>
                    <div className="text-[10px] text-pink-500/80 group-hover:text-pink-600 truncate">
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-pink-100 text-pink-700'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Candy Utilization Card */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-50 to-pink-50 border-2 border-pink-200/90 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-candy font-bold text-[#4a2215] flex items-center gap-1.5">
              <Cookie className="w-3.5 h-3.5 text-amber-500" />
              <span>Bay Capacity</span>
            </span>
            <span className="text-xs font-mono font-bold text-pink-600">
              {occupancyRate}%
            </span>
          </div>
          
          {/* Sugar Progress bar */}
          <div className="w-full bg-pink-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-pink-200">
            <div 
              className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${occupancyRate}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-[#78350f]/80">
            <span>{totalOccupied} Pallets</span>
            <span>{totalCapacity} Cap</span>
          </div>
        </div>
      </div>

      {/* Footer Confectionery Badge */}
      <div className="pt-3 border-t-2 border-pink-100 text-[11px] text-pink-600/80 space-y-1">
        <div className="flex items-center justify-between font-candy font-bold text-[#3d1a10]">
          <span>Freshness Engine</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[10px]">FEFO ACTIVE</span>
        </div>
        <div>HACCP • Candy Land Certified</div>
      </div>
    </aside>
  );
};

