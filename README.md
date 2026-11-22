# CraftCart — Full Stack Artisan E-Commerce Platform

> **CodeAlpha Full Stack Web Development Internship — Task 1: Simple E-Commerce Store**  
> **Repository Name:** `CodeAlpha_CraftCart`  
> **Architecture:** RESTful Multi-Tier Architecture (Vanilla HTML5/CSS3/ES6+ Frontend, Node.js + Express.js Backend, MongoDB + Mongoose Database)

---

## 📖 1. Project Overview

**CraftCart** is a production-grade, responsive e-commerce web application designed and built for conscious consumers who appreciate authentic artisan craft and small-batch craftsmanship. 

Unlike simple frontend mockups or toy demos with hardcoded arrays, CraftCart is a **fully functional full-stack web application** with:
- **Server-Side Security & Price Validation:** Order calculations and stock deductions are performed exclusively on the server using verified database values — never trusting frontend totals.
- **Persistent Database:** MongoDB collections with Mongoose schemas for Users, Products, Shopping Carts, Orders, Reviews, and Newsletter Subscribers.
- **JWT & Role-Based Authorization:** Secure authentication with bcryptjs password hashing and role enforcement separating customers from administrators.
- **Genuine Cash on Delivery (COD) Workflow:** Real order placement, atomic stock reduction, and complete status fulfillment tracking (`Confirmed` &rarr; `Processing` &rarr; `Shipped` &rarr; `Delivered` &rarr; `Cancelled`).
- **Administrative Control:** A dedicated, role-protected Admin Dashboard for inventory CRUD, order status updates, customer management, and store revenue analytics.

---

## 🎨 2. Visual Design & Aesthetic System

CraftCart follows a tailored **modern minimalist aesthetic**:
- **Background Palette:** Warm off-white (`#faf9f5` / `#f4f2ec`) providing an organic, tactile feel.
- **Typography:** Dark charcoal typography (`#1a1c1b` / `#535956`) using Google Fonts (`Outfit` for headings, `Plus Jakarta Sans` for body text).
- **Accents:** Subtle forest green (`#1c4433`, hover `#143326`) and artisan bronze/gold (`#b68438`).
- **Product Photography:** Curated high-resolution imagery showcasing woodwork, ceramics, textiles, and handcrafted accessories.
- **Micro-Animations & Responsive Drawer:** Smooth hover cards, quantity steppers, toast notifications, and responsive touch layouts across mobile phones, tablets, laptops, and desktops.

---

## 🛠️ 3. Technology Stack

### Frontend
- **HTML5:** Semantic document hierarchy, accessible form controls, unique IDs for browser testing.
- **CSS3:** Custom CSS variables, responsive grid & flexbox layouts, media queries, smooth cubic-bezier transitions. *(No Tailwind or bulky frameworks)*.
- **Vanilla JavaScript (ES6+):** Async/Await, Fetch API, modular architecture, dynamic DOM manipulation, real-time cart badge synchronization.

### Backend
- **Runtime:** Node.js (v24.19.0)
- **Framework:** Express.js (v4.21.2)
- **API Style:** RESTful JSON API
- **Middleware:** Helmet (security headers & CSP), CORS, Express Rate Limit, Centralized Error Handler

### Database & ORM
- **Database:** MongoDB Server v8.0+
- **ODM:** Mongoose v8.9+
- **Features:** Schema validation, text indexing for search, compound indexes for unique constraints, pre-validate hooks, automated aggregate rating calculations.

### Authentication & Security
- **Password Hashing:** `bcryptjs` (salt rounds: 10)
- **Session Tokens:** `jsonwebtoken` (JWT) stored securely with Bearer token authentication
- **Route Guards:** `protect` (verifies session token) and `adminOnly` (server-enforced role verification)
- **Atomic Operations:** MongoDB `$inc` operations for consistent, non-duplicative inventory updates.

---

## 📂 4. Project Folder Structure

