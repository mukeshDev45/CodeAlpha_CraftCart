const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to populate and calculate cart summary
const formatCartResponse = async (cart) => {
  await cart.populate({
    path: 'items.product',
    select: 'name price originalPrice images stock category'
  });

  // Filter out any items where product might have been deleted from DB
  const validItems = cart.items.filter(item => item.product !== null);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  let subtotal = 0;
  const items = cart.items.map(item => {
    const p = item.product;
    const itemTotal = p.price * item.quantity;
    subtotal += itemTotal;
    return {
      itemId: item._id,
      productId: p._id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.images && p.images.length > 0 ? p.images[0] : '',
      stock: p.stock,
      quantity: item.quantity,
      itemTotal,
      isAvailable: p.stock >= item.quantity
    };
  });

  // Shipping logic: Free shipping over ₹999, else ₹99
  const shippingCost = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 99;
  const totalAmount = subtotal + shippingCost;

  return {
    items,
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal,
    shippingCost,
    totalAmount
  };
};

// @desc    Get current user's shopping cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const cartData = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      cart: cartData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add product to cart or increment quantity
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qtyToAdd = Math.max(1, parseInt(quantity, 10));

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Sorry, this product is currently out of stock.' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newTotalQty = cart.items[existingIndex].quantity + qtyToAdd;
      if (newTotalQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} items available in stock.`
        });
      }
      cart.items[existingIndex].quantity = newTotalQty;
    } else {
      if (qtyToAdd > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available in stock.`
        });
      }
      cart.items.push({ product: productId, quantity: qtyToAdd });
    }

    await cart.save();
    const cartData = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      message: `${product.name} added to cart.`,
      cart: cartData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const newQty = parseInt(quantity, 10);

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId || item._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not in cart.' });
    }

    const actualProductId = cart.items[itemIndex].product;
    const product = await Product.findById(actualProductId);

    if (newQty <= 0) {
      // Remove item
      cart.items.splice(itemIndex, 1);
    } else {
      if (product && newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available in stock.`
        });
      }
      cart.items[itemIndex].quantity = newQty;
    }

    await cart.save();
    const cartData = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      message: 'Cart updated.',
      cart: cartData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId && item._id.toString() !== productId
    );

    await cart.save();
    const cartData = await formatCartResponse(cart);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart.',
      cart: cartData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared.',
      cart: { items: [], itemCount: 0, subtotal: 0, shippingCost: 0, totalAmount: 0 }
    });
  } catch (err) {
    next(err);
  }
};
