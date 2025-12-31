import Catalog from "../models/catalog.model.js";
import mongoose from "mongoose";

export const getNewArrivals = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Latest catalog products
  const latestCatalogs = await Catalog.find({ createdAt: { $gte: oneMonthAgo } })
    .populate("c1 c2 c3 category")
    .sort({ createdAt: -1 })
    .lean();

  return latestCatalogs;
};
