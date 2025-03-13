const Cart = require("../models/cart");

// Add Item to Cart
const addToCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.itemId.toString() === itemId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ itemId, quantity });
    }
    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove Item from Cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.itemId.toString() !== itemId);
    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get User Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.itemId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { addToCart, removeFromCart, getCart };
