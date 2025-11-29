import mongoose from "mongoose";
import Order from "../Model/Order.js";
import OrderItem from "../Model/OrderItem.js";
import pick from "lodash/pick.js";
const ALLOWED = ["quantity", "variants"];
export default class OrderController {
  // GET /:id
  static async order(req, res) {
    try {
      const order = await Order.find({ user: req.params.id })
        .populate({
          path: "orderItems",
          select: "quantity variants product",
          populate: {
            path: "product",
            select: "name price image variations",
          },
        })
        .sort({ createdAt: -1 });
      if (!order) return res.status(404).send("Order not found");
      console.log(Array.isArray(order));
      res.json(order);
    } catch (error) {
      res.status(500).send("Server error");
    }
  }

  // GET /orderItem/:id/:productId
  static async orderItem(req, res) {
    try {
      const { id, productId } = req.params;

      // Find user's active order
      const order = await Order.findOne({ user: id }).populate({
        path: "orderItems",
      });
      if (!order) {
        return res
          .status(404)
          .json({ message: "Order not found for this user" });
      }

      // Find the specific item inside the order
      const item = order.orderItems.find(
        (item) => item._id.toString() === productId
      );

      if (!item) {
        return res
          .status(404)
          .json({ message: "Product not found in this order" });
      }

      return res.json(item);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  // POST /createOrder/:id
  static async createOrder(req, res) {
    try {
      const { user, orderItems } = req.body;

      if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: "No order items provided" });
      }

      // Step 1: Create the order first
      const order = new Order({ user, orderItems: [] });
      await order.save(); // order._id now exists

      // Step 2: Create order items
      const orderItemIds = [];

      for (const item of orderItems) {
        console.log(item);
        // const productId =  mongoose.Types.ObjectId(item.product); // convert string to ObjectId

        const orderItem = new OrderItem({
          order: order._id,
          product: item.product,
          quantity: item.quantity,
          variants: item.variants,
        });

        await orderItem.save();
        orderItemIds.push(orderItem._id);
      }

      // Step 3: Update order with orderItems array
      order.orderItems = orderItemIds;
      await order.save();

      res.status(201).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }

  // PATCH /updateOrder/:id/:orderItemId
  static async updateOrder(req, res) {
    try {
      const updates = pick(req.body, ALLOWED);
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      const { id, orderItemId } = req.params;

      // 1️⃣ Find user's order
      const order = await Order.findOne({ user: id }).populate("orderItems");
      if (!order) {
        return res
          .status(404)
          .json({ message: "Order not found for this user" });
      }

      // 2️⃣ Check if the order contains this order item
      const item = order.orderItems.find(
        (i) => i._id.toString() === orderItemId
      );
      if (!item) {
        return res
          .status(404)
          .json({ message: "Order item not found in this order" });
      }

      // 3️⃣ Update the OrderItem directly
      const updated = await OrderItem.findByIdAndUpdate(
        orderItemId,
        { $set: updates },
        { new: true, runValidators: true }
      ).lean();

      return res.json(updated);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}
