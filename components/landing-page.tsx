'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneIcon, Activity, Cloud, Zap, Menu, X } from "lucide-react";
import { InstallPWA } from "@/app/pwa-install";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

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

  // If not mounted, render a simplified version without animations to avoid hydration issues
  if (!mounted) {
    return (
      <>
        {/* Navbar - Static version */}
        <header
          className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled
              ? "bg-background/80 backdrop-blur-md shadow-sm py-2"
              : "bg-transparent py-4"
          )}
        >
          <div className="container mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl">SegakAI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="#features" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link 
                href="#testimonials" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
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

        {/* Hero Section - Static version */}
        <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-36 text-center">
          <div className="max-w-3xl mx-auto space-y-8 mt-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Your <span className="text-primary">Personalized</span> Fitness Journey Starts Here
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-prose mx-auto">
              SegakAI generates tailored workout and diet plans customized to your unique goals, lifestyle, and preferences using advanced AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild size="lg" className="font-medium group">
                <Link href="/onboarding" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          </div>
        </section>

        {/* Features Section - Static version */}
        <section id="features" className="py-20 bg-muted/40">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose SegakAI?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Personalized Plans</h3>
                <p className="text-muted-foreground">Workout and diet plans tailored to your unique goals and lifestyle.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">Cutting-edge AI technology that understands your specific needs.</p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground">Monitor your fitness journey with an intuitive dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PWA Install CTA - Static version */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-6">
              <PhoneIcon className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Take SegakAI Anywhere</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Install our app on your device for a better experience and offline access to your fitness plans.
            </p>
            <InstallPWA size="lg" variant="default">
              Install App
            </InstallPWA>
          </div>
        </section>
      </>
    );
  }

  // Client-side rendered version with animations
  return (
    <>
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm py-2"
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">SegakAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="#features" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link 
              href="#testimonials" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-background border-b"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <Link 
                  href="#features" 
                  className="text-sm font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  href="#how-it-works" 
                  className="text-sm font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link 
                  href="#testimonials" 
                  className="text-sm font-medium py-2 hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Testimonials
                </Link>
                <div className="border-t my-2"></div>
                <Button asChild variant="outline" className="w-full" size="sm">
                  <Link 
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full" size="sm">
                  <Link 
                    href="/onboarding"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="relative flex flex-col items-center justify-center px-4 py-24 md:py-36 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="max-w-3xl mx-auto space-y-8 mt-16"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            variants={itemVariants}
          >
            Your <span className="text-primary">Personalized</span> Fitness Journey Starts Here
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-prose mx-auto"
            variants={itemVariants}
          >
            SegakAI generates tailored workout and diet plans customized to your unique goals, lifestyle, and preferences using advanced AI.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            variants={itemVariants}
          >
            <Button asChild size="lg" className="font-medium group">
              <Link href="/onboarding" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className="py-20 bg-muted/40"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SegakAI?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Personalized Plans</h3>
              <p className="text-muted-foreground">Workout and diet plans tailored to your unique goals and lifestyle.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">Cutting-edge AI technology that understands your specific needs.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your fitness journey with an intuitive dashboard.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* PWA Install CTA */}
      <motion.section 
        className="py-16 bg-primary/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <PhoneIcon className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Take SegakAI Anywhere</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Install our app on your device for a better experience and offline access to your fitness plans.
          </p>
          <InstallPWA size="lg" variant="default">
            Install App
          </InstallPWA>
        </div>
      </motion.section>
    </>
  );
} 