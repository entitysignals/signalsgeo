"use client";
import { Container, Input } from "@/components/ui";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { AuthModal } from "@/components/AuthModal";

export default function Page() {
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is AI Visibility and why does it matter?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "AI Visibility measures how well AI search engines like ChatGPT, Perplexity, and Brave Search understand and recommend your brand. As more users rely on AI for answers, being visible in AI responses is crucial for brand discovery and customer acquisition."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI Visibility Analyzer work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our analyzer crawls your website, tests it against multiple AI search engines with real user queries, and evaluates your content quality, technical SEO, authority signals, and AI discoverability. You get a comprehensive score (0-100) with actionable insights."
        }
      },
      {
        "@type": "Question",
        "name": "What makes this different from traditional SEO tools?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Traditional SEO tools focus on Google rankings. We focus on how AI engines understand and cite your brand. This includes conversational content, structured data, authority signals, and actual AI query testing - not just keyword rankings."
        }
      },
      {
        "@type": "Question",
        "name": "How long does a scan take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A typical scan takes 3-5 minutes. We crawl up to 20 pages, query multiple AI engines with 7 different scenarios, and calculate your comprehensive AI Visibility Score with detailed breakdowns."
        }
      },
      {
        "@type": "Question",
        "name": "Is this tool suitable for all types of businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Whether you're a B2B SaaS company, professional services firm, e-commerce brand, or local business, AI visibility matters. Any business that wants to be discovered when potential customers ask AI for recommendations can benefit."
        }
      },
      {
        "@type": "Question",
        "name": "What happens after I get my report?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You'll receive a detailed report with your AI Visibility Score, specific issues identified, and actionable recommendations. For businesses that want expert help implementing improvements, Entity Signals offers consulting services to optimize your AI presence."
        }
      }
    ]
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    // Show auth modal regardless of whether domain is filled
    setShowAuthModal(true);
  };

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        domain={domain}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen">
        {/* Main Platform Interface */}
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            {/* Platform Header */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Discover Your AI Visibility Score
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                See how your website performs in AI-powered search results and answer engines
              </p>
            </div>

            {/* Auth CTAs - Above Search */}
            <div className="flex justify-center gap-4 mb-8">
              <Link
                href="/auth/signup"
                className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-300 shadow-lg shadow-cyan-500/30"
              >
                Get Started Free
              </Link>
              <Link
                href="/auth/login"
                className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Login
              </Link>
            </div>

            {/* Analysis Form - Lead Magnet */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-8 mb-8">
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Enter your website and get an AI Visibility Report instantly!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Enter your website (e.g., example.com)"
                      value={domain}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
                      className="text-lg py-4 text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-300 min-w-[140px] shadow-lg shadow-cyan-500/30"
                  >
                    Analyze Now
                  </button>
                </div>
                <div className="text-xs text-center text-gray-500">
                  Free account required • Get results in minutes
                </div>
              </form>
            </div>

            {/* Features Grid */}
            <div className="grid gap-6 md:grid-cols-4 text-center mb-12">
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">🤖</div>
                <div className="font-semibold text-gray-900 mb-2">AI Discoverability</div>
                <div className="text-sm text-gray-600">How AI engines see your brand</div>
              </div>
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">📝</div>
                <div className="font-semibold text-gray-900 mb-2">Content Quality</div>
                <div className="text-sm text-gray-600">AI-ready content analysis</div>
              </div>
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">🔧</div>
                <div className="font-semibold text-gray-900 mb-2">Technical Structure</div>
                <div className="text-sm text-gray-600">Performance & crawlability</div>
              </div>
              <div className="p-6 bg-white/60 rounded-2xl">
                <div className="text-4xl mb-3">🏆</div>
                <div className="font-semibold text-gray-900 mb-2">Authority & Trust Signals</div>
                <div className="text-sm text-gray-600">Citations & reputation</div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Join businesses optimizing for the AI-powered search era
              </p>
              <Link
                href="/auth/signup"
                className="inline-block bg-cyan-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-cyan-700 transition-all duration-300 text-lg shadow-lg shadow-cyan-500/30"
              >
                Start Your Free Analysis
              </Link>
            </div>

            {/* FAQ Section */}
            <div className="mt-20 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <details className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-cyan-600">
                    What is AI Visibility and why does it matter?
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    AI Visibility measures how well AI search engines like ChatGPT, Perplexity, and Brave Search understand and recommend your brand. As more users rely on AI for answers, being visible in AI responses is crucial for brand discovery and customer acquisition.
                  </p>
                </details>

                <details className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-cyan-600">
                    How does the AI Visibility Analyzer work?
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Our analyzer crawls your website, tests it against multiple AI search engines with real user queries, and evaluates your content quality, technical SEO, authority signals, and AI discoverability. You get a comprehensive score (0-100) with actionable insights.
                  </p>
                </details>

                <details className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-cyan-600">
                    What makes this different from traditional SEO tools?
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Traditional SEO tools focus on Google rankings. We focus on how AI engines understand and cite your brand. This includes conversational content, structured data, authority signals, and actual AI query testing - not just keyword rankings.
                  </p>
                </details>

                <details className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-cyan-600">
                    How long does a scan take?
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    A typical scan takes 3-5 minutes. We crawl up to 20 pages, query multiple AI engines with 7 different scenarios, and calculate your comprehensive AI Visibility Score with detailed breakdowns.
                  </p>
                </details>

                <details className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-cyan-600">
                    Is this tool suitable for all types of businesses?
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    Yes! Whether you're a B2B SaaS company, professional services firm, e-commerce brand, or local business, AI visibility matters. Any business that wants to be discovered when potential customers ask AI for recommendations can benefit.
                  </p>
                </details>

                <details className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <summary className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-cyan-600">
                    What happens after I get my report?
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">
                    You'll receive a detailed report with your AI Visibility Score, specific issues identified, and actionable recommendations. For businesses that want expert help implementing improvements, Entity Signals offers consulting services to optimize your AI presence.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
    </>
  );
}


