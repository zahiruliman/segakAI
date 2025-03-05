'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-36 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
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
    );
  }

  // Client-side rendered version with animations
  return (
    <motion.section 
      className="relative flex flex-col items-center justify-center px-4 py-24 md:py-36 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="max-w-3xl mx-auto space-y-8"
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
  );
} 