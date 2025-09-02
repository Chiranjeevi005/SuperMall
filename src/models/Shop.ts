import mongoose, { Schema, Document } from 'mongoose';

export interface IShop extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId; // Reference to User
  location: {
    floor: number;
    section: string;
    coordinates?: {
      x: number;
      y: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  categories: string[]; // Categories of products sold
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema: Schema = new Schema(
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      floor: {
        type: Number,
        required: true,
      },
      section: {
        type: String,
        required: true,
      },
      coordinates: {
        x: Number,
        y: Number,
      },
    },
    contact: {
      phone: String,
      email: String,
      address: String,
    },
    categories: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);