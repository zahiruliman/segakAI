'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define types for our form data
type PersonalDetails = {
  age?: number;
  gender?: string;
  culturalBackground?: string;
};

type LifestyleDetails = {
  sleepQuality?: string;
  mentalHealth?: string;
  familyStatus?: string;
  livingArrangement?: string;
  workload?: string;
};

type PhysicalAttributes = {
  bodyDescription?: string;
  currentMealHabits?: string;
  exerciseKnowledge?: string;
};

type FitnessGoals = {
  primaryGoal?: string;
  desiredBodyShape?: string;
  efficiencyPreference?: string;
};

export type FormData = {
  personalDetails: PersonalDetails;
  lifestyleDetails: LifestyleDetails;
  physicalAttributes: PhysicalAttributes;
  fitnessGoals: FitnessGoals;
};

type FormContextType = {
  formData: FormData;
  updateFormData: (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
};

// Create the context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Initial form data
const initialFormData: FormData = {
  personalDetails: {},
  lifestyleDetails: {},
  physicalAttributes: {},
  fitnessGoals: {},
};

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const updateFormData = (step: keyof FormData, data: Partial<FormData[keyof FormData]>) => {
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], ...data },
    }));
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentStep,
        setCurrentStep,
        totalSteps,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

// Custom hook for using the form context
export function useFormContext() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
} 