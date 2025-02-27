import { monthlyTaxRates} from "./rates";

// Helper function to calculate income tax based on the tax brackets
export const calculateIncomeTax = (taxableIncome: number): number => {
    let remainingIncome = taxableIncome;
    let totalTax = 0;
    let cumulativeBracket = 0;
  
    for (const [rate, band] of monthlyTaxRates.rates) {
      const taxableInThisBracket = Math.min(remainingIncome, band);
      
      if (taxableInThisBracket <= 0) break;
      
      totalTax += (taxableInThisBracket * rate) / 100;
      remainingIncome -= taxableInThisBracket;
      cumulativeBracket += band;
      
      if (remainingIncome <= 0) break;
    }
  
    return totalTax;
  };
  
  // Helper to get cumulative bracket thresholds for display
  export const getCumulativeBrackets = (): number[] => {
    const brackets: number[] = [0];
    let sum = 0;
    
    for (const [_, band] of monthlyTaxRates.rates) {
      if (band !== Number.POSITIVE_INFINITY) {
        sum += band;
        brackets.push(sum);
      }
    }
    
    return brackets;
  };