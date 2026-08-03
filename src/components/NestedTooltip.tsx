import React, { useState } from 'react';

interface TooltipTermDefinition {
  title: string;
  definition: string;
  nestedTerms?: { term: string; explanation: string }[];
}

const TOOLTIP_DICTIONARY: Record<string, TooltipTermDefinition> = {
  soil_ph: {
    title: 'Soil pH Scale',
    definition:
      'Measures soil acidity or alkalinity on a 0–14 scale. Most crops prefer 6.0–7.0. Acidic soil (<5.5) triggers Potato Scab, while alkaline soil (>7.0) limits nutrient absorption.',
    nestedTerms: [
      { term: 'Dolomitic Lime', explanation: 'Granular fertilizer used to raise soil pH.' },
      { term: 'Elemental Sulfur', explanation: 'Spray used to lower soil pH.' },
    ],
  },
  late_blight: {
    title: 'Phytophthora Late Blight',
    definition:
      'A destructive fungal pathogen affecting tomatoes and potatoes. Thrives in wet foliage (>85% moisture). Can destroy 90% of harvest in 3 days.',
    nestedTerms: [
      { term: 'Copper Fungicide', explanation: 'Preventative spray that cures Late Blight.' },
    ],
  },
  operating_loan: {
    title: 'Spring Operating Credit Line',
    definition:
      'Short-term working capital borrowed from the bank in Spring to fund seed, fertilizer, and labor. Due in Fall harvest. Unpaid balance rolls over at 18% penalty interest rate!',
    nestedTerms: [
      { term: 'Foreclosure', explanation: 'Triggered if total debt exceeds $250,000.' },
    ],
  },
  shelf_life: {
    title: 'Crop Shelf Life & Field Heat',
    definition:
      'The number of days a crop remains fresh before rotting. Field heat retained at harvest doubles spoilage speed.',
    nestedTerms: [
      { term: 'Hydrocooler', explanation: 'Ice-water blast that strips field heat and doubles shelf life.' },
      { term: 'Cold Storage', explanation: 'Refrigerated warehouse that slows spoilage by 80%.' },
    ],
  },
};

interface NestedTooltipProps {
  termKey: keyof typeof TOOLTIP_DICTIONARY;
  children: React.ReactNode;
}

export const NestedTooltip: React.FC<NestedTooltipProps> = ({ termKey, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeNestedIndex, setActiveNestedIndex] = useState<number | null>(null);

  const def = TOOLTIP_DICTIONARY[termKey];
  if (!def) return <>{children}</>;

  return (
    <span
      className="relative inline-block border-b-2 border-dotted border-amber-400/80 cursor-help"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setActiveNestedIndex(null);
      }}
    >
      {children}

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-stone-900 border border-amber-600/80 rounded-xl p-3.5 shadow-2xl z-50 text-xs text-stone-200 pointer-events-auto space-y-2">
          <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
            <strong className="text-amber-400 font-extrabold">{def.title}</strong>
            <span className="text-[9px] uppercase font-mono text-stone-400">TOOLTIP</span>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">{def.definition}</p>

          {def.nestedTerms && def.nestedTerms.length > 0 && (
            <div className="pt-2 border-t border-stone-800 space-y-1">
              <span className="text-[10px] text-stone-400 font-mono block">Related Terms:</span>
              <div className="flex flex-wrap gap-1.5">
                {def.nestedTerms.map((nested, idx) => (
                  <button
                    key={nested.term}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveNestedIndex(activeNestedIndex === idx ? null : idx);
                    }}
                    className="px-2 py-0.5 rounded bg-stone-950 border border-amber-800 text-[10px] text-amber-300 hover:bg-amber-950 transition font-mono"
                  >
                    {nested.term}
                  </button>
                ))}
              </div>

              {activeNestedIndex !== null && def.nestedTerms[activeNestedIndex] && (
                <div className="mt-2 p-2 bg-stone-950 rounded-lg border border-stone-800 text-[10px] text-stone-300 animate-fadeIn">
                  <strong className="text-emerald-400 block mb-0.5">
                    {def.nestedTerms[activeNestedIndex].term}:
                  </strong>
                  {def.nestedTerms[activeNestedIndex].explanation}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </span>
  );
};
