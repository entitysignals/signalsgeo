"use client";

import { useState } from "react";

interface PillarDetailsProps {
  pillarName: string;
  pages?: any[];
  queries?: any[];
}

export function PillarDetails({ pillarName, pages, queries }: PillarDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const renderContentQualityDetails = () => {
    if (!pages || pages.length === 0) return <p className="text-sm text-gray-500">No data available</p>;

    // Aggregate statistics
    const stats = {
      faq: pages.filter(p => p.passed_checks?.faq_present).length,
      questions: pages.filter(p => p.passed_checks?.question_headings).length,
      bylines: pages.filter(p => p.passed_checks?.byline_present).length,
      dates: pages.filter(p => p.passed_checks?.updated_date_present).length,
      citations: pages.filter(p => p.passed_checks?.outbound_citations_present).length,
      internal: pages.filter(p => p.passed_checks?.internal_linking_ok).length,
    };
    const total = pages.length;

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">Content Analysis Summary:</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">FAQ or Q&A Content</span>
            <span className={`font-medium ${stats.faq > total/2 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.faq}/{total} pages
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Question-style Headings</span>
            <span className={`font-medium ${stats.questions > total/2 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.questions}/{total} pages
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Author Bylines</span>
            <span className={`font-medium ${stats.bylines > total/2 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.bylines}/{total} pages
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Updated Dates</span>
            <span className={`font-medium ${stats.dates > total/2 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.dates}/{total} pages
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">External Citations</span>
            <span className={`font-medium ${stats.citations > total/2 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.citations}/{total} pages
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 italic mt-3">
          AI engines favor content with Q&A format, expertise signals (bylines, dates), and authoritative citations.
        </p>
      </div>
    );
  };

  const renderTechnicalDetails = () => {
    if (!pages || pages.length === 0) return <p className="text-sm text-gray-500">No data available</p>;

    // Aggregate statistics
    const stats = {
      orgSchema: pages.filter(p => p.passed_checks?.org_schema_present).length,
      websiteSchema: pages.filter(p => p.passed_checks?.website_schema_present).length,
      productSchema: pages.filter(p => p.passed_checks?.product_service_schema_present).length,
      canonical: pages.filter(p => p.passed_checks?.canonical_ok).length,
      altText: pages.filter(p => p.passed_checks?.alt_text_ok).length,
      jsLow: pages.filter(p => p.passed_checks?.js_dependence_level === 'low').length,
      jsMed: pages.filter(p => p.passed_checks?.js_dependence_level === 'medium').length,
    };
    const total = pages.length;

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">Technical SEO Summary:</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Organization Schema</span>
            <span className={`font-medium ${stats.orgSchema > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.orgSchema > 0 ? '✓ Present' : '✗ Missing'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Website Schema</span>
            <span className={`font-medium ${stats.websiteSchema > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.websiteSchema > 0 ? '✓ Present' : '✗ Missing'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Product/Service Schema</span>
            <span className={`font-medium ${stats.productSchema > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.productSchema > 0 ? '✓ Present' : '✗ Missing'}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Canonical Tags</span>
            <span className={`font-medium ${stats.canonical > total/2 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.canonical}/{total} pages
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">Image Alt Text</span>
            <span className={`font-medium ${stats.altText > total/2 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.altText}/{total} pages
            </span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-700">JavaScript Dependence</span>
            <span className={`font-medium ${stats.jsLow > total/2 ? 'text-green-600' : 'text-yellow-600'}`}>
              {stats.jsLow} low, {stats.jsMed} medium, {total - stats.jsLow - stats.jsMed} high
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 italic mt-3">
          Schema markup helps AI engines understand your business. Low JS dependence ensures content is crawlable.
        </p>
      </div>
    );
  };

  const renderAuthorityDetails = () => {
    if (!queries || queries.length === 0) return <p className="text-sm text-gray-500">No data available</p>;

    const allAnswers = queries.flatMap(q => q.answers || []);
    const brandMentions = allAnswers.filter(a => a.features?.brand_mentioned);
    const selfCitations = allAnswers.filter(a => a.features?.self_cited);
    const tierAPresent = allAnswers.filter(a => a.features?.tier_a_present);

    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Authority Signals:</p>
        <ul className="space-y-2 text-xs">
          <li className="flex items-center gap-2">
            <span className="text-gray-700">Brand Mentioned:</span>
            <span className="font-medium">{brandMentions.length}/{allAnswers.length} AI responses</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-700">Self-Cited:</span>
            <span className="font-medium">{selfCitations.length}/{allAnswers.length} AI responses</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-700">Tier A Sources Present:</span>
            <span className="font-medium">{tierAPresent.length}/{allAnswers.length} AI responses</span>
          </li>
        </ul>
        <p className="text-xs text-gray-500 mt-2">
          Tier A sources: Wikipedia, .gov, .edu, major news outlets
        </p>
      </div>
    );
  };

  const renderAIVisibilityDetails = () => {
    if (!queries || queries.length === 0) return <p className="text-sm text-gray-500">No data available</p>;

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">AI Query Performance by Scenario:</p>
        <div className="space-y-3 text-xs">
          {queries.map((query, idx) => {
            const answers = query.answers || [];
            const perplexity = answers.find((a: any) => a.provider === 'perplexity');
            const gemini = answers.find((a: any) => a.provider === 'gemini');
            
            return (
              <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
                <div className="font-medium text-gray-900 mb-2">{query.scenario_title}</div>
                <div className="space-y-1 ml-2">
                  <div className="flex items-center gap-2">
                    <span className={perplexity?.features?.brand_mentioned ? 'text-green-600' : 'text-red-600'}>
                      {perplexity?.features?.brand_mentioned ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-700">🤖 Perplexity AI</span>
                    {perplexity?.features?.self_cited && (
                      <span className="text-xs text-blue-600">(cited your domain)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={gemini?.features?.brand_mentioned ? 'text-green-600' : 'text-red-600'}>
                      {gemini?.features?.brand_mentioned ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-700">✨ Google Gemini</span>
                    {gemini?.features?.self_cited && (
                      <span className="text-xs text-blue-600">(cited your domain)</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 italic mt-3">
          These results show how AI engines respond to common user queries about your brand across different scenarios.
        </p>
      </div>
    );
  };

  const formatCheckName = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace('Ok', '')
      .replace('Present', '✓');
  };

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
      >
        {isOpen ? '▼' : '▶'} View scoring details
      </button>
      
      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {pillarName === 'Content Quality' && renderContentQualityDetails()}
          {pillarName === 'Technical Foundation' && renderTechnicalDetails()}
          {pillarName === 'Authority & Trust' && renderAuthorityDetails()}
          {pillarName === 'AI Discoverability' && renderAIVisibilityDetails()}
        </div>
      )}
    </div>
  );
}

