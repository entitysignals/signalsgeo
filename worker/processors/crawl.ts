import { fetchRobotsTxt, canCrawl } from '../../lib/crawl/robots';
import { fetchSitemap } from '../../lib/crawl/sitemap';
import { extractContent } from '../../lib/crawl/extractor';
import { checkPageQuality } from '../../lib/crawl/checker';
import crypto from 'crypto';

export async function processCrawlJob(job: any, supabase: any) {
  const { domain, urlBudget } = job.payload;

  console.log(`Starting crawl for ${domain} with budget ${urlBudget}`);

  // 1. Fetch robots.txt and sitemap
  const robots = await fetchRobotsTxt(domain);
  const sitemapUrls = await fetchSitemap(domain);

  console.log(`Found ${sitemapUrls.length} URLs in sitemap`);

  // 2. Select URLs to crawl
  const urlsToCrawl = selectUrls(domain, sitemapUrls, urlBudget);

  console.log(`Selected ${urlsToCrawl.length} URLs to crawl`);

  // 3. Crawl each URL
  let successCount = 0;
  let failCount = 0;

  for (const url of urlsToCrawl) {
    try {
      // Check robots.txt
      if (!canCrawl(robots, url)) {
        console.log(`Skipping ${url} - disallowed by robots.txt`);
        continue;
      }

      console.log(`Crawling: ${url}`);

      // Fetch page
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SignalsGEO-Bot/1.0 (+https://signalsgeo.com)',
        },
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      if (!response.ok) {
        console.log(`Failed to fetch ${url}: ${response.status}`);
        failCount++;
        continue;
      }

      const html = await response.text();

      // Extract content
      const content = await extractContent(url, html);

      // Check quality
      const checks = checkPageQuality(html, url);

      // Create hash
      const htmlHash = crypto.createHash('md5').update(html).digest('hex');

      // Store in database
      await supabase.from('crawled_pages').insert({
        run_id: job.run_id,
        url: url,
        status: response.status,
        main_text: content.mainText.substring(0, 50000), // Limit to 50k chars
        html_hash: htmlHash,
        passed_checks: checks,
      });

      successCount++;

      // Rate limiting - 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err: any) {
      console.error(`Error crawling ${url}:`, err.message);
      failCount++;
    }
  }

  console.log(`Crawl completed: ${successCount} success, ${failCount} failed`);

  // After crawl completes, create a job for provider queries
  console.log('Fetching run data to create provider query job...');
  const { data: run, error: runFetchError } = await supabase
    .from('runs')
    .select('*, organizations(brand_name, domain, industry)')
    .eq('id', job.run_id)
    .single();

  if (runFetchError) {
    console.error('Error fetching run for provider job:', runFetchError);
  } else if (run && run.organizations) {
    console.log('Creating provider query job for:', run.organizations.brand_name);
    
    const { error: jobInsertError } = await supabase.from('jobs').insert({
      run_id: job.run_id,
      type: 'query_providers',
      status: 'pending',
      payload: {
        brandName: run.organizations.brand_name,
        domain: run.organizations.domain,
        industry: run.organizations.industry || 'general',
        runId: job.run_id,
      },
    });

    if (jobInsertError) {
      console.error('Error creating provider query job:', jobInsertError);
    } else {
      console.log('✓ Provider query job created successfully');
    }
  } else {
    console.log('No run or organization data found');
  }

  return {
    successCount,
    failCount,
    totalUrls: urlsToCrawl.length,
  };
}

