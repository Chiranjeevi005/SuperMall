import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env.local first, then fallback to .env
config({ path: path.resolve(__dirname, '../../.env.local') });
config({ path: path.resolve(__dirname, '../../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (err) {
    console.error('❌ Database connection error:', err);
    return false;
  }
};

// Check if database is already seeded
const isDatabaseSeeded = async () => {
  try {
    const categoriesCount = await mongoose.connection.db.collection('categories').countDocuments();
    const vendorsCount = await mongoose.connection.db.collection('vendors').countDocuments();
    const productsCount = await mongoose.connection.db.collection('products').countDocuments();
    
    console.log(`Current database counts - Categories: ${categoriesCount}, Vendors: ${vendorsCount}, Products: ${productsCount}`);
    
    // If we have data in all collections, consider it seeded
    return categoriesCount > 0 && vendorsCount > 0 && productsCount > 0;
  } catch (err) {
    console.error('Error checking database seeding status:', err);
    return false;
  }
};

// Categories data with slug field
const categoriesData = [
  {
    name: 'Fresh Produce',
    description: 'Fruits, vegetables, grains, and farm-fresh items',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919624/Fresh-Produce_pmhf74.jpg',
    slug: 'fresh-produce',
    isActive: true
  },
  {
    name: 'Handicrafts & Artisans',
    description: 'Locally crafted products, handmade goods, traditional art',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919625/Handicrafts-_-Artisans_wbxyaf.jpg',
    slug: 'handicrafts-artisans',
    isActive: true
  },
  {
    name: 'Clothing & Apparel',
    description: 'Ethnic wear, casuals, and rural fashion collections',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919623/Clothing-_-Apparel_gbab2k.jpg',
    slug: 'clothing-apparel',
    isActive: true
  },
  {
    name: 'Home & Living',
    description: 'Furniture, kitchenware, décor, everyday essentials',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919624/Home-_-Living_yd0zdn.jpg',
    slug: 'home-living',
    isActive: true
  },
  {
    name: 'Dairy & Poultry',
    description: 'Milk, cheese, eggs, and related fresh products',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919624/Dairy-_-Poultry_mtp6c2.jpg',
    slug: 'dairy-poultry',
    isActive: true
  },
  {
    name: 'Spices & Condiments',
    description: 'Locally sourced spices, herbs, pickles, and traditional flavors',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919625/Spices-_-Condiments_pxvyjr.jpg',
    slug: 'spices-condiments',
    isActive: true
  },
  {
    name: 'Food & Beverages',
    description: 'Packaged foods, snacks, traditional delicacies, drinks',
    icon: 'M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919623/Food-_-Beverages_negd83.jpg',
    slug: 'food-beverages',
    isActive: true
  },
  {
    name: 'Tools & Equipment',
    description: 'Farming tools, household utilities, and small-scale machinery',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    image: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756919625/Tools-_-Equipment_am0qav.jpg',
    slug: 'tools-equipment',
    isActive: true
  }
];

// Vendor data
const vendorsData = [
  {
    shopName: 'Sahara Fresh Farms',
    ownerName: 'Rajesh Kumar',
    category: 'Fresh Produce',
    floor: 1,
    section: 'A',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905472/Sahara_Fresh_farms_p4frvk.jpg',
    rating: 4.8,
    description: 'Farm-fresh vegetables and fruits sourced directly from local farms in Rajasthan',
    contact: {
      phone: '+91 98765 43210',
      email: 'info@saharafreshfarms.com',
      address: 'Plot 123, Farm Road, Jaipur, Rajasthan'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Heritage Handicrafts',
    ownerName: 'Priya Sharma',
    category: 'Handicrafts & Artisans',
    floor: 2,
    section: 'B',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905471/Heritage_Handicrafts_b8do8j.jpg',
    rating: 4.6,
    description: 'Authentic handmade crafts and traditional artifacts from skilled artisans across India',
    contact: {
      phone: '+91 98765 43211',
      email: 'contact@heritagehandicrafts.in',
      address: 'Artisan Street, Jaipur, Rajasthan'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Village Threads',
    ownerName: 'Meena Devi',
    category: 'Clothing & Apparel',
    floor: 1,
    section: 'C',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905473/Village_Threads_qnd89z.jpg',
    rating: 4.7,
    description: 'Traditional ethnic wear and handwoven textiles from rural communities',
    contact: {
      phone: '+91 98765 43212',
      email: 'orders@villagethreads.com',
      address: 'Textile Market, Varanasi, Uttar Pradesh'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Rustic Living',
    ownerName: 'Amit Patel',
    category: 'Home & Living',
    floor: 3,
    section: 'D',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905473/Rustic_Living_tfiexr.jpg',
    rating: 4.5,
    description: 'Handcrafted furniture and home décor items made from sustainable materials',
    contact: {
      phone: '+91 98765 43213',
      email: 'support@rusticliving.in',
      address: 'Crafts Village, Ahmedabad, Gujarat'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Dairy Delight',
    ownerName: 'Sunita Reddy',
    category: 'Dairy & Poultry',
    floor: 1,
    section: 'E',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905471/Dairy_Delight_salnlt.jpg',
    rating: 4.9,
    description: 'Fresh dairy products and free-range poultry from local farms',
    contact: {
      phone: '+91 98765 43214',
      email: 'fresh@dairydelight.in',
      address: 'Farm Road, Pune, Maharashtra'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Spice Bazaar',
    ownerName: 'Kiran Singh',
    category: 'Spices & Condiments',
    floor: 2,
    section: 'F',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905473/Spice_Bazaar_ntq80r.jpg',
    rating: 4.8,
    description: 'Premium quality spices, herbs, and traditional condiments sourced from local farms',
    contact: {
      phone: '+91 98765 43215',
      email: 'spices@spicebazaar.com',
      address: 'Spice Market, Kochi, Kerala'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Organic Pantry',
    ownerName: 'Anil Gupta',
    category: 'Food & Beverages',
    floor: 1,
    section: 'G',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905471/Organic_Pantry_x5pey8.jpg',
    rating: 4.6,
    description: 'Organic packaged foods, snacks, and traditional delicacies',
    contact: {
      phone: '+91 98765 43216',
      email: 'hello@organicpantry.in',
      address: 'Organic Street, Mysore, Karnataka'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Farmers Tools',
    ownerName: 'Vikram Mehta',
    category: 'Tools & Equipment',
    floor: 3,
    section: 'H',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905471/Farmer_Tools_qmmh9l.jpg',
    rating: 4.4,
    description: 'Quality farming tools and household utilities for rural communities',
    contact: {
      phone: '+91 98765 43217',
      email: 'support@farmerstools.in',
      address: 'Tool Market, Ludhiana, Punjab'
    },
    isActive: true,
    isApproved: true
  },
  {
    shopName: 'Nature\'s Basket',
    ownerName: 'Deepa Nair',
    category: 'Fresh Produce',
    floor: 1,
    section: 'I',
    logoURL: 'https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756905471/Nature_s_Basket_fpn9av.jpg',
    rating: 4.7,
    description: 'Organic fruits and vegetables grown using sustainable farming practices',
    contact: {
      phone: '+91 98765 43218',
      email: 'fresh@naturesbasket.org',
      address: 'Organic Farm, Coorg, Karnataka'
    },
    isActive: true,
    isApproved: true
  }
];

// Detailed products data for each category
const productsData = {
  'Fresh Produce': [
    {
      name: 'Organic Tomatoes',
      description: 'Fresh, vine-ripened organic tomatoes from local farms. Grown without pesticides and harvested at peak ripeness for maximum flavor and nutrition.',
      price: 45.00,
      stock: 100,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954589/Tomato_jhs4ox.jpg'],
      features: [
        { name: 'Origin', value: 'Local Farm' },
        { name: 'Organic', value: 'Yes' },
        { name: 'Weight', value: '1 kg' },
        { name: 'Shelf Life', value: '5-7 days' }
      ]
    },
    {
      name: 'Farm Fresh Potatoes',
      description: 'Russet potatoes harvested this morning from our fields. Perfect for boiling, baking, or frying with a crispy exterior and fluffy interior.',
      price: 30.00,
      stock: 150,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954589/Potato_trkesi.jpg'],
      features: [
        { name: 'Origin', value: 'Local Farm' },
        { name: 'Variety', value: 'Russet' },
        { name: 'Weight', value: '1 kg' },
        { name: 'Shelf Life', value: '2-3 weeks' }
      ]
    },
    {
      name: 'Alphonso Mangoes',
      description: 'Premium Alphonso mangoes, sweet and juicy. Known as the "King of Mangoes" with a rich, creamy texture and distinctive sweet flavor.',
      price: 150.00,
      stock: 80,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954589/Mango_mtw6gu.jpg'],
      features: [
        { name: 'Origin', value: 'Local Orchard' },
        { name: 'Variety', value: 'Alphonso' },
        { name: 'Weight', value: '1 kg (4-6 pieces)' },
        { name: 'Season', value: 'Summer' }
      ]
    },
    {
      name: 'Basmati Rice',
      description: 'Premium aged basmati rice, aromatic and fluffy. Long-grained rice with a distinctive nut-like fragrance and delicate flavor.',
      price: 120.00,
      stock: 60,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954589/Basmati_qeosvx.jpg'],
      features: [
        { name: 'Origin', value: 'Local Mill' },
        { name: 'Grade', value: 'Premium' },
        { name: 'Weight', value: '1 kg' },
        { name: 'Processing', value: 'Steam Aged' }
      ]
    },
    {
      name: 'Whole Wheat Flour',
      description: 'Stone-ground whole wheat flour, freshly milled. Retains all the nutrients of the wheat grain including fiber, vitamins, and minerals.',
      price: 55.00,
      stock: 120,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954590/Wheat_Flour_shak3x.jpg'],
      features: [
        { name: 'Origin', value: 'Local Mill' },
        { name: 'Processing', value: 'Stone Ground' },
        { name: 'Weight', value: '1 kg' },
        { name: 'Protein Content', value: '12-14%' }
      ]
    }
  ],
  'Handicrafts & Artisans': [
    {
      name: 'Hand-Carved Wooden Bowl',
      description: 'Beautiful hand-carved wooden bowl made from sustainable teak wood. Each piece is unique and showcases the natural grain of the wood.',
      price: 350.00,
      stock: 25,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953120/Wooden_Bowl_vgre4x.jpg'],
      features: [
        { name: 'Material', value: 'Teak Wood' },
        { name: 'Artisan', value: 'Local Craftsman' },
        { name: 'Dimensions', value: '8" Diameter' },
        { name: 'Finish', value: 'Natural Oil' }
      ]
    },
    {
      name: 'Terracotta Flower Pot',
      description: 'Handcrafted terracotta flower pot with traditional designs. Perfect for indoor or outdoor plants with excellent drainage properties.',
      price: 180.00,
      stock: 40,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953120/Terracotta_Flower_Pot_sq0mtw.jpg'],
      features: [
        { name: 'Material', value: 'Terracotta' },
        { name: 'Design', value: 'Traditional' },
        { name: 'Dimensions', value: '6" Height' },
        { name: 'Drainage', value: 'Yes' }
      ]
    },
    {
      name: 'Handwoven Jute Basket',
      description: 'Stylish handwoven basket made from natural jute fibers. Eco-friendly and durable with a beautiful natural texture.',
      price: 280.00,
      stock: 30,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953119/Jute_Bag_hpweve.jpg'],
      features: [
        { name: 'Material', value: 'Jute' },
        { name: 'Artisan', value: 'Local Weaver' },
        { name: 'Dimensions', value: '12" x 10" x 8"' },
        { name: 'Handles', value: 'Yes' }
      ]
    },
    {
      name: 'Silver Jewellery Set',
      description: 'Elegant terracotta earrings and necklace set with intricate designs. Lightweight and hypoallergenic with a unique earthy appeal.',
      price: 4500.00,
      stock: 20,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953120/Silver_Jewellery_et1bgi.jpg'],
      features: [
        { name: 'Material', value: 'Terracotta' },
        { name: 'Design', value: 'Intricate' },
        { name: 'Set Includes', value: 'Earrings + Necklace' },
        { name: 'Closure', value: 'Hook & Clasp' }
      ]
    },
    {
      name: 'Jute Tote Bag',
      description: 'Eco-friendly jute tote bag with traditional embroidery. Perfect for shopping or daily use with a spacious interior and sturdy handles.',
      price: 220.00,
      stock: 50,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953120/Tote_Bag_y8qwlq.jpg'],
      features: [
        { name: 'Material', value: 'Jute' },
        { name: 'Design', value: 'Embroidered' },
        { name: 'Dimensions', value: '15" x 13" x 5"' },
        { name: 'Handles', value: 'Long (10")' }
      ]
    }
  ],
  'Clothing & Apparel': [
    {
      name: 'Traditional Silk Saree',
      description: 'Beautiful handwoven cotton saree with traditional patterns. Lightweight and comfortable for daily wear with a contrasting border.',
      price: 750.00,
      stock: 15,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953899/Handloom-Silk-Saree_ht0ync.jpg'],
      features: [
        { name: 'Material', value: 'Cotton' },
        { name: 'Origin', value: 'Local Weavers' },
        { name: 'Length', value: '5.5 meters' },
        { name: 'Blouse', value: 'Included' }
      ]
    },
    {
      name: 'Kurta Set',
      description: 'Comfortable cotton kurta set with traditional embroidery. Perfect for casual or festive occasions with matching pants and dupatta.',
      price: 650.00,
      stock: 25,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953899/Men_s_Kurta_Set_cp1mbo.jpg'],
      features: [
        { name: 'Material', value: 'Cotton' },
        { name: 'Design', value: 'Embroidered' },
        { name: 'Set Includes', value: 'Kurta + Pants + Dupatta' },
        { name: 'Size', value: 'M, L, XL, XXL' }
      ]
    },
    {
      name: 'Handloom Shirt',
      description: 'Premium handloom cotton shirt with traditional weaving. Breathable and comfortable with a distinctive texture and natural drape.',
      price: 450.00,
      stock: 30,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953898/Handloom_Shirt_qxbtfg.jpg'],
      features: [
        { name: 'Material', value: 'Handloom Cotton' },
        { name: 'Origin', value: 'Local Weavers' },
        { name: 'Sleeve Type', value: 'Full Sleeve' },
        { name: 'Fit', value: 'Regular' }
      ]
    },
    {
      name: 'Cotton Dress',
      description: 'Lightweight cotton dress perfect for daily wear. Features a flattering A-line silhouette with comfortable fit and easy care.',
      price: 550.00,
      stock: 20,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953898/Cotton_Cloth_ygacpi.jpg'],
      features: [
        { name: 'Material', value: 'Cotton' },
        { name: 'Style', value: 'Casual' },
        { name: 'Length', value: 'Knee Length' },
        { name: 'Sleeve Type', value: '3/4 Sleeve' }
      ]
    },
    {
      name: 'Woolen Shawl',
      description: 'Warm woolen shawl handwoven by local artisans. Perfect for chilly evenings with a soft texture and beautiful traditional patterns.',
      price: 680.00,
      stock: 18,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756953899/Woolen_Shawl_ybgjri.jpg'],
      features: [
        { name: 'Material', value: 'Wool' },
        { name: 'Origin', value: 'Local Artisans' },
        { name: 'Dimensions', value: '70" x 30"' },
        { name: 'Pattern', value: 'Traditional' }
      ]
    }
  ],
  'Home & Living': [
    {
      name: 'Bamboo Chair',
      description: 'Sturdy bamboo chair with natural finish. Eco-friendly and durable with a comfortable seat and backrest for extended use.',
      price: 1200.00,
      stock: 12,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954795/Bamboo_Chair_fi6ikt.jpg'],
      features: [
        { name: 'Material', value: 'Bamboo' },
        { name: 'Finish', value: 'Natural' },
        { name: 'Weight Capacity', value: '120 kg' },
        { name: 'Assembly', value: 'Ready to Use' }
      ]
    },
    {
      name: 'Wooden Stool',
      description: 'Handcrafted wooden stool with traditional design. Perfect for kitchen islands or as additional seating with a compact footprint.',
      price: 750.00,
      stock: 20,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954796/Wooden_Stool_oghjer.jpg'],
      features: [
        { name: 'Material', value: 'Teak Wood' },
        { name: 'Design', value: 'Traditional' },
        { name: 'Height', value: '18 inches' },
        { name: 'Weight', value: '5 kg' }
      ]
    },
    {
      name: 'Brass Utensil Set',
      description: 'Traditional brass utensil set for cooking. Includes essential kitchen items made from pure brass for even heat distribution.',
      price: 1800.00,
      stock: 8,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954795/Brass_Utensils_aps7dn.jpg'],
      features: [
        { name: 'Material', value: 'Brass' },
        { name: 'Set', value: '5-piece' },
        { name: 'Pieces', value: 'Pan, Lid, Spoon, Ladle, Bowl' },
        { name: 'Care', value: 'Hand Wash' }
      ]
    },
    {
      name: 'Clay Cooking Pot',
      description: 'Traditional clay cooking pot for authentic flavors. Enhances the taste of food while retaining nutrients and adding a rustic charm.',
      price: 350.00,
      stock: 25,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954796/Clay_Pot_aaroao.jpg'],
      features: [
        { name: 'Material', value: 'Clay' },
        { name: 'Size', value: 'Medium (2 liters)' },
        { name: 'Lid', value: 'Yes' },
        { name: 'Cooking Type', value: 'Slow Cooking' }
      ]
    },
    {
      name: 'Handcrafted Lamp',
      description: 'Beautiful handcrafted lamp with traditional design. Creates a warm ambiance with its soft glow and adds a cultural touch to any space.',
      price: 580.00,
      stock: 15,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954796/Lamp_daeeg7.jpg'],
      features: [
        { name: 'Material', value: 'Wood & Clay' },
        { name: 'Lighting', value: 'LED Compatible' },
        { name: 'Bulb Type', value: 'E27 (Max 40W)' },
        { name: 'Height', value: '12 inches' }
      ]
    }
  ],
  'Dairy & Poultry': [
    {
      name: 'Farm Fresh Milk',
      description: 'Pure cow milk from grass-fed cows. Rich in nutrients and free from preservatives, delivered fresh from our farm to your doorstep.',
      price: 60.00,
      stock: 200,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954850/Farm_Milk_ocfuly.jpg'],
      features: [
        { name: 'Source', value: 'Grass-fed Cows' },
        { name: 'Fat Content', value: '3.5%' },
        { name: 'Volume', value: '1 liter' },
        { name: 'Shelf Life', value: '2 days' }
      ]
    },
    {
      name: 'Farmhouse Paneer',
      description: 'Fresh paneer made from pure cow milk. Soft, spongy texture perfect for Indian curries and snacks with no added preservatives.',
      price: 90.00,
      stock: 80,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954851/Paneer_agqico.jpg'],
      features: [
        { name: 'Source', value: 'Cow Milk' },
        { name: 'Freshness', value: 'Same Day' },
        { name: 'Weight', value: '200 grams' },
        { name: 'Shelf Life', value: '1 day' }
      ]
    },
    {
      name: 'Desi Ghee',
      description: 'Pure desi ghee made from cow milk. Rich, aromatic, and packed with health benefits, prepared using traditional methods.',
      price: 180.00,
      stock: 60,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954851/Pure_Ghee_hnehhq.jpg'],
      features: [
        { name: 'Source', value: 'Cow Milk' },
        { name: 'Processing', value: 'Traditional' },
        { name: 'Weight', value: '500 grams' },
        { name: 'Shelf Life', value: '6 months' }
      ]
    },
    {
      name: 'Farm Fresh Eggs',
      description: 'Free-range eggs from happy hens. Nutritious and delicious with rich orange yolks, produced by hens raised in natural conditions.',
      price: 75.00,
      stock: 150,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954850/Farm_Eggs_hdl6ds.jpg'],
      features: [
        { name: 'Source', value: 'Free-range Hens' },
        { name: 'Size', value: 'Large' },
        { name: 'Quantity', value: '12 pieces' },
        { name: 'Shelf Life', value: '7 days' }
      ]
    },
    {
      name: 'Homemade Yogurt',
      description: 'Creamy homemade yogurt from pure cow milk. Thick, tangy, and probiotic-rich, perfect for breakfast or as a healthy snack.',
      price: 55.00,
      stock: 100,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756954852/Yogurt_efdset.jpg'],
      features: [
        { name: 'Source', value: 'Cow Milk' },
        { name: 'Fat Content', value: '2%' },
        { name: 'Weight', value: '500 grams' },
        { name: 'Shelf Life', value: '5 days' }
      ]
    }
  ],
  'Spices & Condiments': [
    {
      name: 'Organic Turmeric',
      description: 'Premium organic turmeric powder with high curcumin content. Anti-inflammatory and antioxidant properties with a rich golden color.',
      price: 80.00,
      stock: 200,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955013/Turnemic_Powder_hamhyk.jpg'],
      features: [
        { name: 'Origin', value: 'Local Farm' },
        { name: 'Organic', value: 'Yes' },
        { name: 'Weight', value: '100 grams' },
        { name: 'Curcumin', value: '3-5%' }
      ]
    },
    {
      name: 'Red Chili Powder',
      description: 'Hot and aromatic red chili powder from local farms. Adds heat and vibrant color to dishes with a distinctive smoky flavor.',
      price: 70.00,
      stock: 150,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955012/Red_Chilli_Powder_gn2mza.jpg'],
      features: [
        { name: 'Origin', value: 'Local Farm' },
        { name: 'Heat Level', value: 'Hot' },
        { name: 'Weight', value: '100 grams' },
        { name: 'Processing', value: 'Sun Dried' }
      ]
    },
    {
      name: 'Mixed Pickles',
      description: 'Assorted pickles with traditional spices and flavors. A perfect blend of sweet, sour, and spicy with authentic homemade taste.',
      price: 120.00,
      stock: 80,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955011/Homemade_Pickles_kvxzcu.jpg'],
      features: [
        { name: 'Variety', value: 'Mixed' },
        { name: 'Spice Level', value: 'Medium' },
        { name: 'Weight', value: '500 grams' },
        { name: 'Ingredients', value: 'Mango, Lime, Mixed Vegetables' }
      ]
    },
    {
      name: 'Coriander Seeds',
      description: 'Freshly harvested coriander seeds with rich aroma. Essential for Indian cooking with a citrusy, slightly sweet flavor profile.',
      price: 50.00,
      stock: 250,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955010/Corrider_Seeds_ztivvs.jpg'],
      features: [
        { name: 'Origin', value: 'Local Farm' },
        { name: 'Processing', value: 'Whole Seeds' },
        { name: 'Weight', value: '100 grams' },
        { name: 'Roasted', value: 'No' }
      ]
    },
    {
      name: 'Cumin Seeds',
      description: 'Premium cumin seeds with strong earthy flavor. Widely used in Indian cuisine for their distinctive warm, nutty taste and aroma.',
      price: 60.00,
      stock: 200,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955011/Cummins_Seeds_iuqc6f.jpg'],
      features: [
        { name: 'Origin', value: 'Local Farm' },
        { name: 'Processing', value: 'Whole Seeds' },
        { name: 'Weight', value: '100 grams' },
        { name: 'Roasted', value: 'No' }
      ]
    }
  ],
  'Food & Beverages': [
    {
      name: 'Organic Jaggery',
      description: 'Pure organic jaggery made from sugarcane juice. Unrefined sweetener rich in minerals with a distinctive caramel-like flavor.',
      price: 95.00,
      stock: 100,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955068/Jaggery_Blocks_yakpys.jpg'],
      features: [
        { name: 'Source', value: 'Organic Sugarcane' },
        { name: 'Processing', value: 'Traditional' },
        { name: 'Weight', value: '500 grams' },
        { name: 'Shelf Life', value: '6 months' }
      ]
    },
    {
      name: 'Spicy Namkeen',
      description: 'Crunchy and spicy snack mix with traditional spices. Perfect for tea time with a perfect balance of flavors and textures.',
      price: 85.00,
      stock: 120,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955071/Traditional_Namkeen_qjxxnd.jpg'],
      features: [
        { name: 'Flavor', value: 'Spicy' },
        { name: 'Ingredients', value: 'Mixed' },
        { name: 'Weight', value: '200 grams' },
        { name: 'Shelf Life', value: '3 months' }
      ]
    },
    {
      name: 'Millet Biscuits',
      description: 'Healthy millet biscuits with no added sugar. Nutritious and delicious with the goodness of various millets and natural sweeteners.',
      price: 70.00,
      stock: 150,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955068/Millets_Biscuits_lxf984.jpg'],
      features: [
        { name: 'Main Ingredient', value: 'Millet' },
        { name: 'Sugar', value: 'None' },
        { name: 'Weight', value: '200 grams' },
        { name: 'Flavors', value: 'Original, Chocolate' }
      ]
    },
    {
      name: 'Herbal Tea',
      description: 'Refreshing herbal tea blend with natural ingredients. Caffeine-free with a soothing aroma and health benefits from natural herbs.',
      price: 110.00,
      stock: 80,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955067/Herbal_Tea_wzd2rq.jpg'],
      features: [
        { name: 'Blend', value: 'Herbal' },
        { name: 'Flavor', value: 'Refreshing' },
        { name: 'Weight', value: '100 grams' },
        { name: 'Ingredients', value: 'Green Tea, Mint, Lemongrass' }
      ]
    },
    {
      name: 'Fresh Fruit Juice',
      description: 'Freshly squeezed fruit juice with no preservatives. Made from seasonal fruits with natural sweetness and rich in vitamins.',
      price: 55.00,
      stock: 200,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955067/Mango_Juice_qbp99w.jpg'],
      features: [
        { name: 'Flavor', value: 'Mixed Fruit' },
        { name: 'Preservatives', value: 'None' },
        { name: 'Volume', value: '1 liter' },
        { name: 'Shelf Life', value: 'Same Day' }
      ]
    }
  ],
  'Tools & Equipment': [
    {
      name: 'Farmers Sickle',
      description: 'Sharp and durable sickle for harvesting crops. Ergonomic design with a curved blade for efficient cutting and comfortable grip.',
      price: 190.00,
      stock: 50,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955131/Sickel_o9rvhm.jpg'],
      features: [
        { name: 'Material', value: 'High Carbon Steel' },
        { name: 'Handle', value: 'Wooden' },
        { name: 'Blade Length', value: '8 inches' },
        { name: 'Weight', value: '300 grams' }
      ]
    },
    {
      name: 'Hand Plow',
      description: 'Traditional hand plow for small-scale farming. Ideal for breaking soil and preparing seedbeds in small gardens and farms.',
      price: 750.00,
      stock: 20,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955133/Hand_Plow_evevlf.jpg'],
      features: [
        { name: 'Material', value: 'Iron' },
        { name: 'Size', value: 'Medium' },
        { name: 'Weight', value: '2.5 kg' },
        { name: 'Usage', value: 'Soil Breaking' }
      ]
    },
    {
      name: 'Water Pump',
      description: 'Efficient water pump for irrigation and household use. Reliable performance with low maintenance and energy-efficient operation.',
      price: 2900.00,
      stock: 10,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955132/Water_Pump_Machine_v1anpg.jpg'],
      features: [
        { name: 'Type', value: 'Submersible' },
        { name: 'Power', value: '1 HP' },
        { name: 'Head', value: '30 meters' },
        { name: 'Flow Rate', value: '1000 LPH' }
      ]
    },
    {
      name: 'Storage Containers',
      description: 'Set of 3 airtight storage containers for grains. Keeps food fresh longer with secure lids and easy-to-clean surfaces.',
      price: 450.00,
      stock: 40,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1756955131/Kitchen-Storage-Jars_yv82ot.jpg'],
      features: [
        { name: 'Material', value: 'Plastic' },
        { name: 'Set', value: '3-piece' },
        { name: 'Capacity', value: '1L, 2L, 3L' },
        { name: 'Lids', value: 'Airtight' }
      ]
    },
    {
      name: 'Weighing Machine',
      description: 'Digital weighing machine for accurate measurements. Precise readings with an easy-to-read display and durable construction.',
      price: 520.00,
      stock: 25,
      images: ['https://res.cloudinary.com/ds2qnwvrk/image/upload/v1757001211/Weighing_Scale_zmvx5y.jpg'],
      features: [
        { name: 'Type', value: 'Digital' },
        { name: 'Capacity', value: '5 kg' },
        { name: 'Accuracy', value: '1 gram' },
        { name: 'Display', value: 'LCD' }
      ]
    }
  ]
};

// Function to seed all data
const seedAllData = async () => {
  try {
    console.log('Starting database seeding process...');
    
    // Connect to database
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }
    
    // Check if database is already seeded
    const alreadySeeded = await isDatabaseSeeded();
    if (alreadySeeded && process.env.NODE_ENV === 'production') {
      console.log('Database already seeded. Skipping...');
      await mongoose.connection.close();
      process.exit(0);
    }
    
    // Define schemas directly in the script to avoid import issues
    const categorySchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
      },
      image: {
        type: String,
      },
      slug: {
        type: String,
        unique: true,
        trim: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    }, {
      timestamps: true,
    });
    
    // Add index for slug field
    categorySchema.index({ slug: 1 });
    
    const vendorSchema = new mongoose.Schema({
      shopName: {
        type: String,
        required: true,
        trim: true,
      },
      ownerName: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        ref: 'Category',
      },
      floor: {
        type: Number,
        required: true,
      },
      section: {
        type: String,
      },
      logoURL: {
        type: String,
        default: '',
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0,
      },
      description: {
        type: String,
        required: true,
      },
      contact: {
        phone: String,
        email: String,
        address: String,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      isSuspended: {
        type: Boolean,
        default: false,
      },
    }, {
      timestamps: true,
    });
    
    const productSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      images: [{
        type: String,
      }],
      stock: {
        type: Number,
        required: true,
        min: 0,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
      features: [{
        name: String,
        value: String,
      }],
      offers: [{
        title: String,
        description: String,
        discountType: {
          type: String,
          enum: ['percentage', 'fixed']
        },
        discountValue: Number,
        startDate: Date,
        endDate: Date,
      }],
    }, {
      timestamps: true,
    });
    
    // Use existing models or create new ones
    const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
    const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', vendorSchema);
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
    
    // Clear existing data only in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Clearing existing data...');
      await Category.deleteMany({});
      await Product.deleteMany({});
      await Vendor.deleteMany({});
      console.log('Cleared existing data');
    }
    
    // Drop indexes to avoid duplicate key errors
    try {
      await Category.collection.dropIndexes();
      await Product.collection.dropIndexes();
      console.log('Dropped indexes');
    } catch (err) {
      console.log('No indexes to drop or error dropping indexes:', err.message);
    }
    
    // Create categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`Created ${categories.length} categories`);
    
    // Create vendors
    const vendors = await Vendor.insertMany(vendorsData);
    console.log(`Created ${vendors.length} vendors`);
    
    // Create products for each category
    let totalProducts = 0;
    for (const category of categories) {
      const categoryProducts = productsData[category.name];
      if (categoryProducts) {
        // Find a vendor for this category
        const vendor = vendors.find(v => v.category === category.name) || vendors[0];
        
        for (const productData of categoryProducts) {
          try {
            const product = new Product({
              ...productData,
              shop: vendor._id,
              category: category.name,
              isApproved: true
            });
            await product.save();
            totalProducts++;
            console.log(`Created product: ${product.name} in category: ${category.name}`);
          } catch (err) {
            console.error(`Error creating product ${productData.name}:`, err.message);
          }
        }
      }
    }
    
    console.log(`Created ${totalProducts} products across ${categories.length} categories`);
    console.log('Seeding completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAllData();