import Category from "../Model/Category.js";
import connectDB from "../db.js";

await connectDB();

await Category.deleteMany({});
console.log("All old category deleted");

const categories = [{ name: "Áo" }, { name: "Quần" }, { name: "Váy" }];
let success = 0;

for(const c of categories) {
    const cate = new Category(c)
    await cate.save();
    success++;
}

console.log(`${success} category inserted`)
process.exit(0)