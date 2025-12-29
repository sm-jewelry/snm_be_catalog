import * as productService from "../services/product.service.js";

export const getProductsByCollection = async (req, res) => {
  try {
    const products = await productService.getProductsByCollection(req.params.collectionId);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await productService.updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// product.controller.js
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const incrementSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const product = await productService.incrementSales(id, quantity || 1);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, salesCount: product.salesCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

