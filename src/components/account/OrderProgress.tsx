// src/components/account/OrderProgress.tsx
'use client';

import { FC } from 'react';
import { cn } from '@/lib/utils';
import type { OrderProgress as OrderProgressType } from '@/types/orders';

interface OrderProgressProps {
  status: OrderProgressType;
  orderId: string;
}

export const OrderProgress: FC<OrderProgressProps> = ({ status, orderId }) => {
  const steps = [
    { label: 'Order Received', completed: true },
    { label: 'Images Processed', completed: status.imagesProcessed },
    { label: 'Training Initiated', completed: status.trainingInitiated },
    { label: 'Photos Generated', completed: status.imagesGenerated },
    { label: 'Order Completed', completed: status.orderCompleted }
  ] as const;

  return (
    <div className="bg-white rounded-[32px] shadow-lg p-8">
      <h3 className="text-xl font-medium text-blue-900 mb-6">
        Order Status #{orderId.slice(-6)}
      </h3>
      <div className="relative">
        <div className="absolute left-[22px] top-0 h-full w-0.5 bg-gray-200" />
        
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div 
                className={cn(
                  "relative z-10 w-11 h-11 rounded-full flex items-center justify-center border-2",
                  step.completed 
                    ? "bg-blue-900 border-blue-900" 
                    : "bg-white border-gray-300"
                )}
                title={step.completed ? "Completed" : "Pending"}
              >
                {step.completed ? (
                  <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                )}
              </div>
              <div className="ml-4">
                <p className={cn(
                  "font-medium",
                  step.completed ? "text-blue-900" : "text-gray-500"
                )}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
