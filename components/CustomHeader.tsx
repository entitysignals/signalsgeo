"use client";

import Link from "next/link";
import { AuthButtons } from "./AuthButtons";

export function CustomHeader() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
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
              <span className="text-xl font-bold text-cyan-700">
                AI Visibility Analyzer
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/docs"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/changelog"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Changelog
            </Link>
          </nav>

          {/* Auth Buttons */}
          <AuthButtons />
        </div>
      </div>

      {/* Family Links */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-10 space-x-6 text-xs">
            <span className="text-gray-500">Part of:</span>
            <a
              href="https://redefinition.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Redefinition Tech
            </a>
            <a
              href="https://entitysignals.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Entity Signals
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
