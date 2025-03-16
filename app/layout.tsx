// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Teachers } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuroraBackground } from "@/components/ui/aurora-background";
import PageViewTracker from "@/components/PageViewTracker";
import { Analytics } from "@vercel/analytics/react";

import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import { GA_TRACKING_ID } from "@/lib/gtag";

export const metadata: Metadata = {
  title: "Paper Analysis",
  description:
    "Analyze past exam papers to discover trends, common questions, and key topics with AI insights.",
  openGraph: {
    title: "Paper Analysis - AI Exam Insights",
    description:
      "AI-powered exam paper analysis to track common questions and optimize your exam preparation.",
    url: "https://www.paperanalysis.com",
    siteName: "Paper Analysis",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Paper Analysis - AI Exam Insights",
      },
    ],
    type: "website",
  },
  // Twitter meta tags for better social sharing preview
  twitter: {
    card: "summary_large_image",
    title: "Paper Analysis - AI Exam Insights",
    description:
      "AI-powered exam paper analysis to track common questions and optimize your exam preparation.",
    images: [
      {
        url: "/og-image.png",
        alt: "Paper Analysis - Twitter Card Image",
      },
    ],
  },
  // Additional SEO enhancements
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://www.paperanalysis.com",
  },
};

const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-teachers",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism,
      }}
    >
      <html lang="en">
        <head>
          {/* Google Analytics Scripts */}
          {GA_TRACKING_ID && (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </>
          )}
        </head>
        <body className={teachers.className}>
          <AuroraBackground>
            <Navbar />
            <PageViewTracker />
            {children}
            <Analytics />
            <Footer />
          </AuroraBackground>
        </body>
      </html>
    </ClerkProvider>
  );
}
