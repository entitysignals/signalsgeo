import type { Metadata } from "next";
import "./globals.css";
import { Footer, Container } from "@/components/ui";
import { Sora, Inter } from "next/font/google";
import { CustomHeader } from "@/components/CustomHeader";

const sora = Sora({ subsets: ["latin"], display: "swap", variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Signals GEO",
  description: "Instant view of AI and search readiness",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${sora.variable} ${inter.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
        <CustomHeader />
        <Container className="py-10">{children}</Container>
        <Footer />
      </body>
    </html>
  );
}


