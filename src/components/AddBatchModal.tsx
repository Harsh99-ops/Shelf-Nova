import React, { useState } from 'react';
import { useWarehouse } from '../context/WarehouseContext';
import { ProductCategory, StorageZoneId } from '../types/warehouse';
import { X, Sparkles, Gift } from 'lucide-react';

interface AddBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBatchModal: React.FC<AddBatchModalProps> = ({ isOpen, onClose }) => {
  const { addBatch, zones } = useWarehouse();

  // Helper date
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultExpiry = new Date();
  defaultExpiry.setDate(defaultExpiry.getDate() + 10);
  const defaultExpiryStr = defaultExpiry.toISOString().split('T')[0];

  const [sku, setSku] = useState('PRD-BER-02');
  const [name, setName] = useState('Fresh Blueberries (Clamshells)');
  const [category, setCategory] = useState<ProductCategory>('Fresh Produce');
  const [batchNumber, setBatchNumber] = useState(`B-BER-${Math.floor(1000 + Math.random() * 9000)}`);
  const [supplier, setSupplier] = useState('Pacific Berry Farms');
  const [initialQuantity, setInitialQuantity] = useState(500);
  const [unit, setUnit] = useState<any>('boxes');
  const [harvestDate, setHarvestDate] = useState(todayStr);
  const [receivedDate, setReceivedDate] = useState(todayStr);
  const [expiryDate, setExpiryDate] = useState(defaultExpiryStr);
  const [zoneId, setZoneId] = useState<StorageZoneId>('zone-a');
  const [bayLocation, setBayLocation] = useState('Bay 03-Rack C');
  const [targetTempMin, setTargetTempMin] = useState(1.0);
  const [targetTempMax, setTargetTempMax] = useState(4.0);
  const [targetHumidityMin, setTargetHumidityMin] = useState(85);
  const [targetHumidityMax, setTargetHumidityMax] = useState(95);
  const [unitCost, setUnitCost] = useState(2.20);
  const [unitSellingPrice, setUnitSellingPrice] = useState(3.80);
  const [ethyleneSensitive, setEthyleneSensitive] = useState(true);
  const [notes, setNotes] = useState('Standard refrigerated receiving protocol complete.');

  if (!isOpen) return null;

