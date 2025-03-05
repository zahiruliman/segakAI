import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneIcon, Activity, Cloud, Zap } from "lucide-react";
import { InstallPWA } from "./pwa-install";
import { LandingPageContent } from "@/components/landing-page-content";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <LandingPageContent />
    </div>
  );
}
