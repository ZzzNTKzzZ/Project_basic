import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListSubSchema = new Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1 },
    variants: {
      color: String,
      size: String,
    },
  }, {
    _id: false
  }
)

const Cart = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [ListSubSchema],
  },
  { timestamps: true },
  { _id: false}
);

export default mongoose.model("Cart", Cart);
