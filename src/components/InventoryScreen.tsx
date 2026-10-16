
import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  Layers, 
  Search, 
  Filter, 
  Camera, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Barcode, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Trash2, 
  Edit3, 
  Sparkles,
  Thermometer,
  Boxes,
  Plus
} from 'lucide-react';
import { WarehouseBatch, ProductCategory, StorageZoneId, BatchStatus } from '../types/warehouse';
import { getDaysToExpiry } from '../services/fefoEngine';

interface InventoryScreenProps {
  onOpenAddBatch: () => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({ onOpenAddBatch }) => {
  const { 
    batches, 
    searchQuery, 
    setSearchQuery, 
    setCurrentTab, 
    setInspectingBatchId,
    quarantineBatch,
    deleteBatch,
    updateBatch
  } = useWarehouse();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Selected batch for detail modal
  const [selectedBatch, setSelectedBatch] = useState<WarehouseBatch | null>(null);
  const [adjustQtyModal, setAdjustQtyModal] = useState<boolean>(false);
  const [newQty, setNewQty] = useState<number>(0);

  // Filter batches
  const filteredBatches = batches.filter(batch => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      !q || 
      batch.name.toLowerCase().includes(q) ||
      batch.sku.toLowerCase().includes(q) ||
      batch.batchNumber.toLowerCase().includes(q) ||
      batch.supplier.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || batch.category === selectedCategory;
    const matchesZone = selectedZone === 'All' || batch.zoneId === selectedZone;

    const daysLeft = getDaysToExpiry(batch.expiryDate);
    let matchesStatus = true;
    if (selectedStatus === 'Critical') {
      matchesStatus = daysLeft <= 3 && batch.status !== 'Dispatched';
    } else if (selectedStatus === 'Warning') {
      matchesStatus = daysLeft > 3 && daysLeft <= 7 && batch.status !== 'Dispatched';
    } else if (selectedStatus === 'Optimal') {
      matchesStatus = batch.status === 'Optimal';
    } else if (selectedStatus === 'Quarantined') {
      matchesStatus = batch.status === 'Quarantined';
    }

    return matchesSearch && matchesCategory && matchesZone && matchesStatus;
  });

