import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SegakAI - Personalized Workout & Diet Plans",
  description: "Generate personalized and extensive workout and diet plans with AI",
  keywords: ["workout", "diet", "fitness", "AI", "personalized plans"],
  authors: [{ name: "SegakAI Team" }],
  manifest: "/manifest.json",
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SegakAI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Toaster position="top-center" closeButton richColors />
      </body>
    </html>
  );
}
