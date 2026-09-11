import React from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import { PRICING_STRATEGIES } from '../data/pricingStrategies';
import {
  Warehouse,
  PlusCircle,
  Box,
  ShieldCheck,
  Droplets,
  AlertTriangle,
  Wind,
} from 'lucide-react';
import type { PricingStrategy } from '../types/game';

export const BarnView: React.FC = () => {
  const {
    inventory,
    barnCapacity,
    cash,
    storageFacility,
    dayOfYear,
    year,
    upgradeBarn,
    setPricingStrategy,
    buildHydrocooler,
    buildColdStorage,
    installBackupGenerator,
    upgradePackingLine,
    hydrocoolInventoryItem,
    installEthyleneScrubber,
    performGapWaterTest,
  } = useGameStore();

  const totalQuantity = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const capacityPct = Math.min(100, Math.round((totalQuantity / barnCapacity) * 100));

  // Ethylene Cross-Contamination calculation
  const hasEthyleneEmitters = inventory.some((item) => {
    const c = CROPS.find((cr) => cr.id === item.cropId);
    return c?.isEthyleneEmitter;
  });
  const hasEthyleneSensitive = inventory.some((item) => {
    const c = CROPS.find((cr) => cr.id === item.cropId);
    return c?.isEthyleneSensitive;
  });
  const ethyleneRiskActive = hasEthyleneEmitters && hasEthyleneSensitive && !storageFacility.hasEthyleneScrubber;

  // GAP water testing audit calculation (every 90 days)
  const daysSinceWaterTest =
    storageFacility.lastWaterTestDay !== null
      ? (year - (storageFacility.lastWaterTestYear || year)) * 365 + (dayOfYear - storageFacility.lastWaterTestDay)
      : null;
  const daysUntilGapAuditDue = daysSinceWaterTest !== null ? Math.max(0, 90 - daysSinceWaterTest) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Barn Capacity Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Warehouse className="w-7 h-7 text-blue-400" />
            <span>Barn Storage, Cold Chain & Food Safety</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Optical sorter grading lines, ethylene gas mitigation, cold chain preservation, and GAP agricultural water audits.
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

      {/* Ethylene Cross-Contamination Alert Banner */}
      {ethyleneRiskActive && (
        <div className="bg-rose-950/70 border border-rose-700/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-rose-200 text-sm">⚠️ High Ethylene Gas Contamination Risk!</h4>
              <p className="text-xs text-rose-300/90 mt-0.5 max-w-2xl">
                High-ethylene emitters (Apples, Tomatoes, Wine Grapes) are currently stored in proximity to sensitive crops (Romaine Lettuce, Strawberries). Spoilage rate is accelerated 3×! Install scrubbers immediately.
              </p>
            </div>
          </div>
          <button
            onClick={installEthyleneScrubber}
            disabled={cash < 3500}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap shadow cursor-pointer ${
              cash >= 3500
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            Install Scrubbers ($3,500)
          </button>
        </div>
      )}

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              Strips field heat immediately post-harvest with ice water deluge. Eliminates 50% accelerated field heat spoilage.
            </p>
          </div>

          {!storageFacility.hasHydrocooler ? (
            <button
              onClick={buildHydrocooler}
              disabled={cash < 22000}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                cash >= 22000 ? 'bg-blue-600 hover:bg-blue-500 text-stone-950 cursor-pointer' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
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
              Maintains 34°F cold chain. Suppresses microbial growth and slows daily spoilage decay by 80%.
            </p>
          </div>

          {!storageFacility.hasColdStorage ? (
            <button
              onClick={buildColdStorage}
              disabled={cash < 35000}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                cash >= 35000 ? 'bg-cyan-600 hover:bg-cyan-500 text-stone-950 cursor-pointer' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
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
              Auto-starts during severe storm grid outages. Prevents catastrophic cooler temperature spikes.
            </p>
          </div>

          {!storageFacility.hasBackupGenerator ? (
            <button
              onClick={installBackupGenerator}
              disabled={cash < 8000}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                cash >= 8000 ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
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

        {/* Ethylene Scrubber */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🍇</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                  storageFacility.hasEthyleneScrubber
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-stone-950 text-stone-500 border-stone-800'
                }`}
              >
                {storageFacility.hasEthyleneScrubber ? 'Scrubber Active' : 'Uninstalled'}
              </span>
            </div>
            <h3 className="font-extrabold text-stone-100 text-base flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-400" />
              <span>Ethylene Gas Scrubbers</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Potassium permanganate filter cartridges neutralize ethylene emissions from ripening fruits to protect tender leafy greens.
            </p>
          </div>

          {!storageFacility.hasEthyleneScrubber ? (
            <button
              onClick={installEthyleneScrubber}
              disabled={cash < 3500}
              className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                cash >= 3500 ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 cursor-pointer' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              Install Scrubbers ($3,500)
            </button>
          ) : (
            <div className="mt-4 p-2 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center text-xs font-bold text-emerald-300">
              ✓ Catalytic Ethylene Scrubbing Active
            </div>
          )}
        </div>

        {/* GAP Food Safety & Water Testing */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">💧</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${
                  storageFacility.isGapCertified
                    ? 'bg-blue-950 text-blue-300 border-blue-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}
              >
                {storageFacility.isGapCertified ? 'GAP Certified ✓' : 'Audit Needed'}
              </span>
            </div>
            <h3 className="font-extrabold text-stone-100 text-base flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>GAP Food Safety Water Audit</span>
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Quarterly E. coli & coliform well microbial testing. Unlocks +25% wholesale buyer premiums and shields from FDA recall penalties.
            </p>
            {storageFacility.isGapCertified && (
              <p className="text-[11px] font-mono text-emerald-400 mt-2">
                Certified Active ({daysUntilGapAuditDue} days until re-audit)
              </p>
            )}
          </div>

          <button
            onClick={performGapWaterTest}
            disabled={cash < 450}
            className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
              cash >= 450
                ? 'bg-blue-600 hover:bg-blue-500 text-stone-950 cursor-pointer'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 inline mr-1" />
            <span>Conduct Water Test ($450)</span>
          </button>
        </div>
      </div>

      {/* Processing & Packing House Lines */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-500" />
            <span>Post-Harvest Optical Sorter & Packing House Lines</span>
          </h3>
          <span className="text-xs text-stone-400 font-mono">
            Active Line:{' '}
            <strong className="text-amber-400">
              {storageFacility.packingLine === 'automated_optical'
                ? 'Optical Laser Line'
                : storageFacility.packingLine === 'manual_shed'
                ? 'Manual Shed'
                : 'Ungraded Field Run'}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Field Run */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              storageFacility.packingLine === 'none'
                ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/30'
                : 'bg-stone-950 border-stone-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-stone-200 text-sm">Ungraded Field Run</h4>
                <span className="text-[10px] text-stone-400">Baseline</span>
              </div>
              <p className="text-xs text-stone-400">Default field-run harvest without sorting equipment.</p>
              <div className="mt-3 text-xs font-mono space-y-1 text-stone-300">
                <div className="text-emerald-400">Grade A (Retail +40%): 20%</div>
                <div className="text-stone-300">Grade B (Standard): 50%</div>
                <div className="text-rose-400">Culls (-65% Discount): 30%</div>
              </div>
            </div>
            <div className="mt-4 text-center text-xs font-bold text-stone-500">
              {storageFacility.packingLine === 'none' ? '● Active Baseline' : 'Replaced'}
            </div>
          </div>

          {/* Manual Packing Shed */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              storageFacility.packingLine === 'manual_shed'
                ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/30'
                : 'bg-stone-950 border-stone-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-stone-200 text-sm">Manual Packing Shed</h4>
                <span className="text-[10px] text-amber-400 font-bold">$6,000 CapEx</span>
              </div>
              <p className="text-xs text-stone-400">Sorting conveyor table with seasonal manual packing labor.</p>
              <div className="mt-3 text-xs font-mono space-y-1 text-stone-300">
                <div className="text-emerald-400 font-bold">Grade A (Retail +40%): 45%</div>
                <div className="text-stone-300">Grade B (Standard): 40%</div>
                <div className="text-rose-400">Culls (-65% Discount): 15%</div>
              </div>
            </div>
            <button
              disabled={storageFacility.packingLine !== 'none'}
              onClick={() => upgradePackingLine('manual_shed')}
              className={`mt-4 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                storageFacility.packingLine === 'manual_shed' || storageFacility.packingLine === 'automated_optical'
                  ? 'bg-stone-800 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
              }`}
            >
              {storageFacility.packingLine !== 'none' ? '✓ Unlocked' : 'Build Shed ($6,000)'}
            </button>
          </div>

          {/* Automated Optical Laser */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between ${
              storageFacility.packingLine === 'automated_optical'
                ? 'bg-amber-950/30 border-amber-500/50 ring-1 ring-amber-500/30'
                : 'bg-stone-950 border-stone-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-stone-200 text-sm">Automated Optical Sorter</h4>
                <span className="text-[10px] text-emerald-400 font-bold">$65,000 CapEx</span>
              </div>
              <p className="text-xs text-stone-400">Multispectral laser camera sorts blemishes, sugar brix & density.</p>
              <div className="mt-3 text-xs font-mono space-y-1 text-stone-300">
                <div className="text-emerald-400 font-extrabold">Grade A (Retail +40%): 70%</div>
                <div className="text-stone-300">Grade B (Standard): 25%</div>
                <div className="text-rose-400">Culls (-65% Discount): 5%</div>
              </div>
            </div>
            <button
              disabled={storageFacility.packingLine === 'automated_optical'}
              onClick={() => upgradePackingLine('automated_optical')}
              className={`mt-4 py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                storageFacility.packingLine === 'automated_optical'
                  ? 'bg-stone-800 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
              }`}
            >
              {storageFacility.packingLine === 'automated_optical' ? '✓ Active Laser Line' : 'Install Laser ($65,000)'}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Stockpile Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-stone-100">Stockpile Inventory ({inventory.length} sorted batches)</h3>

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
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-stone-100 text-base">{crop.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            item.grade === 'A'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : item.grade === 'B'
                              ? 'bg-blue-950 text-blue-400 border-blue-800'
                              : 'bg-rose-950 text-rose-400 border-rose-800'
                          }`}
                        >
                          Grade {item.grade} {item.grade === 'A' ? '(+40% Retail)' : item.grade === 'B' ? '(Foodservice)' : '(Culls)'}
                        </span>
                        {item.isHydrocooled && (
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px] font-bold border border-blue-800">
                            ❄️ Hydrocooled
                          </span>
                        )}
                        {crop.isEthyleneEmitter && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 text-[9px] font-bold border border-amber-800">
                            Emitter 🍎
                          </span>
                        )}
                        {crop.isEthyleneSensitive && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 text-[9px] font-bold border border-purple-800">
                            Sensitive 🥬
                          </span>
                        )}
                        {item.isOrganic && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[9px] font-bold border border-emerald-800">
                            Organic 🌿
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
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-stone-950 font-bold text-xs shadow transition whitespace-nowrap cursor-pointer"
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
