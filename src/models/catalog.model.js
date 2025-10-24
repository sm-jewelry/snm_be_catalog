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
  },
  { timestamps: true }
);

export default mongoose.model("Catalog", catalogSchema);
