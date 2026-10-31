const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers
} = require('../controllers/adminController');
const { getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
