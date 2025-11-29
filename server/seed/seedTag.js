import mongoose from "mongoose";
import Tag from "../Model/Tag.js";
import connectDB from "../db.js";

await connectDB();

await Tag.deleteMany({});
console.log("All old Tag deleted");

const tags = [{ name: "Sale" }, { name: "New Arrival" }];
let success = 0;

for(const t of tags) {
    const tag = new Tag(t)
    await tag.save();
    success++;
}

console.log(`${success} Tag inserted`)
process.exit(0)