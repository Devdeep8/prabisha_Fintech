// components/ui/Stepper.tsx

import React from 'react';

interface StepperProps {
  activeStep: number;
  steps: string[];
}

const Stepper: React.FC<StepperProps> = ({ activeStep, steps }) => {
  return (
    <div className="flex items-center justify-between mb-4 w-full">
      <div className="flex space-x-2 w-full">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-sm font-medium flex-1 text-center ${
              index === activeStep
                ? 'text-blue-500 border-b-2 border-blue-500 pb-2'
                : 'text-gray-500'
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
