'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";

export default function UnauthenticatedNavbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const pathname = usePathname();

  useEffect(() => {
    const handleShowSignUpModal = () => {
      setAuthMode('signup');
      setShowAuthModal(true);
    };

    window.addEventListener('showSignUpModal', handleShowSignUpModal);

    return () => {
      window.removeEventListener('showSignUpModal', handleShowSignUpModal);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
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

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`transition-colors ${
                pathname === "/" 
                  ? "text-green-600 font-semibold" 
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className={`transition-colors ${
                pathname === "/about" 
                  ? "text-green-600 font-semibold" 
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              About
            </Link>
            <Link 
              href="/features" 
              className={`transition-colors ${
                pathname === "/features" 
                  ? "text-green-600 font-semibold" 
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Features
            </Link>
            
            <Link 
              href="/faq" 
              className={`transition-colors ${
                pathname === "/faq" 
                  ? "text-green-600 font-semibold" 
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              FAQ
            </Link>
            <Link 
              href="/contact" 
              className={`transition-colors ${
                pathname === "/contact" 
                  ? "text-green-600 font-semibold" 
                  : "text-gray-700 hover:text-green-600"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => {
                setAuthMode('signin');
                setShowAuthModal(true);
              }}
              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => {
                setAuthMode('signup');
                setShowAuthModal(true);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
      />
    </header>
  );
}
