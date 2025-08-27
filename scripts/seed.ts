import { connectToDataBase } from '../dataBase/dbConfig';
import bcrypt from 'bcryptjs';
import { CategoryModel } from '../models/category';
import { UserModels } from '../models/user';
import { ProductModel } from '../models/product';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@supermall.com',
    password: 'admin123',
    role: 'admin',
    address: 'Admin Office, Tech City',
    phone: '+91-9876543210',
    emailVerified: true,
    isActive: true,
  },
  {
    name: 'Tech Vendor',
    email: 'vendor1@supermall.com',
    password: 'vendor123',
    role: 'vendor',
    address: 'Electronics Store, Market Street',
    phone: '+91-9876543211',
    emailVerified: true,
    isActive: true,
  },
  {
    name: 'Fashion Vendor',
    email: 'vendor2@supermall.com',
    password: 'vendor123',
    role: 'vendor',
    address: 'Fashion Store, Style Avenue',
    phone: '+91-9876543212',
    emailVerified: true,
    isActive: true,
  },
  {
    name: 'John Customer',
    email: 'customer1@example.com',
    password: 'customer123',
    role: 'user',
    address: '123 Main Street, City Center',
    phone: '+91-9876543213',
    emailVerified: true,
    isActive: true,
  },
  {
    name: 'Jane Smith',
    email: 'customer2@example.com',
    password: 'customer123',
    role: 'user',
    address: '456 Oak Avenue, Suburb',
    phone: '+91-9876543214',
    emailVerified: true,
    isActive: true,
  }
];

const sampleCategories = [
  // Main Categories (Level 0) - Rural Marketplace
  {
    name: 'Fresh Produce',
    description: 'Fruits, vegetables, grains, and farm-fresh items directly from local farmers',
    level: 0,
    seoTitle: 'Fresh Produce - Farm Fresh Items | SUPER-MALL',
    seoDescription: 'Shop the freshest fruits, vegetables, and grains directly from local farmers. Organic and pesticide-free produce.',
    isActive: true,
  },
  {
    name: 'Handicrafts & Artisans',
    description: 'Locally crafted products, handmade goods, and traditional art pieces',
    level: 0,
    seoTitle: 'Handicrafts - Traditional Art | SUPER-MALL',
    seoDescription: 'Discover authentic handcrafted products and traditional art from skilled rural artisans.',
    isActive: true,
  },
  {
    name: 'Clothing & Apparel',
    description: 'Ethnic wear, casual clothing, and rural fashion collections',
    level: 0,
    seoTitle: 'Clothing - Fashion Collection | SUPER-MALL',
    seoDescription: 'Browse traditional ethnic wear and fashion collections made by local artisans.',
    isActive: true,
  },
  {
    name: 'Home & Living',
    description: 'Furniture, kitchenware, décor, and everyday household essentials',
    level: 0,
    seoTitle: 'Home & Living - Home Décor | SUPER-MALL',
    seoDescription: 'Transform your home with furniture, traditional kitchenware, and home décor items.',
    isActive: true,
  },
  {
    name: 'Dairy & Poultry',
    description: 'Fresh milk, cheese, eggs, and related dairy products from local farms',
    level: 0,
    seoTitle: 'Dairy & Poultry - Fresh Farm | SUPER-MALL',
    seoDescription: 'Get the freshest dairy and poultry products directly from local farms and dairy cooperatives.',
    isActive: true,
  },
  {
    name: 'Spices & Condiments',
    description: 'Locally sourced spices, herbs, pickles, and traditional flavor enhancers',
    level: 0,
    seoTitle: 'Spices - Traditional Flavors | SUPER-MALL',
    seoDescription: 'Experience authentic flavors with locally sourced spices, herbs, and traditional condiments.',
    isActive: true,
  },
  {
    name: 'Food & Beverages',
    description: 'Packaged foods, snacks, traditional delicacies, and natural beverages',
    level: 0,
    seoTitle: 'Food & Beverages - Traditional | SUPER-MALL',
    seoDescription: 'Savor traditional packaged foods, healthy snacks, and natural beverages from producers.',
    isActive: true,
  },
  {
    name: 'Tools & Equipment',
    description: 'Farming tools, household utilities, and small-scale agricultural machinery',
    level: 0,
    seoTitle: 'Tools & Equipment - Utilities | SUPER-MALL',
    seoDescription: 'Find quality tools, household utilities, and equipment for daily living.',
    isActive: true,
  },
  {
    name: 'Electronics',
    description: 'Modern electronics, gadgets, and technology products for daily life',
    level: 0,
    seoTitle: 'Electronics - Modern Technology | SUPER-MALL',
    seoDescription: 'Shop the latest electronics, gadgets, and technology products for modern living.',
    isActive: true,
  },
  {
    name: 'Books',
    description: 'Educational books, novels, and learning materials for all ages',
    level: 0,
    seoTitle: 'Books - Education & Learning | SUPER-MALL',
    seoDescription: 'Discover educational books, novels, and learning materials for knowledge and entertainment.',
    isActive: true,
  },
  {
    name: 'Sports',
    description: 'Sports equipment, fitness gear, and athletic accessories',
    level: 0,
    seoTitle: 'Sports - Fitness Equipment | SUPER-MALL',
    seoDescription: 'Find quality sports equipment, fitness gear, and athletic accessories for active lifestyle.',
    isActive: true,
  },
];

// Subcategories will be created after main categories
const sampleSubcategories = [
  // Fresh Produce Subcategories (Level 1)
  {
    name: 'Fruits',
    description: 'Fresh seasonal fruits from local orchards',
    parentCategoryName: 'Fresh Produce',
    level: 1,
    seoTitle: 'Fresh Fruits - Seasonal | SUPER-MALL',
    seoDescription: 'Buy fresh, seasonal fruits directly from local orchards and farmers.',
    isActive: true,
  },
  {
    name: 'Vegetables',
    description: 'Farm-fresh vegetables and leafy greens',
    parentCategoryName: 'Fresh Produce',
    level: 1,
    seoTitle: 'Fresh Vegetables - Farm to Table | SUPER-MALL',
    seoDescription: 'Get farm-fresh vegetables and leafy greens delivered straight from the field.',
    isActive: true,
  },
  {
    name: 'Grains & Cereals',
    description: 'Organic grains, rice, wheat, and cereals',
    parentCategoryName: 'Fresh Produce',
    level: 1,
    seoTitle: 'Grains - Organic & Natural | SUPER-MALL',
    seoDescription: 'Shop organic grains, rice, wheat, and cereals from sustainable farms.',
    isActive: true,
  },
  
  // Handicrafts & Artisans Subcategories (Level 1)
  {
    name: 'Traditional Crafts',
    description: 'Handmade traditional crafts and artwork',
    parentCategoryName: 'Handicrafts & Artisans',
    level: 1,
    seoTitle: 'Traditional Crafts - Handmade | SUPER-MALL',
    seoDescription: 'Discover beautiful traditional crafts and artwork made by skilled artisans.',
    isActive: true,
  },
  {
    name: 'Pottery & Ceramics',
    description: 'Handcrafted pottery and ceramic items',
    parentCategoryName: 'Handicrafts & Artisans',
    level: 1,
    seoTitle: 'Pottery - Handcrafted Items | SUPER-MALL',
    seoDescription: 'Beautiful handcrafted pottery and ceramic items for home and decoration.',
    isActive: true,
  },
  {
    name: 'Textiles & Weaving',
    description: 'Hand-woven textiles and fabric products',
    parentCategoryName: 'Handicrafts & Artisans',
    level: 1,
    seoTitle: 'Textiles - Hand-woven Fabrics | SUPER-MALL',
    seoDescription: 'Authentic hand-woven textiles and fabric products from traditional weavers.',
    isActive: true,
  },
  
  // Clothing & Apparel Subcategories (Level 1)
  {
    name: "Men's Traditional Wear",
    description: 'Traditional clothing and ethnic wear for men',
    parentCategoryName: 'Clothing & Apparel',
    level: 1,
    seoTitle: "Men's Traditional Wear - Ethnic Fashion | Rural Harvest",
    seoDescription: 'Shop authentic traditional and ethnic wear for men made by rural artisans.',
    isActive: true,
  },
  {
    name: "Women's Traditional Wear",
    description: 'Traditional sarees, dresses, and ethnic wear for women',
    parentCategoryName: 'Clothing & Apparel',
    level: 1,
    seoTitle: "Women's Traditional Wear - Ethnic Fashion | Rural Harvest",
    seoDescription: 'Beautiful traditional sarees, dresses, and ethnic wear for women.',
    isActive: true,
  },
  {
    name: 'Rural Casual Wear',
    description: 'Comfortable casual clothing with rural charm',
    parentCategoryName: 'Clothing & Apparel',
    level: 1,
    seoTitle: 'Rural Casual Wear - Comfortable Fashion | Rural Harvest',
    seoDescription: 'Comfortable and stylish casual wear with authentic rural charm.',
    isActive: true,
  },
  
  // Home & Living Subcategories (Level 1)
  {
    name: 'Furniture',
    description: 'Handcrafted wooden furniture and home furnishings',
    parentCategoryName: 'Home & Living',
    level: 1,
    seoTitle: 'Handcrafted Furniture - Wooden & Rustic | Rural Harvest',
    seoDescription: 'Beautiful handcrafted wooden furniture and rustic home furnishings.',
    isActive: true,
  },
  {
    name: 'Kitchen & Dining',
    description: 'Traditional kitchenware and dining accessories',
    parentCategoryName: 'Home & Living',
    level: 1,
    seoTitle: 'Kitchen & Dining - Traditional Kitchenware | Rural Harvest',
    seoDescription: 'Traditional kitchenware and dining accessories for authentic cooking.',
    isActive: true,
  },
  {
    name: 'Home Décor',
    description: 'Rustic home décor and decorative items',
    parentCategoryName: 'Home & Living',
    level: 1,
    seoTitle: 'Home Décor - Rustic & Traditional | Rural Harvest',
    seoDescription: 'Transform your home with rustic and traditional décor items.',
    isActive: true,
  },
];

// Sub-subcategories (Level 2)
const sampleSubSubcategories = [
  // Fruits subcategories
  {
    name: 'Seasonal Fruits',
    description: 'Fresh seasonal fruits available throughout the year',
    parentCategoryName: 'Fruits',
    level: 2,
    seoTitle: 'Seasonal Fruits - Fresh & Natural | Rural Harvest',
    seoDescription: 'Enjoy fresh seasonal fruits delivered directly from local orchards.',
    isActive: true,
  },
  {
    name: 'Citrus Fruits',
    description: 'Fresh oranges, lemons, limes, and other citrus fruits',
    parentCategoryName: 'Fruits',
    level: 2,
    seoTitle: 'Citrus Fruits - Fresh & Juicy | Rural Harvest',
    seoDescription: 'Fresh citrus fruits rich in vitamin C from local citrus groves.',
    isActive: true,
  },
  
  // Vegetables subcategories
  {
    name: 'Leafy Greens',
    description: 'Fresh spinach, lettuce, kale, and other leafy vegetables',
    parentCategoryName: 'Vegetables',
    level: 2,
    seoTitle: 'Leafy Greens - Fresh & Nutritious | Rural Harvest',
    seoDescription: 'Nutritious leafy greens and vegetables grown without pesticides.',
    isActive: true,
  },
  {
    name: 'Root Vegetables',
    description: 'Potatoes, carrots, beets, and other root vegetables',
    parentCategoryName: 'Vegetables',
    level: 2,
    seoTitle: 'Root Vegetables - Farm Fresh | Rural Harvest',
    seoDescription: 'Fresh root vegetables grown in fertile soils by local farmers.',
    isActive: true,
  },
  
  // Traditional Crafts subcategories
  {
    name: 'Wood Crafts',
    description: 'Handcrafted wooden items and sculptures',
    parentCategoryName: 'Traditional Crafts',
    level: 2,
    seoTitle: 'Wood Crafts - Handcrafted Art | Rural Harvest',
    seoDescription: 'Beautiful handcrafted wooden items and sculptures by skilled artisans.',
    isActive: true,
  },
  {
    name: 'Metal Crafts',
    description: 'Traditional metalwork and brass items',
    parentCategoryName: 'Traditional Crafts',
    level: 2,
    seoTitle: 'Metal Crafts - Traditional Metalwork | Rural Harvest',
    seoDescription: 'Authentic traditional metalwork and brass items crafted by experts.',
    isActive: true,
  },
];

