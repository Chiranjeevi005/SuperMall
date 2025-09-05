import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'merchant' | 'customer';
  avatar?: string;
  contact?: string;
  isVerified: boolean;
  isLocked: boolean;
  failedLoginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  isAccountLocked: () => boolean;
  resetLoginAttempts: () => void;
  incrementFailedLoginAttempts: () => Promise<void>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'merchant', 'customer'],
        message: 'Role must be admin, merchant, or customer'
      },
      default: 'customer',
    },
    avatar: {
      type: String,
    },
    contact: {
      type: String,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Contact is optional
          // Basic phone number validation (10-15 digits, may include + and spaces)
          return /^[\+]?[0-9\s\-]{10,15}$/.test(v.trim());
        },
        message: (props: { value: string }) => `${props.value} is not a valid phone number!`
      }
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: unknown) {
    next(error instanceof Error ? error : new Error('Unknown error'));
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Check if account is locked
UserSchema.methods.isAccountLocked = function (): boolean {
  // Check if lockUntil exists and is in the future
  return !!(this.lockUntil && this.lockUntil > new Date());
};

// Reset login attempts
UserSchema.methods.resetLoginAttempts = function (): void {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
};

// Increment failed login attempts
UserSchema.methods.incrementFailedLoginAttempts = async function (): Promise<void> {
  this.failedLoginAttempts += 1;
  
  // Lock account if failed attempts exceed threshold (5)
  if (this.failedLoginAttempts >= 5) {
    this.isLocked = true;
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }
  
  await this.save();
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);