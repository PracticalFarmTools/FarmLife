import React from 'react';
import { useGameStore } from '../store/gameStore';
import {
  AlertOctagon,
  TrendingDown,
  DollarSign,
  Calendar,
  RotateCcw,
  Landmark,
  ShieldAlert,
} from 'lucide-react';

export const GameOverModal: React.FC = () => {
  const {
    isGameOver,
    gameOverReason,
    cash,
    netWorth,
    year,
    season,
    dayOfYear,
    fields,
    operatingLoan,
    mortgages,
    restartGame,
  } = useGameStore();

  if (!isGameOver) return null;

  const totalDebt = (operatingLoan ? operatingLoan.principal : 0) +
    mortgages.reduce((sum, m) => sum + m.principalRemaining, 0);
  const totalAcres = fields.reduce((sum, f) => sum + f.acres, 0);

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="max-w-2xl w-full bg-stone-900 border-2 border-rose-600/80 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Banner Header */}
        <div className="bg-gradient-to-br from-rose-950 via-stone-900 to-stone-950 p-6 sm:p-8 text-center border-b border-stone-800 relative">
          <div className="inline-flex p-3 sm:p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mb-3 shadow-lg">
            <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Landmark className="w-3.5 h-3.5" />
            <span>Bank Receivership & Foreclosure</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-stone-100 tracking-tight">
            FARM INSOLVENCY
          </h1>
          <p className="text-xs sm:text-sm text-rose-400 font-semibold mt-1">
            Operation Terminated under Chapter 12 Liquidation
          </p>
        </div>

        {/* Autopsy Report Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {/* Autopsy Alert Banner */}
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-rose-200 leading-relaxed">
              <strong className="text-rose-100 block mb-1">Financial Autopsy Findings:</strong>
              {gameOverReason ||
                'Working capital deficit reached unrecoverable debt limits. Creditors declared an immediate freeze on farm operations and initiated public liquidation auctions.'}
            </div>
          </div>

          {/* Bankruptcy Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <DollarSign className="w-3.5 h-3.5 text-rose-400" />
                <span>Final Cash Deficit</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-rose-400">
                ${cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Unpaid Liabilities</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-amber-400">
                ${totalDebt.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>Survival Timeline</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-stone-100">
                Y{year} {season} <span className="text-xs font-normal text-stone-400">(D{dayOfYear})</span>
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <Landmark className="w-3.5 h-3.5 text-stone-400" />
                <span>Acreage Liquidated</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-stone-100">
                {totalAcres} Acres
              </p>
            </div>

            <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 col-span-2 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                <span>Net Liquidation Value</span>
              </div>
              <p className="text-lg font-extrabold font-mono text-stone-300">
                ${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={restartGame}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              <span>File Chapter 12 Reorganization & Restart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
