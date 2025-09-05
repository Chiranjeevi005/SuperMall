import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  shopName: string;
  ownerName: string;
  category: string; // linked to predefined categories
  floor: number;
  section?: string;
  logoURL: string;
  rating: number; // 1-5
  description: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  isActive: boolean;
  isApproved: boolean; // Add this field
  isSuspended: boolean; // Add this field
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
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
    isApproved: { // Add this field
      type: Boolean,
      default: false,
    },
    isSuspended: { // Add this field
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);