'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import dynamic from 'next/dynamic';
import VoiceAssistant from "@/components/VoiceAssistant";

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = (route) => {
    setIsMenuOpen(false);
    router.push(route);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <AuthenticatedNavbar />

      {/* Dashboard Content */}
        <main className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section with Lottie Animation */}
          <div className="text-center mb-16">
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
                {/* Lottie Animation */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-64 lg:h-64">
                  {typeof window !== 'undefined' && (
                    <Lottie
                      animationData={require('../../../public/Payment Preview Loader.json')}
                      loop={true}
                      autoplay={true}
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        backgroundColor: 'transparent'
                      }}
                      rendererSettings={{
                        preserveAspectRatio: 'xMidYMid slice'
                      }}
                    />
                  )}
                </div>
                
                {/* Welcome Text */}
                <div className="lg:text-left">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-4 sm:mb-6 shadow-lg">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2 sm:mb-3">Welcome back, {user?.displayName || 'User'}</h1>
                  <p className="text-gray-600 text-base sm:text-lg font-light">
                    Manage your pension planning journey with our comprehensive tools
            </p>
          </div>
              </div>
            </div>

           

            {/* Main Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 lg:mb-16">
              {/* Pension Schemes Calculator */}
              <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Pension Calculator</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Calculate retirement benefits</p>
                  </div>
                </div>
                <Link href="/test-pension-api" className="block">
                  <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-green-50 hover:text-green-700 hover:border-green-200 border border-gray-200 transition-all duration-200 font-medium text-sm">
                    Get Started
                </button>
              </Link>
            </div>

              {/* Scheme Comparison */}
              <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Scheme Comparison</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Compare pension plans</p>
                  </div>
                </div>
                <Link href="/pension-comparison" className="block">
                  <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-gray-200 transition-all duration-200 font-medium text-sm">
                    Compare Now
                </button>
              </Link>
            </div>

              {/* AI Assistant */}
              <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-cyan-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">AI Assistant</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Get expert advice</p>
                  </div>
                </div>
                <Link href="/chatbot" className="block">
                  <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200 border border-gray-200 transition-all duration-200 font-medium text-sm">
                    Start Chat
                </button>
              </Link>
            </div>

              {/* Scenario Testing */}
              <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-yellow-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Scenario Testing</h3>
                    <p className="text-xs sm:text-sm text-gray-500">What-if analysis</p>
                  </div>
                </div>
                <Link href="/scenario" className="block">
                  <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200 border border-gray-200 transition-all duration-200 font-medium text-sm">
                    Test Scenarios
                </button>
              </Link>
            </div>

              {/* Test Comparison API */}
              <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Test API</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Test comparison API</p>
                  </div>
                </div>
                <Link href="/test-comparison" className="block">
                  <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 border border-gray-200 transition-all duration-200 font-medium text-sm">
                    Test Now
                </button>
              </Link>
            </div>

              {/* Features */}
              <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Features</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Explore all tools</p>
                  </div>
                </div>
                <Link href="/features" className="block">
                  <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 border border-gray-200 transition-all duration-200 font-medium text-sm">
                    View All
                </button>
              </Link>
            </div>

              {/* FAQ */}
              <div className="group bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">Help & FAQ</h3>
                    <p className="text-xs sm:text-sm text-gray-500">Find answers</p>
            </div>
              </div>
                <Link href="/faq" className="block">
                  <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-gray-200 transition-all duration-200 font-medium text-sm">
                    Get Help
                </button>
              </Link>
            </div>
          </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 lg:mb-16">
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Available Schemes</p>
                    <p className="text-xl sm:text-2xl font-light text-gray-900">50+</p>
                </div>
              </div>
            </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">Countries</p>
                    <p className="text-xl sm:text-2xl font-light text-gray-900">4</p>
                </div>
              </div>
            </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-500">API Endpoints</p>
                    <p className="text-xl sm:text-2xl font-light text-gray-900">3</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
              <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-4 sm:mb-6">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact">
                  <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm">
                    Contact Support
                  </button>
                </Link>
                <Link href="/about">
                  <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm">
                    About Us
                  </button>
                </Link>
                <Link href="/tickets">
                  <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm">
                    Raise Ticket
                  </button>
                </Link>
                <Link href="/tickets/history">
                  <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm">
                    View My Tickets
                  </button>
                </Link>
                <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm">
                  Documentation
                </button>
            </div>
          </div>

            {/* Voice Assistant */}
            <VoiceAssistant />
        </div>
      </main>

        {/* Quick Action Menu - Bottom Right */}
        <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-20">
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          >
            <svg 
              className={`w-6 h-6 text-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>

          {/* Menu Popup */}
          {isMenuOpen && (
            <div className="absolute bottom-14 sm:bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 sm:p-4 min-w-60 sm:min-w-64 animate-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2 sm:space-y-3">
                {/* Calculate Pensions Option */}
                <button
                  onClick={() => handleMenuClick('/test-pension-api')}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 hover:border-green-200 border border-transparent transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Calculate Pensions</div>
                    <div className="text-sm text-gray-500">Discover eligible schemes</div>
                  </div>
                </button>

                {/* Compare Schemes Option */}
                <button
                  onClick={() => handleMenuClick('/pension-comparison')}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Compare Schemes</div>
                    <div className="text-sm text-gray-500">Compare pension plans</div>
                  </div>
                </button>

                {/* Raise Ticket Option */}
                <button
                  onClick={() => handleMenuClick('/tickets')}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-rose-50 hover:border-rose-200 border border-transparent transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Raise Ticket</div>
                    <div className="text-sm text-gray-500">Ask an advisor</div>
                  </div>
                </button>

                {/* Speak with AI Option */}
                <button
                  onClick={() => handleMenuClick('/chatbot')}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-cyan-50 hover:border-cyan-200 border border-transparent transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Speak with AI</div>
                    <div className="text-sm text-gray-500">Get expert advice</div>
                  </div>
                </button>

                {/* Scenario Testing Option */}
                <button
                  onClick={() => handleMenuClick('/scenario')}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-yellow-50 hover:border-yellow-200 border border-transparent transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Scenario Testing</div>
                    <div className="text-sm text-gray-500">What-if analysis</div>
                  </div>
                </button>

                {/* Voice Assistant Option */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Scroll to voice assistant section
                    const voiceAssistant = document.querySelector('[data-voice-assistant]');
                    if (voiceAssistant) {
                      voiceAssistant.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-pink-50 hover:border-pink-200 border border-transparent transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Voice Assistant</div>
                    <div className="text-sm text-gray-500">Speak to get help</div>
                  </div>
                </button>
              </div>
            </div>
          )}
            </div>

        {/* Minimal Footer */}
        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-500 text-sm">
              © 2024 Pension Planner Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    </ProtectedRoute>
  );
} 