import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui";
import Link from "next/link";
import { checkAdminAuth } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export default async function AdminRunsPage() {
  const isAdminAuth = await checkAdminAuth();
  if (!isAdminAuth) {
    redirect("/admin/login");
  }

  const supabase = await createClient();

  // Get all runs with organization info
  const { data: runs, error } = await supabase
    .from("runs")
    .select("*, organizations(brand_name, domain)")
    .order("started_at", { ascending: false })
    .limit(50);

  return (
    <div className="min-h-screen py-12">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin"
              className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
            >
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Runs</h1>
            <p className="text-gray-600">System-wide scan history (last 50)</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm mb-6">
                Error loading runs: {error.message}
              </div>
            )}

            {runs && runs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Organization</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">URLs</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Version</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Started</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs.map((run) => (
                      <tr key={run.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-900">
                            {run.organizations?.brand_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {run.organizations?.domain || ''}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
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
                        </td>
                        <td className="py-3 px-4 font-bold text-blue-600">
                          {run.total_score ? Math.round(run.total_score) : "—"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {run.readiness_rank || "—"}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{run.url_budget}</td>
                        <td className="py-3 px-4 text-xs text-gray-500">{run.scoring_version}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(run.started_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No runs in the system yet
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