```
CraftCart/
├── frontend/                     # Pure HTML5 / CSS3 / Vanilla JavaScript Client
│   ├── index.html                # Storefront Homepage (Hero, Categories, Trending, Banner)
│   ├── products.html             # Catalog Page (Search, Category Filters, Price, Sorting)
│   ├── product-details.html      # Detail View (Gallery, Qty Stepper, Buy Now, Reviews)
│   ├── cart.html                 # Persistent Shopping Bag (Qty controls, Coupon CRAFT10)
│   ├── checkout.html             # Cash on Delivery Checkout & Address Selector
│   ├── orders.html               # Customer Order History & Chronological Timeline
│   ├── wishlist.html             # Customer Saved Wishlist & Move-to-Bag
│   ├── profile.html              # Account Management & Saved Address Book
│   ├── login.html                # Authentication Sign In (with 1-Click Demo Fill)
│   ├── register.html             # Account Registration & Validation
│   ├── admin.html                # Role-Protected Admin Dashboard & Management
│   │
│   ├── css/
│   │   ├── style.css             # Master Design System, Variables, Components
│   │   ├── responsive.css        # Mobile Navigation Drawer & Multi-Device Breakpoints
│   │   └── admin.css             # Admin Dashboard Sidebar, Stats Cards & Tables
│   │
│   └── js/
│       ├── api.js                # Unified API Client, State Management & Toast System
│       ├── main.js               # Global Header, Mobile Drawer, Card Renderers
│       ├── home.js               # Homepage Category & Trending Fetchers
│       ├── products.js           # Catalog Search, Range Filters, Sorting, Pagination
│       ├── product-details.js    # Gallery Switcher, Buy Now, Reviews Submitter
│       ├── cart.js               # Bag Table, Coupon Engine, Free Delivery Meter
│       ├── checkout.js           # Address Book Selection & Order Submission
│       ├── orders.js             # Order Cards & Live Timeline Modal
│       ├── wishlist.js           # Wishlist Grid & Move-to-Cart Logic
│       ├── profile.js            # Profile Editor, Password Changer, Address CRUD
│       ├── auth.js               # Login & Register Handlers, Demo Buttons
│       └── admin.js              # Admin Metrics, Product CRUD & Order Statuses
│
├── backend/                      # Node.js & Express REST Backend
│   ├── config/
│   │   └── db.js                 # MongoDB Connection via Mongoose
│   ├── models/
│   │   ├── User.js               # User Model (passwordHash, addresses, wishlist)
│   │   ├── Product.js            # Product Model (slug, prices, categories, stock, tags)
│   │   ├── Cart.js               # Persistent Cart Model linked to User
│   │   ├── Order.js              # Order Model with statusHistory & price snapshots
│   │   ├── Review.js             # Review Model with auto aggregate calculation
│   │   └── Newsletter.js         # Newsletter Subscriber Model
│   ├── controllers/
│   │   ├── authController.js     # Register, Login, Me, Profile, Password, Addresses
│   │   ├── productController.js  # Catalog Query, Search, Filters, Admin CRUD
│   │   ├── cartController.js     # Cart Sync, Quantity Stepper, Server Calculation
│   │   ├── wishlistController.js # Toggle Wishlist, Move to Cart
│   │   ├── orderController.js    # Server Order Validation, Stock Decrement, History
│   │   ├── reviewController.js   # Customer Review Submission & Aggregate Updates
│   │   ├── newsletterController.js # Email Subscription Storage
│   │   └── adminController.js    # Dashboard Aggregations, Users Overview
│   ├── routes/                   # Organized REST API Routes
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── newsletterRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── auth.js               # JWT Verification & Role Authorization Middleware
│   │   ├── errorHandler.js       # Centralized JSON Error Handler
│   │   └── rateLimiter.js        # IP Rate Limiting for Security
│   ├── seed/
│   │   ├── productsData.js       # 25 Curated Artisan Products Across 5 Categories
│   │   └── seed.js               # Database Seeder (Admin, Demo User, Orders, Reviews)
│   ├── server.js                 # Express Application Entry Point & Static Server
│   ├── test-api.js               # Automated API Suite (12 Core Tests)
│   └── test-e2e.js               # Full End-to-End User & Admin Journeys Test
│
├── .env.example                  # Environment Configuration Template
├── .env                          # Local Environment Configuration (Ignored in Git)
├── .gitignore                    # Git Exclusion Rules (node_modules, .env, logs)
├── package.json                  # Dependencies & Scripts
└── README.md                     # Comprehensive Project Documentation
```

---

## ⚡ 5. Quick Start & Installation Guide

