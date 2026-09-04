export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter';

export type WeatherType = 'Sunny' | 'Rainy' | 'Drought' | 'Storm' | 'Frost';

export type PricingStrategy = 'discount' | 'standard' | 'aggressive' | 'premium' | 'exorbitant';

export interface PricingStrategyConfig {
  id: PricingStrategy;
  label: string;
  markupPct: number;
  conversionMultiplier: number;
  description: string;
}

export interface Region {
  id: string;
  name: string;
  tagline: string;
  description: string;
  baseLandCost: number;
  baseLandCostPerAcre?: number;
  growingSeasonStart: number;
  growingSeasonEnd: number;
  growingSeasonStartDay?: number;
  growingSeasonEndDay?: number;
  soilQualityBonus: number;
  weatherProbabilities: Record<WeatherType, number>;
  rainProbability?: number;
  droughtProbability?: number;
  severeWeatherRisk?: number;
  accentColor: string;
  iconName: string;
  recommendedCrops: string[];
}

export type ScenarioId =
  | 'inherited_acre'
  | 'organic_leap'
  | 'csa_nightmare'
  | 'agribusiness_empire'
  | 'family_farm_rehab'
  | 'vineyard_pioneer'
  | 'free_play';

export interface ScenarioDefinition {
  id: ScenarioId;
  title: string;
  subtitle: string;
  difficulty: 'Tutorial' | 'Medium' | 'Hard' | 'Expert' | 'Endless';
  regionId: string;
  startingCash: number;
  startingDebt: number;
  startingAcres: number;
  description: string;
  winConditions: {
    cashRequired?: number;
    debtRequired?: number;
    farmstandLevelRequired?: number;
    organicAcresRequired?: number;
    organicContractsRequired?: number;
    csaSubscribersRequired?: number;
    npkTargetRequired?: number;
    wineGrapesHarvestedRequired?: number;
  };
}

export interface Crop {
  id: string;
  name: string;
  category: 'Commodity' | 'Specialty' | 'Root' | 'Brassica' | 'Grain' | 'Vegetable' | 'Fruit' | 'Tuber';
  baseSalePrice: number;
  priceUnit: string;
  seedCostPerAcre: number;
  daysToMaturity: number;
  expectedYieldPerAcre: number;
  shelfLifeDays: number;
  spoilageDays: number;
  spoilageRatePerDay: number;
  idealSeasons: Season[];
  idealPHMin: number;
  idealPHMax: number;
  optimalPhMin?: number;
  optimalPhMax?: number;
  nDepletionPerDay?: number;
  pDepletionPerDay?: number;
  kDepletionPerDay?: number;
  requiresColdStorage?: boolean;
  icon: string;
  description: string;
}

export type FertilizerDelivery = 'granular' | 'fertigation' | 'foliar';

export type FertilizerType =
  | 'Urea'
  | 'BoneMeal'
  | 'DolomiticLime'
  | 'CalciumNitrate'
  | 'PotassiumSulfate'
  | 'ChelatedIron'
  | 'FoliarCalcium';

export interface FertilizerOption {
  id: FertilizerType;
  name: string;
  delivery: FertilizerDelivery;
  costPerAcre: number;
  description: string;
  nGain: number;
  pGain: number;
  kGain: number;
  caGain: number;
  phDelta: number;
  requiresRain: boolean;
  requiresDrip: boolean;
}

export type DiseaseId =
  | 'lateBlight'
  | 'powderyMildew'
  | 'clubroot'
  | 'bacterialSpot'
  | 'potatoScab'
  | 'blossomEndRot'
  | 'sunscald'
  | 'disease_late_blight'
  | 'disease_powdery_mildew'
  | 'disease_clubroot'
  | 'disease_potato_scab';

export interface PlantDisease {
  id: DiseaseId;
  name: string;
  category: 'fungal' | 'bacterial' | 'physiological';
  targets: string[];
  targetCategories?: string[];
  triggerDescription: string;
  effectDescription: string;
  treatmentName: string;
  treatmentCostPerAcre: number;
  triggerMoistureMin?: number;
  triggerPhMax?: number;
  dailyYieldDamagePct?: number;
  actionToCure?: string;
}

export interface FieldSoil {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  calcium: number;
  pH: number;
  surfaceGranular: { n: number; p: number; k: number; ca: number; ph: number } | null;
}

