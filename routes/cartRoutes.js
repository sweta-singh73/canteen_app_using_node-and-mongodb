const express = require("express");
const {
  removeFromCart,
  getCart,
  addToCart,
} = require("../controllers/cartController");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.post("/add-to-cart", verifyToken, addToCart);
router.post("/remove-cart-items", verifyToken, removeFromCart);
router.get("/get-cart", verifyToken, getCart);

module.exports = router;
