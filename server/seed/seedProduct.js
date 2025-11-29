import fs from "fs";
import mongoose from "mongoose";
import Product from "../Model/Product.js";
import connectDB from "../db.js";
import Category from "../Model/Category.js";
import Tag from "../Model/Tag.js";

await connectDB();

await Product.deleteMany({});
console.log("✅ All old products deleted");

// Đọc file JSON
const rawData = fs.readFileSync("./product.json", "utf-8");
const data = JSON.parse(rawData);
let success = 0;

// Lấy tất cả categories trước để map tên -> _id
const categories = await Category.find({});
let categoryMap = {};
categories.forEach(c => {
  categoryMap[c.name] = c._id;
});

//  Lấy tất cả tags trước đó để map tên -> _id
const tags = await Tag.find({});
let tagsMap = {};
tags.forEach(t => {
  tagsMap[t.name] = t._id
})
// Gán giá mặc định nếu null để tránh validation
const products = data.map((p) => {
  let tagsArr = []
  p.tags.forEach(t => {
    tagsArr.push(tagsMap[t])
  })
  return ({
  ...p,
  tags:  tagsArr || [],
  category: categoryMap[p.category] || null, // correct spelling and assign ObjectId
  price: p.price ?? 0, // đặt 0 nếu price null
})});


console.log("✅ product.json updated");

// Lưu từng product để trigger pre-save hook
for (const p of products) {
  const prod = new Product(p);
  await prod.save();
  success++;
}
console.log(`✅ ${success} products inserted with slug`);
process.exit(0);
