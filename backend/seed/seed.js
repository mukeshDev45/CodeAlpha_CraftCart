require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Review = require('../models/Review');
const Newsletter = require('../models/Newsletter');
const sampleProducts = require('./productsData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/craftcart';
    const safeUri = mongoUri.replace(/\/\/(.*?):(.*?)@/g, '//$1:****@');
    console.log(`\nConnecting to MongoDB: ${safeUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully.');

    // 1. Clear existing data
    console.log('Clearing existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Cart.deleteMany(),
      Review.deleteMany(),
      Newsletter.deleteMany()
    ]);
    console.log('All previous collections purged.');

    // 2. Create Admin user
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@craftcart.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash(adminPassword, salt);

    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'CraftCart Administrator',
      email: adminEmail,
      phone: process.env.ADMIN_PHONE || '9876543210',
      passwordHash: adminPasswordHash,
      role: 'admin',
      addresses: [
        {
          label: 'HQ Office',
          street: '108 Commercial Boulevard, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true
        }
      ]
    });
    console.log(`Created Admin User: ${adminUser.email}`);

    // 3. Create Sample Customer user
    const customerPasswordHash = await bcrypt.hash('Customer@12345', salt);
    const customerUser = await User.create({
      name: 'Mukesh Prajapati',
      email: 'demo@craftcart.com',
      phone: '9812345678',
      passwordHash: customerPasswordHash,
      role: 'user',
      addresses: [
        {
          label: 'Home',
          street: 'Flat 402, Green Glen Layout, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103',
          country: 'India',
          isDefault: true
        },
        {
          label: 'Studio',
          street: '12 4th Cross, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: false
        }
      ]
    });
    console.log(`Created Sample Customer User: ${customerUser.email}`);

    // 4. Insert 25 sample products
    console.log('Inserting 25 handcrafted products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products.`);

    // 5. Add initial items to customer wishlist
    customerUser.wishlist = [insertedProducts[0]._id, insertedProducts[3]._id, insertedProducts[8]._id];
    await customerUser.save();

    // 6. Create sample customer reviews
    console.log('Adding authentic reviews...');
    const reviewsData = [
      {
        user: customerUser._id,
        product: insertedProducts[0]._id,
        rating: 5,
        title: 'Outstanding woodwork and fast charging!',
        comment: 'The walnut wood finish looks magnificent on my oak desk. It charges my iPhone quickly even through a thick silicone case. Truly worth every rupee.'
      },
      {
        user: customerUser._id,
        product: insertedProducts[1]._id,
        rating: 5,
        title: 'Superb room-filling acoustic resonance',
        comment: 'Warm natural sound that is so pleasing to listen to while working. The bent wood finish makes it look like an art piece rather than an electronic gadget.'
      },
      {
        user: customerUser._id,
        product: insertedProducts[5]._id,
        rating: 5,
        title: 'Authentic khadi texture and breathable comfort',
        comment: 'You can immediately tell this is genuine handspun khadi. The cut is modern yet relaxed, and the corozo buttons are such a thoughtful touch.'
      },
      {
        user: customerUser._id,
        product: insertedProducts[10]._id,
        rating: 5,
        title: 'Ceramic coffee set exceeded expectations',
        comment: 'Every morning brewing ritual feels special now. The oatmeal speckled glaze and tactile feel are simply wonderful.'
      }
    ];

    for (const r of reviewsData) {
      await Review.create(r);
    }
    console.log('Sample reviews registered.');

    // 7. Create sample orders to populate order history & dashboard metrics
    console.log('Creating sample orders...');
    const shippingInfo = {
      fullName: customerUser.name,
      phone: customerUser.phone,
      street: customerUser.addresses[0].street,
      city: customerUser.addresses[0].city,
      state: customerUser.addresses[0].state,
      postalCode: customerUser.addresses[0].postalCode,
      country: customerUser.addresses[0].country
    };

    const sampleOrders = [
      {
        user: customerUser._id,
        orderNumber: 'CC-8421-1042',
        items: [
          {
            product: insertedProducts[0]._id,
            name: insertedProducts[0].name,
            image: insertedProducts[0].images[0],
            price: insertedProducts[0].price,
            quantity: 1
          },
          {
            product: insertedProducts[10]._id,
            name: insertedProducts[10].name,
            image: insertedProducts[10].images[0],
            price: insertedProducts[10].price,
            quantity: 1
          }
        ],
        shippingAddress: shippingInfo,
        subtotal: insertedProducts[0].price + insertedProducts[10].price,
        shippingCost: 0,
        discountAmount: 0,
        totalAmount: insertedProducts[0].price + insertedProducts[10].price,
        paymentMethod: 'COD',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        statusHistory: [
          { status: 'Confirmed', note: 'Order placed via Cash on Delivery' },
          { status: 'Processing', note: 'Packed with eco-friendly protective packaging' },
          { status: 'Shipped', note: 'Handed over to express courier' },
          { status: 'Delivered', note: 'Delivered safely and payment collected' }
        ]
      },
      {
        user: customerUser._id,
        orderNumber: 'CC-9150-3281',
        items: [
          {
            product: insertedProducts[5]._id,
            name: insertedProducts[5].name,
            image: insertedProducts[5].images[0],
            price: insertedProducts[5].price,
            quantity: 1
          }
        ],
        shippingAddress: shippingInfo,
        subtotal: insertedProducts[5].price,
        shippingCost: 0,
        discountAmount: 200,
        totalAmount: insertedProducts[5].price - 200,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Processing',
        statusHistory: [
          { status: 'Confirmed', note: 'Order placed via Cash on Delivery' },
          { status: 'Processing', note: 'Artisans packaging garment in canvas dust bag' }
        ]
      }
    ];

    for (const ord of sampleOrders) {
      await Order.create(ord);
    }
    console.log('Sample orders registered.');

    // 8. Add sample newsletter subscriber
    await Newsletter.create({ email: 'mukesh.prajapati@example.com' });

    console.log('\n======================================================');
    console.log('✅ CRAFTCART DATABASE SEEDED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Admin Account:');
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\nCustomer Demo Account:');
    console.log('   Email:    demo@craftcart.com');
    console.log('   Password: Customer@12345');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    const safeError = (err.message || '').replace(/\/\/(.*?):(.*?)@/g, '//$1:****@');
    console.error('Database seed error:', safeError);
    process.exit(1);
  }
};

seedDatabase();
