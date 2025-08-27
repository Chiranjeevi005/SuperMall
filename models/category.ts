import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  image: {
    url: {
      type: String,
      default: ""
    },
    alt: {
      type: String,
      default: ""
    }
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 3 // Maximum 3 levels deep
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String,
    trim: true,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  productCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

// Create slug from name
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  next();
});

// Update level based on parent category
categorySchema.pre('save', async function(next) {
  if (this.isModified('parentCategory') || this.isNew) {
    if (this.parentCategory) {
      try {
        const parent = await mongoose.model('Category').findById(this.parentCategory);
        if (parent) {
          this.level = parent.level + 1;
          if (this.level > 3) {
            throw new Error('Maximum category depth of 3 levels exceeded');
          }
        }
      } catch (error: any) {
        return next(error as Error);
      }
    } else {
      this.level = 0;
    }
  }
  next();
});

// Instance method to get full path
categorySchema.methods.getFullPath = async function() {
  const path = [this.name];
  let current: any = this;
  
  while (current.parentCategory) {
    current = await mongoose.model('Category').findById(current.parentCategory);
    if (current) {
      path.unshift(current.name);
    } else {
      break;
    }
  }
  
  return path.join(' > ');
};

// Instance method to get all children
categorySchema.methods.getAllChildren = async function() {
  const children = await mongoose.model('Category').find({ parentCategory: this._id });
  let allChildren = [...children];
  
  for (const child of children) {
    const grandChildren = await child.getAllChildren();
    allChildren = allChildren.concat(grandChildren);
  }
  
  return allChildren;
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function() {
  const categories = await this.find({ isActive: true }).sort({ level: 1, sortOrder: 1 });
  
  const buildTree = (parentId: any = null, level = 0) => {
    return categories
      .filter((cat: any) => String(cat.parentCategory) === String(parentId))
      .map((cat: any) => ({
        ...cat.toObject(),
        children: buildTree(cat._id, level + 1)
      }));
  };
  
  return buildTree();
};

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ level: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });
categorySchema.index({ name: 'text', description: 'text' });

export const CategoryModel = 
  mongoose.models.Category || mongoose.model("Category", categorySchema);