# Payment Flow Implementation

This document describes the complete end-to-end payment flow implementation using Stripe (test mode) and MongoDB.

## Flow Overview

1. **Checkout** - User fills shipping address and selects payment method
2. **Order Creation** - System creates a pending order in MongoDB with retry logic
3. **Redirect to Payment** - User is redirected to payment page with order ID
4. **Payment Intent** - System creates a Stripe PaymentIntent
5. **Payment Processing** - User completes payment with Stripe
6. **Webhook Handling** - Stripe sends webhook to update order status
7. **Order Confirmation** - User is redirected to confirmation page
8. **Order Tracking** - User can track order status

## Implementation Details

### 1. Checkout Process (`/checkout`)

The checkout page now properly handles Stripe payments:
- When user selects Stripe as payment method, the system creates an order first with retry logic
- Then redirects to the payment page with the order ID
- For other payment methods, it creates order and redirects directly
- Implements retry mechanism for order ID conflicts

### 2. Payment Page (`/payment`)

For Stripe payments:
- Fetches the existing order details using the order ID
- Creates a PaymentIntent with the order amount and ID
- Collects card details using Stripe Elements
- Confirms payment with `stripe.confirmCardPayment()`
- Polls for order confirmation after successful payment
- Redirects to order confirmation page when webhook updates the order

### 3. Order Creation (`/api/orders`)

The order API properly creates orders with:
- Unique order IDs with collision detection
- Retry mechanism with UUID fallback for duplicate key errors
- Proper status tracking (pending → processing → shipped → delivered)
- Payment status tracking (pending → completed/failed)

### 4. Payment Intent Creation (`/api/payment/intent`)

Creates Stripe PaymentIntents with:
- Order amount in smallest currency unit
- Order ID in metadata
- Automatic payment methods enabled

### 5. Webhook Handling (`/api/payment/webhook`)

Handles Stripe webhooks for:
- `payment_intent.succeeded` - Updates order paymentStatus to 'completed' and status to 'processing'
- `payment_intent.payment_failed` - Updates order paymentStatus to 'failed' and status to 'cancelled'
- `payment_intent.canceled` - Updates order paymentStatus to 'failed' and status to 'cancelled'

### 6. Order Confirmation (`/order-confirmation`)

Displays real order data from MongoDB including:
- Order ID
- Items purchased
- Amount paid
- Payment status
- Shipping address

### 7. Order Tracking (`/track-order`)

Shows order status timeline:
- Order Placed (pending)
- Order Confirmed (processing)
- Shipped
- Delivered

## Correct Payment Flow

The implementation now follows the correct asynchronous payment flow:

1. **Frontend** → Start PaymentIntent → Collect card details
2. **Stripe** → Confirms payment
3. **Webhook** → Updates DB to mark the order as confirmed
4. **Frontend** → Polls for confirmation and redirects

This ensures that:
- Orders are only created after successful payment confirmation
- The backend doesn't reject orders due to "processing/confirming" state
- Users see accurate order status throughout the process

## Retry Logic for Order Creation

To handle order ID conflicts:
- Frontend implements retry logic with 3 attempts and 1-second delays
- Backend provides appropriate error messages for conflict detection
- System automatically resolves conflicts without user intervention

## Test Cards

Use these test cards for Stripe in test mode:

- **Successful Payment**: `4242 4242 4242 4242`
- **Payment Declined**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

## Environment Variables

Ensure these are set in `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Testing the Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the checkout page:
   ```
   http://localhost:3000/checkout
   ```

3. Complete the checkout with Stripe payment method
4. On the payment page:
   - Use test card: `4242 4242 4242 4242`
   - Enter any future expiration date and CVC
   - Complete payment
   - Wait for polling to detect order confirmation

5. Verify the flow:
   - Redirected to order confirmation page with real data
   - Check order tracking page for status updates

## Manual Testing

Run the test script:
```bash
npm run test:payment-flow
```

This will output instructions for manually testing the complete flow.