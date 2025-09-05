import React from 'react';

interface CheckoutStepProps {
  step: {
    id: number;
    name: string;
    href: string;
    status: 'complete' | 'current' | 'upcoming';
  };
}

const CheckoutStep: React.FC<CheckoutStepProps> = ({ step }) => {
  return (
    <li className="md:flex-1">
      {step.status === 'complete' ? (
        <div className="group flex flex-col border-l-4 border-green-600 py-2 pl-4 hover:border-green-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
          <span className="text-sm font-medium text-green-600 group-hover:text-green-800">Step {step.id}</span>
          <span className="text-sm font-medium">{step.name}</span>
        </div>
      ) : step.status === 'current' ? (
        <div className="flex flex-col border-l-4 border-green-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
          <span className="text-sm font-medium text-green-600">Step {step.id}</span>
          <span className="text-sm font-medium">{step.name}</span>
        </div>
      ) : (
        <div className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
          <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Step {step.id}</span>
          <span className="text-sm font-medium">{step.name}</span>
        </div>
      )}
    </li>
  );
};

export default CheckoutStep;