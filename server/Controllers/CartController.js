import Cart from "../Model/Cart.js";
import mongoose from "mongoose";

export default class CartController {
  // GET: /:cartId
  static async cart(req, res) {
    try {
      const { cartId } = req.params;

      const cart = await Cart.findById(cartId).populate({
        path: "items.product",
      });
      if (!cart) {
        return res
          .status(404)
          .json({ mess: `Cart of user ${cartId} not found!` });
      }

      res.json(cart);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mess: "Server error" });
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

      const existing = cart.items.find(
        (i) =>
          i.product.toString() === productId &&
        JSON.stringify(i.variants) === JSON.stringify(variants)
      );
      
      let updated;
      
      if (existing) {
        // update quantity
        updated = await Cart.findOneAndUpdate(
          {
            _id: cartId,
            "items.product": productId,
            "items.variants": variants,
          },
          {
            $inc: { "items.$.quantity": quantity },
          },
          { new: true }
        );
      } else {
        // push new item
        updated = await Cart.findByIdAndUpdate(
          cartId,
          { $push: { items: item } },
          { new: true }
        );
      }
      
      const formatted = await updated.populate({
        path: "items.product",
      });
      if (!updated) {
        return res.status(404).json({ mess: `Cart ${cartId} not found!` });
      }

      res.json(formatted);
    } catch (error) {
      console.log(error);
      res.status(500).json({ mess: "Server error" });
    }
  }

  // DELETE: /:cartId/items
  static async deleteItemOnCart(req, res) {
  try {
    const { cartId } = req.params;
    const { productId } = req.body;

    const updatedCart = await Cart.findOneAndUpdate(
      {
        _id: cartId,
      },
      {
        $pull: {
          items: {
            "product._id": productId,
          },
        },
      },
      { new: true }
    ).populate({
      path: "items.product",
    });

    if (!updatedCart) {
      return res.status(404).json({ mess: "Item not found in cart" });
    }
    res.json(updatedCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ mess: "Server error" });
  }
}

}
