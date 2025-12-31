import Catalog from "../models/catalog.model.js";
import Collection from "../models/collection.model.js";

export const getTrendingProductsByCollection = async () => {
  // Get all collections
  const collections = await Collection.find().lean();

  const result = [];

  for (const collection of collections) {
    // Get trending products for this collection
    // Note: In Catalog model, 'category' field links to collections
    const trendingProducts = await Catalog.find({
      category: collection._id,
      salesCount: { $gt: 0 } // Use salesCount as trending indicator
    })
      .sort({ salesCount: -1, rating: -1 })
      .limit(4) // 4 trending products per collection
      .populate("c1 c2 c3")
      .lean();

    if (trendingProducts.length > 0) {
      result.push({
        collection: {
          _id: collection._id,
          name: collection.name,
          description: collection.description,
          imageUrl: collection.imageUrl
        },
        products: trendingProducts
      });
    }
  }

  return result;
};

export const getAllTrending = async (limit = 20) => {
  return await Catalog.find({ salesCount: { $gt: 0 } })
    .sort({ salesCount: -1, rating: -1 })
    .limit(limit)
    .populate("category c1 c2 c3")
    .lean();
};
