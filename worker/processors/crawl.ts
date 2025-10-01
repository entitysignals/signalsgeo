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

  // Always include homepage
  urls.push(`https://${domain}`);

  // Priority URLs (if found in sitemap)
  const priorityPatterns = ['/about', '/contact', '/services', '/products', '/faq'];
  
  sitemapUrls
    .filter(u => priorityPatterns.some(p => u.loc.includes(p)))
    .slice(0, 5)
    .forEach(u => urls.push(u.loc));

  // Add high-priority sitemap URLs
  sitemapUrls
    .filter(u => !urls.includes(u.loc))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, budget - urls.length)
    .forEach(u => urls.push(u.loc));

  // If still under budget, add any remaining URLs
  if (urls.length < budget) {
    sitemapUrls
      .filter(u => !urls.includes(u.loc))
      .slice(0, budget - urls.length)
      .forEach(u => urls.push(u.loc));
  }

  return urls.slice(0, budget);
}
