const Item = require("../models/item");

// Add Item *************************************************************
const addItem = async (req, res) => {
  try {
    const { item_name, price, quantity, menu_id } = req.body;

    const item = new Item({ item_name, price, quantity, menu_id });
    const itemDetails = await item.save();

    res.status(200).json({ message: "Item created successfully", itemDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// List All Items *******************************************************
const getAllItemList = async (req, res) => {
  try {
    const items = await Item.find();

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Items not found!" });
    }

    res.status(200).json({ message: "Item list fetched successfully", data: items });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Item **********************************************************
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ error: "Item not found" });
    }

    const updateData = {
      menu_id: req.body.menu_id,
      item_name: req.body.item_name,
      price: req.body.price,
    };

    const updatedItem = await Item.findByIdAndUpdate(itemId, updateData, { new: true });
    
    if (!updatedItem) {
      return res.status(400).json({ error: "Data not found!" });
    }

    res.status(200).json({ message: "Item updated successfully", updatedItem });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Item **********************************************************
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ error: "Item details not found" });
    }

    await Item.findByIdAndDelete(itemId);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addItem, getAllItemList, updateItem, deleteItem };