### Prerequisites
Make sure you have installed:
- **Node.js** (v18.x or v20.x or v24.x)
- **MongoDB Server** (Community Edition v6.x, v7.x, or v8.x running locally on port 27017)
- **npm** (v9.x or higher)
- **Git**

### Step 1: Clone or Navigate to the Workspace
```bash
git clone https://github.com/YourUsername/CodeAlpha_CraftCart.git
cd CodeAlpha_CraftCart
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` (already configured for local development):
```bash
cp .env.example .env
```
Default configuration values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/craftcart
JWT_SECRET=craftcart_super_secret_jwt_key_2026_codealpha
JWT_EXPIRE=30d
ADMIN_EMAIL=admin@craftcart.com
ADMIN_PASSWORD=Admin@12345
```

### Step 4: Seed the Database
Populate the database with 25 realistic sample products, initial reviews, orders, customer demo account, and administrative account:
```bash
npm run seed
```

### Step 5: Start the Application Server
```bash
npm start
```
*(Or use `npm run dev` to start with nodemon auto-reload during development)*

The server will output:
```
======================================================
🚀 CraftCart Server running at http://localhost:5000
🌐 Storefront: http://localhost:5000
🛡️  Admin Dashboard: http://localhost:5000/admin.html
📡 API Base: http://localhost:5000/api
======================================================
[MongoDB Connected]: 127.0.0.1/craftcart
```

### Step 6: Open in Your Browser
Open your favorite browser and visit:
```
http://localhost:5000
```

---

## 🔑 6. Demo Accounts (1-Click Fill in Login Page)

For easy demonstration and testing, the login screen (`login.html`) provides **One-Click Autofill Buttons**:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@craftcart.com` | `Admin@12345` | Full Admin Dashboard, Product CRUD, Status Updates, Customer Audits |
| **Customer Patron** | `demo@craftcart.com` | `Customer@12345` | Browse, Wishlist, Cart, COD Checkout, Order History, Profile, Reviews |

*(New customer accounts can also be created via the registration form with instant bcrypt hashing and validation).*

---

## 📡 7. REST API Documentation

### Authentication & User
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register customer account (role strictly defaulted to `user`) |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive signed JWT |
| `GET` | `/api/auth/me` | Private | Retrieve current user profile, addresses & wishlist |
| `PUT` | `/api/auth/profile` | Private | Update full name and contact phone number |
| `PUT` | `/api/auth/change-password` | Private | Verify current password and update to new password |
| `POST` | `/api/auth/addresses` | Private | Add delivery address to user's address book |
| `DELETE` | `/api/auth/addresses/:id` | Private | Delete delivery address |
| `PUT` | `/api/auth/addresses/:id/default`| Private | Set address as default shipping destination |

### Products & Catalog
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Filter catalog by category, price, rating, keyword, sort, pagination |
| `GET` | `/api/products/:idOrSlug` | Public | Retrieve single product details & related category products |
| `GET` | `/api/products/meta/categories` | Public | Retrieve categories and item counts |
| `POST` | `/api/products` | Admin Only | Create new product |
| `PUT` | `/api/products/:id` | Admin Only | Update product details, prices, or inventory stock |
| `DELETE` | `/api/products/:id` | Admin Only | Remove product permanently from catalog |

### Cart & Bag
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Private | Fetch user's cart with live stock availability and subtotal |
| `POST` | `/api/cart` | Private | Add item to cart with stock validation |
| `PUT` | `/api/cart/:productId` | Private | Update item quantity or remove if quantity is zero |
| `DELETE` | `/api/cart/:productId` | Private | Remove specific item from cart |
| `DELETE` | `/api/cart` | Private | Clear all items from cart |

### Wishlist
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wishlist` | Private | Retrieve user's saved wishlist products |
| `POST` | `/api/wishlist/:productId` | Private | Toggle product in/out of wishlist |
| `DELETE` | `/api/wishlist/:productId` | Private | Remove product from wishlist |

### Orders & Checkout
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Private | Validate database prices & stock, decrement inventory, place COD order |
| `GET` | `/api/orders/my-orders` | Private | Retrieve logged-in customer's order history |
| `GET` | `/api/orders/:id` | Private | Retrieve full details of an order |
| `GET` | `/api/orders` | Admin Only | View all store orders across customers |
| `PUT` | `/api/orders/:id/status` | Admin Only | Update status (`Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) |

