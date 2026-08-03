import type { AuctionDeal, MachineryCategory } from '../types/game';

export interface DealershipMachine {
  id: string;
  name: string;
  category: MachineryCategory;
  horsepower: number;
  requiredHp: number;
  price: number;
  usedPrice?: number;
  dailyMaintenanceCost?: number;
  speedMultiplier?: number;
  canPullHeavyImplements?: boolean;
  icon: string;
  description: string;
}

export const DEALERSHIP_CATALOG: DealershipMachine[] = [
  {
    id: 'tractor_light_utility',
    name: 'Utility Tractor (50 HP)',
    category: 'tractor',
    horsepower: 50,
    requiredHp: 0,
    price: 35000,
    usedPrice: 15000,
    dailyMaintenanceCost: 15,
    speedMultiplier: 0.8,
    canPullHeavyImplements: false,
    icon: '🚜',
    description: 'Compact 50 HP utility power unit. Speed: 0.8x. Daily maintenance: $15.',
  },
  {
    id: 'tractor_medium_rowcrop',
    name: 'Row Crop Tractor (150 HP)',
    category: 'tractor',
    horsepower: 150,
    requiredHp: 0,
    price: 120000,
    usedPrice: 50000,
    dailyMaintenanceCost: 45,
    speedMultiplier: 1.0,
    canPullHeavyImplements: false,
    icon: '🚜',
    description: 'Versatile 150 HP row-crop workhorse. Speed: 1.0x. Daily maintenance: $45.',
  },
  {
    id: 'tractor_heavy_articulated',
    name: 'Articulated Heavy (400 HP)',
    category: 'tractor',
    horsepower: 400,
    requiredHp: 0,
    price: 450000,
    usedPrice: 200000,
    dailyMaintenanceCost: 120,
    speedMultiplier: 1.5,
    canPullHeavyImplements: true,
    icon: '🚜',
    description: 'Massive 400 HP articulated heavy power unit. Speed: 1.5x. Required for heavy planters.',
  },
  {
    id: 'implement-seeder',
    name: 'Precision Seed Drill',
    category: 'implement',
    horsepower: 0,
    requiredHp: 100,
    price: 28000,
    icon: '⚙️',
    description: 'High-speed row seeder implement. Requires at least a 100 HP medium tractor.',
  },
  {
    id: 'implement-sprayer',
    name: 'Commercial Boom Sprayer',
    category: 'implement',
    horsepower: 0,
    requiredHp: 50,
    price: 34000,
    icon: '💦',
    description: 'Wide-coverage chemical & fertilizer boom. Fits 50+ HP tractors.',
  },
  {
    id: 'vehicle-pickup',
    name: 'Farmstead Pickup Truck',
    category: 'vehicle',
    horsepower: 300,
    requiredHp: 0,
    price: 42000,
    icon: '🛻',
    description: 'Reliable transport for small farmstand sales and market errands.',
  },
  {
    id: 'vehicle-reefer',
    name: 'Refrigerated Box Truck',
    category: 'vehicle',
    horsepower: 350,
    requiredHp: 0,
    price: 85000,
    icon: '🚛',
    description: 'Cold-chain delivery truck. Essential for preserving perishable berries & tomatoes.',
  },
  {
    id: 'vehicle-semi',
    name: 'Semi-Truck & Grain Hopper',
    category: 'vehicle',
    horsepower: 500,
    requiredHp: 0,
    price: 145000,
    icon: '🚚',
    description: 'Heavy logistics Semi. Unlocks bulk wholesale contract delivery quotas.',
  },
  {
    id: 'harvester-combine',
    name: 'Titan Combine Harvester',
    category: 'harvester',
    horsepower: 450,
    requiredHp: 0,
    price: 450000,
    icon: '🌾',
    description: 'Self-propelled combine harvester. Vital for large-scale grain & tuber harvesting.',
  },
];

export const generateAuctionDeals = (weekSeed: number): AuctionDeal[] => {
  const deals: AuctionDeal[] = [];
  const items = [...DEALERSHIP_CATALOG];
  const selected = items.sort(() => 0.5 - Math.random()).slice(0, 2);

  selected.forEach((item, idx) => {
    const discount = Number((0.35 + Math.random() * 0.25).toFixed(2));
    const engineHours = Math.floor(1200 + Math.random() * 2500);
    const condition = Math.floor(45 + Math.random() * 25);
    const price = item.usedPrice || Math.round(item.price * (1 - discount));

    deals.push({
      id: `auction-${weekSeed}-${idx}-${Date.now()}`,
      name: `[USED] ${item.name}`,
      category: item.category,
      horsepower: item.horsepower,
      requiredHp: item.requiredHp,
      discountPct: Math.round(discount * 100),
      price,
      engineHours,
      initialCondition: condition,
      icon: item.icon,
      description: `Bankruptcy Auction Sale! High engine hours (${engineHours} hrs), initial condition ${condition}%. Requires maintenance.`,
    });
  });

  return deals;
};
