import React from 'react';
import { FeasibilityInputs } from '../../types/feasibilityTypes';
                 
interface RehabInputsProps {
  inputs: FeasibilityInputs;
  onChange: (inputs: FeasibilityInputs) => void;
}

export function RehabInputs({ inputs, onChange }: RehabInputsProps) {
  const handleChange = (field: keyof FeasibilityInputs, value: number) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  return (
    <div className="input-section">
      <h3>Rehab Details</h3>
      <div className="input-group">
        <label htmlFor="members">Members</label>
        <input
          id="members"
          type="number"
          value={inputs.members}
          onChange={(e) => handleChange('members', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="rehabCarpetPerMember">Rehab Carpet per Member (sq ft)</label>
          <span className="tooltip-icon" title="Base area allocated for carpet space per member before loading percentage is applied.">ℹ️</span>
        </div>
        <input
          id="rehabCarpetPerMember"
          type="number"
          value={inputs.rehabCarpetPerMember}
          onChange={(e) => handleChange('rehabCarpetPerMember', parseFloat(e.target.value) || 0)}
        />
      </div>
      <div className="input-group">
        <div className="label-wrapper">
          <label htmlFor="loadingPercent">Loading Percent (%)</label>
          <span className="tooltip-icon" title="Additional area added to carpet area to account for walls and common areas.">ℹ️</span>
        </div>
        <input
          id="loadingPercent"
          type="number"
          value={inputs.loadingPercent}
          onChange={(e) => handleChange('loadingPercent', parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
