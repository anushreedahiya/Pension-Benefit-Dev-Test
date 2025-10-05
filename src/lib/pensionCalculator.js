/**
 * Pension Calculator Utility
 * Parses pension formulas and calculates estimated pension amounts
 */

// Helper function to extract numbers from strings
const extractNumber = (str) => {
  const match = str.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, '')) : 0;
};

// Helper function to extract percentage from strings
const extractPercentage = (str) => {
  const match = str.match(/(\d+(?:\.\d+)?)%/);
  return match ? parseFloat(match[1]) : 0;
};

// Helper function to extract range from strings like "₹1,000–₹5,000"
const extractRange = (str) => {
  const matches = str.match(/₹([\d,]+)–₹([\d,]+)/);
  if (matches) {
    return {
      min: parseInt(matches[1].replace(/,/g, '')),
      max: parseInt(matches[2].replace(/,/g, ''))
    };
  }
  return null;
};

/**
 * Calculate pension based on formula type and user parameters
 */
export const calculatePension = (scheme, userProfile) => {
  const { age, annualSalary, monthlySalary } = userProfile;
  const formula = scheme.pension_formula?.toLowerCase() || '';
  
  // Default calculation parameters
  const yearsToRetirement = Math.max(0, 60 - age);
  const yearsOfService = Math.min(yearsToRetirement, 40); // Assume max 40 years of service
  const monthlySalaryForCalc = monthlySalary || annualSalary / 12;
  
  try {
    // Fixed amount pensions (e.g., ₹3,000 per month)
    if (formula.includes('₹') && formula.includes('per month')) {
      const amount = extractNumber(formula);
      return {
        type: 'fixed_monthly',
        monthlyPension: amount,
        annualPension: amount * 12,
        calculation: `Fixed monthly pension of ₹${amount.toLocaleString()}`
      };
    }
    
    // Range-based pensions (e.g., ₹1,000–₹5,000 per month)
    if (formula.includes('–') && formula.includes('per month')) {
      const range = extractRange(formula);
      if (range) {
        // Estimate based on salary level
        let estimatedAmount;
        if (annualSalary <= 300000) {
          estimatedAmount = range.min;
        } else if (annualSalary <= 1000000) {
          estimatedAmount = (range.min + range.max) / 2;
        } else {
          estimatedAmount = range.max;
        }
        
        return {
          type: 'range_based',
          monthlyPension: estimatedAmount,
          annualPension: estimatedAmount * 12,
          range: range,
          calculation: `Estimated pension between ₹${range.min.toLocaleString()} - ₹${range.max.toLocaleString()} per month`
        };
      }
    }
    
    // EPS formula: Pension = Pensionable Salary × Pensionable Service × Factor
    if (formula.includes('pensionable salary') && formula.includes('pensionable service')) {
      // EPS calculation (simplified)
      const pensionableSalary = Math.min(monthlySalaryForCalc, 15000); // EPS cap
      const factor = 0.00833; // Standard EPS factor
      const monthlyPension = pensionableSalary * yearsOfService * factor;
      
      return {
        type: 'eps_formula',
        monthlyPension: Math.round(monthlyPension),
        annualPension: Math.round(monthlyPension * 12),
        calculation: `EPS: ₹${pensionableSalary.toLocaleString()} × ${yearsOfService} years × ${factor} = ₹${Math.round(monthlyPension).toLocaleString()}/month`
      };
    }
    
    // EPF accumulation formula
    if (formula.includes('accumulates') && formula.includes('contributions')) {
      // EPF calculation (simplified)
      const employeeContribution = monthlySalaryForCalc * 0.12;
      const employerContribution = monthlySalaryForCalc * 0.12;
      const totalMonthlyContribution = employeeContribution + employerContribution;
      const interestRate = 0.085; // 8.5% annual interest
      
      // Calculate accumulated corpus
      let corpus = 0;
      for (let year = 1; year <= yearsOfService; year++) {
        corpus += totalMonthlyContribution * 12 * Math.pow(1 + interestRate, year);
      }
      
      return {
        type: 'epf_accumulation',
        monthlyPension: 0, // EPF is lump sum, not monthly pension
        annualPension: 0,
        lumpSumCorpus: Math.round(corpus),
        calculation: `EPF Corpus: ₹${Math.round(corpus).toLocaleString()} (lump sum at retirement)`
      };
    }
    
    // NPS formula (market-linked)
    if (formula.includes('market') && formula.includes('corpus')) {
      // NPS calculation (simplified)
      const employeeContribution = monthlySalaryForCalc * 0.10; // 10% contribution
      const employerContribution = monthlySalaryForCalc * 0.10; // 10% employer match
      const totalMonthlyContribution = employeeContribution + employerContribution;
      const expectedReturn = 0.10; // 10% annual return
      
      // Calculate accumulated corpus
      let corpus = 0;
      for (let year = 1; year <= yearsOfService; year++) {
        corpus += totalMonthlyContribution * 12 * Math.pow(1 + expectedReturn, year);
      }
      
      // 60% lump sum, 40% annuity
      const lumpSum = corpus * 0.6;
      const annuityCorpus = corpus * 0.4;
      const monthlyAnnuity = annuityCorpus * 0.06 / 12; // 6% annuity rate
      
      return {
        type: 'nps_market_linked',
        monthlyPension: Math.round(monthlyAnnuity),
        annualPension: Math.round(monthlyAnnuity * 12),
        lumpSumCorpus: Math.round(lumpSum),
        annuityCorpus: Math.round(annuityCorpus),
        calculation: `NPS: ₹${Math.round(corpus).toLocaleString()} corpus → ₹${Math.round(lumpSum).toLocaleString()} lump sum + ₹${Math.round(monthlyAnnuity).toLocaleString()}/month annuity`
      };
    }
    
         // India-specific schemes
     if (scheme.country === 'India') {
       // APY formula (fixed contribution)
       if (scheme.scheme_id === 'CEN_APY') {
         const monthlyContribution = 100; // APY minimum contribution
         const govtContribution = 50; // Government co-contribution
         const interestRate = 0.08; // 8% interest
         
         let corpus = 0;
         for (let year = 1; year <= yearsOfService; year++) {
           corpus += (monthlyContribution + govtContribution) * 12 * Math.pow(1 + interestRate, year);
         }
         
         const monthlyPension = corpus * 0.06 / 12; // 6% annuity rate
         
         return {
           type: 'apy_fixed',
           monthlyPension: Math.round(monthlyPension),
           annualPension: Math.round(monthlyPension * 12),
           corpus: Math.round(corpus),
           calculation: `APY: ₹${Math.round(corpus).toLocaleString()} corpus → ₹${Math.round(monthlyPension).toLocaleString()}/month pension`
         };
       }
       
       // PM-SYM formula
       if (scheme.scheme_id === 'CEN_PM_SYM') {
         const monthlyContribution = 100; // PM-SYM contribution
         const govtContribution = 100; // Government matching
         const interestRate = 0.08; // 8% interest
         
         let corpus = 0;
         for (let year = 1; year <= yearsOfService; year++) {
           corpus += (monthlyContribution + govtContribution) * 12 * Math.pow(1 + interestRate, year);
         }
         
         const monthlyPension = corpus * 0.06 / 12; // 6% annuity rate
         
         return {
           type: 'pm_sym',
           monthlyPension: Math.round(monthlyPension),
           annualPension: Math.round(monthlyPension * 12),
           corpus: Math.round(corpus),
           calculation: `PM-SYM: ₹${Math.round(corpus).toLocaleString()} corpus → ₹${Math.round(monthlyPension).toLocaleString()}/month pension`
         };
       }
       
       // NPS formula (market-linked)
       if (scheme.scheme_id === 'CEN_NPS_T1') {
         const employeeContribution = monthlySalaryForCalc * 0.10; // 10% contribution
         const employerContribution = monthlySalaryForCalc * 0.10; // 10% employer match
         const totalMonthlyContribution = employeeContribution + employerContribution;
         const expectedReturn = 0.10; // 10% annual return
         
         let corpus = 0;
         for (let year = 1; year <= yearsOfService; year++) {
           corpus += totalMonthlyContribution * 12 * Math.pow(1 + expectedReturn, year);
         }
         
         // 60% lump sum, 40% annuity
         const lumpSum = corpus * 0.6;
         const annuityCorpus = corpus * 0.4;
         const monthlyAnnuity = annuityCorpus * 0.06 / 12; // 6% annuity rate
         
         return {
           type: 'nps_market_linked',
           monthlyPension: Math.round(monthlyAnnuity),
           annualPension: Math.round(monthlyAnnuity * 12),
           lumpSumCorpus: Math.round(lumpSum),
           annuityCorpus: Math.round(annuityCorpus),
           calculation: `NPS: ₹${Math.round(corpus).toLocaleString()} corpus → ₹${Math.round(lumpSum).toLocaleString()} lump sum + ₹${Math.round(monthlyAnnuity).toLocaleString()}/month annuity`
         };
       }
       
       // EPF accumulation formula
       if (scheme.scheme_id === 'CEN_EPF') {
         const employeeContribution = monthlySalaryForCalc * 0.12;
         const employerContribution = monthlySalaryForCalc * 0.12;
         const totalMonthlyContribution = employeeContribution + employerContribution;
         const interestRate = 0.085; // 8.5% annual interest
         
         let corpus = 0;
         for (let year = 1; year <= yearsOfService; year++) {
           corpus += totalMonthlyContribution * 12 * Math.pow(1 + interestRate, year);
         }
         
         return {
           type: 'epf_accumulation',
           monthlyPension: 0, // EPF is lump sum, not monthly pension
           annualPension: 0,
           lumpSumCorpus: Math.round(corpus),
           calculation: `EPF Corpus: ₹${Math.round(corpus).toLocaleString()} (lump sum at retirement)`
         };
       }
       
       // EPS formula
       if (scheme.scheme_id === 'CEN_EPS') {
         const pensionableSalary = Math.min(monthlySalaryForCalc, 15000); // EPS cap
         const factor = 0.00833; // Standard EPS factor
         const monthlyPension = pensionableSalary * yearsOfService * factor;
         
         return {
           type: 'eps_formula',
           monthlyPension: Math.round(monthlyPension),
           annualPension: Math.round(monthlyPension * 12),
           calculation: `EPS: ₹${pensionableSalary.toLocaleString()} × ${yearsOfService} years × ${factor} = ₹${Math.round(monthlyPension).toLocaleString()}/month`
         };
       }
     }
     
     // Japan-specific schemes
     if (scheme.country === 'Japan') {
       // National Pension (Basic)
       if (scheme.scheme_id === 'JPN_NAT_NP_BASIC') {
         const fullPension = 816000; // ¥816,000 per year (FY2024)
         const contributionMonths = Math.min(yearsOfService * 12, 480); // Max 480 months
         const annualPension = fullPension * (contributionMonths / 480);
         
         return {
           type: 'japan_basic_pension',
           monthlyPension: Math.round(annualPension / 12),
           annualPension: Math.round(annualPension),
           calculation: `National Pension: ¥${Math.round(annualPension).toLocaleString()}/year (${contributionMonths} months)`
         };
       }
       
       // iDeCo (Individual DC)
       if (scheme.scheme_id === 'JPN_IND_IDECO') {
         const monthlyContribution = 23000; // ¥23,000 per month (employee limit)
         const expectedReturn = 0.06; // 6% annual return
         
         let corpus = 0;
         for (let year = 1; year <= yearsOfService; year++) {
           corpus += monthlyContribution * 12 * Math.pow(1 + expectedReturn, year);
         }
         
         const monthlyPension = corpus * 0.04 / 12; // 4% annuity rate
         
         return {
           type: 'japan_ideco',
           monthlyPension: Math.round(monthlyPension),
           annualPension: Math.round(monthlyPension * 12),
           corpus: Math.round(corpus),
           calculation: `iDeCo: ¥${Math.round(corpus).toLocaleString()} corpus → ¥${Math.round(monthlyPension).toLocaleString()}/month pension`
         };
       }
     }
     
     // USA-specific schemes
     if (scheme.country === 'USA') {
       // Social Security Retirement
       if (scheme.scheme_id === 'USA_FED_SS_RETIRE') {
         // Simplified Social Security calculation
         const averageMonthlyEarnings = Math.min(monthlySalaryForCalc, 14000); // Cap at $14,000/month
         const socialSecurityRate = 0.42; // Simplified rate
         const monthlyPension = averageMonthlyEarnings * socialSecurityRate;
         
         return {
           type: 'usa_social_security',
           monthlyPension: Math.round(monthlyPension),
           annualPension: Math.round(monthlyPension * 12),
           calculation: `Social Security: $${Math.round(monthlyPension).toLocaleString()}/month`
         };
       }
       
       // 401(k) calculation
       if (scheme.scheme_id === 'USA_EMP_401K') {
         const employeeContribution = monthlySalaryForCalc * 0.06; // 6% contribution
         const employerMatch = employeeContribution * 0.5; // 50% employer match
         const totalMonthlyContribution = employeeContribution + employerMatch;
         const expectedReturn = 0.07; // 7% annual return
         
         let corpus = 0;
         for (let year = 1; year <= yearsOfService; year++) {
           corpus += totalMonthlyContribution * 12 * Math.pow(1 + expectedReturn, year);
         }
         
         const monthlyPension = corpus * 0.04 / 12; // 4% withdrawal rate
         
         return {
           type: 'usa_401k',
           monthlyPension: Math.round(monthlyPension),
           annualPension: Math.round(monthlyPension * 12),
           corpus: Math.round(corpus),
           calculation: `401(k): $${Math.round(corpus).toLocaleString()} corpus → $${Math.round(monthlyPension).toLocaleString()}/month`
         };
       }
     }
     
     // UK-specific schemes
     if (scheme.country === 'UK') {
       // New State Pension
       if (scheme.scheme_id === 'UK_STATE_NEW') {
         const fullPension = 221.20 * 52; // £221.20 per week = £11,502.40 per year
         const qualifyingYears = Math.min(yearsOfService, 35); // Max 35 years
         const annualPension = fullPension * (qualifyingYears / 35);
         
         return {
           type: 'uk_state_pension',
           monthlyPension: Math.round(annualPension / 12),
           annualPension: Math.round(annualPension),
           calculation: `State Pension: £${Math.round(annualPension).toLocaleString()}/year (${qualifyingYears} years)`
         };
       }
       
       // Workplace DC Pension
       if (scheme.scheme_id === 'UK_EMP_DC') {
         const employeeContribution = monthlySalaryForCalc * 0.05; // 5% contribution
         const employerContribution = monthlySalaryForCalc * 0.03; // 3% employer contribution
         const totalMonthlyContribution = employeeContribution + employerContribution;
         const expectedReturn = 0.06; // 6% annual return
         
         let corpus = 0;
         for (let year = 1; year <= yearsOfService; year++) {
           corpus += totalMonthlyContribution * 12 * Math.pow(1 + expectedReturn, year);
         }
         
         const monthlyPension = corpus * 0.04 / 12; // 4% withdrawal rate
         
         return {
           type: 'uk_workplace_dc',
           monthlyPension: Math.round(monthlyPension),
           annualPension: Math.round(monthlyPension * 12),
           corpus: Math.round(corpus),
           calculation: `Workplace DC: £${Math.round(corpus).toLocaleString()} corpus → £${Math.round(monthlyPension).toLocaleString()}/month`
         };
       }
     }
    
    // Default calculation for other schemes
    return {
      type: 'default',
      monthlyPension: Math.round(monthlySalaryForCalc * 0.4), // 40% of current salary
      annualPension: Math.round(monthlySalaryForCalc * 0.4 * 12),
      calculation: `Estimated pension: 40% of current salary = ₹${Math.round(monthlySalaryForCalc * 0.4).toLocaleString()}/month`
    };
    
  } catch (error) {
    console.error('Error calculating pension for scheme:', scheme.scheme_id, error);
    return {
      type: 'error',
      monthlyPension: 0,
      annualPension: 0,
      calculation: 'Unable to calculate pension for this scheme'
    };
  }
};

