import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Navigation } from "@/components/general/NavigationBar";
import "./globals.css";
import { Footer } from "@/components/general/Footer";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "NearH - Healthcare Network Platform",
  description:
    "Find available hospital beds, ICU units, and blood banks in real-time across India.",
  keywords:
    "hospital beds, ICU availability, blood bank, healthcare, India, emergency care, real-time hospital beds",
  authors: [{ name: "NearH Team" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "NearH - Healthcare Network Platform",
    description: "Real-time hospital bed availability across India",
    type: "website",
    siteName: "NearH",
    locale: "en_IN",
    images: [
      {
        url: "/nearH.webp",
        width: 1200,
        height: 630,
        alt: "NearH Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NearH - Healthcare Network Platform",
    description: "Real-time hospital bed availability across India",
    images: ["/nearH.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body
          className={`${inter.variable} ${plusJakarta.variable} antialiased min-h-screen flex flex-col`}
        >
          <Toaster />
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </>
  );
}
