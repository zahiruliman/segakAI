"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function FitnessGoalsForm() {
  const { formData, updateFormData, currentStep, setCurrentStep } = useFormContext();
  
  // Initialize form state with existing data or defaults
  const [primaryGoal, setPrimaryGoal] = useState<string>(formData.fitnessGoals.primaryGoal || "");
  const [desiredBodyShape, setDesiredBodyShape] = useState<string>(formData.fitnessGoals.desiredBodyShape || "");
  const [efficiencyPreference, setEfficiencyPreference] = useState<string>(formData.fitnessGoals.efficiencyPreference || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form context with current form data
    updateFormData("fitnessGoals", {
      primaryGoal,
      desiredBodyShape,
      efficiencyPreference,
    });
    
    // Move to next step (review page)
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Fitness Goals & Preferences</h2>
          <p className="text-muted-foreground mb-6">
            Tell us what you'd like to achieve with your fitness journey.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="primary-goal" className="mb-2">What is your primary fitness goal?</Label>
            <RadioGroup 
              value={primaryGoal} 
              onValueChange={setPrimaryGoal}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lose-weight" id="goal-lose-weight" />
                <Label htmlFor="goal-lose-weight" className="cursor-pointer">Lose weight/body fat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="build-muscle" id="goal-build-muscle" />
                <Label htmlFor="goal-build-muscle" className="cursor-pointer">Build muscle/gain weight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="improve-fitness" id="goal-improve-fitness" />
                <Label htmlFor="goal-improve-fitness" className="cursor-pointer">Improve general fitness/stamina</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tone-up" id="goal-tone-up" />
                <Label htmlFor="goal-tone-up" className="cursor-pointer">Tone up/define muscles</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="health-reasons" id="goal-health-reasons" />
                <Label htmlFor="goal-health-reasons" className="cursor-pointer">Exercise for health reasons (e.g., manage a condition)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sport-specific" id="goal-sport-specific" />
                <Label htmlFor="goal-sport-specific" className="cursor-pointer">Train for a specific sport/event</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="maintain" id="goal-maintain" />
                <Label htmlFor="goal-maintain" className="cursor-pointer">Maintain current fitness level</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desired-body-shape" className="mb-2">What body shape/physique are you aiming for?</Label>
            <RadioGroup 
              value={desiredBodyShape} 
              onValueChange={setDesiredBodyShape}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slim" id="shape-slim" />
                <Label htmlFor="shape-slim" className="cursor-pointer">Slim/Lean</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="toned" id="shape-toned" />
                <Label htmlFor="shape-toned" className="cursor-pointer">Toned/Defined</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="athletic" id="shape-athletic" />
                <Label htmlFor="shape-athletic" className="cursor-pointer">Athletic/Fit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muscular" id="shape-muscular" />
                <Label htmlFor="shape-muscular" className="cursor-pointer">Muscular/Built</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-important" id="shape-not-important" />
                <Label htmlFor="shape-not-important" className="cursor-pointer">Not important/Focusing on health</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="efficiency-preference">What do you prefer for your workout routine?</Label>
            <Select 
              value={efficiencyPreference} 
              onValueChange={setEfficiencyPreference}
              required
            >
              <SelectTrigger id="efficiency-preference" className="max-w-md">
                <SelectValue placeholder="Select your preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quick-effective">Quick and effective workouts (30 mins or less)</SelectItem>
                <SelectItem value="balanced">Balanced workouts (30-60 mins)</SelectItem>
                <SelectItem value="comprehensive">Comprehensive workouts (60+ mins)</SelectItem>
                <SelectItem value="multiple-short">Multiple short sessions throughout the day</SelectItem>
                <SelectItem value="variable">Variable depending on the day</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              This helps us design a workout plan that matches your time constraints.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button type="submit">
          Review
        </Button>
      </div>
    </form>
  );
} 