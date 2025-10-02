"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container, Input } from "@/components/ui";

async function checkAuth() {
  const response = await fetch('/api/admin/check-auth');
  return response.ok;
}

export default function EditScoringVersionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [version, setVersion] = useState("");
  const [weights, setWeights] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      // Check admin auth first
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push('/admin/login');
        return;
      }

      // Load version data
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("scoring_weights")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        setVersion(data.scoring_version);
        setWeights(JSON.stringify(data.weights, null, 2));
        setIsActive(data.is_active || false);
      } catch (err: any) {
        setError(err.message || "Failed to load scoring version");
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [params.id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
          .neq("id", params.id)
          .eq("is_active", true);
      }

      // Update scoring version
      const { error: updateError } = await supabase
        .from("scoring_weights")
        .update({
          scoring_version: version,
          weights: parsedWeights,
          is_active: isActive,
        })
        .eq("id", params.id);

      if (updateError) throw updateError;

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update scoring version");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this scoring version?")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("scoring_weights")
        .delete()
        .eq("id", params.id);

      if (deleteError) throw deleteError;

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete scoring version");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <Container>
          <div className="text-center">Loading...</div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Scoring Version
            </h1>
            <p className="text-gray-600">Modify weights and configuration</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
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
                  disabled={saving}
                />
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
                  disabled={saving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  rows={20}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={saving}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Set as active version
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-6 py-3 border border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Delete
                </button>
                <div className="flex-1"></div>
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
