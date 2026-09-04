import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import { FERTILIZERS, DISEASES } from '../data/agronomy';
import { SEED_CATALOG } from '../data/seeds';
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
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
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
    certifyFieldOrganic,
    buyLand,
  } = useGameStore();

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [plantingStep, setPlantingStep] = useState<1 | 2 | 3>(1);
  const [wizardCropId, setWizardCropId] = useState<string | null>(null);
  const [wizardSeedId, setWizardSeedId] = useState<string | null>(null);

  const [fertilizerModalFieldId, setFertilizerModalFieldId] = useState<string | null>(null);
  const [diseaseModalFieldId, setDiseaseModalFieldId] = useState<string | null>(null);

  const activeModalField = fields.find((f) => f.id === selectedFieldId);
  const activeFertilizerField = fields.find((f) => f.id === fertilizerModalFieldId);
  const activeDiseaseField = fields.find((f) => f.id === diseaseModalFieldId);

  const handleOpenPlantWizard = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setPlantingStep(1);
    setWizardCropId(null);
    setWizardSeedId(null);
  };

  const handleExecutePlanting = () => {
    if (!selectedFieldId || !wizardCropId) return;
    const ok = plantCrop(selectedFieldId, wizardCropId);
    if (ok) {
      setSelectedFieldId(null);
      setPlantingStep(1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Agronomy Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Sprout className="w-7 h-7 text-emerald-400" />
            <span>Soil, Nutrients & Field Operations</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Monitor Soil NPK, test <NestedTooltip termKey="soil_ph">Soil pH</NestedTooltip> levels, apply fertilizers, and cure <NestedTooltip termKey="late_blight">Late Blight</NestedTooltip>.
          </p>
        </div>

        <button
          onClick={buyLand}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-bold text-sm shadow-lg transition cursor-pointer shrink-0"
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
                      {field.isCertifiedOrganic ? (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-bold">
                          🌱 USDA Organic
                        </span>
                      ) : (
                        <button
                          onClick={() => certifyFieldOrganic(field.id)}
                          disabled={cash < 2500}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                            cash >= 2500
                              ? 'bg-stone-900 hover:bg-emerald-950 text-stone-400 hover:text-emerald-300 border-stone-800 hover:border-emerald-700'
                              : 'bg-stone-950 text-stone-600 border-stone-900 cursor-not-allowed'
                          }`}
                          title="Pay $2,500 inspection fee for USDA Organic Certification (+80% wholesale/retail premium)"
                        >
                          + Certify Organic ($2.5k)
                        </button>
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300 font-sans font-bold">
                        {field.soilType || 'Silt Loam'}
                      </span>
                      <span className="font-bold px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-400">
                        <NestedTooltip termKey="soil_ph">pH {field.soil.pH}</NestedTooltip>{' '}
                        {field.soil.pH < 6.0 ? '(Acidic)' : field.soil.pH > 7.0 ? '(Alkaline)' : '(Neutral)'}
                      </span>
                    </div>
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
                        <span>Moisture Level:</span>
                      </span>
                      <span
                        className={`font-mono font-bold text-xs ${
                          field.moistureLevel < 30
                            ? 'text-amber-400'
                            : field.moistureLevel > 85
                            ? 'text-rose-400'
                            : 'text-blue-400'
                        }`}
                      >
                        {field.moistureLevel}% {field.moistureLevel < 30 ? '(Drought Stress)' : field.moistureLevel > 85 ? '(Waterlogged)' : '(Optimal)'}
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          field.moistureLevel < 30
                            ? 'bg-amber-500'
                            : field.moistureLevel > 85
                            ? 'bg-rose-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${field.moistureLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Visual 2D Agricultural Plot Bed */}
                <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-inner mb-4">
                  {isEmpty ? (
                    /* Fallow Furrowed Soil Graphic */
                    <div className="p-5 bg-gradient-to-b from-stone-900 via-stone-950 to-[#231812] min-h-[110px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,#92400e,#92400e_2px,transparent_2px,transparent_18px)] pointer-events-none" />
                      <div className="relative z-10 space-y-1.5">
                        <div className="w-10 h-10 rounded-full bg-stone-900/90 border border-stone-800 flex items-center justify-center mx-auto text-amber-600/70 shadow-inner">
                          <Sprout className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-stone-300">Fallow Plot — Resting Soil</p>
                        <p className="text-[10px] text-stone-500 font-mono">Tilled rows ready for drill seeder</p>
                      </div>
                    </div>
                  ) : isReady ? (
                    /* Harvest Ready Radiant Golden Canopy */
                    <div className="p-4 bg-gradient-to-b from-amber-950/70 via-stone-950 to-[#2c1b09] border border-amber-500/80 min-h-[120px] flex flex-col justify-between relative overflow-hidden ring-2 ring-amber-500/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-pulse pointer-events-none" />
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl animate-bounce">{crop?.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-stone-100 text-sm">{crop?.name}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black tracking-wider uppercase shadow">
                                READY
                              </span>
                            </div>
                            <p className="text-[11px] text-amber-300 font-mono mt-0.5">
                              Est. Yield: ~{Math.round(field.acres * (crop?.expectedYieldPerAcre || 10) * (field.soilQuality / 100))} units
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => harvestCrop(field.id)}
                          className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-stone-950 font-black text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <Scissors className="w-3.5 h-3.5" />
                          <span>HARVEST</span>
                        </button>
                      </div>

                      {/* Golden Canopy Representation */}
                      <div className="relative z-10 flex justify-around text-lg opacity-90 py-1 bg-stone-900/60 rounded-xl border border-amber-800/50 mt-2">
                        <span>🌾</span><span>🌾</span><span>{crop?.icon}</span><span>🌾</span><span>🌾</span>
                      </div>
                    </div>
                  ) : (
                    /* Growing Stage Canopy Graphic */
                    <div className="p-4 bg-gradient-to-b from-stone-900 via-stone-950 to-[#1b2819] min-h-[120px] flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,#15803d,#15803d_2px,transparent_2px,transparent_18px)] pointer-events-none" />
                      <div className="flex items-center justify-between relative z-10 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{crop?.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-stone-100 text-sm">{crop?.name}</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                growthPct >= 60
                                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                                  : growthPct >= 25
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                  : 'bg-stone-900 text-stone-300 border-stone-700'
                              }`}>
                                {growthPct >= 60 ? '🪴 Bulking / Pods' : growthPct >= 25 ? '🌿 Vegetative' : '🌱 Emergence'}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-0.5">
                              Day {Math.floor(field.growthDays)} of {crop?.daysToMaturity} days
                            </p>
                          </div>
                        </div>
                        <span className="font-mono font-extrabold text-sm text-emerald-400">{growthPct}%</span>
                      </div>

                      {/* Plant Stage Row Graphic */}
                      <div className="relative z-10 flex justify-around text-sm py-1 bg-stone-900/70 rounded-xl border border-stone-800/80 mb-2">
                        {growthPct < 25 ? (
                          <><span>🌱</span><span>🌱</span><span>🌱</span><span>🌱</span><span>🌱</span></>
                        ) : growthPct < 60 ? (
                          <><span>🌿</span><span>🌿</span><span>🌿</span><span>🌿</span><span>🌿</span></>
                        ) : (
                          <><span>🌿</span><span>{crop?.icon}</span><span>🌿</span><span>{crop?.icon}</span><span>🌿</span></>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="relative z-10 w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-600 via-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${growthPct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {isEmpty && (
                  <button
                    onClick={() => handleOpenPlantWizard(field.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Sprout className="w-4 h-4" />
                    <span>Launch Plant Wizard</span>
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
                    <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lab Test ($150)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP-BY-STEP PLANT ACTION WIZARD MODAL */}
      {selectedFieldId && activeModalField && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden my-auto max-h-[94vh] flex flex-col">
            {/* Wizard Header & Stepper Progress */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <div>
                <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  <Sprout className="w-6 h-6 text-emerald-400" />
                  <span>Planting Wizard: {activeModalField.name}</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Step {plantingStep} of 3: {plantingStep === 1 ? 'Select Crop Type' : plantingStep === 2 ? 'Select Genetic Trait' : 'Review & Confirm'}
                </p>
              </div>
              <button
                onClick={() => setSelectedFieldId(null)}
                className="text-stone-400 hover:text-stone-200 text-sm font-bold px-3 py-1 rounded bg-stone-800"
              >
                ✕ Close
              </button>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className={`flex items-center gap-2 text-xs font-bold ${plantingStep >= 1 ? 'text-emerald-400' : 'text-stone-600'}`}>
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center">1</span>
                <span>Select Crop</span>
              </div>
              <div className={`flex items-center gap-2 text-xs font-bold ${plantingStep >= 2 ? 'text-emerald-400' : 'text-stone-600'}`}>
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center">2</span>
                <span>Seed Trait</span>
              </div>
              <div className={`flex items-center gap-2 text-xs font-bold ${plantingStep === 3 ? 'text-emerald-400' : 'text-stone-600'}`}>
                <span className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center">3</span>
                <span>Confirm</span>
              </div>
            </div>

            {/* STEP 1: SELECT CROP */}
            {plantingStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-1">
                  {CROPS.map((crop) => {
                    const isSelected = wizardCropId === crop.id;
                    const totalCost = crop.seedCostPerAcre * activeModalField.acres;
                    const isIdealSeason = crop.idealSeasons.includes(season);

                    return (
                      <div
                        key={crop.id}
                        onClick={() => setWizardCropId(crop.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/40'
                            : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-3xl">{crop.icon}</span>
                            {isIdealSeason && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                Ideal Season ({season})
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-stone-100 text-sm">{crop.name}</h4>
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">{crop.description}</p>
                        </div>
                        <div className="mt-3 text-xs font-mono font-bold text-emerald-400">
                          ${totalCost.toLocaleString()} Seed Cost
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-stone-800">
                  <button
                    disabled={!wizardCropId}
                    onClick={() => setPlantingStep(2)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition flex items-center gap-2 ${
                      wizardCropId ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Next: Select Seed Trait</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SELECT SEED TRAIT */}
            {plantingStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-h-80 overflow-y-auto pr-1">
                  {SEED_CATALOG.filter((v) => !wizardCropId || v.cropId === wizardCropId).map((variety) => {
                    const isSelected = wizardSeedId === variety.id;
                    return (
                      <div
                        key={variety.id}
                        onClick={() => setWizardSeedId(variety.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40'
                            : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-amber-400 uppercase">
                            {variety.traitType}
                          </span>
                          <h4 className="font-bold text-stone-100 text-sm mt-2">{variety.name}</h4>
                          <p className="text-xs text-stone-400 mt-1">{variety.description}</p>
                        </div>
                        <div className="mt-3 text-xs font-mono font-bold text-amber-400">
                          +${variety.techFeePerAcre}/acre Tech Fee
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-800">
                  <button
                    onClick={() => setPlantingStep(1)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setPlantingStep(3)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs shadow transition flex items-center gap-2"
                  >
                    <span>Next: Review & Confirm</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRM & EXECUTE */}
            {plantingStep === 3 && (
              <div className="space-y-6">
                <div className="p-6 bg-stone-950 rounded-xl border border-stone-800 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-extrabold text-stone-100 text-lg">Ready to Plant</h4>
                  <p className="text-xs text-stone-400">
                    Confirm planting on <strong>{activeModalField.name}</strong> ({activeModalField.acres} Acres).
                  </p>
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-800">
                  <button
                    onClick={() => setPlantingStep(2)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleExecutePlanting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-extrabold text-sm shadow-xl transition flex items-center gap-2"
                  >
                    <Sprout className="w-5 h-5" />
                    <span>Execute Planting</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FERTILIZER DELIVERY SYSTEM MODAL */}
      {fertilizerModalFieldId && activeFertilizerField && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden my-auto max-h-[94vh] flex flex-col">
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
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-stone-200 text-sm">Drip Irrigation System (CapEx)</h4>
                  <p className="text-xs text-stone-400">
                    Required for Liquid Soluble Fertigation. Maintains steady moisture and delivers root NPK directly!
                  </p>
                </div>
                <button
                  onClick={() => installDripIrrigation(activeFertilizerField.id)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-stone-950 font-bold text-xs shadow transition text-center shrink-0 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-4 sm:p-6 overflow-hidden my-auto max-h-[94vh] flex flex-col">
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
                        className="p-4 bg-rose-950/60 border border-rose-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
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
                          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition text-center shrink-0 cursor-pointer"
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
