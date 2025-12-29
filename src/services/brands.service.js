import Catalog from "../models/catalog.model.js";
import Product from "../models/product.model.js";

export const getFeaturedBrands = async (limit = 20) => {
  // Get featured catalogs
  const featuredCatalogs = await Catalog.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("c1 c2 c3")
    .lean();

  // Get featured products
  const featuredProducts = await Product.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("collectionId")
    .lean();

  // Merge both arrays
  const merged = [...featuredCatalogs, ...featuredProducts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return merged.slice(0, limit);
};

export const getProductsByBrand = async (brand, limit = 20) => {
  // Get catalogs by brand
  const catalogs = await Catalog.find({ brand })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("c1 c2 c3")
    .lean();

  // Get products by brand
  const products = await Product.find({ brand })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("collectionId")
    .lean();

  const merged = [...catalogs, ...products].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return merged.slice(0, limit);
};
