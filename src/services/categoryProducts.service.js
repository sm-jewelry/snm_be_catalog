import Catalog from "../models/catalog.model.js";

/**
 * Get products/catalogs by category ID
 * Searches in c1, c2, or c3 fields
 */
export const getProductsByCategory = async (categoryId, level = null) => {
  const query = {};

  // If level is specified, search only in that level
  if (level) {
    query[level] = categoryId;
  } else {
    // Search across all levels
    query.$or = [
      { c1: categoryId },
      { c2: categoryId },
      { c3: categoryId },
    ];
  }

  // Get catalogs
  const catalogs = await Catalog.find(query)
    .populate("c1", "name")
    .populate("c2", "name")
    .populate("c3", "name")
    .populate("category")
    .lean();

  return catalogs;
};

/**
 * Get category hierarchy (C1 -> C2 -> C3)
 */
export const getCategoryHierarchy = async () => {
  const Category = (await import("../models/category.model.js")).default;

  // Get all C1 categories
  const c1Categories = await Category.find({ level: "C1" })
    .sort({ name: 1 })
    .lean();

  // For each C1, get its C2 children
  const hierarchy = await Promise.all(
    c1Categories.map(async (c1) => {
      const c2Categories = await Category.find({
        level: "C2",
        parents: c1._id,
      })
        .sort({ name: 1 })
        .lean();

      // For each C2, get its C3 children
      const c2WithC3 = await Promise.all(
        c2Categories.map(async (c2) => {
          const c3Categories = await Category.find({
            level: "C3",
            parents: c2._id,
          })
            .sort({ name: 1 })
            .lean();

          return {
            ...c2,
            children: c3Categories,
          };
        })
      );

      return {
        ...c1,
        children: c2WithC3,
      };
    })
  );

  return hierarchy;
};

/**
 * Get breadcrumb path for a category
 */
export const getCategoryPath = async (categoryId) => {
  const Category = (await import("../models/category.model.js")).default;

  const category = await Category.findById(categoryId)
    .populate("parents")
    .lean();

  if (!category) return [];

  const path = [];

  // Build path from parents
  if (category.parents && category.parents.length > 0) {
    for (const parent of category.parents) {
      const parentWithParents = await Category.findById(parent._id)
        .populate("parents")
        .lean();
      if (
        parentWithParents.parents &&
        parentWithParents.parents.length > 0
      ) {
        path.push(...parentWithParents.parents);
      }
      path.push(parentWithParents);
    }
  }

  path.push(category);

  return path;
};
