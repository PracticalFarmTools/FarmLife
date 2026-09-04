import React from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import { PRICING_STRATEGIES } from '../data/pricingStrategies';
import {
  Warehouse,
  PlusCircle,
  Box,
} from 'lucide-react';
import type { PricingStrategy } from '../types/game';

export const BarnView: React.FC = () => {
  const {
    inventory,
    barnCapacity,
    cash,
    storageFacility,
    upgradeBarn,
    setPricingStrategy,
    buildHydrocooler,
    buildColdStorage,
    installBackupGenerator,
    upgradePackingLine,
    hydrocoolInventoryItem,
  } = useGameStore();

  const totalQuantity = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const capacityPct = Math.min(100, Math.round((totalQuantity / barnCapacity) * 100));

  return (
    <div className="space-y-6">
      {/* Header & Barn Capacity Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Warehouse className="w-7 h-7 text-blue-400" />
            <span>Barn Storage, Cold Chain & Logistics</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Manage crop stockpiles, hydrocooling, cold storage temperature, packing lines, and retail pricing strategies.
          </p>
        </div>

        <button
          onClick={upgradeBarn}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-stone-950 font-bold text-sm shadow-lg transition cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Expand Capacity (+4,000 units) - $8,000</span>
        </button>
      </div>

      {/* Storage Capacity Gauge Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex justify-between items-center text-sm font-mono font-bold">
          <span className="text-stone-300">Total Barn Stockpile:</span>
          <span className="text-blue-400">
            {Math.round(totalQuantity).toLocaleString()} / {barnCapacity.toLocaleString()} units ({capacityPct}%)
          </span>
        </div>
        <div className="w-full bg-stone-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              capacityPct > 90 ? 'bg-rose-500' : capacityPct > 70 ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${capacityPct}%` }}
          />
        </div>
      </div>

      {/* Cold Chain Facilities Infrastructure Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hydrocooler */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🧊</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                  storageFacility.hasHydrocooler
                    ? 'bg-blue-950 text-blue-300 border-blue-800'
                    : 'bg-stone-950 text-stone-500 border-stone-800'
                }`}
              >
                {storageFacility.hasHydrocooler ? 'Active' : 'Unbuilt'}
              </span>
            </div>
            <h3 className="font-extrabold text-stone-100 text-base">Commercial Hydrocooler</h3>
            <p className="text-xs text-stone-400 mt-1">
              Strips Field Heat immediately post-harvest with ice water. Doubles crop shelf life ($22,000 CapEx).
            </p>
          </div>

          {!storageFacility.hasHydrocooler ? (
            <button
              onClick={buildHydrocooler}
              disabled={cash < 22000}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                cash >= 22000 ? 'bg-blue-600 hover:bg-blue-500 text-stone-950' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              Build Hydrocooler ($22,000)
            </button>
          ) : (
            <div className="mt-4 p-2 bg-blue-950/60 border border-blue-800 rounded-xl text-center text-xs font-bold text-blue-300">
              ✓ Field Heat Removal Active
            </div>
          )}
        </div>

        {/* Cold Storage Warehouse */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">❄️</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                  storageFacility.hasColdStorage
                    ? storageFacility.isPowerOutage
                      ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                      : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    : 'bg-stone-950 text-stone-500 border-stone-800'
                }`}
              >
                {storageFacility.hasColdStorage
                  ? storageFacility.isPowerOutage
                    ? 'Blackout Spike!'
                    : `34°F Active`
                  : 'Unbuilt'}
              </span>
            </div>
            <h3 className="font-extrabold text-stone-100 text-base">Refrigerated Cold Storage</h3>
            <p className="text-xs text-stone-400 mt-1">
              Freezes perishable spoilage timer by 80% ($35,000 CapEx, $150/day electricity bill).
            </p>
          </div>

          {!storageFacility.hasColdStorage ? (
            <button
              onClick={buildColdStorage}
              disabled={cash < 35000}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                cash >= 35000 ? 'bg-cyan-600 hover:bg-cyan-500 text-stone-950' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              Build Cold Storage ($35,000)
            </button>
          ) : (
            <div className="mt-4 p-2 bg-cyan-950/60 border border-cyan-800 rounded-xl text-center text-xs font-bold text-cyan-300">
              ✓ Climate Controlled at {storageFacility.coldStorageTemp}°F
            </div>
          )}
        </div>

        {/* Backup Generator */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">⚡</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                  storageFacility.hasBackupGenerator
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-stone-950 text-stone-500 border-stone-800'
                }`}
              >
                {storageFacility.hasBackupGenerator ? 'Protected' : 'Unprotected'}
              </span>
            </div>
            <h3 className="font-extrabold text-stone-100 text-base">Backup Diesel Generator</h3>
            <p className="text-xs text-stone-400 mt-1">
              Protects Cold Storage from storm power blackouts ($8,000 CapEx).
            </p>
          </div>

          {!storageFacility.hasBackupGenerator ? (
            <button
              onClick={installBackupGenerator}
              disabled={cash < 8000}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                cash >= 8000 ? 'bg-amber-600 hover:bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              Install Generator ($8,000)
            </button>
          ) : (
            <div className="mt-4 p-2 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center text-xs font-bold text-emerald-300">
              ✓ Blackout Protection Ready
            </div>
          )}
        </div>
      </div>

      {/* Processing & Packing House Lines */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
          <Box className="w-5 h-5 text-amber-500" />
          <span>Processing & Packing House Line</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-stone-200 text-sm">Manual Packing Shed</h4>
              <p className="text-xs text-stone-400">Manual labor sorting table ($6,000 CapEx).</p>
            </div>
            <button
              disabled={storageFacility.packingLine !== 'none'}
              onClick={() => upgradePackingLine('manual_shed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                storageFacility.packingLine === 'manual_shed' || storageFacility.packingLine === 'automated_optical'
                  ? 'bg-stone-800 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
              }`}
            >
              {storageFacility.packingLine !== 'none' ? '✓ Unlocked' : 'Build ($6,000)'}
            </button>
          </div>

          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-stone-200 text-sm">Automated Optical Laser Line</h4>
              <p className="text-xs text-stone-400">5x throughput & Grade A guaranteed packing ($65,000 CapEx).</p>
            </div>
            <button
              disabled={storageFacility.packingLine === 'automated_optical'}
              onClick={() => upgradePackingLine('automated_optical')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                storageFacility.packingLine === 'automated_optical'
                  ? 'bg-stone-800 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
              }`}
            >
              {storageFacility.packingLine === 'automated_optical' ? '✓ Unlocked' : 'Build ($65,000)'}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Stockpile Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-stone-100">Stockpile Inventory ({inventory.length} crop types)</h3>

        {inventory.length === 0 ? (
          <p className="text-xs text-stone-400 italic">No crops stored in the barn right now.</p>
        ) : (
          <div className="divide-y divide-stone-800">
            {inventory.map((item) => {
              const crop = CROPS.find((c) => c.id === item.cropId);
              if (!crop) return null;

              const remainingDays = Math.max(0, crop.spoilageDays - item.daysInStorage);

              return (
                <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-100 text-base">{crop.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-800">
                          Grade {item.grade}
                        </span>
                        {item.isHydrocooled && (
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-800">
                            ❄️ Hydrocooled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Quantity: <strong className="text-stone-200 font-mono">{Math.round(item.quantity)} units</strong> |
                        Quality Grade: <strong className="text-emerald-400 font-mono">{item.quality}%</strong>
                      </p>
                    </div>
                  </div>

                  {/* Pricing Strategy Selector & Spoilage Meter */}
                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs font-mono">
                      <span className="text-stone-400 block">Shelf Life Remaining</span>
                      <span className={`font-bold ${remainingDays < 3 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {remainingDays} days left
                      </span>
                    </div>

                    {/* Hydrocool Button if Hydrocooler is active & item not hydrocooled */}
                    {storageFacility.hasHydrocooler && !item.isHydrocooled && (
                      <button
                        onClick={() => hydrocoolInventoryItem(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-stone-950 font-bold text-xs shadow transition whitespace-nowrap"
                      >
                        Ice Hydrocool
                      </button>
                    )}

                    <select
                      value={item.pricingStrategy}
                      onChange={(e) => setPricingStrategy(item.cropId, e.target.value as PricingStrategy)}
                      className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-bold"
                    >
                      {PRICING_STRATEGIES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label} ({s.markupPct > 0 ? `+${s.markupPct}%` : `${s.markupPct}%`})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