const sampleProducts = [
  // ==================== FRESH PRODUCE - SEASONAL FRUITS ====================
  {
    name: 'Organic Red Apples',
    description: 'Fresh, crisp organic red apples grown in the hills. Rich in fiber and natural sweetness, perfect for snacking or baking. These premium apples are handpicked at perfect ripeness.',
    price: 180,
    comparePrice: 220,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Red Apples' }],
    sku: 'FR-APP-ORG-001',
    stock: 100,
    brand: 'Hill Valley Farms',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg', '5kg'] },
      { name: 'Quality', options: ['Premium', 'Standard'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Hill Valley Farms, Himachal Pradesh' },
      { key: 'Variety', value: 'Organic Red Delicious' },
      { key: 'Harvest Season', value: 'September-November' },
      { key: 'Storage', value: 'Keep Refrigerated (2-4°C)' },
      { key: 'Shelf Life', value: '7-10 days' },
      { key: 'Nutritional Value', value: 'High Fiber, Vitamin C' },
      { key: 'Pesticide Free', value: 'Certified Organic' }
    ],
    features: [
      'Hand-picked at perfect ripeness',
      'No artificial wax coating',
      'Rich in antioxidants',
      'Crisp and juicy texture',
      'Perfect for baking and snacking'
    ],
    tags: ['organic', 'fresh', 'apple', 'fruit', 'healthy', 'vitamin-c', 'fiber'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Fresh Green Grapes',
    description: 'Sweet and juicy green grapes, seedless variety. Perfect for snacking, making juice, or adding to fruit salads. Grown in organic vineyards.',
    price: 120,
    comparePrice: 150,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Green Grapes' }],
    sku: 'FR-GRP-GRN-001',
    stock: 80,
    brand: 'Vineyard Fresh',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg'] },
      { name: 'Type', options: ['Seedless', 'With Seeds'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Maharashtra Vineyards' },
      { key: 'Variety', value: 'Thompson Seedless' },
      { key: 'Sugar Content', value: 'High Natural Sweetness' },
      { key: 'Harvest', value: 'Vine Ripened' },
      { key: 'Storage', value: 'Refrigerate after purchase' },
      { key: 'Shelf Life', value: '5-7 days' },
      { key: 'Antioxidants', value: 'Rich in Resveratrol' }
    ],
    features: [
      'Seedless variety for easy eating',
      'High in natural antioxidants',
      'Perfect snack size',
      'Great for kids lunchboxes',
      'Ideal for making fresh juice'
    ],
    tags: ['grapes', 'green', 'seedless', 'sweet', 'antioxidants', 'fresh'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Premium Strawberries',
    description: 'Luscious red strawberries, perfectly ripe and sweet. Grown in controlled environments for optimal flavor and nutrition. Perfect for desserts and smoothies.',
    price: 300,
    comparePrice: 380,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Premium Strawberries' }],
    sku: 'FR-STR-PRM-001',
    stock: 50,
    brand: 'Berry Farms',
    variants: [
      { name: 'Weight', options: ['250g', '500g', '1kg'] },
      { name: 'Size', options: ['Medium', 'Large', 'Jumbo'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Mahabaleshwar, Maharashtra' },
      { key: 'Variety', value: 'Chandler Strawberry' },
      { key: 'Growing Method', value: 'Hydroponic' },
      { key: 'Harvest', value: 'Hand-picked daily' },
      { key: 'Storage', value: 'Keep refrigerated' },
      { key: 'Shelf Life', value: '3-5 days' },
      { key: 'Vitamin C', value: 'Very High Content' }
    ],
    features: [
      'Hand-picked at perfect ripeness',
      'High vitamin C content',
      'Natural sweetness without additives',
      'Perfect for desserts and smoothies',
      'Grown using sustainable methods'
    ],
    tags: ['strawberry', 'premium', 'vitamin-c', 'dessert', 'smoothie', 'fresh'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Sweet Pineapple',
    description: 'Tropical sweet pineapple, golden yellow and perfectly ripe. Rich in enzymes and vitamin C. Great for fresh eating or making juice.',
    price: 80,
    comparePrice: 100,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Sweet Pineapple' }],
    sku: 'FR-PIN-SWT-001',
    stock: 60,
    brand: 'Tropical Gardens',
    variants: [
      { name: 'Size', options: ['Small (1-1.5kg)', 'Medium (1.5-2kg)', 'Large (2-2.5kg)'] },
      { name: 'Ripeness', options: ['Ripe', 'Semi-Ripe'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Kerala Plantations' },
      { key: 'Variety', value: 'Queen Pineapple' },
      { key: 'Enzyme Content', value: 'High Bromelain' },
      { key: 'Harvest', value: 'Tree Ripened' },
      { key: 'Storage', value: 'Room temperature until ripe' },
      { key: 'Shelf Life', value: '3-5 days when ripe' },
      { key: 'Digestive Benefits', value: 'Natural digestive enzymes' }
    ],
    features: [
      'Rich in digestive enzymes',
      'High vitamin C and manganese',
      'Natural anti-inflammatory properties',
      'Perfect for fresh juice',
      'Great for tropical fruit salads'
    ],
    tags: ['pineapple', 'tropical', 'enzymes', 'vitamin-c', 'digestive', 'sweet'],
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Organic Papaya',
    description: 'Sweet and nutritious organic papaya, loaded with vitamins and digestive enzymes. Perfect for breakfast or as a healthy snack.',
    price: 60,
    comparePrice: 80,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Papaya' }],
    sku: 'FR-PAP-ORG-001',
    stock: 70,
    brand: 'Organic Valley',
    variants: [
      { name: 'Size', options: ['Small (500g-1kg)', 'Medium (1-1.5kg)', 'Large (1.5-2kg)'] },
      { name: 'Ripeness', options: ['Ripe', 'Semi-Ripe'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Tamil Nadu Organic Farms' },
      { key: 'Variety', value: 'Red Lady Papaya' },
      { key: 'Growing Method', value: 'Certified Organic' },
      { key: 'Enzyme Content', value: 'High Papain' },
      { key: 'Storage', value: 'Room temperature to ripen' },
      { key: 'Shelf Life', value: '3-5 days when ripe' },
      { key: 'Nutritional Value', value: 'High Vitamin A, C' }
    ],
    features: [
      'Rich in papain enzyme for digestion',
      'High in vitamin A and antioxidants',
      'Natural anti-inflammatory properties',
      'Perfect for smoothies and salads',
      'Supports digestive health'
    ],
    tags: ['papaya', 'organic', 'digestive', 'vitamin-a', 'antioxidants', 'healthy'],
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Farm Fresh Oranges',
    description: 'Juicy, sweet oranges packed with vitamin C. Handpicked from our organic citrus groves for maximum freshness and flavor. Perfect for fresh juice or eating.',
    price: 150,
    comparePrice: 180,
    categoryName: 'Citrus Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Farm Fresh Oranges' }],
    sku: 'FR-ORG-CIT-001',
    stock: 150,
    brand: 'Citrus Grove Co.',
    variants: [
      { name: 'Weight', options: ['1kg', '2kg', '5kg', '10kg'] },
      { name: 'Size', options: ['Medium', 'Large', 'Extra Large'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Nagpur, Maharashtra' },
      { key: 'Variety', value: 'Valencia Oranges' },
      { key: 'Vitamin C Content', value: '53mg per 100g' },
      { key: 'Harvest Method', value: 'Tree Ripened' },
      { key: 'Storage', value: 'Room Temperature (3-4 days)' },
      { key: 'Juice Content', value: 'High (60-70%)' },
      { key: 'Seed Type', value: 'Low Seed Content' }
    ],
    features: [
      'High juice content perfect for fresh juice',
      'Rich in vitamin C and folate',
      'Natural source of fiber',
      'Fresh citrus aroma',
      'Perfect for marmalades and desserts'
    ],
    tags: ['citrus', 'orange', 'vitamin-c', 'fresh', 'juicy', 'nagpur'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Fresh Lemons',
    description: 'Tangy and juicy fresh lemons, perfect for cooking, beverages, and natural remedies. Rich in vitamin C and citric acid.',
    price: 100,
    comparePrice: 130,
    categoryName: 'Citrus Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1565550939265-68e45bfc8c1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Lemons' }],
    sku: 'FR-LEM-FRS-001',
    stock: 120,
    brand: 'Citrus Fresh',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg'] },
      { name: 'Size', options: ['Small', 'Medium', 'Large'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Rajasthan Citrus Farms' },
      { key: 'Variety', value: 'Eureka Lemons' },
      { key: 'Citric Acid Content', value: '5-6%' },
      { key: 'Vitamin C', value: 'Very High' },
      { key: 'Storage', value: 'Refrigerate for longer life' },
      { key: 'Shelf Life', value: '2-3 weeks refrigerated' },
      { key: 'Juice Content', value: '30-40%' }
    ],
    features: [
      'High citric acid content',
      'Perfect for detox drinks',
      'Natural preservative properties',
      'Great for cooking and baking',
      'Rich in vitamin C and antioxidants'
    ],
    tags: ['lemon', 'citrus', 'vitamin-c', 'detox', 'cooking', 'tangy'],
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Sweet Lime (Mosambi)',
    description: 'Sweet and refreshing mosambi, perfect for fresh juice. Low in acidity and high in vitamin C. Great for all ages.',
    price: 120,
    comparePrice: 150,
    categoryName: 'Citrus Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Sweet Lime Mosambi' }],
    sku: 'FR-SLM-MSB-001',
    stock: 100,
    brand: 'Sweet Valley',
    variants: [
      { name: 'Weight', options: ['1kg', '2kg', '5kg'] },
      { name: 'Size', options: ['Medium', 'Large'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Gujarat Citrus Belt' },
      { key: 'Variety', value: 'Sweet Lime' },
      { key: 'Acidity Level', value: 'Low (0.3-0.5%)' },
      { key: 'Sugar Content', value: 'Natural Sweetness' },
      { key: 'Juice Content', value: 'Very High (70-80%)' },
      { key: 'Storage', value: 'Room Temperature' },
      { key: 'Shelf Life', value: '7-10 days' }
    ],
    features: [
      'Low acidity, gentle on stomach',
      'Very high juice content',
      'Natural sweetness without added sugar',
      'Perfect for children and elderly',
      'Rich in vitamin C and potassium'
    ],
    tags: ['sweet-lime', 'mosambi', 'low-acid', 'juice', 'gentle', 'vitamin-c'],
    isActive: true,
    isFeatured: false,
  },
  
  // ==================== FRESH PRODUCE - LEAFY GREENS ====================
  {
    name: 'Organic Spinach Leaves',
    description: 'Fresh, tender organic spinach leaves rich in iron and vitamins. Perfect for salads, smoothies, and cooking.',
    price: 80,
    comparePrice: 100,
    categoryName: 'Leafy Greens',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Spinach Leaves' }],
    sku: 'VG-SPN-ORG-001',
    stock: 80,
    brand: 'Green Leaf Farms',
    variants: [
      { name: 'Weight', options: ['250g', '500g', '1kg'] },
      { name: 'Type', options: ['Baby Spinach', 'Regular'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Green Leaf Farms' },
      { key: 'Type', value: 'Organic Baby Spinach' },
      { key: 'Nutrients', value: 'High in Iron & Folate' },
      { key: 'Harvest', value: 'Daily Fresh' },
      { key: 'Storage', value: 'Keep Refrigerated' }
    ],
    tags: ['spinach', 'leafy', 'organic', 'iron', 'healthy'],
    isActive: true,
    isFeatured: false,
  },
  
  // ==================== FRESH PRODUCE - ROOT VEGETABLES ====================
  {
    name: 'Farm Fresh Potatoes',
    description: 'High-quality farm fresh potatoes perfect for all cooking needs. Grown in rich, fertile soil without harmful chemicals using traditional farming methods.',
    price: 60,
    comparePrice: 80,
    categoryName: 'Root Vegetables',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Farm Fresh Potatoes' }],
    sku: 'VG-POT-FRM-001',
    stock: 200,
    brand: 'Valley Potato Farm',
    variants: [
      { name: 'Weight', options: ['1kg', '2kg', '5kg', '10kg', '25kg'] },
      { name: 'Size', options: ['Small', 'Medium', 'Large'] },
      { name: 'Type', options: ['Regular', 'Washed', 'Organic'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Punjab Valley Farms' },
      { key: 'Variety', value: 'Kufri Jyoti (Red Potatoes)' },
      { key: 'Growing Method', value: 'Natural Farming' },
      { key: 'Starch Content', value: 'High Quality Starch' },
      { key: 'Storage Temperature', value: 'Cool, Dry Place (7-10°C)' },
      { key: 'Shelf Life', value: '2-3 weeks properly stored' },
      { key: 'Pesticide Residue', value: 'Below Detection Limits' }
    ],
    features: [
      'Versatile for all cooking methods',
      'High in potassium and vitamin C',
      'Good source of dietary fiber',
      'Perfect for frying, boiling, baking',
      'Natural farming without chemicals'
    ],
    tags: ['potato', 'root-vegetable', 'staple', 'cooking', 'natural', 'versatile'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Fresh Carrots',
    description: 'Crunchy and sweet fresh carrots, rich in beta-carotene and fiber. Perfect for snacking, cooking, and juicing.',
    price: 70,
    comparePrice: 90,
    categoryName: 'Root Vegetables',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Carrots' }],
    sku: 'VG-CAR-FRS-001',
    stock: 150,
    brand: 'Orange Fields',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg', '5kg'] },
      { name: 'Size', options: ['Baby Carrots', 'Regular', 'Large'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Haryana Carrot Belt' },
      { key: 'Variety', value: 'Delhi Carrot' },
      { key: 'Beta-Carotene', value: 'Very High (8285mcg per 100g)' },
      { key: 'Sweetness Level', value: 'Naturally Sweet' },
      { key: 'Harvest', value: 'Winter Harvest' },
      { key: 'Storage', value: 'Refrigerate for best quality' },
      { key: 'Shelf Life', value: '2-3 weeks refrigerated' }
    ],
    features: [
      'Excellent source of vitamin A',
      'High in fiber and antioxidants',
      'Perfect for fresh juice',
      'Natural sweetness great for kids',
      'Supports eye health and immunity'
    ],
    tags: ['carrot', 'root-vegetable', 'beta-carotene', 'vitamin-a', 'crunchy', 'sweet'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Fresh Beetroot',
    description: 'Deep red fresh beetroot, rich in nitrates and antioxidants. Great for salads, juicing, and cooking. Supports cardiovascular health.',
    price: 80,
    comparePrice: 100,
    categoryName: 'Root Vegetables',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1550284148-4f4b87a8e37b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Beetroot' }],
    sku: 'VG-BET-FRS-001',
    stock: 100,
    brand: 'Red Earth Farms',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg'] },
      { name: 'Size', options: ['Medium', 'Large'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Rajasthan Red Soil Farms' },
      { key: 'Variety', value: 'Detroit Dark Red' },
      { key: 'Nitrate Content', value: 'High Natural Nitrates' },
      { key: 'Antioxidants', value: 'Rich in Betalains' },
      { key: 'Harvest', value: 'Fresh from field' },
      { key: 'Storage', value: 'Cool, dry place' },
      { key: 'Shelf Life', value: '2-3 weeks' }
    ],
    features: [
      'Rich in natural nitrates for blood flow',
      'High in folate and fiber',
      'Natural detoxifying properties',
      'Perfect for fresh juice blends',
      'Supports athletic performance'
    ],
    tags: ['beetroot', 'nitrates', 'antioxidants', 'detox', 'cardiovascular', 'red'],
    isActive: true,
    isFeatured: false,
  },

  
  // ==================== FRESH PRODUCE - GENERAL VEGETABLES ====================
  {
    name: 'Fresh Tomatoes',
    description: 'Vine-ripened red tomatoes bursting with flavor and lycopene. Grown naturally without chemicals, perfect for cooking, salads, and sauces.',
    price: 90,
    comparePrice: 120,
    categoryName: 'Vegetables',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Tomatoes' }],
    sku: 'VG-TOM-FRS-001',
    stock: 150,
    brand: 'Garden Fresh Farms',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg', '5kg'] },
      { name: 'Size', options: ['Cherry', 'Medium', 'Large', 'Beefsteak'] },
      { name: 'Type', options: ['Regular', 'Organic', 'Heirloom'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Karnataka Greenhouse Farms' },
      { key: 'Variety', value: 'Hybrid Vine Ripened' },
      { key: 'Lycopene Content', value: 'High (2573mcg per 100g)' },
      { key: 'Ripeness', value: 'Vine Ripened for Best Flavor' },
      { key: 'Color', value: 'Deep Red when fully ripe' },
      { key: 'Storage', value: 'Room Temperature until ripe' },
      { key: 'Shelf Life', value: '5-7 days at room temperature' }
    ],
    features: [
      'High in lycopene antioxidant',
      'Rich in vitamin C and potassium',
      'Perfect for fresh consumption and cooking',
      'Vine-ripened for maximum flavor',
      'Great source of umami flavor'
    ],
    tags: ['tomato', 'vegetable', 'vine-ripened', 'cooking', 'natural', 'lycopene'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Fresh Onions',
    description: 'Premium quality fresh onions, essential for cooking. Strong flavor and aroma, grown using traditional methods for best taste.',
    price: 50,
    comparePrice: 70,
    categoryName: 'Vegetables',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1580201092675-a0a6a8b64a6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Onions' }],
    sku: 'VG-ONI-FRS-001',
    stock: 300,
    brand: 'Nashik Onion Co.',
    variants: [
      { name: 'Weight', options: ['1kg', '2kg', '5kg', '10kg', '25kg'] },
      { name: 'Size', options: ['Small', 'Medium', 'Large'] },
      { name: 'Type', options: ['Red Onion', 'White Onion'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Nashik, Maharashtra' },
      { key: 'Variety', value: 'Nashik Red Onion' },
      { key: 'Flavor Profile', value: 'Strong and Pungent' },
      { key: 'Storage Life', value: 'Long Storage Variety' },
      { key: 'Dry Matter', value: 'High (12-15%)' },
      { key: 'Storage', value: 'Cool, Dry, Well-ventilated place' },
      { key: 'Shelf Life', value: '1-2 months properly stored' }
    ],
    features: [
      'Essential cooking ingredient',
      'Rich in quercetin antioxidants',
      'Natural anti-inflammatory properties',
      'Long storage life',
      'Strong flavor enhancer for all cuisines'
    ],
    tags: ['onion', 'cooking', 'essential', 'nashik', 'storage', 'flavor'],
    isActive: true,
    isFeatured: false,
  },

  {
    name: 'Organic Rice (Basmati)',
    description: 'Premium quality organic basmati rice with long grains and aromatic fragrance. Grown using traditional methods.',
    price: 120,
    comparePrice: 150,
    categoryName: 'Grains & Cereals',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Basmati Rice' }],
    sku: 'GR-RIC-BAS-001',
    stock: 200,
    brand: 'Golden Harvest',
    variants: [
      { name: 'Weight', options: ['1kg', '5kg', '10kg', '25kg'] },
      { name: 'Grade', options: ['Premium', 'Extra Long Grain'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Punjab Fields' },
      { key: 'Type', value: 'Basmati 1121' },
      { key: 'Aging', value: '2 Years Aged' },
      { key: 'Certification', value: 'Organic Certified' },
      { key: 'Storage', value: 'Cool Dry Place' }
    ],
    tags: ['rice', 'basmati', 'organic', 'grains', 'aromatic'],
    isActive: true,
    isFeatured: true,
  },

  // Handicrafts & Artisans Products
  {
    name: 'Handwoven Bamboo Basket',
    description: 'Beautiful handwoven bamboo basket crafted by skilled artisans. Perfect for storage and home decor.',
    price: 450,
    comparePrice: 600,
    categoryName: 'Traditional Crafts',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Handwoven Bamboo Basket' }],
    sku: 'HC-BAS-BAM-001',
    stock: 25,
    brand: 'Rural Artisans',
    variants: [
      { name: 'Size', options: ['Small', 'Medium', 'Large'] },
      { name: 'Color', options: ['Natural', 'Brown', 'Light'] }
    ],
    specifications: [
      { key: 'Material', value: '100% Natural Bamboo' },
      { key: 'Craft', value: 'Handwoven' },
      { key: 'Origin', value: 'Rural Villages' },
      { key: 'Durability', value: 'Long Lasting' },
      { key: 'Care', value: 'Wipe Clean' }
    ],
    tags: ['bamboo', 'handwoven', 'basket', 'storage', 'eco-friendly'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Clay Water Pot (Matka)',
    description: 'Traditional clay water pot that keeps water naturally cool. Handmade by village potters using ancient techniques.',
    price: 300,
    comparePrice: 400,
    categoryName: 'Pottery & Ceramics',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Clay Water Pot' }],
    sku: 'PC-POT-CLA-001',
    stock: 30,
    brand: 'Village Pottery',
    variants: [
      { name: 'Capacity', options: ['5L', '10L', '15L', '20L'] },
      { name: 'Style', options: ['Traditional', 'Modern'] }
    ],
    specifications: [
      { key: 'Material', value: 'Natural Clay' },
      { key: 'Technique', value: 'Hand Molded' },
      { key: 'Cooling', value: 'Natural Evaporation' },
      { key: 'Health', value: 'Chemical Free' },
      { key: 'Care', value: 'Clean with Water' }
    ],
    tags: ['clay', 'water-pot', 'traditional', 'cooling', 'handmade'],
    isActive: true,
    isFeatured: false,
  },

  {
    name: 'Handloom Cotton Fabric',
    description: 'Pure handloom cotton fabric woven by traditional weavers. Soft, breathable, and perfect for clothing.',
    price: 250,
    comparePrice: 320,
    categoryName: 'Textiles & Weaving',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Handloom Cotton Fabric' }],
    sku: 'TW-FAB-COT-001',
    stock: 40,
    brand: 'Weaver Collective',
    variants: [
      { name: 'Color', options: ['White', 'Cream', 'Light Blue', 'Pink'] },
      { name: 'Pattern', options: ['Plain', 'Striped', 'Checkered'] }
    ],
    specifications: [
      { key: 'Material', value: '100% Cotton' },
      { key: 'Weave', value: 'Handloom' },
      { key: 'Thread Count', value: 'High Quality' },
      { key: 'Texture', value: 'Soft & Breathable' },
      { key: 'Care', value: 'Machine Washable' }
    ],
    tags: ['cotton', 'handloom', 'fabric', 'weaving', 'traditional'],
    isActive: true,
    isFeatured: false,
  },

  // Clothing & Apparel Products
  {
    name: 'Men\'s Cotton Kurta',
    description: 'Traditional handwoven cotton kurta for men. Comfortable, breathable, and perfect for daily wear or special occasions.',
    price: 800,
    comparePrice: 1000,
    categoryName: 'Men\'s Traditional Wear',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Men\'s Cotton Kurta' }],
    sku: 'CL-KUR-MEN-001',
    stock: 50,
    brand: 'Traditional Wear Co.',
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['White', 'Cream', 'Blue', 'Green'] }
    ],
    specifications: [
      { key: 'Material', value: '100% Cotton' },
      { key: 'Style', value: 'Traditional Kurta' },
      { key: 'Fit', value: 'Regular Fit' },
      { key: 'Occasion', value: 'Casual/Formal' },
      { key: 'Care', value: 'Machine Wash' }
    ],
    tags: ['kurta', 'men', 'traditional', 'cotton', 'ethnic'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Women\'s Handloom Saree',
    description: 'Beautiful handloom saree with traditional designs. Crafted by skilled weavers using time-honored techniques.',
    price: 1500,
    comparePrice: 2000,
    categoryName: 'Women\'s Traditional Wear',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Women\'s Handloom Saree' }],
    sku: 'CL-SAR-WOM-001',
    stock: 30,
    brand: 'Handloom Heritage',
    variants: [
      { name: 'Color', options: ['Red', 'Blue', 'Green', 'Yellow', 'Pink'] },
      { name: 'Design', options: ['Traditional', 'Contemporary', 'Floral'] }
    ],
    specifications: [
      { key: 'Material', value: 'Handloom Cotton/Silk' },
      { key: 'Length', value: '6.5 meters' },
      { key: 'Border', value: 'Traditional Design' },
      { key: 'Weave', value: 'Handloom' },
      { key: 'Care', value: 'Dry Clean Recommended' }
    ],
    tags: ['saree', 'women', 'handloom', 'traditional', 'ethnic'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Rural Casual Shirt',
    description: 'Comfortable casual shirt with rural charm. Made from natural fabrics, perfect for everyday wear.',
    price: 600,
    comparePrice: 800,
    categoryName: 'Rural Casual Wear',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Rural Casual Shirt' }],
    sku: 'CL-SHI-CAS-001',
    stock: 60,
    brand: 'Rural Fashion',
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Khaki', 'Brown', 'Olive', 'Navy'] }
    ],
    specifications: [
      { key: 'Material', value: 'Cotton Blend' },
      { key: 'Style', value: 'Casual Button-down' },
      { key: 'Fit', value: 'Regular Fit' },
      { key: 'Collar', value: 'Spread Collar' },
      { key: 'Care', value: 'Machine Wash' }
    ],
    tags: ['shirt', 'casual', 'rural', 'cotton', 'comfortable'],
    isActive: true,
    isFeatured: false,
  },

  // Home & Living Products
  {
    name: 'Wooden Dining Table',
    description: 'Handcrafted wooden dining table made from sustainable wood. Perfect for family gatherings and everyday dining.',
    price: 15000,
    comparePrice: 20000,
    categoryName: 'Furniture',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wooden Dining Table' }],
    sku: 'HL-TAB-WOD-001',
    stock: 10,
    brand: 'Rural Furniture',
    variants: [
      { name: 'Size', options: ['4-Seater', '6-Seater', '8-Seater'] },
      { name: 'Wood Type', options: ['Teak', 'Sheesham', 'Mango Wood'] }
    ],
    specifications: [
      { key: 'Material', value: 'Solid Wood' },
      { key: 'Finish', value: 'Natural Polish' },
      { key: 'Assembly', value: 'Pre-assembled' },
      { key: 'Warranty', value: '2 Years' },
      { key: 'Care', value: 'Dust with Dry Cloth' }
    ],
    tags: ['furniture', 'dining-table', 'wooden', 'handcrafted', 'sustainable'],
    isActive: true,
    isFeatured: true,
  },

  {
    name: 'Clay Cooking Pots Set',
    description: 'Traditional clay cooking pot set for healthy cooking. Retains nutrients and adds natural flavor to food.',
    price: 800,
    comparePrice: 1200,
    categoryName: 'Kitchen & Dining',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Clay Cooking Pots' }],
    sku: 'KD-POT-CLA-001',
    stock: 40,
    brand: 'Traditional Kitchen',
    variants: [
      { name: 'Set Size', options: ['3-Piece', '5-Piece', '7-Piece'] },
      { name: 'Capacity', options: ['Small', 'Medium', 'Large'] }
    ],
    specifications: [
      { key: 'Material', value: 'Natural Clay' },
      { key: 'Health Benefits', value: 'Chemical Free' },
      { key: 'Cooking Style', value: 'Traditional' },
      { key: 'Heat Retention', value: 'Excellent' },
      { key: 'Care', value: 'Season Before Use' }
    ],
    tags: ['clay-pots', 'cooking', 'traditional', 'healthy', 'kitchen'],
    isActive: true,
    isFeatured: false,
  },

  {
    name: 'Handmade Jute Wall Hanging',
    description: 'Beautiful handmade jute wall hanging with traditional patterns. Perfect for adding rustic charm to any space.',
    price: 350,
    comparePrice: 500,
    categoryName: 'Home Décor',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Jute Wall Hanging' }],
    sku: 'HD-WAL-JUT-001',
    stock: 25,
    brand: 'Rustic Decor',
    variants: [
      { name: 'Size', options: ['Small', 'Medium', 'Large'] },
      { name: 'Pattern', options: ['Geometric', 'Floral', 'Abstract'] }
    ],
    specifications: [
      { key: 'Material', value: '100% Natural Jute' },
      { key: 'Craft', value: 'Handmade' },
      { key: 'Style', value: 'Rustic' },
      { key: 'Installation', value: 'Wall Mounted' },
      { key: 'Care', value: 'Dust Occasionally' }
    ],
    tags: ['jute', 'wall-hanging', 'decor', 'handmade', 'rustic'],
    isActive: true,
    isFeatured: false,
  },

  // ==================== MORE FRESH PRODUCE - SEASONAL FRUITS ====================
  {
    name: 'Sweet Bananas',
    description: 'Naturally ripened sweet bananas rich in potassium and energy. Perfect for breakfast, snacks, and smoothies. Grown in sustainable plantations.',
    price: 80,
    comparePrice: 100,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Sweet Bananas' }],
    sku: 'FR-BAN-SWT-001',
    stock: 120,
    brand: 'Tropical Farms',
    variants: [
      { name: 'Bunch Size', options: ['Small (6-8 pieces)', 'Medium (10-12 pieces)', 'Large (15-20 pieces)'] },
      { name: 'Ripeness', options: ['Green (Unripe)', 'Yellow (Ripe)', 'Spotted (Very Ripe)'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Kerala Banana Plantations' },
      { key: 'Variety', value: 'Robusta Banana' },
      { key: 'Potassium Content', value: 'Very High (358mg per 100g)' },
      { key: 'Ripening', value: 'Natural Tree Ripening' },
      { key: 'Storage', value: 'Room Temperature' },
      { key: 'Shelf Life', value: '3-5 days depending on ripeness' },
      { key: 'Energy Value', value: '89 calories per 100g' }
    ],
    features: [
      'Excellent source of potassium and vitamin B6',
      'Natural energy booster',
      'Perfect for pre/post workout snacks',
      'Great for smoothies and baking',
      'Supports heart health and muscle function'
    ],
    tags: ['banana', 'fruit', 'potassium', 'energy', 'natural', 'heart-healthy'],
    isActive: true,
    isFeatured: false,
  },
  {
    name: 'Fresh Mangoes (Alphonso)',
    description: 'King of fruits - Alphonso mangoes with rich, creamy texture and sweet flavor. Hand-picked at perfect ripeness from Konkan region.',
    price: 400,
    comparePrice: 500,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1553279828-0e2d0b59e5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Alphonso Mangoes' }],
    sku: 'FR-MNG-ALP-001',
    stock: 80,
    brand: 'Konkan Gold',
    variants: [
      { name: 'Weight', options: ['500g (3-4 pieces)', '1kg (6-8 pieces)', '2kg (12-15 pieces)'] },
      { name: 'Size', options: ['Medium', 'Large', 'Extra Large'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Konkan Region, Maharashtra' },
      { key: 'Variety', value: 'Certified Alphonso' },
      { key: 'Season', value: 'April-June (Peak Season)' },
      { key: 'Sugar Content', value: 'Very High Natural Sweetness' },
      { key: 'Texture', value: 'Creamy, Fiber-free' },
      { key: 'Storage', value: 'Ripen at room temperature' },
      { key: 'Shelf Life', value: '3-5 days when ripe' }
    ],
    features: [
      'Certified Geographical Indication (GI) tag',
      'Rich in vitamin A and C',
      'Natural source of antioxidants',
      'Perfect for desserts and smoothies',
      'Traditional hand-harvesting methods'
    ],
    tags: ['mango', 'alphonso', 'premium', 'seasonal', 'vitamin-a', 'gi-certified'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Fresh Pomegranates',
    description: 'Ruby red pomegranates packed with antioxidants and flavor. Each fruit is carefully selected for quality and freshness.',
    price: 200,
    comparePrice: 250,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1553279828-0e2d0b59e5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Pomegranates' }],
    sku: 'FR-POM-RED-001',
    stock: 90,
    brand: 'Ruby Orchards',
    variants: [
      { name: 'Weight', options: ['500g (2-3 pieces)', '1kg (4-5 pieces)', '2kg (8-10 pieces)'] },
      { name: 'Quality', options: ['Premium', 'Extra Premium'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Maharashtra Pomegranate Belt' },
      { key: 'Variety', value: 'Bhagwa Pomegranate' },
      { key: 'Antioxidant Level', value: 'Very High (Punicalagins)' },
      { key: 'Aril Color', value: 'Deep Ruby Red' },
      { key: 'Sweetness', value: 'Perfect Sweet-Tart Balance' },
      { key: 'Storage', value: 'Refrigerate for longer life' },
      { key: 'Shelf Life', value: '2-3 weeks refrigerated' }
    ],
    features: [
      'Highest antioxidant content among fruits',
      'Rich in vitamin C and fiber',
      'Supports heart and brain health',
      'Perfect for fresh juice',
      'Natural anti-inflammatory properties'
    ],
    tags: ['pomegranate', 'antioxidants', 'heart-healthy', 'ruby-red', 'premium'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Fresh Coconuts',
    description: 'Fresh coconuts with sweet water and tender meat. Perfect for drinking, cooking, and making fresh coconut milk.',
    price: 50,
    comparePrice: 70,
    categoryName: 'Seasonal Fruits',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1553279828-0e2d0b59e5ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Coconuts' }],
    sku: 'FR-COC-FRS-001',
    stock: 100,
    brand: 'Coastal Farms',
    variants: [
      { name: 'Type', options: ['Tender (Young)', 'Semi-Mature', 'Mature'] },
      { name: 'Quantity', options: ['1 piece', '2 pieces', '5 pieces', '10 pieces'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Kerala Coastal Farms' },
      { key: 'Variety', value: 'West Coast Tall' },
      { key: 'Water Content', value: 'High (200-300ml per coconut)' },
      { key: 'Freshness', value: 'Harvested within 24 hours' },
      { key: 'Uses', value: 'Drinking, Cooking, Oil making' },
      { key: 'Storage', value: 'Cool, dry place' },
      { key: 'Shelf Life', value: '7-10 days' }
    ],
    features: [
      'Natural electrolyte drink',
      'Rich in healthy fats and minerals',
      'Perfect for rehydration',
      'Great for cooking and baking',
      'Sustainable and eco-friendly'
    ],
    tags: ['coconut', 'natural', 'electrolytes', 'coastal', 'healthy-fats'],
    isActive: true,
    isFeatured: false,
  },

  // ==================== MORE GRAINS & CEREALS ====================
  {
    name: 'Organic Wheat Flour',
    description: 'Stone-ground organic wheat flour made from premium wheat grains. Perfect for making fresh rotis, bread, and other baked goods.',
    price: 80,
    comparePrice: 100,
    categoryName: 'Grains & Cereals',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Wheat Flour' }],
    sku: 'GR-WHT-ORG-001',
    stock: 150,
    brand: 'Golden Harvest',
    variants: [
      { name: 'Weight', options: ['1kg', '5kg', '10kg', '25kg', '50kg'] },
      { name: 'Grade', options: ['Fine', 'Medium', 'Coarse'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Punjab Wheat Fields' },
      { key: 'Type', value: 'Organic Whole Wheat' },
      { key: 'Grinding Method', value: 'Traditional Stone Ground' },
      { key: 'Protein Content', value: '12-14%' },
      { key: 'Certification', value: 'Organic Certified' },
      { key: 'Storage', value: 'Cool, dry place in airtight container' },
      { key: 'Shelf Life', value: '6 months from milling date' }
    ],
    features: [
      'Stone-ground to retain nutrients',
      'High in fiber and protein',
      'No preservatives or additives',
      'Perfect for traditional Indian bread',
      'Supports digestive health'
    ],
    tags: ['wheat-flour', 'organic', 'stone-ground', 'traditional', 'high-fiber'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Mixed Millets',
    description: 'Nutritious mix of various millets including finger millet, pearl millet, and foxtail millet. Ancient grains packed with nutrients.',
    price: 150,
    comparePrice: 180,
    categoryName: 'Grains & Cereals',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Mixed Millets' }],
    sku: 'GR-MIL-MIX-001',
    stock: 80,
    brand: 'Ancient Grains Co.',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg', '5kg'] },
      { name: 'Mix Type', options: ['5-Grain Mix', '7-Grain Mix', '9-Grain Mix'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Karnataka & Telangana Farms' },
      { key: 'Composition', value: 'Finger, Pearl, Foxtail, Little, Kodo Millets' },
      { key: 'Protein Content', value: '10-12%' },
      { key: 'Fiber Content', value: 'Very High' },
      { key: 'Gluten Status', value: 'Naturally Gluten-Free' },
      { key: 'Glycemic Index', value: 'Low GI (Good for Diabetics)' },
      { key: 'Processing', value: 'Minimal Processing' }
    ],
    features: [
      'Ancient superfood grains',
      'Naturally gluten-free',
      'Low glycemic index',
      'Rich in minerals and vitamins',
      'Perfect for diabetic diet'
    ],
    tags: ['millets', 'ancient-grains', 'gluten-free', 'diabetic-friendly', 'superfood'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Organic Quinoa',
    description: 'Premium quality organic quinoa, a complete protein superfood. Ideal for health-conscious individuals and vegetarian diet.',
    price: 300,
    comparePrice: 380,
    categoryName: 'Grains & Cereals',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Quinoa' }],
    sku: 'GR-QUI-ORG-001',
    stock: 60,
    brand: 'Superfood Imports',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg'] },
      { name: 'Color', options: ['White', 'Red', 'Black', 'Tri-Color Mix'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Imported from Peru/Bolivia' },
      { key: 'Type', value: 'Certified Organic Royal Quinoa' },
      { key: 'Protein Content', value: 'Complete Protein (14-18%)' },
      { key: 'Amino Acids', value: 'All 9 Essential Amino Acids' },
      { key: 'Certification', value: 'USDA Organic, Fair Trade' },
      { key: 'Cooking Time', value: '12-15 minutes' },
      { key: 'Gluten Status', value: 'Naturally Gluten-Free' }
    ],
    features: [
      'Complete protein with all amino acids',
      'Superfood with high nutritional value',
      'Perfect rice substitute',
      'Great for salads and bowls',
      'Supports muscle building and recovery'
    ],
    tags: ['quinoa', 'superfood', 'complete-protein', 'gluten-free', 'organic'],
    isActive: true,
    isFeatured: true,
  },

  // ==================== DAIRY & POULTRY PRODUCTS ====================
  {
    name: 'Fresh Farm Milk',
    description: 'Pure, fresh milk from grass-fed cows. Rich, creamy, and packed with natural nutrients. Delivered daily from local dairy farms.',
    price: 60,
    comparePrice: 75,
    categoryName: 'Dairy & Poultry',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Fresh Farm Milk' }],
    sku: 'DP-MIL-FRS-001',
    stock: 200,
    brand: 'Pure Dairy Co.',
    variants: [
      { name: 'Volume', options: ['500ml', '1L', '2L'] },
      { name: 'Fat Content', options: ['Full Cream', 'Toned', 'Double Toned'] }
    ],
    specifications: [
      { key: 'Source', value: 'Grass-fed Local Cows' },
      { key: 'Fat Content', value: '3.5% (Full Cream)' },
      { key: 'Protein', value: '3.2g per 100ml' },
      { key: 'Processing', value: 'Pasteurized' },
      { key: 'Additives', value: 'None - 100% Natural' },
      { key: 'Storage', value: 'Refrigerate at 4°C' },
      { key: 'Shelf Life', value: '3-4 days refrigerated' }
    ],
    features: [
      'From grass-fed healthy cows',
      'No artificial hormones or antibiotics',
      'High in calcium and protein',
      'Fresh daily delivery available',
      'Traditional dairy farming methods'
    ],
    tags: ['milk', 'dairy', 'fresh', 'grass-fed', 'natural', 'calcium'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Farm Fresh Eggs',
    description: 'Free-range chicken eggs from happy hens. Rich orange yolks and firm whites, perfect for all cooking needs.',
    price: 8,
    comparePrice: 10,
    categoryName: 'Dairy & Poultry',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Farm Fresh Eggs' }],
    sku: 'DP-EGG-FRS-001',
    stock: 500,
    brand: 'Happy Hen Farms',
    variants: [
      { name: 'Quantity', options: ['6 pieces', '12 pieces', '24 pieces', '30 pieces'] },
      { name: 'Size', options: ['Medium', 'Large', 'Extra Large'] }
    ],
    specifications: [
      { key: 'Source', value: 'Free-Range Country Chickens' },
      { key: 'Feed', value: 'Natural Grain Feed' },
      { key: 'Yolk Color', value: 'Rich Orange (Natural)' },
      { key: 'Collection', value: 'Daily Fresh Collection' },
      { key: 'Weight', value: '50-60g per egg (Large)' },
      { key: 'Storage', value: 'Refrigerate for best quality' },
      { key: 'Shelf Life', value: '2-3 weeks refrigerated' }
    ],
    features: [
      'Free-range hens with outdoor access',
      'Rich in omega-3 fatty acids',
      'High-quality protein source',
      'Natural orange yolks',
      'No artificial hormones or antibiotics'
    ],
    tags: ['eggs', 'free-range', 'poultry', 'protein', 'omega-3', 'natural'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Homemade Paneer',
    description: 'Fresh, soft paneer made daily using traditional methods. Perfect for Indian cooking and rich in protein.',
    price: 250,
    comparePrice: 300,
    categoryName: 'Dairy & Poultry',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Homemade Paneer' }],
    sku: 'DP-PAN-HOM-001',
    stock: 80,
    brand: 'Village Dairy',
    variants: [
      { name: 'Weight', options: ['250g', '500g', '1kg'] },
      { name: 'Texture', options: ['Soft', 'Medium-Firm'] }
    ],
    specifications: [
      { key: 'Made From', value: 'Fresh Full-Fat Milk' },
      { key: 'Preparation', value: 'Traditional Method' },
      { key: 'Protein Content', value: 'High (18-20g per 100g)' },
      { key: 'Freshness', value: 'Made Daily' },
      { key: 'Texture', value: 'Soft and Crumbly' },
      { key: 'Storage', value: 'Refrigerate immediately' },
      { key: 'Shelf Life', value: '2-3 days refrigerated' }
    ],
    features: [
      'Made fresh daily using traditional methods',
      'High in protein and calcium',
      'No preservatives or additives',
      'Perfect for curries and grilling',
      'Vegetarian protein source'
    ],
    tags: ['paneer', 'dairy', 'protein', 'vegetarian', 'traditional', 'fresh'],
    isActive: true,
    isFeatured: true,
  },

  // ==================== SPICES & CONDIMENTS ====================
  {
    name: 'Organic Turmeric Powder',
    description: 'Pure organic turmeric powder with high curcumin content. Known for its anti-inflammatory properties and golden color.',
    price: 180,
    comparePrice: 220,
    categoryName: 'Spices & Condiments',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1615485930748-1a6b60d13d70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Turmeric Powder' }],
    sku: 'SP-TUR-ORG-001',
    stock: 100,
    brand: 'Spice Valley',
    variants: [
      { name: 'Weight', options: ['100g', '250g', '500g', '1kg'] },
      { name: 'Grade', options: ['Premium', 'Export Quality'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Erode, Tamil Nadu' },
      { key: 'Curcumin Content', value: '3-5% (High Grade)' },
      { key: 'Processing', value: 'Sun Dried & Stone Ground' },
      { key: 'Color', value: 'Deep Golden Yellow' },
      { key: 'Moisture Content', value: 'Below 10%' },
      { key: 'Certification', value: 'Organic Certified' },
      { key: 'Shelf Life', value: '24 months in airtight container' }
    ],
    features: [
      'High curcumin content for health benefits',
      'Anti-inflammatory and antioxidant properties',
      'Perfect for cooking and medicinal use',
      'No artificial colors or additives',
      'Traditional stone grinding preserves nutrients'
    ],
    tags: ['turmeric', 'spice', 'organic', 'curcumin', 'anti-inflammatory', 'traditional'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Red Chili Powder',
    description: 'Premium quality red chili powder made from specially selected dry red chilies. Adds perfect heat and color to dishes.',
    price: 120,
    comparePrice: 150,
    categoryName: 'Spices & Condiments',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1615485930748-1a6b60d13d70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Red Chili Powder' }],
    sku: 'SP-CHI-RED-001',
    stock: 150,
    brand: 'Fire Spice Co.',
    variants: [
      { name: 'Weight', options: ['100g', '250g', '500g', '1kg'] },
      { name: 'Heat Level', options: ['Mild', 'Medium', 'Hot', 'Extra Hot'] }
    ],
    specifications: [
      { key: 'Origin', value: 'Guntur, Andhra Pradesh' },
      { key: 'Variety', value: 'Guntur Sannam Chili' },
      { key: 'Scoville Rating', value: '35,000-40,000 SHU' },
      { key: 'Color Value', value: 'High (120-140 ASTA)' },
      { key: 'Processing', value: 'Stem Removed, Ground Fresh' },
      { key: 'Moisture', value: 'Below 8%' },
      { key: 'Shelf Life', value: '18 months' }
    ],
    features: [
      'Made from premium Guntur chilies',
      'Perfect balance of heat and flavor',
      'Rich red color for attractive dishes',
      'High vitamin C content',
      'Essential spice for Indian cuisine'
    ],
    tags: ['chili-powder', 'spice', 'hot', 'guntur', 'vitamin-c', 'indian'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Garam Masala Blend',
    description: 'Authentic homemade garam masala blend with traditional whole spices. Adds warmth and aroma to any dish.',
    price: 200,
    comparePrice: 250,
    categoryName: 'Spices & Condiments',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1615485930748-1a6b60d13d70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Garam Masala Blend' }],
    sku: 'SP-GAR-BLE-001',
    stock: 80,
    brand: 'Traditional Spices',
    variants: [
      { name: 'Weight', options: ['50g', '100g', '250g', '500g'] },
      { name: 'Blend Type', options: ['Punjabi Style', 'South Indian Style', 'Bengali Style'] }
    ],
    specifications: [
      { key: 'Ingredients', value: 'Cardamom, Cinnamon, Cloves, Bay leaves, etc.' },
      { key: 'Preparation', value: 'Roasted & Ground Fresh' },
      { key: 'Aroma', value: 'Rich and Warm' },
      { key: 'Usage', value: 'Finish spice for curries' },
      { key: 'Processing', value: 'Small Batch Preparation' },
      { key: 'Freshness', value: 'Ground Weekly' },
      { key: 'Shelf Life', value: '12 months' }
    ],
    features: [
      'Made from premium whole spices',
      'Traditional family recipe',
      'Freshly roasted and ground',
      'No artificial colors or preservatives',
      'Perfect finishing spice for curries'
    ],
    tags: ['garam-masala', 'spice-blend', 'traditional', 'aromatic', 'indian-cooking'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Homemade Mango Pickle',
    description: 'Traditional mango pickle made with raw mangoes and authentic spices. Tangy, spicy, and full of flavor.',
    price: 180,
    comparePrice: 220,
    categoryName: 'Spices & Condiments',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1615485930748-1a6b60d13d70?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Homemade Mango Pickle' }],
    sku: 'SP-PIC-MAN-001',
    stock: 60,
    brand: 'Village Kitchen',
    variants: [
      { name: 'Weight', options: ['250g', '500g', '1kg'] },
      { name: 'Style', options: ['North Indian', 'South Indian', 'Gujarati'] }
    ],
    specifications: [
      { key: 'Main Ingredient', value: 'Fresh Raw Mangoes' },
      { key: 'Oil Used', value: 'Mustard Oil' },
      { key: 'Spices', value: 'Mustard Seeds, Fenugreek, Red Chili' },
      { key: 'Preparation', value: 'Traditional Sun-drying Method' },
      { key: 'Preservatives', value: 'None - Natural Preservation' },
      { key: 'Maturation Time', value: '15-20 days' },
      { key: 'Shelf Life', value: '12 months' }
    ],
    features: [
      'Made with traditional family recipe',
      'No artificial preservatives',
      'Perfect accompaniment to Indian meals',
      'Rich in probiotics from fermentation',
      'Authentic village-style preparation'
    ],
    tags: ['pickle', 'mango', 'traditional', 'condiment', 'fermented', 'spicy'],
    isActive: true,
    isFeatured: false,
  },

  // ==================== FOOD & BEVERAGES ====================
  {
    name: 'Organic Honey',
    description: 'Pure, raw organic honey collected from wildflower meadows. Unprocessed and packed with natural enzymes and antioxidants.',
    price: 300,
    comparePrice: 380,
    categoryName: 'Food & Beverages',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1587049016474-b5c8dcb7e3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Honey' }],
    sku: 'FB-HON-ORG-001',
    stock: 80,
    brand: 'Bee Pure',
    variants: [
      { name: 'Weight', options: ['250g', '500g', '1kg'] },
      { name: 'Flower Type', options: ['Wildflower', 'Acacia', 'Eucalyptus', 'Mustard'] }
    ],
    specifications: [
      { key: 'Source', value: 'Himalayan Wildflower Meadows' },
      { key: 'Processing', value: 'Raw, Unprocessed' },
      { key: 'Moisture Content', value: 'Below 18%' },
      { key: 'Certification', value: 'Organic & Fair Trade' },
      { key: 'Crystallization', value: 'Natural (indicates purity)' },
      { key: 'Collection Method', value: 'Sustainable Beekeeping' },
      { key: 'Shelf Life', value: 'Indefinite if stored properly' }
    ],
    features: [
      'Raw and unprocessed for maximum nutrition',
      'Rich in enzymes and antioxidants',
      'Natural energy source',
      'Supports local beekeeping communities',
      'Perfect for medicinal and culinary use'
    ],
    tags: ['honey', 'organic', 'raw', 'natural', 'antioxidants', 'energy'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Traditional Jaggery (Gur)',
    description: 'Pure sugarcane jaggery made using traditional methods. Natural sweetener rich in minerals and iron.',
    price: 120,
    comparePrice: 150,
    categoryName: 'Food & Beverages',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1587049016474-b5c8dcb7e3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Traditional Jaggery' }],
    sku: 'FB-JAG-TRA-001',
    stock: 100,
    brand: 'Sweet Fields',
    variants: [
      { name: 'Weight', options: ['500g', '1kg', '2kg', '5kg'] },
      { name: 'Type', options: ['Block', 'Powder', 'Liquid'] }
    ],
    specifications: [
      { key: 'Source', value: 'Fresh Sugarcane Juice' },
      { key: 'Processing', value: 'Traditional Open Pan Method' },
      { key: 'Color', value: 'Golden Brown to Dark Brown' },
      { key: 'Iron Content', value: 'High (11mg per 100g)' },
      { key: 'Additives', value: 'None - 100% Pure' },
      { key: 'Texture', value: 'Firm but Soft' },
      { key: 'Shelf Life', value: '12 months in dry place' }
    ],
    features: [
      'Natural unrefined sweetener',
      'Rich in iron and minerals',
      'Traditional production methods',
      'Perfect substitute for white sugar',
      'Supports digestive health'
    ],
    tags: ['jaggery', 'natural-sweetener', 'iron-rich', 'traditional', 'unrefined'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Herbal Tea Blend',
    description: 'Ayurvedic herbal tea blend with tulsi, ginger, cardamom, and other healing herbs. Caffeine-free and wellness-focused.',
    price: 150,
    comparePrice: 180,
    categoryName: 'Food & Beverages',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1587049016474-b5c8dcb7e3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Herbal Tea Blend' }],
    sku: 'FB-TEA-HER-001',
    stock: 90,
    brand: 'Wellness Herbs',
    variants: [
      { name: 'Weight', options: ['50g', '100g', '250g'] },
      { name: 'Blend Type', options: ['Immunity Boost', 'Digestive', 'Stress Relief', 'Detox'] }
    ],
    specifications: [
      { key: 'Main Herbs', value: 'Tulsi, Ginger, Cardamom, Cinnamon' },
      { key: 'Caffeine', value: 'Caffeine-Free' },
      { key: 'Processing', value: 'Sun-Dried, Hand-Blended' },
      { key: 'Certification', value: 'Organic & Ayurvedic' },
      { key: 'Brewing Time', value: '5-7 minutes' },
      { key: 'Origin', value: 'Himalayan Herbs' },
      { key: 'Shelf Life', value: '24 months' }
    ],
    features: [
      'Ayurvedic wellness blend',
      'Caffeine-free natural energy',
      'Supports immunity and digestion',
      'Made with organic herbs',
      'Perfect for daily wellness routine'
    ],
    tags: ['herbal-tea', 'ayurvedic', 'caffeine-free', 'wellness', 'immunity', 'organic'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Organic Ghee (Clarified Butter)',
    description: 'Pure organic ghee made from grass-fed cow milk using traditional bilona method. Rich, aromatic, and nutritious.',
    price: 800,
    comparePrice: 1000,
    categoryName: 'Food & Beverages',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1587049016474-b5c8dcb7e3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Organic Ghee' }],
    sku: 'FB-GHE-ORG-001',
    stock: 60,
    brand: 'Golden Cow',
    variants: [
      { name: 'Weight', options: ['250ml', '500ml', '1L'] },
      { name: 'Method', options: ['Bilona (Traditional)', 'Modern Processing'] }
    ],
    specifications: [
      { key: 'Source', value: 'Grass-fed Desi Cow Milk' },
      { key: 'Method', value: 'Traditional Bilona Churning' },
      { key: 'Fat Content', value: '99.7%' },
      { key: 'Smoke Point', value: 'High (250°C)' },
      { key: 'Color', value: 'Golden Yellow' },
      { key: 'Aroma', value: 'Rich Nutty Fragrance' },
      { key: 'Shelf Life', value: '12 months without refrigeration' }
    ],
    features: [
      'Made using traditional bilona method',
      'Rich in fat-soluble vitamins A, D, E, K',
      'High smoke point perfect for cooking',
      'Lactose-free after clarification',
      'Supports digestive health and immunity'
    ],
    tags: ['ghee', 'organic', 'grass-fed', 'traditional', 'bilona', 'healthy-fat'],
    isActive: true,
    isFeatured: true,
  },

  // ==================== TOOLS & EQUIPMENT ====================
  {
    name: 'Traditional Farming Sickle',
    description: 'High-quality steel sickle for harvesting crops and grass cutting. Sharp, durable, and ergonomically designed handle.',
    price: 350,
    comparePrice: 450,
    categoryName: 'Tools & Equipment',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Traditional Farming Sickle' }],
    sku: 'TE-SIC-TRA-001',
    stock: 50,
    brand: 'Farm Tools Pro',
    variants: [
      { name: 'Blade Size', options: ['Small (6 inch)', 'Medium (8 inch)', 'Large (10 inch)'] },
      { name: 'Handle Material', options: ['Wood', 'Composite'] }
    ],
    specifications: [
      { key: 'Blade Material', value: 'High Carbon Steel' },
      { key: 'Handle Material', value: 'Seasoned Hardwood' },
      { key: 'Blade Hardness', value: 'HRC 58-62' },
      { key: 'Weight', value: '200-300g depending on size' },
      { key: 'Edge Retention', value: 'Long Lasting Sharp Edge' },
      { key: 'Maintenance', value: 'Easy to Sharpen' },
      { key: 'Warranty', value: '1 Year Manufacturing Defects' }
    ],
    features: [
      'Traditional forged steel construction',
      'Ergonomic wooden handle for comfort',
      'Perfect for crop harvesting',
      'Durable and long-lasting',
      'Easy to maintain and sharpen'
    ],
    tags: ['sickle', 'farming-tool', 'harvest', 'steel', 'traditional', 'agriculture'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Bamboo Water Buckets Set',
    description: 'Eco-friendly bamboo buckets for water storage and carrying. Lightweight, durable, and naturally antibacterial.',
    price: 450,
    comparePrice: 600,
    categoryName: 'Tools & Equipment',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Bamboo Water Buckets' }],
    sku: 'TE-BUC-BAM-001',
    stock: 40,
    brand: 'Eco Tools',
    variants: [
      { name: 'Set Size', options: ['2-Piece Set', '3-Piece Set', '5-Piece Set'] },
      { name: 'Capacity', options: ['5L', '10L', '15L'] }
    ],
    specifications: [
      { key: 'Material', value: '100% Natural Bamboo' },
      { key: 'Treatment', value: 'Natural Lacquer Finish' },
      { key: 'Weight', value: 'Lightweight (50% less than plastic)' },
      { key: 'Durability', value: 'Water Resistant' },
      { key: 'Properties', value: 'Naturally Antibacterial' },
      { key: 'Environmental Impact', value: 'Biodegradable' },
      { key: 'Care', value: 'Air Dry, Avoid Prolonged Soaking' }
    ],
    features: [
      'Eco-friendly alternative to plastic',
      'Naturally antibacterial properties',
      'Lightweight yet strong',
      'Traditional craftsmanship',
      'Perfect for rural water storage'
    ],
    tags: ['bamboo', 'bucket', 'eco-friendly', 'water-storage', 'natural', 'sustainable'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Hand-forged Iron Spade',
    description: 'Traditional hand-forged iron spade for digging and soil preparation. Built to last with superior strength and durability.',
    price: 800,
    comparePrice: 1000,
    categoryName: 'Tools & Equipment',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Hand-forged Iron Spade' }],
    sku: 'TE-SPA-IRO-001',
    stock: 30,
    brand: 'Blacksmith Tools',
    variants: [
      { name: 'Blade Size', options: ['Standard', 'Large', 'Extra Large'] },
      { name: 'Handle Length', options: ['Short (90cm)', 'Medium (110cm)', 'Long (130cm)'] }
    ],
    specifications: [
      { key: 'Blade Material', value: 'Hand-forged Iron' },
      { key: 'Handle Material', value: 'Seasoned Ash Wood' },
      { key: 'Forging Method', value: 'Traditional Blacksmithing' },
      { key: 'Blade Thickness', value: '3-4mm' },
      { key: 'Weight', value: '1.5-2kg depending on size' },
      { key: 'Durability', value: 'Lifetime with proper care' },
      { key: 'Maintenance', value: 'Oil blade to prevent rust' }
    ],
    features: [
      'Hand-forged by skilled blacksmiths',
      'Superior strength and durability',
      'Perfect for heavy-duty digging',
      'Traditional craftsmanship',
      'Built to last generations'
    ],
    tags: ['spade', 'hand-forged', 'iron', 'digging', 'blacksmith', 'durable'],
    isActive: true,
    isFeatured: true,
  },

  // ==================== MORE HANDICRAFTS & ARTISANS ====================
  {
    name: 'Carved Wooden Bowls Set',
    description: 'Beautiful hand-carved wooden bowls made from sustainable mango wood. Perfect for serving and decoration.',
    price: 600,
    comparePrice: 800,
    categoryName: 'Wood Crafts',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Carved Wooden Bowls' }],
    sku: 'WC-BOW-CAR-001',
    stock: 35,
    brand: 'Wood Artisans',
    variants: [
      { name: 'Set Size', options: ['3-Piece', '5-Piece', '7-Piece'] },
      { name: 'Size', options: ['Small', 'Medium', 'Large', 'Mixed'] }
    ],
    specifications: [
      { key: 'Material', value: 'Sustainable Mango Wood' },
      { key: 'Finish', value: 'Food-Safe Natural Oil' },
      { key: 'Craftsmanship', value: 'Hand-Carved by Artisans' },
      { key: 'Design', value: 'Traditional Patterns' },
      { key: 'Food Safety', value: 'Non-Toxic Finish' },
      { key: 'Care', value: 'Hand Wash, Oil Periodically' },
      { key: 'Durability', value: 'Long-Lasting with Care' }
    ],
    features: [
      'Hand-carved by skilled artisans',
      'Made from sustainable mango wood',
      'Food-safe natural finish',
      'Beautiful traditional designs',
      'Perfect for serving and decoration'
    ],
    tags: ['wooden-bowls', 'hand-carved', 'mango-wood', 'sustainable', 'artisan', 'serving'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Brass Traditional Lamps',
    description: 'Handcrafted brass oil lamps (diyas) for festivals and daily worship. Traditional designs with intricate patterns.',
    price: 400,
    comparePrice: 550,
    categoryName: 'Metal Crafts',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Brass Traditional Lamps' }],
    sku: 'MC-LAM-BRA-001',
    stock: 60,
    brand: 'Brass Works',
    variants: [
      { name: 'Set Size', options: ['Single', '3-Piece', '5-Piece', '7-Piece'] },
      { name: 'Design', options: ['Classic', 'Decorative', 'Temple Style'] }
    ],
    specifications: [
      { key: 'Material', value: 'Pure Brass' },
      { key: 'Craftsmanship', value: 'Hand-Beaten and Engraved' },
      { key: 'Finish', value: 'Polished Brass' },
      { key: 'Weight', value: 'Heavy Gauge Brass' },
      { key: 'Design', value: 'Traditional Indian Patterns' },
      { key: 'Usage', value: 'Oil/Ghee Lamps' },
      { key: 'Maintenance', value: 'Polish with Brass Cleaner' }
    ],
    features: [
      'Traditional handcrafted brass work',
      'Perfect for festivals and worship',
      'Intricate engraved patterns',
      'Durable pure brass construction',
      'Supports traditional craftsmen'
    ],
    tags: ['brass-lamps', 'traditional', 'handcrafted', 'festival', 'worship', 'diya'],
    isActive: true,
    isFeatured: true,
  },

  // ==================== ELECTRONICS & GADGETS ====================
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless Bluetooth headphones with noise cancellation and long battery life. Perfect for music lovers and professionals.',
    price: 2500,
    comparePrice: 3200,
    categoryName: 'Electronics',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wireless Bluetooth Headphones' }],
    sku: 'EL-HEA-BLU-001',
    stock: 50,
    brand: 'TechSound Pro',
    variants: [
      { name: 'Color', options: ['Black', 'White', 'Blue', 'Red'] },
      { name: 'Model', options: ['Standard', 'Pro', 'Elite'] }
    ],
    specifications: [
      { key: 'Connectivity', value: 'Bluetooth 5.0' },
      { key: 'Battery Life', value: '30 Hours Playback' },
      { key: 'Charging Time', value: '2 Hours Fast Charge' },
      { key: 'Noise Cancellation', value: 'Active ANC' },
      { key: 'Driver Size', value: '40mm Dynamic Drivers' },
      { key: 'Frequency Response', value: '20Hz - 20kHz' },
      { key: 'Weight', value: '250g Lightweight Design' }
    ],
    features: [
      'Active noise cancellation technology',
      'Touch controls for easy operation',
      'Fast charging with USB-C',
      'Foldable design for portability',
      'High-quality audio drivers'
    ],
    tags: ['headphones', 'wireless', 'bluetooth', 'noise-cancellation', 'audio', 'music'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking smartwatch with heart rate monitoring, GPS, and multiple sport modes. Track your health 24/7.',
    price: 3500,
    comparePrice: 4500,
    categoryName: 'Electronics',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Smart Fitness Watch' }],
    sku: 'EL-WAT-FIT-001',
    stock: 40,
    brand: 'FitTech Pro',
    variants: [
      { name: 'Color', options: ['Black', 'Silver', 'Rose Gold'] },
      { name: 'Band Size', options: ['Small', 'Medium', 'Large'] }
    ],
    specifications: [
      { key: 'Display', value: '1.4" AMOLED Touchscreen' },
      { key: 'Battery Life', value: '7 Days Normal Use' },
      { key: 'Water Resistance', value: '5ATM Waterproof' },
      { key: 'GPS', value: 'Built-in GPS + GLONASS' },
      { key: 'Sensors', value: 'Heart Rate, SpO2, Accelerometer' },
      { key: 'Connectivity', value: 'Bluetooth 5.0, WiFi' },
      { key: 'Compatibility', value: 'Android & iOS' }
    ],
    features: [
      '100+ workout modes tracking',
      '24/7 heart rate monitoring',
      'Sleep quality analysis',
      'Built-in GPS for outdoor activities',
      'Smart notifications and calls'
    ],
    tags: ['smartwatch', 'fitness', 'health', 'gps', 'heart-rate', 'waterproof'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Portable Power Bank 20000mAh',
    description: 'High-capacity portable power bank with fast charging technology. Multiple USB ports to charge multiple devices simultaneously.',
    price: 1500,
    comparePrice: 2000,
    categoryName: 'Electronics',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Portable Power Bank' }],
    sku: 'EL-POW-BAN-001',
    stock: 80,
    brand: 'PowerMax',
    variants: [
      { name: 'Capacity', options: ['10000mAh', '20000mAh', '30000mAh'] },
      { name: 'Color', options: ['Black', 'White', 'Blue'] }
    ],
    specifications: [
      { key: 'Capacity', value: '20000mAh Li-Polymer' },
      { key: 'Input', value: 'USB-C PD 18W' },
      { key: 'Output', value: '3 USB Ports + 1 USB-C' },
      { key: 'Fast Charging', value: 'QC 3.0 + PD Support' },
      { key: 'Display', value: 'LED Battery Indicator' },
      { key: 'Safety', value: 'Overcharge Protection' },
      { key: 'Weight', value: '450g Compact Design' }
    ],
    features: [
      'Charge 4 devices simultaneously',
      'Fast charging with PD and QC 3.0',
      'Digital display shows remaining power',
      'Multiple safety protections',
      'Compact and travel-friendly design'
    ],
    tags: ['power-bank', 'portable', 'fast-charging', 'multiple-ports', 'travel', 'battery'],
    isActive: true,
    isFeatured: false,
  },

  // ==================== FASHION & CLOTHING ====================
  {
    name: 'Cotton Casual T-Shirt',
    description: 'Premium 100% cotton casual t-shirt with comfortable fit. Perfect for daily wear with breathable fabric and modern design.',
    price: 799,
    comparePrice: 1200,
    categoryName: "Men's Traditional Wear",
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Cotton Casual T-Shirt' }],
    sku: 'CL-TSH-COT-001',
    stock: 100,
    brand: 'ComfortWear',
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      { name: 'Color', options: ['White', 'Black', 'Navy', 'Grey', 'Green'] }
    ],
    specifications: [
      { key: 'Material', value: '100% Premium Cotton' },
      { key: 'Fit', value: 'Regular Comfortable Fit' },
      { key: 'Sleeve', value: 'Short Sleeve' },
      { key: 'Neck', value: 'Round Neck' },
      { key: 'Care', value: 'Machine Wash Cold' },
      { key: 'Shrinkage', value: 'Pre-Shrunk Fabric' },
      { key: 'GSM', value: '180 GSM Premium Quality' }
    ],
    features: [
      'Soft and breathable cotton fabric',
      'Pre-shrunk for perfect fit',
      'Reinforced seams for durability',
      'Tagless for extra comfort',
      'Versatile for casual and semi-formal wear'
    ],
    tags: ['t-shirt', 'cotton', 'casual', 'comfortable', 'breathable', 'daily-wear'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Denim Jeans Classic Fit',
    description: 'Classic fit denim jeans made from premium denim fabric. Timeless style with modern comfort and durability.',
    price: 1899,
    comparePrice: 2500,
    categoryName: "Men's Traditional Wear",
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Denim Jeans Classic Fit' }],
    sku: 'CL-JEA-DEN-001',
    stock: 75,
    brand: 'DenimCraft',
    variants: [
      { name: 'Size', options: ['28', '30', '32', '34', '36', '38', '40'] },
      { name: 'Color', options: ['Dark Blue', 'Light Blue', 'Black', 'Grey'] },
      { name: 'Fit', options: ['Slim', 'Regular', 'Relaxed'] }
    ],
    specifications: [
      { key: 'Material', value: '98% Cotton, 2% Elastane' },
      { key: 'Weight', value: '12oz Premium Denim' },
      { key: 'Wash', value: 'Stone Washed' },
      { key: 'Closure', value: 'Button Fly' },
      { key: 'Pockets', value: '5-Pocket Classic Design' },
      { key: 'Care', value: 'Machine Wash Inside Out' },
      { key: 'Origin', value: 'Premium Indian Denim' }
    ],
    features: [
      'Premium denim with slight stretch',
      'Classic 5-pocket design',
      'Reinforced stress points',
      'Comfortable waistband',
      'Versatile for casual and smart-casual'
    ],
    tags: ['jeans', 'denim', 'classic-fit', 'casual', 'durable', 'versatile'],
    isActive: true,
    isFeatured: true,
  },

  // ==================== HOME & KITCHEN ====================
  {
    name: 'Stainless Steel Cookware Set',
    description: 'Complete 7-piece stainless steel cookware set with non-stick coating. Perfect for modern kitchens with induction compatibility.',
    price: 4500,
    comparePrice: 6000,
    categoryName: 'Home & Living',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Stainless Steel Cookware Set' }],
    sku: 'HK-COO-STE-001',
    stock: 30,
    brand: 'KitchenPro',
    variants: [
      { name: 'Set Size', options: ['5-Piece', '7-Piece', '10-Piece'] },
      { name: 'Coating', options: ['Non-Stick', 'Ceramic', 'Stainless'] }
    ],
    specifications: [
      { key: 'Material', value: 'Premium Stainless Steel 304' },
      { key: 'Coating', value: 'PFOA-Free Non-Stick' },
      { key: 'Base', value: 'Tri-Ply Induction Base' },
      { key: 'Handles', value: 'Heat-Resistant Bakelite' },
      { key: 'Compatibility', value: 'All Cooktops Including Induction' },
      { key: 'Dishwasher', value: 'Dishwasher Safe' },
      { key: 'Warranty', value: '2 Years Manufacturer Warranty' }
    ],
    features: [
      'Induction compatible tri-ply base',
      'Even heat distribution technology',
      'Ergonomic cool-touch handles',
      'Easy to clean non-stick surface',
      'Oven safe up to 180°C'
    ],
    tags: ['cookware', 'stainless-steel', 'non-stick', 'induction', 'kitchen', 'cooking'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Electric Rice Cooker 1.8L',
    description: 'Automatic electric rice cooker with keep-warm function. Perfect rice every time with easy one-touch operation.',
    price: 2200,
    comparePrice: 2800,
    categoryName: 'Home & Living',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Electric Rice Cooker' }],
    sku: 'HK-RIC-ELE-001',
    stock: 45,
    brand: 'CookEasy',
    variants: [
      { name: 'Capacity', options: ['1.0L', '1.8L', '2.8L'] },
      { name: 'Color', options: ['White', 'Black', 'Silver'] }
    ],
    specifications: [
      { key: 'Capacity', value: '1.8 Liters (3-4 Servings)' },
      { key: 'Power', value: '700W Energy Efficient' },
      { key: 'Material', value: 'Non-Stick Inner Pot' },
      { key: 'Functions', value: 'Cook & Keep Warm' },
      { key: 'Indicator', value: 'LED Status Lights' },
      { key: 'Safety', value: 'Auto Shut-Off' },
      { key: 'Accessories', value: 'Measuring Cup & Spoon' }
    ],
    features: [
      'One-touch automatic cooking',
      'Keep warm function up to 12 hours',
      'Non-stick inner pot for easy cleaning',
      'Cool-touch exterior housing',
      'Steam vent for perfect texture'
    ],
    tags: ['rice-cooker', 'electric', 'automatic', 'kitchen', 'appliance', 'cooking'],
    isActive: true,
    isFeatured: false,
  },

  // ==================== BOOKS & EDUCATION ====================
  {
    name: 'Complete Programming Guide',
    description: 'Comprehensive programming guide covering multiple languages. Perfect for beginners and advanced developers.',
    price: 899,
    comparePrice: 1200,
    categoryName: 'Books',
    vendorEmail: 'vendor1@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Complete Programming Guide' }],
    sku: 'BK-PRO-GUI-001',
    stock: 60,
    brand: 'TechBooks',
    variants: [
      { name: 'Format', options: ['Paperback', 'Hardcover', 'Digital'] },
      { name: 'Language', options: ['English', 'Hindi'] }
    ],
    specifications: [
      { key: 'Pages', value: '800+ Pages' },
      { key: 'Author', value: 'Tech Experts Team' },
      { key: 'Publisher', value: 'TechBooks Publications' },
      { key: 'Edition', value: '2024 Latest Edition' },
      { key: 'Languages Covered', value: 'Python, Java, JavaScript, C++' },
      { key: 'Level', value: 'Beginner to Advanced' },
      { key: 'Includes', value: 'Practice Exercises & Projects' }
    ],
    features: [
      'Covers 4 major programming languages',
      'Step-by-step tutorials with examples',
      'Real-world projects and exercises',
      'Latest industry practices',
      'Suitable for self-learning'
    ],
    tags: ['programming', 'coding', 'education', 'computer-science', 'learning', 'technology'],
    isActive: true,
    isFeatured: false,
  },

  // ==================== SPORTS & FITNESS ====================
  {
    name: 'Yoga Mat Premium Quality',
    description: 'Extra thick premium yoga mat with non-slip surface. Perfect for yoga, pilates, and general fitness exercises.',
    price: 1200,
    comparePrice: 1600,
    categoryName: 'Sports',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Yoga Mat Premium Quality' }],
    sku: 'SP-YOG-MAT-001',
    stock: 70,
    brand: 'FitLife',
    variants: [
      { name: 'Thickness', options: ['6mm', '8mm', '10mm'] },
      { name: 'Color', options: ['Purple', 'Blue', 'Green', 'Pink', 'Black'] },
      { name: 'Size', options: ['Standard (183x61cm)', 'Extra Long (198x61cm)'] }
    ],
    specifications: [
      { key: 'Material', value: 'High-Density NBR Foam' },
      { key: 'Thickness', value: '8mm Extra Cushioning' },
      { key: 'Surface', value: 'Non-Slip Textured' },
      { key: 'Size', value: '183cm x 61cm' },
      { key: 'Weight', value: '900g Lightweight' },
      { key: 'Eco-Friendly', value: 'Non-Toxic Materials' },
      { key: 'Includes', value: 'Carrying Strap' }
    ],
    features: [
      'Superior grip and stability',
      'Extra cushioning for joints',
      'Easy to clean and maintain',
      'Portable with carrying strap',
      'Odor-free and eco-friendly'
    ],
    tags: ['yoga-mat', 'fitness', 'exercise', 'non-slip', 'cushioned', 'portable'],
    isActive: true,
    isFeatured: true,
  },
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbell set with multiple weight options. Perfect for home gym and strength training.',
    price: 3500,
    comparePrice: 4500,
    categoryName: 'Sports',
    vendorEmail: 'vendor2@supermall.com',
    images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Adjustable Dumbbell Set' }],
    sku: 'SP-DUM-ADJ-001',
    stock: 25,
    brand: 'StrongFit',
    variants: [
      { name: 'Weight Range', options: ['5-25kg', '10-40kg', '15-50kg'] },
      { name: 'Material', options: ['Cast Iron', 'Chrome Plated'] }
    ],
    specifications: [
      { key: 'Weight Range', value: '5kg to 25kg per Dumbbell' },
      { key: 'Material', value: 'Cast Iron with Chrome Coating' },
      { key: 'Adjustment', value: 'Quick-Lock System' },
      { key: 'Handle', value: 'Ergonomic Rubber Grip' },
      { key: 'Space Saving', value: 'Replaces 15 Sets of Dumbbells' },
      { key: 'Safety', value: 'Secure Locking Mechanism' },
      { key: 'Warranty', value: '1 Year Warranty' }
    ],
    features: [
      'Quick weight adjustment in seconds',
      'Space-efficient design',
      'Comfortable rubber grip handles',
      'Durable cast iron construction',
      'Perfect for full-body workouts'
    ],
    tags: ['dumbbells', 'adjustable', 'strength-training', 'home-gym', 'fitness', 'weightlifting'],
    isActive: true,
    isFeatured: true,
  },
];

// Utility functions
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Seeding functions
async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  for (const userData of sampleUsers) {
    const existingUser = await UserModels.findOne({ email: userData.email });
    if (existingUser) {
      console.log(`   ⚠️  User ${userData.email} already exists, skipping...`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = new UserModels({
      ...userData,
      password: hashedPassword,
    });

    await user.save();
    console.log(`   ✅ Created user: ${userData.name} (${userData.email})`);
  }
}

async function seedCategories() {
  console.log('🌱 Seeding categories...');
  
  // Get admin user for createdBy field
  const adminUser = await UserModels.findOne({ email: 'admin@supermall.com' });
  if (!adminUser) {
    throw new Error('Admin user not found. Please seed users first.');
  }
  
  // Seed main categories first
  for (const categoryData of sampleCategories) {
    const existingCategory = await CategoryModel.findOne({ name: categoryData.name });
    if (existingCategory) {
      console.log(`   ⚠️  Category ${categoryData.name} already exists, skipping...`);
      continue;
    }

    const category = new CategoryModel({
      ...categoryData,
      slug: generateSlug(categoryData.name),
      createdBy: adminUser._id,
    });

    await category.save();
    console.log(`   ✅ Created main category: ${categoryData.name}`);
  }

  // Seed subcategories
  for (const subcategoryData of sampleSubcategories) {
    const existingSubcategory = await CategoryModel.findOne({ name: subcategoryData.name });
    if (existingSubcategory) {
      console.log(`   ⚠️  Subcategory ${subcategoryData.name} already exists, skipping...`);
      continue;
    }

    const parentCategory = await CategoryModel.findOne({ name: subcategoryData.parentCategoryName });
    if (!parentCategory) {
      console.log(`   ❌ Parent category ${subcategoryData.parentCategoryName} not found for ${subcategoryData.name}`);
      continue;
    }

    const { parentCategoryName, ...subcategoryFields } = subcategoryData;
    const subcategory = new CategoryModel({
      ...subcategoryFields,
      slug: generateSlug(subcategoryData.name),
      parentCategory: parentCategory._id,
      createdBy: adminUser._id,
    });

    await subcategory.save();
    console.log(`   ✅ Created subcategory: ${subcategoryData.name} under ${parentCategory.name}`);
  }

  // Seed sub-subcategories
  for (const subSubcategoryData of sampleSubSubcategories) {
    const existingSubSubcategory = await CategoryModel.findOne({ name: subSubcategoryData.name });
    if (existingSubSubcategory) {
      console.log(`   ⚠️  Sub-subcategory ${subSubcategoryData.name} already exists, skipping...`);
      continue;
    }

    const parentCategory = await CategoryModel.findOne({ name: subSubcategoryData.parentCategoryName });
    if (!parentCategory) {
      console.log(`   ❌ Parent category ${subSubcategoryData.parentCategoryName} not found for ${subSubcategoryData.name}`);
      continue;
    }

    const { parentCategoryName, ...subSubcategoryFields } = subSubcategoryData;
    const subSubcategory = new CategoryModel({
      ...subSubcategoryFields,
      slug: generateSlug(subSubcategoryData.name),
      parentCategory: parentCategory._id,
      createdBy: adminUser._id,
    });

    await subSubcategory.save();
    console.log(`   ✅ Created sub-subcategory: ${subSubcategoryData.name} under ${parentCategory.name}`);
  }
}

async function seedProducts() {
  console.log('🌱 Seeding products...');
  
  for (const productData of sampleProducts) {
    const existingProduct = await ProductModel.findOne({ name: productData.name });
    if (existingProduct) {
      console.log(`   ⚠️  Product ${productData.name} already exists, skipping...`);
      continue;
    }

    // Find category
    const category = await CategoryModel.findOne({ name: productData.categoryName });
    if (!category) {
      console.log(`   ❌ Category ${productData.categoryName} not found for product ${productData.name}`);
      continue;
    }

    // Find vendor
    const vendor = await UserModels.findOne({ email: productData.vendorEmail, role: 'vendor' });
    if (!vendor) {
      console.log(`   ❌ Vendor ${productData.vendorEmail} not found for product ${productData.name}`);
      continue;
    }

    const { categoryName, vendorEmail, isActive, isFeatured, comparePrice, ...productFields } = productData;
    const product = new ProductModel({
      ...productFields,
      category: category.name,
      vendor: vendor._id,
      status: isActive ? 'active' : 'inactive',
      featured: isFeatured || false,
      comparePrice: comparePrice,
      averageRating: 4.5, // Default rating
      totalReviews: Math.floor(Math.random() * 100) + 10, // Random review count
      totalSold: Math.floor(Math.random() * 500) + 50, // Random sold count
      slug: generateSlug(productData.name),
    });

    await product.save();
    console.log(`   ✅ Created product: ${productData.name} by ${vendor.name}`);
  }
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🚀 Starting database seeding...');
    console.log('📡 Connecting to database...');
    
    await connectToDataBase();
    console.log('✅ Connected to database successfully!');

    await seedUsers();
    await seedCategories();
    await seedProducts();

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   Users: ${await UserModels.countDocuments()}`);
    console.log(`   Categories: ${await CategoryModel.countDocuments()}`);
    console.log(`   Products: ${await ProductModel.countDocuments()}`);

  } catch (error: any) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process completed successfully!');
      process.exit(0);
    })
    .catch((error: any) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;