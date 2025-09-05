import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';

// GET /api/customers - Get all customers
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Find all users with role 'customer'
    const customers = await User.find({ role: 'customer' }).select('-password');
    
    logger.info('Customers fetched successfully', { count: customers.length });
    
    return NextResponse.json({ customers });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error fetching customers', error);
    return errorHandlers.apiErrorResponse('Failed to fetch customers');
  }
}

// PUT /api/customers - Update customer status
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { customerId, action } = body;
    
    // Validate input
    if (!customerId || !action) {
      return errorHandlers.apiErrorResponse('Customer ID and action are required', 400);
    }
    
    // Find the customer
    const customer = await User.findById(customerId);
    if (!customer) {
      return errorHandlers.apiErrorResponse('Customer not found', 404);
    }
    
    // Update customer status based on action
    if (action === 'suspend') {
      customer.isLocked = true;
    } else if (action === 'activate') {
      customer.isLocked = false;
      customer.resetLoginAttempts(); // Reset login attempts when activating
    } else {
      return errorHandlers.apiErrorResponse('Invalid action. Use "suspend" or "activate"', 400);
    }
    
    await customer.save();
    
    logger.info('Customer status updated', { customerId, action });
    
    return NextResponse.json({ 
      message: `Customer ${action}d successfully`,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        isLocked: customer.isLocked
      }
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error updating customer status', error);
    return errorHandlers.apiErrorResponse('Failed to update customer status');
  }
}