  // Auto-populate climate targets when category changes
  const handleCategoryChange = (newCat: ProductCategory) => {
    setCategory(newCat);
    if (newCat === 'Fresh Produce') {
      setZoneId('zone-a');
      setTargetTempMin(1.0);
      setTargetTempMax(4.0);
      setTargetHumidityMin(85);
      setTargetHumidityMax(95);
      setEthyleneSensitive(true);
    } else if (newCat === 'Dairy & Eggs') {
      setZoneId('zone-c');
      setTargetTempMin(1.0);
      setTargetTempMax(4.0);
      setTargetHumidityMin(70);
      setTargetHumidityMax(80);
      setEthyleneSensitive(false);
    } else if (newCat === 'Meat & Poultry' || newCat === 'Seafood') {
      setZoneId('zone-b');
      setTargetTempMin(-22.0);
      setTargetTempMax(-18.0);
      setTargetHumidityMin(60);
      setTargetHumidityMax(70);
      setEthyleneSensitive(false);
    } else {
      setZoneId('zone-d');
      setTargetTempMin(15.0);
      setTargetTempMax(20.0);
      setTargetHumidityMin(50);
      setTargetHumidityMax(60);
      setEthyleneSensitive(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const zoneName = zones.find(z => z.id === zoneId)?.name || 'Zone A';

    addBatch({
      sku,
      name,
      category,
      batchNumber,
      supplier,
      initialQuantity: Number(initialQuantity),
      currentQuantity: Number(initialQuantity),
      unit,
      harvestOrProductionDate: harvestDate,
      receivedDate,
      expiryDate,
      zoneId,
      zoneName,
      bayLocation,
      targetTempMin: Number(targetTempMin),
      targetTempMax: Number(targetTempMax),
      targetHumidityMin: Number(targetHumidityMin),
      targetHumidityMax: Number(targetHumidityMax),
      unitCost: Number(unitCost),
      unitSellingPrice: Number(unitSellingPrice),
      ethyleneSensitive,
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white border-4 border-pink-200 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-pink-100 pb-3">
          <div>
            <span className="text-[10px] font-candy font-bold text-pink-600 uppercase tracking-wider flex items-center gap-1">
              <Gift className="w-3.5 h-3.5 text-pink-500" /> Warehouse Inbound Receiving
            </span>
            <h3 className="text-xl font-candy font-extrabold text-amber-950 flex items-center gap-2">
              <span>Intake New Confectionery Lot</span>
              <span>🍬</span>
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-candy font-bold flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-candy">
          {/* Row 1: Category & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-950 font-bold mb-1">Product Category</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy font-bold focus:border-pink-500 focus:bg-white outline-none shadow-sm cursor-pointer"
              >
                <option value="Fresh Produce">🍓 Fresh Produce & Berries</option>
                <option value="Dairy & Eggs">🥛 Dairy, Milk & Cream</option>
                <option value="Meat & Poultry">🍖 Meat & Confection Fats</option>
                <option value="Seafood">🐟 Seafood & Marine Gelatins</option>
                <option value="Bakery">🥐 Bakery & Sweet Pastries</option>
                <option value="Beverages & Juices">🧃 Fruit Juices & Syrups</option>
                <option value="Pharmaceuticals & Vaccines">💊 Health & Sugar Supplements</option>
              </select>
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Product Description</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
                placeholder="e.g. Organic Gala Apples"
              />
            </div>
          </div>

          {/* Row 2: SKU, Lot Number, Supplier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-amber-950 font-bold mb-1">SKU Code</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Batch / Lot Number</label>
              <input
                type="text"
                required
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Supplier / Origin Farm</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Row 3: Quantity & Unit, Cost, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-amber-950 font-bold mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={initialQuantity}
                onChange={(e) => setInitialQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Unit</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy font-bold focus:border-pink-500 focus:bg-white outline-none shadow-sm cursor-pointer"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="boxes">Boxes</option>
                <option value="crates">Crates</option>
                <option value="pallets">Pallets</option>
                <option value="cartons">Cartons</option>
                <option value="liters">Liters</option>
              </select>
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Unit Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={unitCost}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={unitSellingPrice}
                onChange={(e) => setUnitSellingPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Row 4: Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-amber-950 font-bold mb-1">Harvest / Mfg Date</label>
              <input
                type="date"
                required
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Received Date</label>
              <input
                type="date"
                required
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
              />
            </div>

            <div>
              <label className="block text-rose-700 font-bold mb-1">Expiration Date (FEFO) 🚨</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-candy font-extrabold focus:border-rose-500 outline-none shadow-inner"
              />
            </div>
          </div>

          {/* Row 5: Zone & Bay Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-950 font-bold mb-1">Storage Zone Bay</label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy font-bold focus:border-pink-500 focus:bg-white outline-none shadow-sm cursor-pointer"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-amber-950 font-bold mb-1">Bay & Rack Position</label>
              <input
                type="text"
                required
                value={bayLocation}
                onChange={(e) => setBayLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-pink-50/60 border-2 border-pink-200 text-amber-950 font-candy focus:border-pink-500 focus:bg-white outline-none shadow-inner"
                placeholder="e.g. Bay 02-Rack B"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="ethyleneCheck"
              checked={ethyleneSensitive}
              onChange={(e) => setEthyleneSensitive(e.target.checked)}
              className="accent-pink-500 w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="ethyleneCheck" className="text-amber-900 font-candy font-bold cursor-pointer text-xs">
              🍓 High Ethylene Gas Sensitivity (requires automated mint scrubber ventilation)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-800 text-xs font-candy font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-candy font-bold shadow-md shadow-pink-300 transition cursor-pointer hover:scale-105 active:scale-95"
            >
              🎁 Ingest Confection Lot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

