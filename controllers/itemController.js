const Menu = require('../models/menu');
const Item = require('../models/item');
const mongoose = require("mongoose");
//add item**********************************************************************
// const addItem = async(req, res)=>{
//   try {
//     const cleanedBody = Object.fromEntries(
//       Object.entries(req.body).map(([key, value]) => [key.trim(), value])
//     );
//     const { menu_id, item_name, price } = cleanedBody;
//      if(!menu_id || !item_name || !price)return res.status(400).json({error:"menu_id, item_name, price is required"});

//     //  // Check if menu_id is a valid ObjectId
//     //  if (!mongoose.Types.ObjectId.isValid(menu_id)) {
//     //   console.log("Invalid category ID:", menu_id);
//     //   return res.status(400).json({ error: "Invalid menu ID format!" });
//     // }

//     const menu = await Menu.findOne({_id:menu_id});
//     console.log("menu", menu)
//     if (!menu) {
//       return res.status(404).json({ error: "menu not found!" });
//     }

//   //check existance of item 
//   const existItem = await Item.findOne({item_name:item_name});
//   if(existItem)return res.status(400).json({error:"item alraedy exist, create new one"});


//     const item = new Item({
//       menu_id,
//       item_name,
//       price
      
//     });

//     await item.save();

   
//     return res.status(201).json({
//       message: "item added successfully!",
//       data: item,
//     });

//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }

//then**********************
const addItem = async(req, res)=>{
  try {
    const {item_name, price, quantity, menu_id} = req.body;

    const item = new Item({item_name, price, quantity, menu_id});
    const itemDetails = await item.save();
    return res.status(200).json({message:"item created successfully", itemDetails});
  } catch (error) {
    return res.status(500).json({error:error.message});
  }
}

//list item*********************************************************************
const getAllItemList = async(req, res)=>{
  try {
    const item = await Item.find();
    if(!item)return res.status(400).json({error:"Item not found!"});
    return res.status(200).json({message:"Item list fetch successfully", data:item});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

//update item*********************************************************************
const updateItem = async (req, res) => {
  try {
    const itemId = req.params.id;

    const item = await Item.findOne({_id: itemId });

    if (!item) return res.status(400).json({ error: "item not found" });

    const updateData = {
      menu_id:req.body.menu_id,
      item_name: req.body.item_name,
      price: req.body.price,
    };
    const updateItem = await Item.findByIdAndUpdate(
      { _id: itemId },
      updateData
    );

    if (!updateItem) return res.status(400).json({ error: "data not found!" });
    return res.status(200).json({ message: "item updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//delete item***********************************************************
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findOne({ _id: itemId });
    if (!item) return res.status(400).json({ error: "item detail not found" });

    await Item.findByIdAndDelete({ _id: itemId });
    return res
      .status(200)
      .json({ message: "item details delete successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {addItem, getAllItemList, updateItem, deleteItem};