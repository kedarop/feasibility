import React from 'react';
import { FeasibilityInputs } from '../../types/feasibilityTypes';

interface CostInputsProps {
  inputs: FeasibilityInputs;
  onChange: (inputs: FeasibilityInputs) => void;
}

export function CostInputs({ inputs, onChange }: CostInputsProps) {
  const handleChange = (field: keyof FeasibilityInputs, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="input-section">
      <h3>Cost Inputs</h3>
      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="constructionRate">Construction Rate (per sq ft)</label>
          <span className="tooltip-icon" title="Cost of construction per square foot of built-up area, including labor and materials.">ℹ️</span>
        </div>
        <input
          id="constructionRate"
          type="number"
          step="0.01"
          value={inputs.constructionRate}
          onChange={(e) => handleChange('constructionRate', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="rentCost">Rent Cost</label>
        <input
          id="rentCost"
          type="number"
          step="0.01"
          value={inputs.rentCost}
          onChange={(e) => handleChange('rentCost', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="corpusCost">Corpus Cost</label>
        <input
          id="corpusCost"
          type="number"
          step="0.01"
          value={inputs.corpusCost}
          onChange={(e) => handleChange('corpusCost', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="miscCost">Misc Cost</label>
        <input
          id="miscCost"
          type="number"
          step="0.01"
          value={inputs.miscCost}
          onChange={(e) => handleChange('miscCost', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="inflationRate">Inflation Rate (% per year)</label>
        <div className="input-with-unit">
          <input
            id="inflationRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={inputs.inflationRate}
            onChange={(e) => handleChange('inflationRate', parseFloat(e.target.value) || 0)}
          />
          <span className="unit-suffix">%</span>
        </div>
        <div className="input-hint">Construction cost inflation applied over project duration</div>
      </div>
    </div>
  );
}
