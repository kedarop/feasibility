import React from 'react';
import { FeasibilityInputs } from '../../types/feasibilityTypes';

interface SaleInputsProps {
  inputs: FeasibilityInputs;
  onChange: (inputs: FeasibilityInputs) => void;
}

export function SaleInputs({ inputs, onChange }: SaleInputsProps) {
  const handleChange = (field: keyof FeasibilityInputs, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="input-section">
      <h3>Sale Inputs</h3>
      
      {/* Sale Rate Slider */}
      <div className="input-group">
        <label htmlFor="saleRateSlider">Sale Rate (per sq ft)</label>
        <div className="slider-container">
          <div className="slider-value-display">₹ {Math.round(inputs.saleRate).toLocaleString('en-IN')}</div>
          <input
            id="saleRateSlider"
            type="range"
            min="5000"
            max="15000"
            step="100"
            value={inputs.saleRate}
            onChange={(e) => handleChange('saleRate', parseFloat(e.target.value))}
            className="price-slider"
          />
          <div className="slider-range">
            <span className="slider-min">₹5000</span>
            <span className="slider-max">₹15000</span>
          </div>
        </div>
      </div>

      {/* Manual Input Field */}
      <div className="input-group">
        <label htmlFor="saleRate">Or enter manually</label>
        <input
          id="saleRate"
          type="number"
          step="0.01"
          value={inputs.saleRate}
          onChange={(e) => handleChange('saleRate', parseFloat(e.target.value) || 0)}
        />
      </div>

      {/* Sale Efficiency */}
      <div className="input-group">
        <label htmlFor="saleEfficiency">Sale Efficiency (%)</label>
        <div className="input-with-unit">
          <input
            id="saleEfficiency"
            type="number"
            step="1"
            min="0"
            max="100"
            value={inputs.saleEfficiency}
            onChange={(e) => handleChange('saleEfficiency', parseFloat(e.target.value) || 0)}
          />
          <span className="unit-suffix">%</span>
        </div>
        <div className="input-hint">Percentage of built-up area available for sale after losses</div>
      </div>

      {/* Target Profit Percentage */}
      <div className="input-group">
        <label htmlFor="targetProfitPercent">Target Profit (%)</label>
        <div className="input-with-unit">
          <input
            id="targetProfitPercent"
            type="number"
            step="1"
            min="0"
            max="200"
            value={inputs.targetProfitPercent}
            onChange={(e) => handleChange('targetProfitPercent', parseFloat(e.target.value) || 0)}
          />
          <span className="unit-suffix">%</span>
        </div>
        <div className="input-hint">Desired profit as percentage of total cost</div>
      </div>
    </div>
  );
}
