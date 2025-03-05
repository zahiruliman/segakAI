import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneIcon, Activity, Cloud, Zap } from "lucide-react";
import { InstallPWA } from "./pwa-install";
import { HeroSectionDemo } from "@/components/ui/hero-section-demo";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <HeroSectionDemo />
    </div>
  );
}
