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
  const [isBypassAuth, setIsBypassAuth] = useState(false);
  const router = useRouter();

  // Define the fetchUserSession function as a useCallback to avoid recreation on each render
  const fetchUserSession = useCallback(async (): Promise<SessionResult> => {
    console.log("Fetching user session...");
    try {
      // Check if this is a bypass session
      const bypassCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user-bypass='));
      
      if (bypassCookie) {
        console.log("Using bypass authentication");
        // Create a fake user for the bypass session
        const bypassUser = {
          id: 'bypass-user',
          email: 'user@segakai.com',
          role: 'user',
          last_sign_in_at: new Date().toISOString(),
        };
        
        // Create a fake session
        const fakeSession = {
          access_token: 'fake-access-token-for-bypass',
          refresh_token: 'fake-refresh-token-for-bypass',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          user: bypassUser,
        } as any;
        
        setIsBypassAuth(true);
        return { session: fakeSession, error: null };
      }
      
      // First try to get the session from Supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session fetch error:", error);
        return { session: null, error };
      }
      
      if (!data.session) {
        console.log("No session found in Supabase client");
        return { session: null, error: null };
      }
      
      console.log("Session retrieved successfully");
      return { session: data.session, error: null };
    } catch (error) {
      console.error("Unexpected error in fetchUserSession:", error);
      return { 
        session: null, 
        error: error instanceof Error ? error : new Error("Unknown error in session fetch") 
      };
    }
  }, []);

  // Function to fetch user plans
  const fetchUserPlans = useCallback(async (userId: string): Promise<PlansResult> => {
    console.log("Fetching plans for user:", userId);
    try {
      // If this is a bypass session, return some example plans
      if (isBypassAuth) {
        const examplePlans = [
          {
            id: 'example-plan-1',
            title: 'Sample Workout & Diet Plan',
            description: 'An example workout and diet plan for demonstration purposes.',
            created_at: new Date().toISOString(),
            workout_plan: '<h3>Weekly Workout Schedule</h3><ul><li><strong>Monday</strong>: Upper Body Focus - 3 sets of 10 push-ups, 3 sets of 10 dumbbell rows, 3 sets of 10 shoulder presses</li><li><strong>Tuesday</strong>: Cardio - 30 minutes of jogging or cycling</li><li><strong>Wednesday</strong>: Lower Body Focus - 3 sets of 12 squats, 3 sets of 10 lunges per leg, 3 sets of 15 calf raises</li><li><strong>Thursday</strong>: Rest day or light activity</li><li><strong>Friday</strong>: Full Body - Circuit of push-ups, rows, squats, and planks</li><li><strong>Weekend</strong>: Active recovery - walking, swimming, or yoga</li></ul>',
            diet_plan: '<h3>Sample Meal Plan</h3><h4>Breakfast</h4><ul><li>Oatmeal with berries and a tablespoon of honey</li><li>Greek yogurt with nuts</li><li>Green tea or coffee</li></ul><h4>Lunch</h4><ul><li>Grilled chicken salad with olive oil dressing</li><li>Whole grain bread or wrap</li><li>Fresh fruit</li></ul><h4>Dinner</h4><ul><li>Baked salmon or tofu</li><li>Steamed vegetables</li><li>Brown rice or quinoa</li></ul><h4>Snacks</h4><ul><li>Handful of nuts</li><li>Protein shake</li><li>Vegetable sticks with hummus</li></ul>'
          }
        ];
        return { plans: examplePlans, error: null };
      }
      
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Plans fetch error:", error);
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
  }, [isBypassAuth]);

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
          router.push("/login?redirect=/dashboard");
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
          
          // Retry logic for transient errors
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Retrying (${retryCount}/${MAX_RETRIES})...`);
            setTimeout(checkUser, 1000 * retryCount);
          } else if (isMounted) {
            // Redirect to login on auth error
            router.push("/login?redirect=/dashboard");
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

  const handleSignOut = async () => {
    try {
      setLoading(true);
      
      // If this is a bypass session, just clear cookies and redirect
      if (isBypassAuth) {
        // Clear all authentication cookies
        document.cookie = "sb-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "user-bypass=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        toast.success("Signed out successfully from bypass session");
        router.push("/login");
        return;
      }
      
      // Regular signout process
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      if (error instanceof Error) {
        toast.error(`Sign out failed: ${error.message}`);
      } else {
        toast.error("Sign out failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewPlan = () => {
    router.push("/onboarding/form");
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 bg-destructive/10 rounded-lg text-center">
          <h2 className="text-xl font-bold text-destructive mb-4">Error Loading Dashboard</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {isBypassAuth && (
        <div className="mb-6 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-md p-4 text-blue-800 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M12 9v4"></path>
              <path d="M12 17h.01"></path>
              <path d="M3.34 17a10 10 0 1 1 17.32 0"></path>
            </svg>
            <p className="font-medium">
              You are currently using a temporary bypass authentication. This is not a real user account.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your workout and diet plans
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            className="flex items-center gap-2"
            size="lg"
            onClick={handleCreateNewPlan}
          >
            <PlusCircle className="h-4 w-4" />
            Create New Plan
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            size="lg"
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>

      {plans.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card text-card-foreground shadow p-6 mt-8"
        >
          <div className="text-center max-w-md mx-auto py-12">
            <div className="bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Create Your First Plan</h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating a personalized workout and diet plan tailored to your specific goals and preferences.
            </p>
            <Button 
              size="lg" 
              className="flex items-center gap-2"
              onClick={handleCreateNewPlan}
            >
              <PlusCircle className="h-4 w-4" />
              Create New Plan
            </Button>
          </div>
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
              <div className="space-y-2">
                {plans.slice(1).map((plan) => (
                  <Card key={plan.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{plan.title || "Workout & Diet Plan"}</h4>
                          <p className="text-sm text-muted-foreground">
                            Created on {formatDate(plan.created_at)}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
