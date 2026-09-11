import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import { PRICING_STRATEGIES } from '../data/pricingStrategies';
import {
  Store,
  Package,
  CheckCircle2,
  Sparkles,
  Layers,
  TrendingUp,
  ShieldCheck,
  Landmark,
  Fuel,
  FileText,
  Leaf,
} from 'lucide-react';
import type { PricingStrategy } from '../types/game';

export const MarketView: React.FC = () => {
  const {
    cash,
    inventory,
    fields,
    wholesaleContracts,
    forwardContracts,
    putOptions,
    usdaPrograms,
    marketPriceModifiers,
    farmstandLevel,
    season,
    year,
    setPricingStrategy,
    sellWholesaleSpot,
    fulfillContract,
    upgradeFarmstand,
    signForwardContract,
    fulfillForwardContract,
    buyPutOptionFloor,
    exercisePutOption,
    applyForUsdaEqipGrant,
    enrollFieldInCrp,
    withdrawFieldFromCrp,
    buyBulkInputsWinterDiscount,
  } = useGameStore();

  const [activeMarketTab, setActiveMarketTab] = useState<'farmstand' | 'wholesale' | 'hedging' | 'usda'>('farmstand');
  const [sellQuantities, setSellQuantities] = useState<Record<string, number>>({});

  // Hedging state
  const [forwardCropId, setForwardCropId] = useState<string>(CROPS[0]?.id || 'crop_corn');
  const [forwardBushels, setForwardBushels] = useState<number>(500);
  const [forwardDeliverQty, setForwardDeliverQty] = useState<Record<string, number>>({});

  const [putCropId, setPutCropId] = useState<string>(CROPS[0]?.id || 'crop_corn');
  const [putQuantity, setPutQuantity] = useState<number>(500);
  const [putStrikeMultiplier, setPutStrikeMultiplier] = useState<number>(1.0);

  const handleQtyChange = (id: string, val: number) => {
    setSellQuantities((prev) => ({ ...prev, [id]: val }));
  };

  const handleFulfillContract = (contractId: string, qty: number) => {
    const ok = fulfillContract(contractId, qty);
    if (ok) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch {}
    }
  };

  // Selected crop for forward contract calculation
  const selectedForwardCrop = CROPS.find((c) => c.id === forwardCropId) || CROPS[0];
  const fwdSpotMod = marketPriceModifiers[forwardCropId] || 1.0;
  const lockedForwardPrice = Number((selectedForwardCrop.baseSalePrice * fwdSpotMod * 1.06).toFixed(2));

  // Selected crop for put option
  const selectedPutCrop = CROPS.find((c) => c.id === putCropId) || CROPS[0];
  const putSpotMod = marketPriceModifiers[putCropId] || 1.0;
  const currentSpotPrice = Number((selectedPutCrop.baseSalePrice * putSpotMod).toFixed(2));
  const calculatedStrike = Number((selectedPutCrop.baseSalePrice * putStrikeMultiplier).toFixed(2));
  const calculatedPremium = Number((calculatedStrike * putQuantity * 0.07).toFixed(2));

  const totalFarmAcres = fields.reduce((sum, f) => sum + f.acres, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Store className="w-7 h-7 text-amber-500" />
            <span>Marketplace, Agribusiness & FSA</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Retail farmstand pricing, wholesale fulfillment, CBOT forward/options hedging, and USDA FSA conservation programs.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-stone-950 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveMarketTab('farmstand')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
              activeMarketTab === 'farmstand'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🌾 Farmstand
          </button>

          <button
            onClick={() => setActiveMarketTab('wholesale')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
              activeMarketTab === 'wholesale'
                ? 'bg-amber-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🚚 Wholesale
          </button>

          <button
            onClick={() => setActiveMarketTab('hedging')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
              activeMarketTab === 'hedging'
                ? 'bg-emerald-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            📈 CBOT Hedging
          </button>

          <button
            onClick={() => setActiveMarketTab('usda')}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition text-center cursor-pointer ${
              activeMarketTab === 'usda'
                ? 'bg-blue-600 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            🏛️ USDA Policy
          </button>
        </div>
      </div>

      {/* FARMSTAND RETAIL TAB */}
      {activeMarketTab === 'farmstand' && (
        <div className="space-y-6">
          {/* Farmstand Upgrade Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
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

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-800">
                        <div className="text-left sm:text-right text-xs">
                          <label className="block text-stone-400 font-mono mb-1 text-[11px]">
                            Deliver Quantity (In Barn: {availableUnits})
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={availableUnits}
                            value={qtyToDeliver}
                            onChange={(e) => handleQtyChange(contract.id, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full sm:w-28 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <button
                          onClick={() => handleFulfillContract(contract.id, qtyToDeliver)}
                          disabled={availableUnits < 1}
                          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs transition shadow text-center cursor-pointer ${
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

      {/* HEDGING & FUTURES TAB */}
      {activeMarketTab === 'hedging' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-stone-900 border border-emerald-800/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
              <div>
                <h3 className="text-xl font-bold text-stone-100">CBOT Agribusiness Risk Management</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Hedge against market gluts and protect working capital with forward delivery contracts and CBOT Put Option price floors.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Pre-Plant Forward Contract Creation */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-stone-100 text-base flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <span>Pre-Plant Forward Contract</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Grain Elevator Basis
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-5 leading-relaxed">
                  Lock in a binding purchase agreement with commercial grain elevators before planting. Guarantees your sale price regardless of spot crashes.
                </p>

                <div className="space-y-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Commodity Crop:
                    </label>
                    <select
                      value={forwardCropId}
                      onChange={(e) => setForwardCropId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {CROPS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name} (Base: ${c.baseSalePrice})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Bushels to Commit:
                    </label>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={forwardBushels}
                      onChange={(e) => setForwardBushels(Math.max(50, parseInt(e.target.value) || 50))}
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Locked Forward Price:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        ${lockedForwardPrice.toFixed(2)} / bu
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Total Guaranteed Value:</span>
                      <span className="font-mono font-bold text-stone-100">
                        ${(lockedForwardPrice * forwardBushels).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Delivery Deadline:</span>
                      <span className="font-mono text-amber-400">
                        Fall Y{season === 'Fall' || season === 'Winter' ? year + 1 : year}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => signForwardContract(forwardCropId, forwardBushels, lockedForwardPrice)}
                className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Execute Forward Contract (${(lockedForwardPrice * forwardBushels).toLocaleString()})</span>
              </button>
            </div>

            {/* 2. CBOT Put Option Price Floor */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-extrabold text-stone-100 text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span>CBOT Put Option (Price Floor)</span>
                  </h4>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                    Downside Hedge
                  </span>
                </div>
                <p className="text-xs text-stone-400 mb-5 leading-relaxed">
                  Purchase Chicago Board of Trade Put options. Sets an unyielding minimum price floor while keeping 100% of the upside if open spot prices surge!
                </p>

                <div className="space-y-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Commodity Crop:
                    </label>
                    <select
                      value={putCropId}
                      onChange={(e) => setPutCropId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-blue-500"
                    >
                      {CROPS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name} (Spot: ${(c.baseSalePrice * (marketPriceModifiers[c.id] || 1.0)).toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Quantity to Protect (units):
                    </label>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={putQuantity}
                      onChange={(e) => setPutQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                      className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Strike Floor Tier:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: '90% Floor', mult: 0.9, color: 'text-stone-300' },
                        { label: '100% Floor', mult: 1.0, color: 'text-blue-400 font-bold' },
                        { label: '110% Floor', mult: 1.1, color: 'text-emerald-400 font-bold' },
                      ].map((tier) => (
                        <button
                          key={tier.mult}
                          onClick={() => setPutStrikeMultiplier(tier.mult)}
                          className={`p-2 rounded-lg border text-center text-xs transition cursor-pointer ${
                            putStrikeMultiplier === tier.mult
                              ? 'bg-blue-950/80 border-blue-500 text-blue-200 ring-1 ring-blue-500'
                              : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <div className={tier.color}>{tier.label}</div>
                          <div className="font-mono text-[10px] text-stone-400">
                            ${(selectedPutCrop.baseSalePrice * tier.mult).toFixed(2)}/bu
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-900/80 rounded-lg border border-stone-800 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Strike Price Floor:</span>
                      <span className="font-mono font-bold text-blue-400">${calculatedStrike.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Current Spot Price:</span>
                      <span className="font-mono text-stone-300">${currentSpotPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Option Premium Due:</span>
                      <span className="font-mono font-bold text-amber-400">${calculatedPremium.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => buyPutOptionFloor(putCropId, putQuantity, calculatedStrike, calculatedPremium)}
                disabled={cash < calculatedPremium}
                className={`mt-5 w-full py-3 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 ${
                  cash >= calculatedPremium
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-stone-950 cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {cash >= calculatedPremium
                    ? `Purchase Put Floor ($${calculatedPremium.toLocaleString()})`
                    : 'Insufficient Cash for Premium'}
                </span>
              </button>
            </div>
          </div>

          {/* Active Forward Contracts Portfolio */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h4 className="text-base font-bold text-stone-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Active Forward Delivery Contracts</span>
            </h4>

            {forwardContracts.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No forward contracts currently signed.</p>
            ) : (
              <div className="space-y-3">
                {forwardContracts.map((c) => {
                  const crop = CROPS.find((cr) => cr.id === c.cropId);
                  const item = inventory.find((i) => i.cropId === c.cropId);
                  const availableUnits = item ? item.quantity : 0;
                  const remainingNeeded = c.bushelsTarget - c.fulfilledBushels;
                  const deliverVal = forwardDeliverQty[c.id] || Math.min(availableUnits, remainingNeeded);

                  return (
                    <div
                      key={c.id}
                      className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{crop?.icon || '🌾'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-stone-100 text-sm">{c.cropName} Forward Contract</h5>
                            {c.isFulfilled ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                                Satisfied ✓
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                                Due {c.deadlineSeason} Y{c.deadlineYear}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Locked Price: <span className="font-mono text-emerald-400 font-bold">${c.lockedPricePerUnit.toFixed(2)}/bu</span> | Delivered:{' '}
                            <span className="font-mono text-stone-200">{c.fulfilledBushels} / {c.bushelsTarget} bu</span>
                          </p>
                          <div className="w-48 bg-stone-900 h-1.5 rounded-full overflow-hidden mt-1 border border-stone-800">
                            <div
                              className="bg-emerald-500 h-full transition-all"
                              style={{ width: `${Math.min(100, (c.fulfilledBushels / c.bushelsTarget) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {!c.isFulfilled && (
                        <div className="flex items-center gap-2">
                          <div className="text-right text-[11px] text-stone-400 mr-2">
                            <span>Barn Stock: {availableUnits}</span>
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={Math.min(availableUnits, remainingNeeded)}
                            value={deliverVal}
                            onChange={(e) =>
                              setForwardDeliverQty((prev) => ({
                                ...prev,
                                [c.id]: Math.max(1, parseInt(e.target.value) || 1),
                              }))
                            }
                            className="w-20 px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs"
                          />
                          <button
                            onClick={() => fulfillForwardContract(c.id, deliverVal)}
                            disabled={availableUnits <= 0}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition shadow ${
                              availableUnits > 0
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 cursor-pointer'
                                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                            }`}
                          >
                            Deliver
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Put Options Portfolio */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h4 className="text-base font-bold text-stone-100 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>CBOT Put Options Portfolio</span>
            </h4>

            {putOptions.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No active Put Option hedging contracts.</p>
            ) : (
              <div className="space-y-3">
                {putOptions.map((opt) => {
                  const crop = CROPS.find((cr) => cr.id === opt.cropId);
                  const spot = crop ? crop.baseSalePrice * (marketPriceModifiers[opt.cropId] || 1.0) : opt.strikePrice;
                  const inTheMoney = spot < opt.strikePrice;
                  const estimatedPayout = inTheMoney ? Number(((opt.strikePrice - spot) * opt.quantity).toFixed(2)) : 0;

                  return (
                    <div
                      key={opt.id}
                      className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{crop?.icon || '📈'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-stone-100 text-sm">{opt.cropName} Put Floor</h5>
                            {opt.isExercised ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-800 text-stone-400">
                                Exercised / Expired
                              </span>
                            ) : inTheMoney ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 animate-pulse">
                                ★ In The Money (+${estimatedPayout.toLocaleString()})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                                Active Floor Protection
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Strike Floor: <span className="font-mono text-blue-400 font-bold">${opt.strikePrice.toFixed(2)}</span> | Current Spot:{' '}
                            <span className="font-mono text-stone-200">${spot.toFixed(2)}</span> | Protected Qty: {opt.quantity} units
                          </p>
                        </div>
                      </div>

                      {!opt.isExercised && inTheMoney && (
                        <button
                          onClick={() => exercisePutOption(opt.id)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-bold text-xs shadow transition cursor-pointer"
                        >
                          Exercise Floor (+${estimatedPayout.toLocaleString()})
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* USDA POLICY & FSA PROGRAMS TAB */}
      {activeMarketTab === 'usda' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950/60 to-stone-900 border border-blue-800/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <Landmark className="w-8 h-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold text-stone-100">USDA Farm Service Agency (FSA) Center</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Federal conservation cost-share grants, Conservation Reserve Program (CRP) soil bank acreage, and winter prepay input subsidies.
                </p>
              </div>
            </div>
          </div>

          {/* 1. EQIP Grant Card */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-400 border border-blue-800">
                  USDA NRCS Program
                </span>
                <span className="text-xs font-mono text-stone-400">Grant Value: $15,000 Direct CapEx</span>
              </div>
              <h4 className="text-lg font-bold text-stone-100">Environmental Quality Incentives Program (EQIP)</h4>
              <p className="text-xs text-stone-400 max-w-xl">
                Provides financial cost-share assistance to agricultural producers who implement conservation practices such as drip irrigation, cover cropping, and nutrient stewardship.
              </p>
              <div className="text-xs font-mono text-stone-300 pt-1">
                Requirement: Farm must operate <span className="text-amber-400 font-bold">15+ acres</span> (Current: {totalFarmAcres} acres)
              </div>
            </div>

            <button
              onClick={applyForUsdaEqipGrant}
              disabled={usdaPrograms.hasEqipGrant || totalFarmAcres < 15}
              className={`w-full md:w-auto px-6 py-3.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 shrink-0 ${
                usdaPrograms.hasEqipGrant
                  ? 'bg-stone-800 text-emerald-400 border border-emerald-800/40 cursor-default'
                  : totalFarmAcres >= 15
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-stone-950 cursor-pointer'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>
                {usdaPrograms.hasEqipGrant
                  ? 'Grant Approved & Disbursed ✓'
                  : totalFarmAcres >= 15
                  ? 'Claim $15,000 EQIP Grant'
                  : `Need ${15 - totalFarmAcres} More Acres`}
              </span>
            </button>
          </div>

          {/* 2. CRP Acreage Grid */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <span>Conservation Reserve Program (CRP) 10-Year Soil Bank</span>
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  Enrolling fallow or fragile fields earns <span className="text-emerald-400 font-bold">${usdaPrograms.crpAnnualRentPerAcre}/acre/yr</span> paid on Day 360 while naturally restoring +10 Soil Tilth and +15 Organic Nitrogen.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-stone-950 border border-stone-800 text-right">
                <span className="text-[10px] text-stone-400 block">Active CRP Acreage</span>
                <span className="font-mono font-bold text-emerald-400 text-xs">
                  {fields.filter((f) => usdaPrograms.enrolledCrpFieldIds.includes(f.id)).reduce((s, f) => s + f.acres, 0)} ac enrolled
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((f) => {
                const isEnrolled = usdaPrograms.enrolledCrpFieldIds.includes(f.id);
                const annualRent = f.acres * usdaPrograms.crpAnnualRentPerAcre;

                return (
                  <div
                    key={f.id}
                    className={`p-4 rounded-xl border transition flex items-center justify-between ${
                      isEnrolled
                        ? 'bg-emerald-950/30 border-emerald-700/60 ring-1 ring-emerald-600/30'
                        : 'bg-stone-950 border-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-stone-100 text-sm">{f.name}</h5>
                        <span className="text-[10px] text-stone-400 font-mono">({f.acres} ac)</span>
                      </div>
                      <p className="text-xs text-stone-400 mt-1">
                        Soil Tilth: <span className="text-emerald-400 font-bold">{f.soilQuality}%</span> | Compaction:{' '}
                        <span className="text-stone-300">{f.compactionLevel || 0}%</span>
                      </p>
                      {isEnrolled ? (
                        <p className="text-xs text-emerald-400 font-bold mt-1">
                          🌾 Earning ${annualRent.toLocaleString()}/yr CRP Rent (Day 360)
                        </p>
                      ) : f.status !== 'empty' ? (
                        <p className="text-[11px] text-amber-400 italic mt-1">
                          Field has active crop (harvest first to enroll)
                        </p>
                      ) : (
                        <p className="text-[11px] text-stone-400 mt-1">
                          Eligible for ${annualRent.toLocaleString()}/yr rental check
                        </p>
                      )}
                    </div>

                    <div>
                      {isEnrolled ? (
                        <button
                          onClick={() => withdrawFieldFromCrp(f.id)}
                          className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition cursor-pointer"
                        >
                          Withdraw
                        </button>
                      ) : (
                        <button
                          onClick={() => enrollFieldInCrp(f.id)}
                          disabled={f.status !== 'empty'}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition shadow ${
                            f.status === 'empty'
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 cursor-pointer'
                              : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                          }`}
                        >
                          Enroll in CRP
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Winter Bulk Prepay Input Discounts */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-stone-100 flex items-center gap-2">
                  <Fuel className="w-5 h-5 text-amber-500" />
                  <span>Winter Bulk Input Prepay Discount (25% Off-Season)</span>
                </h4>
                <p className="text-xs text-stone-400 mt-1">
                  During Winter, agricultural distributors provide early cash prepayment discounts on bulk fuel and fertilizers.
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  season === 'Winter'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-stone-800 text-stone-400'
                }`}
              >
                {season === 'Winter' ? '❄️ Prepay Window Open' : 'Window Closed (Winter Only)'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Diesel */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-stone-100 text-sm flex items-center gap-2">
                      <span>🛢️</span> Off-Road Red Diesel (500 Gal)
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                      Save $475
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Bulk off-road diesel delivery. Fuels and restores +20% operating condition to all machinery in your fleet.
                  </p>
                  <div className="mt-3 p-2.5 rounded-lg bg-stone-900 text-xs font-mono flex justify-between">
                    <span className="text-stone-400">Discounted Price:</span>
                    <span className="text-emerald-400 font-bold">$1,425 ($2.85/gal vs $3.80)</span>
                  </div>
                </div>

                <button
                  onClick={() => buyBulkInputsWinterDiscount('diesel', 500)}
                  disabled={season !== 'Winter' || cash < 1425}
                  className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition shadow ${
                    season === 'Winter' && cash >= 1425
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {season !== 'Winter'
                    ? 'Available Only in Winter'
                    : cash < 1425
                    ? 'Insufficient Cash ($1,425)'
                    : 'Prepay 500 Gal Diesel ($1,425)'}
                </button>
              </div>

              {/* Nitrogen */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-stone-100 text-sm flex items-center gap-2">
                      <span>🧪</span> Urea Nitrogen 46-0-0 (200 Units)
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                      Save $2,000
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Bulk granular urea nitrogen fertilizer. Directly boosts nitrogen levels across all your farm parcels before spring planting.
                  </p>
                  <div className="mt-3 p-2.5 rounded-lg bg-stone-900 text-xs font-mono flex justify-between">
                    <span className="text-stone-400">Discounted Price:</span>
                    <span className="text-emerald-400 font-bold">$6,000 ($30/unit vs $40)</span>
                  </div>
                </div>

                <button
                  onClick={() => buyBulkInputsWinterDiscount('nitrogen', 200)}
                  disabled={season !== 'Winter' || cash < 6000}
                  className={`mt-4 w-full py-2.5 rounded-xl font-bold text-xs transition shadow ${
                    season === 'Winter' && cash >= 6000
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {season !== 'Winter'
                    ? 'Available Only in Winter'
                    : cash < 6000
                    ? 'Insufficient Cash ($6,000)'
                    : 'Prepay 200 Units Urea ($6,000)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
