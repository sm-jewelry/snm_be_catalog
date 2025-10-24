import Catalog from "../models/catalog.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getNewArrivals = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Latest catalog products
  const latestCatalogs = await Catalog.find({ createdAt: { $gte: oneMonthAgo } })
    .populate("c1 c2 c3")
    .lean();

  // Latest collection products
  const latestProducts = await Product.find({ createdAt: { $gte: oneMonthAgo } })
    .lean();

  // Merge both arrays (optional: you can sort by date descending)
  const merged = [...latestCatalogs, ...latestProducts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return merged;
};
