"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          // Redirect to login if not authenticated
          router.push("/login");
          return;
        }
        setUser(user);

        // Fetch user plans
        const { data: plans, error } = await supabase
          .from("plans")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (plans && plans.length > 0) {
          setPlans(plans);
          setSelectedPlan(plans[0]);
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading your plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Fitness Dashboard</h1>

      {plans.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No Plans Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't created any workout or diet plans yet.
          </p>
          <Button asChild size="lg">
            <Link href="/onboarding/form?step=1">Create Your First Plan</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Your Plans</h2>
              <div className="space-y-2">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer ${selectedPlan?.id === plan.id ? 'border-primary' : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardHeader className="py-4">
                      <CardTitle className="text-base">
                        Plan from {formatDate(plan.created_at)}
                      </CardTitle>
                      <CardDescription className="text-xs truncate">
                        Goal: {plan.user_details?.goals?.primaryGoal?.replace('-', ' ')}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href="/onboarding/form?step=1">Create New Plan</Link>
              </Button>
            </div>
          </div>

          <div className="md:col-span-3">
            {selectedPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Personalized Plan</CardTitle>
                  <CardDescription>
                    Created on {formatDate(selectedPlan.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="workout" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="workout">Workout Plan</TabsTrigger>
                      <TabsTrigger value="diet">Diet Plan</TabsTrigger>
                      <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="workout">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Overview</h3>
                          <p className="text-muted-foreground">{selectedPlan.plan_data?.workoutPlan?.summary}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Weekly Schedule</h3>
                          <div className="space-y-4">
                            {selectedPlan.plan_data?.workoutPlan?.weeklySchedule?.map((day: any, index: number) => (
                              <Card key={index}>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-base">{day.day}: {day.focus}</CardTitle>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <div className="space-y-2">
                                    {day.exercises.map((exercise: any, exerciseIndex: number) => (
                                      <div key={exerciseIndex} className="bg-muted/50 p-3 rounded-md">
                                        <div className="flex justify-between mb-1">
                                          <span className="font-medium">{exercise.name}</span>
                                          <span className="text-muted-foreground text-sm">{exercise.sets} × {exercise.reps}</span>
                                        </div>
                                        {exercise.notes && (
                                          <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Progression Plan</h3>
                          <p className="text-muted-foreground">{selectedPlan.plan_data?.workoutPlan?.progressionPlan}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="diet">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Nutritional Approach</h3>
                          <p className="text-muted-foreground">{selectedPlan.plan_data?.dietPlan?.summary}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">Daily Calories</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>{selectedPlan.plan_data?.dietPlan?.dailyCalories}</p>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="py-3">
                              <CardTitle className="text-base">Macronutrients</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-1">
                                <p><span className="font-medium">Protein:</span> {selectedPlan.plan_data?.dietPlan?.macronutrients?.protein}</p>
                                <p><span className="font-medium">Carbs:</span> {selectedPlan.plan_data?.dietPlan?.macronutrients?.carbs}</p>
                                <p><span className="font-medium">Fats:</span> {selectedPlan.plan_data?.dietPlan?.macronutrients?.fats}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Meal Plan</h3>
                          <div className="space-y-4">
                            {selectedPlan.plan_data?.dietPlan?.mealPlan?.map((meal: any, index: number) => (
                              <Card key={index}>
                                <CardHeader className="py-3">
                                  <CardTitle className="text-base">{meal.meal}</CardTitle>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <div className="space-y-4">
                                    {meal.options.map((option: any, optionIndex: number) => (
                                      <div key={optionIndex} className="bg-muted/50 p-3 rounded-md">
                                        <h4 className="font-medium mb-2">{option.name}</h4>
                                        
                                        <div className="mb-2">
                                          <p className="text-sm font-medium text-muted-foreground mb-1">Ingredients:</p>
                                          <ul className="text-sm list-disc list-inside ml-2">
                                            {option.ingredients.map((ingredient: string, i: number) => (
                                              <li key={i}>{ingredient}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        
                                        <div className="mb-2">
                                          <p className="text-sm font-medium text-muted-foreground mb-1">Preparation:</p>
                                          <p className="text-sm">{option.preparation}</p>
                                        </div>
                                        
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground mb-1">Nutritional Info:</p>
                                          <p className="text-sm">{option.nutritionalInfo}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Hydration</h3>
                          <p className="text-muted-foreground">{selectedPlan.plan_data?.dietPlan?.hydration}</p>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="recommendations">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Workout Recommendations</h3>
                          <p className="text-muted-foreground">{selectedPlan.plan_data?.workoutPlan?.recommendations}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Diet Recommendations</h3>
                          <p className="text-muted-foreground">{selectedPlan.plan_data?.dietPlan?.recommendations}</p>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Additional Lifestyle Recommendations</h3>
                          <p className="text-muted-foreground">{selectedPlan.plan_data?.additionalRecommendations}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Download PDF</Button>
                  <Button variant="outline">Share Plan</Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 