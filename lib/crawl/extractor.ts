import { load } from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export interface ExtractedContent {
  mainText: string;
  title: string;
  excerpt: string;
  wordCount: number;
  html: string;
}

export async function extractContent(url: string, html: string): Promise<ExtractedContent> {
  try {
    // Use Readability for main content extraction
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    const mainText = article?.textContent || '';
    const title = article?.title || '';
    const excerpt = article?.excerpt || '';
    
    return {
      mainText,
      title,
      excerpt,
      wordCount: mainText.split(/\s+/).filter(Boolean).length,
      html,
    };
  } catch (error) {
    console.error('Content extraction error:', error);
    // Fallback to basic text extraction
    const $ = load(html);
    const mainText = $('body').text().trim();
    
    return {
      mainText,
      title: $('title').text() || '',
      excerpt: mainText.substring(0, 200),
      wordCount: mainText.split(/\s+/).filter(Boolean).length,
      html,
    };
  }
}

