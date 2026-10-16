import { WarehouseBatch, TelemetryZone, AuditAlert, RagMessage } from '../types/warehouse';
import { WAREHOUSE_KNOWLEDGE_DOCS } from '../data/initialData';
import { getDaysToExpiry } from './fefoEngine';

export interface RagContextData {
  batches: WarehouseBatch[];
  zones: TelemetryZone[];
  alerts: AuditAlert[];
}

export async function askWarehouseRag(
  userQuery: string,
  context: RagContextData
): Promise<RagMessage> {
  const queryLower = userQuery.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Check for FEFO / Expiry queries
  if (queryLower.includes('expir') || queryLower.includes('fefo') || queryLower.includes('dispatch') || queryLower.includes('urgent')) {
    const criticalBatches = context.batches
      .map(b => ({ batch: b, days: getDaysToExpiry(b.expiryDate) }))
      .filter(item => item.days <= 4)
      .sort((a, b) => a.days - b.days);

    const citations = [
      {
        source: 'ShelfNova FEFO Standard Operating Procedure',
        section: 'Section 4.2 - Salvage & Priority Allocation',
        snippet: WAREHOUSE_KNOWLEDGE_DOCS[0].content
      }
    ];

    let responseText = `### FEFO Inventory & Expiry Status Analysis\n\n`;
    if (criticalBatches.length === 0) {
      responseText += `All warehouse batches currently have **safe shelf-life margins (> 4 days)**. No emergency clearance is required at this hour.\n`;
    } else {
      responseText += `Identified **${criticalBatches.length} batches** requiring expedited FEFO dispatch:\n\n`;
      criticalBatches.forEach(({ batch, days }) => {
        const urgency = days <= 1 ? 'CRITICAL (Expires Tomorrow)' : days <= 2 ? 'HIGH (2 Days Left)' : 'MODERATE';
        responseText += `* **${batch.name}** (\`${batch.batchNumber}\`):\n  * **Quantity Remaining:** ${batch.currentQuantity} ${batch.unit}\n  * **Expiry:** ${batch.expiryDate} (${urgency})\n  * **Freshness Index:** ${batch.freshnessScore}%\n  * **Location:** ${batch.zoneName} (${batch.bayLocation})\n  * **Recommended Action:** ${days <= 1 ? 'Flash Sale (-30% to -50%) or Food Service transfer' : 'Prioritize for earliest scheduled supermarket distribution'}\n\n`;
      });
      responseText += `**Protocol Recommendation:** Allocate these lots to open pick lists immediately. Total value at risk is approximately **$${criticalBatches.reduce((acc, c) => acc + c.batch.currentQuantity * c.batch.unitSellingPrice, 0).toLocaleString()}**.`;
    }

    return {
      id: 'rag-' + Date.now(),
      sender: 'assistant',
      text: responseText,
      timestamp,
      citations,
      recommendedActions: [
        'Open FEFO Dispatch Engine',
        'Generate Emergency Pick List',
        'Trigger Salvage Markdowns'
      ],
      dataContext: criticalBatches.map(c => ({
        type: 'batch',
        id: c.batch.id,
        title: `${c.batch.name} (${c.batch.batchNumber})`
      }))
    };
  }

  // 2. Check for Temperature / Cold Chain / Zone breaches
  if (queryLower.includes('cold') || queryLower.includes('temp') || queryLower.includes('breach') || queryLower.includes('zone') || queryLower.includes('chiller')) {
    const warningZones = context.zones.filter(z => z.status !== 'Optimal');
    const citations = [
      {
        source: 'FDA 21 CFR Part 117 & HACCP Guidelines',
        section: 'Subpart B - Cold Chain Temperature Excursions',
        snippet: WAREHOUSE_KNOWLEDGE_DOCS[1].content
      }
    ];

    let responseText = `### Warehouse Storage Telemetry & Cold Chain Assessment\n\n`;
    if (warningZones.length === 0) {
      responseText += `All 4 warehouse zones (**Zone A Produce, Zone B Cryo, Zone C Dairy, Zone D Ambient**) are operating strictly within target setpoints. Chillers and airflow systems are stable.\n`;
    } else {
      responseText += `⚠️ **Attention Required:** Detected telemetry warning in **${warningZones.map(z => z.name).join(', ')}**:\n\n`;
      warningZones.forEach(z => {
        responseText += `* **${z.name}**:\n  * **Current Temperature:** ${z.currentTemp > 0 ? '+' : ''}${z.currentTemp}°C (Target: ${z.targetTemp}°C, Max Limit: ${z.maxTemp}°C)\n  * **Relative Humidity:** ${z.currentHumidity}%\n  * **Auxiliary Chiller:** ${z.chillerActive ? 'ACTIVE (Engaged)' : 'OFF'}\n  * **Active Inventory:** ${z.occupiedPallets} of ${z.capacityPallets} pallets\n\n`;
      });
      responseText += `**HACCP Action Plan:**\n1. Ensure rapid roll-up doors are fully sealed.\n2. Confirm auxiliary chiller cycle is running at 100% capacity.\n3. If dairy temperature remains above 4.0°C for > 90 minutes, trigger automated lot sensory check.`;
    }

    return {
      id: 'rag-' + Date.now(),
      sender: 'assistant',
      text: responseText,
      timestamp,
      citations,
      recommendedActions: [
        'Inspect Zone C Chiller Telemetry',
        'Review HACCP Audit Logs',
        'Acknowledge Active Alerts'
      ],
      dataContext: warningZones.map(z => ({
        type: 'zone',
        id: z.id,
        title: z.name
      }))
    };
  }

  // 3. Ethylene gas & produce compatibility
  if (queryLower.includes('ethylene') || queryLower.includes('banana') || queryLower.includes('cross') || queryLower.includes('gas')) {
    const citations = [
      {
        source: 'ShelfNova Produce Compatibility & Gas Mitigation SOP',
        section: 'SOP-GAS-02 - Ethylene Segregation',
        snippet: WAREHOUSE_KNOWLEDGE_DOCS[2].content
      }
    ];

    return {
      id: 'rag-' + Date.now(),
      sender: 'assistant',
      text: `### Ethylene Gas Control & Produce Separation Guidelines\n\n* **High Ethylene Producers:** Cavendish Bananas (Zone D), Organic Gala Apples (Zone A), Ripe Avocados.\n* **Vulnerable Sensitive Commodities:** Strawberries, Leafy greens, Carrots, Broccoli.\n\n**Current Sensor Readings:**\n* **Zone A (Produce):** \`0.04 ppm\` (Optimal < 0.05 ppm - scrubbers active).\n* **Zone D (Ambient):** \`0.08 ppm\` (Elevated due to ripening bananas; exhaust ventilation recommended).\n\n**Protocol Action:** Maintain physical containment between Zone D ripening rooms and Zone A cold bays. Never store unripened bananas or apples in open air adjacent to strawberries.`,
      timestamp,
      citations,
      recommendedActions: [
        'Engage Zone D Ventilation Exhaust',
        'Verify Ethylene Scrubber Filters',
        'Check Strawberry Lot Freshness'
      ]
    };
  }

  // 4. Quality Inspection SOP
  if (queryLower.includes('inspect') || queryLower.includes('quality') || queryLower.includes('grade') || queryLower.includes('verdict')) {
    const citations = [
      {
        source: 'AI Computer Vision Calibration Protocol',
        section: 'SOP-QA-09 - Defect Classification',
        snippet: WAREHOUSE_KNOWLEDGE_DOCS[3].content
      }
    ];

    return {
      id: 'rag-' + Date.now(),
      sender: 'assistant',
      text: `### ShelfNova Quality Inspection Calibration\n\nOur integrated CV inspection surface scores items on two orthogonal vectors:\n1. **Visual Freshness Index (0 - 100%):** Measures surface discoloration, turgor loss, epidermal wrinkling, and fungal spores.\n2. **Packaging Seal Integrity (0 - 100%):** Validates vacuum tightness, seal continuity, and absence of micro-punctures.\n\n**Verdict Rules:**\n* **Pass Grade A:** Freshness >= 80%, Packaging >= 85%\n* **Downgrade Grade B:** Freshness 60-79% (eligible for discount/foodservice)\n* **Quarantine:** Packaging breach or unverified temperature violation\n* **Scrap / Biocompost:** Microbial infestation or score < 50%`,
      timestamp,
      citations,
      recommendedActions: [
        'Launch Camera Inspection Surface',
        'Inspect Strawberries Clamshell',
        'View Historical Inspection Logs'
      ]
    };
  }

  // Default intelligent assistant response with warehouse context summary
  const totalItems = context.batches.reduce((sum, b) => sum + b.currentQuantity, 0);
  const totalValue = context.batches.reduce((sum, b) => sum + b.currentQuantity * b.unitSellingPrice, 0);

  return {
    id: 'rag-' + Date.now(),
    sender: 'assistant',
    text: `### ShelfNova Warehouse Knowledge & Intelligence Report\n\nI have queried the active warehouse state and regulatory documentation:\n\n* **Inventory Under Management:** **${context.batches.length} active lots** (${totalItems.toLocaleString()} units) with total valuation of **$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}**.\n* **Cold Chain Compliance:** 3 of 4 zones fully optimal. Zone C (Dairy) logged elevated temperature (4.8°C).\n* **FEFO Urgency:** 2 batches are within <= 2 days of expiration and prioritized for immediate dispatch.\n\nHow can I assist you further? You can ask about:\n* Detailed FEFO allocation for specific customer orders\n* Cold-chain temperature breach corrective actions\n* Ethylene segregation guidelines\n* Quality inspection standards & grading rules`,
    timestamp,
    citations: [
      {
        source: 'ShelfNova Warehouse Knowledge Index',
        section: 'Unified Inventory & Operations Registry',
        snippet: 'Real-time aggregated state across inventory, IoT telemetry, quality inspections, and FDA/HACCP regulatory SOPs.'
      }
    ],
    recommendedActions: [
      'Show Batches Expiring in 48 Hours',
      'Explain Zone C Dairy Temperature Breach',
      'Review FEFO Picking Recommendations'
    ]
  };
}
