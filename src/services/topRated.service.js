import Catalog from "../models/catalog.model.js";

export const getTopRated = async (limit = 20, minRating = 4.0) => {
  // Get top rated catalogs
  const topCatalogs = await Catalog.find({
    rating: { $gte: minRating },
    reviewCount: { $gt: 0 }  // Must have at least 1 review
  })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit)
    .populate("c1 c2 c3 category")
    .lean();

  return topCatalogs;
};
