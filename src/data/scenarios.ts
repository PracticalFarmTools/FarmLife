import type { ScenarioDefinition } from '../types/game';

export const CAMPAIGN_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'inherited_acre',
    title: 'The Inherited Acre',
    subtitle: 'Direct-to-Consumer Basics & Cash Flow Survival',
    difficulty: 'Tutorial',
    regionId: 'region_northeast',
    startingCash: 15000,
    startingDebt: 0,
    startingAcres: 10,
    description:
      'You inherited a 10-acre parcel in Vermont. Build up your farmstand, manage daily cash flow, and leverage the Year 2 Local Harvest Festival surge to reach $50,000 in liquid cash!',
    winConditions: {
      cashRequired: 50000,
      farmstandLevelRequired: 2,
    },
  },
  {
    id: 'organic_leap',
    title: 'The Organic Leap',
    subtitle: 'Navigating the 3-Year Organic Transition',
    difficulty: 'Medium',
    regionId: 'region_westcoast',
    startingCash: 150000,
    startingDebt: 0,
    startingAcres: 200,
    description:
      'Transition a 200-acre California farm to certified organic. Survive chemical spray lockouts and biological aphid swarms to command +80% organic retail premiums!',
    winConditions: {
      organicAcresRequired: 100,
      organicContractsRequired: 3,
    },
  },
  {
    id: 'csa_nightmare',
    title: 'The CSA Logistics Nightmare',
    subtitle: 'Crop Diversity & Weekly Packing Operations',
    difficulty: 'Hard',
    regionId: 'region_northeast',
    startingCash: 50000,
    startingDebt: 0,
    startingAcres: 50,
    description:
      'Manage weekly packing logistics for 500 CSA subscribers. Maintain >90% subscriber satisfaction for 2 consecutive years despite cardboard supply chain crises!',
    winConditions: {
      csaSubscribersRequired: 500,
    },
  },
  {
    id: 'agribusiness_empire',
    title: 'Agribusiness Empire',
    subtitle: 'High Finance, Debt Leverage & Global Futures',
    difficulty: 'Expert',
    regionId: 'region_midwest',
    startingCash: 500000,
    startingDebt: 3500000,
    startingAcres: 5000,
    description:
      'Command a massive 5,000-acre commodity operation carrying $3.5 Million in debt. Hedge your harvests against global trade wars to reach $5,000,000 liquid cash and $0 debt!',
    winConditions: {
      cashRequired: 5000000,
      debtRequired: 0,
    },
  },
  {
    id: 'family_farm_rehab',
    title: 'Saving the Family Farm',
    subtitle: 'Soil Rehabilitation & NPK Nutrient Restoration',
    difficulty: 'Hard',
    regionId: 'region_midwest',
    startingCash: 100000,
    startingDebt: 0,
    startingAcres: 500,
    description:
      'Rebuild 500 acres of dead, chemically depleted topsoil (0 NPK). Restore soil nutrients to NPK > 60 and turn a $100,000 annual profit.',
    winConditions: {
      npkTargetRequired: 60,
    },
  },
  {
    id: 'vineyard_pioneer',
    title: 'The Vineyard Pioneer',
    subtitle: 'Permanent Crops & Extreme Delayed Gratification',
    difficulty: 'Expert',
    regionId: 'region_westcoast',
    startingCash: 250000,
    startingDebt: 0,
    startingAcres: 100,
    description:
      'Plant 100 acres of premium wine grapes. Survive 4 in-game years of zero harvest income while paying wages, maintenance, and loan interest before your first 100-ton harvest!',
    winConditions: {
      wineGrapesHarvestedRequired: 100,
    },
  },
];
