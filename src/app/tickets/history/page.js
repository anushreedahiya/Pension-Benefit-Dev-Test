'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import UnauthenticatedNavbar from '@/components/UnauthenticatedNavbar';

export default function TicketHistoryPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      fetchTickets(user.email);
    }
  }, [user]);

  const fetchTickets = async (userEmail) => {
    if (!userEmail) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/tickets?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tickets');
      setTickets(data.tickets || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatusPill = ({ status }) => {
    const map = {
      Open: 'bg-amber-100 text-amber-800',
      Closed: 'bg-green-100 text-green-800',
      Pending: 'bg-blue-100 text-blue-800'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-light text-gray-900">My Tickets</h1>
          <div className="flex items-center gap-2">
            <input
              placeholder="Email to lookup"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-gray-900"
            />
            <button
              onClick={() => fetchTickets(email)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading && <div className="text-gray-600">Loading tickets...</div>}
        {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 mb-4">{error}</div>}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="divide-y divide-gray-100">
            {tickets.length === 0 && !loading ? (
              <div className="p-6 text-gray-500">No tickets found.</div>
            ) : (
              tickets.map((t) => (
                <div key={t._id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{t.subject}</h3>
                    <StatusPill status={t.status} />
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    <span>{t.category}</span>
                    <span className="mx-2">•</span>
                    <span>Priority: {t.priority}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-900 whitespace-pre-line">{t.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
