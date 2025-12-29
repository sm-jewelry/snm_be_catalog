import * as bestSellerService from "../services/bestSeller.service.js";

export const getBestSellers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const products = await bestSellerService.getBestSellers(limit);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
