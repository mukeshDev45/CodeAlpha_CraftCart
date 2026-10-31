const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please enter product description']
    },
    shortDescription: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Please enter product price in INR'],
      min: [0, 'Price must be positive']
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      }
    },
    category: {
      type: String,
      required: [true, 'Please enter product category'],
      enum: ['Electronics', 'Fashion', 'Home & Living', 'Accessories', 'Lifestyle']
    },
    subcategory: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one product image URL'],
      validate: [val => val.length > 0, 'At least one image is required']
    },
    stock: {
      type: Number,
      required: [true, 'Please specify stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 10
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5']
    },
    numReviews: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    tags: [String],
    highlights: [String]
  },
  {
    timestamps: true
  }
);

// Auto generate slug before save if not present
productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
