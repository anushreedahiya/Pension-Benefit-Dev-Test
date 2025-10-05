import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Handle both old format (messages array) and new format (message + history)
    let message, history = [];
    
    if (body.messages && Array.isArray(body.messages) && body.messages.length > 0) {
      // Old format from Chatbot.js
      const lastMessage = body.messages[body.messages.length - 1];
      message = lastMessage.content || lastMessage.text || '';
      history = body.messages.slice(0, -1); // All messages except the last one
    } else if (body.message) {
      // New format from VoiceAssistant.js
      message = body.message;
      history = body.history || [];
    } else {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build context from conversation history
    let contextPrompt = '';
    if (history.length > 0) {
      contextPrompt = 'Previous conversation context:\n';
      history.forEach((msg, index) => {
        const content = msg.content || msg.text || '';
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        contextPrompt += `${role}: ${content}\n`;
      });
      contextPrompt += '\nCurrent question: ';
    }

    // Create the full prompt for Gemini
    const fullPrompt = `${contextPrompt}${message}

You are a helpful pension and retirement planning assistant. Provide clear, accurate, and helpful responses about pension schemes, retirement planning, financial calculations, and related topics. Keep responses conversational but informative. If the user asks about specific pension schemes, provide relevant details about eligibility, benefits, and considerations.`;

    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY environment variable is not set');
    }

    // Call Gemini API
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
                {
                  text: fullPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const reply = data.candidates[0].content.parts[0].text;

    // Return different formats based on request type
    if (body.messages && Array.isArray(body.messages)) {
      // Old format from Chatbot.js - return plain text
      return new Response(reply, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache',
        },
      });
    } else {
      // New format from VoiceAssistant.js - return JSON
      return NextResponse.json({ reply });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response. Please try again.' },
      { status: 500 }
    );
  }
}
