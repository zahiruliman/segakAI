"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, FileDown, Share2, Activity, Calendar, ChevronRight, Utensils } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error("Missing Supabase credentials");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        setUser(session.user);

        // Fetch user's plans
        const { data: userPlans, error } = await supabase
          .from("plans")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setPlans(userPlans || []);
        if (userPlans && userPlans.length > 0) {
          setSelectedPlan(userPlans[0]);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container py-8 md:py-12"
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
            className="mt-4 md:mt-0 flex items-center gap-2"
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
          >
            <Card className="border-dashed border-2 p-8">
              <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Create Your First Plan</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Get started with a personalized workout and diet plan tailored to your specific goals and lifestyle.
                  </p>
                </div>
                <Button 
                  onClick={handleCreateNewPlan}
                  size="lg"
                  className="mt-2 flex items-center gap-2"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <motion.div 
              className="lg:col-span-4 space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold">Your Plans</h2>
              <div className="space-y-3">
                {plans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-colors ${selectedPlan?.id === plan.id ? 'border-primary bg-primary/5' : ''}`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{formatDate(plan.created_at)}</p>
                            <p className="text-sm text-muted-foreground">
                              {plan.plan_data?.workoutPlan?.goal || "Custom Plan"}
                            </p>
                          </div>
                          {selectedPlan?.id === plan.id && <ChevronRight className="h-4 w-4 text-primary" />}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 flex items-center gap-2"
                onClick={handleCreateNewPlan}
              >
                <PlusCircle className="h-4 w-4" />
                Create New Plan
              </Button>
            </motion.div>

            {selectedPlan && (
              <motion.div 
                className="lg:col-span-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>Plan Details</CardTitle>
                        <CardDescription>Created on {formatDate(selectedPlan.created_at)}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <FileDown className="h-4 w-4" />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Share2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="workout">
                      <TabsList className="mb-4">
                        <TabsTrigger value="workout" className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Workout Plan
                        </TabsTrigger>
                        <TabsTrigger value="diet" className="flex items-center gap-1">
                          <Utensils className="h-4 w-4" />
                          Diet Plan
                        </TabsTrigger>
                        <TabsTrigger value="recommendations">
                          Recommendations
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="workout" className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Goal</h3>
                          <p>{selectedPlan.plan_data?.workoutPlan?.goal || "No specific goal defined"}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-medium mb-2">Weekly Schedule</h3>
                          <div className="space-y-4">
                            {selectedPlan.plan_data?.workoutPlan?.weeklySchedule ? (
                              Object.entries(selectedPlan.plan_data.workoutPlan.weeklySchedule).map(([day, exercises]: [string, any]) => (
                                <div key={day} className="rounded-md border p-4">
                                  <h4 className="font-medium capitalize mb-2">{day}</h4>
                                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    {Array.isArray(exercises) ? (
                                      exercises.map((exercise: string, i: number) => (
                                        <li key={i}>{exercise}</li>
                                      ))
                                    ) : (
                                      <li>{exercises}</li>
                                    )}
                                  </ul>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground">No weekly schedule provided</p>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="diet" className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Approach</h3>
                          <p>{selectedPlan.plan_data?.dietPlan?.approach || "No specific approach defined"}</p>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="text-lg font-medium mb-2">Daily Meals</h3>
                          <div className="space-y-4">
                            {selectedPlan.plan_data?.dietPlan?.meals ? (
                              Object.entries(selectedPlan.plan_data.dietPlan.meals).map(([meal, description]: [string, any]) => (
                                <div key={meal} className="rounded-md border p-4">
                                  <h4 className="font-medium capitalize mb-2">{meal}</h4>
                                  <p className="text-muted-foreground">{description}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-muted-foreground">No meal plan provided</p>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="recommendations" className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Additional Recommendations</h3>
                          {selectedPlan.plan_data?.recommendations ? (
                            <ul className="list-disc list-inside space-y-3 pl-2">
                              {selectedPlan.plan_data.recommendations.map((rec: string, i: number) => (
                                <li key={i} className="text-muted-foreground">{rec}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-muted-foreground">No additional recommendations provided</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
} 