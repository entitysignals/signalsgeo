import { parseStringPromise } from 'xml2js';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority?: number;
  changefreq?: string;
}

export async function fetchSitemap(domain: string): Promise<SitemapUrl[]> {
  try {
    const sitemapUrl = `https://${domain}/sitemap.xml`;
    const response = await fetch(sitemapUrl);

    if (!response.ok) {
      console.log(`No sitemap found for ${domain}`);
      return [];
    }

    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const urls: SitemapUrl[] = [];

    // Handle regular sitemap
    if (result.urlset && result.urlset.url) {
      for (const url of result.urlset.url) {
        urls.push({
          loc: url.loc[0],
          lastmod: url.lastmod ? url.lastmod[0] : undefined,
          priority: url.priority ? parseFloat(url.priority[0]) : undefined,
          changefreq: url.changefreq ? url.changefreq[0] : undefined,
        });
      }
    }

    // Handle sitemap index (recursive fetch)
    if (result.sitemapindex && result.sitemapindex.sitemap) {
      for (const sitemap of result.sitemapindex.sitemap) {
        const sitemapLoc = sitemap.loc[0];
        const childUrls = await fetchSitemapFromUrl(sitemapLoc);
        urls.push(...childUrls);
      }
    }

    return urls;
  } catch (error) {
    console.error('Error fetching sitemap:', error);
    return [];
  }
}

async function fetchSitemapFromUrl(url: string): Promise<SitemapUrl[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const xml = await response.text();
    const result = await parseStringPromise(xml);

    const urls: SitemapUrl[] = [];

    if (result.urlset && result.urlset.url) {
      for (const urlEntry of result.urlset.url) {
        urls.push({
          loc: urlEntry.loc[0],
          lastmod: urlEntry.lastmod ? urlEntry.lastmod[0] : undefined,
          priority: urlEntry.priority ? parseFloat(urlEntry.priority[0]) : undefined,
          changefreq: urlEntry.changefreq ? urlEntry.changefreq[0] : undefined,
        });
      }
    }

    return urls;
  } catch (error) {
    console.error('Error fetching child sitemap:', error);
    return [];
  }
}

