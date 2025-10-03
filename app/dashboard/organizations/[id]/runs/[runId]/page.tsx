import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Container } from "@/components/ui";
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

  // Get AI queries and answers
  const { data: queries, error: queriesError } = await supabase
    .from("queries")
    .select(`
      *,
      answers(*)
    `)
    .eq("run_id", params.runId)
    .order("scenario_key");

  // Get metrics (score breakdown)
  const { data: metrics, error: metricsError } = await supabase
    .from("metrics")
    .select("*")
    .eq("run_id", params.runId)
    .single();

  // Helper to get status color
  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 70) return "✓";
    if (percentage >= 40) return "⚠️";
    return "🔴";
  };

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
                  AI Visibility Report
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

          {/* Queued Status */}
          {run.status === "queued" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="animate-pulse text-2xl">⏳</div>
                <div>
                  <div className="font-semibold text-yellow-900">Queued for Processing</div>
                  <div className="text-sm text-yellow-700">
                    Your scan is queued and will start shortly.
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
                  <div className="font-semibold text-blue-900">Analysis in Progress</div>
                  <div className="text-sm text-blue-700">
                    Crawling pages and querying AI search engines... This page will auto-refresh.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hero Score Card */}
          {metrics && run.status === "done" && (
            <>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-10 mb-8 text-white">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-3">
                    {Math.round(run.total_score || 0)}<span className="text-3xl text-blue-200">/100</span>
                  </div>
                  <div className="text-2xl font-semibold mb-2">{run.readiness_rank || "Calculating..."}</div>
                  <div className="text-blue-100 text-lg">AI Visibility Readiness</div>
                </div>
              </div>

              {/* Issues & Action Items */}
              <div className="space-y-6 mb-8">
                {/* Content Quality */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getScoreIcon(metrics.content_quality_score || 0, 40)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Content Quality</h3>
                        <p className={`text-3xl font-bold ${getScoreColor(metrics.content_quality_score || 0, 40)}`}>
                          {Math.round(metrics.content_quality_score || 0)}/40
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium text-gray-900">Issues Identified:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {(metrics.content_quality_score || 0) < 28 && (
                        <>
                          <li>Missing conversational Q&A content structure</li>
                          <li>Limited expertise and authority signals detected</li>
                          <li>Heading hierarchy needs optimization</li>
                        </>
                      )}
                      {(metrics.content_quality_score || 0) >= 28 && (metrics.content_quality_score || 0) < 35 && (
                        <>
                          <li>Some content quality gaps remain</li>
                          <li>Additional expertise signals needed</li>
                        </>
                      )}
                      {(metrics.content_quality_score || 0) >= 35 && <li>Good foundation - minor improvements possible</li>}
                    </ul>
                    <Link href="https://entitysignals.com/contact" target="_blank" className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Get content strategy help →
                    </Link>
                  </div>
                </div>

                {/* Technical Foundation */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getScoreIcon(metrics.technical_foundation_score || 0, 20)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Technical Foundation</h3>
                        <p className={`text-3xl font-bold ${getScoreColor(metrics.technical_foundation_score || 0, 20)}`}>
                          {Math.round(metrics.technical_foundation_score || 0)}/20
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium text-gray-900">Issues Identified:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {(metrics.technical_foundation_score || 0) < 14 && (
                        <>
                          <li>Critical schema markup gaps detected</li>
                          <li>Crawlability and indexing concerns</li>
                          <li>Page speed optimization needed</li>
                        </>
                      )}
                      {(metrics.technical_foundation_score || 0) >= 14 && (metrics.technical_foundation_score || 0) < 17 && (
                        <>
                          <li>Some technical SEO improvements needed</li>
                          <li>Schema markup can be enhanced</li>
                        </>
                      )}
                      {(metrics.technical_foundation_score || 0) >= 17 && <li>Strong technical foundation - keep maintaining</li>}
                    </ul>
                    <Link href="https://entitysignals.com/contact" target="_blank" className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Get technical audit →
                    </Link>
                  </div>
                </div>

                {/* Authority & Trust */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getScoreIcon(metrics.authority_trust_score || 0, 15)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Authority & Trust</h3>
                        <p className={`text-3xl font-bold ${getScoreColor(metrics.authority_trust_score || 0, 15)}`}>
                          {Math.round(metrics.authority_trust_score || 0)}/15
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium text-gray-900">Issues Identified:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {(metrics.authority_trust_score || 0) < 10 && (
                        <>
                          <li>Low presence in AI citation results</li>
                          <li>Trust signals need strengthening</li>
                          <li>Authority building opportunities missed</li>
                        </>
                      )}
                      {(metrics.authority_trust_score || 0) >= 10 && (metrics.authority_trust_score || 0) < 13 && (
                        <>
                          <li>Moderate authority signals present</li>
                          <li>Citation opportunities exist</li>
                        </>
                      )}
                      {(metrics.authority_trust_score || 0) >= 13 && <li>Good authority presence - continue building</li>}
                    </ul>
                    <Link href="https://entitysignals.com/contact" target="_blank" className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Learn authority building strategies →
                    </Link>
                  </div>
                </div>

                {/* AI Visibility */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getScoreIcon(metrics.prompt_scenarios_score || 0, 25)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">AI Visibility</h3>
                        <p className={`text-3xl font-bold ${getScoreColor(metrics.prompt_scenarios_score || 0, 25)}`}>
                          {Math.round(metrics.prompt_scenarios_score || 0)}/25
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-700">
                    <p className="font-medium text-gray-900">Issues Identified:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {(metrics.prompt_scenarios_score || 0) < 17 && (
                        <>
                          <li>Brand mentioned in limited scenarios</li>
                          <li>Competitors dominating AI search results</li>
                          <li>Self-citation opportunities being missed</li>
                        </>
                      )}
                      {(metrics.prompt_scenarios_score || 0) >= 17 && (metrics.prompt_scenarios_score || 0) < 21 && (
                        <>
                          <li>Moderate AI presence established</li>
                          <li>Room for visibility improvements</li>
                        </>
                      )}
                      {(metrics.prompt_scenarios_score || 0) >= 21 && <li>Strong AI visibility - maintain and expand</li>}
                    </ul>
                    <Link href="https://entitysignals.com/contact" target="_blank" className="inline-block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Improve your AI presence →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main CTA */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-10 text-center text-white mb-8">
                <h2 className="text-3xl font-bold mb-4">Ready to Dominate AI Search Results?</h2>
                <p className="text-xl text-indigo-100 mb-6 max-w-2xl mx-auto">
                  Get a personalized GEO (Generative Engine Optimization) strategy tailored to your business goals.
                </p>
                <Link 
                  href="https://entitysignals.com/contact" 
                  target="_blank"
                  className="inline-block bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg shadow-lg"
                >
                  Schedule Your Free Consultation →
                </Link>
                <p className="text-sm text-indigo-200 mt-4">Limited spots available for Q4 2025</p>
              </div>

              {/* Collapsible: Detailed AI Analysis */}
              <details className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
                <summary className="cursor-pointer p-6 font-semibold text-lg text-gray-900 hover:bg-gray-50 rounded-t-2xl">
                  📊 View Detailed AI Analysis ({queries?.length || 0} scenarios tested)
                </summary>
                <div className="p-6 border-t border-gray-200 space-y-6">
                  {queries && queries.map((query: any) => (
                    <div key={query.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <h4 className="font-bold text-gray-900 mb-3">{query.scenario_title || query.scenario_key}</h4>
                      <div className="text-sm text-gray-600 mb-4 italic">"{query.prompt}"</div>
                      
                      {query.answers && query.answers.map((answer: any) => (
                        <div key={answer.id} className="mb-4 pl-4 border-l-2 border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-700">
                              {answer.provider === 'perplexity' ? '🤖 Perplexity AI' : '🦁 Brave Search'}
                            </span>
                            {answer.features?.brand_mentioned && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">✓ Brand Mentioned</span>
                            )}
                            {answer.features?.self_cited && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">✓ Self Cited</span>
                            )}
                            {answer.features?.tier_a_present && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">✓ Authority Source</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{stripHtml(answer.answer_text?.substring(0, 300) || '')}...</p>
                          {answer.citations && answer.citations.length > 0 && (
                            <div className="text-xs text-gray-500">
                              Citations: {answer.citations.map((c: any) => c.domain).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </details>

              {/* Collapsible: Crawled Pages */}
              <details className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <summary className="cursor-pointer p-6 font-semibold text-lg text-gray-900 hover:bg-gray-50 rounded-t-2xl">
                  🔍 View Crawled Pages ({pages?.length || 0} pages analyzed)
                </summary>
                <div className="p-6 border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-700">Checks Passed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pages && pages.map((page: any) => {
                          const totalChecks = Object.keys(page.passed_checks || {}).length;
                          const passedChecks = Object.values(page.passed_checks || {}).filter(v => v === true).length;
                          return (
                            <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-blue-600 font-mono text-xs">{page.url}</td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-block px-2 py-1 rounded text-xs ${
                                  page.status_code === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {page.status_code}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center font-medium">
                                {passedChecks}/{totalChecks}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
