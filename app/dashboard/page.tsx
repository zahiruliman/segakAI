"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, FileDown, Share2, Activity, Calendar, ChevronRight, Utensils, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

// Define types to improve type safety
interface SessionResult {
  session: Session | null;
  error: Error | null;
}

interface PlansResult {
  plans: any[];
  error: Error | null;
}

export default function DashboardPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Define the fetchUserSession function as a useCallback to avoid recreation on each render
  const fetchUserSession = useCallback(async (): Promise<SessionResult> => {
    console.log("Fetching user session...");
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session fetch error:", error);
        return { session: null, error };
      }
      
      return { session: data.session, error: null };
    } catch (error) {
      console.error("Unexpected error in fetchUserSession:", error);
      return { 
        session: null, 
        error: error instanceof Error ? error : new Error("Unknown error fetching session") 
      };
    }
  }, []);

  // Define the fetchUserPlans function to get plans for a user
  const fetchUserPlans = useCallback(async (userId: string): Promise<PlansResult> => {
    console.log("Fetching plans for user:", userId);
    try {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Plans fetch error:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        return { plans: [], error };
      }
      
      console.log("Plans fetched successfully:", data?.length || 0);
      return { plans: data || [], error: null };
    } catch (error) {
      console.error("Unexpected error in fetchUserPlans:", error);
      return { 
        plans: [], 
        error: error instanceof Error ? error : new Error("Unknown error fetching plans") 
      };
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const MAX_RETRIES = 3;
    let retryCount = 0;

    const checkUser = async () => {
      try {
        // Check authentication with retries
        let sessionResult: SessionResult = { session: null, error: null };
        
        while (retryCount < MAX_RETRIES) {
          sessionResult = await fetchUserSession();
          if (sessionResult.session || retryCount >= MAX_RETRIES - 1) break;
          
          console.log(`Auth retry ${retryCount + 1}/${MAX_RETRIES}...`);
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between retries
        }

        if (!isMounted) return;

        // Handle auth errors
        if (sessionResult.error) {
          console.error("Authentication error after retries:", sessionResult.error);
          throw sessionResult.error;
        }

        // Handle no session
        if (!sessionResult.session) {
          console.log("No active session found, redirecting to login");
          router.push("/login");
          return;
        }

        // Set user if authenticated
        if (isMounted) {
          setUser(sessionResult.session.user);
          console.log("User authenticated:", sessionResult.session.user.id);
        }

        // Fetch plans for the authenticated user
        try {
          const { plans: userPlans, error: plansError } = await fetchUserPlans(sessionResult.session.user.id);
          
          if (!isMounted) return;

          if (plansError) {
            console.warn("Plans fetch warning:", plansError);
            toast.error(`Could not load your plans: ${plansError.message || "Unknown error"}`);
            // We still continue, just with empty plans
          }

          if (isMounted) {
            setPlans(userPlans);
            if (userPlans.length > 0) {
              setSelectedPlan(userPlans[0]);
            }
          }
        } catch (plansError) {
          console.error("Unexpected plans fetch error:", plansError);
          if (isMounted) {
            toast.error("Could not load your plans. Please try again later.");
          }
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        
        if (isMounted) {
          if (error instanceof Error) {
            setError(error.message);
            toast.error(`Authentication error: ${error.message}`);
          } else {
            setError("An unknown error occurred");
            toast.error("Failed to load dashboard. Please try logging in again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    // Cleanup function to prevent state updates if the component unmounts
    return () => {
      isMounted = false;
    };
  }, [router, fetchUserSession, fetchUserPlans]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCreateNewPlan = () => {
    router.push("/onboarding/form?step=1");
  };

  // Display a loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
        <div className="text-destructive mb-4">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground text-center mb-6">{error}</p>
        <Button onClick={() => router.push("/login")}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container py-8 md:py-12 mt-16"
      >
        <div className="flex flex-col md:flex-row items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Fitness Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {plans.length > 0 
                ? `You have ${plans.length} plan${plans.length === 1 ? '' : 's'}`
                : "Get started with your first personalized plan"}
            </p>
          </div>
          <Button 
            onClick={handleCreateNewPlan}
            className="mt-4 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create New Plan
          </Button>
        </div>

        {plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:rounded-xl rounded-none md:border border-x-0 md:shadow-sm overflow-hidden"
          >
            <Card className="border-dashed md:border-2 border-0 p-8 md:rounded-xl rounded-none">
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">No Plans Yet</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Create your first personalized fitness and diet plan by answering a few questions about your goals and preferences.
                  </p>
                </div>
                <Button 
                  onClick={handleCreateNewPlan}
                  className="mt-2 flex items-center gap-2"
                  size="lg"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Plan
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <div className="md:rounded-xl rounded-none md:border border-x-0 md:shadow-sm overflow-hidden">
              <Tabs defaultValue="workout" className="w-full">
                <div className="bg-muted/50 px-4 py-2 md:rounded-t-xl sticky top-[57px] z-10 backdrop-blur">
                  <TabsList className="w-full md:w-auto grid grid-cols-2 h-auto p-1 bg-muted/50">
                    <TabsTrigger value="workout" className="py-2 rounded-md data-[state=active]:bg-background">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <span>Workout Plan</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="diet" className="py-2 rounded-md data-[state=active]:bg-background">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4" />
                        <span>Diet Plan</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="workout" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
                  {selectedPlan && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">{selectedPlan.title || "Your Workout Plan"}</h2>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedPlan.created_at)}
                          </p>
                        </div>
                        <p className="text-muted-foreground">{selectedPlan.description || "Personalized workout plan based on your goals and preferences."}</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        {selectedPlan.workout_plan ? (
                          <div dangerouslySetInnerHTML={{ __html: selectedPlan.workout_plan }} />
                        ) : (
                          <p>No workout plan available.</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileDown className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Share Plan
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="diet" className="p-4 md:p-6 focus-visible:outline-none focus-visible:ring-0">
                  {selectedPlan && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h2 className="text-2xl font-bold">Your Diet Plan</h2>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedPlan.created_at)}
                          </p>
                        </div>
                        <p className="text-muted-foreground">Personalized nutrition plan based on your goals and preferences.</p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        {selectedPlan.diet_plan ? (
                          <div dangerouslySetInnerHTML={{ __html: selectedPlan.diet_plan }} />
                        ) : (
                          <p>No diet plan available.</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileDown className="h-4 w-4" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          Share Plan
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {plans.length > 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Previous Plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.slice(1).map((plan) => (
                    <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{plan.title || "Fitness Plan"}</CardTitle>
                        <CardDescription>{formatDate(plan.created_at)}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-between"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 