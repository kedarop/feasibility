import { FeasibilityInputs, FeasibilityResults } from '../types/feasibilityTypes';

function calculateDealScore(
  profitPercent: number,
  saleBuiltUp: number,
  totalBuiltUp: number,
  profit: number,
  revenue: number
): number {
  // 1. Profit Percentage Score (0-100)
  const profitScore = Math.min(profitPercent, 100);

  // 2. Saleable Area Ratio Score (0-100)
  const areaRatio = totalBuiltUp > 0 ? saleBuiltUp / totalBuiltUp : 0;
  const areaScore = areaRatio * 100;

  // 3. Cost to Revenue Margin Score (0-100)
  const marginRatio = revenue > 0 ? profit / revenue : 0;
  const costScore = Math.min(marginRatio * 100, 100);

  // Calculate average score
  const dealScore = (profitScore + areaScore + costScore) / 3;

  return Math.max(0, Math.min(dealScore, 100)); // Clamp between 0-100
}

export function calculateFeasibility(inputs: FeasibilityInputs): FeasibilityResults {
  // 1. Total Built-Up Area
  const totalBuiltUp = inputs.plotArea * inputs.fsi;

  // 2. Rehab Area
  const rehabCarpet = inputs.members * inputs.rehabCarpetPerMember;
  const rehabBuiltUp = rehabCarpet * (1 + inputs.loadingPercent / 100);

  // 3. Sale Area
  const saleBuiltUp = Math.max(0, totalBuiltUp - rehabBuiltUp);

  // 3a. Saleable Area (accounting for efficiency loss)
  const saleableArea = saleBuiltUp * (inputs.saleEfficiency / 100);

  // 4. Construction Cost
  const constructionCost = totalBuiltUp * inputs.constructionRate;

  // 4a. Inflated Construction Cost (accounting for inflation over project duration)
  const inflatedConstructionCost = constructionCost * Math.pow(1 + inputs.inflationRate / 100, inputs.projectDuration);

  // 5. Total Project Cost (using inflated construction cost)
  const totalCost = inflatedConstructionCost + inputs.rentCost + inputs.corpusCost + inputs.miscCost;

  // 5a. Interest Cost
  const interestCost = totalCost * (inputs.interestRate / 100) * inputs.projectDuration;

  // 5b. Final Project Cost (including interest)
  const finalCost = totalCost + interestCost;

  // 6. Revenue (based on saleable area)
  const revenue = saleableArea * inputs.saleRate;

  // 6a. Yearly Revenue Distribution
  const yearlyRevenue = inputs.saleDistribution.map((distribution, index) => ({
    year: index + 1,
    distribution: distribution,
    revenue: (revenue * distribution) / 100,
  }));

  // 7. Profit (based on final cost including interest)
  const profit = revenue - finalCost;

  // 8. Profit Percentage
  const profitPercent = finalCost > 0 ? (profit / finalCost) * 100 : 0;

  // 9. Deal Score
  const dealScore = calculateDealScore(profitPercent, saleBuiltUp, totalBuiltUp, profit, revenue);

  // 10. Break-even Sale Rate (per sq ft of saleable area)
  const breakEvenRate = saleableArea > 0 ? finalCost / saleableArea : 0;

  // 11. Rehab Burden
  const rehabBurden = totalBuiltUp > 0 ? (rehabBuiltUp / totalBuiltUp) * 100 : 0;

  // 12. Required Revenue and Sale Rate for Target Profit
  const requiredRevenue = finalCost * (1 + inputs.targetProfitPercent / 100);
  const requiredSaleRate = saleableArea > 0 ? requiredRevenue / saleableArea : 0;

  // 13. Feasibility Check
  const isFeasible = rehabBuiltUp <= totalBuiltUp;
  const feasibilityMessage = isFeasible
    ? 'Project is feasible'
    : 'Project not feasible: Rehab area exceeds permissible built-up area';

  return {
    totalBuiltUp,
    rehabCarpet,
    rehabBuiltUp,
    saleBuiltUp,
    saleableArea,
    constructionCost,
    inflatedConstructionCost,
    totalCost,
    interestCost,
    finalCost,
    revenue,
    profit,
    profitPercent,
    requiredRevenue,
    requiredSaleRate,
    dealScore,
    breakEvenRate,
    rehabBurden,
    yearlyRevenue,
    isFeasible,
    feasibilityMessage,
  };
}
