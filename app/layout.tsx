import type { Metadata } from "next";
import "./globals.css";
import { Footer, Container } from "@/components/ui";
import { Sora, Inter } from "next/font/google";
import { CustomHeader } from "@/components/CustomHeader";

const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Signals GEO - AI Visibility Analyzer",
  description: "Discover how AI search engines see your brand. Get instant insights into your AI visibility, content quality, technical SEO, and authority signals.",
  keywords: "AI search optimization, AI visibility, GEO, generative engine optimization, AI SEO, brand visibility",
  authors: [{ name: "Entity Signals" }],
  openGraph: {
    title: "Signals GEO - AI Visibility Analyzer",
    description: "Discover how AI search engines see your brand",
    url: "https://signalsgeo.com",
    siteName: "Signals GEO",
    type: "website",
  },
  icons: {
    icon: '/logo.png',
  },
  metadataBase: new URL('https://signalsgeo.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Signals GEO",
    "url": "https://signalsgeo.com",
    "logo": "https://signalsgeo.com/logo.png",
    "description": "AI Visibility Analyzer - Discover how AI search engines see your brand",
    "sameAs": [
      "https://entitysignals.com"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "url": "https://entitysignals.com/contact"
    }
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Signals GEO",
    "url": "https://signalsgeo.com",
    "description": "AI Visibility Analyzer for brands and businesses",
    "publisher": {
      "@type": "Organization",
      "name": "Signals GEO"
    }
  };

  return (
    <html lang="en" data-theme="light" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <CustomHeader />
        <Container className="py-10">{children}</Container>
        <Footer />
      </body>
    </html>
  );
}


