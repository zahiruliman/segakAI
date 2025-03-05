import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "./sw-register";

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
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster position="top-center" closeButton richColors />
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
