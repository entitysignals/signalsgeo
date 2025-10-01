"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container, Input } from "@/components/ui";

export default function NewOrganizationPage() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [domain, setDomain] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Normalize domain - remove protocol if present, just store domain
      let normalizedDomain = domain.trim();
      normalizedDomain = normalizedDomain.replace(/^https?:\/\//, '');
      normalizedDomain = normalizedDomain.replace(/\/$/, ''); // Remove trailing slash

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          owner_user_id: user.id,
          brand_name: brandName,
          domain: normalizedDomain,
          industry: industry,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create org membership
      const { error: memberError } = await supabase
        .from("org_members")
        .insert({
          org_id: org.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) throw memberError;

      router.push(`/dashboard/organizations/${org.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create Organization
            </h1>
            <p className="text-gray-600">
              Set up your organization to start analyzing your website
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
                  htmlFor="brandName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Brand Name
                </label>
                <Input
                  id="brandName"
                  type="text"
                  value={brandName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBrandName(e.target.value)
                  }
                  required
                  disabled={loading}
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <label
                  htmlFor="domain"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Domain
                </label>
                <Input
                  id="domain"
                  type="text"
                  value={domain}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDomain(e.target.value)
                  }
                  required
                  disabled={loading}
                  placeholder="example.com"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter your website domain (e.g., example.com)
                </p>
              </div>

              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Industry
                </label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Retail">Retail</option>
                  <option value="Education">Education</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
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
                  {loading ? "Creating..." : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </div>
  );
}
