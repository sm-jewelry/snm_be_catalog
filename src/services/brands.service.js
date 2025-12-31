import Catalog from "../models/catalog.model.js";

export const getFeaturedBrands = async (limit = 20) => {
  // Get featured catalogs
  const featuredCatalogs = await Catalog.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("c1 c2 c3 category")
    .lean();

  return featuredCatalogs;
};

export const getProductsByBrand = async (brand, limit = 20) => {
  // Get catalogs by brand
  const catalogs = await Catalog.find({ brand })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("c1 c2 c3 category")
    .lean();

  return catalogs;
};
