const Order = require("../models/order");
const Cart = require("../models/cart");
const Wallet = require("../models/");

// Place an Order
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("items.itemId");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + (item.itemId.price * item.quantity), 0);
        const wallet = await Wallet.findOne({ userId });
        if (!wallet || wallet.balance < totalAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        wallet.balance -= totalAmount;
        await wallet.save();
        const order = new Order({ userId, items: cart.items, totalAmount, status: "pending" });
        await order.save();

        await Cart.deleteOne({ userId });

        res.status(200).json({ message: "Order placed successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { placeOrder };
