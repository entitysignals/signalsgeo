"use client";

import Link from "next/link";
import { AuthButtons } from "./AuthButtons";

export function CustomHeader() {
  return (
    <header className="border-b border-cyan-200/30 bg-cyan-100/40 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Signals GEO" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-cyan-800">
                AI Visibility Analyzer
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <AuthButtons />
        </div>
      </div>

      {/* Family Links */}
      <div className="border-t border-cyan-200/20 bg-cyan-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 space-x-6 text-xs">
            <span className="text-gray-500">In affiliation with:</span>
            <a
              href="https://entitysignals.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors font-bold"
            >
              Entity Signals
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
