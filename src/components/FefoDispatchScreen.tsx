import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Check, 
  Printer, 
  DollarSign, 
  Leaf,
  Layers,
  TrendingDown
} from 'lucide-react';
import { getDaysToExpiry, calculateFefoPriority } from '../services/fefoEngine';
import { FefoPickOrder } from '../types/warehouse';

export const FefoDispatchScreen: React.FC = () => {
  const { 
    batches, 
    orders, 
    createAndAllocateOrder, 
    dispatchOrder 
  } = useWarehouse();

  // State for new order creation
  const [selectedSku, setSelectedSku] = useState(batches[0]?.sku || '');
  const [customerName, setCustomerName] = useState('SugarPlum Supermarket #12');
  const [destinationType, setDestinationType] = useState<FefoPickOrder['destinationType']>('Supermarket Chain');
  const [requestedQty, setRequestedQty] = useState<number>(200);
  const [createdOrderModal, setCreatedOrderModal] = useState<FefoPickOrder | null>(null);

  // Active batches eligible for dispatch, sorted by FEFO priority score descending
  const fefoBatchList = batches
    .filter(b => b.currentQuantity > 0 && b.status !== 'Quarantined' && b.status !== 'Expired')
    .map(b => {
      const priorityInfo = calculateFefoPriority(b);
      return {
        ...b,
        fefo: priorityInfo
      };
    })
    .sort((a, b) => b.fefo.priorityScore - a.fefo.priorityScore);

  // Group distinct SKUs for the dropdown
  const uniqueSkus = Array.from(new Set(batches.map(b => b.sku))).map(sku => {
    const item = batches.find(b => b.sku === sku)!;
    const totalQty = batches.filter(b => b.sku === sku && b.status !== 'Quarantined').reduce((s, b) => s + b.currentQuantity, 0);
    return {
      sku,
      name: item.name,
      category: item.category,
      unit: item.unit,
      totalQty
    };
  });

  const selectedProduct = uniqueSkus.find(u => u.sku === selectedSku);

  const handleRunAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || requestedQty <= 0) return;

    const newOrder = createAndAllocateOrder(
      customerName,
      destinationType,
      selectedSku,
      selectedProduct.name,
      Number(requestedQty),
      selectedProduct.unit
    );

    setCreatedOrderModal(newOrder);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Peppermint & Strawberry Cream Theme */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#ffe4ec] via-[#fff0f5] to-[#fde2e4] border-2 border-rose-300 shadow-sm relative overflow-hidden space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-candy font-bold bg-rose-200/80 text-rose-800 border border-rose-300 flex items-center gap-1.5 shadow-xs">
            <span className="text-sm">🍭</span> Candy Express Logistics
          </span>
          <span className="text-xs text-[#78350f] font-medium">First-Expired, First-Out Priority Conveyor</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-candy font-extrabold text-[#3d1a10]">
          FEFO Dispatch Allocation & Spoilage Prevention
        </h2>
        <p className="text-xs sm:text-sm text-[#78350f]/85 max-w-2xl font-medium">
          Automated confectionery dispatch algorithm routing near-expiry produce to high-velocity bakeries, candy kitchens, and express supermarkets to ensure zero food waste.
        </p>
      </div>

      {/* Two Column Section: FEFO Order Allocation Builder & Priority Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Create & Allocate FEFO Order (1 col) */}
        <div className="candy-card p-5 space-y-4 bg-white/95 border-2 border-pink-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-100 text-pink-600 shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <h3 className="font-candy font-bold text-sm text-[#3d1a10]">Generate FEFO Pick Order</h3>
          </div>

          <form onSubmit={handleRunAllocation} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#4a2215] mb-1">
                Customer / Destination Store
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#fffafb] border-2 border-pink-200 focus:border-pink-400 focus:ring-1 focus:ring-pink-300 text-[#3d1a10] font-medium shadow-xs"
                placeholder="e.g. SugarPlum Supermarket #14"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a2215] mb-1">
                Channel / Dispatch Destination
              </label>
              <select
                value={destinationType}
                onChange={(e) => setDestinationType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#fffafb] border-2 border-pink-200 focus:border-pink-400 text-[#3d1a10] font-medium shadow-xs"
              >
                <option value="Supermarket Chain">Supermarket Chain (Fast Turnaround)</option>
                <option value="Wholesale Hub">Wholesale Hub (Regional Distribution)</option>
                <option value="Retail Express">Retail Express / Convenience Store</option>
                <option value="Food Service">Food Service / Bakery & Kitchen</option>
                <option value="Discount Salvage Channel">Discount Salvage Channel (-30% to -50%)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4a2215] mb-1">
                Select Produce / SKU
              </label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#fffafb] border-2 border-pink-200 focus:border-pink-400 text-[#3d1a10] font-medium shadow-xs"
              >
                {uniqueSkus.map(item => (
                  <option key={item.sku} value={item.sku}>
                    {item.name} ({item.totalQty} {item.unit} available)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-bold text-[#4a2215]">
                <label>Requested Quantity</label>
                <span className="text-pink-600">Unit: {selectedProduct?.unit || 'units'}</span>
              </div>
              <input
                type="number"
                min="1"
                max={selectedProduct?.totalQty || 1000}
                required
                value={requestedQty}
                onChange={(e) => setRequestedQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-[#fffafb] border-2 border-pink-200 focus:border-pink-400 text-[#3d1a10] shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="candy-btn-gloss candy-pill-pink w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white font-candy font-bold text-xs shadow-md cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Allocate via FEFO</span>
            </button>
          </form>

          <div className="p-3 rounded-2xl bg-[#fff8fa] border border-pink-200 text-[11px] text-[#78350f] space-y-1">
            <span className="font-candy font-bold text-[#3d1a10] block">🍬 Smart FEFO Rules:</span>
            <p>1. Lots expiring in &lt; 3 days dispatched first.</p>
            <p>2. Automatic salvage discounts applied to near-expiry produce.</p>
            <p>3. Temperature-compromised or quarantined lots isolated.</p>
          </div>
        </div>

        {/* Right Column: FEFO Real-time Priority Matrix (2 cols) */}
        <div className="lg:col-span-2 candy-card p-5 space-y-4 bg-white/95 border-2 border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-pink-100 text-pink-600">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-candy font-bold text-sm text-[#3d1a10]">Live FEFO Priority Dispatch Queue</h3>
            </div>
            <span className="text-xs text-[#78350f] font-medium">
              Sorted by Urgency Index (Highest First)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-pink-100 text-[#8b5a45] font-candy font-bold">
                  <th className="pb-2.5">Batch / Produce</th>
                  <th className="pb-2.5">Expiry & Freshness</th>
                  <th className="pb-2.5">Stock Available</th>
                  <th className="pb-2.5">FEFO Urgency</th>
                  <th className="pb-2.5 text-right">Salvage Route</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100/80">
                {fefoBatchList.map(batch => {
                  const days = batch.fefo.daysLeft;
                  return (
                    <tr key={batch.id} className="hover:bg-pink-50/50 transition">
                      <td className="py-2.5 pr-2">
                        <div className="font-bold text-[#3d1a10] truncate max-w-[170px]">{batch.name}</div>
                        <div className="font-mono text-[10px] text-[#8b5a45]">{batch.batchNumber} • {batch.zoneName.split(' - ')[0]}</div>
                      </td>

                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-mono font-bold ${
                            days <= 1 ? 'text-rose-600' : days <= 3 ? 'text-amber-600' : 'text-[#3d1a10]'
                          }`}>
                            {batch.expiryDate}
                          </span>
                          <span className="text-[10px] text-[#8b5a45]">
                            ({days <= 0 ? 'Expired' : `${days}d left`})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="w-16 bg-pink-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                batch.freshnessScore > 80 ? 'bg-emerald-500' : batch.freshnessScore > 65 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${batch.freshnessScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-pink-600">{batch.freshnessScore}%</span>
                        </div>
                      </td>

                      <td className="py-2.5 pr-2 font-mono">
                        <div className="font-bold text-[#3d1a10]">{batch.currentQuantity} {batch.unit}</div>
                        <div className="text-[10px] text-[#8b5a45]">${(batch.currentQuantity * batch.unitSellingPrice).toFixed(0)} val</div>
                      </td>

                      <td className="py-2.5 pr-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block ${
                          batch.fefo.urgencyLevel === 'Emergency'
                            ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                            : batch.fefo.urgencyLevel === 'Urgent'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : batch.fefo.urgencyLevel === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {batch.fefo.urgencyLevel}
                        </span>
                      </td>

                      <td className="py-2.5 text-right font-medium text-[11px]">
                        <span className={`px-2 py-0.5 rounded-full ${
                          batch.fefo.salvageAction?.includes('Clearance') || batch.fefo.salvageAction?.includes('Flash')
                            ? 'bg-purple-100 text-purple-700 border border-purple-200 font-bold'
                            : 'text-[#4a2215]'
                        }`}>
                          {batch.fefo.salvageAction}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Orders & Dispatched Shipments */}
      <div className="candy-card p-5 space-y-4 bg-white/95 border-2 border-pink-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-pink-100 text-pink-600">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="font-candy font-bold text-sm text-[#3d1a10]">FEFO Pick Orders & Active Dispatch Slips</h3>
          </div>
          <span className="text-xs text-[#8b5a45] font-bold">{orders.length} Total Orders</span>
        </div>

        <div className="space-y-3">
          {orders.map(order => (
            <div 
              key={order.id}
              className="p-4 rounded-2xl bg-[#fff9fa] border-2 border-pink-100 hover:border-pink-300 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#3d1a10]">{order.orderNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    order.status === 'Dispatched' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-medium">
                    {order.destinationType}
                  </span>
                </div>
                <div className="text-xs text-[#4a2215]">
                  Customer: <span className="font-bold text-[#3d1a10]">{order.customerOrChannel}</span>
                </div>
                <div className="text-[11px] text-[#8b5a45] flex flex-wrap gap-x-4">
                  <span>Created: {order.createdAt}</span>
                  {order.dispatchedAt && <span className="text-emerald-700 font-bold">Dispatched: {order.dispatchedAt}</span>}
                  <span className="text-pink-600 font-bold">Loss Prevented: {order.wasteSavingsKg} kg (+${order.financialLossAvoided.toFixed(2)})</span>
                </div>
              </div>

              {/* Allocated Batches pill list */}
              <div className="space-y-1 w-full md:w-auto">
                <span className="text-[10px] text-[#8b5a45] block uppercase font-bold">Allocated Lots:</span>
                <div className="flex flex-wrap gap-1.5">
                  {order.allocatedBatches.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-1 rounded-xl bg-white border border-pink-200 text-[10px] font-mono text-[#3d1a10] flex items-center gap-1 shadow-xs"
                    >
                      <span className="text-pink-600 font-bold">{item.allocatedQty}x</span>
                      <span>{item.batchNumber}</span>
                      <span className="text-[#8b5a45]">({item.daysToExpiry}d)</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-2 shrink-0">
                {order.status !== 'Dispatched' ? (
                  <button
                    onClick={() => dispatchOrder(order.id)}
                    className="candy-btn-gloss candy-pill-mint flex items-center gap-1 px-3 py-2 rounded-xl text-emerald-950 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Execute Dispatch</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold px-2 py-1 bg-emerald-50 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dispatched</span>
                  </div>
                )}
                <button
                  onClick={() => setCreatedOrderModal(order)}
                  className="p-2 rounded-xl bg-white hover:bg-pink-50 text-pink-500 border border-pink-200 transition shadow-xs cursor-pointer"
                  title="Print Dispatch Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Generated Order / Dispatch Slip */}
      {createdOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white border-3 border-pink-300 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between border-b-2 border-pink-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-wider font-candy">
                  ShelfNova Bakery & Confectionery Dispatch Slip
                </span>
                <h3 className="text-xl font-candy font-extrabold text-[#3d1a10] font-mono">{createdOrderModal.orderNumber}</h3>
              </div>
              <button 
                onClick={() => setCreatedOrderModal(null)}
                className="text-pink-400 hover:text-pink-600 font-bold text-base p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#8b5a45] block font-medium">Customer Destination</span>
                <span className="font-bold text-[#3d1a10] text-sm">{createdOrderModal.customerOrChannel}</span>
                <span className="text-pink-600 block">{createdOrderModal.destinationType}</span>
              </div>
              <div>
                <span className="text-[#8b5a45] block font-medium">Dispatch Status</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-0.5 ${
                  createdOrderModal.status === 'Dispatched' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {createdOrderModal.status}
                </span>
                <span className="text-[#8b5a45] block text-[11px] mt-1">{createdOrderModal.createdAt}</span>
              </div>
            </div>

            {/* Allocation breakdown */}
            <div className="space-y-2">
              <span className="text-xs font-candy font-bold text-[#3d1a10] block">
                FEFO Batch Picking Allocation
              </span>
              <div className="rounded-2xl border-2 border-pink-100 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-50 text-[#8b5a45] font-candy font-bold">
                    <tr>
                      <th className="p-2.5">Lot #</th>
                      <th className="p-2.5">Quantity</th>
                      <th className="p-2.5">Expiry</th>
                      <th className="p-2.5">Salvage Route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {createdOrderModal.allocatedBatches.map((item, idx) => (
                      <tr key={idx} className="text-[#3d1a10] font-medium">
                        <td className="p-2.5 font-mono text-[11px]">{item.batchNumber}</td>
                        <td className="p-2.5 font-bold text-pink-600">{item.allocatedQty} units</td>
                        <td className="p-2.5">{item.expiryDate} ({item.daysToExpiry}d left)</td>
                        <td className="p-2.5 text-[#8b5a45]">{item.salvageAction}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Environmental & financial savings */}
            <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#78350f]">
                <Leaf className="w-4 h-4 text-emerald-500" />
                <span>Loss Avoided: <b>{createdOrderModal.wasteSavingsKg} kg</b> food waste prevented</span>
              </div>
              <div className="font-candy font-bold text-emerald-600 text-base">
                +${createdOrderModal.financialLossAvoided.toFixed(2)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCreatedOrderModal(null)}
                className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              {createdOrderModal.status !== 'Dispatched' && (
                <button
                  onClick={() => {
                    dispatchOrder(createdOrderModal.id);
                    setCreatedOrderModal(null);
                  }}
                  className="candy-btn-gloss candy-pill-mint px-4 py-2 rounded-2xl text-emerald-950 text-xs font-candy font-bold shadow cursor-pointer"
                >
                  Confirm & Dispatch Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

