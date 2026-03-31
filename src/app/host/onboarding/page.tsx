"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import OnboardingLayout from '@/components/host/OnboardingLayout';
import ProgressBar from '@/components/host/ProgressBar';
import Step1PropertyCategory from '@/components/host/steps/Step1PropertyCategory';
import Step2PropertyLocation from '@/components/host/steps/Step2PropertyLocation';
import Step3PropertyDetails from '@/components/host/steps/Step3PropertyDetails';
import Step4PropertyPhotos, { PhotoItem } from '@/components/host/steps/Step4PropertyPhotos';
import Step5AmenitiesFeatures from '@/components/host/steps/Step5AmenitiesFeatures';
import Step6Specifications, { Step6SpecificationsData } from '@/components/host/steps/Step6Specifications';
import Step7ReviewPublish from '@/components/host/steps/Step7ReviewPublish';
import { logActivity } from '@/lib/logger';

export default function HostOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const totalSteps = 7;
  
  // Step 1 State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Step 2 State
  const [step2Data, setStep2Data] = useState({
    street: '',
    city: '',
    state: 'Goa',
    pincode: '',
    hostName: '',
    hostDescription: '',
    hostPhone: '',
    hostEmail: ''
  });

  // Step 3 State
  const [step3Data, setStep3Data] = useState({
    guests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1
  });

  // Step 4 State: array of PhotoItem objects
  const [photos, setPhotos] = useState<PhotoItem[]>([]);

  // Step 5 State: array of selected amenity IDs
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Step 6 State
  const [step6Data, setStep6Data] = useState<Step6SpecificationsData>({
    title: '',
    description: '',
    houseRules: { no_smoking: true, no_pets: false, no_parties: true },
    customRules: []
  });

  const [isLoadingDraft, setIsLoadingDraft] = useState(true);

  // Fetch existing draft on mount
  useEffect(() => {
    async function loadDraft() {
      if (!supabase) {
        setIsLoadingDraft(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
        return;
      }
      if (session.user.user_metadata?.role === 'user') {
        router.push("/");
        return;
      }

      try {
        // Query the most recently updated draft property for this user (assuming Row Level Security or a single user testing environment)
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'draft')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (data) {
          console.log("Found existing draft:", data);
          setPropertyId(data.id);
          
          if (data.category) {
            setSelectedCategory(data.category);
            setCurrentStep(2); // Auto-advance to Step 2 if Category is already saved
          }

          setStep2Data(prev => ({
            ...prev,
            street: data.street_address || '',
            city: data.city || '',
            state: data.state || 'Goa',
            pincode: data.pincode || '',
            hostName: data.host_name || '',
            hostDescription: data.host_description || '',
            hostPhone: data.host_phone || '',
            hostEmail: data.host_email || ''
          }));

          setStep3Data({
            guests: data.max_guests ?? 1,
            bedrooms: data.bedrooms ?? 1,
            beds: data.beds ?? 1,
            bathrooms: data.bathrooms ?? 1
          });

          // Hydrate Step 4 photos from saved URLs
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            setPhotos(data.images.map((url: string, i: number) => ({ id: `db-${i}`, url })));
          }

          // Hydrate Step 5 amenities
          if (data.amenities && Array.isArray(data.amenities)) {
            setSelectedAmenities(data.amenities);
          }

          // Hydrate Step 6
          if (data.listing_title || data.listing_description) {
            setStep6Data(prev => ({
              ...prev,
              title: data.listing_title || '',
              description: data.listing_description || '',
              houseRules: data.house_rules || { no_smoking: true, no_pets: false, no_parties: true },
              customRules: data.custom_rules || []
            }));
          }

          // Auto-advance logic
          if (data.street_address && data.city && data.host_name) {
             setCurrentStep(3);
             if (data.max_guests) {
               setCurrentStep(4); // Step 3 was completed
               if (data.images && data.images.length > 0) {
                 setCurrentStep(5); // Step 4 was completed
                 if (data.amenities && data.amenities.length > 0) {
                   setCurrentStep(6); // Step 5 was completed
                 }
               }
             }
          }
        }
      } catch (err) {
        // Ignore single() error if no draft exists
      } finally {
        setIsLoadingDraft(false);
      }
    }

    loadDraft();
  }, []);

  const handleNext = async () => {
    if (!supabase) {
      console.warn("Supabase not initialized, skipping save.");
      proceedToNextStep();
      return;
    }

    setIsSaving(true);
    try {
      if (currentStep === 1) {
        if (!propertyId) {
          // Get the current user's ID so we can associate the listing to this host
          const { data: { session } } = await supabase.auth.getSession();
          const hostId = session?.user?.id ?? null;

          // INSERT new draft with host_id
          const { data, error } = await supabase
            .from('properties')
            .insert({ category: selectedCategory, host_id: hostId })
            .select()
            .single();
            
          if (data) setPropertyId(data.id);
          if (error) console.error("Error creating property:", error);
        } else {
          // UPDATE existing draft
          await supabase
            .from('properties')
            .update({ category: selectedCategory })
            .eq('id', propertyId);
        }
      } else if (currentStep === 2) {
        if (propertyId) {
          await supabase
            .from('properties')
            .update({ 
              street_address: step2Data.street,
              city: step2Data.city,
              state: step2Data.state,
              pincode: step2Data.pincode,
              host_name: step2Data.hostName,
              host_description: step2Data.hostDescription,
              host_phone: step2Data.hostPhone,
              host_email: step2Data.hostEmail,
            })
            .eq('id', propertyId);
        }
      } else if (currentStep === 3) {
        if (propertyId) {
           await supabase
             .from('properties')
             .update({
               max_guests: step3Data.guests,
               bedrooms: step3Data.bedrooms,
               beds: step3Data.beds,
               bathrooms: step3Data.bathrooms
             })
             .eq('id', propertyId);
        }
      } else if (currentStep === 4) {
        if (propertyId) {
          const imageUrls = photos.filter(p => !p.url.startsWith('blob:')).map(p => p.url);
          await supabase
            .from('properties')
            .update({ images: imageUrls })
            .eq('id', propertyId);
        }
      } else if (currentStep === 5) {
        if (propertyId) {
          await supabase
            .from('properties')
            .update({ amenities: selectedAmenities })
            .eq('id', propertyId);
        }
      } else if (currentStep === 6) {
        if (propertyId) {
          // Save Step 6 data as draft — actual publishing happens on the Review page (step 7)
          await supabase
            .from('properties')
            .update({
              listing_title: step6Data.title,
              listing_description: step6Data.description,
              house_rules: step6Data.houseRules,
              custom_rules: step6Data.customRules,
            })
            .eq('id', propertyId);
        }
      }
      
      proceedToNextStep();
    } catch (err) {
      console.error("Error saving draft:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const proceedToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
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

  // Jump directly to a specific step (used by Review page Edit buttons)
  const goToStep = (step: number) => setCurrentStep(step);

  // Final publish handler — sets status to 'pending_review' for admin approval
  const handlePublish = async () => {
    if (!supabase || !propertyId) return;
    await supabase
      .from('properties')
      .update({
        listing_title: step6Data.title,
        listing_description: step6Data.description,
        house_rules: step6Data.houseRules,
        custom_rules: step6Data.customRules,
        status: 'pending_review'
      })
      .eq('id', propertyId);

    await logActivity("Submitted property for review", { 
      property_id: propertyId, 
      title: step6Data.title 
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Property Category";
      case 2: return "Property Location";
      case 3: return "Property Details";
      case 4: return "Property Photos";
      case 5: return "Amenities & Features";
      case 6: return "Specifications";
      case 7: return "Review & Publish";
      default: return `Step ${currentStep} Setup`;
    }
  };

  const isCurrentStepValid = () => {
    if (currentStep === 1) return selectedCategory !== null;
    if (currentStep === 2) {
      return step2Data.street.length > 0 && 
             step2Data.city.length > 0 && 
             step2Data.pincode.length > 0 && 
             step2Data.hostName.length > 0;
    }
    if (currentStep === 3) {
      return step3Data.guests > 0 && step3Data.bedrooms > 0 && step3Data.beds > 0 && step3Data.bathrooms > 0;
    }
    if (currentStep === 4) {
      return photos.length >= 5; // Require at least 5 photos
    }
    if (currentStep === 5) {
      return selectedAmenities.length >= 1;
    }
    if (currentStep === 6) {
      return step6Data.title.trim().length > 0 && step6Data.description.trim().length > 0;
    }
    return true;
  };

  if (isLoadingDraft) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#EC5B13] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading your draft...</p>
        </div>
      </div>
    );
  }

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
              isSaving={isSaving}
            />
          )}
          {currentStep === 2 && (
            <Step2PropertyLocation 
              formData={step2Data}
              setFormData={setStep2Data}
              onBack={handleBack}
              onNext={handleNext}
              canContinue={isCurrentStepValid()}
              isSaving={isSaving}
            />
          )}
          {currentStep === 3 && (
            <Step3PropertyDetails 
              formData={step3Data}
              setFormData={setStep3Data}
              onBack={handleBack}
              onNext={handleNext}
              canContinue={isCurrentStepValid()}
              isSaving={isSaving}
            />
          )}
          {currentStep === 4 && (
            <Step4PropertyPhotos
              photos={photos}
              setPhotos={setPhotos}
              propertyId={propertyId}
              onBack={handleBack}
              onNext={handleNext}
              canContinue={isCurrentStepValid()}
              isSaving={isSaving}
            />
          )}
          {currentStep === 5 && (
            <Step5AmenitiesFeatures
              selectedAmenities={selectedAmenities}
              setSelectedAmenities={setSelectedAmenities}
              onBack={handleBack}
              onNext={handleNext}
              canContinue={isCurrentStepValid()}
              isSaving={isSaving}
            />
          )}
          {currentStep === 6 && (
            <Step6Specifications
              formData={step6Data}
              setFormData={setStep6Data}
              onBack={handleBack}
              onNext={handleNext}
              canContinue={isCurrentStepValid()}
              isSaving={isSaving}
            />
          )}
          {currentStep === 7 && (
            <Step7ReviewPublish
              category={selectedCategory}
              step2Data={step2Data}
              step3Data={step3Data}
              photos={photos}
              selectedAmenities={selectedAmenities}
              step6Data={step6Data}
              propertyId={propertyId}
              onBack={handleBack}
              onPublish={handlePublish}
              onGoToStep={goToStep}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
