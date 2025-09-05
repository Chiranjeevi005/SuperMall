# Super Mall System Architecture

## 1. Overview
Super Mall is a comprehensive e-commerce web application designed to manage shops, products, and offers within a mall environment. The system provides a platform for admins to manage the mall, merchants to manage their shops and products, and customers to browse and purchase products.

## 2. Architecture Overview
The system follows a monolithic architecture with a full-stack Next.js application. The frontend uses Next.js with App Router for SSR/SSG, TypeScript for type safety, and Tailwind CSS for styling. The backend uses Next.js API routes for handling server-side logic. MongoDB with Mongoose ODM is used for data persistence.

### 2.1 Technology Stack
- **Frontend**: Next.js 15.5.2, React 19.1.0, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose 8.18.0
- **Authentication**: JWT (jsonwebtoken 9.0.2), bcryptjs 3.0.2
- **Logging**: Winston 3.17.0
- **Testing**: Jest 30.1.3
- **Build Tool**: Next.js CLI, npm

### 2.2 Architectural Patterns
- Server-Side Rendering (SSR) for SEO optimization
- Static Site Generation (SSG) for performance improvement
- Middleware pattern for authentication
- Repository pattern for data access abstraction

### 2.3 Component Interaction
- Frontend (Next.js App Router) → API Routes (Next.js) → MongoDB (Mongoose)
- Authentication handled via JWT middleware
- Logging integrated across services and API routes

## 3. System Components

### 3.1 Frontend Components
The frontend is organized into several key components:

#### 3.1.1 Pages
- Landing/Home Page
- Authentication Pages (Login, Register)
- Shop Directory
- Product Listings
- Product Detail Pages
- Offer Pages
- User Profile/Account Management
- Admin Dashboard

#### 3.1.2 UI Components
- Header with Navigation
- Footer with Links
- Product Cards
- Shop Cards
- Offer Cards
- Category Cards
- Search Components
- Filter Components
- Shopping Cart
- User Profile Components

### 3.2 Backend Components

#### 3.2.1 API Routes
- Authentication API (/api/auth)
- Shops API (/api/shops)
- Products API (/api/products)
- Offers API (/api/offers)
- Categories API (/api/categories)
- Users API (/api/users)

#### 3.2.2 Services
- Authentication Service
- Shop Management Service
- Product Management Service
- Offer Management Service
- Category Management Service
- User Management Service

#### 3.2.3 Middleware
- Authentication Middleware
- Logging Middleware
- Error Handling Middleware

#### 3.2.4 Models
- User Model
- Shop Model
- Product Model
- Offer Model
- Category Model

### 3.3 Database Schema

#### 3.3.1 User Schema
- _id (ObjectId)
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: 'admin', 'merchant', 'customer')
- createdAt (Date)
- updatedAt (Date)

#### 3.3.2 Shop Schema
- _id (ObjectId)
- name (String)
- description (String)
- owner (ObjectId, ref: User)
- location (Object: { floor: Number, section: String })
- categories (Array of Strings)
- isActive (Boolean)
- createdAt (Date)
- updatedAt (Date)

#### 3.3.3 Product Schema
- _id (ObjectId)
- name (String)
- description (String)
- price (Number)
- shop (ObjectId, ref: Shop)
- category (String)
- images (Array of Strings)
- stock (Number)
- isActive (Boolean)
- features (Array of Objects: { name: String, value: String })
- offers (Array of Objects: { title: String, description: String, discountType: String, discountValue: Number, startDate: Date, endDate: Date })
- createdAt (Date)
- updatedAt (Date)

#### 3.3.4 Offer Schema
- _id (ObjectId)
- title (String)
- description (String)
- discountType (String: 'percentage', 'fixed')
- discountValue (Number)
- startDate (Date)
- endDate (Date)
- shop (ObjectId, ref: Shop)
- products (Array of ObjectIds, ref: Product)
- isActive (Boolean)
- createdAt (Date)
- updatedAt (Date)

