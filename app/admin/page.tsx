import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import Link from "next/link";
import { checkAdminAuth } from "@/lib/admin-auth";
import { InitializeButton } from "./InitializeButton";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Check admin authentication first
  const isAdminAuth = await checkAdminAuth();
  if (!isAdminAuth) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  // Get table counts
  const { count: orgsCount } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true });

  const { count: runsCount } = await supabase
    .from("runs")
    .select("*", { count: "exact", head: true });

  const { count: queriesCount } = await supabase
    .from("queries")
    .select("*", { count: "exact", head: true });

  const { count: answersCount } = await supabase
    .from("answers")
    .select("*", { count: "exact", head: true });

  const { count: crawledPagesCount } = await supabase
    .from("crawled_pages")
    .select("*", { count: "exact", head: true });

  // Get recent logs (if any)
  const { data: recentLogs } = await supabase
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  // Get active scoring version
  const { data: activeVersion } = await supabase
    .from("scoring_weights")
    .select("*")
    .eq("is_active", true)
    .single();

  // Get all scoring versions
  const { data: allVersions } = await supabase
    .from("scoring_weights")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">System overview and management</p>
              </div>
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Database Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">System Overview</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
              <Link
                href="/admin/organizations"
                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6 hover:border-blue-300 hover:shadow-xl transition-all"
              >
                <div className="text-sm text-gray-600 mb-1">Organizations</div>
                <div className="text-3xl font-bold text-blue-600">{orgsCount || 0}</div>
                <div className="text-xs text-gray-500 mt-2">View all →</div>
              </Link>
              <Link
                href="/admin/runs"
                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6 hover:border-blue-300 hover:shadow-xl transition-all"
              >
                <div className="text-sm text-gray-600 mb-1">Runs</div>
                <div className="text-3xl font-bold text-blue-600">{runsCount || 0}</div>
                <div className="text-xs text-gray-500 mt-2">View all →</div>
              </Link>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
                <div className="text-sm text-gray-600 mb-1">Queries</div>
                <div className="text-3xl font-bold text-blue-600">{queriesCount || 0}</div>
                <div className="text-xs text-gray-500 mt-2">Provider calls</div>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
                <div className="text-sm text-gray-600 mb-1">Answers</div>
                <div className="text-3xl font-bold text-blue-600">{answersCount || 0}</div>
                <div className="text-xs text-gray-500 mt-2">AI responses</div>
              </div>
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
                <div className="text-sm text-gray-600 mb-1">Crawled Pages</div>
                <div className="text-3xl font-bold text-blue-600">{crawledPagesCount || 0}</div>
                <div className="text-xs text-gray-500 mt-2">Total analyzed</div>
              </div>
            </div>
          </div>

          {/* Scoring Versions */}
          <div className="mb-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Scoring Versions</h2>
                <Link
                  href="/admin/scoring/new"
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  Create New Version
                </Link>
              </div>

              {activeVersion && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-green-800">Active Version</div>
                      <div className="text-lg font-bold text-green-900">{activeVersion.scoring_version}</div>
                    </div>
                    <Link
                      href={`/admin/scoring/${activeVersion.id}`}
                      className="text-green-700 hover:text-green-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              )}

              {!activeVersion && allVersions?.length === 0 && (
                <InitializeButton />
              )}

              {!activeVersion && allVersions && allVersions.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
                  ⚠️ No active scoring version set. Activate one to start running scans.
                </div>
              )}

              {allVersions && allVersions.length > 0 ? (
                <div className="space-y-2">
                  {allVersions.map((version) => (
                    <div
                      key={version.id}
                      className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {version.scoring_version}
                            {version.is_active && (
                              <span className="ml-2 inline-flex px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Created {new Date(version.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Link
                          href={`/admin/scoring/${version.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Edit →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No scoring versions yet. Create your first version to begin.
                </div>
              )}
            </div>
          </div>

          {/* Recent Logs */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Logs</h2>
            {recentLogs && recentLogs.length > 0 ? (
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 border border-gray-200 rounded-lg text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          log.level === "error"
                            ? "bg-red-100 text-red-800"
                            : log.level === "warn"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {log.level}
                      </span>
                      <span className="text-gray-700">{log.message}</span>
                      <span className="text-gray-500 text-xs ml-auto">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No logs yet</div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
