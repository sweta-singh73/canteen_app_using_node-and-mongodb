const Menu = require("../models/menu");


const addMenu = async(req, res)=>{
  try {
    const {title, mealType, startTime, endTime} = req.body;
    const menu = new Menu({title, mealType, startTime, endTime});
    const menuDetails = await menu.save();
    return res.status(200).json({message:"menu created successfully", data:menuDetails});

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


//update menu*********************************************************************
const updateMenu = async (req, res) => {
  try {
    const menuId = req.params.id;

    const menu = await Menu.findOne({ menuId });

    if (!menu) return res.status(400).json({ error: "menu not found" });

    const updateData = {
      title: req.body.title,
      time: req.body.time,
    };
    const updateMenu = await Menu.findByIdAndUpdate(
      { _id: menuId },
      updateData
    );

    if (!updateMenu) return res.status(400).json({ error: "data not found!" });
    return res.status(200).json({ message: "menu updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//delete menu**************************************************************************
const deleteMenu = async (req, res) => {
  try {
    const menuId = req.params.id;
    const menu = await Menu.findOne({ _id: menuId });
    if (!menu) return res.status(400).json({ error: "menu detail not found" });

    await Menu.findByIdAndDelete({ _id: menuId });
    return res
      .status(200)
      .json({ message: "menu details delete successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//list menu******************************************************************
const menuList = async (req, res) => {
  try {
    const menu = await Menu.find();
    if (!menu) return res.status(400).json({ error: "menu not fount" });
    return res
      .status(200)
      .json({ message: "menu list fetch successfully", data: menu });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addMenu, updateMenu, deleteMenu, menuList };
