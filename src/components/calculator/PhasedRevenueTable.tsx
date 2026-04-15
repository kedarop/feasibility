import React from 'react';
import { YearlyRevenue } from '../../types/feasibilityTypes';

interface PhasedRevenueTableProps {
  yearlyRevenue: YearlyRevenue[];
  totalRevenue: number;
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

export function PhasedRevenueTable({ yearlyRevenue, totalRevenue }: PhasedRevenueTableProps) {
  return (
    <div className="phased-revenue-section">
      <h3>Yearly Revenue Breakdown</h3>
      <table className="phased-revenue-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Distribution %</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {yearlyRevenue.map((year) => (
            <tr key={year.year}>
              <td className="year-cell">Year {year.year}</td>
              <td className="distribution-cell">{year.distribution.toFixed(1)}%</td>
              <td className="revenue-cell numeric">{formatCurrency(year.revenue)}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={2} className="total-label">Total Revenue</td>
            <td className="total-revenue numeric">{formatCurrency(totalRevenue)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
