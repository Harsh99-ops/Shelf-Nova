import { DefectBoundingBox, DefectType, InspectionVerdict, InspectionLog } from '../types/warehouse';

export interface InspectionPreset {
  id: string;
  name: string;
  productName: string;
  category: string;
  imageUrl: string;
  simulatedVisualScore: number;
  simulatedPackagingScore: number;
  simulatedDefects: DefectType[];
  simulatedBoxes: DefectBoundingBox[];
  simulatedVerdict: InspectionVerdict;
  notes: string;
}

export const INSPECTION_PRESETS: InspectionPreset[] = [
  {
    id: 'preset-apples',
    name: 'Gala Apples (Mechanical Bruise)',
    productName: 'Organic Gala Apples (Grade A)',
    category: 'Fresh Produce',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80',
    simulatedVisualScore: 68,
    simulatedPackagingScore: 92,
    simulatedDefects: ['Surface Bruising', 'Enzyme Browning / Oxidation'],
    simulatedBoxes: [
      { x: 26, y: 32, width: 24, height: 28, label: 'Surface Bruising', confidence: 0.93, severity: 'moderate' },
      { x: 56, y: 46, width: 18, height: 18, label: 'Enzyme Browning / Oxidation', confidence: 0.86, severity: 'minor' }
    ],
    simulatedVerdict: 'Downgrade Grade B',
    notes: 'Mechanical compression bruising detected on 5.8% of skin surface. Flesh still firm. Recommend Grade B discount or fast FEFO dispatch.'
  },
  {
    id: 'preset-strawberries',
    name: 'Strawberries (High Moisture & Softness)',
    productName: 'Sweet Scarlet Strawberries (Clamshell)',
    category: 'Fresh Produce',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=700&q=80',
    simulatedVisualScore: 56,
    simulatedPackagingScore: 78,
    simulatedDefects: ['Over-ripening Softness', 'Moisture Condensation Leak'],
    simulatedBoxes: [
      { x: 38, y: 35, width: 28, height: 32, label: 'Over-ripening Softness', confidence: 0.91, severity: 'moderate' },
      { x: 20, y: 65, width: 35, height: 20, label: 'Moisture Condensation Leak', confidence: 0.84, severity: 'moderate' }
    ],
    simulatedVerdict: 'Downgrade Grade B',
    notes: 'Free liquid droplets detected inside clamshell bottom. Accelerated microbial risk. Clear via rapid dispatch or bakery juicing.'
  },
  {
    id: 'preset-beef',
    name: 'Angus Ribeye (Pristine Cryo-Vac)',
    productName: 'Prime Black Angus Ribeye Cryo-vac',
    category: 'Meat & Poultry',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=700&q=80',
    simulatedVisualScore: 98,
    simulatedPackagingScore: 99,
    simulatedDefects: ['No Visible Defect'],
    simulatedBoxes: [
      { x: 18, y: 15, width: 64, height: 70, label: 'No Visible Defect', confidence: 0.98, severity: 'minor' }
    ],
    simulatedVerdict: 'Pass',
    notes: 'Deep purplish-red myoglobin color. Vacuum membrane tight with zero air micro-pockets. High grade export quality.'
  },
  {
    id: 'preset-salmon',
    name: 'Wild Salmon Fillets (Fresh Cold Chain)',
    productName: 'Wild Atlantic Salmon Fillets (Fresh/Cryo)',
    category: 'Seafood',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80',
    simulatedVisualScore: 89,
    simulatedPackagingScore: 94,
    simulatedDefects: ['No Visible Defect'],
    simulatedBoxes: [
      { x: 25, y: 20, width: 50, height: 60, label: 'No Visible Defect', confidence: 0.94, severity: 'minor' }
    ],
    simulatedVerdict: 'Pass',
    notes: 'Vibrant carotenoid pigmentation, muscle fibers firm, no gaping or rancid oxidation.'
  },
  {
    id: 'preset-dairy',
    name: 'Milk Cartons (Cold Chain Condensation)',
    productName: 'Whole Pasteurized Fresh Milk (1L)',
    category: 'Dairy & Eggs',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80',
    simulatedVisualScore: 78,
    simulatedPackagingScore: 85,
    simulatedDefects: ['Moisture Condensation Leak'],
    simulatedBoxes: [
      { x: 30, y: 55, width: 40, height: 25, label: 'Moisture Condensation Leak', confidence: 0.82, severity: 'minor' }
    ],
    simulatedVerdict: 'Pass',
    notes: 'Exterior carton condensation due to loading dock ambient gradient. Cap seals intact. Safe for distribution.'
  }
];

export async function runQualityInspection(
  imageSource: string, // data url or url
  batchNumber: string,
  productName: string,
  presetId?: string
): Promise<Omit<InspectionLog, 'id' | 'timestamp' | 'batchId'>> {
  // Check if matching preset exists for realistic simulation
  const matchedPreset = INSPECTION_PRESETS.find(p => p.id === presetId || p.productName.toLowerCase().includes(productName.toLowerCase()));

  // Simulate network / computer vision inference latency (600ms)
  await new Promise(r => setTimeout(r, 700));

  if (matchedPreset) {
    return {
      batchNumber,
      productName,
      inspectorName: 'AI Vision Surface (ShelfNova CV v2.4)',
      visualFreshnessScore: matchedPreset.simulatedVisualScore,
      packagingIntegrityScore: matchedPreset.simulatedPackagingScore,
      detectedDefects: matchedPreset.simulatedDefects,
      boundingBoxes: matchedPreset.simulatedBoxes,
      verdict: matchedPreset.simulatedVerdict,
      aiConfidence: Math.floor(88 + Math.random() * 10),
      notes: matchedPreset.notes,
      imageUrl: imageSource || matchedPreset.imageUrl
    };
  }

  // Generic heuristic analysis for uploaded or live camera image
  const visualScore = Math.floor(75 + Math.random() * 20);
  const packagingScore = Math.floor(80 + Math.random() * 18);
  const isPass = visualScore >= 80 && packagingScore >= 80;

  return {
    batchNumber,
    productName,
    inspectorName: 'AI Vision Surface (ShelfNova CV v2.4)',
    visualFreshnessScore: visualScore,
    packagingIntegrityScore: packagingScore,
    detectedDefects: isPass ? ['No Visible Defect'] : ['Surface Bruising'],
    boundingBoxes: [
      {
        x: 25,
        y: 25,
        width: 50,
        height: 50,
        label: isPass ? 'No Visible Defect' : 'Surface Bruising',
        confidence: 0.89,
        severity: isPass ? 'minor' : 'moderate'
      }
    ],
    verdict: isPass ? 'Pass' : 'Downgrade Grade B',
    aiConfidence: 91,
    notes: `Automated visual scan complete. Freshness index ${visualScore}%, Packaging seal ${packagingScore}%. Verdict: ${isPass ? 'Pass Grade A' : 'Downgrade Grade B'}.`,
    imageUrl: imageSource
  };
}
