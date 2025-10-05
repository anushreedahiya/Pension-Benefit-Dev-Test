'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedNavbar from './AuthenticatedNavbar';
import UnauthenticatedNavbar from './UnauthenticatedNavbar';

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Predefined pension-related questions
  const predefinedOptions = [
    {
      id: 1,
      question: "What is a defined benefit pension?",
      category: "Pension Types",
      icon: "🏦"
    },
    {
      id: 2,
      question: "How much should I save for retirement?",
      category: "Retirement Planning",
      icon: "💰"
    },
    {
      id: 3,
      question: "What are the tax benefits of pension contributions?",
      category: "Tax & Benefits",
      icon: "📊"
    },
    {
      id: 4,
      question: "Should I consolidate my pensions?",
      category: "Pension Management",
      icon: "🔗"
    },
    {
      id: 5,
      question: "What is the difference between workplace and personal pensions?",
      category: "Pension Types",
      icon: "🏢"
    },
    {
      id: 6,
      question: "How do I calculate my retirement income?",
      category: "Calculations",
      icon: "🧮"
    },
    {
      id: 7,
      question: "What happens to my pension if I change jobs?",
      category: "Employment Changes",
      icon: "🔄"
    },
    {
      id: 8,
      question: "How do I choose the right pension fund?",
      category: "Investment",
      icon: "📈"
    }
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setInput(option.question);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedOption(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Get the AI response as text
      const aiResponse = await response.text();
      
      // Create and add the assistant message
      const assistantMessage = { 
        role: 'assistant', 
        content: aiResponse, 
        id: Date.now() + 1 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      
      // Try to parse error response for more details
      let errorMessage = 'Sorry, I encountered an error. Please try again or check your API key configuration.';
      
      try {
        if (error.message.includes('Failed to get response')) {
          errorMessage = 'The AI service is currently unavailable. Please check your API key configuration or try again later.';
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      const errorMsg = { 
        role: 'assistant', 
        content: errorMessage, 
        id: Date.now() + 1 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to format AI response with proper spacing and structure
  const formatAIResponse = (content) => {
    // Split content by common markdown-like patterns and add proper spacing
    let formatted = content
      // Add spacing around headers (lines starting with **)
      .replace(/(\*\*[^*]+\*\*)/g, '\n\n$1\n\n')
      // Add spacing around bullet points
      .replace(/(\* [^*]+)/g, '\n$1')
      // Add spacing around numbered lists
      .replace(/(\d+\. [^\n]+)/g, '\n$1')
      // Add spacing around colons (for definitions)
      .replace(/([^:]+:)/g, '\n$1')
      // Add spacing around paragraphs (double line breaks)
      .replace(/\n\n+/g, '\n\n')
      // Clean up excessive spacing
      .replace(/\n{3,}/g, '\n\n')
      // Ensure proper spacing after periods for better readability
      .replace(/([.!?])\s*([A-Z])/g, '$1\n\n$2')
      .trim();

    return formatted;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      {user ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-full mb-4 sm:mb-6">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Pension AI Assistant</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Get expert advice on pension planning, retirement strategies, and financial guidance powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Predefined Options Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <span className="mr-2">💡</span>
                Quick Questions
              </h2>
              <div className="space-y-3">
                {predefinedOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 hover:shadow-md text-sm sm:text-base ${
                      selectedOption?.id === option.id
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl sm:text-2xl">{option.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm sm:text-base font-medium text-gray-900 leading-snug">{option.question}</div>
                        <div className="text-[11px] sm:text-xs text-gray-500 mt-1 bg-gray-100 px-2 py-1 rounded-full inline-block">{option.category}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-[700px] flex flex-col overflow-hidden">
              {/* Chat Header - Fixed */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Pension Expert</h3>
                    <p className="text-green-100 text-sm">Ready to help with your pension questions</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Pension AI Assistant!</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Select a question from the left sidebar or type your own to get started with expert pension advice.
                    </p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <div className="text-sm leading-relaxed whitespace-pre-line prose prose-sm max-w-none">
                          <div className="space-y-2">
                            {formatAIResponse(message.content).split('\n').map((line, index) => {
                              if (line.trim() === '') return null;
                              if (line.startsWith('**') && line.endsWith('**')) {
                                return <h4 key={index} className="font-bold text-gray-900 text-base">{line.replace(/\*\*/g, '')}</h4>;
                              }
                              if (line.startsWith('* ') || line.startsWith('- ')) {
                                return <div key={index} className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-1">•</span>
                                  <span>{line.substring(2)}</span>
                                </div>;
                              }
                              if (line.match(/^\d+\./)) {
                                return <div key={index} className="flex items-start space-x-2">
                                  <span className="text-green-600 mt-1 font-medium">{line.match(/^\d+\./)[0]}</span>
                                  <span>{line.replace(/^\d+\.\s*/, '')}</span>
                                </div>;
                              }
                              return <p key={index} className="text-gray-700">{line}</p>;
                            })}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 px-4 py-3 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Form - Fixed */}
              <div className="border-t border-gray-200 p-6 bg-white flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about pensions, retirement planning, or financial advice..."
                    className="text-black flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-sm"
                  >
                    {isLoading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm font-medium text-amber-700">Important Notice</span>
            </div>
            <p className="text-sm text-gray-600">
              This AI assistant provides general information only. For personalized financial advice, 
              please consult with a qualified financial advisor. The information provided should not be 
              considered as financial advice or recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
