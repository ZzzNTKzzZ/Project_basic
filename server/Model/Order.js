import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Order = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "OrderItem", default: [] }],
  status: {
    type: String,
    enum: ["Pending", "InTransit", "Completed", "Cancelled"], // allowed values
    default: "Pending" // optional default
  },
  price: { type: Number, select: true },
  createdAt: { type: Date, default: Date.now },
}, {timestamps: true});

Order.pre("save", async function (next) {
  if (!this.isModified("orderItems")) return next();

  try {
    const items = await mongoose
      .model("OrderItem")
      .find({ _id: { $in: this.orderItems } })
      .populate("product", "price");

    let total = 0;

    for (const item of items) {
      total += item.product.price * item.quantity;
    }

    this.price = total;
    next();
  } catch (err) {
    next(err);
  }
});



export default mongoose.model("Order", Order);
