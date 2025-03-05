import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, PhoneIcon, Activity, Cloud, Zap } from "lucide-react";

export default function Home() {
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

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        className="flex flex-col items-center justify-center px-4 py-24 md:py-36 text-center"
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
      </motion.section>

      {/* Features Section */}
      <motion.section 
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
          <Button size="lg" variant="default">
            Install App
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
