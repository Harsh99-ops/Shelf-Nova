import React, { useState } from 'react';
import { WarehouseProvider, useWarehouse } from './context/WarehouseContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CandyBottomNav } from './components/CandyBottomNav';
import { DashboardScreen } from './components/DashboardScreen';
import { FefoDispatchScreen } from './components/FefoDispatchScreen';
import { InspectionScreen } from './components/InspectionScreen';
import { StorageMonitoringScreen } from './components/StorageMonitoringScreen';
import { InventoryScreen } from './components/InventoryScreen';
import { AssistantKnowledgeScreen } from './components/AssistantKnowledgeScreen';
import { AlertsAuditScreen } from './components/AlertsAuditScreen';
import { AddBatchModal } from './components/AddBatchModal';

const AppContent: React.FC = () => {
  const { currentTab } = useWarehouse();
  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);

  // Dynamic atmospheric confection backdrop per page so each page has its own sweet identity
  const getTabBackdrop = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'bg-gradient-to-b from-[#fff1f5] via-[#fff5f8] to-[#fce7f3]';
      case 'fefo':
        return 'bg-gradient-to-b from-[#fff1f2] via-[#f0fdf4]/60 to-[#fdf2f8]';
      case 'inventory':
        return 'bg-gradient-to-b from-[#fffbeb] via-[#fff7ed]/70 to-[#fdf2f8]';
      case 'inspection':
        return 'bg-gradient-to-b from-[#faf5ff] via-[#fdf4ff]/70 to-[#f0fdfa]/60';
      case 'telemetry':
        return 'bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe]/70 to-[#ede9fe]/60';
      case 'assistant':
        return 'bg-gradient-to-b from-[#fdf2f8] via-[#fff1f2]/70 to-[#fffbeb]/60';
      case 'alerts':
        return 'bg-gradient-to-b from-[#fffbeb] via-[#fef3c7]/70 to-[#faf5ff]/60';
      default:
        return 'bg-[#fff5f8]';
    }
  };

  return (
    <div className={`min-h-screen text-[#4a2215] flex flex-col font-sans selection:bg-pink-300 selection:text-pink-900 relative transition-colors duration-500 ${getTabBackdrop(currentTab)}`}>
      {/* Header Bar */}
      <Header onOpenAddBatch={() => setIsAddBatchOpen(true)} />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Navigation Sidebar (Desktop) */}
        <Sidebar />

        {/* Dynamic Screen View Area with bottom padding for CandyBottomNav */}
        <main className="flex-1 p-3 sm:p-5 lg:p-7 max-w-7xl mx-auto w-full overflow-y-auto pb-28">
          {currentTab === 'dashboard' && <DashboardScreen />}
          {currentTab === 'fefo' && <FefoDispatchScreen />}
          {currentTab === 'inspection' && <InspectionScreen />}
          {currentTab === 'telemetry' && <StorageMonitoringScreen />}
          {currentTab === 'inventory' && <InventoryScreen onOpenAddBatch={() => setIsAddBatchOpen(true)} />}
          {currentTab === 'assistant' && <AssistantKnowledgeScreen />}
          {currentTab === 'alerts' && <AlertsAuditScreen />}
        </main>
      </div>

      {/* Global Inbound Receiving Modal */}
      <AddBatchModal 
        isOpen={isAddBatchOpen} 
        onClose={() => setIsAddBatchOpen(false)} 
      />

      {/* Persistent Candy Bottom Bar matching reference screenshot */}
      <CandyBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <WarehouseProvider>
      <AppContent />
    </WarehouseProvider>
  );
}
