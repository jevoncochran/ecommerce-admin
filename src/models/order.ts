import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    products: { type: Object, require: true },
    customer: { type: Object, require: true },
    sellerId: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    total: { type: Number, require: true },
    paid: { type: Boolean },
  },
  { timestamps: true }
);

export const Order =
  mongoose?.models?.Order || mongoose.model("Order", OrderSchema);
