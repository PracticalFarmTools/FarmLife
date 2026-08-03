import React, { useState } from 'react';
import { REGIONS } from '../data/regions';
import { CAMPAIGN_SCENARIOS } from '../data/scenarios';
import { useGameStore } from '../store/gameStore';
import { Sprout, MapPin, DollarSign, Sparkles, Award, Compass } from 'lucide-react';
import type { ScenarioId } from '../types/game';

export const NewGameModal: React.FC = () => {
  const { gameStarted, selectRegion, selectScenario } = useGameStore();
  const [activeTabMode, setActiveTabMode] = useState<'campaigns' | 'sandbox'>('campaigns');

  if (gameStarted) return null;

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Tutorial':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'Medium':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'Hard':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Expert':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      default:
        return 'bg-stone-950 text-stone-400 border-stone-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-6xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-amber-950 p-8 text-center border-b border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Sprout className="w-64 h-64 text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AGRONOMICS SIMULATION ENGINE v2.0</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-stone-100 sm:text-5xl">
            AGRONOMICS
          </h1>
          <p className="mt-2 text-sm text-stone-300 max-w-2xl mx-auto">
            Choose a core campaign scenario or free-play region to begin your enterprise.
          </p>

          {/* Mode Switcher */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => setActiveTabMode('campaigns')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-2 ${
                activeTabMode === 'campaigns'
                  ? 'bg-amber-600 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Core Campaigns (6 Scenarios)</span>
            </button>

            <button
              onClick={() => setActiveTabMode('sandbox')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-2 ${
                activeTabMode === 'sandbox'
                  ? 'bg-amber-600 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Free-Play Region Sandbox</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTabMode === 'campaigns' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-stone-200 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Select Campaign Scenario</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CAMPAIGN_SCENARIOS.map((scen) => (
                  <div
                    key={scen.id}
                    className="bg-stone-950/70 border border-stone-800 hover:border-amber-500/60 rounded-xl p-6 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getDifficultyBadge(
                            scen.difficulty
                          )}`}
                        >
                          {scen.difficulty}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          ${scen.startingCash.toLocaleString()} Cash
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold text-stone-100 mb-1">{scen.title}</h3>
                      <p className="text-xs font-semibold text-amber-400/90 mb-2">{scen.subtitle}</p>
                      <p className="text-xs text-stone-400 leading-relaxed mb-4">{scen.description}</p>
                    </div>

                    <button
                      onClick={() => selectScenario(scen.id as ScenarioId)}
                      className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition flex items-center justify-center gap-2"
                    >
                      <span>Launch Campaign</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-stone-200 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-500" />
                <span>Select Free-Play Region</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {REGIONS.map((region) => (
                  <div
                    key={region.id}
                    className="bg-stone-950/70 border border-stone-800 hover:border-emerald-500/60 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Sprout className="w-6 h-6 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-amber-400">
                          ${region.baseLandCost.toLocaleString()} / Acre
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-stone-100 mb-1">{region.name}</h3>
                      <p className="text-xs text-stone-400 leading-relaxed mb-4">{region.description}</p>
                    </div>

                    <button
                      onClick={() => selectRegion(region.id)}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shadow transition flex items-center justify-center gap-2"
                    >
                      <span>Start Sandbox ($100k)</span>
                      <DollarSign className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
