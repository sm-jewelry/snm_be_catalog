import * as brandsService from "../services/brands.service.js";

export const getFeaturedBrands = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const products = await brandsService.getFeaturedBrands(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const products = await brandsService.getProductsByBrand(brand, limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
