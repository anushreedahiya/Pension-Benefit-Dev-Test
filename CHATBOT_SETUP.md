# Pension AI Chatbot Setup Guide

## Overview
This chatbot provides AI-powered assistance for pension planning and retirement advice using Google's Gemini AI model via direct REST API calls.

## Features
- **Predefined Questions**: Quick access to common pension-related queries
- **Real-time Chat**: Interactive conversation with AI assistant
- **Pension Expertise**: Specialized knowledge in retirement planning
- **Simple API Integration**: Direct calls to Google Generative AI REST API

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

**Note**: The chatbot now uses direct REST API calls to Google's Generative AI service, eliminating the need for additional packages.

### 2. Environment Configuration
Create a `.env.local` file in your project root and add your Google API key:

```env
GOOGLE_API_KEY=your_actual_google_api_key_here
```

**To get your Google API key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key and paste it in your `.env.local` file

### 3. API Routes
The chatbot uses two API routes:
- `/api/chat` - Main chat functionality with direct Gemini API calls
- `/api/insight` - Pension data analysis and insights

### 4. Components
- `Chatbot.js` - Main chatbot component with predefined options
- `page.js` - Chatbot page route

### 5. Navigation
The chatbot is accessible via the "AI Assistant" link in the main navigation.

## Usage

### For Users
1. Navigate to `/chatbot` or click "AI Assistant" in the navigation
2. Select a predefined question from the left sidebar, or
3. Type your own question in the input field
4. Receive AI-powered responses about pension planning

### Predefined Questions Include:
- Pension types and definitions
- Retirement planning advice
- Tax benefits information
- Pension management tips
- Investment guidance

## Technical Details

### AI Model
- **Model**: `gemini-1.5-flash`
- **Provider**: Google Generative AI REST API
- **Integration**: Direct HTTP calls for reliability

### Features
- Message history management
- Responsive design with Tailwind CSS
- Loading states and animations
- Mobile-friendly interface
- Error handling and fallbacks
- Simple API integration without external packages

## Implementation Details

### Chatbot Component
- Uses React hooks (`useState`) for state management
- Simple fetch API calls to backend
- Real-time message updates
- Error handling for failed API calls

### API Routes
- `/api/chat`: Makes direct calls to Google's Generative AI REST API
- `/api/insight`: Provides pension data analysis
- Both routes use the same API format you tested in Postman

### API Format
The chatbot uses the exact same request format you tested:
```json
{
  "contents": [
    {
      "parts": [
        { "text": "Your question here" }
      ]
    }
  ]
}
```

## Security Notes
- API keys are stored in environment variables
- User messages are sent to Google's servers for processing
- No sensitive data is stored locally
- Always encourage users to consult financial advisors for personalized advice

## Troubleshooting

### Common Issues:
1. **API Key Error**: Ensure your `.env.local` file has the correct `GOOGLE_API_KEY`
2. **API Errors**: Check network connectivity and API quota limits
3. **Component Errors**: Verify all dependencies are installed correctly

### Development Tips:
- Use the browser's developer tools to monitor API calls
- Check the console for error messages
- Test with simple questions first
- Ensure your Google API key has access to Gemini models
- The API format matches exactly what you tested in Postman

## Future Enhancements
- User authentication integration
- Chat history persistence
- File upload for pension documents
- Multi-language support
- Voice input/output capabilities
- Integration with pension calculation tools
