'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function VoiceAssistant() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [handsFreeMode, setHandsFreeMode] = useState(false);
  const [error, setError] = useState('');
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  const sendToAI = useCallback(async (message) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: conversationHistory.slice(-3) // Send last 3 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAiResponse(data.reply);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, 
        { role: 'user', content: message },
        { role: 'assistant', content: data.reply }
      ].slice(-6)); // Keep last 6 messages (3 exchanges)
      
      // Auto-speak the response
      speakResponse(data.reply);
      
    } catch (err) {
      setError('Failed to get AI response. Please try again.');
      console.error('AI request error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationHistory]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = handsFreeMode;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          if (!handsFreeMode) {
            recognitionRef.current.stop();
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript && !isLoading) {
          sendToAI(transcript);
        }
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [handsFreeMode, transcript, isLoading, sendToAI]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setAiResponse('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  

  const speakResponse = (text) => {
    if (synthesisRef.current && text) {
      synthesisRef.current.cancel(); // Stop any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesisRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    setTranscript('');
    setAiResponse('');
    setConversationHistory([]);
    setError('');
  };

  const exampleQueries = [
    "What if I retire at 58 instead of 60?",
    "Compare Atal Pension Yojana with NPS for me.",
    "Explain my pension benefits in simple language.",
    "How much should I save monthly for retirement?",
    "What are the tax benefits of pension schemes?"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6" data-voice-assistant>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light text-gray-900">Voice Assistant</h2>
          <p className="text-gray-600 mt-1">Ask me anything about pensions using your voice</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={handsFreeMode}
              onChange={(e) => setHandsFreeMode(e.target.checked)}
              className="rounded border-gray-300"
            />
            Hands-Free Mode
          </label>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Main Voice Interface */}
      <div className="flex flex-col items-center mb-6">
        {/* Mic Button */}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isLoading}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isListening 
              ? 'bg-red-500 shadow-lg shadow-red-200 animate-pulse' 
              : 'bg-green-600 hover:bg-green-700 shadow-md'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isListening ? (
            <div className="w-6 h-6 bg-white rounded-sm animate-pulse"></div>
          ) : (
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <p className="text-sm text-gray-500 mt-3">
          {isListening ? 'Listening... Click to stop' : 'Click to start speaking'}
        </p>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">You said:</h3>
          <p className="text-blue-800">{transcript}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            <span className="text-gray-600">Getting AI response...</span>
          </div>
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-sm font-medium text-green-900">AI Response:</h3>
            <div className="flex gap-2">
              <button
                onClick={() => speakResponse(aiResponse)}
                disabled={isSpeaking}
                className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                title="Replay audio"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="Stop audio"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="text-green-800 whitespace-pre-line">{aiResponse}</p>
        </div>
      )}

      {/* Example Queries */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Try asking:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {exampleQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => {
                setTranscript(query);
                sendToAI(query);
              }}
              className=" text-black text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
            >
              &quot;{query}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={clearConversation}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Clear Conversation
        </button>
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Stop Speaking
          </button>
        )}
      </div>
    </div>
  );
}
