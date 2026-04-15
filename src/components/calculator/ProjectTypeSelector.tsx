import React from 'react';
import { ProjectType, FeasibilityInputs } from '../../types/feasibilityTypes';
import { CustomDropdown } from './CustomDropdown';

interface ProjectTypeSelectorProps {
  inputs: FeasibilityInputs;
  onChange: (inputs: FeasibilityInputs) => void;
}

const projectTypeDefaults: Record<ProjectType, { fsi: number; loadingPercent: number }> = {
  standard: { fsi: 2.5, loadingPercent: 20 },
  cluster: { fsi: 3.5, loadingPercent: 25 },
  sra: { fsi: 4.0, loadingPercent: 30 },
};

const projectTypeOptions = [
  { value: 'standard', label: 'Standard Redevelopment' },
  { value: 'cluster', label: 'Cluster Redevelopment' },
  { value: 'sra', label: 'SRA' },
];

export function ProjectTypeSelector({ inputs, onChange }: ProjectTypeSelectorProps) {
  const handleProjectTypeChange = (newProjectType: string) => {
    const projectType = newProjectType as ProjectType;
    const defaults = projectTypeDefaults[projectType];
    onChange({
      ...inputs,
      projectType,
      fsi: defaults.fsi,
      loadingPercent: defaults.loadingPercent,
    });
  };

  return (
    <div className="input-section project-type-selector">
      <h3>Project Type</h3>
      <div className="input-group">
        <label htmlFor="projectType">Select Project Type</label>
        <CustomDropdown
          id="projectType"
          options={projectTypeOptions}
          value={inputs.projectType}
          onChange={handleProjectTypeChange}
        />
      </div>
    </div>
  );
}
