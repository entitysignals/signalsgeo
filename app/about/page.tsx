export const metadata = {
  title: "About Us - Signals GEO",
  description: "Learn about Signals GEO AI Visibility Analyzer and how we help businesses optimize for AI search engines",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            About Signals GEO
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Helping businesses thrive in the age of AI-powered search
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* What We Do */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Signals GEO is an AI Visibility Analyzer that helps businesses understand and optimize how AI search engines like ChatGPT, Perplexity, and Brave Search perceive their brand.
            </p>
            <p className="text-gray-700 leading-relaxed">
              As more users turn to AI for answers and recommendations, traditional SEO alone isn't enough. We provide comprehensive analysis and actionable insights to ensure your brand is discoverable in the AI-powered search era.
            </p>
          </section>

          {/* Our Mission */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To empower businesses with the tools and insights they need to succeed in Generative Engine Optimization (GEO). We believe every brand deserves to be visible when potential customers ask AI for recommendations.
            </p>
          </section>

          {/* What We Analyze */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Analyze</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">📝</span> Content Quality
                </h3>
                <p className="text-gray-600 text-sm">
                  Conversational tone, Q&A format, expertise signals, and semantic richness
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🔧</span> Technical Foundation
                </h3>
                <p className="text-gray-600 text-sm">
                  Schema markup, crawlability, page speed, and structured data
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏆</span> Authority & Trust
                </h3>
                <p className="text-gray-600 text-sm">
                  Brand mentions, citations, and presence in authoritative sources
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🤖</span> AI Discoverability
                </h3>
                <p className="text-gray-600 text-sm">
                  Real AI engine testing across multiple user query scenarios
                </p>
              </div>
            </div>
          </section>

          {/* Affiliation */}
          <section className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">In Affiliation With</h2>
            <p className="text-blue-100 leading-relaxed mb-4">
              Signals GEO is developed in partnership with <strong>Entity Signals</strong>, a leading consultancy specializing in AI search optimization and generative engine optimization (GEO) strategies.
            </p>
            <a
              href="https://entitysignals.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Visit Entity Signals →
            </a>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a href="mailto:info@signalsgeo.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                    info@signalsgeo.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a href="tel:+16049066333" className="text-blue-600 hover:text-blue-700 transition-colors">
                    +1 (604) 906-6333
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                  <a href="https://signalsgeo.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                    signalsgeo.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Have questions or need help optimizing your AI visibility? We're here to help!
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
