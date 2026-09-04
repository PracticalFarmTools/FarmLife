import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  isVictory: boolean;
  isGameOver: boolean;
  gameOverReason: string | null;
  isEndlessMode: boolean;
  consecutiveNegativeCashDays: number;
  fastForwardAlert: string | null;

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
  dismissVictory: () => void;
  dismissGameOver: () => void;
  clearFastForwardAlert: () => void;
  advanceMultipleDays: (days: number) => { daysAdvanced: number; stoppedReason?: string };
  advanceToNextHarvest: () => { daysAdvanced: number; stoppedReason?: string };

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
  certifyFieldOrganic: (fieldId: string) => boolean;
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

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
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
      isVictory: false,
      isGameOver: false,
      gameOverReason: null,
      isEndlessMode: false,
      consecutiveNegativeCashDays: 0,
      fastForwardAlert: null,

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
      csaSatisfaction: 95,
      wineGrapesHarvested: 0,
      isVictory: false,
      isGameOver: false,
      gameOverReason: null,
      isEndlessMode: scenarioId === 'free_play',
      consecutiveNegativeCashDays: 0,
      fastForwardAlert: null,
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
    const initialFields: Field[] = Array.from({ length: 3 }, (_, i) => ({
      id: `field-sandbox-${i + 1}`,
      name: `Plot ${i + 1} (20 Acres)`,
      acres: 20,
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
      soil: { nitrogen: 65, phosphorus: 60, potassium: 60, calcium: 55, pH: 6.5, surfaceGranular: null },
      activeDiseases: [],
      diseasePreventatives: { copperFungicide: false, sulfurOil: false },
      insuranceTier: 'none',
    }));

    set({
      selectedRegion: region,
      selectedScenario: 'free_play',
      cash: 100000,
      operatingLoan: null,
      fields: initialFields,
      gameStarted: true,
      dayOfYear: 1,
      year: 1,
      season: 'Spring',
      csaSubscribers: 0,
      csaSatisfaction: 95,
      wineGrapesHarvested: 0,
      isVictory: false,
      isGameOver: false,
      gameOverReason: null,
      isEndlessMode: true,
      consecutiveNegativeCashDays: 0,
      fastForwardAlert: null,
      notifications: [
        {
          id: `sandbox-start-${Date.now()}`,
          day: 1,
          season: 'Spring',
          year: 1,
          type: 'info',
          title: `Sandbox Started: ${region.name}`,
          message: `Free-play sandbox initiated with $100,000 working capital and 60 acres in ${region.name}.`,
        },
      ],
    });
    sound.playClick();
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
    const dailyWages = state.seasonalWorkers.reduce(
      (a, b) => a + (state.overtimeActive ? b.dailyWage * 1.5 : b.dailyWage),
      0
    );
    const dailyStaffSalaries = state.staff.filter((s) => s.hired).reduce((a, b) => a + b.salaryPerSeason / 90, 0);
    const dailyMortgages = state.mortgages.reduce((a, b) => a + b.dailyPayment, 0);
    const dailyColdStorageOpEx = state.storageFacility.hasColdStorage ? 150 : 0;
    const dailyAutonomousLicenses = state.fleet.filter((m) => m.isAutonomous).length * 100;
    const dailyLandMaint = 30 + state.fields.length * 15;
    const dailyLoanInterest = state.operatingLoan
      ? (state.operatingLoan.principal * state.operatingLoan.interestRate) / 365
      : 0;
    return Math.round(
      dailyWages +
        dailyStaffSalaries +
        dailyMortgages +
        dailyColdStorageOpEx +
        dailyAutonomousLicenses +
        dailyLandMaint +
        dailyLoanInterest
    );
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
      region.weatherProbabilities.Drought = Math.min(
        0.6,
        Number((region.weatherProbabilities.Drought + 0.005).toFixed(3))
      );
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

    // ==========================================
    // 1. FIELDS SIMULATION & AGRONOMIC HEARTBEAT
    // ==========================================
    const updatedFields: Field[] = state.fields.map((field) => {
      const f: Field = {
        ...field,
        soil: { ...field.soil },
        activeDiseases: [...field.activeDiseases],
        diseasePreventatives: { ...field.diseasePreventatives },
      };

      // --- Soil Moisture Dynamics ---
      let moistureDelta = 0;
      switch (newWeather) {
        case 'Rainy':
          moistureDelta = 30;
          break;
        case 'Storm':
          moistureDelta = 45;
          break;
        case 'Sunny':
          moistureDelta = f.hasStrawMulch || f.hasDripIrrigation ? -5 : -10;
          break;
        case 'Drought':
          moistureDelta = f.hasStrawMulch || f.hasDripIrrigation ? -8 : -18;
          break;
        case 'Frost':
          moistureDelta = -4;
          break;
      }

      let newMoisture = Math.max(5, Math.min(100, f.moistureLevel + moistureDelta));
      if (f.hasDripIrrigation) {
        newMoisture = Math.max(60, newMoisture); // Drip maintains baseline 60%
      }
      f.moistureLevel = newMoisture;
      f.moistureHistory = [...f.moistureHistory.slice(-4), newMoisture];

      // --- Surface Granular Fertilizer Integration ---
      if (f.soil.surfaceGranular && (newWeather === 'Rainy' || newWeather === 'Storm' || f.hasDripIrrigation)) {
        const gran = f.soil.surfaceGranular;
        f.soil.nitrogen = Math.min(100, f.soil.nitrogen + gran.n);
        f.soil.phosphorus = Math.min(100, f.soil.phosphorus + gran.p);
        f.soil.potassium = Math.min(100, f.soil.potassium + gran.k);
        f.soil.calcium = Math.min(100, f.soil.calcium + gran.ca);
        f.soil.pH = Math.max(4.5, Math.min(8.5, Number((f.soil.pH + gran.ph).toFixed(1))));
        f.soil.surfaceGranular = null;
        newNotifications.unshift({
          id: `fert-integrate-${Date.now()}-${f.id}`,
          day: newDay,
          season: newSeason,
          year: newYear,
          type: 'success',
          title: `Fertilizer Dissolved: ${f.name}`,
          message: `Rain/Irrigation dissolved surface granular fertilizer into root soil!`,
        });
      }

      // --- Crop Growth Advancement & Nutrient Consumption ---
      if (f.status === 'growing' && f.currentCropId) {
        const crop = CROPS.find((c) => c.id === f.currentCropId);
        if (crop) {
          // Growth speed multiplier based on stress/vitality
          let growthMultiplier = 1.0;

          // Soil moisture stress
          if (newMoisture < 25) {
            growthMultiplier *= 0.5; // Drought stunt
          } else if (newMoisture > 88) {
            growthMultiplier *= 0.7; // Waterlogging stunt
          } else if (newMoisture >= 45 && newMoisture <= 75) {
            growthMultiplier *= 1.1; // Optimal moisture bonus
          }

          const nDep = crop.nDepletionPerDay ?? 1.0;
          const pDep = crop.pDepletionPerDay ?? 0.4;
          const kDep = crop.kDepletionPerDay ?? 0.4;
          const phMin = crop.optimalPhMin ?? crop.idealPHMin ?? 5.5;
          const phMax = crop.optimalPhMax ?? crop.idealPHMax ?? 7.5;

          // Nutrient stress
          if (f.soil.nitrogen < 20 && nDep > 0) {
            growthMultiplier *= 0.5; // Nitrogen deficiency
          }
          if (f.soil.pH < phMin || f.soil.pH > phMax) {
            growthMultiplier *= 0.8; // pH lockout
          }

          // Active disease penalty
          if (f.activeDiseases.length > 0) {
            growthMultiplier *= 0.6;
          }

          // Overtime boost
          if (state.overtimeActive) {
            growthMultiplier *= 1.3;
          }

          // Advance growth days
          f.growthDays = Number((f.growthDays + growthMultiplier).toFixed(1));

          // Deplete Soil Nutrients daily per acre
          f.soil.nitrogen = Math.max(0, Number((f.soil.nitrogen - nDep).toFixed(1)));
          f.soil.phosphorus = Math.max(0, Number((f.soil.phosphorus - pDep).toFixed(1)));
          f.soil.potassium = Math.max(0, Number((f.soil.potassium - kDep).toFixed(1)));

          // Check Maturity
          if (f.growthDays >= crop.daysToMaturity) {
            f.status = 'ready';
            newNotifications.unshift({
              id: `harvest-ready-${Date.now()}-${f.id}`,
              day: newDay,
              season: newSeason,
              year: newYear,
              type: 'success',
              title: `🌾 Harvest Ready: ${f.name}`,
              message: `${crop.name} is fully mature! Harvest now to avoid post-maturity rot.`,
            });
          }

          // --- Disease Outbreak Simulation ---
          // Preventative wear: copper fungicide washes off after heavy rains
          if (newWeather === 'Rainy' || newWeather === 'Storm') {
            if (f.diseasePreventatives.copperFungicide) {
              f.diseasePreventatives.copperFungicide = false;
            }
          }

          // Check Late Blight
          if (
            (crop.id === 'crop_tomato_heirloom' || crop.id === 'crop_potato_russet') &&
            newMoisture >= 85 &&
            (newWeather === 'Rainy' || newWeather === 'Storm') &&
            !f.activeDiseases.includes('disease_late_blight')
          ) {
            if (!field.diseasePreventatives.copperFungicide && Math.random() < 0.35) {
              f.activeDiseases.push('disease_late_blight');
              newNotifications.unshift({
                id: `blight-${Date.now()}-${f.id}`,
                day: newDay,
                season: newSeason,
                year: newYear,
                type: 'error',
                title: `⚠️ Blight Outbreak: ${f.name}`,
                message: `Phytophthora Late Blight broke out on wet foliage! Yield is degrading 15%/day.`,
              });
            }
          }

          // Check Powdery Mildew
          if (
            (crop.id === 'crop_strawberries' || crop.id === 'crop_tomato_heirloom') &&
            (newWeather === 'Drought' || (newMoisture <= 25 && newWeather === 'Sunny')) &&
            !f.activeDiseases.includes('disease_powdery_mildew')
          ) {
            if (!field.diseasePreventatives.sulfurOil && Math.random() < 0.3) {
              f.activeDiseases.push('disease_powdery_mildew');
              newNotifications.unshift({
                id: `mildew-${Date.now()}-${f.id}`,
                day: newDay,
                season: newSeason,
                year: newYear,
                type: 'warning',
                title: `⚠️ Powdery Mildew: ${f.name}`,
                message: `Powdery Mildew coating leaves in dry heat. Treat with Elemental Sulfur spray.`,
              });
            }
          }

          // Check Clubroot on Brassicas in acidic wet soil
          if (
            crop.category === 'Brassica' &&
            f.soil.pH < 6.0 &&
            newMoisture >= 70 &&
            !f.activeDiseases.includes('disease_clubroot')
          ) {
            if (Math.random() < 0.3) {
              f.activeDiseases.push('disease_clubroot');
              newNotifications.unshift({
                id: `clubroot-${Date.now()}-${f.id}`,
                day: newDay,
                season: newSeason,
                year: newYear,
                type: 'error',
                title: `⚠️ Clubroot Outbreak: ${f.name}`,
                message: `Clubroot fungus attacking root system due to acidic soil (pH < 6.0)! Apply Dolomitic Lime.`,
              });
            }
          }

          // Check Frost Kill
          if (newWeather === 'Frost' && !crop.idealSeasons.includes('Winter')) {
            if (crop.category === 'Specialty' || crop.category === 'Fruit') {
              f.soilQuality = Math.max(30, f.soilQuality - 10);
              newNotifications.unshift({
                id: `frost-damage-${Date.now()}-${f.id}`,
                day: newDay,
                season: newSeason,
                year: newYear,
                type: 'warning',
                title: `❄️ Frost Damage on ${f.name}`,
                message: `Sudden frost singed tender foliage, reducing yield quality.`,
              });
            }
          }
        }
      }

      return f;
    });

    // ==========================================
    // 2. FLEET & WORKSHOP REPAIRS
    // ==========================================
    const updatedFleet: MachineryItem[] = state.fleet.map((machine) => {
      const m = { ...machine };
      if (m.status === 'in_shop') {
        const remaining = m.repairDaysRemaining - 1;
        if (remaining <= 0) {
          m.status = 'available';
          m.condition = 100;
          m.repairDaysRemaining = 0;
          newNotifications.unshift({
            id: `repair-done-${Date.now()}-${m.id}`,
            day: newDay,
            season: newSeason,
            year: newYear,
            type: 'success',
            title: `🔧 Equipment Repaired: ${m.name}`,
            message: `Workshop mechanics completed maintenance. Condition restored to 100%.`,
          });
        } else {
          m.repairDaysRemaining = remaining;
        }
      }

      m.warrantyDaysRemaining = Math.max(0, m.warrantyDaysRemaining - 1);

      // Natural wear from active farm operations
      if (m.status === 'available') {
        m.condition = Math.max(10, Number((m.condition - 0.2).toFixed(1)));
        if (m.condition < 25 && Math.random() < 0.1) {
          m.status = 'broken_down';
          newNotifications.unshift({
            id: `breakdown-${Date.now()}-${m.id}`,
            day: newDay,
            season: newSeason,
            year: newYear,
            type: 'error',
            title: `🚨 Breakdown: ${m.name}`,
            message: `Equipment broke down in field due to critical wear! Dispatch for repair immediately.`,
          });
        }
      }

      return m;
    });

    // ==========================================
    // 3. LABOR, FATIGUE & OVERTIME TICK
    // ==========================================
    const updatedWorkers: SeasonalWorker[] = state.seasonalWorkers.map((w) => {
      const worker = { ...w };
      if (state.overtimeActive) {
        worker.fatigue = Math.min(100, worker.fatigue + 12);
        worker.morale = Math.max(10, worker.morale - 6);
      } else {
        const housingMoraleBonus = state.workerHousingLevel * 2;
        worker.fatigue = Math.max(0, worker.fatigue - 10);
        worker.morale = Math.min(100, worker.morale + 1 + housingMoraleBonus);
      }
      return worker;
    });

    // ==========================================
    // 4. DAILY CASH BURN & PAYROLL DEDUCTION
    // ==========================================
    const dailyWages = updatedWorkers.reduce(
      (a, b) => a + (state.overtimeActive ? b.dailyWage * 1.5 : b.dailyWage),
      0
    );
    const dailyStaffSalaries = state.staff.filter((s) => s.hired).reduce((a, b) => a + b.salaryPerSeason / 90, 0);
    const dailyMortgages = state.mortgages.reduce((a, b) => a + b.dailyPayment, 0);
    const dailyAutonomousLicenses = updatedFleet.filter((m) => m.isAutonomous).length * 100;
    const dailyColdStorageOpEx = state.storageFacility.hasColdStorage ? 150 : 0;
    const dailyLandMaint = 30 + updatedFields.length * 15;
    const dailyLoanInterest = state.operatingLoan
      ? (state.operatingLoan.principal * state.operatingLoan.interestRate) / 365
      : 0;

    const totalDailyOpEx = Math.round(
      dailyWages +
        dailyStaffSalaries +
        dailyMortgages +
        dailyAutonomousLicenses +
        dailyColdStorageOpEx +
        dailyLandMaint +
        dailyLoanInterest
    );

    updatedCash -= totalDailyOpEx;

    // Record daily burn in ledger
    newLedger.unshift({
      id: `daily-burn-${Date.now()}`,
      day: newDay,
      season: newSeason,
      year: newYear,
      description: `Daily Operational Burn (Wages $${Math.round(dailyWages)}, Staff $${Math.round(dailyStaffSalaries)}, Maint $${Math.round(dailyLandMaint)}, Power $${dailyColdStorageOpEx})`,
      amount: -totalDailyOpEx,
      category: 'Maintenance',
      timestamp: new Date().toLocaleTimeString(),
    });

    // Cash Deficit Warning
    if (updatedCash < 0) {
      newNotifications.unshift({
        id: `overdraft-${Date.now()}`,
        day: newDay,
        season: newSeason,
        year: newYear,
        type: 'error',
        title: `🚨 Account Overdraft! ($${Math.abs(Math.round(updatedCash)).toLocaleString()})`,
        message: `Working capital depleted! Liquidate crops or take an operating credit line from the bank.`,
      });
    }

    // ==========================================
    // 5. OPERATING LOAN ROLLOVER ENFORCEMENT
    // ==========================================
    const opLoan = state.operatingLoan ? { ...state.operatingLoan } : null;
    if (opLoan) {
      // Loan due at end of Fall (Day 270)
      if (newDay === 270 && !opLoan.isRollover) {
        opLoan.isRollover = true;
        opLoan.interestRate = 0.18; // Penalty rate 18%
        opLoan.principal = Math.round(opLoan.principal * 1.1); // +10% penalty fee
        newNotifications.unshift({
          id: `loan-default-${Date.now()}`,
          day: newDay,
          season: newSeason,
          year: newYear,
          type: 'error',
          title: `⚠️ Bank Default: Operating Loan Rollover`,
          message: `Operating loan was not repaid before Fall harvest ended. 18% penalty interest rate enforced!`,
        });
      }
    }

    // ==========================================
    // 6. R&D BREEDING, COLD STORAGE & MARKET SALES
    // ==========================================
    const rnd = { ...state.geneticRnd };
    if (rnd.isBreedingActive) {
      rnd.breedingProgressDays += 1;
      if (rnd.breedingProgressDays >= 180) {
        rnd.isBreedingActive = false;
        rnd.unlockedCustomSeeds.push(rnd.targetCropId || 'corn');
        rnd.passiveRoyaltyIncome += 250;
        newNotifications.unshift({
          id: `rnd-success-${Date.now()}`,
          day: newDay,
          season: newSeason,
          year: newYear,
          type: 'success',
          title: `🧬 Genetic Breakthrough!`,
          message: `180-day breeding program completed. Unlocked proprietary strain with +$250/day passive royalties!`,
        });
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
    const facility = { ...state.storageFacility };
    if (facility.hasColdStorage) {
      if (newWeather === 'Storm' && Math.random() < 0.4) {
        if (!facility.hasBackupGenerator) {
          facility.isPowerOutage = true;
          facility.coldStorageTemp = 65;
          newNotifications.unshift({
            id: `blackout-${Date.now()}`,
            day: newDay,
            season: newSeason,
            year: newYear,
            type: 'error',
            title: `⚡ Cold Storage Blackout!`,
            message: `Severe storm tripped substation. Cooler temperature spiked to 65°F! Install backup generator.`,
          });
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

    updatedInventory = updatedInventory
      .map((item) => {
        const crop = CROPS.find((c) => c.id === item.cropId);
        if (!crop || item.quantity <= 0) return item;

        const newDaysInStorage = item.daysInStorage + 1;
        let currentQty = item.quantity;

        if (newDaysInStorage > crop.spoilageDays) {
          let baseSpoilageRate = crop.spoilageRatePerDay;
          if (item.hasFieldHeat && !item.isHydrocooled) baseSpoilageRate *= 2.0;
          if (facility.hasColdStorage && !facility.isPowerOutage) baseSpoilageRate *= 0.2;

          const spoiledAmount = Math.min(currentQty, currentQty * baseSpoilageRate);
          currentQty -= spoiledAmount;
        }

        const strategyConfig =
          PRICING_STRATEGIES.find((s) => s.id === item.pricingStrategy) || PRICING_STRATEGIES[1];
        const marketMod = state.marketPriceModifiers[item.cropId] || 1.0;
        const organicBonus = item.isOrganic ? 1.8 : 1.0;
        const unitRetailPrice =
          crop.baseSalePrice * marketMod * organicBonus * (1 + strategyConfig.markupPct / 100);

        const baseDailyShoppers = 15 * state.farmstandLevel + Math.floor(Math.random() * 10);
        const unitsSold = Math.min(
          currentQty,
          Math.floor(baseDailyShoppers * strategyConfig.conversionMultiplier)
        );

        if (unitsSold > 0) {
          const revenue = Number((unitsSold * unitRetailPrice).toFixed(2));
          totalDailySalesRevenue += revenue;
          currentQty -= unitsSold;
        }

        return {
          ...item,
          quantity: Math.max(0, Number(currentQty.toFixed(1))),
          daysInStorage: newDaysInStorage,
        };
      })
      .filter((item) => item.quantity > 0.1);

    if (totalDailySalesRevenue > 0) {
      updatedCash += totalDailySalesRevenue;
      newLedger.unshift({
        id: `farmstand-sales-${Date.now()}`,
        day: newDay,
        season: newSeason,
        year: newYear,
        description: `Farmstand Retail Sales Revenue`,
        amount: totalDailySalesRevenue,
        category: 'Farmstand Sales',
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    // Valuation
    const landValue = updatedFields.reduce((acc, f) => acc + f.acres * region.baseLandCost, 0);
    const fleetVal = updatedFleet.reduce((acc, m) => acc + m.purchasePrice * (m.condition / 100), 0);
    const inventoryVal = updatedInventory.reduce((acc, item) => {
      const crop = CROPS.find((c) => c.id === item.cropId);
      return acc + item.quantity * (crop?.baseSalePrice || 10);
    }, 0);
    const loanDebt = opLoan ? opLoan.principal : 0;
    const mortgageDebt = state.mortgages.reduce((acc, m) => acc + m.principalRemaining, 0);

    // ==========================================
    // 7. SCENARIO VICTORY CHECKER
    // ==========================================
    let victoryTriggered = false;
    if (!state.isVictory && !state.isEndlessMode && state.selectedScenario !== 'free_play') {
      const scenId = state.selectedScenario;
      if (scenId === 'inherited_acre' && updatedCash >= 50000 && state.farmstandLevel >= 2) {
        victoryTriggered = true;
      } else if (scenId === 'organic_leap') {
        const organicAcres = updatedFields
          .filter((f) => f.isCertifiedOrganic)
          .reduce((sum, f) => sum + f.acres, 0);
        const organicContractsFulfilled = state.wholesaleContracts
          .filter((c) => c.isOrganicRequired && c.unitsDelivered > 0).length;
        if (organicAcres >= 100 && organicContractsFulfilled >= 3) {
          victoryTriggered = true;
        }
      } else if (scenId === 'csa_nightmare' && state.csaSubscribers >= 500 && state.csaSatisfaction >= 90 && newYear >= 3) {
        victoryTriggered = true;
      } else if (scenId === 'agribusiness_empire' && updatedCash >= 5000000 && (!opLoan || opLoan.principal <= 0) && state.mortgages.length === 0) {
        victoryTriggered = true;
      } else if (scenId === 'family_farm_rehab') {
        const allSoilNpkRestored = updatedFields.length > 0 && updatedFields.every(
          (f) => f.soil.nitrogen >= 60 && f.soil.phosphorus >= 60 && f.soil.potassium >= 60
        );
        if (allSoilNpkRestored && updatedCash >= 100000) {
          victoryTriggered = true;
        }
      } else if (scenId === 'vineyard_pioneer' && state.wineGrapesHarvested >= 100 && newYear >= 4) {
        victoryTriggered = true;
      }
    }

    if (victoryTriggered) {
      newNotifications.unshift({
        id: `victory-${Date.now()}`,
        day: newDay,
        season: newSeason,
        year: newYear,
        type: 'success',
        title: `🏆 CAMPAIGN OBJECTIVE ACHIEVED!`,
        message: `You fulfilled all objectives for this campaign. Outstanding agricultural leadership!`,
      });
      sound.playHarvest();
    }

    // ==========================================
    // 8. BANKRUPTCY & INSOLVENCY DEFEAT CHECKER
    // ==========================================
    let gameOverTriggered = false;
    let gameOverReason: string | null = null;
    let newNegDays = state.consecutiveNegativeCashDays;

    if (updatedCash < 0) {
      newNegDays += 1;
    } else {
      newNegDays = 0;
    }

    if (updatedCash <= -25000) {
      gameOverTriggered = true;
      gameOverReason = `Foreclosure by First Agricultural Credit: Working capital deficit reached $${Math.abs(Math.round(updatedCash)).toLocaleString()} (exceeding the -$25,000 legal insolvency threshold). Creditors seized farm assets.`;
    } else if (opLoan && opLoan.isRollover && newYear > opLoan.dueYear && updatedCash < 0) {
      gameOverTriggered = true;
      gameOverReason = `Operating Loan Default Liquidation: Operating loan was in rollover penalty status and remained unpaid after Year ${opLoan.dueYear}. Foreclosure action initiated.`;
    } else if (newNegDays >= 45) {
      gameOverTriggered = true;
      gameOverReason = `Receivership: Enterprise operated with negative working capital for 45 consecutive days without returning to positive balance. Secured lenders revoked operating authority.`;
    }

    if (gameOverTriggered) {
      newNotifications.unshift({
        id: `game-over-${Date.now()}`,
        day: newDay,
        season: newSeason,
        year: newYear,
        type: 'error',
        title: `🚨 Bank Foreclosure & Insolvency`,
        message: gameOverReason || 'Farm declared insolvent by creditors.',
      });
    }

    set({
      dayOfYear: newDay,
      season: newSeason,
      year: newYear,
      currentWeather: newWeather,
      selectedRegion: region,
      weatherForecast: updatedForecast,
      cash: Number(updatedCash.toFixed(2)),
      netWorth: Number((updatedCash + landValue + fleetVal + inventoryVal - loanDebt - mortgageDebt).toFixed(2)),
      fields: updatedFields,
      fleet: updatedFleet,
      seasonalWorkers: updatedWorkers,
      operatingLoan: opLoan,
      storageFacility: facility,
      geneticRnd: rnd,
      inventory: updatedInventory,
      notifications: newNotifications.slice(0, 50),
      ledger: newLedger.slice(0, 100),
      isVictory: state.isVictory || victoryTriggered,
      isGameOver: gameOverTriggered,
      gameOverReason: gameOverReason || state.gameOverReason,
      gameSpeed: (victoryTriggered || gameOverTriggered) ? 0 : state.gameSpeed,
      consecutiveNegativeCashDays: newNegDays,
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
      isOrganic: field.isCertifiedOrganic || false,
    });

    const isWineGrapes = crop.id === 'crop_grapes_wine';
    const newWineGrapes = isWineGrapes ? state.wineGrapesHarvested + harvestQuantity : state.wineGrapesHarvested;

    set({
      fields: state.fields.map((f) => (f.id === fieldId ? { ...f, currentCropId: null, plantedDay: null, growthDays: 0, status: 'empty' as const } : f)),
      inventory: updatedInventory,
      wineGrapesHarvested: newWineGrapes,
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
        if (fert.delivery === 'granular' && fert.requiresRain) {
          // Sits on surface until rain or drip irrigation dissolves it
          soil.surfaceGranular = {
            n: fert.nGain,
            p: fert.pGain,
            k: fert.kGain,
            ca: fert.caGain,
            ph: fert.phDelta,
          };
        } else {
          // Immediate integration (fertigation, foliar, or non-rain granular)
          soil.nitrogen = Math.min(100, soil.nitrogen + fert.nGain);
          soil.phosphorus = Math.min(100, soil.phosphorus + fert.pGain);
          soil.potassium = Math.min(100, soil.potassium + fert.kGain);
          soil.calcium = Math.min(100, soil.calcium + fert.caGain);
          soil.pH = Math.max(4.5, Math.min(8.5, Number((soil.pH + fert.phDelta).toFixed(1))));
        }
        return { ...f, soil };
      }),
      ledger: [
        {
          id: `fert-buy-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Applied ${fert.name} to ${field.name}`,
          amount: -cost,
          category: 'Fertilizer',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
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
      ledger: [
        {
          id: `disease-treat-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Cured ${disease.name} on ${field.name}`,
          amount: -cost,
          category: 'Disease Treatment',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
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
    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: state.fields.map((f) =>
        f.id === fieldId
          ? {
              ...f,
              diseasePreventatives: {
                ...f.diseasePreventatives,
                [preventative]: true,
              },
            }
          : f
      ),
      ledger: [
        {
          id: `preventative-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Applied ${preventative === 'copperFungicide' ? 'Copper Fungicide Spray' : 'Elemental Sulfur Spray'} to ${field.name}`,
          amount: -cost,
          category: 'Disease Treatment',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });
    sound.playClick();
    return true;
  },

  installDripIrrigation: (fieldId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field || state.cash < 1200 * field.acres) return false;
    const cost = 1200 * field.acres;
    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: state.fields.map((f) => (f.id === fieldId ? { ...f, hasDripIrrigation: true } : f)),
      ledger: [
        {
          id: `drip-install-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Installed Drip Irrigation System on ${field.name}`,
          amount: -cost,
          category: 'Facility Infrastructure',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });
    sound.playCashRegister();
    return true;
  },

  installStrawMulch: (fieldId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field || field.hasStrawMulch) return false;
    const cost = 200 * field.acres;
    if (state.cash < cost) return false;
    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: state.fields.map((f) => (f.id === fieldId ? { ...f, hasStrawMulch: true } : f)),
      ledger: [
        {
          id: `mulch-install-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Installed Moisture-Retaining Straw Mulch on ${field.name}`,
          amount: -cost,
          category: 'Facility Infrastructure',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });
    sound.playClick();
    return true;
  },

  runSoilTest: (fieldId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field || state.cash < 150) return false;
    set({
      cash: Number((state.cash - 150).toFixed(2)),
      notifications: [
        {
          id: `soil-test-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          type: 'info',
          title: `🧪 Soil Assay: ${field.name}`,
          message: `NPK: N:${field.soil.nitrogen} P:${field.soil.phosphorus} K:${field.soil.potassium} Ca:${field.soil.calcium} | Soil pH: ${field.soil.pH} | Moisture: ${field.moistureLevel}%`,
        },
        ...state.notifications,
      ],
      ledger: [
        {
          id: `soil-assay-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Agronomic Lab Soil Assay for ${field.name}`,
          amount: -150,
          category: 'Maintenance',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });
    sound.playClick();
    return true;
  },

  buyLand: () => {
    const state = get();
    if (!state.selectedRegion || state.cash < state.selectedRegion.baseLandCost * 10) return false;
    const cost = state.selectedRegion.baseLandCost * 10;
    const newField: Field = {
      id: `field-${Date.now()}`,
      name: `Plot ${state.fields.length + 1}`,
      acres: 10,
      soilQuality: 80,
      currentCropId: null,
      plantedDay: null,
      growthDays: 0,
      moistureLevel: 65,
      moistureHistory: [65, 65, 65, 65, 65],
      fertilized: false,
      irrigated: false,
      hasDripIrrigation: false,
      hasStrawMulch: false,
      status: 'empty',
      soil: {
        nitrogen: 65,
        phosphorus: 55,
        potassium: 55,
        calcium: 50,
        pH: 6.5,
        surfaceGranular: null,
      },
      activeDiseases: [],
      diseasePreventatives: { copperFungicide: false, sulfurOil: false },
      insuranceTier: 'none',
    };

    set({
      cash: Number((state.cash - cost).toFixed(2)),
      fields: [...state.fields, newField],
      ledger: [
        {
          id: `land-buy-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `Purchased 10 Acres (${newField.name})`,
          amount: -cost,
          category: 'Land Purchase',
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ],
    });
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
    set({
      cash: Number((state.cash + rev).toFixed(2)),
      wholesaleContracts: state.wholesaleContracts.map((c) =>
        c.id === contractId ? { ...c, unitsDelivered: c.unitsDelivered + quantity } : c
      ),
    });
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

  dismissVictory: () => {
    set({ isVictory: false, isEndlessMode: true, activeTab: 'endless' });
  },

  dismissGameOver: () => {
    get().restartGame();
  },

  clearFastForwardAlert: () => {
    set({ fastForwardAlert: null });
  },

  certifyFieldOrganic: (fieldId: string) => {
    const state = get();
    const field = state.fields.find((f) => f.id === fieldId);
    if (!field || field.isCertifiedOrganic) return false;
    const certCost = 2500;
    if (state.cash < certCost) return false;

    const updatedFields = state.fields.map((f) =>
      f.id === fieldId ? { ...f, isCertifiedOrganic: true, soilQuality: Math.min(100, f.soilQuality + 5) } : f
    );

    set({
      cash: Number((state.cash - certCost).toFixed(2)),
      fields: updatedFields,
      notifications: [
        {
          id: `organic-cert-${Date.now()}-${fieldId}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          type: 'success' as const,
          title: `🌿 USDA Organic Certified: ${field.name}`,
          message: `Field inspection passed! Crops harvested on this plot now command +80% organic retail premiums.`,
        },
        ...state.notifications,
      ].slice(0, 50),
      ledger: [
        {
          id: `organic-fee-${Date.now()}`,
          day: state.dayOfYear,
          season: state.season,
          year: state.year,
          description: `USDA Organic Certification Fee (${field.name})`,
          amount: -certCost,
          category: 'Upgrades' as const,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...state.ledger,
      ].slice(0, 100),
    });

    sound.playCashRegister();
    return true;
  },

  advanceMultipleDays: (days: number) => {
    let daysCount = 0;
    let stopReason: string | undefined;

    for (let i = 0; i < days; i++) {
      const beforeState = get();
      if (beforeState.isGameOver || beforeState.isVictory) {
        stopReason = beforeState.isVictory ? 'Campaign Victory Achieved!' : 'Farm Insolvent';
        break;
      }

      // Execute next day tick
      beforeState.nextDay();
      daysCount++;

      const afterState = get();
      if (afterState.isGameOver) {
        stopReason = 'Farm went into bank receivership!';
        break;
      }
      if (afterState.isVictory) {
        stopReason = 'Campaign Victory Achieved!';
        break;
      }

      // 1. Newly ready harvest
      const hadReadyBefore = beforeState.fields.some((f) => f.status === 'ready');
      const hasReadyNow = afterState.fields.some((f) => f.status === 'ready');
      if (!hadReadyBefore && hasReadyNow) {
        const readyField = afterState.fields.find((f) => f.status === 'ready');
        stopReason = `Harvest Ready on ${readyField?.name || 'Field'}!`;
        break;
      }

      // 2. New disease outbreak
      const totalDiseasesBefore = beforeState.fields.reduce((sum, f) => sum + f.activeDiseases.length, 0);
      const totalDiseasesNow = afterState.fields.reduce((sum, f) => sum + f.activeDiseases.length, 0);
      if (totalDiseasesNow > totalDiseasesBefore) {
        stopReason = 'Disease Outbreak detected!';
        break;
      }

      // 3. Power Outage in Cold Storage
      if (!beforeState.storageFacility.isPowerOutage && afterState.storageFacility.isPowerOutage) {
        stopReason = 'Cold Storage Power Outage!';
        break;
      }

      // 4. Equipment Breakdown
      const brokeBefore = beforeState.fleet.some((m) => m.status === 'broken_down');
      const brokeNow = afterState.fleet.some((m) => m.status === 'broken_down');
      if (!brokeBefore && brokeNow) {
        stopReason = 'Machinery breakdown in field!';
        break;
      }

      // 5. Severe Weather arrival
      if (
        (afterState.currentWeather === 'Frost' || afterState.currentWeather === 'Storm') &&
        beforeState.currentWeather !== afterState.currentWeather
      ) {
        stopReason = `Severe Weather: ${afterState.currentWeather} warning!`;
        break;
      }

      // 6. Cash drop into negative
      if (beforeState.cash >= 0 && afterState.cash < 0) {
        stopReason = 'Account Overdraft! Working capital negative.';
        break;
      }
    }

    if (stopReason) {
      set({ gameSpeed: 0, fastForwardAlert: stopReason });
    }

    return { daysAdvanced: daysCount, stoppedReason: stopReason };
  },

  advanceToNextHarvest: () => {
    const state = get();
    const growingFields = state.fields.filter((f) => f.status === 'growing');
    if (growingFields.length === 0) {
      return { daysAdvanced: 0, stoppedReason: 'No crops currently growing' };
    }
    return get().advanceMultipleDays(60);
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
      selectedScenario: 'inherited_acre',
      csaSubscribers: 0,
      csaSatisfaction: 95,
      wineGrapesHarvested: 0,
      isVictory: false,
      isGameOver: false,
      gameOverReason: null,
      isEndlessMode: false,
      consecutiveNegativeCashDays: 0,
      fastForwardAlert: null,
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
    }),
    {
      name: 'agronomics-save-v1',
      partialize: (state) => ({
        year: state.year,
        season: state.season,
        dayOfYear: state.dayOfYear,
        cash: state.cash,
        netWorth: state.netWorth,
        gameStarted: state.gameStarted,
        activeTab: state.activeTab,
        selectedScenario: state.selectedScenario,
        csaSubscribers: state.csaSubscribers,
        csaSatisfaction: state.csaSatisfaction,
        wineGrapesHarvested: state.wineGrapesHarvested,
        isVictory: state.isVictory,
        isGameOver: state.isGameOver,
        gameOverReason: state.gameOverReason,
        isEndlessMode: state.isEndlessMode,
        consecutiveNegativeCashDays: state.consecutiveNegativeCashDays,
        selectedRegion: state.selectedRegion,
        currentWeather: state.currentWeather,
        weatherForecast: state.weatherForecast,
        marketPriceModifiers: state.marketPriceModifiers,
        fields: state.fields,
        inventory: state.inventory,
        wholesaleContracts: state.wholesaleContracts,
        ledger: state.ledger,
        notifications: state.notifications,
        fleet: state.fleet,
        auctionDeals: state.auctionDeals,
        neighborFarms: state.neighborFarms,
        staff: state.staff,
        seasonalWorkers: state.seasonalWorkers,
        workerHousingLevel: state.workerHousingLevel,
        overtimeActive: state.overtimeActive,
        operatingLoan: state.operatingLoan,
        mortgages: state.mortgages,
        futuresContracts: state.futuresContracts,
        storageFacility: state.storageFacility,
        seedCatalog: state.seedCatalog,
        geneticRnd: state.geneticRnd,
        barnCapacity: state.barnCapacity,
        farmstandLevel: state.farmstandLevel,
        garageLevel: state.garageLevel,
      }),
    }
  )
);
