// Tax rates for Ghana (Effective from 01/01/2024)

// SSNIT contribution rate (5.5%)
export const SSNIT_RATE = 5.5;

// Monthly tax rates
// Format: [tax percentage, band size in GHC]
export const monthlyTaxRates = {
  effectiveFrom: '01/01/2024',
  rates: [
    [0, 490],
    [5, 110],
    [10, 130],
    [17.5, 3166.67],
    [25, 16000],
    [30, 30520],
    [35, Number.POSITIVE_INFINITY] // anything above GHC 50,000
  ]
};

