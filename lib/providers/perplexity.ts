export interface ProviderResponse {
  provider: string;
  answer_text: string;
  citations: Array<{ url: string; domain: string }>;
  raw_json: any;
}

export async function queryPerplexity(
  prompt: string,
  locale: string = 'en-CA'
): Promise<ProviderResponse> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY not configured');
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that provides accurate, cited answers.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.2,
        return_citations: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Perplexity API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    // Extract answer text
    const answer_text = data.choices?.[0]?.message?.content || '';

    // Extract citations
    const citations: Array<{ url: string; domain: string }> = [];
    if (data.citations && Array.isArray(data.citations)) {
      for (const url of data.citations) {
        try {
          const urlObj = new URL(url);
          citations.push({
            url: url,
            domain: urlObj.hostname,
          });
        } catch (e) {
          console.error('Invalid citation URL:', url);
        }
      }
    }

    return {
      provider: 'perplexity',
      answer_text,
      citations,
      raw_json: data,
    };
  } catch (error: any) {
    console.error('Perplexity query error:', error);
    throw error;
  }
}
