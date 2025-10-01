"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Container } from "@redefinition/ui";
import Link from "next/link";

export default function RunScanPage() {
  const router = useRouter();
  const params = useParams();
  const [urlBudget, setUrlBudget] = useState<number>(20);
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  URL Budget
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all">
                    <input
                      type="radio"
                      value={20}
                      checked={urlBudget === 20}
                      onChange={(e) => setUrlBudget(Number(e.target.value))}
                      className="w-4 h-4 text-blue-600"
                      disabled={loading}
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-gray-900">Starter - 20 URLs</div>
                      <div className="text-sm text-gray-600">Quick overview scan</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all">
                    <input
                      type="radio"
                      value={60}
                      checked={urlBudget === 60}
                      onChange={(e) => setUrlBudget(Number(e.target.value))}
                      className="w-4 h-4 text-blue-600"
                      disabled={loading}
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-gray-900">Standard - 60 URLs</div>
                      <div className="text-sm text-gray-600">Recommended for most sites</div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-all">
                    <input
                      type="radio"
                      value={150}
                      checked={urlBudget === 150}
                      onChange={(e) => setUrlBudget(Number(e.target.value))}
                      className="w-4 h-4 text-blue-600"
                      disabled={loading}
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-gray-900">Comprehensive - 150 URLs</div>
                      <div className="text-sm text-gray-600">Deep analysis for larger sites</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-sm text-blue-800">
                  <strong>What happens during a scan:</strong>
                  <ul className="mt-2 space-y-1 list-disc list-inside">
                    <li>Fetch robots.txt and sitemap</li>
                    <li>Crawl up to {urlBudget} pages from your website</li>
                    <li>Analyze content quality and technical structure</li>
                    <li>Check authority and trust signals</li>
                    <li>Generate comprehensive GEO score</li>
                  </ul>
                </div>
              </div>

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
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? "Starting Scan..." : "Start Scan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}

