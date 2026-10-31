const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to email newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to the CraftCart newsletter!'
      });
    }

    await Newsletter.create({ email: email.toLowerCase().trim() });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to CraftCart updates!'
    });
  } catch (err) {
    next(err);
  }
};
