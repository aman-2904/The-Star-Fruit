import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function ProgressBar({ currentStep, totalSteps, title }: ProgressBarProps) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 pt-4 pb-8">
      <p className="text-[#EC5B13] font-bold text-[11px] tracking-widest uppercase mb-2">
        STEP {currentStep} OF {totalSteps}
      </p>
      <div className="flex justify-between items-end mb-4">
        <h1 className="text-3xl md:text-4xl font-black text-[#1A1A24] font-sans tracking-tight">{title}</h1>
        <div className="text-gray-500 font-bold text-sm tracking-tight">
          {percentage}% Complete
        </div>
      </div>
      <div className="w-full h-1.5 bg-[#E8F0F8] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#1A1A24] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
