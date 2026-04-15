export type ProjectType = 'standard' | 'cluster' | 'sra';

export interface FeasibilityInputs {
  // Project Type
  projectType: ProjectType;

  // Land Details
  plotArea: number;
  fsi: number;

  // Rehab Details
  members: number;
  rehabCarpetPerMember: number;
  loadingPercent: number;

  // Cost Inputs
  constructionRate: number;
  rentCost: number;
  corpusCost: number;
  miscCost: number;

  // Sale Inputs
  saleRate: number;
  saleEfficiency: number;
  targetProfitPercent: number;

  // Project Timeline
  projectDuration: number;
  interestRate: number;
  inflationRate: number;

  // Phased Revenue
  saleDistribution: number[];
}

export interface YearlyRevenue {
  year: number;
  distribution: number;
  revenue: number;
}

export interface FeasibilityResults {
  totalBuiltUp: number;
  rehabCarpet: number;
  rehabBuiltUp: number;
  saleBuiltUp: number;
  saleableArea: number;
  constructionCost: number;
  inflatedConstructionCost: number;
  totalCost: number;
  interestCost: number;
  finalCost: number;
  revenue: number;
  profit: number;
  profitPercent: number;
  requiredRevenue: number;
  requiredSaleRate: number;
  dealScore: number;
  breakEvenRate: number;
  rehabBurden: number;
  yearlyRevenue: YearlyRevenue[];
  isFeasible: boolean;
  feasibilityMessage: string;
}
