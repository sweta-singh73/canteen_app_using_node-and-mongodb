const Todaymenu = require("../models/dailyMenu");
const Item = require("../models/item");
const Menu = require("../models/menu");
const moment = require("moment");

//add today menu***********************************
const addTodayMenu = async (req, res) => {
  try {
    const { menuId } = req.body;
    const todayDate = new Date().toISOString();

    if (!todayDate.includes("T"))
      return res.status(400).json({ error: "invalid date format" });

    const formattedDate = todayDate.split("T")[0];

    // Check if the menu already exists
    const existingMenu = await Todaymenu.findOne({
      menu_id: menuId,
      date: formattedDate,
    });
    if (existingMenu)
      return res.status(400).json({ error: "this menu already exists" });

    // Fetch all items linked with this menuId
    const items = await Item.find({ menu_id: menuId }).select("_id");

    // Create today's menu entry
    const todayMenu = new Todaymenu({
      menu_id: menuId,
      items: items.map((i) => i._id),
      date: todayDate,
    });

    const todayMenuDetails = await todayMenu.save();
    return res.status(200).json({
      message: "today menu created successfully",
      data: todayMenuDetails,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error", error });
  }
};

//get today menu
const getTodayMenu = async (req, res) => {
    try {
      const todayDate = new Date().toISOString();
  
      if (!todayDate.includes("T"))
        return res.status(400).json({ error: "invalid date format" });
  
      const formattedDate = todayDate.split("T")[0];
  
      const todayMenus = await Todaymenu.find({ date: formattedDate })
        .populate("menu_id")  
        .populate("items", "item_name price quantity");
  
      console.log("todayMenus", todayMenus);  
  
      return res.status(200).json({
        message: "menu list fetched successfully",
        data: todayMenus.map((menu) => ({
          _id: menu._id,
          today_menu_id: menu.menu_id ? menu.menu_id._id : "no menu found",
          title: menu.menu_id ? menu.menu_id.title : "menu not found",
          time: menu.menu_id ? `${menu.menu_id.startTime}` : "no date find",
          items: menu.items,
        })),
      });
    } catch (error) {
      console.error(error);  // Log the error for better debugging
      return res.status(500).json({ error: error.message });
    }
  };
  
  



module.exports = { addTodayMenu, getTodayMenu };
