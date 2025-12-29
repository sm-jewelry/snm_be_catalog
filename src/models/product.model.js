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
  },
  // E-commerce features
  salesCount: {
    type: Number,
    default: 0,
    index: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  brand: {
    type: String,
    default: "",
    index: true
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  isTrending: {
    type: Boolean,
    default: false,
    index: true
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);


