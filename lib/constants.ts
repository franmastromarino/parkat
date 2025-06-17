export const PAYMENT_STATE_COLORS = {
  Pago: '#F97316',      // Orange
  Gratuito: '#10B981',  // Green
  Exclusivo: '#3B82F6'  // Blue
} as const;

export type PaymentState = keyof typeof PAYMENT_STATE_COLORS;