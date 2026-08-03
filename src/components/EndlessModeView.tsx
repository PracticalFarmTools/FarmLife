import React from 'react';
import { useGameStore } from '../store/gameStore';
import { AUTOMATION_TECH_TREE, REAL_ESTATE_MARKET_SETTINGS, MACRO_CLIMATE_EVENTS } from '../data/endgame';
import {
  Building2,
  Bot,
  Flame,
  Globe,
} from 'lucide-react';

export const EndlessModeView: React.FC = () => {
  const {
    cash,
    year,
    buyNeighborAiFarm,
    buyAutonomousDroneTractor,
  } = useGameStore();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
          <Globe className="w-7 h-7 text-amber-500" />
          <span>Endless Mode: Automation Tech Tree, Real Estate & Macro Climate</span>
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Invest millions in CapEx automation (Tiers 1–4), buy bankrupt corporate parcels, and adapt to decadal climate shifts.
        </p>
      </div>

      {/* Automation Tech Tree (4 Tiers) */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <span>Automation Tech Tree (CapEx Investments)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {AUTOMATION_TECH_TREE.map((tech) => (
            <div
              key={tech.id}
              className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-purple-950 text-purple-300 border-purple-800 uppercase">
                    Tier {tech.tier} Tech
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    ${tech.capExCost.toLocaleString()} CapEx
                  </span>
                </div>

                <h4 className="font-extrabold text-stone-100 text-base">{tech.name}</h4>
                <p className="text-xs text-stone-400 mt-1">{tech.description}</p>

                <div className="my-3 space-y-1 text-xs font-mono text-stone-300">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Daily License Fee:</span>
                    <strong className="text-amber-400">${tech.dailySoftwareLicenseCost}/day</strong>
                  </div>
                  {tech.laborReplacedCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">Labor Replaced:</span>
                      <strong className="text-purple-400">{tech.laborReplacedCount} Workers</strong>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={buyAutonomousDroneTractor}
                disabled={cash < tech.capExCost}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                  cash >= tech.capExCost
                    ? 'bg-purple-600 hover:bg-purple-500 text-stone-950'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                Acquire Tech (${tech.capExCost.toLocaleString()})
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Real Estate Market (Neighbor Auctions) */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <span>Real Estate Market & Parcel Auctions</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REAL_ESTATE_MARKET_SETTINGS.plot_types_for_auction.map((plot) => (
            <div
              key={plot.id}
              className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-950 text-emerald-300 border-emerald-800 uppercase">
                    {plot.acres} Acres
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    Starting Bid: ${plot.baseAuctionStartingBid.toLocaleString()}
                  </span>
                </div>

                <h4 className="font-extrabold text-stone-100 text-base">{plot.name}</h4>
                <p className="text-xs text-stone-400 mt-1">{plot.description}</p>
              </div>

              <button
                onClick={() => buyNeighborAiFarm(plot.id)}
                disabled={cash < plot.baseAuctionStartingBid}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                  cash >= plot.baseAuctionStartingBid
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                Bid at Auction (${plot.baseAuctionStartingBid.toLocaleString()})
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Macro Climate Events Monitor */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <span>Macro Climate Events & Decadal Shift Monitor</span>
        </h3>

        <div className="space-y-3">
          {MACRO_CLIMATE_EVENTS.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-stone-200 text-sm">{event.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono font-bold border border-amber-800">
                    Triggers Year {event.triggerYear} (Current: Year {year})
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1">{event.description}</p>
              </div>

              <div className="text-right text-xs font-mono font-bold">
                <span className={year >= event.triggerYear ? 'text-rose-400' : 'text-stone-500'}>
                  {year >= event.triggerYear ? '⚡ ACTIVE SHIFT' : 'Plausible'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
