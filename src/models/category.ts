import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    parentCategory: { type: mongoose.Types.ObjectId, ref: "Category" },
    properties: [{ type: Object }],
    sellerId: { type: mongoose.Types.ObjectId, ref: "User", require: true },
  },
  { timestamps: true }
);

export const Category =
  mongoose?.models?.Category || mongoose.model("Category", CategorySchema);
