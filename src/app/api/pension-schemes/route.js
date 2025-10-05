import { NextResponse } from 'next/server';
import pensionSchemesData from '../../../../PensionDB.json';
import { calculatePensionsForSchemes, getPensionInsights } from '@/lib/pensionCalculator';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const age = parseInt(searchParams.get('age'));
    const origin = searchParams.get('origin');
    const annualSalary = parseInt(searchParams.get('annualSalary'));

    // Validate required parameters
    if (!age || !origin || !annualSalary) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required parameters: age, origin, and annualSalary are required',
          requiredParams: ['age', 'origin', 'annualSalary']
        },
        { status: 400 }
      );
    }

    // Validate age
    if (age < 0 || age > 120) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid age: Age must be between 0 and 120'
        },
        { status: 400 }
      );
    }

         // Validate origin (country)
     const validCountries = ['India', 'Japan', 'USA', 'UK'];
     if (!validCountries.includes(origin)) {
       return NextResponse.json(
         {
           success: false,
           message: `Invalid origin: Only ${validCountries.join(', ')} are currently supported`,
           validCountries
         },
         { status: 400 }
       );
     }

    // Validate annual salary
    if (annualSalary < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid annual salary: Salary must be positive'
        },
        { status: 400 }
      );
    }

         // Filter schemes based on eligibility criteria
     const eligibleSchemes = pensionSchemesData.filter(scheme => {
       // First filter by country
       if (scheme.country !== origin) {
         return false;
       }
       
       // Check age eligibility
       const minAge = scheme.eligibility_age_min;
       const maxAge = scheme.eligibility_age_max;
       
       let ageEligible = true;
       if (minAge !== undefined && minAge !== null && minAge !== '' && minAge !== 'NA') {
         ageEligible = age >= minAge;
       }
       if (maxAge !== undefined && maxAge !== null && maxAge !== '' && maxAge !== 'NA') {
         ageEligible = ageEligible && age <= maxAge;
       }

      // Check income criteria for schemes that have income limits
      let incomeEligible = true;
      const incomeCriteria = scheme.income_criteria?.toLowerCase() || '';
      
      if (incomeCriteria.includes('bpl') || incomeCriteria.includes('below poverty line')) {
        // For BPL schemes, assume salary should be low (you can adjust this threshold)
        incomeEligible = annualSalary <= 300000; // 3 lakhs per annum as BPL threshold
      }
      
      if (incomeCriteria.includes('income cap') || incomeCriteria.includes('threshold')) {
        // For schemes with income caps, check if salary is within limits
        // This is a simplified check - you might want to add more specific logic
        incomeEligible = annualSalary <= 500000; // 5 lakhs per annum as general threshold
      }

             // Check for specific scheme eligibility based on country
       let schemeSpecificEligible = true;
       
       // India-specific schemes
       if (origin === 'India') {
         // NPS Tier I - available for all
         if (scheme.scheme_id === 'CEN_NPS_T1') {
           schemeSpecificEligible = age >= 18 && age <= 70;
         }
         
         // APY - for unorganized sector, age 18-40
         if (scheme.scheme_id === 'CEN_APY') {
           schemeSpecificEligible = age >= 18 && age <= 40;
         }
         
         // PM-SYM - for unorganized workers, age 18-40
         if (scheme.scheme_id === 'CEN_PM_SYM') {
           schemeSpecificEligible = age >= 18 && age <= 40;
         }
         
         // PMKMY - for farmers, age 18-40
         if (scheme.scheme_id === 'CEN_PMKMY') {
           schemeSpecificEligible = age >= 18 && age <= 40;
         }
         
         // PM-LVM - for traders, age 18-40
         if (scheme.scheme_id === 'CEN_PM_LVM') {
           schemeSpecificEligible = age >= 18 && age <= 40;
         }
         
         // IGNOAPS - for senior citizens 60+
         if (scheme.scheme_id === 'CEN_NSAP_IGNOAPS') {
           schemeSpecificEligible = age >= 60;
         }
         
         // SCSS - for senior citizens 60+
         if (scheme.scheme_id === 'CEN_SCSS') {
           schemeSpecificEligible = age >= 60;
         }
         
         // PMVVY - for senior citizens 60+
         if (scheme.scheme_id === 'CEN_PMVVY') {
           schemeSpecificEligible = age >= 60;
         }
       }
       
       // Japan-specific schemes
       if (origin === 'Japan') {
         // National Pension - age 20-59
         if (scheme.scheme_id === 'JPN_NAT_NP_BASIC') {
           schemeSpecificEligible = age >= 20 && age <= 59;
         }
         
         // iDeCo - age 20-64
         if (scheme.scheme_id === 'JPN_IND_IDECO') {
           schemeSpecificEligible = age >= 20 && age <= 64;
         }
       }
       
       // USA-specific schemes
       if (origin === 'USA') {
         // Social Security Retirement - age 62-70
         if (scheme.scheme_id === 'USA_FED_SS_RETIRE') {
           schemeSpecificEligible = age >= 62 && age <= 70;
         }
         
         // 401(k) - generally available for working age
         if (scheme.scheme_id === 'USA_EMP_401K') {
           schemeSpecificEligible = age >= 18 && age <= 70;
         }
       }
       
       // UK-specific schemes
       if (origin === 'UK') {
         // New State Pension - age 66+
         if (scheme.scheme_id === 'UK_STATE_NEW') {
           schemeSpecificEligible = age >= 66;
         }
         
         // Basic State Pension - age 65+
         if (scheme.scheme_id === 'UK_STATE_BASIC') {
           schemeSpecificEligible = age >= 65;
         }
       }

      return ageEligible && incomeEligible && schemeSpecificEligible;
    });

    // Add relevance score and recommendations
    const schemesWithRecommendations = eligibleSchemes.map(scheme => {
      let relevanceScore = 0;
      let recommendation = '';

             // Score based on age appropriateness and country
       if (origin === 'India') {
         if (age >= 18 && age <= 40) {
           if (['CEN_APY', 'CEN_PM_SYM', 'CEN_PMKMY', 'CEN_PM_LVM', 'CEN_NPS_T1'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Excellent for long-term retirement planning';
           }
         } else if (age >= 41 && age <= 59) {
           if (['CEN_NPS_T1', 'CEN_EPF', 'CEN_EPS'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Good for mid-career retirement planning';
           }
         } else if (age >= 60) {
           if (['CEN_NSAP_IGNOAPS', 'CEN_SCSS', 'CEN_PMVVY'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Suitable for immediate pension benefits';
           }
         }

         // Score based on salary level for India
         if (annualSalary <= 300000) {
           if (['CEN_APY', 'CEN_PM_SYM', 'CEN_PMKMY', 'CEN_PM_LVM', 'CEN_NSAP_IGNOAPS'].includes(scheme.scheme_id)) {
             relevanceScore += 2;
           }
         } else if (annualSalary <= 1000000) {
           if (['CEN_NPS_T1', 'CEN_EPF', 'CEN_EPS'].includes(scheme.scheme_id)) {
             relevanceScore += 2;
           }
         } else {
           if (['CEN_NPS_T1', 'CEN_SCSS', 'CEN_PMVVY'].includes(scheme.scheme_id)) {
             relevanceScore += 2;
           }
         }
       } else if (origin === 'Japan') {
         if (age >= 20 && age <= 40) {
           if (['JPN_NAT_NP_BASIC', 'JPN_IND_IDECO'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Excellent for long-term retirement planning';
           }
         } else if (age >= 41 && age <= 59) {
           if (['JPN_EMP_EPI', 'JPN_IND_IDECO'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Good for mid-career retirement planning';
           }
         } else if (age >= 60) {
           if (['JPN_NAT_NP_BASIC', 'JPN_EMP_EPI'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Suitable for immediate pension benefits';
           }
         }
       } else if (origin === 'USA') {
         if (age >= 18 && age <= 40) {
           if (['USA_EMP_401K', 'USA_EMP_403B'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Excellent for long-term retirement planning';
           }
         } else if (age >= 41 && age <= 59) {
           if (['USA_EMP_401K', 'USA_EMP_403B', 'USA_EMP_PENSION'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Good for mid-career retirement planning';
           }
         } else if (age >= 62) {
           if (['USA_FED_SS_RETIRE'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Suitable for immediate pension benefits';
           }
         }
       } else if (origin === 'UK') {
         if (age >= 18 && age <= 40) {
           if (['UK_EMP_DC', 'UK_EMP_DB'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Excellent for long-term retirement planning';
           }
         } else if (age >= 41 && age <= 59) {
           if (['UK_EMP_DC', 'UK_EMP_DB'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Good for mid-career retirement planning';
           }
         } else if (age >= 66) {
           if (['UK_STATE_NEW'].includes(scheme.scheme_id)) {
             relevanceScore += 3;
             recommendation = 'Suitable for immediate pension benefits';
           }
         }
       }

      // Score based on sector
      if (scheme.sector === 'All') {
        relevanceScore += 1;
      }

      return {
        ...scheme,
        relevanceScore,
        recommendation: recommendation || 'Consider based on your specific needs',
        eligibility: {
          ageEligible: true,
          incomeEligible: true,
          sectorEligible: true
        }
      };
    });

         // Sort by relevance score (highest first)
     schemesWithRecommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
 
     // Calculate pension amounts for each scheme
     const schemesWithPensions = calculatePensionsForSchemes(schemesWithRecommendations, {
       age,
       annualSalary,
       monthlySalary: Math.round(annualSalary / 12)
     });
 
     // Get pension insights and recommendations
     const insights = getPensionInsights(schemesWithPensions, {
       age,
       annualSalary
     });
 
     return NextResponse.json({
       success: true,
       message: 'Pension schemes retrieved successfully',
       userProfile: {
         age,
         origin,
         annualSalary,
         monthlySalary: Math.round(annualSalary / 12)
       },
       totalSchemes: schemesWithPensions.length,
       schemes: schemesWithPensions,
       pensionInsights: insights,
       timestamp: new Date().toISOString()
     });

  } catch (error) {
    console.error('Error fetching pension schemes:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch pension schemes',
        error: error.message
      },
      { status: 500 }
    );
  }
}
