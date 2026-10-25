import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Navigation } from "@/components/general/NavigationBar";
import "./globals.css";
import { Footer } from "@/components/general/Footer";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedProfile } from "@/utils/authCache";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://nearh-beta.vercel.app");

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NearH - Healthcare Network Platform",
    template: "%s | NearH",
  },
  description:
    "Find available hospital beds, ICU units, and blood banks in real-time across India. NearH bridges emergency care with verified clinical telemetry.",
  applicationName: "NearH",
  authors: [{ name: "NearH Team", url: siteUrl }],
  creator: "NearH Team",
  publisher: "NearH Healthcare Network",
  category: "Healthcare",
  keywords: [
    "hospital beds",
    "ICU availability",
    "blood bank India",
    "emergency healthcare",
    "real-time hospital beds",
    "ventilator tracking",
    "healthcare grid",
    "NearH",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "NearH",
    title: "NearH - Real-Time Hospital Bed & Healthcare Network India",
    description:
      "Find available hospital beds, ICU units, and blood banks in real-time across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NearH Healthcare Platform Preview",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NearH - Real-Time Hospital Bed & Healthcare Network India",
    description:
      "Find available hospital beds, ICU units, and blood banks in real-time across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NearH Healthcare Platform Preview",
      },
    ],
    creator: "@nearh_in",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialUser = null;
  let profile = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      initialUser = {
        id: user.id,
        email: user.email,
      };
      profile = await getAuthenticatedProfile();
    }
  } catch (error) {
    console.error("Error hydrating navigation auth state:", error);
  }

  return (
    <>
      <html lang="en">
        <body
          className={`${inter.variable} ${plusJakarta.variable} antialiased min-h-screen flex flex-col`}
        >
          <Toaster />
          <Navigation initialUser={initialUser} initialProfile={profile} />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </>
  );
}
