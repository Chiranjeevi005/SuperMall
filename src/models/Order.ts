import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  orderId: string;
  customer: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentIntentId?: string; // Stripe Payment Intent ID
  trackingInfo?: {
    trackingNumber?: string;
    carrier?: string;
    estimatedDelivery?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
  };
  couponCode?: string;
  discountAmount?: number;
  shippingCost?: number;
  taxAmount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      // Remove explicit index declaration as unique: true already creates an index
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentIntentId: {
      type: String,
      required: false,
      index: true, // Add index directly to the field
    },
    trackingInfo: {
      trackingNumber: String,
      carrier: String,
      estimatedDelivery: Date,
      shippedAt: Date,
      deliveredAt: Date,
    },
    couponCode: String,
    discountAmount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Add indexes separately to avoid duplicate index warnings
// Remove the separate index declarations since we're adding them directly to fields
// OrderSchema.index({ orderId: 1 }, { unique: true }); // Not needed, unique: true already creates index
// OrderSchema.index({ customer: 1, status: 1 }); // Keep this one as it's a compound index
OrderSchema.index({ customer: 1, status: 1 });

// Pre-save middleware to update status based on payment status
OrderSchema.pre('save', function(next) {
  // If payment is completed and status is still pending, update to processing
  if (this.paymentStatus === 'completed' && this.status === 'pending') {
    this.status = 'processing';
  }
  // If payment failed, cancel the order
  else if (this.paymentStatus === 'failed' && this.status !== 'cancelled') {
    this.status = 'cancelled';
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);