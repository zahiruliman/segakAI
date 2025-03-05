"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LifestyleForm() {
  const { formData, updateFormData, currentStep, setCurrentStep } = useFormContext();
  
  // Initialize form state with existing data or defaults
  const [sleepQuality, setSleepQuality] = useState<string>(formData.lifestyleDetails.sleepQuality || "");
  const [mentalHealth, setMentalHealth] = useState<string>(formData.lifestyleDetails.mentalHealth || "");
  const [familyStatus, setFamilyStatus] = useState<string>(formData.lifestyleDetails.familyStatus || "");
  const [livingArrangement, setLivingArrangement] = useState<string>(formData.lifestyleDetails.livingArrangement || "");
  const [workload, setWorkload] = useState<string>(formData.lifestyleDetails.workload || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form context with current form data
    updateFormData("lifestyleDetails", {
      sleepQuality,
      mentalHealth,
      familyStatus,
      livingArrangement,
      workload,
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
          <h2 className="text-xl font-semibold mb-4">Lifestyle & Wellbeing</h2>
          <p className="text-muted-foreground mb-6">
            Understanding your lifestyle helps us create a sustainable plan that fits into your daily routine.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="sleep-quality" className="mb-2">How would you describe your sleep quality?</Label>
            <RadioGroup 
              value={sleepQuality} 
              onValueChange={setSleepQuality}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="sleep-excellent" />
                <Label htmlFor="sleep-excellent" className="cursor-pointer">Excellent - I sleep well and wake refreshed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="sleep-good" />
                <Label htmlFor="sleep-good" className="cursor-pointer">Good - I generally sleep well</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="average" id="sleep-average" />
                <Label htmlFor="sleep-average" className="cursor-pointer">Average - My sleep is inconsistent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor" className="cursor-pointer">Poor - I have trouble sleeping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-poor" id="sleep-very-poor" />
                <Label htmlFor="sleep-very-poor" className="cursor-pointer">Very poor - I suffer from sleep deprivation</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mental-health" className="mb-2">How would you describe your current mental health?</Label>
            <RadioGroup 
              value={mentalHealth} 
              onValueChange={setMentalHealth}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="mental-excellent" />
                <Label htmlFor="mental-excellent" className="cursor-pointer">Excellent - I feel great mentally</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="mental-good" />
                <Label htmlFor="mental-good" className="cursor-pointer">Good - I generally manage stress well</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="average" id="mental-average" />
                <Label htmlFor="mental-average" className="cursor-pointer">Average - I have ups and downs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="struggling" id="mental-struggling" />
                <Label htmlFor="mental-struggling" className="cursor-pointer">Struggling - I often feel anxious or stressed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="mental-poor" />
                <Label htmlFor="mental-poor" className="cursor-pointer">Poor - I'm dealing with significant mental health challenges</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="family-status">Family Status</Label>
            <Select 
              value={familyStatus} 
              onValueChange={setFamilyStatus}
              required
            >
              <SelectTrigger id="family-status" className="max-w-md">
                <SelectValue placeholder="Select your family status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single, no children</SelectItem>
                <SelectItem value="relationship">In a relationship, no children</SelectItem>
                <SelectItem value="young-children">Parent with young children</SelectItem>
                <SelectItem value="teen-children">Parent with teenage children</SelectItem>
                <SelectItem value="adult-children">Parent with adult children</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="living-arrangement">Living Arrangement</Label>
            <Select 
              value={livingArrangement} 
              onValueChange={setLivingArrangement}
              required
            >
              <SelectTrigger id="living-arrangement" className="max-w-md">
                <SelectValue placeholder="Select your living arrangement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alone">Living alone</SelectItem>
                <SelectItem value="partner">Living with partner</SelectItem>
                <SelectItem value="family">Living with family</SelectItem>
                <SelectItem value="roommates">Living with roommates</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="workload">Typical Workload</Label>
            <Select 
              value={workload} 
              onValueChange={setWorkload}
              required
            >
              <SelectTrigger id="workload" className="max-w-md">
                <SelectValue placeholder="Select your typical workload" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light (under 20 hours/week)</SelectItem>
                <SelectItem value="moderate">Moderate (20-40 hours/week)</SelectItem>
                <SelectItem value="heavy">Heavy (40-60 hours/week)</SelectItem>
                <SelectItem value="very-heavy">Very heavy (60+ hours/week)</SelectItem>
                <SelectItem value="variable">Variable (changes frequently)</SelectItem>
                <SelectItem value="not-working">Not currently working</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              This helps us design a fitness plan that fits your schedule.
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