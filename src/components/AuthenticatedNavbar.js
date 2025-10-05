'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function AuthenticatedNavbar() {
  const { user, signout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signout();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const linkBase = "transition-colors rounded-lg px-3 py-2";
  const linkActive = "text-green-700 bg-green-50 font-medium";
  const linkIdle = "text-gray-700 hover:text-green-700 hover:bg-green-50";

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Pension Planner Pro</span>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/test-pension-api" 
              className={`${linkBase} ${pathname === "/test-pension-api" ? linkActive : linkIdle}`}
            >
              Pension Scheme Calculator
            </Link>
            <Link 
              href="/pension-comparison" 
              className={`${linkBase} ${pathname === "/pension-comparison" ? linkActive : linkIdle}`}
            >
              Scheme Comparison
            </Link>
            <Link 
              href="/chatbot" 
              className={`${linkBase} ${pathname === "/chatbot" ? linkActive : linkIdle}`}
            >
              AI Assistant
            </Link>
            <Link 
              href="/dashboard" 
              className={`${linkBase} ${pathname === "/dashboard" ? linkActive : linkIdle}`}
            >
              Dashboard
            </Link>
          </nav>

          {/* User Info and Sign Out */}
          <div className="hidden md:flex items-center gap-6 ml-6 lg:ml-10">
            <span className="text-gray-700">Welcome, {user?.displayName || user?.email}</span>
            <button 
              onClick={handleSignOut}
              className="px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            <Link href="/dashboard" onClick={closeMobile} className={`${linkBase} ${pathname === "/dashboard" ? linkActive : linkIdle} block`}>
              Dashboard
            </Link>
            <Link href="/test-pension-api" onClick={closeMobile} className={`${linkBase} ${pathname === "/test-pension-api" ? linkActive : linkIdle} block`}>
              Pension Scheme Calculator
            </Link>
            <Link href="/pension-comparison" onClick={closeMobile} className={`${linkBase} ${pathname === "/pension-comparison" ? linkActive : linkIdle} block`}>
              Scheme Comparison
            </Link>
            <Link href="/chatbot" onClick={closeMobile} className={`${linkBase} ${pathname === "/chatbot" ? linkActive : linkIdle} block`}>
              AI Assistant
            </Link>
            <div className="pt-2">
              <button
                onClick={() => { closeMobile(); handleSignOut(); }}
                className="w-full text-left px-3 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

