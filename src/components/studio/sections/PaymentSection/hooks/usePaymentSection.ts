// src/components/studio/sections/PaymentSection/hooks/usePaymentSection.ts
// MODIFYING: Adding state persistence integration
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useStudio } from '../../../providers/StudioProvider';
import type { PaymentSectionState } from '../types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const INITIAL_STATE: PaymentSectionState = {
  totalAmount: 299,
  status: 'idle',
  error: null
};

export function usePaymentSection() {
  const { uploadedFiles, photoInstructions } = useStudio();
  const [state, setState] = useState<PaymentSectionState>(INITIAL_STATE);

  const validateOrderState = () => {
    if (uploadedFiles.length < 10) {
      throw new Error('Please upload at least 10 photos before proceeding to payment');
    }

    const validInstructions = photoInstructions.every(instruction => 
      instruction.description.trim() !== ''
    );
    
    if (!validInstructions) {
      throw new Error('Please complete all photo instructions before proceeding to payment');
    }
  };

  const initiatePayment = async () => {
    try {
      validateOrderState();
      setState(prev => ({ ...prev, status: 'processing', error: null }));

      const response = await fetch('/api/studio/payment', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment initialization failed');
      }

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load payment provider');
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: err instanceof Error ? err.message : 'Payment failed'
      }));
    }
  };

  return {
    state: {
      ...state,
      isValid: uploadedFiles.length >= 10 && photoInstructions.every(i => i.description.trim() !== '')
    },
    initiatePayment
  };
}
