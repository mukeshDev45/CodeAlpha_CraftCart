const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add review for a product
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.addProductReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user.id
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product.'
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating: numRating,
      title: title ? title.trim() : '',
      comment: comment.trim()
    });

    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback!',
      review
    });
  } catch (err) {
    next(err);
  }
};
