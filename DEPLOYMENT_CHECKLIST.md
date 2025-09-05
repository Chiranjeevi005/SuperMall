# Deployment Checklist

## Pre-deployment Tasks

### 1. Environment Configuration
- [ ] Update `.env` file with production values:
  - `MONGODB_URI` - Production MongoDB connection string
  - `JWT_SECRET` - Strong secret key for JWT tokens
  - `REFRESH_TOKEN_SECRET` - Strong secret key for refresh tokens
  - `STRIPE_SECRET_KEY` - Production Stripe secret key
  - `STRIPE_PUBLISHABLE_KEY` - Production Stripe publishable key
  - `STRIPE_WEBHOOK_SECRET` - Production Stripe webhook secret
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Production Stripe publishable key

### 2. Database Verification
- [ ] Run order fix script: `npm run fix:orders-complete`
- [ ] Verify fix: `npm run verify:orders-fix`
- [ ] Confirm all indexes are properly configured
- [ ] Confirm no documents have null orderId values

### 3. Code Verification
- [ ] Ensure all environment variables are properly used in code
- [ ] Remove any mock implementations for production
- [ ] Verify database connection handling throws errors in production
- [ ] Confirm Stripe integration uses production keys

### 4. Build Process
- [ ] Run build locally: `npm run build`
- [ ] Check for any build errors or warnings
- [ ] Verify all assets are properly compiled

### 5. Testing
- [ ] Test user registration flow
- [ ] Test user login/logout flow
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Test payment processing with Stripe
- [ ] Test order confirmation and tracking
- [ ] Test admin functionality (if applicable)

## Deployment Steps

### For Vercel:
1. Push code to Git repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### For Other Platforms:
1. Ensure Node.js 18+ is available
2. Clone repository to server
3. Install dependencies: `npm install`
4. Set environment variables
5. Build application: `npm run build`
6. Start application: `npm start`

## Post-deployment Verification

### 1. Application Health
- [ ] Verify application is accessible
- [ ] Check all pages load correctly
- [ ] Verify API endpoints respond properly
- [ ] Test database connectivity

### 2. Critical Functionality
- [ ] Test user authentication
- [ ] Test payment processing
- [ ] Verify order creation workflow
- [ ] Check email notifications (if applicable)

### 3. Monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring

## Troubleshooting

### Common Issues:
1. **Environment Variables Not Set**: Ensure all required environment variables are configured
2. **Database Connection Failed**: Verify MongoDB connection string and network access
3. **Stripe Integration Issues**: Confirm Stripe keys are correct and webhook is configured
4. **Build Failures**: Check for TypeScript errors or missing dependencies

### Support:
If you encounter issues during deployment, check:
- Application logs
- Database connection logs
- Stripe dashboard for webhook events
- Vercel/Platform logs for build errors