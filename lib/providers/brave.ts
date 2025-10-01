import { ProviderResponse } from './perplexity';

export async function queryBrave(
  prompt: string,
  locale: string = 'en-CA'
): Promise<ProviderResponse> {
  const apiKey = process.env.BRAVE_API_KEY;

  if (!apiKey) {
    throw new Error('BRAVE_API_KEY not configured');
  }

  try {
    // Brave Web Search API endpoint (NOT summarizer - that doesn't exist!)
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(prompt)}&country=${locale.split('-')[1] || 'CA'}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Brave API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // Build answer text from top search results
    let answer_text = '';
    if (data.web?.results && Array.isArray(data.web.results)) {
      const topResults = data.web.results.slice(0, 3);
      answer_text = topResults
        .map((r: any) => r.description || r.extra_snippets?.[0] || '')
        .filter(Boolean)
        .join(' ');
    }

    // If no answer from results, use infobox or FAQ if available
    if (!answer_text && data.infobox?.long_desc) {
      answer_text = data.infobox.long_desc;
    } else if (!answer_text && data.faq?.results?.[0]) {
      answer_text = data.faq.results[0].answer;
    }

    // Extract citations from web results
    const citations: Array<{ url: string; domain: string }> = [];
    if (data.web?.results && Array.isArray(data.web.results)) {
      for (const result of data.web.results.slice(0, 10)) {
        try {
          const urlObj = new URL(result.url);
          citations.push({
            url: result.url,
            domain: urlObj.hostname,
          });
        } catch (e) {
          console.error('Invalid result URL:', result.url);
        }
      }
    }

    return {
      provider: 'brave_search',
      answer_text: answer_text || 'No results found',
      citations,
      raw_json: data,
    };
  } catch (error: any) {
    console.error('Brave query error:', error);
    throw error;
  }
}
