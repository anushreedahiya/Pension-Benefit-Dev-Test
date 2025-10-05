export async function POST(request) {
  try {
    const { scenarioData, locale = 'en-IN', currencyCode = 'INR', countryLabel = 'India', currencySymbol = '₹' } = await request.json();

    const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency: currencyCode, maximumFractionDigits: 0 });

    const formatted = {
      monthlyContribution: fmt.format(scenarioData.inputs.monthlyContribution || 0),
      futureValue: fmt.format(scenarioData.futureValue || 0),
      realValue: fmt.format(scenarioData.realValue || 0),
      totalContribution: fmt.format(scenarioData.totalContribution || 0),
      interestEarned: fmt.format(scenarioData.interestEarned || 0),
      inflationLoss: fmt.format(scenarioData.inflationLoss || 0)
    };
    
    const prompt = `
      You're explaining results for a pension scenario in ${countryLabel}. Use ${currencySymbol} and the country's context where appropriate.

      Explain these pension scenario results in simple language for a non-finance user.
      
      Inputs:
      - Current Age: ${scenarioData.inputs.currentAge}
      - Retirement Age: ${scenarioData.inputs.retirementAge}
      - Monthly Contribution: ${formatted.monthlyContribution}
      - Expected Return Rate: ${scenarioData.inputs.returnRate}%
      - Inflation Rate: ${scenarioData.inputs.inflationRate}%
      
      Results:
      - Future Value: ${formatted.futureValue}
      - Real Value (inflation-adjusted): ${formatted.realValue}
      - Total Contribution: ${formatted.totalContribution}
      - Interest Earned: ${formatted.interestEarned}
      - Inflation Loss: ${formatted.inflationLoss}
      
      Please explain in well-structured sections:
      1. **What the numbers mean** (use bullet points)
      2. **How inflation affects purchasing power** (one short analogy)
      3. **One practical improvement tip**
      4. **Is this on track?** (briefly, with caveat it depends on lifestyle/goals)

      Keep it conversational, concise, and formatted with clear bullets.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const explanation = data.candidates[0].content.parts?.[0]?.text || '';
      return Response.json({ explanation });
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

  } catch (error) {
    console.error('AI explanation error:', error);
    return Response.json(
      { error: 'Unable to generate AI explanation at this time.' },
      { status: 500 }
    );
  }
}
