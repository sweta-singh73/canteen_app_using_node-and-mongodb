// const mongoose = require('mongoose');

// const itemSchema = new mongoose.Schema({
//   menu_id: {
//     type: mongoose.Schema.Types.ObjectId,  // Reference to the Menu model
//     ref: "Menu",  // Reference to the Menu model
//     required: true,
//   },
//   item_name: {
//     type: String,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   quantity: {
//     type: Number,
//     default: 1,
//   }
// }, {
//   timestamps: true,
//   versionKey: false,
// });

// const Item = mongoose.model("item", itemSchema);  
// module.exports = Item;

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  menu_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu", // This references the Menu model
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  }
}, {
  timestamps: true,
  versionKey: false,
});

const Item = mongoose.model("Item", itemSchema); // Capitalized the model name
module.exports = Item;
