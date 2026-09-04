import React from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
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
  Calendar,
  Sparkles,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import type { WeatherType } from '../types/game';

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
    barnCapacity,
    farmstandLevel,
    setActiveTab,
  } = useGameStore();

  const totalStored = inventory.reduce((acc, item) => acc + item.quantity, 0);

  const getFieldStatusDot = (f: (typeof fields)[0]) => {
    if (f.activeDiseases.length > 0) {
      return { label: 'Critical Disease', color: 'bg-rose-500 ring-rose-900', badge: 'bg-rose-950 text-rose-300 border-rose-800' };
    }
    if (f.soil.nitrogen < 30 || f.moistureLevel < 25 || f.moistureLevel > 85) {
      return { label: 'Needs Attention', color: 'bg-amber-500 ring-amber-900', badge: 'bg-amber-950 text-amber-300 border-amber-800' };
    }
    return { label: 'Optimal', color: 'bg-emerald-500 ring-emerald-900', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
  };

  const distressedFields = fields.filter((f) => getFieldStatusDot(f).label !== 'Optimal');

  const getWeatherIcon = (w: WeatherType) => {
    switch (w) {
      case 'Sunny':
        return <Sun className="w-5 h-5 text-amber-400" />;
      case 'Rainy':
        return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'Drought':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Storm':
        return <Zap className="w-5 h-5 text-purple-400" />;
      case 'Frost':
        return <Snowflake className="w-5 h-5 text-cyan-300" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Morning Briefing / Field Distress Banner */}
      {distressedFields.length > 0 && (
        <div className="bg-stone-900 border border-amber-500/80 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-amber-950 border border-amber-800 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-100 text-sm sm:text-base">Agronomy Morning Briefing</h3>
              <p className="text-xs text-stone-400 mt-0.5 sm:mt-1">
                {distressedFields.length} field plot(s) require attention ({distressedFields.map((f) => f.name).join(', ')}).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('fields')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow transition text-center shrink-0 cursor-pointer"
          >
            Inspect Fields
          </button>
        </div>
      )}

      {/* Top Banner & High-Level Summary Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Cash Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Available Cash</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
              ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-stone-500 mt-1">Liquid Working Capital</p>
          </div>
          <div className="p-3 sm:p-3.5 bg-emerald-950 border border-emerald-800/80 rounded-xl shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
        </div>

        {/* Net Worth Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Farm Valuation</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono mt-1">
              ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </h3>
            <p className="text-xs text-stone-500 mt-1">Total Assets & Equity</p>
          </div>
          <div className="p-3 sm:p-3.5 bg-amber-950 border border-amber-800/80 rounded-xl shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
        </div>

        {/* Barn Capacity Indicator */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Storage Capacity</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono mt-1">
              {Math.round(totalStored)} / {barnCapacity.toLocaleString()}{' '}
              <span className="text-xs font-sans text-stone-400">units</span>
            </h3>
            <p className="text-xs text-stone-500 mt-1">{inventory.length} Crop Varieties Stored</p>
          </div>
          <div className="p-3 sm:p-3.5 bg-blue-950 border border-blue-800/80 rounded-xl shrink-0">
            <Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>
        </div>

        {/* Field Plots Summary Indicator */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Field Plots</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-stone-100 font-mono mt-1">
              {fields.length} <span className="text-xs font-sans text-stone-400">Plots</span>
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-stone-400">{fields.filter((f) => getFieldStatusDot(f).label === 'Optimal').length} Optimal</span>
            </div>
          </div>
          <div className="p-3 sm:p-3.5 bg-emerald-950 border border-emerald-800/80 rounded-xl shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Aerial Farm Parcel Grid Map */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Aerial Farm Parcel Map</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Live tactical satellite overview of all active acreage, crops, and soil vitals.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('fields')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Manage All Fields</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {fields.map((field) => {
            const crop = CROPS.find((c) => c.id === field.currentCropId);
            const status = getFieldStatusDot(field);
            const isReady = field.status === 'ready';
            const isGrowing = field.status === 'growing';
            const growthPct = crop ? Math.min(100, Math.round((field.growthDays / crop.daysToMaturity) * 100)) : 0;

            return (
              <div
                key={field.id}
                onClick={() => setActiveTab('fields')}
                className={`group relative rounded-xl p-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[130px] overflow-hidden ${
                  field.activeDiseases.length > 0
                    ? 'bg-rose-950/40 border-rose-600/80 hover:border-rose-500'
                    : isReady
                    ? 'bg-amber-950/40 border-amber-500/80 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : isGrowing
                    ? 'bg-stone-950 border-emerald-800/60 hover:border-emerald-500'
                    : 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
                }`}
              >
                {/* Agricultural Furrow Background Grid Texture */}
                <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,#15803d,#15803d_2px,transparent_2px,transparent_14px)] pointer-events-none" />

                {/* Parcel Top Header */}
                <div className="relative z-10 flex items-start justify-between gap-1">
                  <div className="truncate">
                    <span className="font-extrabold text-xs text-stone-200 block truncate">{field.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">{field.acres} Ac • {field.soilType || 'Silt Loam'}</span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${status.color} ring-2 shrink-0 mt-0.5`} />
                </div>

                {/* Parcel Center Graphic */}
                <div className="relative z-10 my-2 flex items-center justify-center text-center">
                  {crop ? (
                    <div className="space-y-0.5">
                      <span className={`text-2xl block ${isReady ? 'animate-bounce' : ''}`}>{crop.icon}</span>
                      <span className="text-[10px] font-bold text-stone-300 truncate max-w-[100px] block mx-auto">
                        {crop.name}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-1 opacity-40">
                      <Sprout className="w-5 h-5 mx-auto text-stone-500 mb-0.5" />
                      <span className="text-[9px] text-stone-500 uppercase tracking-wider font-mono">Fallow</span>
                    </div>
                  )}
                </div>

                {/* Parcel Footer Indicator */}
                <div className="relative z-10 pt-1 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-blue-400 flex items-center gap-0.5">
                    💧{field.moistureLevel}%
                  </span>
                  {isReady ? (
                    <span className="font-extrabold text-amber-400 animate-pulse">READY</span>
                  ) : isGrowing ? (
                    <span className="font-bold text-emerald-400">{growthPct}%</span>
                  ) : (
                    <span className="text-stone-500">Empty</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Progressive Disclosure High-Level Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Field Status Overview Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-lg font-extrabold text-stone-100 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <span>Field Status Overview</span>
            </h3>
            <button
              onClick={() => setActiveTab('fields')}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Full Details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {fields.map((field) => {
              const status = getFieldStatusDot(field);
              return (
                <div
                  key={field.id}
                  onClick={() => setActiveTab('fields')}
                  className="p-4 bg-stone-950 border border-stone-800 rounded-xl hover:border-emerald-500/60 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${status.color} ring-4`} />
                    <div>
                      <h4 className="font-bold text-stone-200 text-sm">{field.name}</h4>
                      <p className="text-xs text-stone-400">{field.acres} Acres</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${status.badge}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5-Day Weather Forecast & Manager Shortcuts */}
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-stone-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>5-Day Weather Forecast</span>
            </h3>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center">
              {weatherForecast.map((f, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 sm:p-3 rounded-xl border flex flex-col items-center justify-between ${
                    idx === 0 ? 'bg-amber-950/60 border-amber-600' : 'bg-stone-950 border-stone-800'
                  }`}
                >
                  <span className="text-[9px] sm:text-[10px] font-mono text-stone-400">D{f.day}</span>
                  <div className="my-1">{getWeatherIcon(f.weather)}</div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-stone-300 truncate max-w-full">{f.weather}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Manager Shortcuts</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('fields')}
                className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500/60 transition text-center"
              >
                <Sprout className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-stone-200 block">Agronomy Fields</span>
              </button>

              <button
                onClick={() => setActiveTab('market')}
                className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/60 transition text-center"
              >
                <Store className="w-6 h-6 text-amber-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-stone-200 block">Farmstand Market</span>
                <span className="text-[10px] text-stone-500">Lvl {farmstandLevel}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Wholesale Contracts & Ledger Activity */}
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-extrabold text-stone-100 flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                <span>Wholesale Contracts ({season})</span>
              </h3>
              <button
                onClick={() => setActiveTab('market')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Market View</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {wholesaleContracts.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No wholesale contracts active.</p>
            ) : (
              <div className="space-y-3">
                {wholesaleContracts.slice(0, 3).map((contract) => (
                  <div key={contract.id} className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-200 text-xs">{contract.buyerName}</h4>
                      <p className="text-[11px] text-stone-400">{contract.cropName}</p>
                    </div>
                    <span className="font-mono font-bold text-xs text-emerald-400">
                      ${contract.contractPricePerUnit}/unit
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="text-lg font-extrabold text-stone-100 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>Recent Transactions</span>
              </h3>
              <button
                onClick={() => setActiveTab('ledger')}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Full Ledger</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {ledger.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No recent transactions.</p>
            ) : (
              <div className="space-y-2.5">
                {ledger.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="flex justify-between items-center text-xs">
                    <span className="text-stone-400 truncate max-w-[180px]">{entry.description}</span>
                    <span className={`font-mono font-bold ${entry.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {entry.amount >= 0 ? '+' : ''}${entry.amount.toLocaleString()}
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
