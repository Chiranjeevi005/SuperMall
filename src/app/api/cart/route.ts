import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { errorHandlers } from '@/utils/errorHandler';
import logger from '@/utils/logger';
import { cartMiddleware } from '@/middleware/cartMiddleware';

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    // Apply middleware
    const middlewareResponse = await cartMiddleware(request);
    if (middlewareResponse) return middlewareResponse;
    
    await dbConnect();
    
    const userId = (request as any).user.userId;
    
    // Find or create cart for user
    let cart = await Cart.findOne({ userId }).populate('items.productId savedForLater.productId');
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [], savedForLater: [] });
    }
    
    // Transform cart items to include product details
    const transformCartItems = async (items: any[]) => {
      return Promise.all(items.map(async (item: any) => {
        if (item.productId && typeof item.productId !== 'object') {
          // If productId is not populated, fetch the product
          const product = await Product.findById(item.productId);
          return {
            product,
            quantity: item.quantity
          };
        } else {
          // If productId is already populated
          return {
            product: item.productId,
            quantity: item.quantity
          };
        }
      }));
    };
    
    const transformedItems = await transformCartItems(cart.items);
    const transformedSavedForLater = await transformCartItems(cart.savedForLater);
    
    logger.info('Cart fetched successfully', { userId });
    
    return NextResponse.json({
      items: transformedItems,
      savedForLater: transformedSavedForLater,
      totalItems: transformedItems.reduce((total, item) => total + item.quantity, 0),
      totalPrice: transformedItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0),
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error fetching cart', error);
    return errorHandlers.apiErrorResponse('Failed to fetch cart');
  }
}

// POST /api/cart - Add item to cart or update cart
export async function POST(request: NextRequest) {
  try {
    // Apply middleware
    const middlewareResponse = await cartMiddleware(request);
    if (middlewareResponse) return middlewareResponse;
    
    await dbConnect();
    
    const userId = (request as any).user.userId;
    const body = await request.json();
    const { productId, quantity, action } = body;
    
    // Validate input
    if (!productId || !quantity) {
      return errorHandlers.apiErrorResponse('Product ID and quantity are required', 400);
    }
    
    // Find or create cart for user
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [], savedForLater: [] });
    }
    
    // Perform action based on request
    switch (action) {
      case 'add':
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
          (item: any) => item.productId.toString() === productId
        );
        
        if (existingItemIndex >= 0) {
          // Update quantity
          cart.items[existingItemIndex].quantity += quantity;
        } else {
          // Add new item
          cart.items.push({ productId, quantity });
        }
        break;
        
      case 'update':
        // Update quantity of existing item
        const itemIndex = cart.items.findIndex(
          (item: any) => item.productId.toString() === productId
        );
        
        if (itemIndex >= 0) {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
          } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
          }
        }
        break;
        
      case 'remove':
        // Remove item from cart
        cart.items = cart.items.filter(
          (item: any) => item.productId.toString() !== productId
        );
        break;
        
      case 'saveForLater':
        // Move item from cart to saved for later
        const itemToSaveIndex = cart.items.findIndex(
          (item: any) => item.productId.toString() === productId
        );
        
        if (itemToSaveIndex >= 0) {
          const itemToSave = cart.items.splice(itemToSaveIndex, 1)[0];
          cart.savedForLater.push(itemToSave);
        }
        break;
        
      case 'moveToCart':
        // Move item from saved for later to cart
        const itemToMoveIndex = cart.savedForLater.findIndex(
          (item: any) => item.productId.toString() === productId
        );
        
        if (itemToMoveIndex >= 0) {
          const itemToMove = cart.savedForLater.splice(itemToMoveIndex, 1)[0];
          cart.items.push(itemToMove);
        }
        break;
        
      default:
        return errorHandlers.apiErrorResponse('Invalid action', 400);
    }
    
    // Save updated cart
    await cart.save();
    
    logger.info('Cart updated successfully', { userId, action, productId, quantity });
    
    return NextResponse.json({ 
      message: 'Cart updated successfully',
      cart: {
        items: cart.items,
        savedForLater: cart.savedForLater,
        totalItems: cart.items.reduce((total: number, item: any) => total + item.quantity, 0),
        totalPrice: 0 // In a real implementation, you would calculate this based on product prices
      }
    });
  } catch (error: unknown) {
    errorHandlers.logError(logger, 'Error updating cart', error);
    return errorHandlers.apiErrorResponse('Failed to update cart');
  }
}