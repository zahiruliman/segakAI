"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/lib/form-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";

export default function ReviewForm() {
  const { formData, currentStep, setCurrentStep } = useFormContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to generate a plan");
      }

      // Call API to generate plan
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userDetails: {
            ...formData.personalDetails,
            lifestyle: formData.lifestyleDetails,
            physicalAttributes: formData.physicalAttributes,
            goals: formData.fitnessGoals
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate plan");
      }

      // Redirect to dashboard to view the generated plan
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Review Your Information</h2>
        <p className="text-muted-foreground mb-6">
          Please review the information you've provided before we generate your personalized plan.
        </p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Your basic personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Age</p>
                  <p>{formData.personalDetails.age}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gender</p>
                  <p className="capitalize">{formData.personalDetails.gender?.replace('-', ' ')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cultural Background</p>
                <p className="capitalize">{formData.personalDetails.culturalBackground?.replace('-', ' ')}</p>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentStep(1)}
                >
                  Edit Personal Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lifestyle">
          <Card>
            <CardHeader>
              <CardTitle>Lifestyle & Wellbeing</CardTitle>
              <CardDescription>Information about your lifestyle and wellbeing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sleep Quality</p>
                  <p className="capitalize">{formData.lifestyleDetails.sleepQuality?.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mental Health</p>
                  <p className="capitalize">{formData.lifestyleDetails.mentalHealth?.replace('-', ' ')}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Family Status</p>
                  <p className="capitalize">{formData.lifestyleDetails.familyStatus?.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Living Arrangement</p>
                  <p className="capitalize">{formData.lifestyleDetails.livingArrangement?.replace('-', ' ')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Workload</p>
                <p className="capitalize">{formData.lifestyleDetails.workload?.replace('-', ' ')}</p>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentStep(2)}
                >
                  Edit Lifestyle Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="physical">
          <Card>
            <CardHeader>
              <CardTitle>Physical Attributes & Habits</CardTitle>
              <CardDescription>Information about your physical state and habits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Body Description</p>
                <p className="capitalize">{formData.physicalAttributes.bodyDescription?.replace('-', ' ')}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Meal Habits</p>
                <p className="capitalize">{formData.physicalAttributes.currentMealHabits?.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exercise Knowledge</p>
                <p className="capitalize">{formData.physicalAttributes.exerciseKnowledge}</p>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentStep(3)}
                >
                  Edit Physical Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Goals & Preferences</CardTitle>
              <CardDescription>Information about what you want to achieve</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Primary Goal</p>
                <p className="capitalize">{formData.fitnessGoals.primaryGoal?.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Desired Body Shape</p>
                <p className="capitalize">{formData.fitnessGoals.desiredBodyShape?.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Workout Preference</p>
                <p className="capitalize">{formData.fitnessGoals.efficiencyPreference?.replace('-', ' ')}</p>
              </div>
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentStep(4)}
                >
                  Edit Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mt-4">
          {error}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              Generating...
            </>
          ) : (
            "Generate My Plan"
          )}
        </Button>
      </div>
    </div>
  );
} 