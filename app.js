const express = require("express");
const app = express();

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const menuRouter = require('./routes/menuRoutes');
const itemRouter = require('./routes/itemRoutes');
const todayMenusRouter = require('./routes/todayMenuRoutes');
const cartRouter = require('./routes/cartRoutes');
//uses
app.use(express.json());

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/menu", menuRouter);
app.use("/v1/item", itemRouter);
app.use("/v1/todaymenu", todayMenusRouter);
app.use("/v1/cart", cartRouter);


module.exports = app;
