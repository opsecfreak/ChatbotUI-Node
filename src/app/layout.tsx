/**
 * Root Layout Component
 * 
 * This is the main layout component for the entire application.
 * It wraps all pages and provides:
 * - Authentication context
 * - Global fonts
 * - Metadata for SEO
 * - Global styles
 * 
 * CUSTOMIZATION OPTIONS:
 * - Update metadata for your application
 * - Add global navigation components
 * - Implement theme switching
 * - Add analytics or monitoring scripts
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../components/auth/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Application",
  description: "A simple GPT-like chat application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
