import * as categoryService from "../services/category.service.js";

export const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getNestedCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getNestedCategoryById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.json({ message: "Deleted successfully" });
};

export const getCategoriesByLevel = async (req, res) => {
  try {
    const { level } = req.params;
    const categories = await categoryService.getCategoriesByLevel(level);
    res.json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getProductsByC1 = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await categoryService.getProductsByC1(id);
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
