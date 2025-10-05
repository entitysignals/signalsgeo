"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container } from "@/components/ui";
import Link from "next/link";

export default function RunScanPage() {
  const router = useRouter();
  const params = useParams();
  const [urlBudget, setUrlBudget] = useState<number>(35); // Smart default: 35 pages
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: params.id,
          urlBudget,
          locale: 'en-CA'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start scan');
      }

      // Redirect to the run details page
      router.push(`/dashboard/organizations/${params.id}/runs/${data.runId}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to start scan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              href={`/dashboard/organizations/${params.id}`}
              className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
            >
              ← Back to Organization
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Run New Scan
            </h1>
            <p className="text-gray-600">
              Configure and start a new GEO analysis
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            <form onSubmit={handleRunScan} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                  {error}
                </div>
              )}

              {/* Main Info Box */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">🤖</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2">Smart AI Visibility Scan</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Our intelligent crawler will automatically find and analyze your most important pages:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1 ml-4">
                      <li>✓ <strong>Priority 1:</strong> Homepage, About, Contact, Products/Services, FAQ, Pricing</li>
                      <li>✓ <strong>Priority 2:</strong> Team, Case Studies, Testimonials, Resources</li>
                      <li>✓ <strong>Priority 3:</strong> Blog posts and news articles (if space allows)</li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-3 italic">
                      Default: {urlBudget} pages • Scans complete in 3-5 minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Advanced Options - Collapsed by default */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-700">
                    ⚙️ Advanced Options
                  </span>
                  <span className="text-gray-500 text-sm">
                    {showAdvanced ? '▲ Hide' : '▼ Show'}
                  </span>
                </button>

                {showAdvanced && (
                  <div className="p-5 bg-white border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-4">
                      <strong>Why customize page limits?</strong> Most users don't need to change this. 
                      However, if you have a very small site (under 10 pages) or a massive site (200+ pages), 
                      you can adjust the scan depth. Smaller scans are faster but may miss pages. 
                      Larger scans take longer but cover more ground.
                    </p>

                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Page Scan Limit
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all">
                        <input
                          type="radio"
                          value={15}
                          checked={urlBudget === 15}
                          onChange={(e) => setUrlBudget(Number(e.target.value))}
                          className="w-4 h-4 text-blue-600"
                          disabled={loading}
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-semibold text-gray-900 text-sm">Quick - 15 Pages</div>
                          <div className="text-xs text-gray-600">For very small sites or quick tests</div>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border-2 border-blue-400 bg-blue-50 rounded-lg cursor-pointer">
                        <input
                          type="radio"
                          value={35}
                          checked={urlBudget === 35}
                          onChange={(e) => setUrlBudget(Number(e.target.value))}
                          className="w-4 h-4 text-blue-600"
                          disabled={loading}
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-semibold text-gray-900 text-sm">Smart Default - 35 Pages ⭐</div>
                          <div className="text-xs text-gray-600">Recommended • Covers all critical pages</div>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all">
                        <input
                          type="radio"
                          value={60}
                          checked={urlBudget === 60}
                          onChange={(e) => setUrlBudget(Number(e.target.value))}
                          className="w-4 h-4 text-blue-600"
                          disabled={loading}
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-semibold text-gray-900 text-sm">Extended - 60 Pages</div>
                          <div className="text-xs text-gray-600">For medium-sized sites with many sections</div>
                        </div>
                      </label>

                      <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all">
                        <input
                          type="radio"
                          value={100}
                          checked={urlBudget === 100}
                          onChange={(e) => setUrlBudget(Number(e.target.value))}
                          className="w-4 h-4 text-blue-600"
                          disabled={loading}
                        />
                        <div className="ml-3 flex-1">
                          <div className="font-semibold text-gray-900 text-sm">Deep - 100 Pages</div>
                          <div className="text-xs text-gray-600">For large sites or comprehensive audits</div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                >
                  {loading ? "🚀 Starting Scan..." : "🚀 Analyze Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}