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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User, Home, Settings, LogOut, Menu } from "lucide-react";

// Mobile navigation component
function MobileNav({ user }: { user: any | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="px-2 py-6">
          <Link href="/" className="font-bold text-xl flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
              S
            </div>
            <span>SegakAI</span>
          </Link>
          <nav className="flex flex-col space-y-3">
            {user ? (
              <>
                <div className="flex flex-col space-y-1 mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user.email} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-[180px]">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </div>
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                    isActive("/dashboard") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  )}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                    isActive("/profile") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                    isActive("/login") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  )}
                >
                  Log in
                </Link>
                <Link 
                  href="/onboarding" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="mt-auto px-2 py-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Theme</p>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Desktop navigation content
function NavbarContent({ 
  scrolled, 
  isLandingPage, 
  user 
}: { 
  scrolled: boolean; 
  isLandingPage: boolean;
  user: any | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 w-full z-30 transition-all duration-300",
        scrolled || !isLandingPage ? "bg-background/80 backdrop-blur shadow-sm py-2" : "bg-transparent py-4"
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-4">
          <MobileNav user={user} />
          
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
              S
            </div>
            <span>SegakAI</span>
          </Link>

          <NavigationMenu className="hidden md:flex ml-6">
            <NavigationMenuList className="gap-6">
              {isLandingPage ? (
                <>
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
                </>
              ) : user ? (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={cn(
                        "hover:text-primary transition-colors flex items-center gap-1",
                        isActive("/dashboard") ? "font-medium text-primary" : "text-foreground/80"
                      )}
                      href="/dashboard"
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              ) : null}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full md:h-9 md:w-9">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9">
                    <AvatarImage src="" alt={user.email} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.id}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Button asChild variant="ghost">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/onboarding">Sign up</Link>
              </Button>
            </div>
          )}
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
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsLandingPage(pathname === "/");

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
  }, [pathname]);

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

  // Only render on the client
  if (!mounted) return null;

  return (
    <AnimatePresence>
      <NavbarContent scrolled={scrolled} isLandingPage={isLandingPage} user={user} />
    </AnimatePresence>
  );
} 