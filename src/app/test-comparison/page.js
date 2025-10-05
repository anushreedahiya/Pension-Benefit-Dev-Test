'use client';

import { useState } from 'react';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TestComparisonPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testData = {
    fullName: "John Doe",
    dob: "1985-05-15",
    gender: "Male",
    maritalStatus: "Married",
    dependents: 2,
    state: "Maharashtra",
    residenceYears: 10,
    citizenship: "Yes",
    employmentStatus: "Self-Employed",
    sector: "Unorganised",
    govtJoinBefore2004: "No",
    landHectares: 0,
    monthlyIncome: 25000,
    taxPayer: "No",
    bplStatus: "No",
    aadhaar: "Yes",
    bankAccount: "Yes",
    disability: "No",
    disabilityPercent: 0,
    widow: "No",
    destitute: "No",
    casteCategory: "None",
    traditionalWorker: "No",
    payoutType: "Monthly Pension",
    investmentPreference: "Government-guaranteed pension",
    monthlyContributionWilling: "Yes",
    affordableContribution: 1000,
    familyPension: "Yes",
    landDocs: "No",
    disabilityCert: "No",
    residenceProof: "Yes",
    currentPensionScheme: "APY",
    currentMonthlyPension: 500,
    currentContribution: 100
  };

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/pension-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'Failed to test pension comparison');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AuthenticatedNavbar />
        <div className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Pension Comparison API Test
          </h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Data</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(testData, null, 2)}
              </pre>
            </div>
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 font-medium"
          >
            {loading ? 'Testing...' : 'Test Pension Comparison API'}
          </button>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {result && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Test Results
            </h2>
            
            <div className="space-y-6">
              {/* User Profile Summary */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">User Profile</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Name:</span> {result.userProfile.name}
                  </div>
                  <div>
                    <span className="font-medium">Age:</span> {result.userProfile.age} years
                  </div>
                  <div>
                    <span className="font-medium">State:</span> {result.userProfile.state}
                  </div>
                  <div>
                    <span className="font-medium">Monthly Income:</span> ₹{result.userProfile.monthlyIncome?.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Analysis Summary */}
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Eligible Schemes:</span> {result.analysis.totalEligibleSchemes}
                  </div>
                  <div>
                    <span className="font-medium">Origin:</span> {result.userProfile.origin}
                  </div>
                  <div>
                    <span className="font-medium">Employment Status:</span> {result.userProfile.employmentStatus}
                  </div>
                </div>
              </div>

              {/* Top Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 3 Recommendations</h3>
                <div className="space-y-4">
                  {result.analysis.topRecommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          #{rec.rank} {rec.scheme}
                        </h4>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{rec.monthlyPension?.toLocaleString() || 'N/A'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{rec.recommendation}</p>
                      <div className="text-sm">
                        <span className="font-medium">Relevance Score:</span> {rec.relevanceScore}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Scheme Comparison */}
              {result.analysis.currentSchemeComparison && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Scheme Comparison</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Current Scheme:</span> {result.analysis.currentSchemeComparison.currentScheme}
                    </div>
                    <div>
                      <span className="font-medium">Current Monthly Pension:</span> ₹{result.analysis.currentSchemeComparison.currentMonthlyPension?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Recommended Monthly Pension:</span> ₹{result.analysis.currentSchemeComparison.recommendedMonthlyPension?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Difference:</span> 
                      <span className={`ml-1 ${result.analysis.currentSchemeComparison.isBetter ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{result.analysis.currentSchemeComparison.difference?.toLocaleString()} 
                        ({result.analysis.currentSchemeComparison.percentageImprovement?.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">
                    {result.analysis.currentSchemeComparison.recommendation}
                  </p>
                </div>
              )}

              <div className="text-sm text-gray-500 text-center">
                Test completed on {new Date(result.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
