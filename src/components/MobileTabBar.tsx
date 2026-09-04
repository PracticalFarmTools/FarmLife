import React from 'react';
import { useGameStore } from '../store/gameStore';
import {
  LayoutDashboard,
  Sprout,
  Store,
  Warehouse,
  Menu,
} from 'lucide-react';

interface MobileTabBarProps {
  onOpenDrawer: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ onOpenDrawer }) => {
  const { activeTab, setActiveTab, fields, notifications } = useGameStore();

  const hasDistressedFields = fields.some(
    (f) => f.activeDiseases.length > 0 || f.soil.nitrogen < 30 || f.moistureLevel < 25 || f.moistureLevel > 85
  );

  const isMoreTabActive = ['garage', 'roster', 'bank', 'seeds', 'ledger', 'endless'].includes(activeTab);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-lg border-t border-stone-800 px-2 py-1.5 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-5 gap-1 max-w-lg mx-auto">
        {/* Desk Tab */}
        <button
          onClick={() => setActiveTab('desk')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition ${
            activeTab === 'desk'
              ? 'text-emerald-400 bg-emerald-950/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Desk</span>
        </button>

        {/* Fields Tab */}
        <button
          onClick={() => setActiveTab('fields')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition ${
            activeTab === 'fields'
              ? 'text-emerald-400 bg-emerald-950/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Sprout className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Fields</span>
          {hasDistressedFields && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        {/* Market Tab */}
        <button
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition ${
            activeTab === 'market'
              ? 'text-emerald-400 bg-emerald-950/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Market</span>
        </button>

        {/* Barn Tab */}
        <button
          onClick={() => setActiveTab('barn')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition ${
            activeTab === 'barn'
              ? 'text-emerald-400 bg-emerald-950/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Warehouse className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">Barn</span>
        </button>

        {/* More Tab / Drawer Button */}
        <button
          onClick={onOpenDrawer}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition ${
            isMoreTabActive
              ? 'text-amber-400 bg-amber-950/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">More</span>
          {notifications.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
      </div>
    </nav>
  );
};
