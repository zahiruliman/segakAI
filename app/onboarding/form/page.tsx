"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormProvider, useFormContext } from "@/lib/form-context";
import { Progress } from "@/components/ui/progress";
import PersonalDetailsForm from "@/components/forms/personal-details-form";
import LifestyleForm from "@/components/forms/lifestyle-form";
import PhysicalAttributesForm from "@/components/forms/physical-attributes-form";
import FitnessGoalsForm from "@/components/forms/fitness-goals-form";
import ReviewForm from "@/components/forms/review-form";

// Wrapper component that provides form context
export default function FormPage() {
  return (
    <FormProvider>
      <MultiStepForm />
    </FormProvider>
  );
}

function MultiStepForm() {
  const { currentStep, setCurrentStep, totalSteps } = useFormContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize step from URL query parameter if available
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (!isNaN(step) && step >= 1 && step <= totalSteps + 1) {
        setCurrentStep(step);
      }
    }
  }, [searchParams, setCurrentStep, totalSteps]);

  // Update URL when step changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", currentStep.toString());
    window.history.replaceState({}, "", url.toString());
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsForm />;
      case 2:
        return <LifestyleForm />;
      case 3:
        return <PhysicalAttributesForm />;
      case 4:
        return <FitnessGoalsForm />;
      case 5:
        return <ReviewForm />;
      default:
        return <PersonalDetailsForm />;
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Tell us about yourself</h1>
        <p className="text-muted-foreground mb-6">
          Step {currentStep} of {totalSteps}
        </p>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
      </div>
      
      {renderStep()}
    </div>
  );
} 