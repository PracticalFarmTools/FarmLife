import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import { PRICING_STRATEGIES } from '../data/pricingStrategies';
import {
  Store,
  Package,
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { PricingStrategy } from '../types/game';

export const MarketView: React.FC = () => {
  const {
    inventory,
    wholesaleContracts,
    marketPriceModifiers,
    farmstandLevel,
    season,
    setPricingStrategy,
    sellWholesaleSpot,
    fulfillContract,
    upgradeFarmstand,
  } = useGameStore();

  const [activeMarketTab, setActiveMarketTab] = useState<'farmstand' | 'wholesale'>('farmstand');
  const [sellQuantities, setSellQuantities] = useState<Record<string, number>>({});

  const handleQtyChange = (id: string, val: number) => {
    setSellQuantities((prev) => ({ ...prev, [id]: val }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Store className="w-7 h-7 text-amber-500" />
            <span>Marketplace & Sales Channels</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Choose between retail Farmstand sales with custom pricing markups or static Wholesale contracts.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2 p-1 bg-stone-950 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveMarketTab('farmstand')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeMarketTab === 'farmstand'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🌾 Farmstand Retail
          </button>

          <button
            onClick={() => setActiveMarketTab('wholesale')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition ${
              activeMarketTab === 'wholesale'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🚚 Wholesale & Contracts
          </button>
        </div>
      </div>

      {/* FARMSTAND RETAIL TAB */}
      {activeMarketTab === 'farmstand' && (
        <div className="space-y-6">
          {/* Farmstand Upgrade Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 text-xs font-bold border border-amber-800">
                  Level {farmstandLevel} Farmstand
                </span>
                <span className="text-xs text-stone-400">
                  Est. Daily Foot Traffic: ~{15 * farmstandLevel + 10} shoppers/day
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-100 mt-2">Dynamic Pricing Strategy Center</h3>
              <p className="text-xs text-stone-400">
                Adjust price markups. Aggressive pricing maximizes profit per unit, but decreases customer volume.
              </p>
            </div>

            <button
              onClick={upgradeFarmstand}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-lg transition flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade Stand (Level {farmstandLevel + 1}) - ${(5000 * farmstandLevel).toLocaleString()}</span>
            </button>
          </div>

          {/* Farmstand Items Grid */}
          {inventory.length === 0 ? (
            <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
              <Package className="w-12 h-12 text-stone-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-stone-300">No Inventory in Barn</h4>
              <p className="text-xs mt-1">Harvest crops from your fields to stock your farmstand!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inventory.map((item) => {
                const crop = CROPS.find((c) => c.id === item.cropId);
                if (!crop) return null;

                const marketMod = marketPriceModifiers[item.cropId] || 1.0;
                const currentStrategy =
                  PRICING_STRATEGIES.find((s) => s.id === item.pricingStrategy) || PRICING_STRATEGIES[1];

                const unitRetailPrice = crop.baseSalePrice * marketMod * (1 + currentStrategy.markupPct / 100);

                return (
                  <div
                    key={item.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{crop.icon}</span>
                          <div>
                            <h3 className="font-extrabold text-stone-100 text-lg">{crop.name}</h3>
                            <p className="text-xs font-mono text-stone-400">
                              Stock: <span className="text-emerald-400 font-bold">{item.quantity} units</span> | Storage: {item.daysInStorage}d
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-stone-400">Retail Unit Price</span>
                          <h4 className="text-xl font-extrabold text-emerald-400 font-mono">
                            ${unitRetailPrice.toFixed(2)}
                          </h4>
                        </div>
                      </div>

                      {/* Strategy Selection */}
                      <div className="space-y-3 mb-4">
                        <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                          Set Pricing Strategy:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {PRICING_STRATEGIES.map((strat) => {
                            const isSelected = item.pricingStrategy === strat.id;
                            return (
                              <button
                                key={strat.id}
                                onClick={() => setPricingStrategy(item.cropId, strat.id as PricingStrategy)}
                                className={`p-2.5 rounded-xl border text-left transition ${
                                  isSelected
                                    ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow ring-1 ring-amber-500'
                                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                                }`}
                              >
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span>{strat.label}</span>
                                  <span className="font-mono text-[10px]">
                                    {strat.markupPct >= 0 ? `+${strat.markupPct}%` : `${strat.markupPct}%`}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Customer Conversion Indicator */}
                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1">
                        <div className="flex justify-between text-stone-300">
                          <span className="text-stone-400">Customer Conversion Rate:</span>
                          <span className="font-mono font-bold text-amber-400">
                            {Math.round(currentStrategy.conversionMultiplier * 100)}% Conversion
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 italic">{currentStrategy.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* WHOLESALE & CONTRACTS TAB */}
      {activeMarketTab === 'wholesale' && (
        <div className="space-y-6">
          {/* Locked Seasonal Contracts */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Static Seasonal Wholesale Contracts</span>
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Prices remain static for the entire season ({season}). Buyers may offer price increases next season based on demand!
            </p>

            {wholesaleContracts.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No wholesale buyer contracts available right now.</p>
            ) : (
              <div className="space-y-4">
                {wholesaleContracts.map((contract) => {
                  const crop = CROPS.find((c) => c.id === contract.cropId);
                  const inventoryItem = inventory.find((i) => i.cropId === contract.cropId);
                  const availableUnits = inventoryItem ? inventoryItem.quantity : 0;
                  const qtyToDeliver = sellQuantities[contract.id] || Math.min(100, Math.floor(availableUnits));

                  return (
                    <div
                      key={contract.id}
                      className="bg-stone-950 border border-stone-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{crop?.icon || '📦'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-stone-100">{contract.buyerName}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                              Locked for {contract.season}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Contract Rate: <span className="font-mono font-bold text-emerald-400">${contract.contractPricePerUnit}/unit</span> for {contract.cropName}
                          </p>
                          <p className="text-[11px] text-amber-400 mt-1">
                            ★ {Math.round(contract.increaseChanceNextSeason * 100)}% probability of rate renegotiation bump next season!
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs">
                          <label className="block text-stone-400 font-mono mb-1">
                            Deliver Quantity (In Barn: {availableUnits})
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={availableUnits}
                            value={qtyToDeliver}
                            onChange={(e) => handleQtyChange(contract.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-28 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          onClick={() => fulfillContract(contract.id, qtyToDeliver)}
                          disabled={availableUnits < 1}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition shadow ${
                            availableUnits >= 1
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          Fulfill Contract
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Wholesale Spot Market Liquidation */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>Wholesale Spot Market (Instant Liquidation)</span>
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Sell inventory immediately to the open commodity spot market at a 20% bulk wholesale discount.
            </p>

            {inventory.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No inventory available to sell on spot market.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inventory.map((item) => {
                  const crop = CROPS.find((c) => c.id === item.cropId);
                  if (!crop) return null;

                  const marketMod = marketPriceModifiers[item.cropId] || 1.0;
                  const spotPrice = Number((crop.baseSalePrice * marketMod * 0.80).toFixed(2));
                  const qtyToSell = sellQuantities[`spot-${item.cropId}`] || Math.floor(item.quantity);

                  return (
                    <div
                      key={`spot-${item.id}`}
                      className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{crop.icon}</span>
                        <div>
                          <h4 className="font-bold text-stone-100 text-sm">{crop.name}</h4>
                          <p className="text-xs text-stone-400">
                            Spot Price: <span className="font-mono text-emerald-400 font-bold">${spotPrice}/unit</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={item.quantity}
                          value={qtyToSell}
                          onChange={(e) =>
                            handleQtyChange(`spot-${item.cropId}`, Math.max(1, parseInt(e.target.value) || 1))
                          }
                          className="w-20 px-2 py-1 rounded bg-stone-900 border border-stone-800 text-stone-100 font-mono text-xs"
                        />
                        <button
                          onClick={() => sellWholesaleSpot(item.cropId, qtyToSell)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition"
                        >
                          Sell Bulk
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
