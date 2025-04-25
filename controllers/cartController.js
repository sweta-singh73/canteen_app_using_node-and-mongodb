const { addToCartValidation } = require("../helpers/validation");
const Cart = require("../models/cart");
const Item = require("../models/item");

// Add to Cart *************************************************
const addToCart = async (req, res) => {
  const empId = req.user.emp_id;
  try {
    // Validate request body
    const { error, value } = addToCartValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { itemId, quantity } = value;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ error: "Item not found!" });
    }

    let cart = await Cart.findOne({ empId });
    if (!cart) {
      cart = new Cart({ empId, items: [], totalAmount: 0 });
    }

    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.itemId.toString() === itemId
    );

    // Update quantity and total amount
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ itemId, quantity });
    }

    // Recalculate total amount
    let newTotal = 0;
    for (const cartItem of cart.items) {
      const itemDetails = await Item.findById(cartItem.itemId);
      if (itemDetails) {
        newTotal += itemDetails.price * cartItem.quantity;
      }
    }

    cart.totalAmount = newTotal;
    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Remove Item from Cart ****************************************
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const empId = req.user.emp_id;

    const cart = await Cart.findOne({ empId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (cartItem) => cartItem.itemId.toString() !== itemId
    );

    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get User Cart ************************************************
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ empId: req.user.emp_id }).populate(
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
