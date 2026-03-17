"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingLayout from '@/components/host/OnboardingLayout';
import ProgressBar from '@/components/host/ProgressBar';
import Step1PropertyCategory from '@/components/host/steps/Step1PropertyCategory';

export default function HostOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Step 1 State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finished onboarding
      router.push('/host'); 
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/host');
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Property Category";
      default: return `Step ${currentStep} Setup`;
    }
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return selectedCategory !== null;
    return true; // Auto-pass invalid validation for unbuilt steps
  };

  return (
    <OnboardingLayout>
      <div className="w-full flex-1 flex flex-col pt-8">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          title={getStepTitle()} 
        />
        
        <div className="w-full flex-1 mt-6">
          {currentStep === 1 && (
            <Step1PropertyCategory 
              selectedCategory={selectedCategory} 
              onSelect={setSelectedCategory} 
              onBack={handleBack}
              onNext={handleNext}
              canContinue={isCurrentStepValid()}
            />
          )}
          {currentStep > 1 && (
            <div className="px-6 md:px-12 max-w-5xl mx-auto flex items-center justify-center py-20 border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Step {currentStep} Pending</h3>
                <p className="text-gray-500 font-medium">This step will be implemented based on the next design mockups.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
