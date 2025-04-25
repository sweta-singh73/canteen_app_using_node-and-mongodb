const express = require("express");
const app = express();

const cron = require("node-cron");
const axios = require("axios");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const menuRouter = require("./routes/menuRoutes");
const itemRouter = require("./routes/itemRoutes");
const todayMenusRouter = require("./routes/todayMenuRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const walletRouter = require("./routes/walletRoutes");
const { employeeSchedulerRoute } = require("./routes/userReminderRoutes");

//uses
app.use(express.json());

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/menu", menuRouter);
app.use("/v1/item", itemRouter);
app.use("/v1/todaymenu", todayMenusRouter);
app.use("/v1/cart", cartRouter);
app.use("/v1/order", orderRouter);
app.use("/v1/wallet", walletRouter);
app.use("/v1/emp", employeeSchedulerRoute);


cron.schedule("* * * * *", async () => {
  const now = new Date().toLocaleString(); // or .toISOString() for UTC
  console.log(`[${now}]  Hitting the scheduler API...`);

  try {
    const response = await axios.get(
      "http://localhost:7000/v1/emp/list_emp_schedule"
    );
    console.log(`[${now}]  Scheduler API response:`, response.data);
  } catch (error) {
    console.error(`[${now}]  Error calling scheduler API:`, error.message);
  }
});

module.exports = app;
