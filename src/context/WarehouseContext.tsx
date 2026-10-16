import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WarehouseBatch,
  TelemetryZone,
  InspectionLog,
  FefoPickOrder,
  AuditAlert,
  RagMessage
} from '../types/warehouse';
import {
  INITIAL_BATCHES,
  INITIAL_ZONES,
  INITIAL_INSPECTIONS,
  INITIAL_ORDERS,
  INITIAL_ALERTS
} from '../data/initialData';
import { allocateFefoOrder, getDaysToExpiry } from '../services/fefoEngine';

export type ScreenTab = 
  | 'dashboard'
  | 'inventory'
  | 'fefo'
  | 'inspection'
  | 'telemetry'
  | 'assistant'
  | 'alerts';

interface WarehouseContextType {
  currentTab: ScreenTab;
  setCurrentTab: (tab: ScreenTab) => void;
  batches: WarehouseBatch[];
  zones: TelemetryZone[];
  inspections: InspectionLog[];
  orders: FefoPickOrder[];
  alerts: AuditAlert[];
  ragMessages: RagMessage[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Batch Operations
  addBatch: (batch: Omit<WarehouseBatch, 'id' | 'barcode' | 'freshnessScore' | 'status'>) => void;
  updateBatch: (id: string, updates: Partial<WarehouseBatch>) => void;
  deleteBatch: (id: string) => void;
  quarantineBatch: (id: string, reason: string) => void;
  // Telemetry Operations
  toggleZoneChiller: (zoneId: string) => void;
  toggleZoneVentilation: (zoneId: string) => void;
  updateZoneSetpoint: (zoneId: string, targetTemp: number) => void;
  // Inspection Operations
  addInspection: (log: Omit<InspectionLog, 'id' | 'timestamp'>) => void;
  // FEFO Operations
  createAndAllocateOrder: (
    customer: string,
    destinationType: FefoPickOrder['destinationType'],
    sku: string,
    productName: string,
    quantity: number,
    unit: string
  ) => FefoPickOrder;
  dispatchOrder: (orderId: string) => void;
  // Alerts
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  // RAG Chat
  addRagMessage: (msg: RagMessage) => void;
  resetAllData: () => void;
  // Selected inspection batch id (for jumping from inventory to inspection)
  inspectingBatchId: string | null;
  setInspectingBatchId: (id: string | null) => void;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'shelfnova_v1_';

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingBatchId, setInspectingBatchId] = useState<string | null>(null);

