"use client";

import { useState } from "react";
import { useFormContext } from "@/lib/form-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PersonalDetailsForm() {
  const { formData, updateFormData, currentStep, setCurrentStep } = useFormContext();
  
  // Initialize form state with existing data or defaults
  const [age, setAge] = useState<number | undefined>(formData.personalDetails.age);
  const [gender, setGender] = useState<string>(formData.personalDetails.gender || "");
  const [culturalBackground, setCulturalBackground] = useState<string>(formData.personalDetails.culturalBackground || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form context with current form data
    updateFormData("personalDetails", {
      age,
      gender,
      culturalBackground,
    });
    
    // Move to next step
    setCurrentStep(currentStep + 1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
          <p className="text-muted-foreground mb-6">
            Tell us a bit about yourself so we can tailor your experience.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min={16}
              max={120}
              value={age || ""}
              onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              required
              placeholder="Enter your age"
              className="max-w-xs"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gender" className="mb-2">Gender</Label>
            <RadioGroup 
              value={gender} 
              onValueChange={setGender}
              className="flex flex-col space-y-2"
              required
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-binary" id="non-binary" />
                <Label htmlFor="non-binary" className="cursor-pointer">Non-binary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                <Label htmlFor="prefer-not-to-say" className="cursor-pointer">Prefer not to say</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cultural-background">Cultural Background</Label>
            <Select 
              value={culturalBackground} 
              onValueChange={setCulturalBackground}
              required
            >
              <SelectTrigger id="cultural-background" className="max-w-xs">
                <SelectValue placeholder="Select your cultural background" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="african">African</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="european">European</SelectItem>
                <SelectItem value="hispanic">Hispanic/Latino</SelectItem>
                <SelectItem value="middle-eastern">Middle Eastern</SelectItem>
                <SelectItem value="north-american">North American</SelectItem>
                <SelectItem value="oceanian">Oceanian</SelectItem>
                <SelectItem value="south-american">South American</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-1">
              This helps us provide culturally appropriate dietary and exercise recommendations.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
} 