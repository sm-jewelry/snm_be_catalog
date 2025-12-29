import express from "express"
import * as catalogController from "../controllers/catalog.controller.js"
import { verifyAuth, authorize } from "../middleware/authMiddleware.js"

const router = express.Router()

// Only admin can create, update, delete
router.post("/", verifyAuth, authorize(["admin"]), catalogController.createCatalog)
router.put("/:id", verifyAuth, authorize(["admin"]), catalogController.updateCatalog)
router.delete("/:id", verifyAuth, authorize(["admin"]), catalogController.deleteCatalog)

// Both user and admin can read (no auth required for public catalog browsing)
router.get("/",  catalogController.getCatalogs)
router.get("/:id",  catalogController.getCatalogById)

// Get catalogs by category hierarchy (requires auth)
router.get("/hierarchy", verifyAuth, authorize(["admin", "user"]), catalogController.getCatalogsHierarchy);

// PATCH /api/catalogs/stock/:id - update stock (protected - only for inter-service calls)
// This should be called by order service, so it needs authentication
router.patch("/stock/:id", verifyAuth, catalogController.updateStock);

// PATCH /api/catalogs/:id/increment-sales - increment sales count
router.patch("/:id/increment-sales", catalogController.incrementSales);


export default router
