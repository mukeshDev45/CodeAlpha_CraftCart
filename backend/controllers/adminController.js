const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();

    // Calculate revenue from non-cancelled orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Status breakdown
    const statusAgg = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
    ]);
    const ordersByStatus = {};
    statusAgg.forEach(s => {
      ordersByStatus[s._id] = s.count;
    });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock products (< 5)
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,
        ordersByStatus,
        lowStockCount
      },
      recentOrders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    // Attach order counts for each user
    const usersWithStats = await Promise.all(
      users.map(async u => {
        const orderCount = await Order.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          orderCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (err) {
    next(err);
  }
};
