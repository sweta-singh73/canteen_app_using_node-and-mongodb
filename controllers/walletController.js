const Wallet = require("../models/wallet");

// Add Money to Wallet
const addMoney = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        let wallet = await Wallet.findOne({ userId });

        if (!wallet) {
            wallet = new Wallet({ userId, balance: 0 });
        }
        wallet.balance += amount;
        await wallet.save();
        res.status(200).json({ message: "Money added to wallet", wallet });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Wallet Balance
const getBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }

        res.status(200).json({ balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { addMoney, getBalance };
