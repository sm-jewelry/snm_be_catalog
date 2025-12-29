import Catalog from "../models/catalog.model.js";
import Product from "../models/product.model.js";

export const getTopRated = async (limit = 20, minRating = 4.0) => {
  // Get top rated catalogs
  const topCatalogs = await Catalog.find({
    rating: { $gte: minRating },
    reviewCount: { $gt: 0 }  // Must have at least 1 review
  })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit)
    .populate("c1 c2 c3")
    .lean();

  // Get top rated products
  const topProducts = await Product.find({
    rating: { $gte: minRating },
    reviewCount: { $gt: 0 }
  })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(limit)
    .populate("collectionId")
    .lean();

  // Merge and sort by rating, then reviewCount
  const merged = [...topCatalogs, ...topProducts].sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.reviewCount - a.reviewCount;
  });

  return merged.slice(0, limit);
};
