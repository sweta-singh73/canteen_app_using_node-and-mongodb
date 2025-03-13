const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "snacks"],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Menu = mongoose.model("Menu", menuSchema); // Updated to use "Menu" (capitalized)
module.exports = Menu;
