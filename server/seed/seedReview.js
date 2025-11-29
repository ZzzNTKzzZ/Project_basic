import mongoose from "mongoose";
import fs from "fs";
import connectDB from "../db.js";
import Review from "../Model/Review.js";
import User from "../Model/User.js";      
import Product from "../Model/Product.js"; 

await connectDB();

// Clear old reviews
await Review.deleteMany({});
console.log("✅ All old reviews deleted");

// Fetch some users and products to reference
const users = await User.find({}).limit(3);       // pick first 5 users
const products = await Product.find({}).limit(3); // pick first 10 products

let reviews = [];

for (let i = 0; i < 3; i++) {
  const user = users[i];
  const product = products[i];

  reviews.push({
    user: user._id,
    product: product._id,
    rating: Math.floor(Math.random() * 5) + 1, // you can keep random ratings or set fixed ones
    comment: `This is review #${i + 1} for product ${product.name}`,
  });
}

// Insert reviews
const insertedReviews = await Review.insertMany(reviews);
console.log(`✅ ${insertedReviews.length} reviews inserted`);

// Optionally, update each product with new review info (e.g., add review ID to a reviews array)
for (let review of insertedReviews) {
  await Product.findByIdAndUpdate(
    review.product,
    { $push: { reviews: review._id } } // assuming Product schema has reviews: [{ type: ObjectId, ref: 'Review' }]
  );
}

console.log("✅ Products updated with review references");

process.exit(0);
