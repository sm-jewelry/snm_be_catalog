import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  URL: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  SKU: {
    type: String,
    required: true,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);


