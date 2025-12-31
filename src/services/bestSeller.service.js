import Catalog from "../models/catalog.model.js";

export const getBestSellers = async (limit = 20) => {
  // Get top selling catalogs
  const topCatalogs = await Catalog.find({ salesCount: { $gt: 0 } })
    .sort({ salesCount: -1 })
    .limit(limit)
    .populate("c1 c2 c3 category")
    .lean();

  return topCatalogs;
};
