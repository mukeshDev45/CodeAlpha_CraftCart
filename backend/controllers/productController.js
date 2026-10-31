const Product = require('../models/Product');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      rating,
      featured,
      trending,
      bestSeller,
      newArrival,
      inStock,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Search query on name, description, category
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { subcategory: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Minimum rating filter
    if (rating && Number(rating) > 0) {
      query.rating = { $gte: Number(rating) };
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Flags
    if (featured === 'true') query.featured = true;
    if (trending === 'true') query.isTrending = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (newArrival === 'true') query.isNewArrival = true;

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1, numReviews: -1 };
    else if (sort === 'popularity') sortOption = { numReviews: -1, rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID or Slug with related products
// @route   GET /api/products/:idOrSlug
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if valid ObjectId or query by slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Fetch up to 4 related products in same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    })
      .limit(4)
      .select('name price originalPrice images rating numReviews stock category');

    res.status(200).json({
      success: true,
      product,
      relatedProducts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get product categories with counts
// @route   GET /api/products/meta/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categoriesWithCount = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          sampleImage: { $first: { $arrayElemAt: ['$images', 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      subcategory,
      images,
      stock,
      featured,
      isBestSeller,
      isTrending,
      isNewArrival,
      highlights
    } = req.body;

    if (!name || !description || price === undefined || !category || !images || images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, category, and at least one image.'
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      shortDescription: shortDescription || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      category,
      subcategory: subcategory || '',
      images: Array.isArray(images) ? images : [images],
      stock: stock !== undefined ? Number(stock) : 10,
      featured: Boolean(featured),
      isBestSeller: Boolean(isBestSeller),
      isTrending: Boolean(isTrending),
      isNewArrival: Boolean(isNewArrival),
      highlights: Array.isArray(highlights) ? highlights : []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
};
