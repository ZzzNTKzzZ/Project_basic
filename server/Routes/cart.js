import express from "express";

import CartController from "../Controllers/CartController.js";

const router = express.Router();

router.get("/:cartId", CartController.cart)
router.post("/:cartId/items", CartController.addItemOnCart)
router.delete("/:cartId/items", CartController.deleteItemOnCart)
export default router