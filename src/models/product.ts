import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, require: true },
  description: String,
  price: { type: Number, require: true },
  images: { type: [String] },
});

export const Product =
  mongoose?.models?.Product || mongoose.model("Product", ProductSchema);
