import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';

interface CharacterGenerationPhaseProps {
  // Could include progress tracking in the future
}

const CharacterGenerationPhase: React.FC<CharacterGenerationPhaseProps> = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { key: 'analyzing', text: 'Analyzing parenting preferences...' },
    { key: 'creating', text: 'Creating unique character traits...' },
    { key: 'building', text: 'Building personality profile...' },
    { key: 'finalizing', text: 'Finalizing your journey...' }
  ];

  useEffect(() => {
    // Simulate character generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update step based on progress
        if (newProgress >= 25 && currentStep === 0) setCurrentStep(1);
        else if (newProgress >= 50 && currentStep === 1) setCurrentStep(2);
        else if (newProgress >= 75 && currentStep === 2) setCurrentStep(3);
        
        return Math.min(newProgress, 95); // Keep at 95% until actual completion
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Main Loading Spinner */}
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-blue-200 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
          </div>
          
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-32 h-32 mx-auto" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="text-blue-500 transition-all duration-300 ease-out"
              style={{ transformOrigin: '50% 50%', transform: 'rotate(-90deg)' }}
            />
          </svg>
          
          {/* Progress Percentage */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {t('character_generation')}
        </h2>

        {/* Current Step */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-lg text-gray-700 font-medium">
                {steps[currentStep]?.text || 'Processing...'}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-blue-500 scale-110' 
                  : 'bg-gray-300'
              }`}
              aria-label={`Step ${index + 1}: ${step.text}`}
            />
          ))}
        </div>

        {/* Helpful Message */}
        <p className="text-gray-600 leading-relaxed">
          {t('unique_journey')}
        </p>

        {/* Accessibility Features */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Character generation in progress: {Math.round(progress)}% complete. 
          Current step: {steps[currentStep]?.text}
        </div>
      </div>
    </div>
  );
};

export default React.memo(CharacterGenerationPhase);