import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ChevronRight } from 'lucide-react';

export const OotpSidebar: React.FC = () => {
  const {
    activeTab,
    fields,
    fleet,
    auctionDeals,
    wholesaleContracts,
    seasonalWorkers,
    staff,
    operatingLoan,
    storageFacility,
    getDailyBurnRate,
  } = useGameStore();

  const dailyBurn = getDailyBurnRate();

  return (
    <aside className="w-full lg:w-64 bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-6">
      {/* Contextual Micro-Navigation Header */}
      <div className="space-y-4">
        <div className="pb-3 border-b border-stone-800 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider font-mono text-amber-500 font-bold">
            CONTEXT MENU
          </span>
          <span className="text-xs font-mono font-bold text-stone-400 uppercase">
            {activeTab}
          </span>
        </div>

        {/* Dynamic Contextual Lists */}
        {activeTab === 'desk' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Manager Overview</h4>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Daily Outflow Burn</span>
              <strong className="text-rose-400 font-mono text-sm">-${dailyBurn.toLocaleString()}/day</strong>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Active Fields</span>
              <strong className="text-emerald-400 font-mono text-sm">{fields.length} Field Parcels</strong>
            </div>
          </div>
        )}

        {activeTab === 'fields' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Farm Parcels & Plots</h4>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {fields.map((f) => (
                <div
                  key={f.id}
                  className="p-2 bg-stone-950 border border-stone-800 rounded-lg flex items-center justify-between"
                >
                  <div className="truncate">
                    <span className="font-bold text-stone-200 block truncate">{f.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {f.status === 'growing' ? `Growing ${f.currentCropId}` : f.status.toUpperCase()}
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seeds' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Seed Broker & R&D</h4>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Patented GMO Traits</span>
              <span className="text-purple-400 font-bold">Tech Fees Included</span>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Organic Heirlooms</span>
              <span className="text-emerald-400 font-bold">+80-90% Selling Premium</span>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Markets & Contracts</h4>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Active Wholesale Orders</span>
              <strong className="text-amber-400 font-mono text-sm">{wholesaleContracts.length} Contracts</strong>
            </div>
          </div>
        )}

        {activeTab === 'barn' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Cold Chain & Logistics</h4>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Cold Storage Status</span>
              <strong
                className={
                  storageFacility.hasColdStorage
                    ? storageFacility.isPowerOutage
                      ? 'text-rose-400 font-bold'
                      : 'text-cyan-400 font-bold'
                    : 'text-stone-500'
                }
              >
                {storageFacility.hasColdStorage
                  ? storageFacility.isPowerOutage
                    ? 'Blackout Spike (65°F)'
                    : 'Active (34°F)'
                  : 'Unbuilt'}
              </strong>
            </div>
          </div>
        )}

        {activeTab === 'garage' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Fleet & Machinery</h4>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Owned Power Units</span>
              <strong className="text-amber-400 font-mono text-sm">{fleet.length} Machines</strong>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Bankruptcy Auctions</span>
              <strong className="text-emerald-400 font-mono text-sm">{auctionDeals.length} Deals</strong>
            </div>
          </div>
        )}

        {activeTab === 'roster' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Labor & Roster</h4>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Seasonal Crew Size</span>
              <strong className="text-emerald-400 font-mono text-sm">{seasonalWorkers.length} Workers</strong>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Salaried Staff</span>
              <strong className="text-amber-400 font-mono text-sm">
                {staff.filter((s) => s.hired).length} Hired
              </strong>
            </div>
          </div>
        )}

        {activeTab === 'bank' && (
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-stone-300 text-[11px] uppercase font-mono">Bank & Credit</h4>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
              <span className="text-stone-400 block text-[10px]">Operating Loan</span>
              <strong className={operatingLoan ? 'text-amber-400 font-bold' : 'text-stone-400'}>
                {operatingLoan ? `$${operatingLoan.principal.toLocaleString()}` : 'None'}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Quick Vitals Footer Card */}
      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-[10px] text-stone-400 font-mono space-y-1">
        <span className="block text-stone-500 uppercase font-bold">OOTP DENSE INTERFACE</span>
        <p>Agronomics Simulation Engine v2.0</p>
      </div>
    </aside>
  );
};
