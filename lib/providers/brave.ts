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

    // Log the response structure for debugging
    console.log('Brave API response structure:', {
      hasWeb: !!data.web,
      webResultsCount: data.web?.results?.length || 0,
      hasInfobox: !!data.infobox,
      hasFaq: !!data.faq,
      keys: Object.keys(data)
    });

    // Build answer text from top search results
    let answer_text = '';
    if (data.web?.results && Array.isArray(data.web.results)) {
      const topResults = data.web.results.slice(0, 3);
      
      // Try multiple fields to extract content
      answer_text = topResults
        .map((r: any) => {
          return r.description || 
                 r.snippet || 
                 (r.extra_snippets && r.extra_snippets[0]) || 
                 r.title || 
                 '';
        })
        .filter(Boolean)
        .join(' ');
      
      console.log(`Brave: Extracted ${answer_text.length} chars from ${topResults.length} results`);
    }

    // If no answer from results, use infobox or FAQ if available
    if (!answer_text && data.infobox?.long_desc) {
      answer_text = data.infobox.long_desc;
      console.log('Brave: Using infobox description');
    } else if (!answer_text && data.faq?.results?.[0]) {
      answer_text = data.faq.results[0].answer;
      console.log('Brave: Using FAQ answer');
    }

    // If still no answer, log the raw data for debugging
    if (!answer_text) {
      console.log('Brave: No answer text found. Sample result:', 
        data.web?.results?.[0] ? JSON.stringify(data.web.results[0]).substring(0, 200) : 'No results');
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

    // If we still have no answer text but have results, create a summary from titles
    if (!answer_text && data.web?.results && data.web.results.length > 0) {
      answer_text = data.web.results
        .slice(0, 5)
        .map((r: any) => r.title)
        .filter(Boolean)
        .join('. ') + '.';
      console.log('Brave: Fallback to titles only');
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
