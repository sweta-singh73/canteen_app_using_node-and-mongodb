const Order = require("../models/order");
const Cart = require("../models/cart");
const Wallet = require("../models/wallet");
const Employee = require("../models/employee");

// Admin Functionalities

// Fetch All Order List ************************************************

const orderList = async (req, res) => {
  try {
    const order = await Order.find();
    if (!order) {
      return res.status(400).json({ error: "Order list is empty" });
    }
    res.status(200).json({ message: "Order list fetched successfully", data: order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Fetch Pending Orders ************************************************

const pendingOrder = async (req, res) => {
  try {
    const order = await Order.find({ status: "pending" });
    if (!order) {
      return res.status(400).json({ error: "Order not found!" });
    }

    res.status(200).json({ message: "Order fetched successfully", data: order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update Order Status ************************************************

const statusUpdate = async (req, res) => {
  try {
    const { orderId, status, billStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, billStatus },
      { new: true }
    );

    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    const totalAmount = order.totalAmount;
    if (!totalAmount) {
      return res.status(400).json({ error: "Invalid order amount" });
    }

    // Find user wallet
    const wallet = await Wallet.findOne({ empId: order.empId });
    if (!wallet) {
      return res.status(400).json({ message: "Wallet not found" });
    }

    if (wallet.balance < totalAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= totalAmount;
    await wallet.save();

    return res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete Order ********************************************************

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(400).json({ error: "Order details not found" });
    }

    res.status(200).json({ message: "Order detail deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//order completed list**************************************************

const completeOrder = async (req, res)=> {
try {
const completedOredr = await Order.aggregate([{$match:{status:"completed"}}]); 

if(!completedOredr){
  return res.status(400).json({error:"Completed Order not found"});
}
res.status(200).json({message:"Completed order fetch successfully", data:completedOredr});
} catch (error) {
 return res.status(500).json({error:error.message}); 
}
}

// User Functionalities

// Place an Order ******************************************************

const placeOrder = async (req, res) => {
  try {
    const empId = req.user.emp_id;
    const employee = await Employee.findOne({ emp_id: empId });

    if (!employee) {
      return res.status(400).json({ error: "Employee not found" });
    }

    const cart = await Cart.findOne({ empId }).populate("items.itemId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.itemId.price * item.quantity,
      0
    );

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(" ")[0]; // HH:MM:SS

    const order = new Order({
      empId,
      name: employee.name,
      items: cart.items,
      totalAmount,
      status: "pending",
      date: formattedDate,
      time: formattedTime,
    });

    await order.save();
    await Cart.deleteOne({ empId });

    res.status(200).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// View Order **********************************************************

const viewOrder = async (req, res) => {
    try {
      const orderId = req.params.id;
      const empId = req.user.emp_id; 
      const orderDetails = await Order.findById(orderId);
      if (!orderDetails) {
        return res.status(404).json({ error: "Order not found" });
      }
  

      if (orderDetails.empId.toString() !== empId) {
        return res.status(403).json({ error: "Unauthorized access to this order" });
      }
  
      res.status(200).json({ message: "Order fetched successfully", data: orderDetails });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

// List All Orders for a User *******************************************

const listAllOrder = async (req, res) => {
  try {
    const empId = req.user.emp_id;
    const orderDetails = await Order.find({ empId });

    if (!orderDetails || orderDetails.length === 0) {
      return res.status(400).json({ error: "Order history not found!" });
    }

    res.status(200).json({ message: "Order history fetched successfully", data: orderDetails });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  placeOrder,
  orderList,
  statusUpdate,
  pendingOrder,
  viewOrder,
  listAllOrder,
  deleteOrder,
  completeOrder
};
