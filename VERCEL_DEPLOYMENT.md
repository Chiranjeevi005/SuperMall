# Vercel Frontend Deployment with Render Backend

This document explains how to deploy the Super Mall frontend to Vercel while using Render as the backend service.

## 🏗️ Architecture Overview

- **Frontend**: Deployed to Vercel (this Next.js application)
- **Backend**: Deployed to Render (API services)
- **Database**: MongoDB Atlas
- **Payments**: Stripe

## 📁 Configuration Changes Made

We've made the following changes to enable Vercel deployment with Render backend:

### 1. Vercel Configuration ([vercel.json](vercel.json))

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://supermall-cevd.onrender.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### 2. Frontend API Calls Updated

All frontend pages have been updated to use the Render backend URL:

- Products page ([src/app/products/page.tsx](src/app/products/page.tsx))
- Vendors page ([src/app/vendors/page.tsx](src/app/vendors/page.tsx))
- Categories page ([src/app/categories/page.tsx](src/app/categories/page.tsx))
- Checkout page ([src/app/checkout/page.tsx](src/app/checkout/page.tsx))
- Payment page ([src/app/payment/page.tsx](src/app/payment/page.tsx))
- Order confirmation page ([src/app/order-confirmation/page.tsx](src/app/order-confirmation/page.tsx))
- Track order page ([src/app/track-order/page.tsx](src/app/track-order/page.tsx))

### 3. Environment Variables

The frontend uses `NEXT_PUBLIC_API_URL` to determine the backend API endpoint:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supermall-cevd.onrender.com';
```

## 🚀 Deployment Steps

### 1. Deploy Backend to Render First

1. Push your backend code to a Git repository
2. Create a new web service on Render
3. Connect your repository
4. Set environment variables in Render dashboard:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Strong secret key for JWT tokens
   - `REFRESH_TOKEN_SECRET` - Strong secret key for refresh tokens
   - `STRIPE_SECRET_KEY` - Production Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY` - Production Stripe publishable key
   - `STRIPE_WEBHOOK_SECRET` - Production Stripe webhook secret
5. Deploy and note your Render service URL

### 2. Deploy Frontend to Vercel

You can deploy using either the Vercel dashboard or the Vercel CLI:

#### Option A: Deploy via Vercel Dashboard

1. Push your frontend code to a Git repository
2. Sign up/login to [Vercel](https://vercel.com)
3. Create a new project and import your repository
4. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (from your [`.env.local`](.env.local) file)
   - `NEXT_PUBLIC_API_URL` - Your Render backend URL (e.g., `https://your-app.onrender.com`)
5. Update [vercel.json](vercel.json) routes to point to your Render backend URL if different from the default
6. Deploy!

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel --yes
   ```

4. For subsequent deployments to production:
   ```bash
   vercel --prod
   ```

### 3. Update Vercel Configuration (If Needed)

If your Render backend URL is different from `https://supermall-cevd.onrender.com`, update the routes in [vercel.json](vercel.json):

```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR-RENDER-URL.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

## 🧪 Local Verification

Run the local verification script to check your deployment configuration:

```bash
npm run deploy:vercel:local
```

## 🛠️ Troubleshooting

### Common Issues

1. **API Calls Not Working**:
   - Check that [vercel.json](vercel.json) routes are correctly configured
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Ensure Render backend is deployed and running

2. **Environment Variables Not Set**:
   - Double-check all required environment variables are configured in Vercel dashboard
   - Ensure variable names match exactly

3. **CORS Issues**:
   - Make sure your Render backend has proper CORS configuration
   - Check that headers are set correctly in API responses

### Support

If you encounter issues during deployment:
1. Check application logs in Vercel and Render dashboards
2. Verify all environment variables are set correctly
3. Ensure network access is configured properly
4. Check platform-specific documentation for Vercel and Render

## 🎉 Success!

Your Super Mall frontend is now configured for deployment to Vercel with Render as the backend service. With proper environment configuration and following this guide, your application should run smoothly.