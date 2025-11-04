import express from "express"
import cors from "cors"
import categoryRoutes from "./routes/category.routes.js"
import catalogRoutes from "./routes/catalog.routes.js"
import collectionRoutes from "./routes/collection.routes.js";
import productRoutes from "./routes/product.routes.js";
import newArrivalRoutes from "./routes/newArrival.routes.js";
import uploadRoutes from "./routes/upload.routes.js"

const app = express()

// CORS setup
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Authorization", "Content-Type"],
//     credentials: true,
//   })
// )
// app.use(cors({
//   origin: "http://localhost:3000", // frontend ka domain
//   credentials: true
// }))

app.use("/api/catalogs/upload", uploadRoutes)

// ✅ Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/categories", categoryRoutes)
app.use("/api/catalogs", catalogRoutes)

app.use("/api/collections", collectionRoutes);
app.use("/api/products", productRoutes);

app.use("/api/new-arrivals", newArrivalRoutes);

// Static folder serve karne ke liye:
app.use("/uploads", express.static("public/uploads"))


export default app
