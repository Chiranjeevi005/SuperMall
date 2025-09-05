# Cart and Checkout Components

This directory contains all the components related to the shopping cart and checkout functionality.

## Components

### Cart Components
- `CartItem.tsx` - Individual item in the shopping cart
- `CouponForm.tsx` - Form for applying discount coupons
- `AddToCartButton.tsx` - Button to add products to cart

### Checkout Components
- `CheckoutStep.tsx` - Step indicator in the checkout flow
- `AddressForm.tsx` - Form for entering shipping address
- `ShippingOptions.tsx` - Selection of shipping methods
- `PaymentMethods.tsx` - Selection of payment methods
- `OrderReview.tsx` - Review of order details before payment

## Pages
- `/cart/page.tsx` - Shopping cart page
- `/checkout/page.tsx` - Multi-step checkout process
- `/payment/page.tsx` - Payment processing page
- `/order-confirmation/page.tsx` - Order success confirmation
- `/customer/orders/page.tsx` - Customer order history
- `/customer/orders/[id]/page.tsx` - Detailed order view

## Context
- `CartContext.tsx` - Global state management for the shopping cart

## Services
- `paymentService.ts` - Payment processing logic
- `emailService.ts` - Email notification system

## Middleware
- `cartMiddleware.ts` - Authentication middleware for cart API routes

## Models
- `Cart.ts` - Database model for user carts
- `Order.ts` - Enhanced database model for orders

## API Routes
- `/api/cart/route.ts` - Cart operations
- `/api/orders/route.ts` - Order operations
- `/api/payment/route.ts` - Payment processing

## Features Implemented

1. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Save for later
   - Persistent storage (localStorage + database)

2. **Checkout Flow**
   - Multi-step process
   - Address management
   - Shipping options
   - Payment method selection

3. **Payment Processing**
   - Multiple payment gateways
   - Secure payment handling
   - Payment status tracking

4. **Order Management**
   - Order tracking
   - Status updates
   - Customer order history

## Security

- JWT-based authentication
- PCI DSS compliant payment processing
- HTTPS encryption
- Input validation and sanitization

## Testing

- Unit tests for cart functionality
- Model validation tests
- API route tests

## Documentation

- `CART_AND_CHECKOUT.md` - Comprehensive system documentation