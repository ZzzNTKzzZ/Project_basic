import express from "express";
import Category from "../Model/Category.js";

export default class CategoryController {
  // GET: /?cate
  static async categories(req, res) {
    try {
      const { cate, minPrice, maxPrice } = req.query;

      const filter = {};

      if (cate) {
        filter.name = decodeURIComponent(cate);
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice); // greater than or equal
        if (maxPrice) filter.price.$lte = Number(maxPrice); // less than or equal
      }

      const categories = await Category.find(filter);

      if (!categories || categories.length === 0) {
        return res.status(404).json({ mess: "No matching categories found" });
      }

      res.json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mess: "Server error" });
    }
  }
}
