import { create } from 'zustand';
import type {
  AuctionDeal,
  DiseaseId,
  Field,
  FertilizerType,
  FuturesContract,
  GameSpeed,
  GarageLevel,
  GeneticRndState,
  InsuranceTier,
  InventoryItem,
  LedgerEntry,
  MachineryItem,
  MortgageItem,
  NeighborAiFarm,
  NotificationItem,
  OperatingLoan,
  PackingLineType,
  PermanentStaff,
  PricingStrategy,
  Region,
  ScenarioId,
  Season,
  SeasonalWorker,
  SeedVariety,
  StaffRole,
  StorageFacility,
  WeatherForecastDay,
  WeatherType,
  WholesaleContract,
  WorkerHousingLevel,
} from '../types/game';
import { REGIONS } from '../data/regions';
import { CROPS } from '../data/crops';
import { PRICING_STRATEGIES } from '../data/pricingStrategies';
import { FERTILIZERS, DISEASES } from '../data/agronomy';
import { DEALERSHIP_CATALOG } from '../data/machinery';
import { SEED_CATALOG } from '../data/seeds';
import { CAMPAIGN_SCENARIOS } from '../data/scenarios';
import { sound } from '../utils/audio';

interface GameState {
  // Engine & Time
  year: number;
  season: Season;
  dayOfYear: number;
  cash: number;
  netWorth: number;
  gameSpeed: GameSpeed;
  gameStarted: boolean;
  activeTab: 'desk' | 'fields' | 'market' | 'barn' | 'garage' | 'roster' | 'bank' | 'seeds' | 'ledger' | 'endless';

  // Scenario & Campaign Mode
  selectedScenario: ScenarioId;
  csaSubscribers: number;
  csaSatisfaction: number;
  wineGrapesHarvested: number;

  // Environment & Geography
  selectedRegion: Region | null;
  currentWeather: WeatherType;
  weatherForecast: WeatherForecastDay[];
  marketPriceModifiers: Record<string, number>;

  // Holdings & Fleet
  fields: Field[];
  inventory: InventoryItem[];
  wholesaleContracts: WholesaleContract[];
  ledger: LedgerEntry[];
  notifications: NotificationItem[];
  fleet: MachineryItem[];
  auctionDeals: AuctionDeal[];

  // Endless Mode & Neighbor AI Buyouts
  neighborFarms: NeighborAiFarm[];

  // Labor & Permanent Staff
  staff: PermanentStaff[];
  seasonalWorkers: SeasonalWorker[];
  workerHousingLevel: WorkerHousingLevel;
  overtimeActive: boolean;

  // Financials & Risk Management
  operatingLoan: OperatingLoan | null;
  mortgages: MortgageItem[];
  futuresContracts: FuturesContract[];

  // Storage & Cold Chain
  storageFacility: StorageFacility;

  // Seed Genetics & R&D
  seedCatalog: SeedVariety[];
  geneticRnd: GeneticRndState;

  // Infrastructure Upgrades
  barnCapacity: number;
  farmstandLevel: number;
  garageLevel: GarageLevel;

  // Actions
  selectRegion: (regionId: string) => void;
  selectScenario: (scenarioId: ScenarioId) => void;
  setGameSpeed: (speed: GameSpeed) => void;
  setActiveTab: (tab: 'desk' | 'fields' | 'market' | 'barn' | 'garage' | 'roster' | 'bank' | 'seeds' | 'ledger' | 'endless') => void;
  nextDay: () => void;

  // Endless Mode Actions
  buyNeighborAiFarm: (farmId: string) => boolean;
  buyAutonomousDroneTractor: () => boolean;
  deployBiologicalControl: (fieldId: string) => boolean;

  // Seed Genetics & R&D Actions
  buildRndGreenhouse: () => boolean;
  startBreedingProgram: (cropId: string) => boolean;
  buySeedVariety: (fieldId: string, varietyId: string) => boolean;

  // Cold Chain & Storage Actions
  buildHydrocooler: () => boolean;
  buildColdStorage: () => boolean;
  installBackupGenerator: () => boolean;
  upgradePackingLine: (line: PackingLineType) => boolean;
  hydrocoolInventoryItem: (itemId: string) => boolean;
  bookThirdPartyFreight: (contractId: string, quantity: number) => boolean;

  // Field & Agronomy Operations
  plantCrop: (fieldId: string, cropId: string) => boolean;
  harvestCrop: (fieldId: string) => boolean;
  tendField: (fieldId: string, action: 'water' | 'fertilize') => boolean;
  applyFertilizer: (fieldId: string, fertilizerId: FertilizerType) => boolean;
  applyDiseaseTreatment: (fieldId: string, diseaseId: DiseaseId) => boolean;
  applyPreventative: (fieldId: string, preventative: 'copperFungicide' | 'sulfurOil') => boolean;
  installDripIrrigation: (fieldId: string) => boolean;
  installStrawMulch: (fieldId: string) => boolean;
  runSoilTest: (fieldId: string) => boolean;
  buyLand: () => boolean;