export type InsuranceTier = 'none' | 'catastrophic' | 'premium';

export interface Field {
  id: string;
  name: string;
  acres: number;
  soilQuality: number;
  currentCropId: string | null;
  plantedDay: number | null;
  growthDays: number;
  moistureLevel: number;
  moistureHistory: number[];
  fertilized: boolean;
  irrigated: boolean;
  hasDripIrrigation: boolean;
  hasStrawMulch: boolean;
  status: 'empty' | 'growing' | 'ready' | 'withered';
  soil: FieldSoil;
  activeDiseases: DiseaseId[];
  diseasePreventatives: {
    copperFungicide: boolean;
    sulfurOil: boolean;
  };
  assignedTractorId?: string | null;
  assignedHarvesterId?: string | null;
  insuranceTier: InsuranceTier;
  seedVarietyId?: string | null;
  isCertifiedOrganic?: boolean;
  cropHistory?: string[];
  monoculturePenaltySeasons?: number;
  soilType?: 'Sandy Loam' | 'Clay Loam' | 'Silt Loam';
}

export interface InventoryItem {
  id: string;
  cropId: string;
  cropName: string;
  quantity: number;
  quality: number;
  harvestDay: number;
  daysInStorage: number;
  pricingStrategy: PricingStrategy;
  hasFieldHeat: boolean;
  isHydrocooled: boolean;
  grade: 'A' | 'B' | 'C';
  isOrganic?: boolean;
}

export interface WholesaleContract {
  id: string;
  buyerName: string;
  cropId: string;
  cropName: string;
  contractPricePerUnit: number;
  season: Season;
  year: number;
  status: 'active' | 'renegotiated' | 'expired';
  increaseChanceNextSeason: number;
  minQualityRequired: number;
  unitsDelivered: number;
  isOrganicRequired?: boolean;
}

// Fleet Machinery Types
export type MachineryCategory = 'tractor' | 'implement' | 'vehicle' | 'harvester' | 'autonomous_drone';
export type TractorClass = 'light' | 'medium' | 'heavy';
export type MachineryStatus = 'available' | 'in_field' | 'in_shop' | 'broken_down';
export type PurchasedFrom = 'dealership' | 'auction';

export interface MachineryItem {
  id: string;
  name: string;
  category: MachineryCategory;
  horsepower: number;
  requiredHp: number;
  condition: number;
  engineHours: number;
  purchasePrice: number;
  purchasedFrom: PurchasedFrom;
  warrantyDaysRemaining: number;
  status: MachineryStatus;
  icon: string;
  description: string;
  repairDaysRemaining: number;
  dailyMaintenanceCost?: number;
  speedMultiplier?: number;
  canPullHeavyImplements?: boolean;
  isAutonomous?: boolean;
  softwareLicenseFeePerDay?: number;
}

export interface AuctionDeal {
  id: string;
  name: string;
  category: MachineryCategory;
  horsepower: number;
  requiredHp: number;
  discountPct: number;
  price: number;
  engineHours: number;
  initialCondition: number;
  icon: string;
  description: string;
}

export type GarageLevel = 1 | 2 | 3;

// Labor & Staff Types
export type StaffRole = 'farm_manager' | 'agronomist' | 'chief_mechanic' | 'plant_geneticist';

export interface PermanentStaff {
  id: string;
  name: string;
  role: StaffRole;
  salaryPerSeason: number;
  hired: boolean;
  avatar: string;
  description: string;
  yearsOfService?: number;
  isRetired?: boolean;
}

export type LaborType = 'local' | 'h2a_contract';
export type WorkerHousingLevel = 0 | 1 | 2 | 3;

export interface SeasonalWorker {
  id: string;
  name: string;
  type: LaborType;
  dailyWage: number;
  fatigue: number;
  morale: number;
  handPickingSkill: number;
  heavyMachinerySkill: number;
  packingSkill: number;
  avatar: string;
  assignedFieldId: string | null;
  yearsWithFarm: number;
  baseSpeedMultiplier?: number;
  noShowProbability?: number;
  requiresHousing?: boolean;
}

export interface WorkerTemplate {
  id: string;
  name: string;
  dailyWage: number;
  baseSpeedMultiplier: number;
  machinerySkill: number;
  pickingSkill: number;
  noShowProbability: number;
  requiresHousing: boolean;
}

