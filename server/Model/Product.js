import mongoose from "mongoose";
import Category from "./Category.js";
import Review from "./Review.js";

const Schema = mongoose.Schema;

const Product = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name product is required"],
      select: true,
    },
    price: {
      type: Number,
      required: [true, "Price product is required"],
      select: true,
    },
    salePrice: {
      type: Number,
      default: null,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", default: [] }],
    des: String,
    image: {
      type: String,
      required: [true, "Image product is required"],
      select: true,
    },
    rating: { type: Number, default: 0 },
    variations: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    reviews: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: [] },
    ],
    sold: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    slug: String,
    isNew: { type: Boolean, default: false }, // for "New arrival" tag
    isOnSale: { type: Boolean, default: false }, // automatically check if salePrice exists
    sku: { type: String, unique: true }, // Stock Keeping Unit
  },
  { timestamps: true }
);

// Middleware to generate slug
Product.methods.generateSlug = function () {
  return (
    this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^-+|-+$/g, "") +
    "-" +
    this._id
  );
};

Product.pre("save", async function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug = this.generateSlug();
  }
  // Automatically update sale & new flags
  this.isOnSale = !!this.salePrice && this.salePrice < this.price;
  next();
});

export default mongoose.model("Product", Product);
