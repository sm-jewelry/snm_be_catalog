import Product from "../models/product.model.js";
import Collection from "../models/collection.model.js";

export const getTrendingProductsByCollection = async () => {
  // Get all collections
  const collections = await Collection.find().lean();

  const result = [];

  for (const collection of collections) {
    // Get trending products for this collection
    const trendingProducts = await Product.find({
      collectionId: collection._id,
      isTrending: true
    })
      .sort({ createdAt: -1, rating: -1 })
      .limit(4) // 4 trending products per collection
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
  return await Product.find({ isTrending: true })
    .sort({ createdAt: -1, rating: -1 })
    .limit(limit)
    .populate("collectionId")
    .lean();
};
