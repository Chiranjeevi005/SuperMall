# Super Mall - E-commerce Platform

A comprehensive e-commerce web application built with Next.js 15+, MongoDB, and Stripe.

## 🚀 Deployment Ready

This application is production-ready! Follow the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🌐 Vercel Frontend with Render Backend Deployment

You can deploy the frontend to Vercel and use Render as your backend service. We've already configured:

1. **API Routes**: All frontend API calls are configured to use your Render backend URL
2. **Environment Variables**: Set up to work with external backend services
3. **Vercel Configuration**: [vercel.json](vercel.json) is configured to proxy API requests to your Render backend

To deploy:

1. Deploy your backend to Render first
2. Note your Render backend URL
3. Deploy the frontend to Vercel
4. Set the `NEXT_PUBLIC_API_URL` environment variable in Vercel to your Render backend URL

Run the local verification script:
```bash
npm run deploy:vercel:local
```

## 📋 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file with the following variables (see [.env.example](.env.example) for reference):
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

3. **Seed Database** (Important for proper data display):
   ```bash
   npm run seed:all
   ```

4. **Fix Order Database Issues** (if needed):
   ```bash
   npm run fix:orders-complete
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Start Production Server**:
   ```bash
   npm start
   ```

## 🛠️ Development

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Run Tests**:
   ```bash
   npm test
   ```

3. **Lint Code**:
   ```bash
   npm run lint
   ```

4. **Verify Database Seeding**:
   ```bash
   npm run verify:data
   ```

## 📁 Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── context/          # React context providers
├── lib/              # Utility functions and database connection
├── middleware/       # Next.js middleware
├── models/           # Mongoose models
├── scripts/          # Utility scripts
├── services/         # Business logic services
├── theme/            # Theme configuration
└── utils/            # Helper functions
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Stripe payment integration
- Role-based access control
- Account lockout after failed login attempts

## 💳 Payment Integration

- Stripe integration for secure payments
- Support for multiple payment methods
- Webhook handling for payment confirmation

## 📱 Responsive Design

- Mobile-first approach
- Responsive layouts for all device sizes
- Touch-friendly interface

## 🎨 Technology Stack

- **Frontend**: Next.js 15+, React 19+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Payments**: Stripe
- **Logging**: Winston
- **Testing**: Jest

## 📄 Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deployment checklist
- [DEPLOYMENT_FIXES.md](DEPLOYMENT_FIXES.md) - Fixes for deployment issues (data mismatch between localhost and deployed output)
- [FIX_ORDERNUMBER_INDEX.md](FIX_ORDERNUMBER_INDEX.md) - Fix for MongoDB orderNumber index issues
- [GITIGNORE_GUIDE.md](GITIGNORE_GUIDE.md) - Guide to the enhanced .gitignore configuration
- [PAYMENT_FLOW.md](PAYMENT_FLOW.md) - Payment flow documentation
- [PROJECT_ENHANCEMENTS.md](PROJECT_ENHANCEMENTS.md) - Summary of all project enhancements
- [RUNNING_THE_APP.md](RUNNING_THE_APP.md) - Instructions for running the application
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Deploying frontend to Vercel with Render backend

## 🤝 Support

For deployment issues, please refer to the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) or open an issue on the repository.