import mongoose from "mongoose";

const { Schema } = mongoose;

// Review Schema
const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Product Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ""
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  weight: {
    type: Number, // in grams
    min: 0
  },
  dimensions: {
    length: Number, // in cm
    width: Number,  // in cm
    height: Number  // in cm
  },
  tags: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  specifications: [{
    key: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    options: [{
      type: String,
      required: true,
      trim: true
    }]
  }],
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["active", "inactive", "draft", "out_of_stock"],
    default: "active"
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  },
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalSold: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isDigital: {
    type: Boolean,
    default: false
  },
  downloadableFiles: [{
    name: String,
    url: String,
    size: Number // in bytes
  }]
}, {
  timestamps: true
});

// Create slug from name
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

// Update average rating when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.totalReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
};

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ vendor: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ trending: 1 });
productSchema.index({ newArrival: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

export const ProductModel = 
  mongoose.models.Product || mongoose.model("Product", productSchema);