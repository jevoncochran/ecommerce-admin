import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: { type: Object, require: true },
    // TODO: Should probably use shippingInfo subdoc here
    name: { type: String, require: true },
    email: { type: String, require: true },
    address: { type: String, require: true },
    addressLine2: { type: String },
    city: { type: String, require: true },
    state: { type: String, require: true },
    zipCode: { type: String, require: true },
    paid: { type: Boolean },
  },
  { timestamps: true }
);

export const Order =
  mongoose?.models?.Order || mongoose.model("Order", OrderSchema);
