# Super Mall Web Application

A complete e-commerce web application for managing shops, products, and offers in a mall environment. Built with Next.js, TypeScript, Tailwind CSS, MongoDB, and Vercel.

## Features

### Admin Panel
- Secure login with JWT authentication
- Create and manage shop details
- Manage offers and discounts
- Manage product categories and mall floors

### User Features
- Browse shops by category and floor
- View product listings with filtering options
- Compare product costs and features
- View current offers and discounts
- Floor-wise navigation

## Tech Stack

- **Frontend**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Logging**: Winston structured logging
- **Deployment**: Vercel (frontend & backend), MongoDB Atlas (database)

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── api/             # API routes
│   ├── login/           # Login page
│   ├── register/        # Registration page
│   ├── shops/           # Shops listing and details
│   ├── products/        # Products listing and details
│   ├── offers/          # Offers listing and details
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # Reusable UI components
├── lib/                 # Database connection and utilities
├── middleware/          # Authentication middleware
├── models/              # Mongoose data models
├── services/            # Business logic services
└── utils/               # Utility functions
```

## Data Models

### User
- name: string
- email: string (unique)
- password: string (hashed)
- role: enum ['admin', 'merchant', 'customer']

### Shop
- name: string
- description: string
- owner: reference to User
- location: { floor: number, section: string }
- contact: { phone, email, address }
- categories: array of strings
- isActive: boolean

### Product
- name: string
- description: string
- price: number
- shop: reference to Shop
- category: string
- images: array of URLs
- stock: number
- isActive: boolean
- features: array of { name, value }

### Offer
- title: string
- description: string
- discountType: enum ['percentage', 'fixed']
- discountValue: number
- startDate: Date
- endDate: Date
- shop: reference to Shop
- products: array of references to Products
- isActive: boolean

### Category
- name: string (unique)
- description: string
- icon: URL
- isActive: boolean

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Shops
- GET `/api/shops` - List shops with filtering
- POST `/api/shops` - Create a new shop
- GET `/api/shops/[id]` - Get shop details
- PUT `/api/shops/[id]` - Update shop
- DELETE `/api/shops/[id]` - Delete shop

### Products
- GET `/api/products` - List products with filtering
- POST `/api/products` - Create a new product
- GET `/api/products/[id]` - Get product details
- PUT `/api/products/[id]` - Update product
- DELETE `/api/products/[id]` - Delete product

### Offers
- GET `/api/offers` - List offers with filtering
- POST `/api/offers` - Create a new offer
- GET `/api/offers/[id]` - Get offer details
- PUT `/api/offers/[id]` - Update offer
- DELETE `/api/offers/[id]` - Delete offer

### Categories
- GET `/api/categories` - List categories
- POST `/api/categories` - Create a new category
- GET `/api/categories/[id]` - Get category details
- PUT `/api/categories/[id]` - Update category
- DELETE `/api/categories/[id]` - Delete category

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd supermall
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment
1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Configure database access and network access
4. Get your connection string and add it to environment variables

## Testing

Run unit tests with Jest:
```bash
npm run test
```

## Optimization Features

- Server-side rendering (SSR) for better SEO
- Static site generation (SSG) for improved performance
- MongoDB query optimization with proper indexing
- Next.js image optimization
- Code splitting for faster loading

## Logging

All user actions and system events are logged using Winston with:
- File transport for error logs
- File transport for combined logs
- Console transport for development

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- MongoDB injection prevention
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.