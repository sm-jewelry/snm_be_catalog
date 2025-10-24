import Category from "../models/category.model.js";
import Catalog from "../models/catalog.model.js";

// create category
export const createCategory = async (data) => {
  const { level, parents } = data;

  // Validate level
  if (!["C1", "C2", "C3"].includes(level)) {
    throw new Error("Invalid level, must be C1, C2 or C3");
  }

  // Validate parents
  if (level === "C1" && parents && parents.length > 0) {
    throw new Error("C1 category cannot have parents");
  }

  if ((level === "C2" || level === "C3") && (!parents || parents.length === 0)) {
    throw new Error(`${level} category must have parents`);
  }

  // Level-specific validation
  if (level === "C2") {
    const parentCats = await Category.find({ _id: { $in: parents } });
    if (parentCats.some((p) => p.level !== "C1")) {
      throw new Error("C2 category must have C1 parents only");
    }
  }

  if (level === "C3") {
    const parentCats = await Category.find({ _id: { $in: parents } });
    if (parentCats.some((p) => p.level !== "C2")) {
      throw new Error("C3 category must have C2 parents only");
    }
  }

  return await Category.create(data);
};

// update category
export const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

// delete category
export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

// get all categories with children
export const getNestedCategories = async () => {
  const categories = await Category.find().populate("parents").lean();
  return categories;
};

// get single category with children and products
export const getNestedCategoryById = async (id) => {
  const category = await Category.findById(id).populate("parents").lean();
  if (!category) return null;

  category.children = await Category.find({ parents: category._id }).lean();
  category.products = await Catalog.find({ category: category._id }).lean();

  return category;
};

// get categories by level
export const getCategoriesByLevel = async (level) => {
  if (!["C1", "C2", "C3"].includes(level)) {
    throw new Error("Invalid level, must be C1, C2 or C3");
  }
  return await Category.find({ level }).lean();
};

// Get products by C1 category ID
export const getProductsByC1 = async (c1Id) => {
  // Validate C1 category
  const c1Category = await Category.findById(c1Id);
  if (!c1Category || c1Category.level !== "C1") {
    throw new Error("Invalid C1 category ID");
  }

  // Get all C2 categories under this C1
  const c2Categories = await Category.find({ parents: c1Id, level: "C2" }).lean();

  const c2Ids = c2Categories.map((c2) => c2._id);

  // Get all C3 categories under these C2 categories
  const c3Categories = await Category.find({ parents: { $in: c2Ids }, level: "C3" }).lean();
  const c3Ids = c3Categories.map((c3) => c3._id);

  // Fetch all products under C1's C2 and C3 categories
  const products = await Catalog.find({
    category: { $in: [...c2Ids, ...c3Ids] },
  }).lean();

  return products;
};
