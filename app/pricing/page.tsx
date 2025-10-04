export const dynamic = "force-static";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Beta Version
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're currently in beta testing. Pricing plans will be announced soon.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-200">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Early Access Available
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join our beta program and get early access to AI Visibility Analyzer. 
            Help us shape the future of AI search optimization.
          </p>
          <a
            href="https://entitysignals.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Request Beta Access
          </a>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Questions about pricing? <a href="https://entitysignals.com/contact" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">Contact us</a></p>
        </div>
      </div>
    </div>
  );
}