  // Financials & Banking Actions
  takeOperatingLoan: (amount: number) => boolean;
  repayOperatingLoan: () => boolean;
  purchaseCropInsurance: (fieldId: string, tier: InsuranceTier) => boolean;
  signFuturesContract: (cropId: string, units: number, pricePerUnit: number) => boolean;
  getDailyBurnRate: () => number;

  // Fleet & Machinery Actions
  buyMachineryDealership: (machineId: string) => boolean;
  buyMachineryAuction: (auctionId: string) => boolean;
  repairMachinery: (machineryId: string) => boolean;
  emergencyFix: (machineryId: string) => boolean;
  upgradeGarage: () => boolean;
  hireCustomHarvester: (fieldId: string) => boolean;

  // Labor & Staff Actions
  hirePermanentStaff: (role: StaffRole) => boolean;
  hireLocalWorker: () => boolean;
  hireH2AContractCrew: () => boolean;
  fireWorker: (workerId: string) => void;
  toggleOvertimeMode: () => void;
  upgradeWorkerHousing: () => boolean;
  assignWorkerToField: (workerId: string, fieldId: string | null) => void;

  // Commerce & Pricing Actions
  setPricingStrategy: (cropId: string, strategy: PricingStrategy) => void;
  sellWholesaleSpot: (cropId: string, quantity: number) => boolean;
  fulfillContract: (contractId: string, quantity: number) => boolean;
  upgradeBarn: () => boolean;
  upgradeFarmstand: () => boolean;
  restartGame: () => void;
}

const getSeasonFromDay = (day: number): Season => {
  if (day <= 90) return 'Spring';
  if (day <= 180) return 'Summer';
  if (day <= 270) return 'Fall';
  return 'Winter';
};

const getRandomWeather = (region: Region, _season: Season): WeatherType => {
  const rand = Math.random();
  let cumulative = 0;
  for (const [weather, prob] of Object.entries(region.weatherProbabilities)) {
    cumulative += prob;
    if (rand <= cumulative) {
      return weather as WeatherType;
    }
  }
  return 'Sunny';
};

const generateForecast = (region: Region, startDay: number, _currentSeason: Season): WeatherForecastDay[] => {
  const forecast: WeatherForecastDay[] = [];
  for (let i = 0; i < 5; i++) {
    const day = startDay + i;
    const s = getSeasonFromDay(day > 365 ? day - 365 : day);
    forecast.push({
      day: day > 365 ? day - 365 : day,
      season: s,
      weather: getRandomWeather(region, s),
    });
  }
  return forecast;
};

const generateNeighborFarms = (): NeighborAiFarm[] => [
  {
    id: 'neighbor-1',
    name: 'Sunny Acres Ranch',
    ownerName: 'Arthur Pendelton',
    acres: 250,
    askingPrice: 850000,
    cropType: 'Corn',
    financialDistressYears: 2,
    isForSale: true,
  },
  {
    id: 'neighbor-2',
    name: 'Valley Ridge Farmstead',
    ownerName: 'Beatrice Vance',
    acres: 500,
    askingPrice: 1600000,
    cropType: 'Soybeans',
    financialDistressYears: 3,
    isForSale: true,
  },
];

