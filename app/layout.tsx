import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistration } from "./sw-register";
import { ThemeProvider } from "@/components/theme-provider";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { AdminBypassButton } from "@/components/AdminBypassButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
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

// Script to prevent theme flash
const themeScript = `
  (function() {
    function getThemePreference() {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('segakai-theme')) {
        return localStorage.getItem('segakai-theme');
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    const theme = getThemePreference();
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme === 'system' 
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    );
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${interTight.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased flex flex-col">
        <ThemeProvider defaultTheme="system" storageKey="segakai-theme">
          <NavbarWrapper />
          <main className="flex-1 flex flex-col">{children}</main>
          <Toaster />
          <ServiceWorkerRegistration />
          <AdminBypassButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
