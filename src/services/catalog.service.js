import Catalog from "../models/catalog.model.js";
import Category from "../models/category.model.js";

// create catalog product (C3 only)
export const createCatalog = async (data) => {
  const cat = await Category.findById(data.category).lean();
  if (!cat) throw new Error("Category not found");
  if (cat.level !== "C3") throw new Error("Products can only be created under C3");

  // Resolve hierarchy using parents array (ensure proper order)
  let c1Id = null;
  let c2Id = null;

  for (const parentId of cat.parents || []) {
    const parent = await Category.findById(parentId).lean();
    if (parent.level === "C1") c1Id = parent._id;
    if (parent.level === "C2") c2Id = parent._id;
  }

  data.c3 = cat._id;
  data.c2 = c2Id;
  data.c1 = c1Id;

  return await Catalog.create(data);
};

export const getCatalogs = async (filters = {}) => {
  const {
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc",
    minPrice,
    maxPrice,
    search,
    category,
    collection,
    minRating,
  } = filters;

  // Build query
  const query = {};

  // Price filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Category filter (check c1, c2, c3, or category fields)
  if (category && category !== "all") {
    query.$or = [
      { c1: category },
      { c2: category },
      { c3: category },
      { category: category },
    ];
  }

  // Collection filter
  if (collection && collection !== "all") {
    query.collection = collection;
  }

  // Minimum rating filter
  if (minRating) {
    query.rating = { $gte: parseFloat(minRating) };
  }

  // Search filter (search in title, SKU, brand)
  if (search) {
    const searchConditions = [
      { title: { $regex: search, $options: "i" } },
      { SKU: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
    ];

    // If we already have $or from category, we need to use $and
    if (query.$or) {
      query.$and = [
        { $or: query.$or },
        { $or: searchConditions },
      ];
      delete query.$or;
    } else {
      query.$or = searchConditions;
    }
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

  // Execute query with pagination
  const [products, total] = await Promise.all([
    Catalog.find(query)
      .populate("c1 c2 c3 category collection")
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .lean(),
    Catalog.countDocuments(query),
  ]);

  return {
    products,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit),
    },
  };
};

export const getCatalogById = async (id) => {
  return await Catalog.findById(id).populate("c1 c2 c3 category collection");
};

export const updateCatalog = async (id, data) => {
  return await Catalog.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCatalog = async (id) => {
  return await Catalog.findByIdAndDelete(id);
};

// hierarchy-wise catalogs
export const getCatalogsByCategoryHierarchy = async () => {
  const topCategories = await Category.find({ level: "C1" }).lean();

  const populateChildrenAndProducts = async (category) => {
    const children = await Category.find({ parents: category._id }).lean();
    for (const child of children) {
      child.children = await populateChildrenAndProducts(child);
      child.products = await Catalog.find({ category: child._id }).lean();
    }
    return children;
  };

  for (const category of topCategories) {
    category.children = await populateChildrenAndProducts(category);
    category.products = await Catalog.find({ category: category._id }).lean();
  }

  return topCategories;
};

export const updateStock = async (id, quantity) => {
  const catalog = await Catalog.findById(id);
  if (!catalog) return null;

  catalog.stock = (catalog.stock || 0) + quantity;

  // Prevent stock from going negative
  if (catalog.stock < 0) catalog.stock = 0;

  await catalog.save();
  return catalog;
};

export const incrementSales = async (id, quantity = 1) => {
  return await Catalog.findByIdAndUpdate(
    id,
    { $inc: { salesCount: quantity } },
    { new: true }
  );
};

// Get catalogs by collection/category ID
export const getCatalogsByCategory = async (categoryId) => {
  return await Catalog.find({ category: categoryId }).populate("c1 c2 c3 category");
};

