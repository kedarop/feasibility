import React from 'react';
import { FeasibilityInputs } from '../../types/feasibilityTypes';
import { calculateFeasibility } from '../../calculator/calculateFeasibility';

interface ScenarioComparisonProps {
  inputs: FeasibilityInputs;
}

interface Scenario {
  name: string;
  saleRate: number;
  profit: number;
  profitPercent: number;
}

function formatCurrency(num: number): string {
  const absValue = Math.abs(num);
  
  if (absValue >= 10000000) {
    const crores = num / 10000000;
    return crores.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' Cr';
  }
  
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function ScenarioComparison({ inputs }: ScenarioComparisonProps) {
  const scenarios: Scenario[] = [];

  // Conservative Scenario (90% of current sale rate)
  const conservativeInputs = { ...inputs, saleRate: inputs.saleRate * 0.9 };
  const conservativeResults = calculateFeasibility(conservativeInputs);
  scenarios.push({
    name: 'Conservative',
    saleRate: conservativeInputs.saleRate,
    profit: conservativeResults.profit,
    profitPercent: conservativeResults.profitPercent,
  });

  // Base Scenario (current sale rate)
  const baseResults = calculateFeasibility(inputs);
  scenarios.push({
    name: 'Base',
    saleRate: inputs.saleRate,
    profit: baseResults.profit,
    profitPercent: baseResults.profitPercent,
  });

  // Optimistic Scenario (110% of current sale rate)
  const optimisticInputs = { ...inputs, saleRate: inputs.saleRate * 1.1 };
  const optimisticResults = calculateFeasibility(optimisticInputs);
  scenarios.push({
    name: 'Optimistic',
    saleRate: optimisticInputs.saleRate,
    profit: optimisticResults.profit,
    profitPercent: optimisticResults.profitPercent,
  });

  const getProfitClass = (profit: number): string => {
    return profit >= 0 ? 'profit-positive' : 'profit-negative';
  };

  return (
    <div className="scenario-comparison-section">
      <h3>Scenario Analysis</h3>
      <div className="scenario-table-wrapper">
        <table className="scenario-table">
          <thead>
            <tr>
              <th className="col-scenario">Scenario</th>
              <th className="col-sale-rate">Sale Rate (₹/sq ft)</th>
              <th className="col-profit">Profit</th>
              <th className="col-profit-percent">Profit %</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => (
              <tr key={scenario.name} className={`scenario-row scenario-${scenario.name.toLowerCase()}`}>
                <td className="scenario-name">
                  <span className="scenario-badge">{scenario.name}</span>
                </td>
                <td className="sale-rate-value">{scenario.saleRate.toLocaleString('en-IN', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}</td>
                <td className={`profit-value ${getProfitClass(scenario.profit)}`}>
                  {formatCurrency(scenario.profit)}
                </td>
                <td className={`profit-percent-value ${getProfitClass(scenario.profit)}`}>
                  {scenario.profitPercent.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
