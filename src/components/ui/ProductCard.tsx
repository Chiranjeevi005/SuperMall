'use client';

import React, { useState, memo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Eye, 
  ShoppingCart, 
  Star, 
  StarHalf,
  Share2,
  ArrowRight,
  Package,
  Shield
} from 'lucide-react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import ImageCarousel from '@/components/ui/ImageCarousel';
import { FadeIn, ScaleIn } from '@/components/animations';

export interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    shortDescription?: string;
    price: number;
    comparePrice?: number;
    category?: string;
    brand?: string;
    images: { src: string; alt: string }[];
    stock: number;
    averageRating: number;
    totalReviews: number;
    totalSold?: number;
    featured?: boolean;
    trending?: boolean;
    newArrival?: boolean;
    slug?: string;
    vendor?: {
      _id: string;
      name: string;
    };
  };
  viewMode?: 'grid' | 'list';
  showQuickActions?: boolean;
  showCarousel?: boolean;
  delay?: number;
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  product,
  viewMode = 'grid',
  showQuickActions = true,
  showCarousel = false,
  delay = 0,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  }, []);

  const renderStars = useCallback((rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  }, []);

  const calculateDiscount = useCallback(() => {
    if (!product.comparePrice || product.comparePrice <= product.price) return 0;
    return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  }, [product.comparePrice, product.price]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  }, [onAddToCart, product]);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product._id);
    }
  }, [onToggleWishlist, product._id]);

  const discount = calculateDiscount();

  // Memoize expensive calculations
  const trustIndicators = React.useMemo(() => (
    <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
      <div className="flex items-center">
        <Shield className="w-3 h-3 mr-1" />
        Verified
      </div>
      <div className="flex items-center">
        <Package className="w-3 h-3 mr-1" />
        Fast Delivery
      </div>
    </div>
  ), []);

  const imageSection = React.useMemo(() => (
    <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'w-full'}`}>
      <div className={`relative overflow-hidden ${
        viewMode === 'list' ? 'h-48' : 'aspect-square'
      }`}>
        {showCarousel && product.images.length > 1 ? (
          <ImageCarousel
            images={product.images}
            className="w-full h-full"
            showThumbnails={false}
            aspectRatio="1/1"
          />
        ) : (
          <Link href={`/products/${product._id}`}>
            <OptimizedImage
              src={product.images[currentImageIndex]?.src || '/placeholder-product.jpg'}
              alt={product.images[currentImageIndex]?.alt || product.name}
              width={400}
              height={400}
              className="w-full h-full transition-transform duration-500 group-hover:scale-110"
              objectFit="cover"
              priority={delay === 0}
              sizes={viewMode === 'list' ? '256px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'}
            />
          </Link>
        )}
      </div>
    </div>
  ), [showCarousel, product.images, product._id, currentImageIndex, viewMode, delay]);

  const badgesSection = React.useMemo(() => (
    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
      {product.newArrival && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold shadow-lg">
            New
          </Badge>
        </motion.div>
      )}
      {product.featured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-lg">
            Featured
          </Badge>
        </motion.div>
      )}
      {product.trending && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-lg">
            Trending
          </Badge>
        </motion.div>
      )}
      {discount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.5 }}
        >
          <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg">
            -{discount}%
          </Badge>
        </motion.div>
      )}
      {product.stock === 0 && (
        <Badge variant="destructive" className="text-xs font-semibold shadow-lg">
          Out of Stock
        </Badge>
      )}
      {product.stock > 0 && product.stock <= 5 && (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-lg">
          Low Stock
        </Badge>
      )}
    </div>
  ), [product.newArrival, product.featured, product.trending, product.stock, discount, delay]);

  const quickActionsSection = React.useMemo(() => (
    showQuickActions && (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="absolute top-3 right-3 flex flex-col gap-2 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-lg ${
            isInWishlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
        </motion.button>
        
        <Link href={`/products/${product._id}`}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-primary backdrop-blur-md transition-all duration-200 shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </motion.div>
        </Link>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-primary backdrop-blur-md transition-all duration-200 shadow-lg"
        >
          <Share2 className="w-4 h-4" />
        </motion.button>
      </motion.div>
    )
  ), [showQuickActions, isHovered, handleToggleWishlist, isInWishlist, product._id]);

  const imageNavigation = React.useMemo(() => (
    !showCarousel && product.images.length > 1 && (
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
        {product.images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentImageIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentImageIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    )
  ), [showCarousel, product.images, currentImageIndex]);

  return (
    <FadeIn delay={delay} className={className}>
      <motion.div
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Card 
          className={`group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm overflow-hidden h-full ${
            viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'
          }`}
        >
          {/* Image Section */}
          {imageSection}

          {/* Badges */}
          {badgesSection}

          {/* Quick Actions */}
          {quickActionsSection}

          {/* Image Navigation for multiple images */}
          {imageNavigation}

          {/* Content Section */}
          <CardContent className={`flex-1 p-4 flex flex-col ${
            viewMode === 'list' ? 'justify-between' : ''
          }`}>
            <div className="flex-1">
              {/* Category & Vendor */}
              <div className="flex items-center justify-between mb-2">
                {product.category && (
                  <span className="text-xs text-muted-foreground bg-accent/10 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
                {product.vendor && (
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Package className="w-3 h-3 mr-1" />
                    {product.vendor?.name || 'Unknown Seller'}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <Link href={`/products/${product._id}`}>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200 leading-tight">
                  {product.name}
                </h3>
              </Link>

              {/* Description (List view only) */}
              {viewMode === 'list' && product.shortDescription && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {renderStars(product.averageRating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.averageRating.toFixed(1)} ({product.totalReviews})
                </span>
                {product.totalSold && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {product.totalSold} sold
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Trust Indicators */}
              {trustIndicators}
            </div>

            {/* Add to Cart Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center gap-2 rural-button btn-enhanced transition-all duration-300 group/btn"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </FadeIn>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;