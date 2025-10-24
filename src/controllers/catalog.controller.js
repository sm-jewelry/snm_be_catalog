import * as catalogService from "../services/catalog.service.js";

export const createCatalog = async (req, res) => {
  try {
    const catalog = await catalogService.createCatalog(req.body);
    res.status(201).json(catalog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getCatalogs = async (req, res) => {
  const catalogs = await catalogService.getCatalogs();
  res.json(catalogs);
};

export const getCatalogById = async (req, res) => {
  const catalog = await catalogService.getCatalogById(req.params.id);
  if (!catalog) return res.status(404).json({ message: "Not found" });
  res.json(catalog);
};

export const updateCatalog = async (req, res) => {
  const catalog = await catalogService.updateCatalog(req.params.id, req.body);
  res.json(catalog);
};

export const deleteCatalog = async (req, res) => {
  await catalogService.deleteCatalog(req.params.id);
  res.json({ message: "Deleted successfully" });
};

export const getCatalogsHierarchy = async (req, res) => {
  try {
    const catalogs = await catalogService.getCatalogsByCategoryHierarchy();
    res.json(catalogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body; // can be negative to reduce stock

    if (typeof quantity !== "number") {
      return res.status(400).json({ message: "Quantity must be a number" });
    }

    const catalog = await catalogService.updateStock(id, quantity);
    if (!catalog) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Stock updated", stock: catalog.stock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

