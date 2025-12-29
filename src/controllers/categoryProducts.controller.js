import * as categoryProductsService from "../services/categoryProducts.service.js";

/**
 * Get products by category ID
 * Query params: level (optional) - c1, c2, or c3
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { level } = req.query;

    const products = await categoryProductsService.getProductsByCategory(
      categoryId,
      level
    );

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get full category hierarchy (C1 -> C2 -> C3)
 */
export const getCategoryHierarchy = async (req, res) => {
  try {
    const hierarchy = await categoryProductsService.getCategoryHierarchy();
    res.json(hierarchy);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get breadcrumb path for a category
 */
export const getCategoryPath = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const path = await categoryProductsService.getCategoryPath(categoryId);
    res.json(path);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
