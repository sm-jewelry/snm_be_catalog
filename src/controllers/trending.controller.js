import * as trendingService from "../services/trending.service.js";

export const getTrendingProductsByCollection = async (req, res) => {
  try {
    const data = await trendingService.getTrendingProductsByCollection();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const products = await trendingService.getAllTrending(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
