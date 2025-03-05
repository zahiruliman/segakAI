'use client';

import { HeroSection } from "@/components/ui/hero-section"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X, Moon, Sun, Smartphone } from "lucide-react";
import { InstallPWA } from "@/app/pwa-install";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { StackedCircularFooter } from "@/components/ui/stacked-circular-footer";
import { Icons } from "@/components/ui/icons";
import { usePathname } from "next/navigation";

export function HeroSectionDemo() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  
  // Only show navbar on the landing page
  const isLandingPage = pathname === '/';

  useEffect(() => {
    setMounted(true);

    // Scroll to top on refresh
    window.scrollTo(0, 0);

    // Handle scroll events to change navbar appearance
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Close mobile menu when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const renderNavbar = () => {
    // Only render navbar on landing page
    if (!isLandingPage) return null;
    
    return (
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/90 backdrop-blur-md shadow-sm py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 text-primary">
              <Icons.logo className="h-full w-full" />
            </div>
            <span className="font-bold text-xl">SegakAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <nav className="flex items-center gap-8">
              <Link 
                href="/" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/onboarding">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>
    );
  };

  if (!mounted) {
    return (
      <div className="relative">
        {renderNavbar()}

        {/* Hero Section */}
        <div className="w-full">
          <HeroSection
            title="AI-Powered Fitness Companion"
            subtitle={{
              regular: "Your personalized ",
              gradient: "fitness journey",
            }}
            description="SegakAI generates tailored workout and diet plans customized to your unique goals, lifestyle, and preferences using advanced AI."
            ctaText="Get Started"
            ctaHref="/onboarding"
            bottomImage={{
              light: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=3785&auto=format&fit=crop&ixlib=rb-4.0.3",
              dark: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=3785&auto=format&fit=crop&ixlib=rb-4.0.3",
            }}
            gridOptions={{
              angle: 65,
              cellSize: 30,
              opacity: 0.2,
              lightLineColor: "#4a4a4a",
              darkLineColor: "#2a2a2a",
            }}
            className="w-full"
          />
        </div>

        {/* Footer */}
        <StackedCircularFooter />
      </div>
    );
  }

  // Client-side rendered version with animations
  return (
    <div className="relative">
      {renderNavbar()}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && isLandingPage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-background/95 backdrop-blur-sm border-b shadow-lg md:hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
              <nav className="flex flex-col gap-4">
                <Link 
                  href="/" 
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/features" 
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="/pricing" 
                  className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </nav>
              
              <div className="flex flex-col gap-2">
                <Button asChild variant="outline" size="sm" className="justify-center">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild size="sm" className="justify-center">
                  <Link href="/onboarding" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <motion.div variants={itemVariants} className="w-full">
          <HeroSection
            title="AI-Powered Fitness Companion"
            subtitle={{
              regular: "Your personalized ",
              gradient: "fitness journey",
            }}
            description="SegakAI generates tailored workout and diet plans customized to your unique goals, lifestyle, and preferences using advanced AI."
            ctaText="Get Started"
            ctaHref="/onboarding"
            bottomImage={{
              light: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=3785&auto=format&fit=crop&ixlib=rb-4.0.3",
              dark: "https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=3785&auto=format&fit=crop&ixlib=rb-4.0.3",
            }}
            gridOptions={{
              angle: 65,
              cellSize: 30,
              opacity: 0.2,
              lightLineColor: "#4a4a4a",
              darkLineColor: "#2a2a2a",
            }}
            className="w-full"
          />
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants}>
          <StackedCircularFooter />
        </motion.div>
      </motion.div>
    </div>
  );
} 