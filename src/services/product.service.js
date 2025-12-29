import Product from "../models/product.model.js";

export const getProductsByCollection = async (collectionId) =>
  await Product.find({ collectionId });

export const getProductById = async (id) => await Product.findById(id).populate("collectionId", "name description");

export const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

export const updateProduct = async (id, data) =>
  await Product.findByIdAndUpdate(id, data, { new: true });

export const deleteProduct = async (id) =>
  await Product.findByIdAndDelete(id);

export const getAllProducts = async () => {
  return await Product.find().populate("collectionId", "name");
};

export const incrementSales = async (id, quantity = 1) => {
  return await Product.findByIdAndUpdate(
    id,
    { $inc: { salesCount: quantity } },
    { new: true }
  );
};
