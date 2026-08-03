import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import { FERTILIZERS, DISEASES } from '../data/agronomy';
import { NestedTooltip } from './NestedTooltip';
import {
  Sprout,
  Droplets,
  Sparkles,
  Scissors,
  PlusCircle,
  FlaskConical,
  ShieldAlert,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import type { DiseaseId, FertilizerType } from '../types/game';

export const FieldsView: React.FC = () => {
  const {
    fields,
    cash,
    season,
    selectedRegion,
    plantCrop,
    harvestCrop,
    hireCustomHarvester,
    tendField,
    applyFertilizer,
    applyDiseaseTreatment,
    applyPreventative,
    installDripIrrigation,
    installStrawMulch,
    runSoilTest,
    buyLand,
  } = useGameStore();

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [fertilizerModalFieldId, setFertilizerModalFieldId] = useState<string | null>(null);
  const [diseaseModalFieldId, setDiseaseModalFieldId] = useState<string | null>(null);

  const activeModalField = fields.find((f) => f.id === selectedFieldId);
  const activeFertilizerField = fields.find((f) => f.id === fertilizerModalFieldId);
  const activeDiseaseField = fields.find((f) => f.id === diseaseModalFieldId);

  const handlePlantSubmit = (cropId: string) => {
    if (!selectedFieldId) return;
    const success = plantCrop(selectedFieldId, cropId);
    if (success) {
      setSelectedFieldId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Agronomy Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Sprout className="w-7 h-7 text-emerald-400" />
            <span>Soil, Nutrients & Field Management</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Monitor Soil NPK, test <NestedTooltip termKey="soil_ph">Soil pH</NestedTooltip> levels, apply fertilizers, and cure <NestedTooltip termKey="late_blight">Late Blight</NestedTooltip>.
          </p>
        </div>

        <button
          onClick={buyLand}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-bold text-sm shadow-lg transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buy 10 Acres (${selectedRegion?.baseLandCost ? (selectedRegion.baseLandCost * 10).toLocaleString() : 0})</span>
        </button>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fields.map((field) => {
          const crop = CROPS.find((c) => c.id === field.currentCropId);
          const isReady = field.status === 'ready';
          const isGrowing = field.status === 'growing';
          const isEmpty = field.status === 'empty';
          const hasDiseases = field.activeDiseases.length > 0;
          const isMonoculturePenalty = (field.monoculturePenaltySeasons || 0) >= 3;

          const growthPct = crop ? Math.min(100, Math.round((field.growthDays / crop.daysToMaturity) * 100)) : 0;

          return (
            <div
              key={field.id}
              className={`bg-stone-900 border rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all ${
                hasDiseases
                  ? 'border-rose-500/90 ring-2 ring-rose-500/30'
                  : isReady
                  ? 'border-emerald-500/80 ring-2 ring-emerald-500/30'
                  : isGrowing
                  ? 'border-amber-700/60'
                  : 'border-stone-800 hover:border-stone-700'
              }`}
            >
              <div>
                {/* Field Top Info */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-lg text-stone-100">{field.name}</h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                      <span>{field.acres} Acres</span>
                      {field.hasDripIrrigation && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 text-[10px]">
                          💧 Drip Line
                        </span>
                      )}
                      {field.hasStrawMulch && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px]">
                          🌾 Straw Mulch
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                      hasDiseases
                        ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                        : isReady
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse'
                        : isGrowing
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-stone-950 text-stone-400 border-stone-800'
                    }`}
                  >
                    {hasDiseases ? 'Infected!' : isReady ? 'Ready' : isGrowing ? 'Growing' : 'Empty'}
                  </span>
                </div>

                {/* Monoculture Penalty Warning */}
                {isMonoculturePenalty && (
                  <div className="p-2.5 mb-3 bg-amber-950/80 border border-amber-700 rounded-xl text-[11px] font-bold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Monoculture Penalty: -20% Yield (3+ seasons same crop)</span>
                  </div>
                )}

                {/* Active Diseases Warning Banner */}
                {hasDiseases && (
                  <div className="p-3 bg-rose-950/80 border border-rose-800 rounded-xl mb-4 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>Active Infections ({field.activeDiseases.length}):</span>
                    </div>
                    {field.activeDiseases.map((dId) => {
                      const disease = DISEASES.find((d) => d.id === dId);
                      return (
                        <p key={dId} className="text-rose-200 text-[11px] pl-5">
                          • <strong>{disease?.name}</strong> ({disease?.effectDescription})
                        </p>
                      );
                    })}
                  </div>
                )}

                {/* Soil NPK & pH Diagnostic Dashboard */}
                <div className="space-y-3 p-3.5 bg-stone-950 rounded-xl border border-stone-800/80 text-xs mb-4">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-800/80 font-mono">
                    <span className="text-stone-400 flex items-center gap-1 font-bold">
                      <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                      <span>Soil Chemistry:</span>
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-400">
                      <NestedTooltip termKey="soil_ph">pH {field.soil.pH}</NestedTooltip>{' '}
                      {field.soil.pH < 6.0 ? '(Acidic)' : field.soil.pH > 7.0 ? '(Alkaline)' : '(Neutral)'}
                    </span>
                  </div>

                  {/* NPK Gauges Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                    <div className="p-1.5 bg-stone-900 rounded border border-stone-800">
                      <span className="text-[10px] text-stone-400 block">N (Nitrogen)</span>
                      <span className={`font-bold text-xs ${field.soil.nitrogen < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {Math.round(field.soil.nitrogen)}%
                      </span>
                    </div>

                    <div className="p-1.5 bg-stone-900 rounded border border-stone-800">
                      <span className="text-[10px] text-stone-400 block">P (Phos)</span>
                      <span className="font-bold text-xs text-amber-400">{Math.round(field.soil.phosphorus)}%</span>
                    </div>

                    <div className="p-1.5 bg-stone-900 rounded border border-stone-800">
                      <span className="text-[10px] text-stone-400 block">K (Potass)</span>
                      <span className="font-bold text-xs text-blue-400">{Math.round(field.soil.potassium)}%</span>
                    </div>

                    <div className="p-1.5 bg-stone-900 rounded border border-stone-800">
                      <span className="text-[10px] text-stone-400 block">Ca (Calc)</span>
                      <span className={`font-bold text-xs ${field.soil.calcium < 30 ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {Math.round(field.soil.calcium)}%
                      </span>
                    </div>
                  </div>

                  {/* Moisture Indicator */}
                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span className="flex items-center gap-1 text-stone-400">
                        <Droplets className="w-3.5 h-3.5 text-blue-400" />
                        <span>Moisture:</span>
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          field.moistureLevel < 30
                            ? 'text-amber-400'
                            : field.moistureLevel > 85
                            ? 'text-rose-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {field.moistureLevel}% {field.moistureLevel < 30 ? '(Drought Risk!)' : field.moistureLevel > 85 ? '(Flood Risk!)' : ''}
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: `${field.moistureLevel}%` }} />
                    </div>
                  </div>
                </div>

                {/* Crop Status Section */}
                {crop ? (
                  <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/60 space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{crop.icon}</span>
                      <div>
                        <h4 className="font-bold text-stone-100 text-sm">{crop.name}</h4>
                        <p className="text-xs text-stone-400">
                          Yield: ~{Math.round(field.acres * crop.expectedYieldPerAcre * (field.soilQuality / 100))} units
                        </p>
                      </div>
                    </div>

                    {/* Gradient Growth Bar */}
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-mono">
                        <span className="text-stone-400">Growth: {field.growthDays} / {crop.daysToMaturity} days</span>
                        <span className="text-emerald-400 font-bold">{growthPct}%</span>
                      </div>
                      <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-amber-600 via-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${growthPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-2 border-dashed border-stone-800 rounded-xl text-center mb-4">
                    <Sprout className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                    <p className="text-xs text-stone-400">This plot is currently unseeded.</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {isEmpty && (
                  <button
                    onClick={() => setSelectedFieldId(field.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Sprout className="w-4 h-4" />
                    <span>Plant Crop</span>
                  </button>
                )}

                {isReady && (
                  <div className="space-y-2">
                    <button
                      onClick={() => harvestCrop(field.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-400 hover:to-amber-400 text-stone-950 font-extrabold text-xs transition shadow flex items-center justify-center gap-2"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>Harvest (Self Machinery)</span>
                    </button>

                    <button
                      onClick={() => hireCustomHarvester(field.id)}
                      className="w-full py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hire Custom Harvester Crew ($4,000)</span>
                    </button>
                  </div>
                )}

                {/* Agronomy Options Toolbar */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFertilizerModalFieldId(field.id)}
                    className="py-2 px-3 rounded-lg bg-stone-800 hover:bg-amber-950/60 border border-stone-700 text-amber-300 font-semibold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fertilizer</span>
                  </button>

                  <button
                    onClick={() => setDiseaseModalFieldId(field.id)}
                    className={`py-2 px-3 rounded-lg border font-semibold text-xs transition flex items-center justify-center gap-1 ${
                      hasDiseases
                        ? 'bg-rose-900 hover:bg-rose-800 text-white border-rose-600 animate-pulse'
                        : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Disease / Spray</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => tendField(field.id, 'water')}
                    className="py-1.5 px-2 rounded-lg bg-stone-950 hover:bg-stone-850 border border-stone-800 text-blue-300 font-semibold text-[11px] transition flex items-center justify-center gap-1"
                  >
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>Water ($30)</span>
                  </button>

                  <button
                    onClick={() => runSoilTest(field.id)}
                    className="py-1.5 px-2 rounded-lg bg-stone-950 hover:bg-stone-850 border border-stone-800 text-amber-300 font-semibold text-[11px] transition flex items-center justify-center gap-1"
                  >
                    <FlaskConical className="w-3 h-3 text-amber-400" />
                    <span>Lab Test ($150)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PLANT CROP MODAL */}
      {selectedFieldId && activeModalField && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  <Sprout className="w-6 h-6 text-emerald-400" />
                  <span>Plant Seed on {activeModalField.name}</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Plot Size: {activeModalField.acres} Acres | Soil pH: {activeModalField.soil.pH} | Available Cash: ${cash.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedFieldId(null)}
                className="text-stone-400 hover:text-stone-200 text-sm font-bold px-3 py-1 rounded bg-stone-800"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
              {CROPS.map((crop) => {
                const totalCost = crop.seedCostPerAcre * activeModalField.acres;
                const canAfford = cash >= totalCost;
                const isIdealSeason = crop.idealSeasons.includes(season);

                return (
                  <div
                    key={crop.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      canAfford
                        ? 'bg-stone-950 border-stone-800 hover:border-emerald-500/60'
                        : 'bg-stone-950/40 border-stone-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl">{crop.icon}</span>
                        {isIdealSeason ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                            ★ Ideal Season ({season})
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-stone-400">
                            {crop.idealSeasons.join(', ')}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-stone-100 text-sm">{crop.name}</h4>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{crop.description}</p>

                      <div className="mt-3 space-y-1 text-xs font-mono text-stone-300">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Days to Harvest:</span>
                          <span>{crop.daysToMaturity} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Est. Yield / Acre:</span>
                          <span>{crop.expectedYieldPerAcre} units</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold">
                          <span>Total Seed Cost:</span>
                          <span>${totalCost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlantSubmit(crop.id)}
                      disabled={!canAfford}
                      className={`mt-4 w-full py-2 px-3 rounded-lg font-bold text-xs transition ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 shadow'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? `Plant (${crop.name})` : 'Insufficient Cash'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FERTILIZER DELIVERY SYSTEM MODAL */}
      {fertilizerModalFieldId && activeFertilizerField && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span>Fertilizer Delivery System ({activeFertilizerField.name})</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Select Granular (Dry), Fertigation (Drip), or Foliar Spray delivery method.
                </p>
              </div>
              <button
                onClick={() => setFertilizerModalFieldId(null)}
                className="text-stone-400 hover:text-stone-200 text-sm font-bold px-3 py-1 rounded bg-stone-800"
              >
                ✕ Close
              </button>
            </div>

            {!activeFertilizerField.hasDripIrrigation && (
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl mb-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-200 text-sm">Drip Irrigation System (CapEx)</h4>
                  <p className="text-xs text-stone-400">
                    Required for Liquid Soluble Fertigation. Maintains steady moisture and delivers root NPK directly!
                  </p>
                </div>
                <button
                  onClick={() => installDripIrrigation(activeFertilizerField.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-stone-950 font-bold text-xs shadow transition whitespace-nowrap"
                >
                  Install Drip (${(1200 * activeFertilizerField.acres).toLocaleString()})
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-1">
              {FERTILIZERS.map((fert) => {
                const totalCost = fert.costPerAcre * activeFertilizerField.acres;
                const canAfford = cash >= totalCost;
                const isBlocked = fert.requiresDrip && !activeFertilizerField.hasDripIrrigation;

                return (
                  <div
                    key={fert.id}
                    className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                      isBlocked
                        ? 'bg-stone-950/40 border-stone-900 opacity-60'
                        : 'bg-stone-950 border-stone-800 hover:border-amber-500/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            fert.delivery === 'granular'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : fert.delivery === 'fertigation'
                              ? 'bg-blue-950 text-blue-300 border-blue-800'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {fert.delivery} delivery
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-400">
                          ${totalCost.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="font-bold text-stone-100 text-sm">{fert.name}</h4>
                      <p className="text-xs text-stone-400 mt-1">{fert.description}</p>

                      <div className="mt-3 p-2 bg-stone-900 rounded text-xs font-mono text-stone-300 space-y-0.5">
                        {fert.nGain > 0 && <p className="text-emerald-400">+ {fert.nGain} Nitrogen (N)</p>}
                        {fert.pGain > 0 && <p className="text-amber-400">+ {fert.pGain} Phosphorus (P)</p>}
                        {fert.kGain > 0 && <p className="text-blue-400">+ {fert.kGain} Potassium (K)</p>}
                        {fert.caGain > 0 && <p className="text-cyan-400">+ {fert.caGain} Calcium (Ca)</p>}
                        {fert.phDelta !== 0 && (
                          <p className={fert.phDelta > 0 ? 'text-amber-300' : 'text-rose-300'}>
                            {fert.phDelta > 0 ? `+${fert.phDelta}` : fert.phDelta} Soil pH Shift
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const ok = applyFertilizer(activeFertilizerField.id, fert.id as FertilizerType);
                        if (ok) setFertilizerModalFieldId(null);
                      }}
                      disabled={!canAfford || isBlocked}
                      className={`mt-4 w-full py-2 px-3 rounded-lg font-bold text-xs transition ${
                        canAfford && !isBlocked
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 shadow'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {isBlocked
                        ? 'Requires Drip Irrigation'
                        : canAfford
                        ? `Apply ${fert.name}`
                        : 'Insufficient Cash'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DISEASE TREATMENT & PREVENTATIVE SPRAY MODAL */}
      {diseaseModalFieldId && activeDiseaseField && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-rose-400" />
                  <span>Disease Treatment & Preventative Sprays ({activeDiseaseField.name})</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Cure active infections or dispatch preventative sprays before rainstorms.
                </p>
              </div>
              <button
                onClick={() => setDiseaseModalFieldId(null)}
                className="text-stone-400 hover:text-stone-200 text-sm font-bold px-3 py-1 rounded bg-stone-800"
              >
                ✕ Close
              </button>
            </div>

            {activeDiseaseField.activeDiseases.length > 0 ? (
              <div className="mb-6 space-y-3">
                <h4 className="font-bold text-rose-400 text-sm">Active Field Infections (Treat Immediately):</h4>
                <div className="space-y-3">
                  {activeDiseaseField.activeDiseases.map((dId) => {
                    const disease = DISEASES.find((d) => d.id === dId);
                    if (!disease) return null;
                    const cost = disease.treatmentCostPerAcre * activeDiseaseField.acres;

                    return (
                      <div
                        key={dId}
                        className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div>
                          <h5 className="font-bold text-stone-100 text-sm">{disease.name}</h5>
                          <p className="text-xs text-rose-200">{disease.effectDescription}</p>
                          <p className="text-xs text-amber-300 mt-1">Recommended Cure: {disease.treatmentName}</p>
                        </div>
                        <button
                          onClick={() => {
                            applyDiseaseTreatment(activeDiseaseField.id, dId as DiseaseId);
                          }}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition whitespace-nowrap"
                        >
                          Cure (${cost.toLocaleString()})
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 rounded-xl mb-6 text-emerald-300 text-xs font-bold">
                ✓ No active infections on this field plot!
              </div>
            )}

            <h4 className="font-bold text-stone-200 text-sm mb-3">Preventative Applications:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => applyPreventative(activeDiseaseField.id, 'copperFungicide')}
                disabled={activeDiseaseField.diseasePreventatives.copperFungicide}
                className={`p-4 rounded-xl border text-left transition ${
                  activeDiseaseField.diseasePreventatives.copperFungicide
                    ? 'bg-stone-950 border-stone-800 text-stone-500'
                    : 'bg-stone-950 border-stone-800 hover:border-emerald-500/60 text-stone-200'
                }`}
              >
                <h5 className="font-bold text-xs text-emerald-400">Copper Fungicide Spray</h5>
                <p className="text-[11px] text-stone-400 mt-1">
                  Protects Tomatoes & Potatoes from Phytophthora Late Blight before rainstorms.
                </p>
                <span className="block mt-2 font-mono text-xs font-bold text-amber-400">
                  ${(140 * activeDiseaseField.acres).toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => applyPreventative(activeDiseaseField.id, 'sulfurOil')}
                disabled={activeDiseaseField.diseasePreventatives.sulfurOil}
                className={`p-4 rounded-xl border text-left transition ${
                  activeDiseaseField.diseasePreventatives.sulfurOil
                    ? 'bg-stone-950 border-stone-800 text-stone-500'
                    : 'bg-stone-950 border-stone-800 hover:border-amber-500/60 text-stone-200'
                }`}
              >
                <h5 className="font-bold text-xs text-amber-400">Elemental Sulfur Spray</h5>
                <p className="text-[11px] text-stone-400 mt-1">
                  Protects Pumpkins & Berries from Powdery Mildew during dry heatwaves.
                </p>
                <span className="block mt-2 font-mono text-xs font-bold text-amber-400">
                  ${(90 * activeDiseaseField.acres).toLocaleString()}
                </span>
              </button>

              <button
                onClick={() => installStrawMulch(activeDiseaseField.id)}
                disabled={activeDiseaseField.hasStrawMulch}
                className={`p-4 rounded-xl border text-left transition ${
                  activeDiseaseField.hasStrawMulch
                    ? 'bg-stone-950 border-stone-800 text-stone-500'
                    : 'bg-stone-950 border-stone-800 hover:border-amber-500/60 text-stone-200'
                }`}
              >
                <h5 className="font-bold text-xs text-amber-400">Organic Straw Mulch</h5>
                <p className="text-[11px] text-stone-400 mt-1">
                  Covers soil to prevent rain splash Bacterial Spot/Speck.
                </p>
                <span className="block mt-2 font-mono text-xs font-bold text-amber-400">$200</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
