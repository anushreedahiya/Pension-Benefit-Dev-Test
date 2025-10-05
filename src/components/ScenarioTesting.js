'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ScenarioTesting() {
  const [formData, setFormData] = useState({
    currentAge: '',
    retirementAge: '',
    monthlyContribution: '',
    returnRate: '',
    inflationRate: ''
  });

  // Country and currency setup
  const countries = {
    IN: { label: 'India', currency: 'INR', locale: 'en-IN', symbol: '₹' },
    US: { label: 'USA', currency: 'USD', locale: 'en-US', symbol: '$' },
    UK: { label: 'UK', currency: 'GBP', locale: 'en-GB', symbol: '£' },
    JP: { label: 'Japan', currency: 'JPY', locale: 'ja-JP', symbol: '¥' }
  };
  const [countryCode, setCountryCode] = useState('IN');

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateScenario = async () => {
    setLoading(true);
    setError('');
    
    // Convert string values to numbers for API
    const scenarioData = {
      currentAge: parseFloat(formData.currentAge) || 0,
      retirementAge: parseFloat(formData.retirementAge) || 0,
      monthlyContribution: parseFloat(formData.monthlyContribution) || 0,
      returnRate: parseFloat(formData.returnRate) || 0,
      inflationRate: parseFloat(formData.inflationRate) || 0
    };
    
    try {
      const response = await fetch('/api/scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scenarioData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate scenario');
      }

      setResults(data);
      
      // Add to scenarios for comparison
      const scenarioName = `Scenario ${scenarios.length + 1} (${countries[countryCode].label})`;
      setScenarios(prev => [...prev, { name: scenarioName, countryCode, ...data }]);
      
      // Generate AI explanation
      generateAIExplanation(data, countries[countryCode]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateAIExplanation = async (scenarioData, countryInfo) => {
    setAiLoading(true);
    
    try {
      const response = await fetch('/api/ai-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenarioData, locale: countryInfo.locale, currencyCode: countryInfo.currency, countryLabel: countryInfo.label, currencySymbol: countryInfo.symbol }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI explanation');
      }

      // Format the AI explanation for better readability
      const formattedExplanation = formatAIExplanation(data.explanation);
      setAiExplanation(formattedExplanation);
      
    } catch (err) {
      console.error('AI explanation error:', err);
      setAiExplanation('Unable to generate AI explanation at this time.');
    } finally {
      setAiLoading(false);
    }
  };

  const formatAIExplanation = (text) => {
    // Split the text into sections based on numbered points
    const sections = text.split(/(\d+\.\s+\*\*[^*]+\*\*)/);
    
    if (sections.length <= 1) {
      // If no numbered sections found, just return the text with basic formatting
      return text
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\* ([^*]+)/g, '• $1')
        .replace(/\n/g, '<br>');
    }

    let formattedText = '';
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      if (section.match(/^\d+\.\s+\*\*[^*]+\*\*/)) {
        // This is a numbered section header
        const cleanHeader = section.replace(/\*\*([^*]+)\*\*/g, '$1');
        formattedText += `<div class="mb-4"><h4 class="font-semibold text-gray-900 mb-2">${cleanHeader}</h4>`;
      } else if (section.trim()) {
        // This is the content of a section
        const formattedContent = section
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-900">$1</strong>')
          .replace(/\* ([^*]+)/g, '<div class="flex items-start space-x-2 mb-1"><span class="text-green-600 mt-1">•</span><span>$1</span></div>')
          .replace(/\n/g, '<br>');
        
        formattedText += `<div class="text-gray-700 leading-relaxed">${formattedContent}</div></div>`;
      }
    }
    
    return formattedText;
  };

  const clearScenarios = () => {
    setScenarios([]);
    setResults(null);
    setAiExplanation('');
  };

  const formatCurrency = (value) => {
    const { locale, currency } = countries[countryCode];
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = {
    labels: scenarios.map(scenario => scenario.name),
    datasets: [
      {
        label: 'Future Value',
        data: scenarios.map(scenario => scenario.futureValue),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Real Value',
        data: scenarios.map(scenario => scenario.realValue),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Scenario Comparison',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            const { locale, currency } = countries[countryCode];
            return new Intl.NumberFormat(locale, { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(value);
          }
        },
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-light text-gray-900 mb-3">Scenario Testing</h1>
        <p className="text-gray-600">Test different pension scenarios and see how they affect your retirement corpus</p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-medium text-gray-900 mb-6">Scenario Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Country Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <select
              name="country"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900"
            >
              {Object.entries(countries).map(([code, info]) => (
                <option key={code} value={code}>{info.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Age
            </label>
            <input
              type="number"
              name="currentAge"
              value={formData.currentAge}
              onChange={handleInputChange}
              placeholder="Enter your current age"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              min="18"
              max="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retirement Age
            </label>
            <input
              type="number"
              name="retirementAge"
              value={formData.retirementAge}
              onChange={handleInputChange}
              placeholder="Enter retirement age"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              min="40"
              max="80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Contribution ({countries[countryCode].symbol})
            </label>
            <input
              type="number"
              name="monthlyContribution"
              value={formData.monthlyContribution}
              onChange={handleInputChange}
              placeholder="Enter monthly contribution"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              min="10"
              step="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Return Rate (%)
            </label>
            <input
              type="number"
              name="returnRate"
              value={formData.returnRate}
              onChange={handleInputChange}
              placeholder="Enter expected return rate"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              min="1"
              max="20"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inflation Rate (%)
            </label>
            <input
              type="number"
              name="inflationRate"
              value={formData.inflationRate}
              onChange={handleInputChange}
              placeholder="Enter inflation rate"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
              min="0.5"
              max="15"
              step="0.5"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={calculateScenario}
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Calculating...' : 'Run Scenario'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">Scenario Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-sm font-medium text-green-600">Future Value</div>
              <div className="text-2xl font-bold text-green-900">{formatCurrency(results.futureValue)}</div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-sm font-medium text-blue-600">Real Value</div>
              <div className="text-2xl font-bold text-blue-900">{formatCurrency(results.realValue)}</div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-sm font-medium text-purple-600">Interest Earned</div>
              <div className="text-2xl font-bold text-purple-900">{formatCurrency(results.interestEarned)}</div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="text-sm font-medium text-orange-600">Inflation Loss</div>
              <div className="text-2xl font-bold text-orange-900">{formatCurrency(results.inflationLoss)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-900">Years to Retirement:</span>
                  <span className="font-medium text-gray-900">{results.inputs.yearsToRetirement} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Total Contribution:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(results.totalContribution)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Contribution vs Interest:</span>
                  <span className="font-medium text-gray-900">
                    {((results.totalContribution / results.futureValue) * 100).toFixed(1)}% : {((results.interestEarned / results.futureValue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI Analysis</h3>
              {aiLoading ? (
                <div className="text-gray-900">Generating AI explanation...</div>
              ) : aiExplanation ? (
                <div className="bg-white rounded-xl p-4 text-sm leading-relaxed text-gray-900">
                  <div className="space-y-2" dangerouslySetInnerHTML={{ __html: aiExplanation }} />
                </div>
              ) : (
                <div className="text-gray-500">Click &quot;Run Scenario&quot; to get AI analysis</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      {scenarios.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium text-gray-900">Scenario Comparison</h2>
            <button
              onClick={clearScenarios}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="h-80">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}
