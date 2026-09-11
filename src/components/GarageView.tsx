import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { DEALERSHIP_CATALOG } from '../data/machinery';
import {
  Wrench,
  AlertTriangle,
  DollarSign,
  Zap,
  ShoppingBag,
  Award,
  Building,
  ArrowRightLeft,
} from 'lucide-react';

export const GarageView: React.FC = () => {
  const {
    fleet,
    auctionDeals,
    garageLevel,
    cash,
    buyMachineryDealership,
    tradeInMachinery,
    buyMachineryAuction,
    repairMachinery,
    emergencyFix,
    upgradeGarage,
  } = useGameStore();

  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'dealership' | 'auction'>('roster');
  const [selectedTradeInId, setSelectedTradeInId] = useState<string | null>(null);

  const getGarageLevelName = (lvl: number) => {
    switch (lvl) {
      case 1:
        return 'Dirt Floor Shed (3-Day Repairs)';
      case 2:
        return 'Enclosed Workshop (2-Day Repairs, -10% Cost)';
      case 3:
        return 'Heated Mechanic Shop (1-Day Repairs, -20% Cost)';
      default:
        return 'Basic Garage';
    }
  };

  const getConditionColor = (cond: number) => {
    if (cond < 40) return 'text-rose-400 bg-rose-950 border-rose-800';
    if (cond < 70) return 'text-amber-400 bg-amber-950 border-amber-800';
    return 'text-emerald-400 bg-emerald-950 border-emerald-800';
  };

  return (
    <div className="space-y-6">
      {/* Header & Garage Level */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
              <Wrench className="w-7 h-7 text-amber-500" />
              <span>Fleet & Garage Management</span>
            </h2>
            <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-400 text-xs font-bold border border-amber-800">
              Level {garageLevel} Garage
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {getGarageLevelName(garageLevel)} | Fleet Value: ${fleet.reduce((a, b) => a + b.purchasePrice, 0).toLocaleString()}
          </p>
        </div>

        {/* Upgrade Garage Button */}
        {garageLevel < 3 && (
          <button
            onClick={upgradeGarage}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm shadow-lg transition cursor-pointer shrink-0"
          >
            <Building className="w-4 h-4" />
            <span>
              Upgrade Workshop (Level {garageLevel + 1}) - ${garageLevel === 1 ? '15,000' : '40,000'}
            </span>
          </button>
        )}
      </div>

      {/* Sub-tab Navigation */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2 p-1 bg-stone-900 rounded-xl border border-stone-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('roster')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'roster'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🚜 Fleet Roster ({fleet.length})
        </button>

        <button
          onClick={() => setActiveSubTab('auction')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'auction'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🏷️ Auction Deals ({auctionDeals.length})
        </button>

        <button
          onClick={() => setActiveSubTab('dealership')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'dealership'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🏭 Dealership (New)
        </button>
      </div>

      {/* FLEET ROSTER SUB-TAB */}
      {activeSubTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleet.map((item) => {
            const isBroken = item.status === 'broken_down';
            const isInShop = item.status === 'in_shop';
            const isWarranty = item.warrantyDaysRemaining > 0;

            return (
              <div
                key={item.id}
                className={`bg-stone-900 border rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all ${
                  isBroken
                    ? 'border-rose-500 ring-2 ring-rose-500/30'
                    : isInShop
                    ? 'border-amber-600/80'
                    : 'border-stone-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{item.icon}</span>
                      <div>
                        <h3 className="font-extrabold text-stone-100 text-base">{item.name}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                          {item.horsepower > 0 && <span>{item.horsepower} HP Power</span>}
                          {item.requiredHp > 0 && <span>Requires {item.requiredHp} HP</span>}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        isBroken
                          ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                          : isInShop
                          ? 'bg-amber-950 text-amber-300 border-amber-600'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      }`}
                    >
                      {isBroken ? 'BROKEN DOWN' : isInShop ? `In Shop (${item.repairDaysRemaining}d)` : 'Available'}
                    </span>
                  </div>

                  {/* Condition & Hours Stats */}
                  <div className="space-y-3 p-3 bg-stone-950 rounded-xl border border-stone-800/80 text-xs mb-4">
                    <div>
                      <div className="flex justify-between text-stone-300 mb-1">
                        <span className="text-stone-400">Mechanical Condition:</span>
                        <span className={`font-mono font-bold ${getConditionColor(item.condition).split(' ')[0]}`}>
                          {item.condition}% {item.condition < 40 ? '(Breakdown Risk!)' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            item.condition < 40 ? 'bg-rose-500' : item.condition < 70 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${item.condition}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between text-stone-300 font-mono">
                      <span className="text-stone-400">Engine Hours:</span>
                      <span>{item.engineHours} hrs</span>
                    </div>

                    <div className="flex justify-between text-stone-300 font-mono">
                      <span className="text-stone-400">Warranty Status:</span>
                      <span className={isWarranty ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                        {isWarranty ? `${item.warrantyDaysRemaining} days remaining` : 'Expired'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  {isBroken ? (
                    <button
                      onClick={() => emergencyFix(item.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5 animate-pulse"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Emergency Callout Repair ($1,500)</span>
                    </button>
                  ) : isInShop ? (
                    <button disabled className="w-full py-2.5 px-4 rounded-xl bg-stone-800 text-stone-500 font-bold text-xs cursor-not-allowed">
                      In Shop ({item.repairDaysRemaining} day(s) left)
                    </button>
                  ) : (
                    <button
                      onClick={() => repairMachinery(item.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs shadow transition flex items-center justify-center gap-1.5 border border-stone-700"
                    >
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span>
                        Overhaul Maintenance ({isWarranty ? 'FREE (Warranty)' : `$${(garageLevel === 3 ? 960 : garageLevel === 2 ? 1080 : 1200).toLocaleString()}`})
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AUCTION HOUSE SUB-TAB */}
      {activeSubTab === 'auction' && (
        <div className="space-y-6">
          <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-amber-300 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Bankruptcy & Farm Auction House</span>
            </h3>
            <p className="text-xs text-stone-300">
              Buy used equipment at deep discounts (35%-60% off). High engine hours require frequent maintenance!
            </p>
          </div>

          {auctionDeals.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No auction deals right now. Check back next week!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {auctionDeals.map((deal) => {
                const canAfford = cash >= deal.price;

                return (
                  <div
                    key={deal.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{deal.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-stone-100 text-base">{deal.name}</h3>
                              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-bold border border-amber-800">
                                {deal.discountPct}% OFF
                              </span>
                            </div>
                            <p className="text-xs text-stone-400">{deal.description}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono text-center mb-4">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Auction Price</span>
                          <span className="font-bold text-emerald-400">${deal.price.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Engine Hours</span>
                          <span className="font-bold text-amber-400">{deal.engineHours} hrs</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block">Initial Condition</span>
                          <span className="font-bold text-blue-400">{deal.initialCondition}%</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => buyMachineryAuction(deal.id)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition shadow flex items-center justify-center gap-1.5 ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>{canAfford ? `Bid & Purchase ($${deal.price.toLocaleString()})` : 'Insufficient Cash'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* DEALERSHIP SUB-TAB */}
      {activeSubTab === 'dealership' && (() => {
        const selectedTradeMachine = fleet.find((m) => m.id === selectedTradeInId);
        const selectedTradeEquity = selectedTradeMachine
          ? Math.round(selectedTradeMachine.purchasePrice * (selectedTradeMachine.condition / 100) * 0.75)
          : 0;

        return (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>Official Machinery Dealership (Brand New)</span>
              </h3>
              <p className="text-xs text-stone-400">
                Purchasing new equipment includes a 3-Year Dealer Warranty with 0 breakdown risk during warranty.
              </p>
            </div>

            {/* Trade-In Equity Selector */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-800/60 rounded-2xl p-5 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-extrabold text-amber-300 flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                    <span>Commercial Equipment Trade-In Program</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Trade in any owned machine from your fleet towards a brand-new implement. Dealers offer 75% condition-depreciated wholesale equity.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-bold text-stone-300">Fleet Trade-In:</span>
                  <select
                    value={selectedTradeInId || ''}
                    onChange={(e) => setSelectedTradeInId(e.target.value || null)}
                    className="bg-stone-950 border border-stone-700 text-stone-200 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- No Trade-In Selected --</option>
                    {fleet.map((m) => {
                      const eq = Math.round(m.purchasePrice * (m.condition / 100) * 0.75);
                      return (
                        <option key={m.id} value={m.id}>
                          {m.icon} {m.name} ({m.condition}% cond) → ${eq.toLocaleString()} Credit
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {selectedTradeMachine && (
                <div className="mt-3 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 font-mono">Trading:</span>
                    <span className="font-bold text-stone-200">{selectedTradeMachine.name}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold">
                      +${selectedTradeEquity.toLocaleString()} Credit
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedTradeInId(null)}
                    className="text-stone-400 hover:text-stone-200 underline text-xs cursor-pointer"
                  >
                    Clear Trade-In Selection
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DEALERSHIP_CATALOG.map((item) => {
                const canAffordFull = cash >= item.price;
                const netPrice = selectedTradeMachine ? Math.max(0, item.price - selectedTradeEquity) : item.price;
                const canAffordNet = cash >= netPrice;

                return (
                  <div
                    key={item.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">{item.icon}</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-mono font-bold border border-emerald-800">
                          3-Yr Warranty
                        </span>
                      </div>

                      <h3 className="font-extrabold text-stone-100 text-base mb-1">{item.name}</h3>
                      <p className="text-xs text-stone-400 mb-4">{item.description}</p>

                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono mb-4 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Retail Price:</span>
                          <span className="font-bold text-stone-200">${item.price.toLocaleString()}</span>
                        </div>
                        {selectedTradeMachine && (
                          <>
                            <div className="flex justify-between text-emerald-400">
                              <span>Trade-In Credit:</span>
                              <span>-${selectedTradeEquity.toLocaleString()}</span>
                            </div>
                            <div className="pt-1 border-t border-stone-800 flex justify-between font-bold text-amber-400">
                              <span>Net Cash Due:</span>
                              <span>${netPrice.toLocaleString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedTradeMachine ? (
                        <>
                          <button
                            onClick={() => {
                              tradeInMachinery(selectedTradeMachine.id, item.id);
                              setSelectedTradeInId(null);
                            }}
                            disabled={!canAffordNet}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition shadow flex items-center justify-center gap-1.5 ${
                              canAffordNet
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 cursor-pointer'
                                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            }`}
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                            <span>
                              {canAffordNet
                                ? `Trade In & Pay Net ($${netPrice.toLocaleString()})`
                                : 'Insufficient Cash for Net'}
                            </span>
                          </button>

                          <button
                            onClick={() => buyMachineryDealership(item.id)}
                            disabled={!canAffordFull}
                            className={`w-full py-2 px-3 rounded-lg font-medium text-[11px] transition flex items-center justify-center gap-1 ${
                              canAffordFull
                                ? 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 cursor-pointer'
                                : 'bg-stone-900 text-stone-600 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Buy Outright (${item.price.toLocaleString()})</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => buyMachineryDealership(item.id)}
                          disabled={!canAffordFull}
                          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition shadow flex items-center justify-center gap-1.5 ${
                            canAffordFull
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 cursor-pointer'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>{canAffordFull ? `Purchase New ($${item.price.toLocaleString()})` : 'Insufficient Cash'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
