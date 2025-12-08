import express from "express";

import CartController from "../Controllers/CartController.js";

const router = express.Router();

router.get("/:cartId", CartController.cart)
router.post("/:cartId/items", CartController.addItemOnCart)
export default router