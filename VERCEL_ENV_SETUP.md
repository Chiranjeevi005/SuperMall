# Setting Environment Variables in Vercel Dashboard

This guide will walk you through setting the required environment variables in the Vercel dashboard to successfully deploy your Super Mall application.

## Step-by-Step Instructions

### 1. Access Your Vercel Project

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in to your Vercel account
3. Find your Super Mall project in the list of projects
4. Click on the project name to access the project dashboard

### 2. Navigate to Environment Variables Settings

1. In your project dashboard, click on the "Settings" tab
2. In the left sidebar, click on "Environment Variables"

### 3. Add Required Environment Variables

You need to add these two environment variables:

#### Variable 1: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

1. Click the "Add" button
2. In the "Key" field, enter:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   ```
3. In the "Value" field, enter:
   ```
   pk_test_51S0mgIC3epDJYUCX65Pc4krOpWgtN1ulXltemgAo661PmhefeXbs6TBIT5CNORrL39TWEnfHIyupSZdnAg9X4Iak00CNZg0h3I
   ```
4. In the "Environment" dropdown, select:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click "Add"

#### Variable 2: NEXT_PUBLIC_API_URL

1. Click the "Add" button again
2. In the "Key" field, enter:
   ```
   NEXT_PUBLIC_API_URL
   ```
3. In the "Value" field, enter:
   ```
   https://supermall-cevd.onrender.com
   ```
4. In the "Environment" dropdown, select:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click "Add"

### 4. Verify Your Environment Variables

After adding both variables, you should see them listed in your environment variables table:

| Key | Value | Environment |
|-----|-------|-------------|
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | pk_test_... | Production, Preview, Development |
| NEXT_PUBLIC_API_URL | https://supermall-cevd.onrender.com | Production, Preview, Development |

### 5. Redeploy Your Application

After setting the environment variables, you need to redeploy your application for the changes to take effect:

1. Go back to your project overview (click on "Overview" in the left sidebar)
2. Click the "Deployments" tab
3. Find your latest deployment
4. Click the "Redeploy" button next to it
5. In the redeployment dialog, make sure to check "Use existing Build Cache"
6. Click "Redeploy"

## Troubleshooting

### If You Still See Environment Variable Errors

1. Double-check that both environment variables are spelled exactly as shown above
2. Ensure that all three environments (Production, Preview, Development) are selected for each variable
3. Make sure there are no extra spaces before or after the key or value
4. Verify that your Render backend is running at https://supermall-cevd.onrender.com

### If Your Application Still Doesn't Work After Deployment

1. Check the deployment logs for any error messages
2. Verify that your Render backend is properly deployed and accessible
3. Make sure your MongoDB database is populated with data
4. Check that all required environment variables are also set in your Render dashboard

## Need Help?

If you continue to experience issues:

1. Check the Vercel documentation: [https://vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables)
2. Review the Render documentation: [https://render.com/docs/environment-variables](https://render.com/docs/environment-variables)
3. Contact support if needed