function selectUrls(domain: string, sitemapUrls: any[], budget: number): string[] {
  const urls: string[] = [];
  const usedUrls = new Set<string>();

  // Helper to add URL if not already added
  const addUrl = (url: string) => {
    if (!usedUrls.has(url)) {
      urls.push(url);
      usedUrls.add(url);
    }
  };

  // TIER 1: Critical pages (MUST scan these)
  // Always include homepage first
  addUrl(`https://${domain}`);

  // Critical page patterns - these are essential for any business
  const tier1Patterns = [
    { pattern: /\/(about|about-us|about_us|company|who-we-are)($|\/|\?)/i, name: 'About' },
    { pattern: /\/(contact|contact-us|contact_us|get-in-touch)($|\/|\?)/i, name: 'Contact' },
    { pattern: /\/(services|our-services|what-we-do)($|\/|\?)/i, name: 'Services' },
    { pattern: /\/(products|our-products|shop|store)($|\/|\?)/i, name: 'Products' },
    { pattern: /\/(faq|faqs|frequently-asked-questions|help)($|\/|\?)/i, name: 'FAQ' },
    { pattern: /\/(pricing|plans|packages|cost)($|\/|\?)/i, name: 'Pricing' },
    { pattern: /\/(solutions|industries|use-cases)($|\/|\?)/i, name: 'Solutions' },
  ];

  // Find and add all Tier 1 pages
  for (const { pattern, name } of tier1Patterns) {
    const match = sitemapUrls.find(u => pattern.test(u.loc));
    if (match) {
      addUrl(match.loc);
      console.log(`✓ Found critical page: ${name} - ${match.loc}`);
    }
  }

  // TIER 2: Important pages (high priority)
  // Main category/section pages, team pages, case studies
  const tier2Patterns = [
    /\/(team|our-team|leadership|people)($|\/|\?)/i,
    /\/(case-studies|portfolio|work|projects)($|\/|\?)/i,
    /\/(testimonials|reviews|clients)($|\/|\?)/i,
    /\/(careers|jobs|join-us)($|\/|\?)/i,
    /\/(resources|guides|learn)($|\/|\?)/i,
    /\/(features|capabilities)($|\/|\?)/i,
  ];

  // Add Tier 2 pages
  const tier2Urls = sitemapUrls.filter(u => 
    !usedUrls.has(u.loc) && tier2Patterns.some(p => p.test(u.loc))
  );
  tier2Urls.slice(0, Math.min(10, budget - urls.length)).forEach(u => addUrl(u.loc));

  // Add pages with high sitemap priority (0.8+)
  const highPriorityUrls = sitemapUrls
    .filter(u => !usedUrls.has(u.loc) && (u.priority || 0) >= 0.8)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  
  highPriorityUrls.slice(0, Math.min(5, budget - urls.length)).forEach(u => addUrl(u.loc));

  // TIER 3: Secondary pages (blog posts, news, etc.)
  // Only add these if we have budget remaining
  if (urls.length < budget) {
    // Deprioritize blog/news URLs (these are typically less important for AI visibility)
    const tier3Patterns = [
      /\/(blog|news|articles|press)($|\/|\?)/i,
      /\/\d{4}\/\d{2}\//,  // Date-based URLs (e.g., /2024/01/)
      /\/(tag|category|author)\//i,
    ];

    // Separate blog/news from other pages
    const blogNewsUrls = sitemapUrls.filter(u => 
      !usedUrls.has(u.loc) && tier3Patterns.some(p => p.test(u.loc))
    );

    const otherUrls = sitemapUrls.filter(u => 
      !usedUrls.has(u.loc) && !tier3Patterns.some(p => p.test(u.loc))
    );

    // Add other pages first (sorted by priority)
    const remainingBudget = budget - urls.length;
    const otherBudget = Math.floor(remainingBudget * 0.7); // 70% for other pages
    const blogBudget = remainingBudget - otherBudget; // 30% for blog/news

    otherUrls
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, otherBudget)
      .forEach(u => addUrl(u.loc));

    // Add blog/news pages last
    blogNewsUrls
      .sort((a, b) => (b.priority || 0) - (a.priority || 0))
      .slice(0, blogBudget)
      .forEach(u => addUrl(u.loc));
  }

  console.log(`Smart URL selection: ${urls.length} URLs selected from ${sitemapUrls.length} available`);
  return urls.slice(0, budget);
}
