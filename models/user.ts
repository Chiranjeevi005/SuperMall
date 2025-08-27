import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Full name must be at least 2 characters long']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  addressLine1: {
    type: String,
    required: [true, 'Address line 1 is required'],
    trim: true,
    minlength: [5, 'Address must be at least 5 characters long']
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    minlength: [2, 'City must be at least 2 characters long']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    minlength: [2, 'State must be at least 2 characters long']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
    match: [/^\d{6}$/, 'Please enter a valid 6-digit postal code']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    default: "India"
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    trim: true,
    enum: {
      values: ['home', 'work', 'other'],
      message: 'Label must be either home, work, or other'
    }
  }
}, {
  timestamps: true
});

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  address: {
    type: String,
  },
  savedAddresses: [addressSchema],
  role: {
    type: String,
    enum: ["admin", "vendor", "user", "deliveryPerson"],
    default: "user"
  },
  stripeCustomerId: {
    type: String,
    sparse: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
  },
  dateOfBirth: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  // Adding avatar field for profile images
  avatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
export { User as UserModels };