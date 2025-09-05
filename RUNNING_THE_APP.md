# Running and Testing SuperMall

This document provides instructions for running and testing the SuperMall web application.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (version 16 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud instance)

## Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret_key

# Environment
NODE_ENV=development
```

2. Replace the placeholder values with your actual configuration.

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Testing User Roles

### Admin User
- Register a new user and manually update their role to 'admin' in the database
- Or use the default admin account if one was created during setup

### Vendor (Merchant)
- During registration, select 'Merchant' as the role
- Access the vendor dashboard at `/vendor`

### Customer
- During registration, select 'Customer' as the role (default)
- Access the customer portal at `/customer`

## API Testing

You can test the API endpoints using tools like Postman or curl:

### Authentication Endpoints

1. **Register a new user**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "customer"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

3. **Refresh Token**:
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Cookie: refreshToken=your_refresh_token"
```

4. **Unlock Account**:
```bash
curl -X POST http://localhost:3000/api/auth/unlock-account \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

## Role-Based Access Testing

### Admin Access
- Navigate to `/admin` after logging in as an admin
- Test vendor management, customer management, and product management features

### Vendor Access
- Navigate to `/vendor` after logging in as a vendor
- Test product creation, order management, and earnings tracking

### Customer Access
- Navigate to `/customer` after logging in as a customer
- Test product browsing, cart functionality, and order tracking

## Error Handling Testing

### Validation Errors
- Try registering with invalid email format
- Try registering with weak password (less than 8 characters)
- Try registering without required fields

### Authentication Errors
- Try logging in with incorrect credentials
- Try accessing protected routes without authentication
- Try accessing routes not authorized for your role

### Account Lock Testing
- Attempt to login with incorrect credentials 5 times
- Verify that the account gets locked
- Use the unlock account feature to unlock the account

## Performance Testing

### Page Load Times
- Test page load times for dashboard pages
- Test API response times for data-intensive endpoints
- Verify mobile responsiveness

### Concurrent Users
- Test with multiple users accessing the system simultaneously
- Verify database connection handling under load

## Security Testing

### Authentication Security
- Verify that refresh tokens are HTTP-only
- Test account lockout after 5 failed login attempts
- Test account unlock functionality
- Verify that sensitive information is not exposed in error messages

### Data Validation
- Test input validation for all form fields
- Verify that database injection attempts are prevented
- Test file upload security (if applicable)

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify your MongoDB connection string in `.env.local`
   - Ensure your MongoDB instance is running

2. **Authentication Errors**:
   - Check that JWT secrets are properly configured
   - Verify that cookies are being set correctly

3. **Role Access Issues**:
   - Verify user roles in the database
   - Check middleware configuration

### Debugging

1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify MongoDB logs for database issues
4. Use browser developer tools to inspect network requests

## Development Commands

### Building for Production
```bash
npm run build
# or
yarn build
```

### Starting Production Server
```bash
npm start
# or
yarn start
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## Testing Checklist

Before deployment, verify the following:

- [ ] All authentication flows work correctly
- [ ] Role-based access control is functioning
- [ ] All dashboard features are working
- [ ] Error handling is properly implemented
- [ ] Validation is working for all forms
- [ ] Account lock/unlock functionality works
- [ ] Performance is acceptable
- [ ] Security measures are in place
- [ ] Mobile responsiveness is working
- [ ] All environment variables are configured

This comprehensive testing approach ensures that the SuperMall application is ready for production use.