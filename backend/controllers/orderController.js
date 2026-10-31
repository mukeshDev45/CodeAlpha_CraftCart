const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create a new order (Cash on Delivery)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, items: clientItems, couponCode } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address and contact phone are required.'
      });
    }

    // Determine items: either provided in request body or fetched from user's Cart
    let orderItemsToProcess = [];
    if (clientItems && clientItems.length > 0) {
      orderItemsToProcess = clientItems;
    } else {
      const cart = await Cart.findOne({ user: req.user.id });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Your cart is empty. Please add items before placing an order.'
        });
      }
      orderItemsToProcess = cart.items.map(item => ({
        productId: item.product,
        quantity: item.quantity
      }));
    }

    if (orderItemsToProcess.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided for order.'
      });
    }

    // Server-side validation of stock and prices directly from MongoDB
    const verifiedItems = [];
    let subtotal = 0;

    for (const item of orderItemsToProcess) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found for ID: ${item.productId || item.product}`
        });
      }

      const qty = parseInt(item.quantity, 10) || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      const itemTotal = product.price * qty;
      subtotal += itemTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '',
        price: product.price,
        quantity: qty
      });
    }

    // Shipping fee rule: Free if subtotal >= 999, else 99
    const shippingCost = subtotal >= 999 ? 0 : 99;

    // Optional promotional discount (e.g. CRAFT10 = 10% off subtotal)
    let discountAmount = 0;
    if (couponCode && couponCode.toUpperCase() === 'CRAFT10') {
      discountAmount = Math.round(subtotal * 0.1);
    }

    const totalAmount = Math.max(0, subtotal + shippingCost - discountAmount);

    // Atomically decrement stock
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Create the order
    const order = await Order.create({
      user: req.user.id,
      items: verifiedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country ? shippingAddress.country.trim() : 'India'
      },
      subtotal,
      shippingCost,
      discountAmount,
      totalAmount,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      statusHistory: [
        {
          status: 'Confirmed',
          note: 'Order placed successfully via Cash on Delivery.'
        }
      ]
    });

    // Clear user's shopping cart in MongoDB
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery!',
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Allow only owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // If order was cancelled and now restoring, or if cancelling, restore stock
    if (status === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    // If delivered, mark paymentStatus as Paid for COD
    if (status === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    order.orderStatus = status;
    order.statusHistory.push({
      status,
      note: note || `Order status updated to ${status}`,
      updatedAt: new Date()
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (err) {
    next(err);
  }
};
