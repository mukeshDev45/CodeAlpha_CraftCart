const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user - enforce role as 'user' (prevent role tampering)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      passwordHash,
      role: 'user'
    });

    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // Find user with passwordHash
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist', 'name price images rating stock');
    res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const user = await User.findById(req.user.id).select('+passwordHash');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add shipping address
// @route   POST /api/auth/addresses
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const { label, street, city, state, postalCode, country, isDefault } = req.body;

    if (!street || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Street, city, state, and postal code are required.'
      });
    }

    const user = await User.findById(req.user.id);

    // If marked default, unset default on others
    if (isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    // If first address, mark as default automatically
    const makeDefault = isDefault || user.addresses.length === 0;

    user.addresses.push({
      label: label || 'Home',
      street,
      city,
      state,
      postalCode,
      country: country || 'India',
      isDefault: makeDefault
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Address added successfully.',
      addresses: user.addresses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully.',
      addresses: user.addresses
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Set default address
// @route   PUT /api/auth/addresses/:addressId/default
// @access  Private
exports.setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let found = false;

    user.addresses.forEach(addr => {
      if (addr._id.toString() === req.params.addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Default address updated.',
      addresses: user.addresses
    });
  } catch (err) {
    next(err);
  }
};
