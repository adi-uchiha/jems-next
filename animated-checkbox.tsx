import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Choose shop system',
    subtitle: 'What is the system of your store',
  },
  {
    id: 2,
    title: 'Provide industry',
    subtitle: 'What is your industry of store',
  },
  {
    id: 3,
    title: 'Provide domain',
    subtitle: 'Provide your primary domain',
  },
  {
    id: 4,
    title: 'Connect Google Accounts',
    subtitle: 'Google Ads, Google Analytics, Google Tag Manager, and Google Search Analytics',
  },
  {
    id: 5,
    title: 'Add product URL',
    subtitle: 'Dummy data of the printing',
  },
];

const OnboardingSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulate API call for completing a step
  const completeStep = async (stepId) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCompletedSteps(prev => [...prev, stepId]);
    setCurrentStep(stepId + 1);
    setLoading(false);
  };

  // Auto-progress steps for demonstration
  useEffect(() => {
    if (currentStep <= steps.length && !loading) {
      completeStep(currentStep);
    }
  }, [currentStep]);

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200">
          {/* Animated progress line */}
          <div 
            className="absolute top-0 w-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{
              height: `${(completedSteps.length / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative space-y-8">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            
            return (
              <div 
                key={step.id}
                className={`flex items-start gap-4 transition-opacity duration-300
                  ${status === 'pending' ? 'opacity-50' : 'opacity-100'}`}
              >
                {/* Circle indicator */}
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 
                  ${status === 'completed' ? 'border-green-500 bg-green-500' : 
                    status === 'current' ? 'border-green-500 animate-pulse' : 
                    'border-gray-300'}`}
                >
                  {status === 'completed' && (
                    <Check className="w-6 h-6 text-white" />
                  )}
                  {status === 'current' && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  )}
                </div>

                {/* Text content */}
                <div className="pt-2">
                  <h3 className="font-medium text-lg">{step.title}</h3>
                  <p className="text-gray-500 text-sm">{step.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps;