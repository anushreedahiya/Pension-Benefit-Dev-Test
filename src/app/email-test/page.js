'use client';

import { useState } from 'react';

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [testType, setTestType] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTestEmail = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          testType: testType
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send test email',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Email Notification Test
        </h1>
        
        <form onSubmit={handleTestEmail} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter email to test"
              required
            />
          </div>

          <div>
            <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <select
              id="testType"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="signup">Signup Email</option>
              <option value="signin">Signin Email</option>
              <option value="signout">Signout Email</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </form>

        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`font-medium ${
              result.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.success ? 'Success!' : 'Error'}
            </h3>
            <p className={`mt-1 text-sm ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.message}
            </p>
            {result.messageId && (
              <p className="mt-1 text-xs text-green-600">
                Message ID: {result.messageId}
              </p>
            )}
            {result.error && (
              <p className="mt-1 text-xs text-red-600">
                Error: {result.error}
              </p>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Signup:</strong> Welcome email with onboarding information</li>
            <li>• <strong>Signin:</strong> Login confirmation with security details</li>
            <li>• <strong>Signout:</strong> Session termination confirmation</li>
          </ul>
          <p className="text-xs text-blue-600 mt-2">
            Emails are sent from shardulkacheria@gmail.com using Gmail SMTP
          </p>
        </div>
      </div>
    </div>
  );
}
