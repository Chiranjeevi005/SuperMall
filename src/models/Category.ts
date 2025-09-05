import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description: string;
  icon: string; // URL to category icon
  image: string; // URL to category image
  isActive: boolean;
  slug: string; // Add slug field
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      // Remove explicit index declaration as unique: true already creates an index
    },
  },
  {
    timestamps: true,
  }
);

// Add index for slug field (this was creating a duplicate)
// CategorySchema.index({ slug: 1 }); // Removed to prevent duplicate index warning

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);