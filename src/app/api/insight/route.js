export async function POST(req) {
  try {
    // Check if API key is set
    if (!process.env.GOOGLE_API_KEY) {
      console.error('GOOGLE_API_KEY is not set');
      return new Response(JSON.stringify({ 
        error: 'Google API key is not configured. Please check your environment variables.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data, query } = await req.json();
    
    // Create a prompt for explaining pension data
    const systemPrompt = `You are a financial advisor specializing in pension planning. Your task is to explain pension-related data and concepts in simple, easy-to-understand terms.
    
    Focus on:
    - Making complex financial concepts accessible
    - Providing actionable insights
    - Explaining the implications of the data
    - Suggesting next steps or considerations
    
    Always be clear, helpful, and encourage users to seek professional advice when needed.`;
    
    const prompt = `${systemPrompt}
    
    User Query: ${query}
    
    Data to analyze: ${JSON.stringify(data, null, 2)}
    
    Please provide a clear, simple explanation of this pension data and any insights that would be helpful for the user.`;
    
    // Use the direct Google Generative AI REST API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google API error:', response.status, errorData);
      throw new Error(`Google API error: ${response.status} - ${errorData}`);
    }

    const result = await response.json();
    
    // Extract the text from the response
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      const insight = result.candidates[0].content.parts[0].text;
      
      return new Response(JSON.stringify({ insight }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('Invalid response format from Google API');
    }
    
  } catch (error) {
    console.error('Insight API error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to generate insight';
    if (error.message.includes('API key')) {
      errorMessage = 'Invalid or missing Google API key';
    } else if (error.message.includes('quota')) {
      errorMessage = 'API quota exceeded. Please check your Google AI Studio account.';
    } else if (error.message.includes('model')) {
      errorMessage = 'Model not available. Please check your API access.';
    } else if (error.message.includes('Google API error')) {
      errorMessage = 'Error communicating with Google AI service. Please try again.';
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
