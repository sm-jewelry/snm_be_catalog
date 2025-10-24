import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // unique globally removed
    description: { type: String },
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    level: { type: String, enum: ["C1", "C2", "C3"], required: true }
  },
  { timestamps: true }
);

categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parents",
});

categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

// Compound index: same name allowed under different parents
categorySchema.index({ name: 1, parents: 1, level: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
