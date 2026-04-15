import React from 'react';
import { FeasibilityResults, FeasibilityInputs } from '../../types/feasibilityTypes';
import { ScenarioComparison } from './ScenarioComparison';
import { PhasedRevenueTable } from './PhasedRevenueTable';

interface ResultsPanelProps {
  results: FeasibilityResults;
  inputs: FeasibilityInputs;
}

function formatCurrency(num: number): string {
  const absValue = Math.abs(num);
  
  // If value is >= 1 Crore, show in Crores
  if (absValue >= 10000000) {
    const crores = num / 10000000;
    return crores.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' Cr';
  }
  
  // Otherwise show full Indian Rupee format
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatPercentage(num: number): string {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface MetricCardProps {
  label: string;
  value: number;
  unit: string;
  formatType?: 'currency' | 'percentage' | 'default';
  variant?: 'default' | 'revenue' | 'cost' | 'profit' | 'profit-percentage';
  isNegative?: boolean;
}

function MetricCard({ 
  label, 
  value, 
  unit, 
  formatType = 'default',
  variant = 'default', 
  isNegative = false 
}: MetricCardProps) {
  const getVariantClass = () => {
    if (isNegative) return 'loss';
    return variant;
  };

  const formatValue = () => {
    switch (formatType) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return Math.round(value).toLocaleString('en-IN');
    }
  };

  return (
    <div className={`metric-card metric-card-${getVariantClass()}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{formatValue()}</div>
      <div className="metric-unit">{unit}</div>
    </div>
  );
}

interface ProfitBannerProps {
  profit: number;
  profitPercent: number;
}

function ProfitBanner({ profit, profitPercent }: ProfitBannerProps) {
  const isPositive = profit >= 0;
  
  return (
    <div className={`profit-card ${isPositive ? 'positive' : 'negative'}`}>
      <div className="profit-label">PROJECT PROFIT</div>
      <div className="profit-content">
        <span className="profit-value">{formatCurrency(profit)}</span>
        <span className="profit-percentage">({formatPercentage(profitPercent)}%)</span>
      </div>
    </div>
  );
}

interface FeasibilityWarningProps {
  message: string;
}

function FeasibilityWarning({ message }: FeasibilityWarningProps) {
  return (
    <div className="feasibility-warning-banner">
      <div className="warning-icon">⚠</div>
      <div className="warning-content">
        <div className="warning-title">PROJECT NOT FEASIBLE</div>
        <div className="warning-message">{message}</div>
      </div>
    </div>
  );
}

interface ViabilityIndicatorProps {
  profitPercent: number;
}

function ViabilityIndicator({ profitPercent }: ViabilityIndicatorProps) {
  const getViabilityStatus = () => {
    if (profitPercent < 15) {
      return {
        status: 'Not Viable',
        color: 'red',
      };
    }
    if (profitPercent < 25) {
      return {
        status: 'Moderate',
        color: 'orange',
      };
    }
    return {
      status: 'Highly Viable',
      color: 'green',
    };
  };

  const viability = getViabilityStatus();

  return (
    <div className={`viability-indicator viability-${viability.color}`}>
      <span className="viability-label">Viability Status</span>
      <span className="viability-status-text">{viability.status}</span>
    </div>
  );
}

interface DealScoreCardProps {
  dealScore: number;
}

function DealScoreCard({ dealScore }: DealScoreCardProps) {
  const getDealScoreLabel = () => {
    if (dealScore > 75) {
      return 'Excellent';
    }
    if (dealScore >= 50) {
      return 'Good';
    }
    if (dealScore >= 25) {
      return 'Risky';
    }
    return 'Poor';
  };

  const getDealScoreColor = () => {
    if (dealScore > 75) {
      return 'excellent';
    }
    if (dealScore >= 50) {
      return 'good';
    }
    if (dealScore >= 25) {
      return 'risky';
    }
    return 'poor';
  };

  const label = getDealScoreLabel();
  const color = getDealScoreColor();

  return (
    <div className={`deal-score-card deal-score-${color}`}>
      <div className="deal-score-header">
        <span className="deal-score-label">DEAL SCORE</span>
        <span className="deal-score-numerical">{Math.round(dealScore)}</span>
      </div>
      <div className="deal-score-rating">{label}</div>
      <div className="deal-score-bar">
        <div className="deal-score-fill" style={{ width: `${dealScore}%` }} />
      </div>
    </div>
  );
}

interface BreakEvenRateCardProps {
  breakEvenRate: number;
  saleBuiltUp: number;
}

function BreakEvenRateCard({ breakEvenRate, saleBuiltUp }: BreakEvenRateCardProps) {
  const isApplicable = saleBuiltUp > 0;

  return (
    <div className="break-even-card">
      <div className="break-even-header">
        <span className="break-even-label">BREAK-EVEN SALE RATE</span>
      </div>
      <div className="break-even-value">
        {isApplicable ? (
          <>
            <span className="break-even-rupee">₹</span>
            <span className="break-even-number">{Math.round(breakEvenRate).toLocaleString('en-IN')}</span>
            <span className="break-even-unit">/ sq ft</span>
          </>
        ) : (
          <span className="break-even-na">Not Applicable</span>
        )}
      </div>
      <div className="break-even-description">
        Minimum sale rate needed to break even
      </div>
    </div>
  );
}

interface RequiredSaleRateCardProps {
  requiredSaleRate: number;
  saleableArea: number;
}

function RequiredSaleRateCard({ requiredSaleRate, saleableArea }: RequiredSaleRateCardProps) {
  const isApplicable = saleableArea > 0;

  return (
    <div className="required-sale-rate-card">
      <div className="required-sale-rate-header">
        <span className="required-sale-rate-label">REQUIRED SALE RATE</span>
      </div>
      <div className="required-sale-rate-value">
        {isApplicable ? (
          <>
            <span className="required-sale-rate-rupee">₹</span>
            <span className="required-sale-rate-number">{Math.round(requiredSaleRate).toLocaleString('en-IN')}</span>
            <span className="required-sale-rate-unit">/ sq ft</span>
          </>
        ) : (
          <span className="required-sale-rate-na">Not Applicable</span>
        )}
      </div>
      <div className="required-sale-rate-description">
        Sale rate needed to achieve target profit
      </div>
    </div>
  );
}

interface RiskFlagsProps {
  profitPercent: number;
  rehabBuiltUp: number;
  totalBuiltUp: number;
  profit: number;
  revenue: number;
}

function RiskFlags({ profitPercent, rehabBuiltUp, totalBuiltUp, profit, revenue }: RiskFlagsProps) {
  const flags: { type: 'warning' | 'error'; message: string }[] = [];

  // Check for low profitability
  if (profitPercent < 20 && profitPercent >= 0) {
    flags.push({ type: 'warning', message: 'Low profitability' });
  }

  // Check for infeasibility
  if (rehabBuiltUp > totalBuiltUp) {
    flags.push({ type: 'error', message: 'Not feasible' });
  }

  // Check for loss-making project
  if (profit < 0) {
    flags.push({ type: 'error', message: 'Loss making project' });
  }

  // If no flags, don't render
  if (flags.length === 0) {
    return null;
  }

  return (
    <div className="risk-flags-container">
      <div className="risk-flags-label">Risk Flags</div>
      <div className="risk-flags">
        {flags.map((flag, index) => (
          <span key={index} className={`risk-flag risk-flag-${flag.type}`}>
            {flag.type === 'error' ? '⚠️' : '⚡'} {flag.message}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ResultsPanel({ results, inputs }: ResultsPanelProps) {
  return (
    <div className={`results-panel ${!results.isFeasible ? 'not-feasible' : ''}`}>
      {/* 1. Feasibility Warning (if applicable) */}
      {!results.isFeasible && <FeasibilityWarning message={results.feasibilityMessage} />}
      
      {/* 2. Risk Flags */}
      <RiskFlags
        profitPercent={results.profitPercent}
        rehabBuiltUp={results.rehabBuiltUp}
        totalBuiltUp={results.totalBuiltUp}
        profit={results.profit}
        revenue={results.revenue}
      />
      
      {/* 3. Project Profit Banner */}
      <ProfitBanner profit={results.profit} profitPercent={results.profitPercent} />

      {/* 4. Deal Score Card */}
      <DealScoreCard dealScore={results.dealScore} />

      {/* 5. Break-even Sale Rate Card */}
      <BreakEvenRateCard breakEvenRate={results.breakEvenRate} saleBuiltUp={results.saleBuiltUp} />

      {/* 5a. Required Sale Rate Card */}
      <RequiredSaleRateCard requiredSaleRate={results.requiredSaleRate} saleableArea={results.saleableArea} />
      
      {/* 6. Financial Summary */}
      <div className="financial-summary">
        <h3>Financial Summary</h3>
        <div className="metrics-grid">
          <MetricCard
            label="Total Project Cost"
            value={results.totalCost}
            unit=""
            formatType="currency"
            variant="cost"
          />
          <MetricCard
            label="Interest Cost"
            value={results.interestCost}
            unit=""
            formatType="currency"
            variant="cost"
          />
          <MetricCard
            label="Final Project Cost"
            value={results.finalCost}
            unit=""
            formatType="currency"
            variant="cost"
          />
          <MetricCard
            label="Revenue"
            value={results.revenue}
            unit=""
            formatType="currency"
            variant="revenue"
          />
          <MetricCard
            label="Profit"
            value={results.profit}
            unit=""
            formatType="currency"
            variant="profit"
            isNegative={results.profit < 0}
          />
          <MetricCard
            label="Profit Percentage"
            value={results.profitPercent}
            unit="%"
            formatType="percentage"
            variant="profit-percentage"
            isNegative={results.profitPercent < 0}
          />
        </div>
        <ViabilityIndicator profitPercent={results.profitPercent} />
      </div>

      {/* 7. Phased Revenue Table */}
      <PhasedRevenueTable yearlyRevenue={results.yearlyRevenue} totalRevenue={results.revenue} />

      {/* 8. Bottom Section: Scenario Analysis */}
      <div className="results-bottom-grid">
        <ScenarioComparison inputs={inputs} />
      </div>
    </div>
  );
}
