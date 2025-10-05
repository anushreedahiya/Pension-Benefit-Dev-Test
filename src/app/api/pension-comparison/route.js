import { NextResponse } from 'next/server';
import pensionSchemesData from '../../../../PensionDB.json';
import { calculatePensionsForSchemes, getPensionInsights } from '@/lib/pensionCalculator';

export async function POST(request) {
  try {
    const formData = await request.json();
    
    // Extract key information from form data
    const {
      fullName,
      dob,
      gender,
      maritalStatus,
      dependents,
      state,
      residenceYears,
      citizenship,
      country,
      employmentStatus,
      sector,
      govtJoinBefore2004,
      landHectares,
      monthlyIncome,
      taxPayer,
      bplStatus,
      aadhaar,
      bankAccount,
      disability,
      disabilityPercent,
      widow,
      destitute,
      casteCategory,
      traditionalWorker,
      payoutType,
      investmentPreference,
      monthlyContributionWilling,
      affordableContribution,
      familyPension,
      landDocs,
      disabilityCert,
      residenceProof,
      currentPensionScheme, // User's current scheme
      currentMonthlyPension, // Current pension amount
      currentContribution // Current contribution if any
    } = formData;

    // Calculate age from date of birth
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;

    // Determine country/origin
    const validCountries = ['India', 'Japan', 'USA', 'UK'];
    let origin = 'India';
    if (country && validCountries.includes(country)) {
      origin = country;
    } else if (citizenship === 'No') {
      origin = 'India';
    }

    // Calculate annual salary from monthly income
    const annualSalary = monthlyIncome * 12;

    // Validate required fields
    if (!fullName || !dob || !state || !citizenship) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: fullName, dob, state, and citizenship are required'
        },
        { status: 400 }
      );
    }

    // Validate age
    if (actualAge < 0 || actualAge > 120) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid age: Age must be between 0 and 120'
        },
        { status: 400 }
      );
    }

    // Validate origin (country)
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
        ageEligible = actualAge >= minAge;
      }
      if (maxAge !== undefined && maxAge !== null && maxAge !== '' && maxAge !== 'NA') {
        ageEligible = ageEligible && actualAge <= maxAge;
      }

      // Check income criteria for schemes that have income limits
      let incomeEligible = true;
      const incomeCriteria = scheme.income_criteria?.toLowerCase() || '';
      
      if (incomeCriteria.includes('bpl') || incomeCriteria.includes('below poverty line')) {
        incomeEligible = annualSalary <= 300000; // 3 lakhs per annum as BPL threshold
      }
      
      if (incomeCriteria.includes('income cap') || incomeCriteria.includes('threshold')) {
        incomeEligible = annualSalary <= 500000; // 5 lakhs per annum as general threshold
      }

      // Check for specific scheme eligibility based on country and user profile
      let schemeSpecificEligible = true;
      
      // India-specific schemes with enhanced eligibility
      if (origin === 'India') {
        // NPS Tier I - available for all
        if (scheme.scheme_id === 'CEN_NPS_T1') {
          schemeSpecificEligible = actualAge >= 18 && actualAge <= 70;
        }
        
        // APY - for unorganized sector, age 18-40
        if (scheme.scheme_id === 'CEN_APY') {
          schemeSpecificEligible = actualAge >= 18 && actualAge <= 40 && 
            (sector === 'Unorganised' || employmentStatus === 'Self-Employed' || employmentStatus === 'Unemployed');
        }
        
        // PM-SYM - for unorganized workers, age 18-40
        if (scheme.scheme_id === 'CEN_PM_SYM') {
          schemeSpecificEligible = actualAge >= 18 && actualAge <= 40 && 
            (sector === 'Unorganised' || employmentStatus === 'Self-Employed');
        }
        
        // PMKMY - for farmers, age 18-40
        if (scheme.scheme_id === 'CEN_PMKMY') {
          schemeSpecificEligible = actualAge >= 18 && actualAge <= 40 && 
            (sector === 'Agriculture' || landHectares > 0);
        }
        
        // PM-LVM - for traders, age 18-40
        if (scheme.scheme_id === 'CEN_PM_LVM') {
          schemeSpecificEligible = actualAge >= 18 && actualAge <= 40 && 
            sector === 'Trade/Shopkeeping';
        }
        
        // IGNOAPS - for senior citizens 60+
        if (scheme.scheme_id === 'CEN_NSAP_IGNOAPS') {
          schemeSpecificEligible = actualAge >= 60;
        }
        
        // SCSS - for senior citizens 60+
        if (scheme.scheme_id === 'CEN_SCSS') {
          schemeSpecificEligible = actualAge >= 60;
        }
        
        // PMVVY - for senior citizens 60+
        if (scheme.scheme_id === 'CEN_PMVVY') {
          schemeSpecificEligible = actualAge >= 60;
        }

        // Special schemes for specific categories
        if (scheme.scheme_id === 'CEN_NSAP_IGNOAPS') {
          // Widow pension
          if (widow === 'Yes') {
            schemeSpecificEligible = true;
          }
        }

        if (disability === 'Yes' && disabilityPercent >= 40) {
          // Disability pension schemes
          if (scheme.scheme_id.includes('DISABILITY') || scheme.scheme_id.includes('DISABLED')) {
            schemeSpecificEligible = true;
          }
        }

        if (casteCategory === 'SC' || casteCategory === 'ST') {
          // SC/ST specific schemes
          if (scheme.scheme_id.includes('SC') || scheme.scheme_id.includes('ST')) {
            schemeSpecificEligible = true;
          }
        }
      }

      return ageEligible && incomeEligible && schemeSpecificEligible;
    });

    // Add relevance score and recommendations
    const schemesWithRecommendations = eligibleSchemes.map(scheme => {
      let relevanceScore = 0;
      let recommendation = '';
      let advantages = [];
      let disadvantages = [];

      // Score based on age appropriateness and country
      if (origin === 'India') {
        if (actualAge >= 18 && actualAge <= 40) {
          if (['CEN_APY', 'CEN_PM_SYM', 'CEN_PMKMY', 'CEN_PM_LVM', 'CEN_NPS_T1'].includes(scheme.scheme_id)) {
            relevanceScore += 3;
            recommendation = 'Excellent for long-term retirement planning';
            advantages.push('Long-term growth potential', 'Government backing', 'Tax benefits');
          }
        } else if (actualAge >= 41 && actualAge <= 59) {
          if (['CEN_NPS_T1', 'CEN_EPF', 'CEN_EPS'].includes(scheme.scheme_id)) {
            relevanceScore += 3;
            recommendation = 'Good for mid-career retirement planning';
            advantages.push('Stable returns', 'Employer contribution', 'Immediate benefits');
          }
        } else if (actualAge >= 60) {
          if (['CEN_NSAP_IGNOAPS', 'CEN_SCSS', 'CEN_PMVVY'].includes(scheme.scheme_id)) {
            relevanceScore += 3;
            recommendation = 'Suitable for immediate pension benefits';
            advantages.push('Immediate pension', 'No contribution required', 'Regular income');
          }
        }

        // Score based on income level
        if (annualSalary <= 300000) {
          if (['CEN_APY', 'CEN_PM_SYM', 'CEN_PMKMY', 'CEN_PM_LVM', 'CEN_NSAP_IGNOAPS'].includes(scheme.scheme_id)) {
            relevanceScore += 2;
            advantages.push('Low contribution requirement', 'Government subsidy');
          }
        } else if (annualSalary <= 1000000) {
          if (['CEN_NPS_T1', 'CEN_EPF', 'CEN_EPS'].includes(scheme.scheme_id)) {
            relevanceScore += 2;
            advantages.push('Higher returns potential', 'Flexible contribution');
          }
        } else {
          if (['CEN_NPS_T1', 'CEN_SCSS', 'CEN_PMVVY'].includes(scheme.scheme_id)) {
            relevanceScore += 2;
            advantages.push('Tax-efficient', 'High returns potential');
          }
        }

        // Score based on employment sector
        if (sector === 'Unorganised' && ['CEN_APY', 'CEN_PM_SYM'].includes(scheme.scheme_id)) {
          relevanceScore += 2;
          advantages.push('Specifically designed for unorganized sector');
        }

        if (sector === 'Agriculture' && scheme.scheme_id === 'CEN_PMKMY') {
          relevanceScore += 3;
          advantages.push('Farmer-specific benefits', 'Land-based eligibility');
        }

        if (sector === 'Trade/Shopkeeping' && scheme.scheme_id === 'CEN_PM_LVM') {
          relevanceScore += 3;
          advantages.push('Trader-specific benefits', 'Business-friendly terms');
        }

        // Score based on special categories
        if (widow === 'Yes' && scheme.scheme_id === 'CEN_NSAP_IGNOAPS') {
          relevanceScore += 2;
          advantages.push('Widow-specific benefits', 'Higher pension amount');
        }

        if (disability === 'Yes' && disabilityPercent >= 40) {
          relevanceScore += 2;
          advantages.push('Disability benefits', 'Additional support');
        }

        if (casteCategory === 'SC' || casteCategory === 'ST') {
          relevanceScore += 1;
          advantages.push('Reserved category benefits');
        }

        // Score based on preferences
        if (payoutType === 'Monthly Pension' && scheme.payout_type?.toLowerCase().includes('monthly')) {
          relevanceScore += 1;
        }

        if (investmentPreference === 'Government-guaranteed pension' && scheme.guarantee_type?.toLowerCase().includes('government')) {
          relevanceScore += 2;
        }

        if (monthlyContributionWilling === 'Yes' && scheme.contribution_type?.toLowerCase().includes('monthly')) {
          relevanceScore += 1;
        }

        if (familyPension === 'Yes' && scheme.family_pension === 'Yes') {
          relevanceScore += 2;
          advantages.push('Family pension coverage');
        }
      }

      // Score based on sector
      if (scheme.sector === 'All') {
        relevanceScore += 1;
      }

      // Add disadvantages
      if (scheme.contribution_required === 'Yes' && monthlyContributionWilling === 'No') {
        disadvantages.push('Requires monthly contribution');
      }

      if (scheme.minimum_age && actualAge < scheme.minimum_age) {
        disadvantages.push(`Minimum age requirement: ${scheme.minimum_age} years`);
      }

      if (scheme.maximum_age && actualAge > scheme.maximum_age) {
        disadvantages.push(`Maximum age limit: ${scheme.maximum_age} years`);
      }

      return {
        ...scheme,
        relevanceScore,
        recommendation: recommendation || 'Consider based on your specific needs',
        advantages,
        disadvantages,
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
      age: actualAge,
      annualSalary,
      monthlySalary: monthlyIncome
    });

    // Get pension insights and recommendations
    const insights = getPensionInsights(schemesWithPensions, {
      age: actualAge,
      annualSalary
    });

    // Compare with current pension scheme if provided
    let currentSchemeComparison = null;
    if (currentPensionScheme && currentMonthlyPension) {
      const currentScheme = schemesWithPensions.find(scheme => 
        scheme.scheme_id === currentPensionScheme || 
        scheme.scheme_name?.toLowerCase().includes(currentPensionScheme.toLowerCase())
      );

      if (currentScheme) {
        const currentPensionAmount = parseFloat(currentMonthlyPension);
        const recommendedPensionAmount = currentScheme.pensionCalculation?.monthlyPension || 0;
        
        currentSchemeComparison = {
          currentScheme: currentScheme.scheme_name,
          currentMonthlyPension: currentPensionAmount,
          recommendedMonthlyPension: recommendedPensionAmount,
          difference: recommendedPensionAmount - currentPensionAmount,
          percentageImprovement: currentPensionAmount > 0 ? 
            ((recommendedPensionAmount - currentPensionAmount) / currentPensionAmount) * 100 : 0,
          isBetter: recommendedPensionAmount > currentPensionAmount,
          recommendation: recommendedPensionAmount > currentPensionAmount ? 
            'Consider switching to this scheme for better benefits' : 
            'Your current scheme appears to be optimal'
        };
      }
    }

    // Find top 3 recommendations
    const topRecommendations = schemesWithPensions.slice(0, 3).map((scheme, index) => ({
      rank: index + 1,
      scheme: scheme.scheme_name,
      schemeId: scheme.scheme_id,
      monthlyPension: scheme.pensionCalculation?.monthlyPension || 0,
      annualPension: scheme.pensionCalculation?.annualPension || 0,
      calculation: scheme.pensionCalculation?.calculation || '',
      relevanceScore: scheme.relevanceScore,
      recommendation: scheme.recommendation,
      advantages: scheme.advantages,
      disadvantages: scheme.disadvantages,
      eligibility: scheme.eligibility
    }));

    // Optional AI analysis via Gemini
    let aiAnalysis = '';
    try {
      const currencyMeta = {
        India: { symbol: '₹', locale: 'en-IN', currency: 'INR' },
        USA: { symbol: '$', locale: 'en-US', currency: 'USD' },
        UK: { symbol: '£', locale: 'en-GB', currency: 'GBP' },
        Japan: { symbol: '¥', locale: 'ja-JP', currency: 'JPY' }
      };
      const meta = currencyMeta[origin] || currencyMeta['India'];
      const fmt = new Intl.NumberFormat(meta.locale, { style: 'currency', currency: meta.currency, maximumFractionDigits: 0 });

      const summaryLines = topRecommendations.map((rec) => {
        return `- ${rec.scheme}: Monthly Pension ~ ${fmt.format(rec.monthlyPension)}\n  Advantages: ${(rec.advantages || []).slice(0,3).join('; ') || '—'}\n  Considerations: ${(rec.disadvantages || []).slice(0,3).join('; ') || '—'}`;
      }).join('\n');

      const prompt = `You are a pension advisor for ${origin}. Compare and analyze these top pension schemes for the user. Provide:
1) A short overview in 2-3 lines
2) A bullet list per scheme with Monthly Pension, key benefits, and drawbacks
3) One clear recommendation tailored to the profile (age ${actualAge}, income ${fmt.format(monthlyIncome)})

Schemes:\n${summaryLines}\n\nFormat with clear headings, bold where helpful, and concise bullets.`;

      if (process.env.GOOGLE_API_KEY) {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          aiAnalysis = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      }
    } catch (e) {
      // Ignore AI errors silently in response
    }

    const response = {
      success: true,
      message: 'Pension comparison analysis completed successfully',
      userProfile: {
        name: fullName,
        age: actualAge,
        gender,
        maritalStatus,
        dependents,
        state,
        origin,
        employmentStatus,
        sector,
        monthlyIncome,
        annualSalary,
        bplStatus,
        specialCategories: {
          disability: disability === 'Yes',
          disabilityPercent,
          widow: widow === 'Yes',
          destitute: destitute === 'Yes',
          casteCategory,
          traditionalWorker: traditionalWorker === 'Yes'
        },
        preferences: {
          payoutType,
          investmentPreference,
          monthlyContributionWilling,
          affordableContribution,
          familyPension: familyPension === 'Yes'
        }
      },
      analysis: {
        totalEligibleSchemes: schemesWithPensions.length,
        topRecommendations,
        currentSchemeComparison,
        insights,
        aiAnalysis
      },
      allEligibleSchemes: schemesWithPensions,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Pension comparison error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to analyze pension comparison',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      },
      { status: 500 }
    );
  }
}
