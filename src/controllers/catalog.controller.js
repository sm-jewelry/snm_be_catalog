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
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      search: req.query.search,
      category: req.query.category,
      collection: req.query.collection,
      minRating: req.query.minRating,
    };

    const result = await catalogService.getCatalogs(filters);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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

export const incrementSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const catalog = await catalogService.incrementSales(id, quantity || 1);
    if (!catalog) {
      return res.status(404).json({ message: "Catalog not found" });
    }
    res.json({ success: true, salesCount: catalog.salesCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCatalogsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const catalogs = await catalogService.getCatalogsByCategory(id);
    res.json(catalogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

