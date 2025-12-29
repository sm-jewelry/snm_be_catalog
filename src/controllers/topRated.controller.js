import * as topRatedService from "../services/topRated.service.js";

export const getTopRated = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const minRating = parseFloat(req.query.minRating) || 4.0;
    const products = await topRatedService.getTopRated(limit, minRating);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
