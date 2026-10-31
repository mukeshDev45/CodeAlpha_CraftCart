const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  addProductReview
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/', getProductReviews);
router.post('/', protect, addProductReview);

module.exports = router;
