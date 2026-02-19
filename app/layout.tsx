import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/general/NavigationBar";
import "./globals.css";
import { Footer } from "@/components/general/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NearH - Healthcare Network Platform",
  description:
    "Find available hospital beds, ICU units, and blood banks in real-time across India.",
  keywords:
    "hospital beds, ICU availability, blood bank, healthcare, India, emergency care",
  authors: [{ name: "NearH Team" }],
  openGraph: {
    title: "NearH - Healthcare Network Platform",
    description: "Real-time hospital bed availability across India",
    type: "website",
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <Navigation />
          <main className="flex-1">{children}</main>

          {/* Optional Footer - can add later */}
          <footer className="border-t border-slate-100 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-slate-400 text-center">
                © {new Date().getFullYear()} NearH. All rights reserved.
              </p>
            </div>
          </footer>
        </body>
      </html>
      <Footer/>
    </>
  );
}
