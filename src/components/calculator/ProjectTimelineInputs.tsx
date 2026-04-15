import React from 'react';
import { FeasibilityInputs } from '../../types/feasibilityTypes';

interface ProjectTimelineInputsProps {
  inputs: FeasibilityInputs;
  onChange: (inputs: FeasibilityInputs) => void;
}

export function ProjectTimelineInputs({ inputs, onChange }: ProjectTimelineInputsProps) {
  const handleChange = (field: keyof FeasibilityInputs, value: number | number[]) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const handleDistributionChange = (index: number, value: number) => {
    const newDistribution = [...inputs.saleDistribution];
    newDistribution[index] = value;
    handleChange('saleDistribution', newDistribution);
  };

  return (
    <div className="input-section">
      <h3>Project Timeline & Financing</h3>
      
      <div className="input-group">
        <label htmlFor="projectDuration">Project Duration (years)</label>
        <input
          id="projectDuration"
          type="number"
          step="0.5"
          min="0"
          value={inputs.projectDuration}
          onChange={(e) => handleChange('projectDuration', parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="input-group">
        <label htmlFor="interestRate">Interest Rate (% per year)</label>
        <input
          id="interestRate"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={inputs.interestRate}
          onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
        />
      </div>

      <div className="distribution-section">
        <label>Sales Distribution by Year (%)</label>
        <div className="distribution-inputs">
          {inputs.saleDistribution.map((distribution, index) => (
            <div key={index} className="distribution-input-group">
              <label htmlFor={`distribution-year-${index}`}>Year {index + 1}</label>
              <input
                id={`distribution-year-${index}`}
                type="number"
                step="1"
                min="0"
                max="100"
                value={distribution}
                onChange={(e) => handleDistributionChange(index, parseFloat(e.target.value) || 0)}
              />
              <span className="distribution-percent">%</span>
            </div>
          ))}
        </div>
        <div className="distribution-total">
          Total: {inputs.saleDistribution.reduce((a, b) => a + b, 0).toFixed(1)}%
        </div>
      </div>
    </div>
  );
}
