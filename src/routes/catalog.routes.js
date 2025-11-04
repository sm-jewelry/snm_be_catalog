import express from "express"
import * as catalogController from "../controllers/catalog.controller.js"
import { verifyOathkeeper } from "../middleware/oathkeeper.js"
import { authorize } from "../middleware/authorize.js"

const router = express.Router()

// Only admin can create, update, delete
router.post("/", verifyOathkeeper, authorize(["admin"]), catalogController.createCatalog)
// router.post("/", catalogController.createCatalog)
router.put("/:id", verifyOathkeeper, authorize(["admin"]), catalogController.updateCatalog)
router.delete("/:id", verifyOathkeeper, authorize(["admin"]), catalogController.deleteCatalog)

// Both user and admin can read
router.get("/", verifyOathkeeper, authorize(["admin", "user"]), catalogController.getCatalogs)
// router.get("/", catalogController.getCatalogs)
router.get("/:id", verifyOathkeeper, authorize(["admin", "user"]), catalogController.getCatalogById)
// router.get("/:id", catalogController.getCatalogById)

// New route: get catalogs by category hierarchy
router.get(
  "/hierarchy",
  verifyOathkeeper,
  authorize(["admin", "user"]),
  catalogController.getCatalogsHierarchy
);

// PATCH /api/catalogs/stock/:id - update stock
router.patch("/stock/:id", catalogController.updateStock);


export default router
