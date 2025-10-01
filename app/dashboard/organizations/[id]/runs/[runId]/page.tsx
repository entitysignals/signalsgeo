import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Container } from "@redefinition/ui";
import Link from "next/link";
import { AutoRefresh } from "./AutoRefresh";
import { DeleteButton } from "./DeleteButton";

export const dynamic = 'force-dynamic';

export default async function RunResultsPage({
  params,
}: {
  params: { id: string; runId: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get run details
  const { data: run, error: runError } = await supabase
    .from("runs")
    .select("*, organizations(brand_name, domain)")
    .eq("id", params.runId)
    .single();

  if (runError || !run) {
    notFound();
  }

  // Get crawled pages
  const { data: pages, error: pagesError } = await supabase
    .from("crawled_pages")
    .select("*")
    .eq("run_id", params.runId)
    .order("url");

  if (pagesError) {
    console.error("Pages fetch error:", pagesError);
  }

  // Get AI queries and answers
  const { data: queries, error: queriesError } = await supabase
    .from("queries")
    .select(`
      *,
      answers(*)
    `)
    .eq("run_id", params.runId)
    .order("scenario_key");

  if (queriesError) {
    console.error("Queries fetch error:", queriesError);
  }

  // Get metrics (score breakdown)
  const { data: metrics, error: metricsError } = await supabase
    .from("metrics")
    .select("*")
    .eq("run_id", params.runId)
    .single();

  if (metricsError) {
    console.error("Metrics fetch error:", metricsError);
  }

  console.log("Run ID:", params.runId);
  console.log("Pages count:", pages?.length || 0);
  console.log("Queries count:", queries?.length || 0);
  console.log("Metrics:", metrics);

  // Helper function to strip HTML tags
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="min-h-screen py-12">
      <AutoRefresh status={run.status} hasScore={!!run.total_score} />
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex gap-4 mb-4">
              <Link
                href="/dashboard"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ← Dashboard
              </Link>
              <Link
                href={`/dashboard/organizations/${params.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                ← Organization
              </Link>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Scan Results
                </h1>
                <p className="text-gray-600">
                  {run.organizations?.brand_name} • {run.organizations?.domain}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex px-4 py-2 rounded-xl text-sm font-medium ${
                    run.status === "done"
                      ? "bg-green-100 text-green-800"
                      : run.status === "running"
                      ? "bg-blue-100 text-blue-800"
                      : run.status === "queued"
                      ? "bg-yellow-100 text-yellow-800"
                      : run.status === "failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {run.status === "running" && "🔄 "}
                  {run.status === "queued" && "⏳ "}
                  {run.status.charAt(0).toUpperCase() + run.status.slice(1)}
                </span>
                <DeleteButton runId={params.runId} orgId={params.id} />
              </div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid gap-6 md:grid-cols-5 mb-8">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">URL Budget</div>
              <div className="text-3xl font-bold text-blue-600">{run.url_budget}</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">Pages Crawled</div>
              <div className="text-3xl font-bold text-blue-600">{pages?.length || 0}</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">AI Queries</div>
              <div className="text-3xl font-bold text-blue-600">{queries?.length || 0}/6</div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">Score</div>
              <div className="text-3xl font-bold text-blue-600">
                {run.total_score ? Math.round(run.total_score) : "—"}
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-6">
              <div className="text-sm text-gray-600 mb-1">Readiness</div>
              <div className="text-sm font-semibold text-gray-900">
                {run.readiness_rank || "Calculating..."}
              </div>
            </div>
          </div>

          {/* Queued Status */}
          {run.status === "queued" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="animate-pulse text-2xl">⏳</div>
                <div>
                  <div className="font-semibold text-yellow-900">Queued for Processing</div>
                  <div className="text-sm text-yellow-700">
                    Your scan is queued and will start shortly. Make sure the background worker is running.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Running Status */}
          {run.status === "running" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <div>
                  <div className="font-semibold text-blue-900">Scan in Progress</div>
                  <div className="text-sm text-blue-700">
                    Crawling pages and analyzing content... This page will auto-refresh.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score Breakdown */}
          {metrics && run.status === "done" && (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Score Breakdown</h2>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 font-semibold mb-1">Content Quality</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {Math.round(metrics.content_quality_score || 0)}<span className="text-sm text-blue-500">/40</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {Math.round((metrics.content_quality_score / 40) * 100)}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="text-xs text-green-600 font-semibold mb-1">Technical Foundation</div>
                  <div className="text-2xl font-bold text-green-700">
                    {Math.round(metrics.technical_foundation_score || 0)}<span className="text-sm text-green-500">/20</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    {Math.round((metrics.technical_foundation_score / 20) * 100)}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="text-xs text-purple-600 font-semibold mb-1">Authority & Trust</div>
                  <div className="text-2xl font-bold text-purple-700">
                    {Math.round(metrics.authority_trust_score || 0)}<span className="text-sm text-purple-500">/15</span>
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {Math.round((metrics.authority_trust_score / 15) * 100)}%
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                  <div className="text-xs text-orange-600 font-semibold mb-1">AI Visibility</div>
                  <div className="text-2xl font-bold text-orange-700">
                    {Math.round(metrics.prompt_scenarios_score || 0)}<span className="text-sm text-orange-500">/25</span>
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    {Math.round((metrics.prompt_scenarios_score / 25) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Query Results */}
          {queries && queries.length > 0 && (
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Visibility Results</h2>
              <p className="text-gray-600 mb-6">
                How AI search engines respond when users ask about your brand
              </p>

              <div className="space-y-6">
                {queries.map((query: any) => {
                  const scenarioTitles: Record<string, string> = {
                    s1: "Brand Overview",
                    s2: "Trust & Legitimacy",
                    s3: "Products & Services",
                    s4: "Pricing & Offers",
                    s5: "Locations & Hours",
                    s6: "Contact & Booking",
                  };

                  return (
                    <div key={query.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {scenarioTitles[query.scenario_key] || query.scenario_key}
                        </h3>
                        <p className="text-sm text-gray-600 italic">"{query.prompt}"</p>
                      </div>

                      {query.answers && query.answers.length > 0 ? (
                        <div className="space-y-4">
                          {query.answers.map((answer: any) => {
                            const features = answer.features as any;
                            return (
                              <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold text-gray-700">
                                    {answer.provider === "perplexity" ? "🤖 Perplexity AI" : "🦁 Brave Search"}
                                  </span>
                                  <div className="flex gap-2">
                                    {features?.brand_mentioned && (
                                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        ✓ Brand Mentioned
                                      </span>
                                    )}
                                    {features?.self_cited && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        ✓ Site Cited
                                      </span>
                                    )}
                                    {features?.tier_a_present && (
                                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                        ✓ Authority Source
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">
                                  {stripHtml(answer.answer_text).substring(0, 300)}
                                  {stripHtml(answer.answer_text).length > 300 && "..."}
                                </p>
                                {answer.citations && answer.citations.length > 0 && (
                                  <div className="text-xs text-gray-600">
                                    <strong>Citations:</strong>{" "}
                                    {answer.citations.slice(0, 3).map((c: any, i: number) => (
                                      <span key={i}>
                                        {i > 0 && ", "}
                                        {c.domain}
                                      </span>
                                    ))}
                                    {answer.citations.length > 3 && ` +${answer.citations.length - 3} more`}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No AI responses yet</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Crawled Pages */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Crawled Pages</h2>

            {pages && pages.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Checks Passed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map((page) => {
                      const checks = page.passed_checks as any;
                      const passedCount = checks ? Object.values(checks).filter(Boolean).length : 0;
                      const totalChecks = checks ? Object.keys(checks).length : 0;

                      return (
                        <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600 max-w-md truncate">
                            {page.url}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                              page.status === 200
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {page.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {passedCount}/{totalChecks}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {run.status === "running" ? "Crawling pages..." : "No pages crawled yet"}
              </div>
            )}
          </div>

        </div>
      </Container>
    </div>
  );
}
