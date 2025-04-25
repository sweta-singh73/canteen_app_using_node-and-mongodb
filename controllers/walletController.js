const Wallet = require("../models/wallet");

// Add Money to Wallet ************************************************
const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const empId = req.user.emp_id;

    let wallet = await Wallet.findOne({ empId });

    // If wallet does not exist, create a new one
    if (!wallet) {
      wallet = new Wallet({ empId, balance: 0 });
    }

    wallet.balance += amount;
    await wallet.save();

    res.status(200).json({
      message: "Money added to wallet successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Wallet Balance ************************************************
const getBalance = async (req, res) => {
  try {
    const empId = req.user.emp_id;
    const wallet = await Wallet.findOne({ empId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json({
      message: "Wallet balance fetched successfully",
      balance: wallet.balance,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addMoney, getBalance };
