import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import {
  Users,
  Award,
  Zap,
  Building2,
  Battery,
  Smile,
  Frown,
  Star,
  Trash2,
} from 'lucide-react';
import type { StaffRole } from '../types/game';

export const RosterView: React.FC = () => {
  const {
    staff,
    seasonalWorkers,
    workerHousingLevel,
    overtimeActive,
    cash,
    hirePermanentStaff,
    hireLocalWorker,
    hireH2AContractCrew,
    fireWorker,
    toggleOvertimeMode,
    upgradeWorkerHousing,
  } = useGameStore();

  const [activeSubTab, setActiveSubTab] = useState<'seasonal' | 'staff' | 'housing'>('seasonal');

  const getHousingName = (lvl: number) => {
    switch (lvl) {
      case 0:
        return 'No Farm Housing (Max Morale 50%)';
      case 1:
        return 'Tents & Cheap Trailers ($5k CapEx)';
      case 2:
        return 'Standard Bunkhouses ($18k CapEx)';
      case 3:
        return 'Premium AC Cabins (+15% Well Rested Buff)';
      default:
        return 'None';
    }
  };

  const getFatigueColor = (f: number) => {
    if (f > 70) return 'text-rose-400 bg-rose-950 border-rose-800';
    if (f > 40) return 'text-amber-400 bg-amber-950 border-amber-800';
    return 'text-emerald-400 bg-emerald-950 border-emerald-800';
  };

  const getMoraleColor = (m: number) => {
    if (m < 35) return 'text-rose-400';
    if (m < 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="space-y-6">
      {/* Header & Overtime Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-400" />
            <span>Labor Market & Roster Management</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Recruit Permanent Professionals, manage seasonal harvest crews, toggle Overtime shifts, and upgrade Worker Housing.
          </p>
        </div>

        {/* Overtime Toggle Button */}
        <button
          onClick={toggleOvertimeMode}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-extrabold text-sm shadow-lg transition border cursor-pointer shrink-0 ${
            overtimeActive
              ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 animate-pulse'
              : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border-stone-700'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{overtimeActive ? 'OVERTIME ACTIVE (14-Hr Shifts)' : 'Enable Overtime Mode'}</span>
        </button>
      </div>

      {/* Sub-tab Navigation */}
      <div className="w-full flex items-center gap-1.5 sm:gap-2 p-1 bg-stone-900 rounded-xl border border-stone-800 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('seasonal')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'seasonal'
              ? 'bg-emerald-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🧑‍🌾 Harvest Crew ({seasonalWorkers.length})
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'staff'
              ? 'bg-emerald-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          👨‍💼 Salaried Staff ({staff.filter((s) => s.hired).length}/3)
        </button>

        <button
          onClick={() => setActiveSubTab('housing')}
          className={`px-3.5 sm:px-4 py-2 text-xs font-bold rounded-lg transition whitespace-nowrap shrink-0 cursor-pointer ${
            activeSubTab === 'housing'
              ? 'bg-emerald-600 text-stone-950 shadow'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          🏠 Housing (Lvl {workerHousingLevel})
        </button>
      </div>

      {/* SEASONAL WORKERS SUB-TAB */}
      {activeSubTab === 'seasonal' && (
        <div className="space-y-6">
          {/* Hire Buttons Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={hireLocalWorker}
              className="p-5 bg-stone-900 border border-stone-800 hover:border-emerald-500/60 rounded-2xl shadow-lg transition text-left flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧑‍🌾</span>
                  <h3 className="font-bold text-stone-100 text-sm">Hire Local Day Worker</h3>
                </div>
                <p className="text-xs text-stone-400 mt-1">Flexible daily labor ($120/day). No housing required.</p>
              </div>
              <span className="p-3 bg-emerald-950 text-emerald-400 rounded-xl font-bold text-xs group-hover:scale-105 transition">
                + Hire ($120/d)
              </span>
            </button>

            <button
              onClick={hireH2AContractCrew}
              className="p-5 bg-stone-900 border border-stone-800 hover:border-amber-500/60 rounded-2xl shadow-lg transition text-left flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👷</span>
                  <h3 className="font-bold text-stone-100 text-sm">Sign H-2A Visa Contract Worker</h3>
                </div>
                <p className="text-xs text-stone-400 mt-1">Guaranteed attendance ($160/day). Requires Housing.</p>
              </div>
              <span className="p-3 bg-amber-950 text-amber-400 rounded-xl font-bold text-xs group-hover:scale-105 transition">
                + Sign ($160/d)
              </span>
            </button>
          </div>

          {/* Seasonal Roster Grid */}
          {seasonalWorkers.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-stone-800 rounded-2xl text-center">
              <Users className="w-10 h-10 text-stone-600 mx-auto mb-2" />
              <p className="text-xs text-stone-400">No seasonal harvest workers hired yet. Click above to recruit!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seasonalWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{worker.avatar}</span>
                        <div>
                          <h3 className="font-extrabold text-stone-100 text-base">{worker.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                              worker.type === 'local'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : 'bg-amber-950 text-amber-300 border-amber-800'
                            }`}
                          >
                            {worker.type === 'local' ? 'Local Daily Hire' : 'H-2A Contract Crew'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => fireWorker(worker.id)}
                        className="p-2 rounded-lg bg-stone-950 hover:bg-rose-950 text-stone-500 hover:text-rose-400 transition"
                        title="Dismiss Worker"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Fatigue & Morale Indicators */}
                    <div className="space-y-3 p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs mb-4">
                      {/* Fatigue */}
                      <div>
                        <div className="flex justify-between text-stone-300 mb-1">
                          <span className="flex items-center gap-1 text-stone-400">
                            <Battery className="w-3.5 h-3.5 text-amber-400" />
                            <span>Fatigue:</span>
                          </span>
                          <span className={`font-mono font-bold ${getFatigueColor(worker.fatigue).split(' ')[0]}`}>
                            {worker.fatigue}% {worker.fatigue > 70 ? '(Exhausted!)' : ''}
                          </span>
                        </div>
                        <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              worker.fatigue > 70 ? 'bg-rose-500' : worker.fatigue > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${worker.fatigue}%` }}
                          />
                        </div>
                      </div>

                      {/* Morale */}
                      <div className="flex justify-between items-center font-mono">
                        <span className="flex items-center gap-1 text-stone-400">
                          {worker.morale < 40 ? (
                            <Frown className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <Smile className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span>Morale Rating:</span>
                        </span>
                        <span className={`font-bold ${getMoraleColor(worker.morale)}`}>
                          {worker.morale}% {worker.morale < 30 ? '(Quitting Risk!)' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Skill Breakdown */}
                    <div className="space-y-1.5 p-3 bg-stone-950/60 rounded-xl border border-stone-800/60 text-xs font-mono mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Hand-Picking Skill:</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: worker.handPickingSkill }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Machinery Cert:</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: worker.heavyMachinerySkill }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-stone-400">Packing & Sorting:</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: worker.packingSkill }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex justify-between text-xs font-mono text-stone-400">
                    <span>Daily Wage: ${worker.dailyWage}/day</span>
                    <span>Farm Tenure: {worker.yearsWithFarm} yr(s)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SALARIED STAFF SUB-TAB */}
      {activeSubTab === 'staff' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Salaried Permanent Professionals</span>
            </h3>
            <p className="text-xs text-stone-400">
              Core management staff provide massive passive farm bonuses and automation capabilities. Paid seasonally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((s) => {
              const canAfford = cash >= s.salaryPerSeason;

              return (
                <div
                  key={s.id}
                  className={`bg-stone-900 border rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all ${
                    s.hired ? 'border-emerald-500/80 ring-2 ring-emerald-500/30' : 'border-stone-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-5xl">{s.avatar}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          s.hired
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                            : 'bg-stone-950 text-stone-400 border-stone-800'
                        }`}
                      >
                        {s.hired ? 'Active Staff' : 'Available'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-stone-100 text-lg mb-0.5">{s.name}</h3>
                    <p className="text-xs text-amber-400 font-mono font-bold uppercase mb-2">
                      {s.role.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-stone-300 mb-4">{s.description}</p>

                    <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs font-mono mb-4 flex justify-between">
                      <span className="text-stone-400">Seasonal Salary:</span>
                      <span className="font-bold text-emerald-400">${s.salaryPerSeason.toLocaleString()}/season</span>
                    </div>
                  </div>

                  {!s.hired ? (
                    <button
                      onClick={() => hirePermanentStaff(s.role as StaffRole)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition shadow ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `Recruit (${s.name})` : 'Insufficient Cash'}
                    </button>
                  ) : (
                    <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-xl text-center text-xs font-bold text-emerald-300">
                      ✓ Active Role Bonus Applied
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WORKER HOUSING SUB-TAB */}
      {activeSubTab === 'housing' && (
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-stone-100 mb-1 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Worker Housing Infrastructure</span>
            </h3>
            <p className="text-xs text-stone-400">
              Current Tier: <strong>{getHousingName(workerHousingLevel)}</strong>. Required to recruit H-2A contract crews!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-4xl mb-3 block">⛺</span>
                <h3 className="font-bold text-stone-100 text-base">Tents & Cheap Trailers</h3>
                <p className="text-xs text-stone-400 mt-1">Low CapEx ($5,000). Recovers 20% fatigue overnight.</p>
              </div>
              <button
                disabled={workerHousingLevel >= 1}
                onClick={upgradeWorkerHousing}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs ${
                  workerHousingLevel >= 1
                    ? 'bg-stone-800 text-emerald-400 border border-emerald-800 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                }`}
              >
                {workerHousingLevel >= 1 ? '✓ Unlocked' : 'Build ($5,000)'}
              </button>
            </div>

            {/* Tier 2 */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-4xl mb-3 block">🪵</span>
                <h3 className="font-bold text-stone-100 text-base">Standard Bunkhouses</h3>
                <p className="text-xs text-stone-400 mt-1">Moderate CapEx ($18,000). Recovers 35% fatigue overnight.</p>
              </div>
              <button
                disabled={workerHousingLevel >= 2}
                onClick={upgradeWorkerHousing}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs ${
                  workerHousingLevel >= 2
                    ? 'bg-stone-800 text-emerald-400 border border-emerald-800 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                }`}
              >
                {workerHousingLevel >= 2 ? '✓ Unlocked' : 'Upgrade ($18,000)'}
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-4xl mb-3 block">🏡</span>
                <h3 className="font-bold text-stone-100 text-base">Premium AC Cabins</h3>
                <p className="text-xs text-stone-400 mt-1">
                  High CapEx ($45,000). Recovers 50% fatigue + grants +15% Well Rested harvesting speed!
                </p>
              </div>
              <button
                disabled={workerHousingLevel >= 3}
                onClick={upgradeWorkerHousing}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs ${
                  workerHousingLevel >= 3
                    ? 'bg-stone-800 text-emerald-400 border border-emerald-800 cursor-default'
                    : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                }`}
              >
                {workerHousingLevel >= 3 ? '✓ Unlocked' : 'Upgrade ($45,000)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
