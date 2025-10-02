import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Container } from "@/components/ui";
import Link from "next/link";
import { BatchDeleteButton } from "./BatchDeleteButton";

export const dynamic = 'force-dynamic';

export default async function OrganizationPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get organization
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", params.id)
    .single();

  if (orgError || !org) {
    notFound();
  }

  // Get runs for this organization
  const { data: runs } = await supabase
    .from("runs")
    .select("*")
    .eq("org_id", params.id)
    .order("started_at", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {org.brand_name}
                </h1>
                <p className="text-gray-600 mb-2">{org.domain}</p>
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {org.industry}
                </div>
              </div>
              <Link
                href={`/dashboard/organizations/${params.id}/run`}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
              >
                Run New Scan
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">Total Scans</div>
              <div className="text-3xl font-bold text-gray-900">
                {runs?.length || 0}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">Latest Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {runs?.[0]?.total_score
                  ? Math.round(runs[0].total_score)
                  : "—"}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">Readiness</div>
              <div className="text-lg font-semibold text-gray-900">
                {runs?.[0]?.readiness_rank || "Not assessed"}
              </div>
            </div>
          </div>

          {/* Recent Runs */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Scans
              </h2>
              {runs && runs.length > 0 && (
                <BatchDeleteButton 
                  orgId={params.id} 
                  runIds={runs.map(r => r.id)} 
                />
              )}
            </div>

            {!runs || runs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No scans yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Run your first scan to get your GEO score and insights
                </p>
                <Link
                  href={`/dashboard/organizations/${params.id}/run`}
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  Run First Scan
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {runs.map((run) => (
                  <Link
                    key={run.id}
                    href={`/dashboard/organizations/${params.id}/runs/${run.id}`}
                    className="block p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="text-2xl font-bold text-blue-600">
                            {run.total_score
                              ? Math.round(run.total_score)
                              : "—"}
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                run.status === "done"
                                  ? "bg-green-100 text-green-800"
                                  : run.status === "running"
                                  ? "bg-blue-100 text-blue-800"
                                  : run.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {run.status}
                            </span>
                            {run.readiness_rank && (
                              <span className="text-sm text-gray-600">
                                {run.readiness_rank}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Started{" "}
                          {new Date(run.started_at).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(run.started_at).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {run.url_budget} URLs · v{run.scoring_version}
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
