import * as collectionService from "../services/collection.service.js";

export const getCollections = async (req, res) => {
  try {
    const collections = await collectionService.getAllCollections();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCollection = async (req, res) => {
  try {
    const collection = await collectionService.getCollectionById(req.params.id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCollection = async (req, res) => {
  try {
    const newCollection = await collectionService.createCollection(req.body);
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const updated = await collectionService.updateCollection(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    await collectionService.deleteCollection(req.params.id);
    res.json({ message: "Collection deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