### Reviews & Newsletter
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/:id/reviews` | Public | Fetch verified customer reviews for a product |
| `POST` | `/api/products/:id/reviews` | Private | Submit star rating (1–5) and comment (auto-updates product average rating) |
| `POST` | `/api/newsletter/subscribe` | Public | Store subscriber email in database |

### Administrative Dashboard
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin Only | Aggregate total revenue, orders, products, customers, and recent orders |
| `GET` | `/api/admin/users` | Admin Only | Audit registered customer list with order metrics |

---

## 🧪 8. Automated Testing & Verification

The project includes built-in test suites:

### 1. Core API Integration Suite
```bash
npm run test:api
```
*Validates 12 critical API endpoints: health check, queries, category counts, customer login, profile auth, cart add/get, wishlist, order history, admin authentication, admin dashboard stats, and 403 role-guard protection.*

### 2. End-to-End User & Admin Journeys Suite
```bash
node backend/test-e2e.js
```
*Validates 12 end-to-end user journeys in sequence:*
1. Dynamic customer registration with validation
2. Saving delivery address to profile
3. Multi-parameter product search and price filtering
4. Saving to wishlist
5. Adding to shopping bag & updating quantity
6. Cash on Delivery checkout with promo code `CRAFT10` (10% off)
7. Server-side atomic stock decrement verification
8. Automatic shopping bag clearance upon order completion
9. Customer order history verification
10. Admin order lifecycle updates (`Processing` &rarr; `Shipped` &rarr; `Delivered`)
11. Admin product management (creation, price edit, deletion)
12. Email newsletter subscription

---

## 🎬 9. Project Demonstration Video Script

Use this script during your CodeAlpha internship evaluation or interview video:

```text
"Hello everyone, my name is Mukesh Prajapati, and this is my submission for the CodeAlpha Full Stack Web Development Internship — Task 1: Simple E-Commerce Store.

I have developed 'CraftCart', a full-stack e-commerce web platform for authentic handcrafted and artisanal lifestyle goods.

For the tech stack:
- On the frontend, I used plain HTML5, CSS3, and modern Vanilla JavaScript without any frontend framework, delivering a fast, responsive, and tactile shopping experience.
- On the backend, I built a RESTful API using Node.js and Express.js, featuring rate limiting, Helmet security headers, centralized error handling, and JWT authentication with bcrypt password hashing.
- For the database, I integrated MongoDB with Mongoose schemas for Users, Products, Shopping Carts, Orders, Reviews, and Newsletter Subscribers.

Let's walk through the key features:
1. Home Page: Notice the warm off-white minimalist aesthetic, announcement bar, navigation bar with real-time cart and wishlist counter badges, curated category cards, trending items, customer testimonials, and newsletter signup.
2. Shop Catalog: Here patrons can filter products by category, apply price range filters, filter by star rating, search by keywords, and sort by price, popularity, or newest arrivals with full pagination.
3. Product Details: On any product, we have an interactive image gallery, stock availability, craft highlights, quantity selector, customer reviews, related items, and direct 'Add to Bag' or 'Buy Now' actions.
4. Shopping Bag & Checkout: The shopping bag features persistent synchronization with MongoDB, an express delivery threshold meter, and support for the coupon code 'CRAFT10' which applies a 10% discount. In checkout, patrons can choose from saved addresses and place orders using authentic Cash on Delivery. Order totals and stock checks are strictly calculated and validated on the server — never trusting client inputs.
5. Order History & Tracking: Customers can track their order timeline from Confirmed, to Processing, Shipped, and Delivered.
6. Admin Dashboard: Finally, logging in as an administrator unlocks a role-protected management console showing real-time store revenue, order counts, product inventory CRUD with image management, customer audits, and instant order status updates.

All major features have been thoroughly tested and verified against the local MongoDB instance. Thank you to CodeAlpha for this opportunity!"
```

---

## 🚀 10. Future Roadmap

- Integration with payment gateways (Razorpay / Stripe) when moving from internship demo to production merchant account.
- Automated email order confirmations via Nodemailer / SendGrid.
- Image uploads directly to Amazon S3 or Cloudinary.
- Customer invoice PDF generation.

---

## 📄 11. License

This project is licensed under the MIT License — created for the **CodeAlpha Full Stack Web Development Internship**.
