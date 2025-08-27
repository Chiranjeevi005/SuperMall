import mongoose from "mongoose";

const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  productDetails: {
    name: String,
    image: String,
    sku: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  selectedVariants: [{
    variantName: String,
    selectedOption: String
  }],
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const shippingAddressSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: "India"
  }
});

const paymentSchema = new Schema({
  method: {
    type: String,
    enum: ["card", "upi", "netbanking", "wallet", "cod", "bank_transfer"],
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded", "cancelled"],
    default: "pending"
  },
  transactionId: {
    type: String,
    trim: true
  },
  paymentGateway: {
    type: String,
    trim: true
  },
  paidAt: {
    type: Date
  },
  amount: {
    type: Number,
    required: true
  }
});

const orderTrackingSchema = new Schema({
  status: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"],
    required: true
  },
  message: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  billingAddress: {
    type: shippingAddressSchema
  },
  payment: paymentSchema,
  pricing: {
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"],
    default: "pending"
  },
  trackingHistory: [orderTrackingSchema],
  notes: {
    customer: {
      type: String,
      trim: true,
      maxlength: 500
    },
    admin: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  returnReason: {
    type: String,
    trim: true
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String,
    trim: true
  },
  shippingTrackingNumber: {
    type: String,
    trim: true
  },
  shippingCarrier: {
    type: String,
    trim: true
  },
  // Stripe Payment Integration
  paymentIntentId: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "processing", "paid", "failed", "cancelled", "refunded", "partial_refund"],
    default: "pending"
  },
  paidAt: {
    type: Date
  },
  refundStatus: {
    type: String,
    enum: ["none", "partial_refund", "refunded"],
    default: "none"
  },
  refundedAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next: any) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD${timestamp}${random}`;
    console.log('Generated order number:', this.orderNumber);
  }
  next();
});

// Add tracking entry
orderSchema.methods.addTracking = function(status: string, message?: string, location?: string, updatedBy?: string) {
  this.trackingHistory.push({
    status,
    message,
    location,
    updatedBy,
    timestamp: new Date()
  });
  this.status = status;
};

// Calculate estimated delivery (5-7 business days from order confirmation)
orderSchema.methods.calculateEstimatedDelivery = function() {
  const businessDays = 7;
  const currentDate = new Date();
  const estimatedDate = new Date(currentDate.getTime() + (businessDays * 24 * 60 * 60 * 1000));
  this.estimatedDelivery = estimatedDate;
};

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "items.vendor": 1 });
orderSchema.index({ "payment.status": 1 });
orderSchema.index({ paymentIntentId: 1 }); // Add index for payment intent ID

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;