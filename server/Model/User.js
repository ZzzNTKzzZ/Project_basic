import mongoose from "mongoose";
import Order from "./Order.js";
import Cart from "./Cart.js";
const Schema = mongoose.Schema;

const AddressSubSchema = new Schema (
  {
    city: String,
    ward: String,
    addressDetail: String,
    isDefault: Boolean,
  },
  { _id: false}
)

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    image: {String},
    phone: String,
    address: [AddressSubSchema],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
  },
  { timestamps: true }
);

User.pre("save", async function(next) {
  if (!this.cart) {
    const newCart = await Cart.create({ user: this._id, items: [] });
    this.cart = newCart._id;
  }

  next();
});

export default mongoose.model("User", User);