  const handleAdjustQuantity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    updateBatch(selectedBatch.id, { currentQuantity: newQty });
    setSelectedBatch({ ...selectedBatch, currentQuantity: newQty });
    setAdjustQtyModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Sweet Shop Confectionery Pantry Theme */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-100 via-[#fff8eb] to-[#fed7aa] border-2 border-amber-300 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[11px] font-candy font-bold bg-amber-200 text-amber-900 border border-amber-300 shadow-xs flex items-center gap-1">
              <span>🍫</span> Sweet Shop Pantry & Inventory
            </span>
            <span className="text-xs text-[#78350f] font-semibold">{filteredBatches.length} Lots on Shelves</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-candy font-extrabold text-[#3d1a10]">
            Warehouse Stock Registry & Traceability
          </h2>
        </div>

        <button
          onClick={onOpenAddBatch}
          className="candy-btn-gloss candy-pill-caramel flex items-center gap-2 px-4 py-2.5 rounded-2xl text-amber-950 font-candy font-bold text-xs shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Intake New Lot</span>
        </button>
      </div>

      {/* Filter Toolbar: Jelly Bean Filter Pills */}
      <div className="candy-card p-4 bg-white/95 border-2 border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#8b5a45] font-candy font-bold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Shelves:
          </span>
          {['All', 'Fresh Produce', 'Dairy & Eggs', 'Meat & Poultry', 'Seafood', 'Bakery', 'Pharmaceuticals & Vaccines'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-candy font-bold text-xs transition cursor-pointer shadow-xs ${
                selectedCategory === cat
                  ? 'candy-btn-gloss candy-pill-caramel text-amber-950 scale-105'
                  : 'bg-amber-50 text-[#78350f] hover:bg-amber-100 border border-amber-200'
              }`}
            >
              {cat === 'Pharmaceuticals & Vaccines' ? 'Pharma' : cat}
            </button>
          ))}
        </div>

        {/* Secondary Zone & Status Dropdowns */}
        <div className="flex items-center gap-2">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 border-2 border-amber-200 text-[#4a2215] font-candy font-bold focus:border-amber-400"
          >
            <option value="All">All Storage Bays</option>
            <option value="zone-a">Zone A (Fruit & Berry)</option>
            <option value="zone-b">Zone B (Ice Cream & Cryo)</option>
            <option value="zone-c">Zone C (Dairy & Cream)</option>
            <option value="zone-d">Zone D (Ambient Bakery)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-amber-50 border-2 border-amber-200 text-[#4a2215] font-candy font-bold focus:border-amber-400"
          >
            <option value="All">All Statuses</option>
            <option value="Critical">Critical (≤ 3d Expiry)</option>
            <option value="Warning">Warning (4-7d Expiry)</option>
            <option value="Optimal">Optimal</option>
            <option value="Quarantined">Quarantined</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="candy-card bg-white/95 border-2 border-amber-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fffbf0] border-b-2 border-amber-100 text-[#8b5a45] font-candy font-bold">
              <tr>
                <th className="p-3.5">SKU & Lot Number</th>
                <th className="p-3.5">Product Name & Category</th>
                <th className="p-3.5">Bay Location</th>
                <th className="p-3.5">Stock Remaining</th>
                <th className="p-3.5">Freshness & Expiry</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/80">
              {filteredBatches.map(batch => {
                const daysLeft = getDaysToExpiry(batch.expiryDate);
                return (
                  <tr 
                    key={batch.id} 
                    className="hover:bg-amber-50/60 transition cursor-pointer"
                    onClick={() => setSelectedBatch(batch)}
                  >
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-[#3d1a10]">{batch.batchNumber}</div>
                      <div className="text-[10px] text-[#8b5a45]">{batch.sku}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-[#3d1a10] text-xs">{batch.name}</div>
                      <div className="text-[11px] text-[#8b5a45]">{batch.category} • {batch.supplier}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="text-[#3d1a10] font-medium">{batch.zoneName.split(' - ')[0]}</div>
                      <div className="font-mono text-[10px] text-[#8b5a45]">{batch.bayLocation}</div>
                    </td>

                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-[#3d1a10]">{batch.currentQuantity} {batch.unit}</div>
                      <div className="text-[10px] text-[#8b5a45]">
                        ${(batch.currentQuantity * batch.unitSellingPrice).toFixed(0)} total
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold ${
                          daysLeft <= 2 ? 'text-rose-600' : daysLeft <= 6 ? 'text-amber-600' : 'text-[#3d1a10]'
                        }`}>
                          {batch.expiryDate}
                        </span>
                        <span className="text-[10px] text-[#8b5a45]">
                          ({daysLeft <= 0 ? 'Expired' : `${daysLeft}d`})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-14 bg-amber-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              batch.freshnessScore >= 80 ? 'bg-emerald-500' : batch.freshnessScore >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${batch.freshnessScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-amber-700">{batch.freshnessScore}%</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block ${
                        batch.status === 'Optimal'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : batch.status === 'Warning'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : batch.status === 'Critical'
                          ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                          : 'bg-purple-100 text-purple-700 border border-purple-300'
                      }`}>
                        {batch.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setInspectingBatchId(batch.id);
                            setCurrentTab('inspection');
                          }}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-cyan-100 text-[#8b5a45] hover:text-cyan-700 transition shadow-xs cursor-pointer"
                          title="Run CV Inspection"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBatch(batch);
                            setNewQty(batch.currentQuantity);
                            setAdjustQtyModal(true);
                          }}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-emerald-100 text-[#8b5a45] hover:text-emerald-700 transition shadow-xs cursor-pointer"
                          title="Adjust Inventory Stock"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => quarantineBatch(batch.id, 'Manual quarantine initiated by floor operator')}
                          className="p-2 rounded-xl bg-amber-50 hover:bg-rose-100 text-[#8b5a45] hover:text-rose-700 transition shadow-xs cursor-pointer"
                          title="Quarantine Lot"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Detail Modal Drawer */}
      {selectedBatch && !adjustQtyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white border-3 border-amber-300 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b-2 border-amber-100 pb-3">
              <div>
                <span className="text-[10px] font-candy font-bold text-amber-700 uppercase tracking-wider">
                  Lot Traceability & Freshness Dossier
                </span>
                <h3 className="text-xl font-candy font-extrabold text-[#3d1a10]">{selectedBatch.name}</h3>
                <span className="font-mono text-xs text-[#8b5a45]">
                  {selectedBatch.batchNumber} • SKU: {selectedBatch.sku}
                </span>
              </div>
              <button 
                onClick={() => setSelectedBatch(null)}
                className="text-amber-400 hover:text-amber-600 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[#8b5a45] block text-[10px] font-bold">Current Quantity</span>
                <span className="text-base font-bold font-mono text-[#3d1a10]">
                  {selectedBatch.currentQuantity} {selectedBatch.unit}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-emerald-700 block text-[10px] font-bold">Freshness Index</span>
                <span className="text-base font-bold font-mono text-emerald-600">
                  {selectedBatch.freshnessScore}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[#8b5a45] block text-[10px] font-bold">Expiry Horizon</span>
                <span className="text-base font-bold font-mono text-[#3d1a10]">
                  {getDaysToExpiry(selectedBatch.expiryDate)} days
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[#8b5a45] block text-[10px] font-bold">Estimated Value</span>
                <span className="text-base font-bold font-mono text-[#3d1a10]">
                  ${(selectedBatch.currentQuantity * selectedBatch.unitSellingPrice).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Traceability Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 p-3.5 rounded-2xl bg-[#fffbf0] border border-amber-200">
                <span className="font-candy font-bold text-[#3d1a10] block text-xs">Origin & Harvest Traceability</span>
                <div className="flex justify-between text-[#78350f]">
                  <span>Supplier:</span>
                  <span className="font-bold text-[#3d1a10]">{selectedBatch.supplier}</span>
                </div>
                <div className="flex justify-between text-[#78350f]">
                  <span>Harvest Date:</span>
                  <span className="font-mono text-[#3d1a10]">{selectedBatch.harvestOrProductionDate}</span>
                </div>
                <div className="flex justify-between text-[#78350f]">
                  <span>Received Date:</span>
                  <span className="font-mono text-[#3d1a10]">{selectedBatch.receivedDate}</span>
                </div>
                <div className="flex justify-between text-[#78350f]">
                  <span>Expiry Date:</span>
                  <span className="font-mono text-rose-600 font-bold">{selectedBatch.expiryDate}</span>
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-2xl bg-[#fffbf0] border border-amber-200">
                <span className="font-candy font-bold text-[#3d1a10] block text-xs">Storage Environment Controls</span>
                <div className="flex justify-between text-[#78350f]">
                  <span>Zone:</span>
                  <span className="font-bold text-[#3d1a10]">{selectedBatch.zoneName.split(' - ')[0]}</span>
                </div>
                <div className="flex justify-between text-[#78350f]">
                  <span>Bay Location:</span>
                  <span className="font-mono text-[#3d1a10]">{selectedBatch.bayLocation}</span>
                </div>
                <div className="flex justify-between text-[#78350f]">
                  <span>Target Climate:</span>
                  <span className="font-mono text-[#3d1a10]">{selectedBatch.targetTempMin}° to {selectedBatch.targetTempMax}°C</span>
                </div>
                <div className="flex justify-between text-[#78350f]">
                  <span>Ethylene Sensitive:</span>
                  <span className={selectedBatch.ethyleneSensitive ? 'text-amber-600 font-bold' : 'text-[#8b5a45]'}>
                    {selectedBatch.ethyleneSensitive ? 'YES (High)' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Barcode Visualization */}
            <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-[#3d1a10] flex flex-col items-center justify-center space-y-1">
              <Barcode className="w-48 h-12 text-[#3d1a10]" />
              <span className="font-mono text-xs font-bold tracking-widest">{selectedBatch.barcode}</span>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  quarantineBatch(selectedBatch.id, 'Quarantined from dossier view');
                  setSelectedBatch(null);
                }}
                className="px-4 py-2 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold border border-rose-300 cursor-pointer"
              >
                Quarantine Lot
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setInspectingBatchId(selectedBatch.id);
                    setSelectedBatch(null);
                    setCurrentTab('inspection');
                  }}
                  className="candy-btn-gloss candy-pill-mint px-4 py-2 rounded-2xl text-emerald-950 text-xs font-candy font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Launch CV Quality Scan</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedBatch(null);
                    setCurrentTab('fefo');
                  }}
                  className="candy-btn-gloss candy-pill-pink px-4 py-2 rounded-2xl text-white text-xs font-candy font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>FEFO Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Quantity Dialog */}
      {adjustQtyModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border-3 border-amber-300 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-candy font-bold text-[#3d1a10]">Adjust Stock Count: {selectedBatch.name}</h3>
            <form onSubmit={handleAdjustQuantity} className="space-y-4">
              <div>
                <label className="text-xs text-[#8b5a45] font-bold block mb-1">
                  Available Quantity ({selectedBatch.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  required
                  value={newQty}
                  onChange={(e) => setNewQty(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-amber-50 border-2 border-amber-200 text-[#3d1a10] font-mono font-bold text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustQtyModal(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="candy-btn-gloss candy-pill-caramel px-4 py-2 rounded-2xl text-amber-950 font-candy font-bold text-xs cursor-pointer shadow-sm"
                >
                  Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

