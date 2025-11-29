import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderItem = new Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", select: false },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  quantity: { type: Number, required: true, min: 1, select: true },
  variants: {
    color: String,
    size: String,
  },
});

export default mongoose.model("OrderItem", OrderItem);
