const Menu = require("../models/menu");

// Add Menu *************************************************************
const addMenu = async (req, res) => {
  try {
    const { title, mealType, startTime, endTime } = req.body;

    const menu = new Menu({ title, mealType, startTime, endTime });
    const menuDetails = await menu.save();

    res.status(200).json({ message: "Menu created successfully", data: menuDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Menu **********************************************************
const updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(400).json({ error: "Menu not found" });
    }

    const updateData = {
      title: req.body.title,
      time: req.body.time,
    };

    const updatedMenu = await Menu.findByIdAndUpdate(menuId, updateData, { new: true });

    if (!updatedMenu) {
      return res.status(400).json({ error: "Data not found!" });
    }

    res.status(200).json({ message: "Menu updated successfully", updatedMenu });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Menu **********************************************************
const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(400).json({ error: "Menu details not found" });
    }

    await Menu.findByIdAndDelete(menuId);

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// List Menus ***********************************************************
const menuList = async (req, res) => {
  try {
    const menus = await Menu.find();

    if (!menus || menus.length === 0) {
      return res.status(400).json({ error: "Menu not found" });
    }

    res.status(200).json({ message: "Menu list fetched successfully", data: menus });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addMenu, updateMenu, deleteMenu, menuList };
