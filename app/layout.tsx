import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Spark Policy System — Policy & Procedure Manuals for Physician Practices",
  description:
    "A premium, ready-to-use policy and procedure manual built for physician practices. Standardize operations, reduce manual work, and install a polished policy structure.",
  openGraph: {
    title: "Spark Policy System",
    description: "A complete policy and procedure system for physician practices.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spark Policy System",
    description: "A complete policy and procedure system for physician practices.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
