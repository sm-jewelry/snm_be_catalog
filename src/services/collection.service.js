import Collection from "../models/collection.model.js";

export const getAllCollections = async () => await Collection.find();

export const getCollectionById = async (id) => await Collection.findById(id);

export const createCollection = async (data) => {
  const collection = new Collection(data);
  return await collection.save();
};

export const updateCollection = async (id, data) =>
  await Collection.findByIdAndUpdate(id, data, { new: true });

export const deleteCollection = async (id) =>
  await Collection.findByIdAndDelete(id);
