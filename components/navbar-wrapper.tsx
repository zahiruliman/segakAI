"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  
  // Don't render the Navbar on the home page
  if (pathname === "/") {
    return null;
  }
  
  return <Navbar />;
} 