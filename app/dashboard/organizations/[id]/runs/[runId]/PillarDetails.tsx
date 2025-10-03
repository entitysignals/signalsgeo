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

    const allChecks = pages.flatMap(page => Object.entries(page.passed_checks || {}));
    const contentChecks = allChecks.filter(([key]) => 
      ['faq_present', 'question_headings', 'h1_ok', 'headings_hierarchy_ok', 
       'byline_present', 'updated_date_present', 'outbound_citations_present', 
       'glossary_terms_present', 'internal_linking_ok'].includes(key)
    );

    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Evaluated Criteria ({contentChecks.length} checks):</p>
        <ul className="space-y-1 text-xs">
          {contentChecks.map(([key, value], idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className={value ? 'text-green-600' : 'text-red-600'}>{value ? '✓' : '✗'}</span>
              <span className="text-gray-700">{formatCheckName(key)}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-2">Analyzed {pages.length} page(s)</p>
      </div>
    );
  };

  const renderTechnicalDetails = () => {
    if (!pages || pages.length === 0) return <p className="text-sm text-gray-500">No data available</p>;

    const allChecks = pages.flatMap(page => Object.entries(page.passed_checks || {}));
    const technicalChecks = allChecks.filter(([key]) => 
      ['org_schema_present', 'website_schema_present', 'product_service_schema_present',
       'alt_text_ok', 'canonical_ok', 'robots_ok', 'sitemap_ok', 'contrast_ok', 
       'js_dependence_level'].includes(key)
    );

    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Technical Checks ({technicalChecks.length} items):</p>
        <ul className="space-y-1 text-xs">
          {technicalChecks.map(([key, value], idx) => (
            <li key={idx} className="flex items-center gap-2">
              {key === 'js_dependence_level' ? (
                <>
                  <span className={value === 'low' ? 'text-green-600' : value === 'medium' ? 'text-yellow-600' : 'text-red-600'}>
                    {value === 'low' ? '✓' : '⚠'}
                  </span>
                  <span className="text-gray-700">JavaScript Dependence: {String(value)}</span>
                </>
              ) : (
                <>
                  <span className={value ? 'text-green-600' : 'text-red-600'}>{value ? '✓' : '✗'}</span>
                  <span className="text-gray-700">{formatCheckName(key)}</span>
                </>
              )}
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-2">Analyzed {pages.length} page(s)</p>
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
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">AI Query Performance:</p>
        <ul className="space-y-2 text-xs">
          {queries.map((query, idx) => {
            const answers = query.answers || [];
            const mentioned = answers.filter((a: any) => a.features?.brand_mentioned).length;
            return (
              <li key={idx} className="border-l-2 border-gray-200 pl-2">
                <div className="font-medium text-gray-700">{query.scenario_title}</div>
                <div className="text-gray-600">Brand mentioned in {mentioned}/{answers.length} AI engines</div>
              </li>
            );
          })}
        </ul>
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
          {pillarName === 'AI Visibility' && renderAIVisibilityDetails()}
        </div>
      )}
    </div>
  );
}

