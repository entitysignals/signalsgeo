import robotsParser from 'robots-parser';

export async function fetchRobotsTxt(domain: string): Promise<any> {
  try {
    const url = `https://${domain}/robots.txt`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.log(`No robots.txt found for ${domain}`);
      return null;
    }

    const robotsTxt = await response.text();
    const robots = robotsParser(url, robotsTxt);
    
    return robots;
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    return null;
  }
}

export function canCrawl(robots: any, url: string, userAgent: string = '*'): boolean {
  if (!robots) return true; // If no robots.txt, allow crawling
  return robots.isAllowed(url, userAgent) ?? true;
}

export function getCrawlDelay(robots: any, userAgent: string = '*'): number {
  if (!robots) return 1000; // Default 1 second delay
  const delay = robots.getCrawlDelay(userAgent);
  return delay ? delay * 1000 : 1000; // Convert to milliseconds
}

