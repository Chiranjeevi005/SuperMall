'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  images: { url: string; alt: string }[];
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  features: string[];
  specifications: { key: string; value: string }[];
  variants: { name: string; options: string[] }[];
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  viewCount: number;
  featured: boolean;
  trending: boolean;
  newArrival: boolean;
  vendor?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  reviews: {
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({});
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
        // Initialize selected variants
        const initialVariants: {[key: string]: string} = {};
        data.data.variants.forEach((variant: any) => {
          if (variant.options && variant.options.length > 0) {
            initialVariants[variant.name] = variant.options[0];
          }
        });
        setSelectedVariants(initialVariants);
      } else {
        setError(data.message || 'Product not found');
      }
    } catch (error) {
      setError('Failed to load product. Please try again.');
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!product) return;

    const variants = Object.entries(selectedVariants).map(([name, option]) => ({
      variantName: name,
      selectedOption: option
    }));

    const result = await addToCart(product._id, quantity, variants);
    if (result.success) {
      // Show success message
      alert('Product added to cart successfully!');
    } else {
      alert(`Failed to add to cart: ${result.message}`);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!reviewText.trim() || reviewRating < 1 || reviewRating > 5) {
      alert('Please provide a valid rating and comment');
      return;
    }

    try {
      setSubmittingReview(true);
      
      const response = await fetch(`/api/products/${params.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewText.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Review submitted successfully!');
        setReviewText('');
        setReviewRating(5);
        fetchProduct(); // Refresh product data
      } else {
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 cursor-pointer ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 hover:text-yellow-400'
        }`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => router.push('/')} className="hover:text-primary">
              Home
            </button>
            <span>/</span>
            <button onClick={() => router.push('/products')} className="hover:text-primary">
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-white">
              <img
                src={product.images[selectedImageIndex]?.url || '/placeholder-product.jpg'}
                alt={product.images[selectedImageIndex]?.alt || product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {(product.images && product.images.length > 1) && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.newArrival && (
                <Badge className="bg-green-500 text-white">New Arrival</Badge>
              )}
              {product.featured && (
                <Badge className="bg-blue-500 text-white">Featured</Badge>
              )}
              {product.trending && (
                <Badge className="bg-orange-500 text-white">Trending</Badge>
              )}
              {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                <Badge variant="destructive">Low Stock</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* Title and Brand */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-lg text-gray-600">by {product.brand}</p>
              )}
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
                <span className="ml-2 text-sm text-gray-600">
                  {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {product.totalSold} sold
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                    <Badge className="bg-red-500 text-white">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Inclusive of all taxes
              </p>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-700 leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* Variants */}
            {(product.variants && product.variants.length > 0) && (
              <div className="space-y-4">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => setSelectedVariants(prev => ({
                            ...prev,
                            [variant.name]: option
                          }))}
                          className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            selectedVariants[variant.name] === option
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 ml-4">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2"
                  size="lg"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-4">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              
              {isAuthenticated && (
                <Button variant="outline" className="w-full" size="lg">
                  Buy Now
                </Button>
              )}
            </div>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-sm">Free delivery on orders over ₹500</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-blue-600" />
                    <span className="text-sm">7-day return policy</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="text-sm">Secure payments</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vendor Info */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">Sold by</h3>
                <p className="text-sm text-gray-700">{product.vendor?.name || 'Unknown Seller'}</p>
                {product.sku && (
                  <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.totalReviews})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                  
                  {(product.features && product.features.length > 0) && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.specifications && product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{spec.key}</span>
                      <span className="text-gray-700">{spec.value}</span>
                    </div>
                  ))}
                  
                  {product.weight && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Weight</span>
                      <span className="text-gray-700">{product.weight}g</span>
                    </div>
                  )}
                  
                  {product.dimensions && product.dimensions.length && product.dimensions.width && product.dimensions.height && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">Dimensions</span>
                      <span className="text-gray-700">
                        {product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {/* Add Review Form */}
            {isAuthenticated && (
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {renderStars(reviewRating, true, setReviewRating)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience with this product..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !reviewText.trim()}
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {(!product.reviews || product.reviews.length === 0) ? (
                  <p className="text-gray-600 text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-600">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Options</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                        <div>
                          <p className="font-medium">Standard Delivery</p>
                          <p className="text-sm text-gray-600">5-7 business days</p>
                        </div>
                        <span className="font-medium">Free</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border border-gray-200 rounded-md">
                        <div>
                          <p className="font-medium">Express Delivery</p>
                          <p className="text-sm text-gray-600">2-3 business days</p>
                        </div>
                        <span className="font-medium">₹99</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Return Policy</h4>
                    <p className="text-sm text-gray-700">
                      7-day return policy. Items must be unused and in original packaging.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Security</h4>
                    <p className="text-sm text-gray-700">
                      All transactions are secure and encrypted. We accept all major payment methods.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <p className="text-gray-600">Coming soon - Related products based on category and tags</p>
        </div>
      </div>
    </div>
  );
}