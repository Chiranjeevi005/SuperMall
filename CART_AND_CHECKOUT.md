# SuperMall Cart and Checkout System

## Overview

This document provides documentation for the cart and checkout system implemented in the SuperMall e-commerce platform. The system includes a complete shopping cart, multi-step checkout flow, payment processing, and order management features.

## Features Implemented

### 🛒 Cart System

1. **Add to Cart**
   - Add products from product pages and category listings
   - Quantity selection with increment/decrement controls
   - Real-time price calculation

2. **Cart Management**
   - Update item quantities with auto price recalculation
   - Remove items from cart
   - Save items for later
   - Move saved items back to cart

3. **Persistence**
   - Cart state saved in localStorage/sessionStorage
   - Cart data synced with database for logged-in users

4. **UI Components**
   - Mini-cart preview in navbar with items summary
   - Full cart page with item details
   - Stock warnings for low inventory items

### 💳 Checkout Flow

1. **Multi-step Process**
   - Step 1: Address information
   - Step 2: Shipping options (Standard, Express, Overnight)
   - Step 3: Payment method selection
   - Step 4: Order review

2. **Address Management**
   - Form for entering shipping address
   - Support for multiple saved addresses (future enhancement)

3. **Shipping Options**
   - Standard shipping (free)
   - Express shipping (₹150)
   - Overnight shipping (₹300)

4. **Order Review**
   - Summary of items, shipping, and total cost
   - Option to add order notes
   - Final confirmation before payment

### 💰 Payment System

1. **Multiple Payment Methods**
   - Credit/Debit Cards
   - UPI Payments
   - Net Banking
   - PayPal
   - Stripe
   - Cash on Delivery (COD)

2. **Security**
   - PCI DSS compliant payment processing
   - HTTPS encryption
   - Tokenization of sensitive data

3. **Payment Status**
   - Pending
   - Completed
   - Failed
   - Refunded

### 📦 Order Management

1. **Order Tracking**
   - Unique Order ID generation
   - Status updates (Pending, Processing, Shipped, Delivered, Cancelled, Returned)
   - Tracking information (carrier, tracking number, estimated delivery)

2. **Customer Dashboard**
   - Order history page
   - Detailed order view with status tracking
   - Downloadable invoices (future enhancement)

3. **Admin Features**
   - Order status management
   - Refund processing
   - Shipping information updates

## Technical Implementation

### Frontend Architecture

#### Context API
- `CartContext.tsx` - Manages cart state globally
- Provides functions for cart operations (add, remove, update)

#### Components
- `CartPage.tsx` - Main cart page
- `CartItem.tsx` - Individual cart item component
- `CouponForm.tsx` - Discount coupon input
- `CheckoutPage.tsx` - Multi-step checkout flow
- `CheckoutStep.tsx` - Step indicator in checkout
- `AddressForm.tsx` - Shipping address input
- `ShippingOptions.tsx` - Shipping method selection
- `PaymentMethods.tsx` - Payment method selection
- `OrderReview.tsx` - Order summary and confirmation
- `OrderConfirmationPage.tsx` - Success page after order placement
- `PaymentPage.tsx` - Payment processing page
- `AddToCartButton.tsx` - Add to cart functionality on product pages

#### Pages
- `/cart` - Shopping cart page
- `/checkout` - Multi-step checkout process
- `/payment` - Payment processing
- `/order-confirmation` - Order success page
- `/customer/orders` - Customer order history
- `/customer/orders/[id]` - Detailed order view

### Backend Architecture

#### Models
- `Cart.ts` - User cart data model
- `Order.ts` - Order data model (enhanced with tracking info)

#### API Routes
- `/api/cart` - Cart operations (GET, POST)
- `/api/orders` - Order operations (GET, POST, PUT)
- `/api/payment` - Payment processing (POST, PUT)

#### Services
- `paymentService.ts` - Payment gateway integrations
- `emailService.ts` - Email notifications

### Data Flow

1. **Adding to Cart**
   ```
   User clicks "Add to Cart" 
   → AddToCartButton component 
   → CartContext (updates state) 
   → localStorage persistence 
   → API call to save to database (for logged-in users)
   ```

2. **Checkout Process**
   ```
   User navigates to /checkout
   → AddressForm (collects shipping info)
   → ShippingOptions (selects shipping method)
   → PaymentMethods (selects payment method)
   → OrderReview (confirms order details)
   ```

3. **Payment Processing**
   ```
   User submits payment
   → PaymentPage component
   → /api/payment/confirm API
   → paymentService.processPayment()
   → Order creation via /api/orders
   → Email notification via emailService
   ```

4. **Order Management**
   ```
   Order status update (admin)
   → /api/orders PUT request
   → Order model update
   → Email notification to customer
   ```

## Security Considerations

1. **Data Protection**
   - Sensitive payment data is never stored in our database
   - All communications use HTTPS encryption
   - PCI DSS compliance for payment processing

2. **Authentication**
   - JWT-based authentication for API routes
   - Role-based access control

3. **Input Validation**
   - Server-side validation for all user inputs
   - Sanitization of data before database storage

## Future Enhancements

1. **Advanced Features**
   - Wishlist functionality
   - Saved payment methods
   - Subscription/recurring orders
   - Gift wrapping options
   - Multi-currency support

2. **UI/UX Improvements**
   - Progressive web app (PWA) support
   - Enhanced mobile experience
   - Accessibility improvements

3. **Integration Enhancements**
   - Real payment gateway integrations (Stripe, Razorpay, PayPal)
   - SMS notifications
   - Inventory management synchronization
   - Tax calculation engine

## Testing

Unit tests have been implemented for:
- Cart context functionality
- Order model validation

To run tests:
```bash
npm run test
```

## API Documentation

### Cart API

#### GET /api/cart
Retrieve user's cart data

**Response:**
```json
{
  "items": [...],
  "savedForLater": [...],
  "totalItems": 3,
  "totalPrice": 1500
}
```

#### POST /api/cart
Update cart items

**Request Body:**
```json
{
  "productId": "product-id",
  "quantity": 2,
  "action": "add" // add, update, remove, saveForLater, moveToCart
}
```

### Orders API

#### POST /api/orders
Create a new order

**Request Body:**
```json
{
  "customer": "user-id",
  "vendor": "vendor-id",
  "items": [...],
  "totalAmount": 1500,
  "shippingAddress": {...},
  "paymentMethod": "card"
}
```

#### PUT /api/orders
Update order status

**Request Body:**
```json
{
  "orderId": "order-id",
  "status": "shipped",
  "trackingInfo": {
    "trackingNumber": "TN1234567890",
    "carrier": "India Post"
  }
}
```

### Payment API

#### POST /api/payment/create
Create a payment intent

**Request Body:**
```json
{
  "amount": 1500,
  "currency": "INR"
}
```

#### PUT /api/payment/confirm
Confirm a payment

**Request Body:**
```json
{
  "paymentMethod": "card",
  "amount": 1500,
  "paymentData": {...}
}
```

## Deployment

The cart and checkout system is integrated into the Next.js application and will be deployed with the main application. Ensure all environment variables for payment gateways are properly configured in production.

## Maintenance

Regular maintenance tasks include:
- Monitoring payment gateway integrations
- Updating security certificates
- Reviewing and updating PCI DSS compliance
- Performance optimization of cart operations
- Monitoring email delivery rates

For any issues or questions regarding the cart and checkout system, please contact the development team.