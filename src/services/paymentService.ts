import Stripe from 'stripe';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'failed';
  client_secret: string;
}

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  errorMessage?: string;
  redirectUrl?: string;
}

class PaymentService {
  private stripe: Stripe;

  constructor() {
    // Initialize Stripe with the secret key
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-08-27.basil',
    });
  }

  // Create a payment intent (for Stripe-like payment gateways)
  async createPaymentIntent(amount: number, currency: string = 'inr'): Promise<PaymentIntent> {
    try {
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in smallest currency unit (paise for INR)
        currency: currency,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status as PaymentIntent['status'],
        client_secret: paymentIntent.client_secret!
      };
    } catch (error: any) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  // Process payment with different methods
  async processPayment(
    method: string,
    amount: number,
    paymentData: any,
    orderId?: string
  ): Promise<PaymentResult> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (method) {
        case 'cod':
          // Cash on Delivery - no payment processing needed
          return {
            success: true,
            orderId: orderId || `ORD-${Date.now()}`
          };
          
        case 'card':
          // For card payments, we now use Stripe on the frontend
          // This is kept for backward compatibility
          if (paymentData.paymentIntentId && paymentData.paymentMethodId) {
            // Confirm the payment intent
            const paymentIntent = await this.stripe.paymentIntents.confirm(
              paymentData.paymentIntentId,
              { payment_method: paymentData.paymentMethodId }
            );
            
            if (paymentIntent.status === 'succeeded') {
              return {
                success: true,
                orderId: orderId || `ORD-${Date.now()}`
              };
            } else {
              return {
                success: false,
                errorMessage: 'Payment failed'
              };
            }
          } else {
            return {
              success: false,
              errorMessage: 'Invalid payment details'
            };
          }
          
        case 'upi':
          // Simulate UPI payment processing
          if (paymentData.upiId) {
            return {
              success: true,
              orderId: orderId || `ORD-${Date.now()}`
            };
          } else {
            return {
              success: false,
              errorMessage: 'Invalid UPI ID'
            };
          }
          
        case 'netbanking':
          // Simulate Net Banking payment processing
          if (paymentData.bankId) {
            return {
              success: true,
              redirectUrl: `/payment/netbanking/${paymentData.bankId}?amount=${amount}&orderId=${orderId}`
            };
          } else {
            return {
              success: false,
              errorMessage: 'Invalid bank selection'
            };
          }
          
        case 'paypal':
          // Simulate PayPal payment processing
          return {
            success: true,
            redirectUrl: `/payment/paypal/redirect?orderId=${orderId}`
          };
          
        case 'stripe':
          // For Stripe, the payment is processed on the frontend
          // This is kept for backward compatibility
          return {
            success: true,
            orderId: orderId || `ORD-${Date.now()}`
          };
          
        default:
          return {
            success: false,
            errorMessage: 'Unsupported payment method'
          };
      }
    } catch (error: any) {
      return {
        success: false,
        errorMessage: `Payment processing failed: ${error.message}`
      };
    }
  }

  // Refund a payment
  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    try {
      // Create a refund
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined // Convert to smallest currency unit
      });

      return {
        success: true,
        orderId: refund.payment_intent as string
      };
    } catch (error: any) {
      return {
        success: false,
        errorMessage: `Refund failed: ${error.message}`
      };
    }
  }

  // Verify payment status
  async verifyPayment(paymentId: string): Promise<{ status: string; orderId?: string }> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      
      return {
        status: paymentIntent.status,
        orderId: paymentIntent.metadata?.orderId
      };
    } catch (error: any) {
      throw new Error(`Failed to verify payment: ${error.message}`);
    }
  }
}

export default new PaymentService();