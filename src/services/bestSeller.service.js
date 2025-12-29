import Catalog from "../models/catalog.model.js";
import Product from "../models/product.model.js";

export const getBestSellers = async (limit = 20) => {
  // Get top selling catalogs
  const topCatalogs = await Catalog.find({ salesCount: { $gt: 0 } })
    .sort({ salesCount: -1 })
    .limit(limit)
    .populate("c1 c2 c3")
    .lean();

  // Get top selling products
  const topProducts = await Product.find({ salesCount: { $gt: 0 } })
    .sort({ salesCount: -1 })
    .limit(limit)
    .populate("collectionId")
    .lean();

  // Merge and sort by salesCount
  const merged = [...topCatalogs, ...topProducts].sort(
    (a, b) => b.salesCount - a.salesCount
  );

  return merged.slice(0, limit);
};
