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

export const getCatalogs = async () => {
  return await Catalog.find().populate("c1 c2 c3");
};

export const getCatalogById = async (id) => {
  return await Catalog.findById(id).populate("c1 c2 c3");
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

