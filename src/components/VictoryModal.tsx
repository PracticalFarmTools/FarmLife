import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../store/gameStore';
import { CAMPAIGN_SCENARIOS } from '../data/scenarios';
import {
  Trophy,
  Sparkles,
  TrendingUp,
  DollarSign,
  Calendar,
  Sprout,
  Truck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

export const VictoryModal: React.FC = () => {
  const {
    isVictory,
    selectedScenario,
    cash,
    netWorth,
    year,
    season,
    dayOfYear,
    fields,
    fleet,
    dismissVictory,
    restartGame,
  } = useGameStore();

  useEffect(() => {
    if (isVictory) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
        });
      } catch {
        // Fallback if canvas context is restricted
      }
    }
  }, [isVictory]);

  if (!isVictory) return null;

  const scenario = CAMPAIGN_SCENARIOS.find((s) => s.id === selectedScenario) || CAMPAIGN_SCENARIOS[0];
  const totalAcres = fields.reduce((sum, f) => sum + f.acres, 0);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-stone-900 border-2 border-emerald-500/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Header */}
        <div className="bg-gradient-to-br from-emerald-900 via-stone-900 to-amber-950 p-6 sm:p-8 text-center border-b border-stone-800 relative">
          <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mb-3 shadow-lg">
            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 animate-bounce" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campaign Objective Achieved</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-stone-100 tracking-tight">
            VICTORY!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-400 font-semibold mt-1">
            {scenario.title}: {scenario.subtitle}
          </p>
        </div>

        {/* Scorecard Body */}
        <div className="p-5 sm:p-8 space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              <span className="font-bold text-emerald-300">Congratulations!</span> You successfully navigated volatile markets, crop biology, weather disruptions, and cold chain logistics to fulfill the campaign goal.
            </div>
          </div>

          {/* Vitals Scorecard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Net Worth</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-emerald-400">
                ${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Liquid Cash</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-stone-100">
                ${cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Timeline</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-stone-100">
                Y{year} {season} <span className="text-xs font-normal text-stone-400">(D{dayOfYear})</span>
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Acreage</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-stone-100">
                {totalAcres} Acres <span className="text-xs font-normal text-stone-400">({fields.length} plots)</span>
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 col-span-2 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <Truck className="w-3.5 h-3.5 text-purple-400" />
                <span>Equipment Fleet</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-stone-100">
                {fleet.length} Machines Active
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={dismissVictory}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>Continue in Endless Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={restartGame}
              className="py-3.5 px-5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-sm shadow flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Select New Campaign</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
