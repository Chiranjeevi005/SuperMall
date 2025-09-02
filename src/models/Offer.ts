import mongoose, { Schema, Document } from 'mongoose';

export interface IOffer extends Document {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // Percentage or fixed amount
  startDate: Date;
  endDate: Date;
  shop: mongoose.Types.ObjectId; // Reference to Shop
  products: mongoose.Types.ObjectId[]; // References to Products (optional)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Product',
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

// Validate that endDate is after startDate
OfferSchema.pre<IOffer>('validate', function (next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

export default mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema);