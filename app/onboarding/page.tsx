"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new signup page
    router.push("/signup");
  }, [router]);

  return null; // No need to render anything as we're redirecting
} 