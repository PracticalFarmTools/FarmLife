import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import {
  Landmark,
  ShieldCheck,
  Calculator,
  Flame,
  Lock,
} from 'lucide-react';
import type { InsuranceTier } from '../types/game';

export const BankView: React.FC = () => {
  const {
    cash,
    operatingLoan,
    fields,
    futuresContracts,
    getDailyBurnRate,
    takeOperatingLoan,
    repayOperatingLoan,
    purchaseCropInsurance,
    signFuturesContract,
  } = useGameStore();

  const [activeSubTab, setActiveSubTab] = useState<'loans' | 'insurance' | 'hedging' | 'stresstest'>('loans');
  const [stressPriceDropPct, setStressPriceDropPct] = useState<number>(20);
  const [selectedCropIdForFutures, setSelectedCropIdForFutures] = useState<string>(CROPS[0].id);

  const dailyBurn = getDailyBurnRate();

  const getInsuranceBadgeColor = (tier: InsuranceTier) => {
    switch (tier) {
      case 'catastrophic':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'premium':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      default:
        return 'bg-stone-950 text-stone-500 border-stone-800';
    }
  };

  const selectedCropForFutures = CROPS.find((c) => c.id === selectedCropIdForFutures) || CROPS[0];
  const lockedPrice = Number((selectedCropForFutures.baseSalePrice * 1.05).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Header & Burn Rate Meter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Landmark className="w-7 h-7 text-amber-500" />
            <span>Local Bank & Financial Risk Management</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Operating Loans, Crop Insurance policies, Commodity Futures Hedging, and Cash Flow Stress Testing.
          </p>
        </div>

        {/* Daily Burn Rate Gauge */}
        <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl flex items-center gap-3">
          <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-stone-400 block">Daily Cash Burn Rate</span>
            <span className="text-xl font-extrabold text-rose-400 font-mono">
              -${dailyBurn.toLocaleString()}/day
            </span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2 p-1 bg-stone-900 rounded-xl border border-stone-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('loans')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'loans'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🏦 Operating Loans
        </button>

        <button
          onClick={() => setActiveSubTab('insurance')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'insurance'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🛡️ Crop Insurance Safety Net
        </button>

        <button
          onClick={() => setActiveSubTab('hedging')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'hedging'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          📈 Commodity Futures ({futuresContracts.length})
        </button>

        <button
          onClick={() => setActiveSubTab('stresstest')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'stresstest'
              ? 'bg-amber-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🧮 Stress Test
        </button>
      </div>

      {/* OPERATING LOANS SUB-TAB */}
      {activeSubTab === 'loans' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-400" />
              <span>Spring Operating Credit Line</span>
            </h3>
            <p className="text-xs text-stone-400">
              Short-term seasonal working capital injection. Due in the Fall harvest. Unpaid loans rollover at a 18% penalty rate!
            </p>
          </div>

          {operatingLoan ? (
            <div className="bg-stone-900 border border-amber-600/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <span className="text-xs text-amber-400 font-mono font-bold uppercase block">Active Loan Balance</span>
                  <h4 className="text-3xl font-extrabold text-stone-100 font-mono mt-1">
                    ${operatingLoan.principal.toLocaleString()}{' '}
                    <span className="text-sm text-stone-400">({operatingLoan.interestRate * 100}% Interest)</span>
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-xs text-stone-400 block">Maturity Date</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    Due {operatingLoan.dueSeason} Year {operatingLoan.dueYear}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-400">
                  Total Repayment Amount Owed:{' '}
                  <strong className="text-emerald-400 font-mono">
                    ${Math.round(operatingLoan.principal * (1 + operatingLoan.interestRate)).toLocaleString()}
                  </strong>
                </p>

                <button
                  onClick={repayOperatingLoan}
                  disabled={cash < Math.round(operatingLoan.principal * (1 + operatingLoan.interestRate))}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition ${
                    cash >= Math.round(operatingLoan.principal * (1 + operatingLoan.interestRate))
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Pay Off Loan Early
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-stone-100 text-lg">$50,000 Standard Seasonal Loan</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Inject $50,000 cash at 8% interest rate ($54,000 due in Fall).
                  </p>
                </div>
                <button
                  onClick={() => takeOperatingLoan(50000)}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition"
                >
                  Apply & Draw $50,000 Credit
                </button>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-stone-100 text-lg">$100,000 Expansion Operating Loan</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Inject $100,000 cash at 8% interest rate ($108,000 due in Fall).
                  </p>
                </div>
                <button
                  onClick={() => takeOperatingLoan(100000)}
                  className="mt-6 w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition"
                >
                  Apply & Draw $100,000 Credit
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CROP INSURANCE SUB-TAB */}
      {activeSubTab === 'insurance' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Multi-Peril Crop Insurance Portal</span>
            </h3>
            <p className="text-xs text-stone-400">
              Protect field plots from storms, droughts, and disease outbreaks. Auto-indemnity check deposited upon disaster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div
                key={field.id}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-extrabold text-stone-100 text-base">{field.name}</h4>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getInsuranceBadgeColor(
                        field.insuranceTier
                      )}`}
                    >
                      {field.insuranceTier} Policy
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 font-mono mb-4">
                    Plot Size: {field.acres} Acres | Status: {field.status.toUpperCase()}
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => purchaseCropInsurance(field.id, 'none')}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition text-left flex justify-between ${
                      field.insuranceTier === 'none'
                        ? 'bg-stone-950 text-amber-400 border border-amber-800'
                        : 'bg-stone-950/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <span>No Insurance ($0)</span>
                    <span>Unprotected</span>
                  </button>

                  <button
                    onClick={() => purchaseCropInsurance(field.id, 'catastrophic')}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition text-left flex justify-between ${
                      field.insuranceTier === 'catastrophic'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600'
                        : 'bg-stone-950/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <span>CAT Coverage (${(30 * field.acres).toLocaleString()})</span>
                    <span>50% Payout</span>
                  </button>

                  <button
                    onClick={() => purchaseCropInsurance(field.id, 'premium')}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition text-left flex justify-between ${
                      field.insuranceTier === 'premium'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                        : 'bg-stone-950/60 text-stone-400 border border-stone-800 hover:text-stone-200'
                    }`}
                  >
                    <span>Premium Buy-Up (${(100 * field.acres).toLocaleString()})</span>
                    <span>85% Payout</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FUTURES HEDGING SUB-TAB */}
      {activeSubTab === 'hedging' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Commodity Futures Forward Contracting (Hedging)</span>
            </h3>
            <p className="text-xs text-stone-400">
              Lock in guaranteed delivery prices for Fall harvest. Protects against spot market crashes!
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-stone-100 text-sm">Sign Forward Futures Contract:</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-stone-400 block mb-1">Select Target Commodity Crop:</label>
                <select
                  value={selectedCropIdForFutures}
                  onChange={(e) => setSelectedCropIdForFutures(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-bold"
                >
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (${c.baseSalePrice}/unit)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Contract Quantity:</label>
                <input
                  type="number"
                  readOnly
                  value={1000}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-emerald-400 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">Locked Futures Price:</label>
                <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-amber-400 font-mono font-bold text-xs flex justify-between items-center">
                  <span>${lockedPrice} / unit</span>
                  <span className="text-[10px] text-stone-500">(+5% Hedging Premium)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => signFuturesContract(selectedCropIdForFutures, 1000, lockedPrice)}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Lock In Futures Contract (1,000 units of {selectedCropForFutures.name} @ ${lockedPrice}/unit)</span>
            </button>
          </div>

          {/* Active Futures List */}
          {futuresContracts.length > 0 && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h4 className="font-bold text-stone-100 text-sm">Active Locked Futures Contracts:</h4>
              <div className="space-y-2">
                {futuresContracts.map((fc) => (
                  <div
                    key={fc.id}
                    className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-stone-200">
                        {fc.unitsQuantity} units of {fc.cropName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">${fc.lockedPricePerUnit} / unit (Fall Delivery)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STRESS TEST CALCULATOR SUB-TAB */}
      {activeSubTab === 'stresstest' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              <span>Farm Financial Stress Test Calculator</span>
            </h3>
            <p className="text-xs text-stone-400">
              Simulate global commodity market slumps to test if your cash flow can survive unexpected price crashes.
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-stone-300 font-bold">Simulate Commodity Price Crash Slump:</label>
                <span className="font-mono text-sm font-extrabold text-rose-400">-{stressPriceDropPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={stressPriceDropPct}
                onChange={(e) => setStressPriceDropPct(Number(e.target.value))}
                className="w-full accent-amber-500 bg-stone-800 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Daily Running Burn</span>
                <span className="text-base font-bold text-rose-400">-${dailyBurn.toLocaleString()}</span>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Est. Stressed Harvest Revenue</span>
                <span className="text-base font-bold text-amber-400">
                  ${Math.round(45000 * (1 - stressPriceDropPct / 100)).toLocaleString()}
                </span>
              </div>

              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-400 block">Projected Cash Margin</span>
                <span
                  className={`text-base font-bold ${
                    cash + 45000 * (1 - stressPriceDropPct / 100) - dailyBurn * 90 > 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  ${Math.round(cash + 45000 * (1 - stressPriceDropPct / 100) - dailyBurn * 90).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
