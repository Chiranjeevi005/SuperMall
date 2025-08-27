# 🛍️ SuperMall - Complete E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15, TypeScript, MongoDB, and Stripe payment integration. SuperMall provides a comprehensive solution for online marketplace functionality with multi-vendor support, advanced categorization, and seamless payment processing.

## ✨ Features

### 🏪 Core E-commerce Features
- **Product Management**: Full CRUD operations for products with variants, specifications, and images
- **Advanced Categorization**: Hierarchical category system (up to 3 levels deep)
- **Multi-vendor Support**: Vendor registration, product management, and order fulfillment
- **Shopping Cart**: Persistent cart functionality with real-time updates
- **Order Management**: Complete order lifecycle from placement to delivery tracking
- **User Accounts**: Registration, authentication, and profile management

### 💳 Payment Integration
- **Stripe Integration**: Secure payment processing with multiple payment methods
- **Payment Intent**: Advanced payment flow with proper error handling
- **Webhooks**: Real-time payment status updates
- **Refund System**: Complete refund management for orders

### 🎨 User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Search & Filters**: Advanced product search with multiple filter options
- **Real-time Updates**: Dynamic cart and order status updates
- **Admin Dashboard**: Comprehensive admin panel for platform management

### 🔒 Security & Performance
- **JWT Authentication**: Secure user authentication with HTTP-only cookies
- **Role-based Access**: Admin, vendor, customer, and delivery person roles
- **Database Optimization**: Comprehensive indexing for optimal performance
- **Data Validation**: Robust server-side and client-side validation

## 🚀 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Framer Motion**: Smooth animations and transitions

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

### Payment & External Services
- **Stripe**: Payment processing platform
- **MongoDB Atlas**: Cloud database hosting

### Development Tools
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **Git**: Version control

## 📁 Project Structure

```
super-mall/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── categories/    # Category management
│   │   │   ├── products/      # Product management
│   │   │   ├── cart/          # Shopping cart
│   │   │   ├── orders/        # Order management
│   │   │   └── payments/      # Payment processing
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Authentication pages
│   │   ├── categories/        # Category pages
│   │   ├── products/          # Product pages
│   │   └── ...
│   ├── components/            # Reusable UI components
│   │   └── ui/               # Base UI components
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication context
│   └── lib/                  # Utility functions
│       ├── auth.ts           # Authentication utilities
│       ├── database.ts       # Database connection
│       └── stripe.ts         # Stripe utilities
├── models/                   # MongoDB schemas
│   ├── user.ts              # User model
│   ├── product.ts           # Product model
│   ├── category.ts          # Category model
│   ├── order.ts             # Order model
│   └── cart.ts              # Cart model
├── scripts/                 # Database scripts
│   ├── seed.ts              # Data seeding
│   └── index.ts             # Database indexing
├── public/                  # Static assets
├── .env.local              # Environment variables
├── package.json            # Dependencies and scripts
├── vercel.json            # Vercel deployment config
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or MongoDB Atlas)
- Stripe account for payments

### 1. Clone the Repository
```bash
git clone <repository-url>
cd super-mall
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017/supermall
# Or for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/supermall

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Payment Configuration (Stripe)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 4. Database Setup
```bash
# Seed the database with sample data
npm run seed

# Create database indexes for better performance
npm run create-indexes

# Analyze database performance (optional)
npm run analyze-db
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔑 Default Accounts

After seeding the database, you can use these accounts:

### Admin Account
- **Email**: admin@supermall.com
- **Password**: admin123
- **Role**: Administrator

### Vendor Accounts
- **Email**: vendor1@supermall.com (Tech Vendor)
- **Password**: vendor123
- **Role**: Vendor

- **Email**: vendor2@supermall.com (Fashion Vendor)
- **Password**: vendor123
- **Role**: Vendor

### Customer Accounts
- **Email**: customer1@example.com
- **Password**: customer123
- **Role**: Customer

- **Email**: customer2@example.com
- **Password**: customer123
- **Role**: Customer

## 📊 Database Schema

### Core Collections

#### Users
- Personal information and authentication
- Role-based access control
- Stripe customer integration
- Address and contact details

#### Categories
- Hierarchical structure (3 levels)
- SEO optimization fields
- Active/inactive status
- Parent-child relationships

#### Products
- Complete product information
- Variant support (size, color, etc.)
- Inventory management
- Vendor association
- Search optimization

#### Orders
- Order lifecycle management
- Payment integration
- Shipping information
- Order tracking

#### Carts
- User-specific shopping carts
- Real-time synchronization
- Product variants handling

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (vendor/admin)
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/[id]` - Get category details
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove cart item

### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/[id]` - Update order status

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook
- `POST /api/payments/refund` - Process refund

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Prepare for deployment**:
   ```bash
   npm run build  # Test local build
   ```

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Configure environment variables
   - Deploy automatically on git push

3. **Post-deployment setup**:
   - Configure MongoDB Atlas
   - Set up Stripe webhooks
   - Seed production database

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Category navigation
- [ ] Cart functionality
- [ ] Order placement
- [ ] Payment processing
- [ ] Admin dashboard access
- [ ] Vendor product management

### Performance Testing
```bash
# Analyze database performance
npm run analyze-db

# Monitor API response times
# Use tools like Postman or curl for API testing
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## 🔮 Future Enhancements

- [ ] Mobile app development (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Advanced recommendation engine
- [ ] Real-time chat support
- [ ] Inventory management system
- [ ] Advanced reporting tools

---

## 🎉 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for seamless deployment
- **Stripe** for robust payment processing
- **MongoDB** for flexible data storage
- **Open Source Community** for inspiration and tools

---

**Built with ❤️ for the e-commerce community**