  // Initialize state with localStorage fallbacks
  const [batches, setBatches] = useState<WarehouseBatch[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}batches`);
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [zones, setZones] = useState<TelemetryZone[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}zones`);
    return saved ? JSON.parse(saved) : INITIAL_ZONES;
  });

  const [inspections, setInspections] = useState<InspectionLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}inspections`);
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [orders, setOrders] = useState<FefoPickOrder[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [alerts, setAlerts] = useState<AuditAlert[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}alerts`);
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [ragMessages, setRagMessages] = useState<RagMessage[]>([
    {
      id: 'rag-init-1',
      sender: 'assistant',
      text: `Hello, Warehouse Operations Lead. I am **ShelfNova RAG Intelligence**, your assistant for FEFO prioritization, cold-chain compliance, HACCP standards, and batch quality analysis.\n\nHow can I help optimize your warehouse floor today?`,
      timestamp: '08:00 AM',
      recommendedActions: [
        'Which batches expire in the next 48 hours?',
        'Analyze Zone C Dairy Temperature Breach',
        'FEFO pick allocation for 250kg Gala Apples',
        'Ethylene gas compatibility rules for Zone A'
      ]
    }
  ]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}batches`, JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}zones`, JSON.stringify(zones));
  }, [zones]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}inspections`, JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}alerts`, JSON.stringify(alerts));
  }, [alerts]);

  // Realistic telemetry drift simulation (runs every 6 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prevZones =>
        prevZones.map(zone => {
          // slight random jitter (+-0.1 °C)
          const delta = (Math.random() - 0.5) * 0.15;
          let newTemp = Number((zone.currentTemp + delta).toFixed(1));
          
          // If chiller is active and temp > target, drift towards target
          if (zone.chillerActive && newTemp > zone.targetTemp) {
            newTemp = Number((newTemp - 0.08).toFixed(1));
          } else if (!zone.chillerActive && newTemp < zone.maxTemp) {
            newTemp = Number((newTemp + 0.1).toFixed(1));
          }

          // Check status
          let status = zone.status;
          if (newTemp > zone.maxTemp) {
            status = 'Warning';
          } else if (newTemp < zone.minTemp) {
            status = 'Warning';
          } else {
            status = 'Optimal';
          }

          return {
            ...zone,
            currentTemp: newTemp,
            status
          };
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Batch actions
  const addBatch = (batchData: Omit<WarehouseBatch, 'id' | 'barcode' | 'freshnessScore' | 'status'>) => {
    const id = 'b-' + Math.random().toString(36).substring(2, 9);
    const barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const daysLeft = getDaysToExpiry(batchData.expiryDate);
    const freshnessScore = Math.min(100, Math.max(50, 95 - (daysLeft < 3 ? 30 : 0)));
    const status = daysLeft <= 2 ? 'Critical' : daysLeft <= 6 ? 'Warning' : 'Optimal';

    const newBatch: WarehouseBatch = {
      ...batchData,
      id,
      barcode,
      freshnessScore,
      status
    };

    setBatches(prev => [newBatch, ...prev]);

    // Check if new batch is near expiry and generate alert if so
    if (daysLeft <= 2) {
      setAlerts(prev => [
        {
          id: 'alt-' + Date.now(),
          type: 'Impending Expiry',
          severity: 'Critical',
          title: `New Batch Ingested with Critical Expiry (${batchData.name})`,
          description: `Batch ${batchData.batchNumber} has only ${daysLeft} days before expiration.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          entityReference: `Batch ${batchData.batchNumber}`,
          acknowledged: false,
          resolved: false,
          suggestedAction: 'Queue into immediate FEFO pick list.'
        },
        ...prev
      ]);
    }
  };

  const updateBatch = (id: string, updates: Partial<WarehouseBatch>) => {
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  const quarantineBatch = (id: string, reason: string) => {
    setBatches(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'Quarantined', notes: `${b.notes || ''} [Quarantined: ${reason}]` } : b))
    );
    setAlerts(prev => [
      {
        id: 'alt-' + Date.now(),
        type: 'Inspection Rejection',
        severity: 'High',
        title: `Batch Placed in Quarantine (#${id})`,
        description: `Quarantine initiated: ${reason}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        entityReference: `Batch ${id}`,
        acknowledged: false,
        resolved: false,
        suggestedAction: 'Isolate from general pallet bays and arrange lab re-test or supplier credit.'
      },
      ...prev
    ]);
  };

  // Telemetry actions
  const toggleZoneChiller = (zoneId: string) => {
    setZones(prev =>
      prev.map(z => {
        if (z.id === zoneId) {
          const newState = !z.chillerActive;
          return {
            ...z,
            chillerActive: newState,
            status: newState && z.currentTemp <= z.maxTemp ? 'Optimal' : z.status
          };
        }
        return z;
      })
    );
  };

  const toggleZoneVentilation = (zoneId: string) => {
    setZones(prev =>
      prev.map(z => {
        if (z.id === zoneId) {
          return { ...z, ventilationActive: !z.ventilationActive };
        }
        return z;
      })
    );
  };

  const updateZoneSetpoint = (zoneId: string, targetTemp: number) => {
    setZones(prev =>
      prev.map(z => (z.id === zoneId ? { ...z, targetTemp } : z))
    );
  };

  // Inspection actions
  const addInspection = (logData: Omit<InspectionLog, 'id' | 'timestamp'>) => {
    const newLog: InspectionLog = {
      ...logData,
      id: 'insp-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setInspections(prev => [newLog, ...prev]);

    // Update the corresponding batch
    const targetBatch = batches.find(b => b.batchNumber === logData.batchNumber || b.name.includes(logData.productName));
    if (targetBatch) {
      let newStatus: WarehouseBatch['status'] = targetBatch.status;
      if (logData.verdict === 'Quarantine') newStatus = 'Quarantined';
      else if (logData.verdict === 'Scrap') newStatus = 'Expired';
      else if (logData.verdict === 'Downgrade Grade B') newStatus = 'Warning';

      updateBatch(targetBatch.id, {
        freshnessScore: logData.visualFreshnessScore,
        status: newStatus,
        inspectionHistory: [...(targetBatch.inspectionHistory || []), newLog.id]
      });
    }
  };

  // FEFO Order actions
  const createAndAllocateOrder = (
    customer: string,
    destinationType: FefoPickOrder['destinationType'],
    sku: string,
    productName: string,
    quantity: number,
    unit: string
  ): FefoPickOrder => {
    const { allocatedItems, totalLossAvoided, totalKgSaved } = allocateFefoOrder(sku, quantity, batches);

    const newOrder: FefoPickOrder = {
      id: 'ord-' + Date.now(),
      orderNumber: `ORD-FEFO-${Math.floor(1000 + Math.random() * 9000)}`,
      customerOrChannel: customer,
      destinationType,
      requestedItems: [{ sku, productName, requestedQty: quantity, unit }],
      allocatedBatches: allocatedItems,
      status: 'Ready for Pick',
      priority: allocatedItems.some(i => i.daysToExpiry <= 2) ? 'Emergency FEFO Clearance' : 'Standard',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      wasteSavingsKg: totalKgSaved,
      financialLossAvoided: totalLossAvoided
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const dispatchOrder = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    // Deduct quantities from allocated batches
    targetOrder.allocatedBatches.forEach(item => {
      const batch = batches.find(b => b.id === item.batchId);
      if (batch) {
        const remaining = Math.max(0, batch.currentQuantity - item.allocatedQty);
        updateBatch(batch.id, {
          currentQuantity: remaining,
          status: remaining === 0 ? 'Dispatched' : batch.status
        });
      }
    });

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: 'Dispatched',
              dispatchedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : o
      )
    );
  };

  // Alerts
  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id
          ? {
              ...a,
              acknowledged: true,
              resolved: true,
              resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
            }
          : a
      )
    );
  };

  const addRagMessage = (msg: RagMessage) => {
    setRagMessages(prev => [...prev, msg]);
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}batches`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}zones`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}inspections`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}orders`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}alerts`);
    setBatches(INITIAL_BATCHES);
    setZones(INITIAL_ZONES);
    setInspections(INITIAL_INSPECTIONS);
    setOrders(INITIAL_ORDERS);
    setAlerts(INITIAL_ALERTS);
  };

  return (
    <WarehouseContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        batches,
        zones,
        inspections,
        orders,
        alerts,
        ragMessages,
        searchQuery,
        setSearchQuery,
        addBatch,
        updateBatch,
        deleteBatch,
        quarantineBatch,
        toggleZoneChiller,
        toggleZoneVentilation,
        updateZoneSetpoint,
        addInspection,
        createAndAllocateOrder,
        dispatchOrder,
        acknowledgeAlert,
        resolveAlert,
        addRagMessage,
        resetAllData,
        inspectingBatchId,
        setInspectingBatchId
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
