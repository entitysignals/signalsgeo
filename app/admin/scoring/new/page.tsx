"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container, Input } from "@/components/ui";

async function checkAuth() {
  const response = await fetch('/api/admin/check-auth');
  return response.ok;
}

const DEFAULT_WEIGHTS = {
  contentQuality: {
    total: 40,
    conversationalTone: 8,
    qaContent: 8,
    headingStructure: 6,
    expertiseSignals: 6,
    accuracyEvidence: 4,
    semanticRichness: 4,
    entityClarity: 4,
  },
  technicalFoundation: {
    total: 20,
    jsDependenceMin: 8,
    pageSpeed: 4,
    structuredData: 3,
    crawlabilityHealth: 3,
    contentAccessibility: 2,
  },
  authorityTrust: {
    total: 15,
    citationWorthiness: 7,
    domainAuthority: 5,
    socialProof: 1,
    trustIndicators: 2,
  },
  promptScenarios: {
    total: 25,
    perScenario: 4.17,
    mentionCoverage: 2.0,
    selfPresence: 1.3,
    citationQuality: 0.6,
    competitorShare: 0.27,
  },
};

export default function NewScoringVersionPage() {
  const router = useRouter();
  const [version, setVersion] = useState("");
  const [weights, setWeights] = useState(JSON.stringify(DEFAULT_WEIGHTS, null, 2));
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth().then(isAuth => {
      if (!isAuth) router.push('/admin/login');
    });
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Validate JSON
      let parsedWeights;
      try {
        parsedWeights = JSON.parse(weights);
      } catch (err) {
        throw new Error("Invalid JSON format for weights");
      }

      // If setting as active, deactivate all others first
      if (isActive) {
        await supabase
          .from("scoring_weights")
          .update({ is_active: false })
          .eq("is_active", true);
      }

      // Create new scoring version
      const { error: createError } = await supabase
        .from("scoring_weights")
        .insert({
          scoring_version: version,
          weights: parsedWeights,
          is_active: isActive,
        });

      if (createError) throw createError;

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create scoring version");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Scoring Version
            </h1>
            <p className="text-gray-600">
              Define a new scoring version with custom weights
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            <form onSubmit={handleCreate} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="version"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Version Name
                </label>
                <Input
                  id="version"
                  type="text"
                  value={version}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setVersion(e.target.value)
                  }
                  required
                  disabled={loading}
                  placeholder="v1.0"
                />
                <p className="mt-1 text-sm text-gray-500">
                  e.g., v1.0, v1.1, v2.0-beta
                </p>
              </div>

              <div>
                <label
                  htmlFor="weights"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Weights Configuration (JSON)
                </label>
                <textarea
                  id="weights"
                  value={weights}
                  onChange={(e) => setWeights(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  rows={20}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Must be valid JSON. See default template above.
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Set as active version (will deactivate current active version)
                </label>
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
                  {loading ? "Creating..." : "Create Version"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
