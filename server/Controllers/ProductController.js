import Category from "../Model/Category.js";
import Product from "../Model/Product.js";
import Tag from "../Model/Tag.js";
import TagController from "./TagController.js";

export default class ProductController {
  // GET: /
  // GET: /?category&?minPrice&?maxPrice&?sort
  static async products(req, res) {
    try {
      const { category, minPrice, maxPrice, sort } = req.query;
      const filter = {};
      const sortType = {};

      if (sort) {
        switch (sort) {
          case "newest":
            sortType.timestamp = -1; // newest
            break;
          case "lowToHigh":
            sortType.price = 1; // Ascending
            break;
          case "highToLow":
            sortType.price = -1; // Descending
            break;
          case "bestSeller":
            sortType.sold = -1; // Descending
            break;
        }
      }

      if (category) {
        const categoryArr = category
          .split(",")
          .map((cate) => decodeURIComponent(cate));
        const categoryDoc = await Category.find({ name: { $in: categoryArr } });
        if (!categoryDoc) {
          return res.status(404).json({ message: "Category not found" });
        }
        filter.category = categoryDoc.map((cate) => cate._id); // use ObjectId
      }
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      const products = await Product.find(filter)
        .populate("tags")
        .sort(sortType);
      const formatted = products.map((p) => {
        return {
          ...p.toObject(),
          price: p.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }),
          sale: p.salePrice
            ? p.salePrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            : null,
          tags: p.tags.map((t) => t.name),
        };
      });
      return res.json(formatted);
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  // GET: /:tag
 static async productsByTag(req, res) {
  try {
    const path = req.params.tag; // "sale" or "new_arrivals"

    // Map route to boolean field
    const flagMap = {
      sale: "isOnSale",
      new_arrival: "isNew",
    };

    const field = flagMap[path];
    if (!field) return res.status(400).json({ message: "Invalid flag" });

    const products = await Product.find({ [field]: true });

    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}


  // GET: /create
  static async create(req, res) {
    res.render("products/create");
  }

  // GET: /:slug
  static async product(req, res) {
    try {
      const product = await Product.findOne({ slug: req.params.slug }).populate(
        [
          { path: "category", select: "name" },
          { path: "tags", select: "name" },
          { path: "reviews", select: ["user", "comment", "rating"] },
        ]
      );

      const formatted = {
        ...product.toObject(),
        price: product.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      };

      if (!product) return res.status(404).send("Product not found");
      res.json(formatted);
    } catch (err) {
      console.log(err);
    }
  }

  // POST: /add
  static async add(req, res) {
    try {
      const { name, price, des, tags } = req.body;

      // 🖼️ Nếu có upload ảnh thì lưu đường dẫn
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      // 🏷️ Xử lý tags
      let tagIds = [];
      if (tags && tags.trim() !== "") {
        const tagNames = tags.split(",").map((t) => t.trim());
        tagIds = await Promise.all(
          tagNames.map((tagName) => TagController.add(tagName))
        );
      }
      // 🆕 Tạo sản phẩm mới
      const newProduct = new Product({
        name,
        price,
        des,
        tags: tagIds,
        image: imagePath,
      });
      await newProduct.save();

      console.log("✅ Created new product successfully");
      res.redirect("/products");
    } catch (error) {
      console.error("❌ Error creating product:", error);
      res.status(500).send("Internal Server Error");
    }
  }

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
