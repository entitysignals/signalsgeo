"use client";
import { Container, Input } from "@/components/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [domain, setDomain] = useState("");

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to signup page (lead magnet)
    router.push("/auth/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-transparent to-cyan-50/30">
      {/* Main Platform Interface */}
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            {/* Platform Header */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Discover Your AI Readiness Score
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                See how your website performs in AI-powered search results and answer engines
              </p>
            </div>

            {/* Auth CTAs - Above Search */}
            <div className="flex justify-center gap-4 mb-8">
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Login
              </Link>
            </div>

            {/* Analysis Form - Lead Magnet */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 mb-8">
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Enter your website to see a preview
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter your website (e.g., example.com)"
                      value={domain}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
                      className="text-lg py-4 text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 min-w-[140px]"
                  >
                    Analyze Now
                  </button>
                </div>
                <div className="text-xs text-center text-gray-500">
                  Free account required • Get results in minutes
                </div>
              </form>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-4 text-center mb-12">
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">🤖</div>
                <div className="font-semibold text-gray-900 mb-2">AI Discoverability</div>
                <div className="text-sm text-gray-600">How AI engines see your brand</div>
              </div>
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">📝</div>
                <div className="font-semibold text-gray-900 mb-2">Content Quality</div>
                <div className="text-sm text-gray-600">AI-ready content analysis</div>
              </div>
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">🔧</div>
                <div className="font-semibold text-gray-900 mb-2">Technical Structure</div>
                <div className="text-sm text-gray-600">Performance & crawlability</div>
              </div>
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">🏆</div>
                <div className="font-semibold text-gray-900 mb-2">Authority & Trust Signals</div>
                <div className="text-sm text-gray-600">Citations & reputation</div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Join businesses optimizing for the AI-powered search era
              </p>
              <Link
                href="/auth/signup"
                className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 text-lg"
              >
                Start Your Free Analysis
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}


