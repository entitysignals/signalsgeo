import { ProviderResponse } from './perplexity';

export async function queryGemini(
  prompt: string,
  locale: string = 'en-CA'
): Promise<ProviderResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  try {
    // Google Gemini API with grounding (Google Search)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        tools: [
          {
            googleSearchRetrieval: {
              dynamicRetrievalConfig: {
                mode: "MODE_DYNAMIC",
                dynamicThreshold: 0.3
              }
            }
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();

    console.log('Gemini API response structure:', {
      hasCandidates: !!data.candidates,
      candidatesCount: data.candidates?.length || 0,
      hasGroundingMetadata: !!data.candidates?.[0]?.groundingMetadata
    });

    // Extract answer text from the response
    let answer_text = '';
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content?.parts) {
        answer_text = candidate.content.parts
          .map((part: any) => part.text || '')
          .join(' ')
          .trim();
      }
    }

    console.log(`Gemini: Extracted ${answer_text.length} chars`);

    // Extract citations from grounding metadata
    const citations: Array<{ url: string; domain: string }> = [];
    if (data.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = data.candidates[0].groundingMetadata.groundingChunks;
      
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          try {
            const urlObj = new URL(chunk.web.uri);
            citations.push({
              url: chunk.web.uri,
              domain: urlObj.hostname,
            });
          } catch (e) {
            console.error('Invalid Gemini citation URL:', chunk.web.uri);
          }
        }
      }
    }

    // Also check webSearchQueries if available
    if (data.candidates?.[0]?.groundingMetadata?.webSearchQueries) {
      console.log('Gemini web search queries:', data.candidates[0].groundingMetadata.webSearchQueries);
    }

    console.log(`Gemini: Found ${citations.length} citations`);

    return {
      provider: 'gemini',
      answer_text: answer_text || 'No response generated',
      citations,
      raw_json: data,
    };
  } catch (error: any) {
    console.error('Gemini query error:', error);
    throw error;
  }
}