/**
 * Calculate pension for multiple schemes
 */
export const calculatePensionsForSchemes = (schemes, userProfile) => {
  return schemes.map(scheme => {
    const pensionCalculation = calculatePension(scheme, userProfile);
    return {
      ...scheme,
      pensionCalculation
    };
  });
};

/**
 * Get pension insights and recommendations
 */
export const getPensionInsights = (schemesWithCalculations, userProfile) => {
  const { age, annualSalary } = userProfile;
  
  const insights = {
    totalMonthlyPension: 0,
    totalAnnualPension: 0,
    recommendedSchemes: [],
    warnings: [],
    tips: []
  };
  
  // Calculate total pension from all schemes
  schemesWithCalculations.forEach(scheme => {
    if (scheme.pensionCalculation && scheme.pensionCalculation.monthlyPension > 0) {
      insights.totalMonthlyPension += scheme.pensionCalculation.monthlyPension;
      insights.totalAnnualPension += scheme.pensionCalculation.annualPension;
    }
  });
  
  // Add recommendations based on age and salary
  if (age < 30) {
    insights.tips.push('Start early! Consider NPS for long-term wealth creation');
    insights.recommendedSchemes.push('NPS_Tier_I');
  }
  
  if (age >= 18 && age <= 40) {
    insights.tips.push('APY and PM-SYM are excellent for unorganized sector workers');
    insights.recommendedSchemes.push('APY', 'PM_SYM');
  }
  
  if (annualSalary <= 300000) {
    insights.tips.push('Consider government schemes like PMKMY and PM-LVM for low-income groups');
    insights.recommendedSchemes.push('PMKMY', 'PM_LVM');
  }
  
  if (age >= 60) {
    insights.tips.push('Focus on immediate pension schemes like SCSS and PMVVY');
    insights.recommendedSchemes.push('SCSS', 'PMVVY');
  }
  
  // Add warnings
  const replacementRatio = insights.totalAnnualPension / annualSalary;
  if (replacementRatio < 0.3) {
    insights.warnings.push('Your pension replacement ratio is low. Consider additional savings.');
  }
  
  if (insights.totalMonthlyPension < 5000) {
    insights.warnings.push('Total monthly pension is below ₹5,000. Consider multiple schemes.');
  }
  
  return insights;
};
