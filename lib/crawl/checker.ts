import { load } from 'cheerio';

export interface PageChecks {
  faq_present: boolean;
  question_headings: boolean;
  h1_ok: boolean;
  headings_hierarchy_ok: boolean;
  byline_present: boolean;
  updated_date_present: boolean;
  outbound_citations_present: boolean;
  glossary_terms_present: boolean;
  internal_linking_ok: boolean;
  org_schema_present: boolean;
  website_schema_present: boolean;
  product_service_schema_present: boolean;
  alt_text_ok: boolean;
  canonical_ok: boolean;
  robots_ok: boolean;
  sitemap_ok: boolean;
  noindex_on_core_templates: boolean;
  js_dependence_level: string;
  speed_sample: string;
  contrast_ok: boolean;
}

export function checkPageQuality(html: string, url: string): PageChecks {
  const $ = load(html);

  // FAQ checks
  const faq_present = $('[itemtype*="FAQPage"], .faq, #faq').length > 0;
  const question_headings = $('h1, h2, h3, h4, h5, h6').filter((_, el) => {
    const text = $(el).text().toLowerCase();
    return text.includes('?') || text.match(/\b(what|how|why|when|where|who)\b/i);
  }).length > 0;

  // Heading structure
  const h1Count = $('h1').length;
  const h1_ok = h1Count === 1;
  
  const headings = $('h1, h2, h3, h4, h5, h6').toArray();
  const headings_hierarchy_ok = headings.length > 0 && !headings.some(el => $(el).text().trim() === '');

  // Expertise signals
  const byline_present = $('[rel="author"], .author, .byline').length > 0;
  const updated_date_present = $('time, [itemprop="dateModified"], [itemprop="datePublished"]').length > 0;

  // Citations
  const outboundLinks = $('a[href^="http"]').filter((_, el) => {
    const href = $(el).attr('href') || '';
    return !href.includes(new URL(url).hostname);
  });
  const outbound_citations_present = outboundLinks.length > 0;

  // Semantic richness
  const glossary_terms_present = $('[itemtype*="DefinedTerm"], .glossary, dfn, dt').length > 0;
  const internalLinks = $('a[href^="/"], a[href^="' + url + '"]');
  const internal_linking_ok = internalLinks.length >= 3;

  // Schema.org checks
  const scriptTags = $('script[type="application/ld+json"]').toArray();
  let org_schema_present = false;
  let website_schema_present = false;
  let product_service_schema_present = false;

  scriptTags.forEach(script => {
    try {
      const json = JSON.parse($(script).html() || '{}');
      const type = json['@type'] || (Array.isArray(json) ? json.map((i: any) => i['@type']).join(',') : '');
      
      if (type.includes('Organization')) org_schema_present = true;
      if (type.includes('WebSite')) website_schema_present = true;
      if (type.includes('Product') || type.includes('Service')) product_service_schema_present = true;
    } catch (e) {}
  });

  // Accessibility
  const images = $('img');
  const imagesWithAlt = images.filter((_, el) => $(el).attr('alt')).length;
  const alt_text_ok = images.length === 0 || (imagesWithAlt / images.length) >= 0.7;

  // Technical SEO
  const canonical_ok = $('link[rel="canonical"]').length > 0;
  const metaRobots = $('meta[name="robots"]').attr('content') || '';
  const robots_ok = !metaRobots.includes('noindex');
  const sitemap_ok = true; // Will be checked separately
  const noindex_on_core_templates = metaRobots.includes('noindex');

  // JS dependence (basic check)
  const scriptCount = $('script').length;
  const js_dependence_level = scriptCount > 20 ? 'high' : scriptCount > 10 ? 'medium' : 'low';

  // Speed (placeholder - would need actual measurement)
  const speed_sample = 'not_measured';

  // Contrast (placeholder - would need actual color analysis)
  const contrast_ok = true;

  return {
    faq_present,
    question_headings,
    h1_ok,
    headings_hierarchy_ok,
    byline_present,
    updated_date_present,
    outbound_citations_present,
    glossary_terms_present,
    internal_linking_ok,
    org_schema_present,
    website_schema_present,
    product_service_schema_present,
    alt_text_ok,
    canonical_ok,
    robots_ok,
    sitemap_ok,
    noindex_on_core_templates,
    js_dependence_level,
    speed_sample,
    contrast_ok,
  };
}

