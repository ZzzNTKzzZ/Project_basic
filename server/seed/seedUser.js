import fs from "fs"
import mongoose from "mongoose";
import User from "../Model/User.js";
import Cart from "../Model/Cart.js";
import Order from "../Model/Order.js";
import connectDB from "../db.js";

await connectDB();
await Promise.all([
    User.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({})
])
console.log("All old user deleted")

const rawData = fs.readFileSync("./users.json", "utf-8")
const data = JSON.parse(rawData);
let success = 0;

for(const u of data) {
    const user = new User(u);
    await user.save();
    success++;
}

console.log(`${success} user inserted`)
process.exit(0);