#### 3.3.5 Category Schema
- _id (ObjectId)
- name (String)
- description (String)
- createdAt (Date)
- updatedAt (Date)

## 4. Data Flow

### 4.1 User Authentication Flow
1. User navigates to login/register page
2. User submits credentials
3. Frontend sends request to /api/auth/login or /api/auth/register
4. Backend validates credentials and generates JWT token
5. Token is stored in HTTP-only cookie or localStorage
6. Subsequent requests include JWT token in Authorization header
7. Middleware validates token and attaches user info to request

### 4.2 Product Browsing Flow
1. User visits landing page or navigates to products page
2. Frontend fetches products from /api/products
3. Backend queries MongoDB for active products
4. Results are returned with pagination
5. User can filter/sort products using UI components
6. Filtered requests are sent to backend with query parameters

### 4.3 Shopping Cart Flow
1. User adds product to cart
2. Cart is stored in localStorage or session
3. User proceeds to checkout
4. Cart items are validated and order is created
5. Payment processing (if implemented)
6. Order confirmation is sent to user

## 5. UI/UX Design

### 5.1 Landing Page Wireframe
```
+-------------------------------------------------------------+
| Header: Logo, Navigation, Login/Register                    |
+-------------------------------------------------------------+
| Hero Section: Banner Image, Headline, CTA                   |
+-------------------------------------------------------------+
| Categories: Grid of category cards                          |
+-------------------------------------------------------------+
| Featured Shops: Horizontal scroll of shop cards             |
+-------------------------------------------------------------+
| Featured Products: Grid of product cards                    |
+-------------------------------------------------------------+
| Current Offers: Grid of offer cards                         |
+-------------------------------------------------------------+
| Footer: Links, Contact Info, Copyright                      |
+-------------------------------------------------------------+
```

### 5.2 Products Page Wireframe
```
+-------------------------------------------------------------+
| Header: Logo, Navigation, Login/Register                    |
+-------------------------------------------------------------+
| Products Page Header: "Products"                            |
+-------------------------------------------------------------+
| Filters: Search, Category, Price Range                      |
| +---------------------------------------------------------+ |
| | Search: [___________________________]  [Search Button]  | |
| | Category: [All Categories ▼]                            | |
| | Price: ₹0 ------------------------------------ ₹200000  | |
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+
| Product Listings                                            |
| +----------+  +----------+  +----------+                   |
| | Product1 |  | Product2 |  | Product3 |                   |
| | Name     |  | Name     |  | Name     |                   |
| | Price    |  | Price    |  | Price    |                   |
| | Image    |  | Image    |  | Image    |                   |
| +----------+  +----------+  +----------+                   |
| +----------+  +----------+  +----------+                   |
| | Product4 |  | Product5 |  | Product6 |                   |
| | Name     |  | Name     |  | Name     |                   |
| | Price    |  | Price    |  | Price    |                   |
| | Image    |  | Image    |  | Image    |                   |
| +----------+  +----------+  +----------+                   |
+-------------------------------------------------------------+
| Pagination: [Prev] 1 2 3 4 ... [Next]                       |
+-------------------------------------------------------------+
| Footer: Links, Contact Info, Copyright                      |
+-------------------------------------------------------------+
```

### 5.3 Product Detail Page Wireframe
```
+-------------------------------------------------------------+
| Header: Logo, Navigation, Login/Register                    |
+-------------------------------------------------------------+
| Breadcrumb: Home / Products / Product Name                  |
+-------------------------------------------------------------+
| Product Detail                                              |
| +----------------------+  +-------------------------------+ |
| | Image Carousel       |  | Product Name                  | |
| |                      |  | Price: ₹XXXX.XX               | |
| |                      |  | Rating: ***** (XX reviews)    | |
| |                      |  | Description                   | |
| |                      |  | Features                      | |
| |                      |  | Quantity Selector             | |
| |                      |  | [Add to Cart] [Buy Now]       | |
| +----------------------+  +-------------------------------+ |
+-------------------------------------------------------------+
| Related Products                                            |
| +----------+  +----------+  +----------+  +----------+     |
| | Product1 |  | Product2 |  | Product3 |  | Product4 |     |
| +----------+  +----------+  +----------+  +----------+     |
+-------------------------------------------------------------+
| Footer: Links, Contact Info, Copyright                      |
+-------------------------------------------------------------+
```

