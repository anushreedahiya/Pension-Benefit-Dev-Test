'use client';

import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);
import { useAuth } from '@/contexts/AuthContext';

const PensionComparisonForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [formSchema, setFormSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});

  const getCurrencyFormatter = (countryLabel) => {
    const countryToMeta = {
      India: { locale: 'en-IN', currency: 'INR' },
      USA: { locale: 'en-US', currency: 'USD' },
      UK: { locale: 'en-GB', currency: 'GBP' },
      Japan: { locale: 'ja-JP', currency: 'JPY' }
    };
    const meta = countryToMeta[countryLabel] || countryToMeta['India'];
    return new Intl.NumberFormat(meta.locale, { style: 'currency', currency: meta.currency, maximumFractionDigits: 0 });
  };

  const formatAISchemeAnalysis = (text) => {
    if (!text) return '';
    let html = text.trim();
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1<\/strong>');
    const lines = html.split('\n');
    const chunks = [];
    let inUl = false;
    let inOl = false;
    for (const raw of lines) {
      const line = raw.trim();
      const ol = line.match(/^\d+\.\s+(.*)$/);
      const ul = line.match(/^[-*]\s+(.*)$/);
      if (ol) {
        if (inUl) { chunks.push('</ul>'); inUl = false; }
        if (!inOl) { chunks.push('<ol class="list-decimal list-inside space-y-1">'); inOl = true; }
        chunks.push(`<li>${ol[1]}</li>`);
        continue;
      }
      if (ul) {
        if (inOl) { chunks.push('</ol>'); inOl = false; }
        if (!inUl) { chunks.push('<ul class="list-disc list-inside space-y-1">'); inUl = true; }
        chunks.push(`<li>${ul[1]}</li>`);
        continue;
      }
      if (inUl) { chunks.push('</ul>'); inUl = false; }
      if (inOl) { chunks.push('</ol>'); inOl = false; }
      if (line.length) {
        chunks.push(`<p>${line}</p>`);
      }
    }
    if (inUl) chunks.push('</ul>');
    if (inOl) chunks.push('</ol>');
    return chunks.join('');
  };

  // Load form schema
  useEffect(() => {
    const loadFormSchema = async () => {
      try {
        const response = await fetch('/form.json');
        const schema = await response.json();
        setFormSchema(schema);
        
        // Initialize form data with empty values
        const initialData = {};
        schema.sections.forEach(section => {
          section.fields.forEach(field => {
            initialData[field.name] = '';
          });
        });
        setFormData(initialData);
      } catch (error) {
        console.error('Error loading form schema:', error);
      }
    };

    loadFormSchema();
  }, []);

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    formSchema.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required && (!formData[field.name] || formData[field.name] === '')) {
          newErrors[field.name] = `${field.label} is required`;
        }

        // Additional validations
        if (field.type === 'number' && formData[field.name]) {
          const numValue = parseFloat(formData[field.name]);
          if (isNaN(numValue)) {
            newErrors[field.name] = `${field.label} must be a valid number`;
          } else if (field.min !== undefined && numValue < field.min) {
            newErrors[field.name] = `${field.label} must be at least ${field.min}`;
          } else if (field.max !== undefined && numValue > field.max) {
            newErrors[field.name] = `${field.label} must be at most ${field.max}`;
          }
        }

        if (field.type === 'date' && formData[field.name]) {
          const dateValue = new Date(formData[field.name]);
          if (isNaN(dateValue.getTime())) {
            newErrors[field.name] = `${field.label} must be a valid date`;
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pension-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(data);
      } else {
        setErrors({ submit: data.message || 'Failed to analyze pension comparison' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const fieldValue = formData[field.name] || '';
    const fieldError = errors[field.name];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg text-black placeholder-gray-500 ${
              fieldError ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : ''
            }`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg text-black placeholder-gray-500 ${
              fieldError ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : ''
            }`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg text-black ${
              fieldError ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : ''
            }`}
          />
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg appearance-none bg-white text-black ${
              fieldError ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : ''
            }`}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 text-lg text-black placeholder-gray-500 ${
              fieldError ? 'border-red-300 focus:ring-red-100 focus:border-red-500' : ''
            }`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
    }
  };

  if (!formSchema) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{formSchema.formTitle}</h2>
            <p className="text-gray-600">Fill in your details to get personalized pension scheme recommendations</p>
          </div>
          
          {user && (
            <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm text-green-800 font-medium">
                  Welcome, {user.displayName || user.email}! Your information will be used to provide personalized pension recommendations.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {formSchema.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">{sectionIndex + 1}</span>
                  </div>
                  {section.title}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="space-y-2">
                      <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      
                      {renderField(field)}
                      
                      {errors[field.name] && (
                        <p className="text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full max-w-md bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-8 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Pension Schemes...
                  </div>
                ) : (
                  'Compare Pension Schemes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

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
                <div className="text-2xl font-bold text-green-600">{result.userProfile.name}</div>
                <div className="text-sm text-green-700 font-medium">Name</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{result.userProfile.age} years</div>
                <div className="text-sm text-blue-700 font-medium">Age</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{result.userProfile.state}</div>
                <div className="text-sm text-purple-700 font-medium">State</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">{result.userProfile.origin}</div>
                <div className="text-sm text-amber-700 font-medium">Country</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">{(() => {
                  const c = result.userProfile.origin;
                  const map = { India: { l: 'en-IN', c: 'INR' }, USA: { l: 'en-US', c: 'USD' }, UK: { l: 'en-GB', c: 'GBP' }, Japan: { l: 'ja-JP', c: 'JPY' } };
                  const meta = map[c] || map['India'];
                  const fmt = new Intl.NumberFormat(meta.l, { style: 'currency', currency: meta.c, maximumFractionDigits: 0 });
                  return fmt.format(result.userProfile.monthlyIncome || 0);
                })()}</div>
                <div className="text-sm text-orange-700 font-medium">Monthly Income</div>
              </div>
            </div>
          </div>

          {/* Top Recommendations */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Top 3 Recommendations
            </h2>
            <div className="space-y-6">
              {result.analysis.topRecommendations.map((rec, index) => (
                <div key={index} className="border-2 border-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">#{rec.rank}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{rec.scheme}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600">
                        {(() => {
                          const c = result.userProfile.origin;
                          const map = { India: { l: 'en-IN', c: 'INR' }, USA: { l: 'en-US', c: 'USD' }, UK: { l: 'en-GB', c: 'GBP' }, Japan: { l: 'ja-JP', c: 'JPY' } };
                          const meta = map[c] || map['India'];
                          const fmt = new Intl.NumberFormat(meta.l, { style: 'currency', currency: meta.c, maximumFractionDigits: 0 });
                          return rec.monthlyPension ? fmt.format(rec.monthlyPension) : 'N/A';
                        })()}
                      </div>
                      <div className="text-sm text-gray-600">Monthly Pension</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 text-lg">{rec.recommendation}</p>
                  {rec.calculation && (
                    <p className="text-gray-600 text-sm mb-4">Calculation: {rec.calculation}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rec.advantages.length > 0 && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h5 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Advantages
                        </h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          {rec.advantages.map((adv, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              {adv}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {rec.disadvantages.length > 0 && (
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h5 className="text-sm font-semibold text-orange-800 mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          Considerations
                        </h5>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {rec.disadvantages.map((dis, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              {dis}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Scheme Comparison */}
          {result.analysis.currentSchemeComparison && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Current Scheme Comparison
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Current Scheme</h4>
                  <p className="text-lg text-gray-700">{result.analysis.currentSchemeComparison.currentScheme}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Current Monthly Pension</h4>
                  <p className="text-2xl font-bold text-gray-700">{(() => {
                    const c = result.userProfile.origin;
                    const map = { India: { l: 'en-IN', c: 'INR' }, USA: { l: 'en-US', c: 'USD' }, UK: { l: 'en-GB', c: 'GBP' }, Japan: { l: 'ja-JP', c: 'JPY' } };
                    const meta = map[c] || map['India'];
                    const fmt = new Intl.NumberFormat(meta.l, { style: 'currency', currency: meta.c, maximumFractionDigits: 0 });
                    const amt = result.analysis.currentSchemeComparison.currentMonthlyPension || 0;
                    return fmt.format(amt);
                  })()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommended Monthly Pension</h4>
                  <p className="text-2xl font-bold text-green-600">{(() => {
                    const c = result.userProfile.origin;
                    const map = { India: { l: 'en-IN', c: 'INR' }, USA: { l: 'en-US', c: 'USD' }, UK: { l: 'en-GB', c: 'GBP' }, Japan: { l: 'ja-JP', c: 'JPY' } };
                    const meta = map[c] || map['India'];
                    const fmt = new Intl.NumberFormat(meta.l, { style: 'currency', currency: meta.c, maximumFractionDigits: 0 });
                    const amt = result.analysis.currentSchemeComparison.recommendedMonthlyPension || 0;
                    return fmt.format(amt);
                  })()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Improvement</h4>
                  <p className={`text-2xl font-bold ${result.analysis.currentSchemeComparison.isBetter ? 'text-green-600' : 'text-red-600'}`}>
                    {(() => {
                      const c = result.userProfile.origin;
                      const map = { India: { l: 'en-IN', c: 'INR' }, USA: { l: 'en-US', c: 'USD' }, UK: { l: 'en-GB', c: 'GBP' }, Japan: { l: 'ja-JP', c: 'JPY' } };
                      const meta = map[c] || map['India'];
                      const fmt = new Intl.NumberFormat(meta.l, { style: 'currency', currency: meta.c, maximumFractionDigits: 0 });
                      const amt = result.analysis.currentSchemeComparison.difference || 0;
                      return fmt.format(amt);
                    })()} 
                    <span className="text-lg ml-2">({result.analysis.currentSchemeComparison.percentageImprovement?.toFixed(1)}%)</span>
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 font-medium">{result.analysis.currentSchemeComparison.recommendation}</p>
              </div>
            </div>
          )}

          {/* Insights */}
          {result.analysis && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analysis Insights
              </h2>

              {(() => {
                const top3 = (result.analysis.topRecommendations || []).slice(0,3);
                const labels = top3.map(r => r.scheme);
                const values = top3.map(r => r.monthlyPension || 0);
                const fmt = getCurrencyFormatter(result.userProfile.origin);

                const barData = {
                  labels,
                  datasets: [
                    {
                      label: 'Monthly Pension',
                      data: values,
                      backgroundColor: ['#34d399', '#60a5fa', '#f59e0b'],
                      borderRadius: 8
                    }
                  ]
                };
                const barOptions = {
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `${fmt.format(ctx.parsed.y)}`
                      }
                    },
                    title: { display: true, text: 'Monthly Pension (Top 3)' }
                  },
                  scales: {
                    y: {
                      ticks: {
                        callback: (val) => fmt.format(val)
                      }
                    }
                  }
                };

                const pieData = {
                  labels,
                  datasets: [{
                    data: values,
                    backgroundColor: ['#34d399', '#60a5fa', '#f59e0b']
                  }]
                };

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                      <Bar data={barData} options={barOptions} />
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-emerald-200">
                      <Pie data={pieData} options={{ plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Share of Monthly Pension' } } }} />
                    </div>
                    <div className="lg:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <ul className="list-disc list-inside text-gray-800 space-y-1">
                        <li><strong>Top scheme:</strong> {labels[0]} at {fmt.format(values[0] || 0)}</li>
                        <li><strong>Total across top 3:</strong> {fmt.format(values.reduce((a,b)=>a+b,0))}</li>
                        <li><strong>Country:</strong> {result.userProfile.origin}</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {result.analysis.aiAnalysis && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-sky-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Scheme Analysis
              </h2>
              <div className="prose max-w-none text-gray-800 space-y-2" dangerouslySetInnerHTML={{ __html: formatAISchemeAnalysis(result.analysis.aiAnalysis) }} />
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 bg-white rounded-xl p-4 border border-gray-100">
            <p><strong>Analysis completed:</strong> {new Date(result.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PensionComparisonForm;
