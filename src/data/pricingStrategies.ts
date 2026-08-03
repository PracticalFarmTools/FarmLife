import type { PricingStrategyConfig } from '../types/game';

export const PRICING_STRATEGIES: PricingStrategyConfig[] = [
  {
    id: 'discount',
    label: 'Value / Discount',
    markupPct: -15, // 15% below base market price
    conversionMultiplier: 2.2, // Huge demand, inventory clears fast
    description: 'Fast liquidation. Attracts high customer volume, but sacrifices profit per unit.',
  },
  {
    id: 'standard',
    label: 'Fair Market',
    markupPct: 20, // 20% standard retail markup
    conversionMultiplier: 1.0, // Baseline demand
    description: 'Balanced strategy. Steady customer volume with solid profit margins.',
  },
  {
    id: 'aggressive',
    label: 'Aggressive Markup',
    markupPct: 50, // +50% markup
    conversionMultiplier: 0.55, // 45% decrease in customer sales rate
    description: 'High margin per sale, but cautious customers buy less frequently.',
  },
  {
    id: 'premium',
    label: 'Artisanal Premium',
    markupPct: 85, // +85% markup
    conversionMultiplier: 0.28, // Low volume
    description: 'Target luxury farmstand shoppers. Very high margin, but slow product movement.',
  },
  {
    id: 'exorbitant',
    label: 'Exorbitant Price Gouge',
    markupPct: 140, // +140% markup
    conversionMultiplier: 0.08, // Very few sales
    description: 'Maximum profit per item, but most shoppers walk away empty-handed.',
  },
];
