// src/components/studio/sections/PaymentSection/index.tsx
import { Card } from '@/components/studio/components/Card';
import { Button } from '@/components/studio/components/Button';
import { ErrorMessage } from '@/components/studio/components/ErrorMessage';
import { usePaymentSection } from './hooks/usePaymentSection';

export function PaymentSection() {
  const { state, initiatePayment } = usePaymentSection();

  return (
    <div className="studio-section">
      <div className="text-center mb-12">
        <h1 className="studio-heading">Complete Your Order</h1>
        <p className="studio-subheading">
          You're just one step away from transforming your dating profile
        </p>
      </div>

      {state.error && <ErrorMessage message={state.error} />}

      <Card className="mb-12">
        <div className="border-b border-gray-100 p-8">
          <h2 className="font-serif text-3xl text-blue-900 mb-3">Order Summary</h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Personalized AI model and custom photo package</p>
            <p className="text-2xl font-medium text-blue-900">${state.totalAmount}</p>
          </div>
        </div>

        <div className="p-8">
          <Button 
            onClick={initiatePayment}
            loading={state.status === 'processing'}
            className="w-full"
          >
            Complete Order
          </Button>
        </div>
      </Card>

      <div className="flex justify-center items-center space-x-12">
        <div className="flex items-center text-gray-600 space-x-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm0-10h12" />
          </svg>
          <span>Secure Payment</span>
        </div>

        <div className="flex items-center text-gray-600 space-x-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>SSL Encrypted</span>
        </div>

        <div className="flex items-center text-gray-600 space-x-2">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M5 13l4 4L19 7" />
          </svg>
          <span>Satisfaction Guaranteed</span>
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Questions?{' '}
          <a 
            href="mailto:support@realshot.ai" 
            className="text-blue-900 hover:text-accent transition-colors"
          >
            We're here to help!
          </a>
        </p>
      </div>
    </div>
  );
}
