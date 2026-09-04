import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CROPS } from '../data/crops';
import {
  Dna,
  FlaskConical,
  Sparkles,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SeedTraitType } from '../types/game';

export const SeedBrokerView: React.FC = () => {
  const {
    cash,
    fields,
    seedCatalog,
    geneticRnd,
    staff,
    buildRndGreenhouse,
    startBreedingProgram,
    buySeedVariety,
  } = useGameStore();

  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [selectedFieldForPurchase, setSelectedFieldForPurchase] = useState<string>(fields[0]?.id || '');

  const filteredCatalog = seedCatalog.filter((variety) => {
    if (selectedCropFilter !== 'all' && variety.cropId !== selectedCropFilter) return false;
    return true;
  });

  const plantGeneticistHired = staff.find((s) => s.role === 'plant_geneticist')?.hired;

  const triggerConfetti = (colors?: string[]) => {
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: colors || ['#a855f7', '#10b981', '#f59e0b', '#06b6d4'],
      });
    } catch {}
  };

  const handleBuySeed = (fieldId: string, varietyId: string) => {
    buySeedVariety(fieldId, varietyId);
    triggerConfetti(['#a855f7', '#10b981', '#fbbf24']);
  };

  const handleStartBreeding = (cropId: string) => {
    if (!cropId) return;
    startBreedingProgram(cropId);
    triggerConfetti(['#38bdf8', '#818cf8', '#c084fc']);
  };

  const getTraitBadgeColor = (trait: SeedTraitType) => {
    switch (trait) {
      case 'gmo_biotech':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'organic_heirloom':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'custom_bred':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-stone-950 text-stone-400 border-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 p-6 rounded-2xl shadow-lg">
        <div>
          <h2 className="text-2xl font-extrabold text-stone-100 flex items-center gap-2">
            <Dna className="w-7 h-7 text-purple-400" />
            <span>Seed Genetics Broker & R&D Breeding Lab</span>
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Compare patented GMO biotech traits vs. high-margin Organic Heirlooms, manage seed saving audits, and breed custom strains.
          </p>
        </div>

        {/* Passive Royalty Tracker */}
        {geneticRnd.passiveRoyaltyIncome > 0 && (
          <div className="p-3 bg-amber-950/80 border border-amber-800 rounded-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-mono text-amber-400 block font-bold">Seed Royalties</span>
              <span className="text-base font-extrabold text-amber-300 font-mono">
                +${geneticRnd.passiveRoyaltyIncome}/day
              </span>
            </div>
          </div>
        )}
      </div>

      {/* R&D Greenhouse Breeding Lab Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <span>Farm R&D Greenhouse & Plant Genetics Lab</span>
          </h3>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${
              geneticRnd.hasGreenhouse
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                : 'bg-stone-950 text-stone-500 border-stone-800'
            }`}
          >
            {geneticRnd.hasGreenhouse ? 'R&D Greenhouse Active' : 'Unbuilt'}
          </span>
        </div>

        {!geneticRnd.hasGreenhouse ? (
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-stone-200 text-sm">Construct High-Tech R&D Greenhouse ($50,000 CapEx)</h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Unlocks farm-level plant breeding. Cross-pollinate crops to develop proprietary zero-tech-fee super seeds!
              </p>
            </div>
            <button
              onClick={buildRndGreenhouse}
              disabled={cash < 50000}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow transition text-center shrink-0 cursor-pointer ${
                cash >= 50000 ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              Construct Greenhouse ($50,000)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block">Plant Geneticist:</span>
                <strong className={plantGeneticistHired ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {plantGeneticistHired ? '✓ Dr. Elena Rostova (Hired)' : '❌ Not Hired (Go to Staff Tab)'}
                </strong>
              </div>

              <div>
                <span className="text-stone-400 block">Breeding Status:</span>
                <strong className={geneticRnd.isBreedingActive ? 'text-amber-400 font-bold' : 'text-stone-300'}>
                  {geneticRnd.isBreedingActive
                    ? `Cross-Breeding ${geneticRnd.targetCropId} (${geneticRnd.breedingProgressDays}/180 Days)`
                    : 'Idle'}
                </strong>
              </div>

              <div>
                <span className="text-stone-400 block">Bred Proprietary Strains:</span>
                <strong className="text-emerald-400 font-bold font-mono">
                  {geneticRnd.unlockedCustomSeeds.length} Custom Strains
                </strong>
              </div>
            </div>

            {geneticRnd.unlockedCustomSeeds.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-purple-950/70 via-stone-900 to-emerald-950/70 border border-purple-800/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-900/40 border border-purple-700/50 text-purple-400">
                    <Award className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-100 flex items-center gap-2">
                      <span>Proprietary Genetic Breakthroughs Registered</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-mono font-bold">
                        {geneticRnd.unlockedCustomSeeds.length} Strain{geneticRnd.unlockedCustomSeeds.length > 1 ? 's' : ''}
                      </span>
                    </h4>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                      Proprietary genetics unlocked: <strong className="text-emerald-300 capitalize">{geneticRnd.unlockedCustomSeeds.join(', ')}</strong>. Zero corporate tech fees, +$250/day royalties & high natural resilience!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => triggerConfetti()}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-stone-950 font-bold text-xs shadow cursor-pointer whitespace-nowrap transition transform hover:scale-105"
                >
                  🎉 Celebrate Innovation
                </button>
              </div>
            )}

            {plantGeneticistHired && !geneticRnd.isBreedingActive && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800">
                <span className="text-xs text-stone-300 font-bold whitespace-nowrap">Start 180-Day Breeding Project:</span>
                <select
                  onChange={(e) => {
                    handleStartBreeding(e.target.value);
                    e.target.value = '';
                  }}
                  className="w-full sm:w-auto p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs font-bold"
                >
                  <option value="">Select Target Crop...</option>
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Seed Catalog Trait Matrix */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
            <Dna className="w-5 h-5 text-purple-400" />
            <span>Seed Broker Catalog & Trait Matrix</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {/* Filter by Crop */}
            <select
              value={selectedCropFilter}
              onChange={(e) => setSelectedCropFilter(e.target.value)}
              className="w-full sm:w-auto p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-bold"
            >
              <option value="all">All Crops</option>
              {CROPS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Target Field */}
            <select
              value={selectedFieldForPurchase}
              onChange={(e) => setSelectedFieldForPurchase(e.target.value)}
              className="w-full sm:w-auto p-2 rounded-xl bg-stone-950 border border-stone-800 text-emerald-400 text-xs font-bold font-mono"
            >
              {fields.map((f) => (
                <option key={f.id} value={f.id}>
                  Target: {f.name} ({f.acres} Acres)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((variety) => {
            const targetField = fields.find((f) => f.id === selectedFieldForPurchase) || fields[0];
            const acres = targetField?.acres || 10;
            const totalCost = (variety.costPerAcre + variety.techFeePerAcre) * acres;

            return (
              <div
                key={variety.id}
                className="bg-stone-950 border border-stone-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getTraitBadgeColor(
                        variety.traitType
                      )}`}
                    >
                      {variety.traitType.replace('_', ' ')}
                    </span>
                    {variety.pricePremiumPct > 0 && (
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">
                        +{variety.pricePremiumPct}% Market Price
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-stone-100 text-base">{variety.name}</h4>
                  <p className="text-xs text-stone-400 mt-1">{variety.description}</p>

                  <div className="my-4 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-stone-400">Yield Multiplier:</span>
                      <strong className="text-amber-400">{(variety.yieldMultiplier * 100).toFixed(0)}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Days to Maturity (DTM):</span>
                      <strong className="text-stone-200">{variety.dtmDays} Days</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Drought Resistance:</span>
                      <strong className="text-cyan-400">Level {variety.droughtResistance}/5</strong>
                    </div>
                    {variety.diseaseImmunity && (
                      <div className="flex justify-between">
                        <span className="text-stone-400">Disease Immunity:</span>
                        <strong className="text-purple-400">{variety.diseaseImmunity}</strong>
                      </div>
                    )}
                    {variety.techFeePerAcre > 0 && (
                      <div className="flex justify-between text-rose-400">
                        <span>Corporate Tech Fee:</span>
                        <span>${variety.techFeePerAcre}/acre</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleBuySeed(selectedFieldForPurchase, variety.id)}
                  disabled={cash < totalCost}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow transition ${
                    cash >= totalCost ? 'bg-purple-600 hover:bg-purple-500 text-stone-950' : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Buy & Plant ({acres} Acres - ${totalCost.toLocaleString()})
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
