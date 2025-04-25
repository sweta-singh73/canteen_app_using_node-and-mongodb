const mongoose = require("mongoose");

const todayMenuSchema = new mongoose.Schema(
  {
    menu_id: {
      // Correct field name in the schema to match the population path
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu", // Reference to the Menu model
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item", // Reference to the Item model
      },
    ],
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Todaymenu = mongoose.model("Todaymenu", todayMenuSchema);
module.exports = Todaymenu;