// Financials & Risk Management Models
export interface OperatingLoan {
  id: string;
  principal: number;
  interestRate: number;
  dueSeason: Season;
  dueYear: number;
  isRollover: boolean;
}

export interface MortgageItem {
  id: string;
  description: string;
  principalRemaining: number;
  dailyPayment: number;
  totalTermDays: number;
  daysRemaining: number;
}

export interface FuturesContract {
  id: string;
  cropId: string;
  cropName: string;
  unitsQuantity: number;
  lockedPricePerUnit: number;
  deliverySeason: Season;
  deliveryYear: number;
  fulfilled: boolean;
}

// Cold Chain & Storage Models
export type PackingLineType = 'none' | 'manual_shed' | 'automated_optical';

export interface StorageFacility {
  hasHydrocooler: boolean;
  hasColdStorage: boolean;
  hasBackupGenerator: boolean;
  packingLine: PackingLineType;
  coldStorageTemp: number;
  isPowerOutage: boolean;
}

// Seed Genetics & R&D Models
export type SeedTraitType = 'standard' | 'gmo_biotech' | 'organic_heirloom' | 'custom_bred';

export interface SeedVariety {
  id: string;
  name: string;
  cropId: string;
  traitType: SeedTraitType;
  yieldMultiplier: number;
  dtmDays: number;
  droughtResistance: number;
  diseaseImmunity: DiseaseId | null;
  costPerAcre: number;
  techFeePerAcre: number;
  pricePremiumPct: number;
  description: string;
}

export interface GeneticRndState {
  hasGreenhouse: boolean;
  isBreedingActive: boolean;
  breedingProgressDays: number;
  targetCropId: string | null;
  unlockedCustomSeeds: string[];
  passiveRoyaltyIncome: number;
}

// Endgame Automation & Climate Events
export interface AutomationTechItem {
  id: string;
  name: string;
  tier: number;
  capExCost: number;
  dailySoftwareLicenseCost: number;
  laborFatigueReduction: number;
  laborReplacedCount: number;
  description: string;
}

export interface PlotAuctionType {
  id: string;
  name: string;
  acres: number;
  soilQualityMultiplier: number;
  baseAuctionStartingBid: number;
  description: string;
}

export interface MacroClimateEvent {
  id: string;
  name: string;
  triggerYear: number;
  droughtProbabilityIncreasePerYear?: number;
  growingSeasonShiftDays?: number;
  severeWeatherRiskIncrease?: number;
  description: string;
}

export interface NeighborAiFarm {
  id: string;
  name: string;
  ownerName: string;
  acres: number;
  askingPrice: number;
  cropType: string;
  financialDistressYears: number;
  isForSale: boolean;
}

export type LedgerCategory =
  | 'Seed'
  | 'Harvest'
  | 'Farmstand Sales'
  | 'Wholesale Spot Sales'
  | 'Contract Sales'
  | 'Land Purchase'
  | 'Maintenance'
  | 'Spoilage'
  | 'Upgrades'
  | 'Fertilizer'
  | 'Disease Treatment'
  | 'Equipment CapEx'
  | 'Machinery Purchase'
  | 'Repair & Overhaul'
  | 'Staff Salaries'
  | 'Worker Wages'
  | 'Worker Housing'
  | 'Operating Loan'
  | 'Loan Interest'
  | 'Mortgage Payment'
  | 'Insurance Premium'
  | 'Insurance Payout'
  | 'Futures Hedging'
  | 'Cold Storage Electricity'
  | 'Freight Dispatch'
  | 'Facility Infrastructure'
  | 'Tech Fees'
  | 'Seed Royalties'
  | 'R&D Greenhouse'
  | 'Neighbor AI Farm Acquisition'
  | 'Autonomous License Fee'
  | 'Biological Control'
  | 'Automation Tech CapEx';

export interface LedgerEntry {
  id: string;
  day: number;
  season: Season;
  year: number;
  description: string;
  amount: number;
  category: LedgerCategory;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  day: number;
  season: Season;
  year: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface WeatherForecastDay {
  day: number;
  season: Season;
  weather: WeatherType;
}

export type GameSpeed = 0 | 1 | 2 | 5 | 10;
