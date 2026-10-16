import { WarehouseBatch, FefoAllocationItem, FefoPickOrder } from '../types/warehouse';

export function getDaysToExpiry(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateFefoPriority(batch: WarehouseBatch): {
  daysLeft: number;
  priorityScore: number; // 0 (low urgency) to 100 (critical immediate dispatch)
  urgencyLevel: 'Normal' | 'Moderate' | 'Urgent' | 'Emergency';
  salvageAction: FefoAllocationItem['salvageAction'];
} {
  const daysLeft = getDaysToExpiry(batch.expiryDate);
  
  // Calculate priority score:
  // - Fewer days left = higher score
  // - Lower freshness score = higher urgency
  let score = 0;
  if (daysLeft <= 0) {
    score = 100;
  } else if (daysLeft <= 1) {
    score = 95;
  } else if (daysLeft <= 3) {
    score = 85;
  } else if (daysLeft <= 7) {
    score = 70;
  } else if (daysLeft <= 14) {
    score = 50;
  } else {
    score = Math.max(10, 40 - daysLeft);
  }

  // Adjust by freshness score
  if (batch.freshnessScore < 60) score = Math.min(100, score + 20);
  else if (batch.freshnessScore < 75) score = Math.min(100, score + 10);

  let urgencyLevel: 'Normal' | 'Moderate' | 'Urgent' | 'Emergency' = 'Normal';
  let salvageAction: FefoAllocationItem['salvageAction'] = 'Regular Dispatch';

  if (daysLeft <= 1) {
    urgencyLevel = 'Emergency';
    salvageAction = batch.freshnessScore > 50 ? 'Clearance Discount (-50%)' : 'Food Bank Donation';
  } else if (daysLeft <= 3) {
    urgencyLevel = 'Urgent';
    salvageAction = batch.freshnessScore > 70 ? 'Priority Ship' : 'Flash Sale (-25%)';
  } else if (daysLeft <= 7) {
    urgencyLevel = 'Moderate';
    salvageAction = 'Priority Ship';
  }

  return { daysLeft, priorityScore: score, urgencyLevel, salvageAction };
}

export function allocateFefoOrder(
  requestedSku: string,
  requestedQty: number,
  availableBatches: WarehouseBatch[]
): {
  allocatedItems: FefoAllocationItem[];
  remainingUnfulfilled: number;
  totalLossAvoided: number;
  totalKgSaved: number;
} {
  // Filter batches for this SKU that have stock and are not expired/quarantined
  const candidateBatches = availableBatches
    .filter(b => b.sku === requestedSku && b.currentQuantity > 0 && b.status !== 'Quarantined' && b.status !== 'Expired')
    .map(b => ({
      batch: b,
      fefo: calculateFefoPriority(b)
    }))
    .sort((a, b) => {
      // Sort primarily by daysToExpiry ascending (FEFO rule!)
      if (a.fefo.daysLeft !== b.fefo.daysLeft) {
        return a.fefo.daysLeft - b.fefo.daysLeft;
      }
      // Then by freshness score ascending (use lower freshness first)
      return a.batch.freshnessScore - b.batch.freshnessScore;
    });

  let need = requestedQty;
  const allocatedItems: FefoAllocationItem[] = [];
  let totalLossAvoided = 0;
  let totalKgSaved = 0;

  for (const item of candidateBatches) {
    if (need <= 0) break;

    const alloc = Math.min(need, item.batch.currentQuantity);
    need -= alloc;

    const valueSaved = Number((alloc * item.batch.unitSellingPrice).toFixed(2));
    totalLossAvoided += valueSaved;
    totalKgSaved += alloc;

    allocatedItems.push({
      batchId: item.batch.id,
      batchNumber: item.batch.batchNumber,
      allocatedQty: alloc,
      daysToExpiry: item.fefo.daysLeft,
      freshnessScore: item.batch.freshnessScore,
      zoneId: item.batch.zoneId,
      zoneName: item.batch.zoneName,
      expiryDate: item.batch.expiryDate,
      salvageAction: item.fefo.salvageAction,
      valueSaved
    });
  }

  return {
    allocatedItems,
    remainingUnfulfilled: need,
    totalLossAvoided: Number(totalLossAvoided.toFixed(2)),
    totalKgSaved
  };
}