export const useGameStore = create<GameState>((set, get) => ({
  year: 1,
  season: 'Spring',
  dayOfYear: 1,
  cash: 100000,
  netWorth: 100000,
  gameSpeed: 0,
  gameStarted: false,
  activeTab: 'desk',

  selectedScenario: 'inherited_acre',
  csaSubscribers: 0,
  csaSatisfaction: 95,
  wineGrapesHarvested: 0,

  selectedRegion: null,
  currentWeather: 'Sunny',
  weatherForecast: [],
  marketPriceModifiers: CROPS.reduce((acc, c) => ({ ...acc, [c.id]: 1.0 }), {}),

  fields: [],
  inventory: [],
  wholesaleContracts: [],
  ledger: [],
  notifications: [],
  fleet: [],
  auctionDeals: [],
  neighborFarms: generateNeighborFarms(),

  staff: [
    {
      id: 'staff-manager',
      name: 'Sarah Vance',
      role: 'farm_manager',
      salaryPerSeason: 12000,
      hired: false,
      avatar: '👩‍💼',
      description: 'Automates sales workflows & boosts field labor efficiency by 20%.',
    },
    {
      id: 'staff-agronomist',
      name: 'Dr. Aris Thorne',
      role: 'agronomist',
      salaryPerSeason: 10000,
      hired: false,
      avatar: '👨‍🔬',
      description: 'Instant free lab soil tests & early warning outbreak alerts.',
    },
    {
      id: 'staff-mechanic',
      name: 'Marcus "Wrench" Miller',
      role: 'chief_mechanic',
      salaryPerSeason: 14000,
      hired: false,
      avatar: '👨‍🔧',
      description: 'Cuts maintenance costs by 30% & repairs breakdowns in 1 day.',
    },
    {
      id: 'staff-geneticist',
      name: 'Dr. Elena Rostova',
      role: 'plant_geneticist',
      salaryPerSeason: 18000,
      hired: false,
      avatar: '🧬',
      description: 'Runs R&D Breeding lab to create custom proprietary seed strains.',
    },
  ],
  seasonalWorkers: [],
  workerHousingLevel: 0,
  overtimeActive: false,

  operatingLoan: null,
  mortgages: [],
  futuresContracts: [],

  storageFacility: {
    hasHydrocooler: false,
    hasColdStorage: false,
    hasBackupGenerator: false,
    packingLine: 'none',
    coldStorageTemp: 34,
    isPowerOutage: false,
  },

  seedCatalog: SEED_CATALOG,
  geneticRnd: {
    hasGreenhouse: false,
    isBreedingActive: false,
    breedingProgressDays: 0,
    targetCropId: null,
    unlockedCustomSeeds: [],
    passiveRoyaltyIncome: 0,
  },

  barnCapacity: 4000,
  farmstandLevel: 1,
  garageLevel: 1,

  selectScenario: (scenarioId: ScenarioId) => {
    const scen = CAMPAIGN_SCENARIOS.find((s) => s.id === scenarioId) || CAMPAIGN_SCENARIOS[0];
    const region = REGIONS.find((r) => r.id === scen.regionId) || REGIONS[0];

    const initialFields: Field[] = Array.from({ length: Math.min(5, Math.ceil(scen.startingAcres / 10)) }, (_, i) => ({
      id: `field-${i + 1}`,
      name: `Plot ${i + 1} (${Math.round(scen.startingAcres / Math.min(5, Math.ceil(scen.startingAcres / 10)))} Acres)`,
      acres: Math.round(scen.startingAcres / Math.min(5, Math.ceil(scen.startingAcres / 10))),
      soilQuality: 75,
      currentCropId: null,
      plantedDay: null,
      growthDays: 0,
      moistureLevel: 75,
      moistureHistory: [75, 75, 75, 75, 75],
      fertilized: false,
      irrigated: false,
      hasDripIrrigation: false,
      hasStrawMulch: false,
      status: 'empty',
      soil: {
        nitrogen: scen.id === 'family_farm_rehab' ? 0 : 65,
        phosphorus: scen.id === 'family_farm_rehab' ? 0 : 60,
        potassium: scen.id === 'family_farm_rehab' ? 0 : 60,
        calcium: 55,
        pH: 6.5,
        surfaceGranular: null,
      },
      activeDiseases: [],
      diseasePreventatives: { copperFungicide: false, sulfurOil: false },
      insuranceTier: 'none',
    }));

    const initialOpLoan = scen.startingDebt > 0
      ? {
          id: `loan-scenario-${Date.now()}`,
          principal: scen.startingDebt,
          interestRate: 0.08,
          dueSeason: 'Fall' as const,
          dueYear: 3,
          isRollover: false,
        }
      : null;

    set({
      selectedScenario: scenarioId,
      selectedRegion: region,
      cash: scen.startingCash,
      operatingLoan: initialOpLoan,
      fields: initialFields,
      gameStarted: true,
      dayOfYear: 1,
      year: 1,
      season: 'Spring',
      csaSubscribers: scenarioId === 'csa_nightmare' ? 500 : 0,
      notifications: [
        {
          id: `scenario-start-${Date.now()}`,
          day: 1,
          season: 'Spring',
          year: 1,
          type: 'info',
          title: `Campaign Started: ${scen.title}`,
          message: `${scen.description}`,
        },
      ],
    });

    sound.playClick();
  },

  selectRegion: (regionId: string) => {
    const region = REGIONS.find((r) => r.id === regionId) || REGIONS[0];
    set({ selectedRegion: region });
  },

  setGameSpeed: (speed: GameSpeed) => {
    set({ gameSpeed: speed });
    sound.playClick();
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
    sound.playClick();
  },

  getDailyBurnRate: () => {
    const state = get();
    const dailyWages = state.seasonalWorkers.reduce((a, b) => a + b.dailyWage, 0);
    const dailyStaffSalaries = state.staff.filter((s) => s.hired).reduce((a, b) => a + b.salaryPerSeason / 90, 0);
    const dailyMortgages = state.mortgages.reduce((a, b) => a + b.dailyPayment, 0);
    const dailyColdStorageOpEx = state.storageFacility.hasColdStorage ? 150 : 0;
    const dailyAutonomousLicenses = state.fleet.filter((m) => m.isAutonomous).length * 100;
    const dailyLandMaint = 30 + state.fields.length * 15;
    return Math.round(dailyWages + dailyStaffSalaries + dailyMortgages + dailyColdStorageOpEx + dailyAutonomousLicenses + dailyLandMaint);
  },

  nextDay: () => {
    const state = get();
    if (!state.selectedRegion || !state.gameStarted) return;

    let newDay = state.dayOfYear + 1;
    let newYear = state.year;
    if (newDay > 365) {
      newDay = 1;
      newYear += 1;
    }

    const newSeason = getSeasonFromDay(newDay);

    // Macro Climate Drift Engine (0.5% drought increase per year)
    let region = { ...state.selectedRegion };
    if (newDay === 1 && newYear > 1) {
      region.weatherProbabilities.Drought = Math.min(0.60, Number((region.weatherProbabilities.Drought + 0.005).toFixed(3)));
    }

    // Update 5-day Weather Forecast
    let updatedForecast = [...state.weatherForecast];
    if (updatedForecast.length > 0) {
      updatedForecast.shift();
      const lastForecastDay = updatedForecast[updatedForecast.length - 1]?.day || newDay + 4;
      const nextForecastDay = lastForecastDay + 1 > 365 ? 1 : lastForecastDay + 1;
      const nextSeason = getSeasonFromDay(nextForecastDay);
      updatedForecast.push({
        day: nextForecastDay,
        season: nextSeason,
        weather: getRandomWeather(region, nextSeason),
      });
    } else {
      updatedForecast = generateForecast(region, newDay, newSeason);
    }

    const newWeather = updatedForecast[0]?.weather || getRandomWeather(region, newSeason);
    let updatedCash = state.cash;
    const newNotifications: NotificationItem[] = [...state.notifications];
    const newLedger: LedgerEntry[] = [...state.ledger];

    // R&D Genetic Breeding Progress
    let rnd = { ...state.geneticRnd };
    if (rnd.isBreedingActive) {
      rnd.breedingProgressDays += 1;
      if (rnd.breedingProgressDays >= 180) {
        rnd.isBreedingActive = false;
        rnd.unlockedCustomSeeds.push(rnd.targetCropId || 'corn');
        rnd.passiveRoyaltyIncome += 250;
      }
    }

    if (rnd.passiveRoyaltyIncome > 0) {
      updatedCash += rnd.passiveRoyaltyIncome;
      newLedger.unshift({
        id: `seed-royalty-${Date.now()}`,
        day: newDay,
        season: newSeason,
        year: newYear,
        description: 'Passive Proprietary Seed Royalty Income',
        amount: rnd.passiveRoyaltyIncome,
        category: 'Seed Royalties',
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // Cold Storage Electricity & Outages
    let facility = { ...state.storageFacility };
    if (facility.hasColdStorage) {
      updatedCash -= 150;
      if (newWeather === 'Storm' && Math.random() < 0.40) {
        if (!facility.hasBackupGenerator) {
          facility.isPowerOutage = true;
          facility.coldStorageTemp = 65;
        } else {
          facility.isPowerOutage = false;
          facility.coldStorageTemp = 34;
        }
      } else {
        facility.isPowerOutage = false;
        facility.coldStorageTemp = 34;
      }
    }

    // Daily Spoilage Decay
    let updatedInventory = [...state.inventory];
    let totalDailySalesRevenue = 0;

    updatedInventory = updatedInventory.map((item) => {
      const crop = CROPS.find((c) => c.id === item.cropId);
      if (!crop || item.quantity <= 0) return item;

      const newDaysInStorage = item.daysInStorage + 1;
      let currentQty = item.quantity;

      if (newDaysInStorage > crop.spoilageDays) {
        let baseSpoilageRate = crop.spoilageRatePerDay;
        if (item.hasFieldHeat && !item.isHydrocooled) baseSpoilageRate *= 2.0;
        if (facility.hasColdStorage && !facility.isPowerOutage) baseSpoilageRate *= 0.20;

        const spoiledAmount = Math.min(currentQty, currentQty * baseSpoilageRate);
        currentQty -= spoiledAmount;
      }

      const strategyConfig =
        PRICING_STRATEGIES.find((s) => s.id === item.pricingStrategy) || PRICING_STRATEGIES[1];
      const marketMod = state.marketPriceModifiers[item.cropId] || 1.0;
      const organicBonus = item.isOrganic ? 1.80 : 1.0;
      const unitRetailPrice = crop.baseSalePrice * marketMod * organicBonus * (1 + strategyConfig.markupPct / 100);

      const baseDailyShoppers = 15 * state.farmstandLevel + Math.floor(Math.random() * 10);
      const unitsSold = Math.min(currentQty, Math.floor(baseDailyShoppers * strategyConfig.conversionMultiplier));

      if (unitsSold > 0) {
        const revenue = Number((unitsSold * unitRetailPrice).toFixed(2));
        totalDailySalesRevenue += revenue;
        currentQty -= unitsSold;
      }

      return { ...item, quantity: Math.max(0, Number(currentQty.toFixed(1))), daysInStorage: newDaysInStorage };
    }).filter((item) => item.quantity > 0.1);

    if (totalDailySalesRevenue > 0) updatedCash += totalDailySalesRevenue;

    const dailyMaint = 30 + state.fields.length * 15;
    updatedCash = Math.max(0, updatedCash - dailyMaint);

    const landValue = state.fields.reduce((acc, f) => acc + f.acres * region.baseLandCost, 0);
    const fleetVal = state.fleet.reduce((acc, m) => acc + m.purchasePrice * (m.condition / 100), 0);
    const inventoryVal = updatedInventory.reduce((acc, item) => {
      const crop = CROPS.find((c) => c.id === item.cropId);
      return acc + item.quantity * (crop?.baseSalePrice || 10);
    }, 0);

    set({
      dayOfYear: newDay,
      season: newSeason,
      year: newYear,
      currentWeather: newWeather,
      selectedRegion: region,
      weatherForecast: updatedForecast,
      cash: Number(updatedCash.toFixed(2)),
      netWorth: Number((updatedCash + landValue + fleetVal + inventoryVal).toFixed(2)),
      storageFacility: facility,
      geneticRnd: rnd,
      inventory: updatedInventory,
      notifications: newNotifications.slice(0, 40),
      ledger: newLedger.slice(0, 100),
    });

    sound.playDayTick();
  },

  buyNeighborAiFarm: (farmId: string) => {
    const state = get();
    const farm = state.neighborFarms.find((f) => f.id === farmId);
    if (!farm || state.cash < farm.askingPrice) return false;

    const newField: Field = {
      id: `field-neighbor-${Date.now()}`,
      name: `${farm.name} Parcel (${farm.acres} Acres)`,
      acres: farm.acres,
      soilQuality: 80,
      currentCropId: null,
      plantedDay: null,
      growthDays: 0,
      moistureLevel: 75,
      moistureHistory: [75, 75, 75, 75, 75],
      fertilized: false,
      irrigated: false,
      hasDripIrrigation: false,
      hasStrawMulch: false,
      status: 'empty',
      soil: { nitrogen: 70, phosphorus: 65, potassium: 65, calcium: 60, pH: 6.5, surfaceGranular: null },
      activeDiseases: [],
      diseasePreventatives: { copperFungicide: false, sulfurOil: false },
      insuranceTier: 'none',
    };

    set({
      cash: Number((state.cash - farm.askingPrice).toFixed(2)),
      fields: [...state.fields, newField],
      neighborFarms: state.neighborFarms.filter((f) => f.id !== farmId),
      ledger: [
        {
          id: `ai-buyout-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Acquired Neighbor AI Farm: ${farm.name}`,
          amount: -farm.askingPrice,
          category: 'Neighbor AI Farm Acquisition',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });

    sound.playCashRegister();
    return true;
  },

  buyAutonomousDroneTractor: () => {
    const state = get();
    const cost = 250000;
    if (state.cash < cost) return false;

    const newDrone: MachineryItem = {
      id: `drone-${Date.now()}`,
      name: 'Autonomous AI Drone Tractor (500 HP)',
      category: 'autonomous_drone',
      horsepower: 500,
      requiredHp: 0,
      condition: 100,
      engineHours: 0,
      purchasePrice: cost,
      purchasedFrom: 'dealership',
      warrantyDaysRemaining: 1095,
      status: 'available',
      repairDaysRemaining: 0,
      icon: '🤖',
      description: 'Fully autonomous GPS-guided robotic tractor. 0 worker labor required! $100/day software license.',
      isAutonomous: true,
      softwareLicenseFeePerDay: 100,
    };

    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fleet: [...state.fleet, newDrone],
      ledger: [
        {
          id: `drone-buy-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: 'Purchased Autonomous AI Drone Tractor',
          amount: -cost,
          category: 'Equipment CapEx',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });

    sound.playCashRegister();
    return true;
  },

  deployBiologicalControl: (_fieldId: string) => {
    const state = get();
    if (state.cash < 8000) return false;

    set({
      cash: Number((state.cash - 8000).toFixed(2)),
      ledger: [
        {
          id: `ladybugs-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: 'Deployed Ladybugs Biological Aphid Control',
          amount: -8000,
          category: 'Biological Control',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });

    sound.playClick();
    return true;
  },

  buildRndGreenhouse: () => {
    const state = get();
    if (state.cash < 50000 || state.geneticRnd.hasGreenhouse) return false;
    set({
      cash: Number((state.cash - 50000).toFixed(2)),
      geneticRnd: { ...state.geneticRnd, hasGreenhouse: true },
    });
    sound.playCashRegister();
    return true;
  },

  startBreedingProgram: (cropId: string) => {
    const state = get();
    set({
      geneticRnd: { ...state.geneticRnd, isBreedingActive: true, breedingProgressDays: 0, targetCropId: cropId },
    });
    sound.playClick();
    return true;
  },

  buySeedVariety: (fieldId: string, varietyId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    const variety = SEED_CATALOG.find((v) => v.id === varietyId);
    if (!field || !variety) return false;

    const cost = (variety.costPerAcre + variety.techFeePerAcre) * field.acres;
    if (state.cash < cost) return false;

    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: state.fields.map((f) => (f.id === fieldId ? { ...f, seedVarietyId: variety.id, currentCropId: variety.cropId } : f)),
    });
    sound.playClick();
    return true;
  },

  buildHydrocooler: () => {
    const state = get();
    if (state.cash < 22000) return false;
    set({ cash: Number((state.cash - 22000).toFixed(2)), storageFacility: { ...state.storageFacility, hasHydrocooler: true } });
    sound.playCashRegister();
    return true;
  },

  buildColdStorage: () => {
    const state = get();
    if (state.cash < 35000) return false;
    set({ cash: Number((state.cash - 35000).toFixed(2)), storageFacility: { ...state.storageFacility, hasColdStorage: true } });
    sound.playCashRegister();
    return true;
  },

  installBackupGenerator: () => {
    const state = get();
    if (state.cash < 8000) return false;
    set({ cash: Number((state.cash - 8000).toFixed(2)), storageFacility: { ...state.storageFacility, hasBackupGenerator: true } });
    sound.playCashRegister();
    return true;
  },

  upgradePackingLine: (line: PackingLineType) => {
    const state = get();
    const cost = line === 'manual_shed' ? 6000 : 65000;
    if (state.cash < cost) return false;
    set({ cash: Number((state.cash - cost).toFixed(2)), storageFacility: { ...state.storageFacility, packingLine: line } });
    sound.playCashRegister();
    return true;
  },

  hydrocoolInventoryItem: (itemId: string) => {
    const state = get();
    set({ inventory: state.inventory.map((i) => (i.id === itemId ? { ...i, isHydrocooled: true, hasFieldHeat: false } : i)) });
    sound.playClick();
    return true;
  },

  bookThirdPartyFreight: (contractId: string, quantity: number) => {
    const state = get();
    if (state.cash < 1200) return false;
    const ok = state.fulfillContract(contractId, quantity);
    if (!ok) return false;
    set({ cash: Number((get().cash - 1200).toFixed(2)) });
    sound.playClick();
    return true;
  },

  plantCrop: (fieldId: string, cropId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    const crop = CROPS.find((c) => c.id === cropId);
    if (!field || !crop || field.status !== 'empty' || state.cash < crop.seedCostPerAcre * field.acres) return false;

    const seedCost = crop.seedCostPerAcre * field.acres;
    set({
      cash: Number((state.cash - seedCost).toFixed(2)),
      fields: state.fields.map((f) => (f.id === fieldId ? { ...f, currentCropId: crop.id, plantedDay: state.dayOfYear, growthDays: 0, status: 'growing' as const } : f)),
    });
    sound.playClick();
    return true;
  },

  harvestCrop: (fieldId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field || field.status !== 'ready' || !field.currentCropId) return false;

    const crop = CROPS.find((c) => c.id === field.currentCropId);
    if (!crop) return false;

    const rawYield = field.acres * crop.expectedYieldPerAcre * (field.soilQuality / 100);
    const harvestQuantity = Number(rawYield.toFixed(1));

    const updatedInventory = [...state.inventory];
    updatedInventory.push({
      id: `inv-${Date.now()}`,
      cropId: crop.id,
      cropName: crop.name,
      quantity: harvestQuantity,
      quality: field.soilQuality,
      harvestDay: state.dayOfYear,
      daysInStorage: 0,
      pricingStrategy: 'standard',
      hasFieldHeat: true,
      isHydrocooled: false,
      grade: 'A',
    });

    set({
      fields: state.fields.map((f) => (f.id === fieldId ? { ...f, currentCropId: null, plantedDay: null, growthDays: 0, status: 'empty' as const } : f)),
      inventory: updatedInventory,
    });
    sound.playHarvest();
    return true;
  },

  tendField: (fieldId: string, action: 'water' | 'fertilize') => {
    const state = get();
    const cost = action === 'fertilize' ? 150 : 30;
    if (state.cash < cost) return false;
    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: state.fields.map((f) => (f.id === fieldId ? (action === 'water' ? { ...f, moistureLevel: 100 } : { ...f, fertilized: true }) : f)),
    });
    sound.playClick();
    return true;
  },

  applyFertilizer: (fieldId: string, fertilizerId: FertilizerType) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    const fert = FERTILIZERS.find((f) => f.id === fertilizerId);
    if (!field || !fert || state.cash < fert.costPerAcre * field.acres) return false;

    const cost = fert.costPerAcre * field.acres;
    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: state.fields.map((f) => {
        if (f.id !== fieldId) return f;
        const soil = { ...f.soil };
        soil.nitrogen = Math.min(100, soil.nitrogen + fert.nGain);
        return { ...f, soil };
      }),
    });
    sound.playClick();
    return true;
  },

  applyDiseaseTreatment: (fieldId: string, diseaseId: DiseaseId) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    const disease = DISEASES.find((d) => d.id === diseaseId);
    if (!field || !disease || state.cash < disease.treatmentCostPerAcre * field.acres) return false;

    const cost = disease.treatmentCostPerAcre * field.acres;
    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: state.fields.map((f) => (f.id === fieldId ? { ...f, activeDiseases: f.activeDiseases.filter((d) => d !== diseaseId) } : f)),
    });
    sound.playClick();
    return true;
  },

  applyPreventative: (fieldId: string, preventative: 'copperFungicide' | 'sulfurOil') => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field) return false;
    const cost = preventative === 'copperFungicide' ? 140 * field.acres : 90 * field.acres;
    if (state.cash < cost) return false;
    set({ cash: Number((state.cash - cost).toFixed(2)) });
    sound.playClick();
    return true;
  },

  installDripIrrigation: (fieldId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field || state.cash < 1200 * field.acres) return false;
    set({ cash: Number((state.cash - 1200 * field.acres).toFixed(2)), fields: state.fields.map((f) => (f.id === fieldId ? { ...f, hasDripIrrigation: true } : f)) });
    sound.playCashRegister();
    return true;
  },

  installStrawMulch: (_fieldId: string) => {
    const state = get();
    if (state.cash < 200) return false;
    set({ cash: Number((state.cash - 200).toFixed(2)) });
    sound.playClick();
    return true;
  },

  runSoilTest: (_fieldId: string) => {
    const state = get();
    if (state.cash < 150) return false;
    set({ cash: Number((state.cash - 150).toFixed(2)) });
    sound.playClick();
    return true;
  },

  buyLand: () => {
    const state = get();
    if (!state.selectedRegion || state.cash < state.selectedRegion.baseLandCost * 10) return false;
    const cost = state.selectedRegion.baseLandCost * 10;
    set({ cash: Number((state.cash - cost).toFixed(2)) });
    sound.playCashRegister();
    return true;
  },

  takeOperatingLoan: (amount: number) => {
    const state = get();
    if (state.operatingLoan) return false;
    set({ cash: Number((state.cash + amount).toFixed(2)), operatingLoan: { id: `loan-${Date.now()}`, principal: amount, interestRate: 0.08, dueSeason: 'Fall', dueYear: state.year, isRollover: false } });
    sound.playCashRegister();
    return true;
  },

  repayOperatingLoan: () => {
    const state = get();
    if (!state.operatingLoan) return false;
    const owed = Math.round(state.operatingLoan.principal * 1.08);
    if (state.cash < owed) return false;
    set({ cash: Number((state.cash - owed).toFixed(2)), operatingLoan: null });
    sound.playCashRegister();
    return true;
  },

  purchaseCropInsurance: (fieldId: string, tier: InsuranceTier) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field) return false;
    const cost = tier === 'catastrophic' ? 30 * field.acres : tier === 'premium' ? 100 * field.acres : 0;
    if (state.cash < cost) return false;
    set({ cash: Number((state.cash - cost).toFixed(2)), fields: state.fields.map((f) => (f.id === fieldId ? { ...f, insuranceTier: tier } : f)) });
    sound.playClick();
    return true;
  },

  signFuturesContract: (cropId: string, units: number, pricePerUnit: number) => {
    const state = get();
    set({ futuresContracts: [...state.futuresContracts, { id: `futures-${Date.now()}`, cropId, cropName: cropId, unitsQuantity: units, lockedPricePerUnit: pricePerUnit, deliverySeason: 'Fall', deliveryYear: state.year, fulfilled: false }] });
    sound.playClick();
    return true;
  },

  hirePermanentStaff: (role: StaffRole) => {
    const state = get();
    const target = state.staff.find((s) => s.role === role);
    if (!target || target.hired || state.cash < target.salaryPerSeason) return false;
    set({ cash: Number((state.cash - target.salaryPerSeason).toFixed(2)), staff: state.staff.map((s) => (s.role === role ? { ...s, hired: true } : s)) });
    sound.playCashRegister();
    return true;
  },

  hireLocalWorker: () => {
    const state = get();
    set({ seasonalWorkers: [...state.seasonalWorkers, { id: `w-${Date.now()}`, name: 'Local Worker', type: 'local', dailyWage: 120, fatigue: 0, morale: 80, handPickingSkill: 3, heavyMachinerySkill: 2, packingSkill: 3, avatar: '🧑‍🌾', assignedFieldId: null, yearsWithFarm: 1 }] });
    sound.playClick();
    return true;
  },

  hireH2AContractCrew: () => {
    const state = get();
    if (state.workerHousingLevel === 0) return false;
    set({ seasonalWorkers: [...state.seasonalWorkers, { id: `h2a-${Date.now()}`, name: 'H-2A Crew', type: 'h2a_contract', dailyWage: 160, fatigue: 0, morale: 95, handPickingSkill: 4, heavyMachinerySkill: 4, packingSkill: 4, avatar: '👷', assignedFieldId: null, yearsWithFarm: 1 }] });
    sound.playClick();
    return true;
  },

  fireWorker: (workerId: string) => {
    const state = get();
    set({ seasonalWorkers: state.seasonalWorkers.filter((w) => w.id !== workerId) });
    sound.playClick();
  },

  toggleOvertimeMode: () => {
    const state = get();
    set({ overtimeActive: !state.overtimeActive });
    sound.playClick();
  },

  upgradeWorkerHousing: () => {
    const state = get();
    if (state.workerHousingLevel >= 3 || state.cash < 5000) return false;
    set({ cash: Number((state.cash - 5000).toFixed(2)), workerHousingLevel: (state.workerHousingLevel + 1) as WorkerHousingLevel });
    sound.playCashRegister();
    return true;
  },

  assignWorkerToField: (workerId: string, fieldId: string | null) => {
    const state = get();
    set({ seasonalWorkers: state.seasonalWorkers.map((w) => (w.id === workerId ? { ...w, assignedFieldId: fieldId } : w)) });
    sound.playClick();
  },

  buyMachineryDealership: (machineId: string) => {
    const state = get();
    const item = DEALERSHIP_CATALOG.find((m) => m.id === machineId);
    if (!item || state.cash < item.price) return false;
    set({ cash: Number((state.cash - item.price).toFixed(2)), fleet: [...state.fleet, { id: `m-${Date.now()}`, name: item.name, category: item.category, horsepower: item.horsepower, requiredHp: item.requiredHp, condition: 100, engineHours: 0, purchasePrice: item.price, purchasedFrom: 'dealership', warrantyDaysRemaining: 1095, status: 'available', repairDaysRemaining: 0, icon: item.icon, description: item.description }] });
    sound.playCashRegister();
    return true;
  },

  buyMachineryAuction: (auctionId: string) => {
    const state = get();
    const deal = state.auctionDeals.find((a) => a.id === auctionId);
    if (!deal || state.cash < deal.price) return false;
    set({ cash: Number((state.cash - deal.price).toFixed(2)), fleet: [...state.fleet, { id: `m-auc-${Date.now()}`, name: deal.name, category: deal.category, horsepower: deal.horsepower, requiredHp: deal.requiredHp, condition: deal.initialCondition, engineHours: deal.engineHours, purchasePrice: deal.price, purchasedFrom: 'auction', warrantyDaysRemaining: 0, status: 'available', repairDaysRemaining: 0, icon: deal.icon, description: deal.description }], auctionDeals: state.auctionDeals.filter((a) => a.id !== auctionId) });
    sound.playCashRegister();
    return true;
  },

  repairMachinery: (machineryId: string) => {
    const state = get();
    set({ fleet: state.fleet.map((m) => (m.id === machineryId ? { ...m, status: 'in_shop' as const, repairDaysRemaining: 1 } : m)) });
    sound.playClick();
    return true;
  },

  emergencyFix: (machineryId: string) => {
    const state = get();
    if (state.cash < 1500) return false;
    set({ cash: Number((state.cash - 1500).toFixed(2)), fleet: state.fleet.map((m) => (m.id === machineryId ? { ...m, status: 'available' as const, condition: 85, repairDaysRemaining: 0 } : m)) });
    sound.playClick();
    return true;
  },

  upgradeGarage: () => {
    const state = get();
    if (state.cash < 15000) return false;
    set({ cash: Number((state.cash - 15000).toFixed(2)), garageLevel: (state.garageLevel + 1) as GarageLevel });
    sound.playCashRegister();
    return true;
  },

  hireCustomHarvester: (fieldId: string) => {
    const state = get();
    if (state.cash < 4000) return false;
    state.harvestCrop(fieldId);
    set({ cash: Number((get().cash - 4000).toFixed(2)) });
    sound.playHarvest();
    return true;
  },

  setPricingStrategy: (cropId: string, strategy: PricingStrategy) => {
    const state = get();
    set({ inventory: state.inventory.map((i) => (i.cropId === cropId ? { ...i, pricingStrategy: strategy } : i)) });
    sound.playClick();
  },

  sellWholesaleSpot: (cropId: string, quantity: number) => {
    const state = get();
    const item = state.inventory.find((i) => i.cropId === cropId);
    if (!item || item.quantity < quantity) return false;
    const rev = Number((quantity * 10).toFixed(2));
    set({ cash: Number((state.cash + rev).toFixed(2)), inventory: state.inventory.map((i) => (i.cropId === cropId ? { ...i, quantity: i.quantity - quantity } : i)).filter((i) => i.quantity > 0.1) });
    sound.playCashRegister();
    return true;
  },

  fulfillContract: (contractId: string, quantity: number) => {
    const state = get();
    const contract = state.wholesaleContracts.find((c) => c.id === contractId);
    if (!contract) return false;
    const rev = Number((quantity * contract.contractPricePerUnit).toFixed(2));
    set({ cash: Number((state.cash + rev).toFixed(2)) });
    sound.playCashRegister();
    return true;
  },

  upgradeBarn: () => {
    const state = get();
    if (state.cash < 8000) return false;
    set({ cash: Number((state.cash - 8000).toFixed(2)), barnCapacity: state.barnCapacity + 4000 });
    sound.playCashRegister();
    return true;
  },

  upgradeFarmstand: () => {
    const state = get();
    if (state.cash < 5000) return false;
    set({ cash: Number((state.cash - 5000).toFixed(2)), farmstandLevel: state.farmstandLevel + 1 });
    sound.playCashRegister();
    return true;
  },

  restartGame: () => {
    set({
      year: 1,
      season: 'Spring',
      dayOfYear: 1,
      cash: 100000,
      netWorth: 100000,
      gameSpeed: 0,
      gameStarted: false,
      selectedRegion: null,
      fields: [],
      inventory: [],
      wholesaleContracts: [],
      ledger: [],
      notifications: [],
      weatherForecast: [],
      fleet: [],
      auctionDeals: [],
      seasonalWorkers: [],
      workerHousingLevel: 0,
      overtimeActive: false,
      operatingLoan: null,
      mortgages: [],
      futuresContracts: [],
      storageFacility: {
        hasHydrocooler: false,
        hasColdStorage: false,
        hasBackupGenerator: false,
        packingLine: 'none',
        coldStorageTemp: 34,
        isPowerOutage: false,
      },
      seedCatalog: SEED_CATALOG,
      geneticRnd: {
        hasGreenhouse: false,
        isBreedingActive: false,
        breedingProgressDays: 0,
        targetCropId: null,
        unlockedCustomSeeds: [],
        passiveRoyaltyIncome: 0,
      },
      garageLevel: 1,
      activeTab: 'desk',
    });
  },
}));
