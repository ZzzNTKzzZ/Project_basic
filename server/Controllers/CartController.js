import Cart from "../Model/Cart.js";
import mongoose from "mongoose";

export default class CartController {
  // GET: /:cartId
  static async cart(req, res) {
    try {
      console.log("hi");
      const { cartId } = req.params;
      console.log(cartId);
      const cart = await Cart.findById(cartId);
      if (!cart)
        return res
          .status(404)
          .json({ mess: `Cart of user ${cartId} not found!` });

      res.json(cart);
    } catch (error) {
      console.log(error);
    }
  }

  // POST: /:cartId/items

  static async addItemOnCart(req, res) {
    try {
      const { cartId } = req.params;
      const { productId, quantity, variants } = req.body;

      const item = {
        product: productId,
        quantity,
        variants,
      };

      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ mess: `Cart ${cartId} not found!` });
      }

      const updatedCart = await Cart.findByIdAndUpdate(
        cartId,
        { $push: { items: item } }, 
        { new: true }
      );

      res.json(updatedCart);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mess: "Server error" });
    }
  }
}
