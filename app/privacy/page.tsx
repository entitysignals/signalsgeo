export const metadata = {
  title: "Privacy Policy - Signals GEO",
  description: "Privacy Policy for Signals GEO AI Visibility Analyzer",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> October 3, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you use Signals GEO, we collect the following information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Email address, name, and organization details when you create an account</li>
              <li><strong>Website Data:</strong> URLs and website content you submit for analysis</li>
              <li><strong>Usage Data:</strong> How you interact with our service, including scan history and reports</li>
              <li><strong>Technical Data:</strong> IP address, browser type, and device information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use your information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide and improve our AI visibility analysis service</li>
              <li>Generate your AI Visibility Reports</li>
              <li>Communicate with you about your account and our services</li>
              <li>Analyze and improve our platform performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your data with:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> Third-party services that help us operate our platform (e.g., Supabase for database hosting)</li>
              <li><strong>AI Search Engines:</strong> We query AI engines (Perplexity, Brave Search) with your website URL to generate reports</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption, secure authentication, and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              We use essential cookies to maintain your session and provide our service. We do not use tracking or advertising cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your data for as long as your account is active or as needed to provide our services. You can request deletion of your data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for children under 13. We do not knowingly collect data from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have questions about this Privacy Policy or your data, please contact us at:{" "}
              <a href="https://entitysignals.com/contact" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                Entity Signals Contact
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
