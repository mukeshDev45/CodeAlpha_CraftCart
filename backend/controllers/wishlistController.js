const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name slug price originalPrice images rating numReviews stock category'
    });

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle product in wishlist (add if not present, remove if present)
// @route   POST /api/wishlist/:productId
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const user = await User.findById(req.user.id);
    const index = user.wishlist.findIndex(id => id.toString() === productId);

    let isAdded = false;
    if (index > -1) {
      user.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      isAdded,
      message: isAdded ? 'Added to your wishlist.' : 'Removed from your wishlist.',
      count: user.wishlist.length,
      wishlist: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      count: user.wishlist.length
    });
  } catch (err) {
    next(err);
  }
};
