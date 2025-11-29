import mongoose from "mongoose";
import connectDB from "../db.js";
import User from "../Model/User.js";
import Product from "../Model/Product.js";
import Order from "../Model/Order.js";
import OrderItem from "../Model/OrderItem.js";

await connectDB();

// Clear previous orders and orderItems
await Order.deleteMany({});
await OrderItem.deleteMany({});
console.log("✅ All old orders and orderItems deleted");

// Fetch users and products
const users = await User.find({}).limit(5);  // pick first 5 users
const products = await Product.find({}).limit(5); // pick first 5 products

for (const user of users) {
  const orderItemsIds = [];

  // Create order items for this user
  for (const product of products) {
    const orderItem = await OrderItem.create({
      order: null, // will update later
      product: product._id,
      quantity: Math.floor(Math.random() * 3) + 1, // random quantity 1-3
      variants: { color: "default", size: "M" },
    });

    orderItemsIds.push(orderItem._id);
  }

  // Create the order
  const order = await Order.create({
    user: user._id,
    orderItems: orderItemsIds,
  });

  // Update orderItems with the order ID
  await OrderItem.updateMany(
    { _id: { $in: orderItemsIds } },
    { order: order._id }
  );

  // Optionally update user's orders array
  user.orders = user.orders || [];
  user.orders.push(order._id);
  await user.save();

  console.log(`✅ Order created for user ${user._id}`);
}

console.log("✅ All orders and orderItems seeded successfully");
process.exit(0);
