"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PhysicalAttributesForm() {
  const { formData, updateFormData, currentStep, setCurrentStep } = useFormContext();
  
  // Initialize form state with existing data or defaults
  const [bodyDescription, setBodyDescription] = useState<string>(formData.physicalAttributes.bodyDescription || "");
  const [currentMealHabits, setCurrentMealHabits] = useState<string>(formData.physicalAttributes.currentMealHabits || "");
  const [exerciseKnowledge, setExerciseKnowledge] = useState<string>(formData.physicalAttributes.exerciseKnowledge || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form context with current form data
    updateFormData("physicalAttributes", {
      bodyDescription,
      currentMealHabits,
      exerciseKnowledge,
    });
    
    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Physical Attributes & Current Habits</h2>
          <p className="text-muted-foreground mb-6">
            Tell us about your current physical state and eating habits.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="body-description" className="mb-2">How would you describe your current body type?</Label>
            <RadioGroup 
              value={bodyDescription} 
              onValueChange={setBodyDescription}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skinny" id="body-skinny" />
                <Label htmlFor="body-skinny" className="cursor-pointer">Skinny - Very lean with little muscle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="slim" id="body-slim" />
                <Label htmlFor="body-slim" className="cursor-pointer">Slim - Lean but not very muscular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="average" id="body-average" />
                <Label htmlFor="body-average" className="cursor-pointer">Average - Neither particularly lean nor overweight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="athletic" id="body-athletic" />
                <Label htmlFor="body-athletic" className="cursor-pointer">Athletic - Muscular with moderate body fat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="muscular" id="body-muscular" />
                <Label htmlFor="body-muscular" className="cursor-pointer">Muscular - Significant muscle mass</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="overweight" id="body-overweight" />
                <Label htmlFor="body-overweight" className="cursor-pointer">Overweight - Carrying extra body fat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="obese" id="body-obese" />
                <Label htmlFor="body-obese" className="cursor-pointer">Obese - Significantly overweight</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="skinny-fat" id="body-skinny-fat" />
                <Label htmlFor="body-skinny-fat" className="cursor-pointer">Skinny fat - Thin but with little muscle tone</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="current-meal-habits">Current Meal Habits</Label>
            <Select 
              value={currentMealHabits} 
              onValueChange={setCurrentMealHabits}
              required
            >
              <SelectTrigger id="current-meal-habits" className="max-w-md">
                <SelectValue placeholder="Select your current meal habits" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular meals (3+ meals daily)</SelectItem>
                <SelectItem value="irregular">Irregular meals (skipping meals often)</SelectItem>
                <SelectItem value="frequent-snacking">Frequent snacking throughout the day</SelectItem>
                <SelectItem value="one-two-meals">One or two large meals per day</SelectItem>
                <SelectItem value="fasting">Intermittent fasting</SelectItem>
                <SelectItem value="diet-restricted">Following a specific diet (vegan, keto, etc.)</SelectItem>
                <SelectItem value="takeout-heavy">Primarily takeout/restaurant meals</SelectItem>
                <SelectItem value="home-cooked">Primarily home-cooked meals</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="exercise-knowledge" className="mb-2">What is your level of exercise knowledge?</Label>
            <RadioGroup 
              value={exerciseKnowledge} 
              onValueChange={setExerciseKnowledge}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="exercise-beginner" />
                <Label htmlFor="exercise-beginner" className="cursor-pointer">Beginner - New to exercise, need guidance on form and routines</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="exercise-intermediate" />
                <Label htmlFor="exercise-intermediate" className="cursor-pointer">Intermediate - Some experience, understand basic exercises</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="exercise-advanced" />
                <Label htmlFor="exercise-advanced" className="cursor-pointer">Advanced - Extensive experience, familiar with various training methods</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="professional" id="exercise-professional" />
                <Label htmlFor="exercise-professional" className="cursor-pointer">Professional - Fitness professional or athlete</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground mt-1">
              This helps us provide the appropriate level of guidance and explanation.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
} 