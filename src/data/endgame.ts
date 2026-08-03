import type { AutomationTechItem, MacroClimateEvent, PlotAuctionType } from '../types/game';

export const AUTOMATION_TECH_TREE: AutomationTechItem[] = [
  {
    id: 'tech_gps_steering',
    name: 'GPS Auto-Steer Retrofit',
    tier: 1,
    capExCost: 25000,
    dailySoftwareLicenseCost: 15,
    laborFatigueReduction: 0.5,
    laborReplacedCount: 0,
    description:
      'Retrofit existing tractors with GPS. Reduces worker fatigue significantly during long field days, keeping morale high.',
  },
  {
    id: 'tech_automated_packing',
    name: 'Optical Sorter Packing Line',
    tier: 2,
    capExCost: 450000,
    dailySoftwareLicenseCost: 50,
    laborFatigueReduction: 0.0,
    laborReplacedCount: 15,
    description:
      'Replaces 15 manual shed packers with laser-guided conveyors. Unlocks Tier 3 Wholesale buyers.',
  },
  {
    id: 'tech_autonomous_drone_tractor',
    name: 'Level 5 Autonomous Drone Fleet',
    tier: 3,
    capExCost: 1200000,
    dailySoftwareLicenseCost: 250,
    laborFatigueReduction: 1.0,
    laborReplacedCount: 10,
    description:
      'Replaces 10 highly skilled machinery workers. Operates 24/7. High daily software and depreciation costs.',
  },
  {
    id: 'tech_robotic_picker',
    name: 'Robotic Specialty Harvester',
    tier: 4,
    capExCost: 2500000,
    dailySoftwareLicenseCost: 400,
    laborFatigueReduction: 1.0,
    laborReplacedCount: 50,
    description:
      'Completely automates the harvesting of fragile Specialty crops. Replaces 50 manual pickers. Very high maintenance.',
  },
];

export const REAL_ESTATE_MARKET_SETTINGS = {
  neighbor_base_bankruptcy_chance_yearly: 0.05,
  neighbor_drought_multiplier: 3.0,
  neighbor_trade_war_multiplier: 5.0,
  plot_types_for_auction: [
    {
      id: 'plot_small_failing',
      name: 'Failing Smallholding',
      acres: 40,
      soilQualityMultiplier: 0.5,
      baseAuctionStartingBid: 120000,
      description:
        'A poorly managed plot. Cheap, but requires 3 years of soil rehabilitation to be profitable.',
    },
    {
      id: 'plot_massive_corporate',
      name: 'Bankrupt Corporate Parcel',
      acres: 1500,
      soilQualityMultiplier: 1.0,
      baseAuctionStartingBid: 4500000,
      description: 'A massive, ready-to-farm parcel. Requires massive capital to purchase.',
    },
  ] as PlotAuctionType[],
};

export const MACRO_CLIMATE_EVENTS: MacroClimateEvent[] = [
  {
    id: 'climate_warming_trend',
    name: 'Decadal Warming Trend',
    triggerYear: 10,
    droughtProbabilityIncreasePerYear: 0.01,
    growingSeasonShiftDays: -5,
    description:
      'The region is slowly becoming hotter and drier. Growing seasons start earlier, but water becomes dangerously scarce.',
  },
  {
    id: 'climate_extreme_volatility',
    name: 'Jet Stream Instability',
    triggerYear: 20,
    severeWeatherRiskIncrease: 0.05,
    description:
      'Massive increases in severe late-season frosts and summer hail storms. Expect crop insurance premiums to skyrocket.',
  },
];
