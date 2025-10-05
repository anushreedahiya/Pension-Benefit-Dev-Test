'use client';

import { useState } from 'react';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function TestPensionAPI() {
  const [formData, setFormData] = useState({
    age: '',
    origin: 'India',
    annualSalary: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        age: formData.age,
        origin: formData.origin,
        annualSalary: formData.annualSalary
      });

      const response = await fetch(`/api/pension-schemes?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pension schemes');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCurrencySymbol = (origin) => {
    switch (origin) {
      case 'India': return '₹';
      case 'Japan': return '¥';
      case 'USA': return '$';
      case 'UK': return '£';
      default: return '';
    }
  };

  // Chart data preparation functions
  const preparePensionAmountData = () => {
    if (!result?.schemes) return null;

    const topSchemes = result.schemes
      .filter(scheme => scheme.pensionCalculation?.monthlyPension > 0)
      .slice(0, 8)
      .sort((a, b) => b.pensionCalculation.monthlyPension - a.pensionCalculation.monthlyPension);

    return {
      labels: topSchemes.map(scheme => scheme.scheme_name.substring(0, 20) + '...'),
      datasets: [{
        label: `Monthly Pension (${getCurrencySymbol(result.userProfile.origin)})`,
        data: topSchemes.map(scheme => scheme.pensionCalculation.monthlyPension),
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(34, 197, 94, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      }]
    };
  };

  const prepareRelevanceScoreData = () => {
    if (!result?.schemes) return null;

    const topSchemes = result.schemes
      .slice(0, 10)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      labels: topSchemes.map(scheme => scheme.scheme_name.substring(0, 15) + '...'),
      datasets: [{
        label: 'Relevance Score',
        data: topSchemes.map(scheme => scheme.relevanceScore),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-800">
        {/* Header */}
        <AuthenticatedNavbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4 drop-shadow-lg">
            Pension Schemes Calculator
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto">
            Discover eligible pension schemes and calculate your potential retirement benefits based on your profile.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Enter Your Details</h2>
              <p className="text-gray-600">Fill in your information to get personalized pension recommendations</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Age Input */}
                <div className="space-y-2">
                  <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
                  Age *
                </label>
                  <div className="relative">
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg text-black placeholder-gray-500"
                      placeholder="25"
                      min="18"
                  max="120"
                  required
                />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
              </div>

                {/* Country Select */}
                <div className="space-y-2">
                  <label htmlFor="origin" className="block text-sm font-semibold text-gray-700">
                   Country *
                 </label>
                  <div className="relative">
                 <select
                   id="origin"
                   name="origin"
                   value={formData.origin}
                   onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg appearance-none bg-white text-black"
                   required
                 >
                   <option value="India">🇮🇳 India</option>
                   <option value="Japan">🇯🇵 Japan</option>
                   <option value="USA">🇺🇸 USA</option>
                   <option value="UK">🇬🇧 UK</option>
                 </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
               </div>

                {/* Annual Salary Input */}
                <div className="space-y-2">
                  <label htmlFor="annualSalary" className="block text-sm font-semibold text-gray-700">
                   Annual Salary *
                 </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {getCurrencySymbol(formData.origin)}
                    </span>
                 <input
                   type="number"
                   id="annualSalary"
                   name="annualSalary"
                   value={formData.annualSalary}
                   onChange={handleInputChange}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg text-black placeholder-gray-500"
                      placeholder="500000"
                   min="0"
                   required
                 />
                  </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 px-8 rounded-xl hover:from-green-700 hover:to-green-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Calculating Pension Schemes...
                  </div>
                ) : (
                  'Calculate Pension Schemes'
                )}
            </button>
          </form>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-8">
            {/* User Profile Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Your Profile Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{result.userProfile.age}</div>
                  <div className="text-sm text-green-700 font-medium">Age</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{result.userProfile.origin}</div>
                  <div className="text-sm text-green-700 font-medium">Country</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {getCurrencySymbol(result.userProfile.origin)}{result.userProfile.annualSalary.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Annual Salary</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {getCurrencySymbol(result.userProfile.origin)}{result.userProfile.monthlySalary.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700 font-medium">Monthly Salary</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Pension Amounts - Line Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Top Monthly Pension Amounts
                </h3>
                <div className="h-80">
                  {preparePensionAmountData() && (
                    <Line data={preparePensionAmountData()} options={lineChartOptions} />
                  )}
                </div>
              </div>

              {/* Relevance Scores - Bar Chart */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Relevance Scores
                </h3>
                <div className="h-80">
                  {prepareRelevanceScoreData() && (
                    <Bar data={prepareRelevanceScoreData()} options={barChartOptions} />
                  )}
                </div>
              </div>
            </div>

                         {/* Pension Insights */}
             {result.pensionInsights && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Pension Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {getCurrencySymbol(result.userProfile.origin)}{result.pensionInsights.totalMonthlyPension.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Monthly Pension</div>
                     </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {getCurrencySymbol(result.userProfile.origin)}{result.pensionInsights.totalAnnualPension.toLocaleString()}
                   </div>
                    <div className="text-sm text-gray-600 font-medium">Annual Pension</div>
                     </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {((result.pensionInsights.totalAnnualPension / result.userProfile.annualSalary) * 100).toFixed(1)}%
                   </div>
                    <div className="text-sm text-gray-600 font-medium">Replacement Ratio</div>
                   </div>
                 </div>
                 
                 {result.pensionInsights.tips.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Tips for Better Retirement Planning
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {result.pensionInsights.tips.map((tip, index) => (
                        <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-green-200">
                          <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                          <p className="text-sm text-gray-700">{tip}</p>
                        </div>
                       ))}
                    </div>
                   </div>
                 )}
                 
                 {result.pensionInsights.warnings.length > 0 && (
                   <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Important Considerations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {result.pensionInsights.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start p-3 bg-white rounded-lg border border-orange-200">
                          <div className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></div>
                          <p className="text-sm text-gray-700">{warning}</p>
                        </div>
                       ))}
                    </div>
                   </div>
                 )}
               </div>
             )}

            {/* Eligible Schemes */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                 Eligible Pension Schemes ({result.totalSchemes})
              </h2>
               
               {result.schemes.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-gray-600 text-lg">No eligible pension schemes found for your profile.</p>
                </div>
              ) : (
                <div className="space-y-6">
                   {result.schemes.map((scheme, index) => (
                    <div key={scheme.scheme_id} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-200">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">{scheme.scheme_name}</h3>
                         <div className="flex gap-2">
                          <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                             Score: {scheme.relevanceScore}
                           </span>
                           {scheme.pensionCalculation && scheme.pensionCalculation.monthlyPension > 0 && (
                            <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                              {getCurrencySymbol(result.userProfile.origin)}{scheme.pensionCalculation.monthlyPension.toLocaleString()}/month
                             </span>
                           )}
                         </div>
                       </div>
                       
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600"><span className="font-semibold">Category:</span> {scheme.category}</p>
                          <p className="text-sm text-gray-600"><span className="font-semibold">Sector:</span> {scheme.sector}</p>
                          <p className="text-sm text-gray-600"><span className="font-semibold">Agency:</span> {scheme.administering_agency}</p>
                         </div>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600"><span className="font-semibold">Age Range:</span> {scheme.eligibility_age_min}-{scheme.eligibility_age_max || "No limit"}</p>
                          <p className="text-sm text-gray-600"><span className="font-semibold">Contribution:</span> {scheme.contribution_employee_pct}</p>
                          <p className="text-sm text-gray-600"><span className="font-semibold">Formula:</span> {scheme.pension_formula.substring(0, 80)}...</p>
                         </div>
                       </div>
                       
                       {/* Pension Calculation Display */}
                       {scheme.pensionCalculation && (
                        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2">Pension Calculation:</h5>
                           <p className="text-sm text-gray-700 mb-2">{scheme.pensionCalculation.calculation}</p>
                           {scheme.pensionCalculation.type === 'epf_accumulation' && scheme.pensionCalculation.lumpSumCorpus && (
                            <p className="text-sm text-green-700 font-semibold">
                              Lump Sum Corpus: {getCurrencySymbol(result.userProfile.origin)}{scheme.pensionCalculation.lumpSumCorpus.toLocaleString()}
                             </p>
                           )}
                           {scheme.pensionCalculation.type === 'nps_market_linked' && (
                            <div className="text-sm text-green-700 space-y-1">
                              <p className="font-semibold">Lump Sum: {getCurrencySymbol(result.userProfile.origin)}{scheme.pensionCalculation.lumpSumCorpus.toLocaleString()}</p>
                              <p className="font-semibold">Annuity Corpus: {getCurrencySymbol(result.userProfile.origin)}{scheme.pensionCalculation.annuityCorpus.toLocaleString()}</p>
                             </div>
                           )}
                         </div>
                       )}
                       
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-800 font-medium">{scheme.recommendation}</p>
                       </div>
                       
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-gray-500">ID: {scheme.scheme_id}</span>
                         <a 
                           href={scheme.official_info_links} 
                           target="_blank" 
                           rel="noopener noreferrer"
                          className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
                         >
                           Official Info
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                         </a>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 bg-white rounded-xl p-4 border border-gray-100">
              <p><strong>Analysis completed:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
