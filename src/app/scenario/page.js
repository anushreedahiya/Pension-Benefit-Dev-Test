'use client';

import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedNavbar from '@/components/AuthenticatedNavbar';
import UnauthenticatedNavbar from '@/components/UnauthenticatedNavbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScenarioTesting from '@/components/ScenarioTesting';

export default function ScenarioPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        {user ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />}

        {/* Main Content */}
        <main className="py-16">
          <ScenarioTesting />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100">
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
