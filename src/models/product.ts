import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    description: { type: String },
    price: { type: Number, require: true },
    images: { type: [String] },
    availability: { type: Object },
  },
  { timestamps: true }
);

export const Product =
  mongoose?.models?.Product || mongoose.model("Product", ProductSchema);
