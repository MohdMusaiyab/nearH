import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navigation } from "@/components/general/NavigationBar";
import "./globals.css";
import  {Footer}  from "@/components/general/Footer";
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
          className={`${inter.variable} ${plusJakarta.variable} antialiased min-h-screen flex flex-col`}
        >
          <Navigation />
          <main className="flex-1">{children}</main>
        </body>
      </html>
      <Footer />
    </>
  );
}
