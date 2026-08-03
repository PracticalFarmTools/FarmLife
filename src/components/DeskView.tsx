import React from 'react';
import { useGameStore } from '../store/gameStore';
import {
  DollarSign,
  TrendingUp,
  Warehouse,
  Sprout,
  Sun,
  CloudRain,
  Flame,
  Zap,
  Snowflake,
  ArrowUpRight,
  Store,
  Receipt,
  CheckCircle2,
  Calendar,
  PlusCircle,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import type { WeatherType } from '../types/game';
import { CROPS } from '../data/crops';

export const DeskView: React.FC = () => {
  const {
    cash,
    netWorth,
    season,
    weatherForecast,
    fields,
    inventory,
    wholesaleContracts,
    ledger,
    selectedRegion,
    barnCapacity,
    farmstandLevel,
    setActiveTab,
    buyLand,
  } = useGameStore();

  const totalStored = inventory.reduce((acc, item) => acc + item.quantity, 0);
  const readyFields = fields.filter((f) => f.status === 'ready').length;
  const emptyFields = fields.filter((f) => f.status === 'empty').length;
  const distressedFields = fields.filter(
    (f) => f.activeDiseases.length > 0 || f.soil.nitrogen < 30 || f.moistureLevel < 25 || f.moistureLevel > 85
  );

  const getWeatherIcon = (w: WeatherType, size = 'w-6 h-6') => {
    switch (w) {
      case 'Sunny':
        return <Sun className={`${size} text-amber-400 animate-spin-slow`} />;
      case 'Rainy':
        return <CloudRain className={`${size} text-blue-400`} />;
      case 'Drought':
        return <Flame className={`${size} text-orange-500`} />;
      case 'Storm':
        return <Zap className={`${size} text-purple-400`} />;
      case 'Frost':
        return <Snowflake className={`${size} text-cyan-300`} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Morning Briefing / Field Distress Banner */}
      {distressedFields.length > 0 && (
        <div className="bg-amber-950/80 border border-amber-500/80 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-900/60 border border-amber-700 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-amber-200 text-base">Agronomy Morning Briefing: Field Distress Alert!</h3>
              <p className="text-xs text-amber-300/90 mt-0.5">
                {distressedFields.length} field plot(s) requiring immediate attention (Disease, Soil NPK lockout, or Moisture extreme).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('fields')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition whitespace-nowrap"
          >
            Inspect Fields
          </button>
        </div>
      )}

      {/* Top Banner & Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cash Card */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Available Cash</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-stone-400 mt-1">Liquid working capital</p>
          </div>
          <div className="p-3 bg-emerald-950/70 border border-emerald-800/60 rounded-xl">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Net Worth Card */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Farm Net Worth</p>
            <h3 className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-stone-400 mt-1">Assets & valuation</p>
          </div>
          <div className="p-3 bg-amber-950/70 border border-amber-800/60 rounded-xl">
            <TrendingUp className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        {/* Barn Capacity Card */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Barn Storage</p>
            <h3 className="text-2xl font-extrabold text-blue-400 font-mono mt-1">
              {Math.round(totalStored)} / {barnCapacity.toLocaleString()} <span className="text-sm">units</span>
            </h3>
            <div className="w-32 bg-stone-800 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all"
                style={{ width: `${Math.min(100, (totalStored / barnCapacity) * 100)}%` }}
              />
            </div>
          </div>
          <div className="p-3 bg-blue-950/70 border border-blue-800/60 rounded-xl">
            <Warehouse className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        {/* Active Fields Card */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Field Operations</p>
            <h3 className="text-2xl font-extrabold text-stone-100 font-mono mt-1">
              {fields.length} <span className="text-sm font-sans text-stone-400">Plots</span>
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs">
              {readyFields > 0 && (
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800">
                  {readyFields} Ready
                </span>
              )}
              {emptyFields > 0 && (
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold border border-amber-800">
                  {emptyFields} Empty
                </span>
              )}
            </div>
          </div>
          <div className="p-3 bg-emerald-950/70 border border-emerald-800/60 rounded-xl">
            <Sprout className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Center Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weather & Forecast */}
        <div className="space-y-6">
          {/* 5-Day Weather Forecast Widget */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>5-Day Meteorological Forecast</span>
            </h3>

            {/* Forecast Grid */}
            <div className="grid grid-cols-5 gap-2 text-center mb-4">
              {weatherForecast.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-between ${
                    idx === 0
                      ? 'bg-amber-950/50 border-amber-600 ring-1 ring-amber-500/50'
                      : 'bg-stone-950 border-stone-800'
                  }`}
                >
                  <span className="text-[10px] font-mono text-stone-400">Day {f.day}</span>
                  <div className="my-2">{getWeatherIcon(f.weather, 'w-5 h-5')}</div>
                  <span className="text-[10px] font-bold text-stone-200">{f.weather}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-400 italic">
              ★ <strong>Agronomy Tip:</strong> If heavy rain or storms are forecast, refrain from daily watering to prevent Phytophthora Late Blight & Root Rot!
            </p>
          </div>

          {/* Quick Manager Shortcuts */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Manager Shortcuts</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('fields')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500/60 hover:bg-stone-850 transition text-center group"
              >
                <Sprout className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-stone-200">Agronomy Fields</span>
                <span className="text-[10px] text-stone-400">{fields.length} plots</span>
              </button>

              <button
                onClick={() => setActiveTab('market')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/60 hover:bg-stone-850 transition text-center group"
              >
                <Store className="w-6 h-6 text-amber-400 mb-2 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-stone-200">Farmstand & Market</span>
                <span className="text-[10px] text-stone-400">Level {farmstandLevel} Stand</span>
              </button>

              <button
                onClick={() => setActiveTab('barn')}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-blue-500/60 hover:bg-stone-850 transition text-center group"
              >
                <Warehouse className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-stone-200">Barn Storage</span>
                <span className="text-[10px] text-stone-400">{inventory.length} crop types</span>
              </button>

              <button
                onClick={buyLand}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500/60 hover:bg-stone-850 transition text-center group"
              >
                <PlusCircle className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition" />
                <span className="text-xs font-bold text-stone-200">Buy 10 Acres</span>
                <span className="text-[10px] text-amber-400 font-mono">
                  ${selectedRegion?.baseLandCost ? (selectedRegion.baseLandCost * 10).toLocaleString() : 0}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle & Right Column: Active Contracts & Recent Financial Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seasonal Contracts Summary */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Wholesale Contracts ({season} locked rates)</span>
              </h3>
              <button
                onClick={() => setActiveTab('market')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Fulfill Contracts</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {wholesaleContracts.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No active wholesale contracts available right now.</p>
            ) : (
              <div className="space-y-3">
                {wholesaleContracts.slice(0, 3).map((contract) => {
                  const crop = CROPS.find((c) => c.id === contract.cropId);
                  const inventoryItem = inventory.find((i) => i.cropId === contract.cropId);
                  const inStock = inventoryItem ? inventoryItem.quantity : 0;

                  return (
                    <div
                      key={contract.id}
                      className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{crop?.icon || '📦'}</span>
                        <div>
                          <h4 className="font-bold text-stone-200 text-sm">{contract.buyerName}</h4>
                          <p className="text-xs text-stone-400">
                            {contract.cropName} @ <span className="text-emerald-400 font-mono font-bold">${contract.contractPricePerUnit}/unit</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {Math.round(contract.increaseChanceNextSeason * 100)}% Rate Increase Chance
                        </span>
                        <p className="text-xs text-stone-400 mt-1">In Stock: {inStock} units</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Financial Ledger Log Snippet */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                <span>Recent Financial Transactions</span>
              </h3>
              <button
                onClick={() => setActiveTab('ledger')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Full Ledger</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {ledger.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No ledger transactions logged yet.</p>
            ) : (
              <div className="divide-y divide-stone-800">
                {ledger.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-stone-400 text-[11px]">
                        Day {entry.day} ({entry.season})
                      </span>
                      <span className="text-stone-200 font-medium">{entry.description}</span>
                    </div>

                    <span
                      className={`font-mono font-bold ${
                        entry.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {entry.amount >= 0 ? '+' : ''}
                      ${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
