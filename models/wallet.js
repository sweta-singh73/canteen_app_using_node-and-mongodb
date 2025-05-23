const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    empId: {
      type: Number,
      required: true,
    },

    balance: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
