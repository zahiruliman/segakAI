"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuLink 
} from "@/components/ui/navigation-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export function LandingNavbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    setMounted(true);

    // Check for user session
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    
    checkUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted]);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  // Only render on the client
  if (!mounted) return null;

  return (
    <AnimatePresence>
      <motion.header
        className={cn(
          "fixed top-0 w-full z-30 transition-all duration-300",
          scrolled ? "bg-background/80 backdrop-blur shadow-sm py-2" : "bg-transparent py-4"
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container flex justify-between items-center">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
              S
            </div>
            <span>SegakAI</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-6">
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    "hover:text-primary transition-colors",
                    isActive("/") ? "font-medium text-primary" : "text-foreground/80"
                  )}
                  href="/"
                >
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    "hover:text-primary transition-colors",
                    "text-foreground/80"
                  )}
                  href="#features"
                >
                  Features
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  className={cn(
                    "hover:text-primary transition-colors",
                    "text-foreground/80"
                  )}
                  href="#pricing"
                >
                  Pricing
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/onboarding">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
            
            <Button 
              className="md:hidden"
              onClick={handleLoginClick}
            >
              {user ? "Dashboard" : "Log in"}
            </Button>
          </div>
        </div>
      </motion.header>
    </AnimatePresence>
  );
} 