### 5.4 Offers Page Wireframe
```
+-------------------------------------------------------------+
| Header: Logo, Navigation, Login/Register                    |
+-------------------------------------------------------------+
| Offers Page Header: "Current Offers"                        |
+-------------------------------------------------------------+
| Filters: Search, Shop, Active Only                          |
| +---------------------------------------------------------+ |
| | Search: [_________________________]  [Search Button]    | |
| | Shop: [All Shops ▼]                                     | |
| | [x] Show only active offers                             | |
| +---------------------------------------------------------+ |
+-------------------------------------------------------------+
| Offer Listings                                              |
| +----------+  +----------+  +----------+                   |
| | Offer 1  |  | Offer 2  |  | Offer 3  |                   |
| | Title    |  | Title    |  | Title    |                   |
| | Shop     |  | Shop     |  | Shop     |                   |
| | Discount |  | Discount |  | Discount |                   |
| | Dates    |  | Dates    |  | Dates    |                   |
| | [Claim]  |  | [Claim]  |  | [Claim]  |                   |
| +----------+  +----------+  +----------+                   |
+-------------------------------------------------------------+
| Footer: Links, Contact Info, Copyright                      |
+-------------------------------------------------------------+
```

## 6. Security Considerations

### 6.1 Authentication & Authorization
- JWT tokens for stateless authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Secure HTTP headers
- CORS configuration

### 6.2 Data Protection
- Input validation and sanitization
- Protection against MongoDB injection
- HTTPS enforcement in production
- Secure cookie settings

### 6.3 API Security
- Rate limiting
- Request validation
- Error message sanitization
- API versioning

## 7. Performance Considerations

### 7.1 Frontend Performance
- Code splitting with dynamic imports
- Image optimization
- Caching strategies
- Lazy loading components

### 7.2 Backend Performance
- Database indexing
- Query optimization
- Connection pooling
- Caching with Redis (future enhancement)

### 7.3 Database Performance
- Proper indexing on frequently queried fields
- Aggregation pipelines for complex queries
- Connection management
- Data archiving strategies

## 8. Deployment & Scalability

### 8.1 Deployment Architecture
- Vercel for frontend/backend deployment
- MongoDB Atlas for database
- Environment-specific configurations
- CI/CD pipeline

### 8.2 Scalability Considerations
- Horizontal scaling with load balancing
- Database sharding for large datasets
- CDN for static assets
- Microservices architecture (future enhancement)

## 9. Monitoring & Logging

### 9.1 Application Monitoring
- Error tracking with Sentry (future enhancement)
- Performance monitoring
- User analytics
- API usage tracking

### 9.2 Logging
- Structured logging with Winston
- Log levels (error, warn, info, debug)
- Log rotation and retention
- Centralized log management (future enhancement)

## 10. Testing Strategy

### 10.1 Unit Testing
- Component testing with Jest and React Testing Library
- Service layer testing
- Model validation testing
- Utility function testing

### 10.2 Integration Testing
- API endpoint testing
- Database operation testing
- Authentication flow testing
- End-to-end workflow testing

### 10.3 End-to-End Testing
- User journey testing
- Cross-browser testing
- Mobile responsiveness testing
- Performance testing

## 11. Future Enhancements

### 11.1 Feature Enhancements
- Advanced search and filtering
- Wishlist functionality
- Product comparison
- Review and rating system
- Recommendation engine

### 11.2 Technical Enhancements
- Real-time notifications with WebSockets
- Payment gateway integration
- Mobile app development
- Admin dashboard enhancements
- Analytics dashboard

### 11.3 Performance Enhancements
- Redis caching implementation
- Database query optimization
- Image CDN integration
- Server-side rendering optimizations