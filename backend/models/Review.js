const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true,
      maxlength: [80, 'Review title cannot exceed 80 characters'],
      default: ''
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comment text'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

// Prevent a user from submitting multiple reviews for the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to recalculate average rating and numReviews on product
reviewSchema.statics.calculateProductRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    const Product = mongoose.model('Product');
    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        numReviews: stats[0].numReviews,
        rating: Math.round(stats[0].avgRating * 10) / 10
      });
    } else {
      await Product.findByIdAndUpdate(productId, {
        numReviews: 0,
        rating: 0
      });
    }
  } catch (err) {
    console.error('Error recalculating product rating:', err);
  }
};

reviewSchema.post('save', function () {
  this.constructor.calculateProductRating(this.product);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Product = mongoose.model('Product');
    const ReviewModel = mongoose.model('Review');
    await ReviewModel.calculateProductRating(doc.product);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
