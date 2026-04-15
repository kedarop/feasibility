import { jsPDF } from 'jspdf';
import { FeasibilityInputs, FeasibilityResults } from '../types/feasibilityTypes';

function formatCurrency(num: number): string {
  const absValue = Math.abs(num);

  if (absValue >= 10000000) {
    const crores = num / 10000000;
    return crores.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' Cr';
  }

  return num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function generateFeasibilityPDF(inputs: FeasibilityInputs, results: FeasibilityResults) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  });

  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  

  // Helper functions
  const addTitle = (text: string, size: number = 18) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += 8;
  };

  const addSubtitle = (text: string, size: number = 12) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'normal');
    doc.text(text, margin, y);
    y += 6;
  };

  const addSectionHeader = (text: string) => {
    y += 2;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(text, margin, y);
    y += 6;
  };

  const addKeyValue = (key: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(key + ':', margin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(value, pageWidth - margin - 40, y, { align: 'right' });
    y += 5;
  };

  const addSpacing = (amount: number = 8) => {
    y += amount;
  };

  // 1. Header
  addTitle('Redevelopment Feasibility Report');
  addSubtitle('KNP Consultants', 11);
  addSubtitle(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 9);
  addSpacing(10);

  // 2. Project Overview Section
  addSectionHeader('PROJECT OVERVIEW');
  addKeyValue('Plot Area', `${inputs.plotArea.toLocaleString('en-IN')} sq.m`);
  addKeyValue('FSI (Floor Space Index)', `${inputs.fsi}`);
  addKeyValue('Members', `${inputs.members}`);
  addKeyValue('Rehab Carpet per Member', `${inputs.rehabCarpetPerMember} sq.m`);
  addSpacing(8);

  // 3. Area Summary Section
  addSectionHeader('AREA SUMMARY');
  const totalBuiltUp = inputs.plotArea * inputs.fsi;
  const rehabBuiltUp = inputs.members * inputs.rehabCarpetPerMember;
  const saleBuiltUp = totalBuiltUp - rehabBuiltUp;

  addKeyValue('Total Built-Up Area', `${totalBuiltUp.toLocaleString('en-IN')} sq.m`);
  addKeyValue('Rehab Built-Up Area', `${rehabBuiltUp.toLocaleString('en-IN')} sq.m`);
  addKeyValue('Sale Built-Up Area', `${saleBuiltUp.toLocaleString('en-IN')} sq.m`);
  addSpacing(8);

  // 4. Financial Summary Section
  addSectionHeader('FINANCIAL SUMMARY');
  addKeyValue('Total Project Cost', formatCurrency(results.totalCost));
  addKeyValue('Revenue', formatCurrency(results.revenue));
  addKeyValue('Profit', formatCurrency(results.profit));
  addKeyValue('Profit Percentage', `${results.profitPercent.toFixed(2)}%`);

  // Add feasibility status
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const status = results.isFeasible ? 'FEASIBLE' : 'NOT FEASIBLE';
  if (results.isFeasible) {
    doc.setTextColor(48, 209, 136);
  } else {
    doc.setTextColor(255, 69, 58);
  }
  doc.text(`Status: ${status}`, margin, y);
  doc.setTextColor(0, 0, 0);
  y += 8;

  addSpacing(4);

  // 5. Cost Breakdown Section
  addSectionHeader('COST BREAKDOWN');
  const totalConstructionCost = inputs.constructionRate * totalBuiltUp;

  addKeyValue('Construction', formatCurrency(totalConstructionCost));
  addKeyValue('Rent', formatCurrency(inputs.rentCost));
  addKeyValue('Corpus', formatCurrency(inputs.corpusCost));
  addKeyValue('Miscellaneous', formatCurrency(inputs.miscCost));

  // Calculate percentages
  const totalCosts = totalConstructionCost + inputs.rentCost + inputs.corpusCost + inputs.miscCost;
  const constructionPct = ((totalConstructionCost / totalCosts) * 100).toFixed(1);
  const rentPct = ((inputs.rentCost / totalCosts) * 100).toFixed(1);
  const corpusPct = ((inputs.corpusCost / totalCosts) * 100).toFixed(1);
  const miscPct = ((inputs.miscCost / totalCosts) * 100).toFixed(1);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text(`(${constructionPct}%) (${rentPct}%) (${corpusPct}%) (${miscPct}%)`, margin + 100, 145);
  doc.setTextColor(0, 0, 0);

  addSpacing(8);

  // 6. Scenario Analysis Section
  addSectionHeader('SCENARIO ANALYSIS');

  const scenarios = [
    {
      rate: Math.round(inputs.saleRate * 0.9),
      label: '10% Lower',
    },
    {
      rate: inputs.saleRate,
      label: 'Current',
    },
    {
      rate: Math.round(inputs.saleRate * 1.1),
      label: '10% Higher',
    },
  ];

  // Table header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Scenario', margin, y);
  doc.text('Sale Rate (₹/sq.m)', margin + 50, y);
  doc.text('Profit', margin + 110, y, { align: 'right' });
  y += 5;

  // Horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  scenarios.forEach((scenario) => {
    // Calculate profit for scenario
    const scenarioRevenue = saleBuiltUp * scenario.rate;
    const scenarioProfit = scenarioRevenue - totalCosts;

    doc.text(scenario.label, margin, y);
    doc.text(`₹${scenario.rate.toLocaleString('en-IN')}`, margin + 50, y);
    doc.text(formatCurrency(scenarioProfit), pageWidth - margin - 5, y, { align: 'right' });
    y += 5;
  });

  // Footer
  addSpacing(12);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  doc.text('This report is generated for feasibility analysis purposes only.', margin, doc.internal.pageSize.getHeight() - 10);

  // Save PDF
  doc.save('feasibility-report.pdf');
}
