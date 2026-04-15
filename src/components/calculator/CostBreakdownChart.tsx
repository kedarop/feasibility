import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { FeasibilityInputs } from '../../types/feasibilityTypes';

interface CostBreakdownChartProps {
  inputs: FeasibilityInputs;
}

const COST_LABELS = {
  construction: 'Construction',
  rent: 'Rent',
  corpus: 'Corpus',
  misc: 'Miscellaneous',
};

export function CostBreakdownChart({ inputs }: CostBreakdownChartProps) {
  // Get theme-aware chart colors from CSS variables
  const getChartColors = useMemo(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return [
        styles.getPropertyValue('--chart-color-1').trim(),
        styles.getPropertyValue('--chart-color-2').trim(),
        styles.getPropertyValue('--chart-color-3').trim(),
        styles.getPropertyValue('--chart-color-4').trim(),
      ];
    }
    return ['#3b82f6', '#2563eb', '#ea580c', '#6366f1'];
  }, []);

  // Calculate total construction cost (rate × built-up area)
  const builtupArea = inputs.plotArea * inputs.fsi;
  const totalConstructionCost = inputs.constructionRate * builtupArea;

  const costs = [
    {
      name: COST_LABELS.construction,
      value: totalConstructionCost,
      key: 'construction',
    },
    {
      name: COST_LABELS.rent,
      value: inputs.rentCost,
      key: 'rent',
    },
    {
      name: COST_LABELS.corpus,
      value: inputs.corpusCost,
      key: 'corpus',
    },
    {
      name: COST_LABELS.misc,
      value: inputs.miscCost,
      key: 'misc',
    },
  ];

  const totalCost = costs.reduce((sum, cost) => sum + cost.value, 0);

  const chartData = costs.map((cost) => ({
    name: cost.name,
    value: cost.value,
    percentage: ((cost.value / totalCost) * 100).toFixed(1),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">₹{(data.value / 10000000).toFixed(2)} Cr</p>
          <p className="tooltip-percentage">{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="pie-label"
        fontWeight="700"
        fontSize="12"
      >
        {percentage}%
      </text>
    );
  };

  return (
    <div className="cost-breakdown-section">
      <h3>Cost Breakdown</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={90}
              innerRadius={50}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getChartColors[index % getChartColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="custom-legend">
        {chartData.map((item, index) => (
          <div key={item.name} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: getChartColors[index % getChartColors.length] }}
            />
            <div className="legend-content">
              <div className="legend-label">{item.name}</div>
              <div className="legend-value">₹{(item.value / 10000000).toFixed(2)} Cr ({item.percentage}%)</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
