export type ProductCategory = 
  | 'Fresh Produce'
  | 'Dairy & Eggs'
  | 'Meat & Poultry'
  | 'Seafood'
  | 'Bakery'
  | 'Beverages & Juices'
  | 'Pharmaceuticals & Vaccines';

export type StorageZoneId = 'zone-a' | 'zone-b' | 'zone-c' | 'zone-d';

export type BatchStatus = 'Optimal' | 'Warning' | 'Critical' | 'Expired' | 'Quarantined' | 'Dispatched';

export interface WarehouseBatch {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  batchNumber: string;
  supplier: string;
  initialQuantity: number;
  currentQuantity: number;
  unit: 'kg' | 'boxes' | 'crates' | 'pallets' | 'cartons' | 'liters';
  harvestOrProductionDate: string;
  receivedDate: string;
  expiryDate: string;
  zoneId: StorageZoneId;
  zoneName: string;
  bayLocation: string; // e.g. "Bay 04-Rack B"
  targetTempMin: number; // °C
  targetTempMax: number; // °C
  targetHumidityMin: number; // %
  targetHumidityMax: number; // %
  freshnessScore: number; // 0 - 100
  status: BatchStatus;
  unitCost: number; // USD
  unitSellingPrice: number; // USD
  barcode: string;
  ethyleneSensitive: boolean;
  notes?: string;
  inspectionHistory?: string[]; // Inspection IDs
}

export interface TelemetryReading {
  timestamp: string;
  temperature: number; // °C
  humidity: number; // %
  ethylene: number; // ppm
  co2: number; // ppm
}

export interface TelemetryZone {
  id: StorageZoneId;
  name: string;
  description: string;
  categoryTag: string;
  currentTemp: number;
  targetTemp: number;
  minTemp: number;
  maxTemp: number;
  currentHumidity: number;
  targetHumidity: number;
  ethylenePpm: number;
  co2Ppm: number;
  airflowMps: number;
  status: 'Optimal' | 'Warning' | 'Alarm';
  chillerActive: boolean;
  ventilationActive: boolean;
  capacityPallets: number;
  occupiedPallets: number;
  recentReadings: TelemetryReading[];
}

export type InspectionVerdict = 'Pass' | 'Downgrade Grade B' | 'Quarantine' | 'Scrap';

export type DefectType = 
  | 'No Visible Defect'
  | 'Surface Bruising'
  | 'Mildew / Mold Spotting'
  | 'Packaging Puncture'
  | 'Enzyme Browning / Oxidation'
  | 'Moisture Condensation Leak'
  | 'Seal Compromise'
  | 'Over-ripening Softness';

export interface DefectBoundingBox {
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  label: DefectType;
  confidence: number; // 0 - 1
  severity: 'minor' | 'moderate' | 'severe';
}

export interface InspectionLog {
  id: string;
  batchId: string;
  batchNumber: string;
  productName: string;
  timestamp: string;
  inspectorName: string;
  visualFreshnessScore: number; // 0-100
  packagingIntegrityScore: number; // 0-100
  detectedDefects: DefectType[];
  boundingBoxes: DefectBoundingBox[];
  verdict: InspectionVerdict;
  aiConfidence: number; // 0-100%
  notes: string;
  imageUrl: string;
}

export interface FefoAllocationItem {
  batchId: string;
  batchNumber: string;
  allocatedQty: number;
  daysToExpiry: number;
  freshnessScore: number;
  zoneId: StorageZoneId;
  zoneName: string;
  expiryDate: string;
  salvageAction?: 'Regular Dispatch' | 'Priority Ship' | 'Flash Sale (-25%)' | 'Clearance Discount (-50%)' | 'Food Bank Donation' | 'Immediate Processing';
  valueSaved: number;
}

export interface FefoPickOrder {
  id: string;
  orderNumber: string;
  customerOrChannel: string;
  destinationType: 'Supermarket Chain' | 'Wholesale Hub' | 'Retail Express' | 'Food Service' | 'Discount Salvage Channel';
  requestedItems: {
    sku: string;
    productName: string;
    requestedQty: number;
    unit: string;
  }[];
  allocatedBatches: FefoAllocationItem[];
  status: 'Pending Allocation' | 'Ready for Pick' | 'Dispatched' | 'Completed';
  priority: 'Standard' | 'Urgent' | 'Emergency FEFO Clearance';
  createdAt: string;
  dispatchedAt?: string;
  wasteSavingsKg: number;
  financialLossAvoided: number;
}

export interface AuditAlert {
  id: string;
  type: 'Cold Chain Breach' | 'Impending Expiry' | 'Inspection Rejection' | 'Gas Sensor Spike' | 'Compliance Warning';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  timestamp: string;
  entityReference: string; // e.g. "Zone B Cold Room" or "Batch #AP-2024-89"
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: string;
  suggestedAction: string;
}

export interface RagMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: {
    source: string;
    section: string;
    snippet: string;
  }[];
  recommendedActions?: string[];
  dataContext?: {
    type: 'batch' | 'zone' | 'fefo';
    id: string;
    title: string;
  }[];
}
