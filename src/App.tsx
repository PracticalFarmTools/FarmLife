import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { HeaderNav } from './components/HeaderNav';
import { NewGameModal } from './components/NewGameModal';
import { DeskView } from './components/DeskView';
import { FieldsView } from './components/FieldsView';
import { SeedBrokerView } from './components/SeedBrokerView';
import { MarketView } from './components/MarketView';
import { BarnView } from './components/BarnView';
import { GarageView } from './components/GarageView';
import { RosterView } from './components/RosterView';
import { BankView } from './components/BankView';
import { LedgerView } from './components/LedgerView';
import { EndlessModeView } from './components/EndlessModeView';
import { NotificationSidebar } from './components/NotificationSidebar';
import { OotpSidebar } from './components/OotpSidebar';
import { MobileTabBar } from './components/MobileTabBar';
import { MobileDrawer } from './components/MobileDrawer';

export const App: React.FC = () => {
  const { gameStarted, activeTab } = useGameStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      {!gameStarted ? (
        <NewGameModal />
      ) : (
        <>
          {/* Zone A: Top Pinned Navigation & Vitals Ticker */}
          <HeaderNav />

          {/* 3-Zone Layout Container */}
          <div className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 lg:pb-6">
            {/* Zone B: Left Contextual Micro Navigation Sidebar (Desktop Only) */}
            <div className="hidden lg:block lg:col-span-2">
              <OotpSidebar />
            </div>

            {/* Zone C: Main Modular Content Area */}
            <main className="lg:col-span-7 space-y-6">
              {activeTab === 'desk' && <DeskView />}
              {activeTab === 'fields' && <FieldsView />}
              {activeTab === 'seeds' && <SeedBrokerView />}
              {activeTab === 'market' && <MarketView />}
              {activeTab === 'barn' && <BarnView />}
              {activeTab === 'garage' && <GarageView />}
              {activeTab === 'roster' && <RosterView />}
              {activeTab === 'bank' && <BankView />}
              {activeTab === 'ledger' && <LedgerView />}
              {activeTab === 'endless' && <EndlessModeView />}
            </main>

            {/* Right Feed & Notifications (Desktop Only) */}
            <aside className="hidden lg:block lg:col-span-3">
              <NotificationSidebar />
            </aside>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          <MobileTabBar onOpenDrawer={() => setIsDrawerOpen(true)} />

          {/* Mobile Slide-Over Operations Drawer */}
          <MobileDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default App;
