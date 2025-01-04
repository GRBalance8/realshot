// src/components/studio/sections/PaymentSection/types.ts
export interface PaymentSectionState {
  totalAmount: number;
  status: 'idle' | 'processing' | 'error';
  error: string | null;
  isValid?: boolean;
}
