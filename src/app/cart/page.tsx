'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CreditCard,
  Truck,
  AlertCircle
} from 'lucide-react';

export default function CartPage() {
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const { cart, updateQuantity, removeFromCart, clearCart, refreshCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    refreshCart();
  }, [isAuthenticated]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    setLoading(true);
    await updateQuantity(productId, newQuantity);
    setLoading(false);
  };

  const handleRemoveItem = async (productId: string) => {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      setLoading(true);
      await removeFromCart(productId);
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      setLoading(true);
      await clearCart();
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    // Simple coupon logic - in real app, this would call an API
    if (couponCode.toLowerCase() === 'welcome10') {
      setAppliedDiscount(subtotal * 0.1); // 10% discount
      alert('Coupon applied successfully! 10% discount');
    } else if (couponCode.toLowerCase() === 'save50') {
      setAppliedDiscount(Math.min(50, subtotal * 0.05)); // ₹50 or 5% whichever is less
      alert('Coupon applied successfully! ₹50 discount');
    } else {
      alert('Invalid coupon code');
      setAppliedDiscount(0);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link href="/products">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount;
  const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping for orders above ₹500
  const tax = (subtotal - appliedDiscount) * 0.18; // 18% GST
  const total = subtotal + shippingCost + tax - appliedDiscount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <Link href="/products">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Cart Items</CardTitle>
                {cart.items.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product._id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-primary line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      
                      {/* Variants */}
                      {item.selectedVariants.length > 0 && (
                        <div className="mt-1">
                          {item.selectedVariants.map((variant, index) => (
                            <span key={index} className="text-sm text-gray-600">
                              {variant.variantName}: {variant.selectedOption}
                              {index < item.selectedVariants.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.priceAtTime)}
                          </span>
                          {item.product.price !== item.priceAtTime && (
                            <span className="text-sm text-gray-500">
                              (Current price: {formatPrice(item.product.price)})
                            </span>
                          )}
                        </div>

                        {/* Stock warning */}
                        {item.quantity > item.product.stock && (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Only {item.product.stock} left
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          disabled={loading || item.quantity <= 1}
                          className="px-2 h-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          disabled={loading || item.quantity >= item.product.stock}
                          className="px-2 h-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700 px-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code */}
            <Card>
              <CardHeader>
                <CardTitle>Apply Coupon</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon} variant="outline">
                    Apply
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Try: WELCOME10 or SAVE50
                </p>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(appliedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-sm text-gray-600">
                    Add {formatPrice(500 - subtotal)} more for free shipping
                  </p>
                )}

                <div className="flex justify-between">
                  <span>Tax (GST 18%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="space-y-3 mt-6">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-1" />
                    Estimated delivery: 5-7 business days
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout with 256-bit SSL encryption
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}