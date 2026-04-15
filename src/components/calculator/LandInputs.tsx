import React from 'react';
import { FeasibilityInputs } from '../../types/feasibilityTypes';

interface LandInputsProps {
  inputs: FeasibilityInputs;
  onChange: (inputs: FeasibilityInputs) => void;
}

export function LandInputs({ inputs, onChange }: LandInputsProps) {
  const handleChange = (field: keyof FeasibilityInputs, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="input-section">
      <h3>Land Details</h3>
      <div className="input-group">
        <label htmlFor="plotArea">Plot Area (sq ft)</label>
        <input
          id="plotArea"
          type="number"
          value={inputs.plotArea}
          onChange={(e) => handleChange('plotArea', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="fsi">FSI (Floor Space Index)</label>
          <span className="tooltip-icon" title="Floor Space Index determines how much construction is allowed relative to the plot area.">ℹ️</span>
        </div>
        <input
          id="fsi"
          type="number"
          step="0.1"
          value={inputs.fsi}
          onChange={(e) => handleChange('fsi', parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
