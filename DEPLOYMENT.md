# SuperMall Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup
Before deploying to Vercel, ensure you have the following environment variables configured:

#### Required Environment Variables:
```env
# Database Configuration
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/supermall?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-32-characters-long
JWT_EXPIRES_IN=7d

# Application Configuration
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=sk_live_...  # Use live keys for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Database Setup (MongoDB Atlas)
1. Create a MongoDB Atlas account at https://cloud.mongodb.com
2. Create a new cluster (M0 free tier is sufficient for development)
3. Create a database user with read/write permissions
4. Whitelist Vercel's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get your connection string and add it to environment variables

### 3. Stripe Setup
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Set up webhooks for payment processing:
   - Webhook URL: `https://your-app-name.vercel.app/api/payments/webhook`
   - Events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `payment_intent.processing`

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the project**
   ```bash
   # From your project root directory
   vercel
   
   # Follow the prompts:
   # ? Set up and deploy "~/SuperMall/super-mall"? [Y/n] y
   # ? Which scope do you want to deploy to? [your-username]
   # ? Link to existing project? [y/N] n
   # ? What's your project's name? supermall
   # ? In which directory is your code located? ./
   ```

4. **Set Environment Variables**
   ```bash
   # Add environment variables one by one
   vercel env add MONGO_URL
   vercel env add JWT_SECRET
   vercel env add STRIPE_SECRET_KEY
   # ... add all required variables
   
   # Or upload from file
   vercel env pull .env.production
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Connect GitHub Repository**
   - Go to https://vercel.com/dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required environment variables
   - Ensure they're set for Production, Preview, and Development

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

## 🔧 Post-Deployment Setup

### 1. Database Seeding
After successful deployment, seed your database with sample data:

```bash
# If using Vercel CLI, you can run:
vercel exec npm run seed

# Or manually trigger the seeding API endpoint:
curl -X POST https://your-app-name.vercel.app/api/admin/seed \
  -H "Authorization: Bearer your-admin-token"
```

### 2. Create Database Indexes
Optimize database performance by creating indexes:

```bash
# Run the indexing script
vercel exec npm run create-indexes
```

### 3. Test Payment Integration
1. Test Stripe webhooks using Stripe CLI:
   ```bash
   stripe listen --forward-to https://your-app-name.vercel.app/api/payments/webhook
   ```

2. Verify webhook endpoint in Stripe dashboard
3. Test payment flow with test cards

### 4. Create Admin Account
Create your first admin account by:
1. Registering through the app as a user
2. Manually updating the role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

## 📊 Monitoring and Analytics

### 1. Vercel Analytics
Enable Vercel Analytics for insights:
- Go to Project Settings → Analytics
- Enable Vercel Analytics
- Monitor performance and usage

### 2. Error Monitoring
Monitor application errors:
- Check Vercel Function Logs
- Set up error tracking (Sentry, LogRocket, etc.)
- Monitor Stripe webhook logs

### 3. Performance Monitoring
Monitor application performance:
- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Set up uptime monitoring

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit environment variables to git
- Use strong, unique JWT secrets
- Rotate API keys regularly

### 2. CORS Configuration
Update CORS settings for production:
```javascript
// In your API routes
const allowedOrigins = [
  'https://your-app-name.vercel.app',
  // Add your custom domain if you have one
];
```

### 3. Rate Limiting
Implement rate limiting for API endpoints:
```javascript
// Consider using vercel/edge-functions for rate limiting
```

## 🌐 Custom Domain Setup

### 1. Add Custom Domain
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed

### 2. SSL Certificate
Vercel automatically provides SSL certificates for custom domains.

## 🔄 Continuous Deployment

### 1. Automatic Deployments
Vercel automatically deploys:
- Production: pushes to `main` branch
- Preview: pushes to other branches and pull requests

### 2. Branch Protection
Set up branch protection rules in GitHub:
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are listed in package.json
   - Verify TypeScript configuration

2. **Database Connection Issues**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Ensure database user has proper permissions

3. **API Route Timeouts**
   - Vercel functions have a 10-second timeout on Hobby plan
   - Optimize database queries
   - Consider upgrading to Pro plan for longer timeouts

4. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check variable names (case-sensitive)
   - Redeploy after adding new variables

### Support Resources:
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- Stripe Documentation: https://stripe.com/docs

---

## 🎉 Success!

Your SuperMall e-commerce platform is now live! 

🔗 **Access your application:**
- Production URL: https://your-app-name.vercel.app
- Admin Dashboard: https://your-app-name.vercel.app/admin
- API Documentation: https://your-app-name.vercel.app/api

Remember to:
- Monitor application performance
- Keep dependencies updated
- Regularly backup your database
- Monitor payment transactions
- Update content and products regularly