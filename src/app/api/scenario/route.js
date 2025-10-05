export async function POST(request) {
  try {
    const body = await request.json();
    const {
      currentAge = 30,
      retirementAge = 60,
      monthlyContribution = 10000,
      returnRate = 10,
      inflationRate = 6
    } = body;

    // Validate inputs
    if (retirementAge <= currentAge) {
      return Response.json(
        { error: 'Retirement age must be greater than current age' },
        { status: 400 }
      );
    }

    if (monthlyContribution <= 0 || returnRate <= 0 || inflationRate <= 0) {
      return Response.json(
        { error: 'All values must be positive' },
        { status: 400 }
      );
    }

    // Calculate years to retirement
    const yearsToRetirement = retirementAge - currentAge;
    
    // Monthly return rate (convert annual to monthly)
    const monthlyReturnRate = returnRate / 100 / 12;
    
    // Calculate future value using compound interest formula
    // FV = PMT * ((1 + r)^n - 1) / r
    // Where: PMT = monthly payment, r = monthly rate, n = total months
    const totalMonths = yearsToRetirement * 12;
    const futureValue = monthlyContribution * 
      (Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate;

    // Calculate real value (adjusted for inflation)
    // Real Value = Future Value / (1 + inflation rate)^years
    const realValue = futureValue / Math.pow(1 + inflationRate / 100, yearsToRetirement);

    // Calculate additional insights
    const totalContribution = monthlyContribution * totalMonths;
    const interestEarned = futureValue - totalContribution;
    const inflationLoss = futureValue - realValue;

    return Response.json({
      futureValue: Math.round(futureValue),
      realValue: Math.round(realValue),
      totalContribution: Math.round(totalContribution),
      interestEarned: Math.round(interestEarned),
      inflationLoss: Math.round(inflationLoss),
      inputs: {
        currentAge,
        retirementAge,
        monthlyContribution,
        returnRate,
        inflationRate,
        yearsToRetirement
      }
    });

  } catch (error) {
    console.error('Scenario calculation error:', error);
    return Response.json(
      { error: 'Failed to calculate scenario' },
      { status: 500 }
    );
  }
}
