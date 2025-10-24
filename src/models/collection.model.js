import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  imageUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("Collection", collectionSchema);
