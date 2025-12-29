import mongoose from "mongoose";

const catalogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    SKU: { type: String, required: true, unique: true },
    URL: { type: String },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },

    c1: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    c2: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    c3: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    // E-commerce features
    salesCount: { type: Number, default: 0, index: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    brand: { type: String, default: "", index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export default mongoose.model("Catalog", catalogSchema);
