import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  shop: mongoose.Types.ObjectId; // Reference to Vendor
  category: string;
  images: string[]; // URLs to product images
  stock: number;
  isActive: boolean;
  isApproved: boolean; // Add this field
  features: {
    name: string;
    value: string;
  }[];
  // Add offers field to support discounts
  offers?: {
    title: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    startDate: Date;
    endDate: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'Vendor', // Changed from 'Shop' to 'Vendor'
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
    isApproved: { // Add this field
      type: Boolean,
      default: false,
    },
    features: [{
      name: String,
      value: String,
    }],
    // Add offers field to support discounts
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);