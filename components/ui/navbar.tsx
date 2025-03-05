"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Separate component for the navbar content to avoid hooks issues
function NavbarContent({ scrolled }: { scrolled: boolean }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
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
        <Link href="/" className="font-bold text-xl">
          SegakAI
        </Link>

        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex gap-6">
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
                  isActive("/about") ? "font-medium text-primary" : "text-foreground/80"
                )}
                href="#features"
              >
                Features
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/onboarding">Sign up</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

export function Navbar() {
  // Use state to track whether we're mounted on the client
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsLandingPage(pathname === "/");
  }, [pathname]);

  useEffect(() => {
    if (!mounted || !isLandingPage) return;

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
  }, [mounted, isLandingPage]);

  // Only render on the client
  if (!mounted) return null;

  // Only render on the landing page
  if (!isLandingPage) return null;

  return (
    <AnimatePresence>
      <NavbarContent scrolled={scrolled} />
    </AnimatePresence>
  );
} 