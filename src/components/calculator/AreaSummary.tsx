import React from 'react';
import { FeasibilityResults } from '../../types/feasibilityTypes';

interface AreaSummaryProps {
  results: FeasibilityResults;
}

function formatArea(num: number): string {
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

interface AreaCardProps {
  label: string;
  value: number;
  unit: string;
  icon: string;
}

function AreaCard({ label, value, unit, icon }: AreaCardProps) {
  return (
    <div className="area-card">
      <div className="area-card-icon">{icon}</div>
      <div className="area-card-content">
        <div className="area-card-label">{label}</div>
        <div className="area-card-value">{formatArea(value)}</div>
        <div className="area-card-unit">{unit}</div>
      </div>
    </div>
  );
}

interface RehabBurdenIndicatorProps {
  rehabBurden: number;
}

function RehabBurdenIndicator({ rehabBurden }: RehabBurdenIndicatorProps) {
  const getRehabBurdenLabel = () => {
    if (rehabBurden > 70) {
      return 'High';
    }
    if (rehabBurden >= 50) {
      return 'Moderate';
    }
    return 'Low';
  };

  const getRehabBurdenColor = () => {
    if (rehabBurden > 70) {
      return 'high';
    }
    if (rehabBurden >= 50) {
      return 'moderate';
    }
    return 'low';
  };

  const label = getRehabBurdenLabel();
  const color = getRehabBurdenColor();

  return (
    <div className={`rehab-burden-indicator rehab-burden-${color}`}>
      <div className="rehab-burden-label">Rehab Burden</div>
      <div className="rehab-burden-value">{Math.round(rehabBurden)}%</div>
      <div className="rehab-burden-status">{label}</div>
    </div>
  );
}

export function AreaSummary({ results }: AreaSummaryProps) {
  return (
    <div className="area-summary">
      <h3>Area Summary</h3>
      <div className="area-grid">
        <AreaCard
          label="Total Built-Up Area"
          value={results.totalBuiltUp}
          unit="sq ft"
          icon="📐"
        />
        <AreaCard
          label="Rehab Built-Up Area"
          value={results.rehabBuiltUp}
          unit="sq ft"
          icon="🏗️"
        />
        <AreaCard
          label="Sale Built-Up Area"
          value={results.saleBuiltUp}
          unit="sq ft"
          icon="🏢"
        />
        <AreaCard
          label="Saleable Area"
          value={results.saleableArea}
          unit="sq ft"
          icon="💼"
        />
      </div>
      <RehabBurdenIndicator rehabBurden={results.rehabBurden} />
    </div>
  );
}
