import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    parentCategory: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: [{ type: Object }],
    seller: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Category =
  mongoose?.models?.Category || mongoose.model("Category", CategorySchema);
