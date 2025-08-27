import mongoose from "mongoose";

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  selectedVariants: [{
    variantName: {
      type: String,
      required: true
    },
    selectedOption: {
      type: String,
      required: true
    }
  }],
  priceAtTime: {
    type: Number,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.priceAtTime * item.quantity), 0);
  this.lastUpdated = new Date();
  next();
});

// Methods
cartSchema.methods.addItem = function(productId: string, quantity: number, price: number, variants?: any[]) {
  const existingItemIndex = this.items.findIndex((item: any) => 
    item.product.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      priceAtTime: price,
      selectedVariants: variants || [],
      addedAt: new Date()
    });
  }
};

cartSchema.methods.removeItem = function(productId: string) {
  this.items = this.items.filter((item: any) => 
    item.product.toString() !== productId.toString()
  );
};

cartSchema.methods.updateQuantity = function(productId: string, quantity: number) {
  const item = this.items.find((item: any) => 
    item.product.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
    }
  }
};

cartSchema.methods.clearCart = function() {
  this.items = [];
};

// Indexes
cartSchema.index({ user: 1 });
cartSchema.index({ "items.product": 1 });
cartSchema.index({ lastUpdated: 1 });

export const CartModel = 
  mongoose.models.Cart || mongoose.model("Cart", cartSchema);