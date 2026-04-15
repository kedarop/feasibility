import React, { useState, useEffect } from 'react';
import { FeasibilityInputs } from '../types/feasibilityTypes';
import { calculateFeasibility } from '../calculator/calculateFeasibility';
import { generateFeasibilityPDF } from '../utils/pdfGenerator';
import { ProjectTypeSelector } from '../components/calculator/ProjectTypeSelector';
import { LandInputs } from '../components/calculator/LandInputs';
import { RehabInputs } from '../components/calculator/RehabInputs';
import { CostInputs } from '../components/calculator/CostInputs';
import { SaleInputs } from '../components/calculator/SaleInputs';
import { ProjectTimelineInputs } from '../components/calculator/ProjectTimelineInputs';
import { AreaSummary } from '../components/calculator/AreaSummary';
import { ResultsPanel } from '../components/calculator/ResultsPanel';
import { CostBreakdownChart } from '../components/calculator/CostBreakdownChart';

const defaultInputs: FeasibilityInputs = {
  projectType: 'standard',
  plotArea: 10000,
  fsi: 2.5,
  members: 10,
  rehabCarpetPerMember: 400,
  loadingPercent: 20,
  constructionRate: 3000,
  rentCost: 500000,
  corpusCost: 1000000,
  miscCost: 500000,
  saleRate: 8000,
  saleEfficiency: 100,
  targetProfitPercent: 25,
  projectDuration: 3,
  interestRate: 5,
  inflationRate: 6,
  saleDistribution: [30, 40, 30],
};

export function FeasibilityCalculatorPage() {
  const [inputs, setInputs] = useState<FeasibilityInputs>(defaultInputs);
  const [isDark, setIsDark] = useState(false);
  const results = calculateFeasibility(inputs);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const handleInputChange = (newInputs: FeasibilityInputs) => {
    setInputs(newInputs);
  };

  const handleDownload = () => {
    generateFeasibilityPDF(inputs, results);
  };

  return (
    <div id="calculator-root">
      <div className="calculator-container">
        <header className="calculator-header">
          <button
            className="theme-toggle-btn"
            onClick={() => setIsDark((prev) => !prev)}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <h1>Redevelopment Feasibility Calculator</h1>
          <p>Estimate financial feasibility of your real estate redevelopment project</p>
          <button
            className="download-report-btn"
            onClick={handleDownload}
            title="Download report as PDF"
          >
            ⬇ Download Report
          </button>
        </header>

      <div className="calculator-layout">
        {/* Left side - Inputs Grid */}
        <div className="inputs-section">
          {/* Project Type Selector */}
          <ProjectTypeSelector inputs={inputs} onChange={handleInputChange} />

          {/* Row 1: Land Details and Rehab Details */}
          <div className="inputs-row">
            <LandInputs inputs={inputs} onChange={handleInputChange} />
            <RehabInputs inputs={inputs} onChange={handleInputChange} />
          </div>

          {/* Row 2: Cost Inputs and Sale Inputs */}
          <div className="inputs-row">
            <CostInputs inputs={inputs} onChange={handleInputChange} />
            <SaleInputs inputs={inputs} onChange={handleInputChange} />
          </div>

          {/* Row 3: Project Timeline & Financing */}
          <ProjectTimelineInputs inputs={inputs} onChange={handleInputChange} />

          {/* Cost Breakdown Chart - Now in left column */}
          <CostBreakdownChart inputs={inputs} />
        </div>

        {/* Right side - Results */}
        <div className="results-section">
          <AreaSummary results={results} />
          <ResultsPanel results={results} inputs={inputs} />
        </div>
      </div>
      </div>
    </div>
  );
}
