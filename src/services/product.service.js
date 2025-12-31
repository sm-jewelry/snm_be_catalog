import Product from "../models/product.model.js";

export const getProductsByCollection = async (collectionId) =>
  await Product.find({ collectionId });

export const getProductById = async (id) => await Product.findById(id).populate("collectionId", "name description");

export const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

export const updateProduct = async (id, data) =>
  await Product.findByIdAndUpdate(id, data, { new: true });

export const deleteProduct = async (id) =>
  await Product.findByIdAndDelete(id);

export const getAllProducts = async (options = {}) => {
  const {
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc",
    minPrice,
    maxPrice,
    search,
  } = options;

  // Build query
  const query = {};

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Search filter
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  // Execute query with pagination
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("collectionId", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const incrementSales = async (id, quantity = 1) => {
  return await Product.findByIdAndUpdate(
    id,
    { $inc: { salesCount: quantity } },
    { new: true }
  );
};
