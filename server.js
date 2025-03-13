const app = require('./app');
const dotenv = require('dotenv');
const dbConnection = require('./config/db');
dotenv.config();
dbConnection();



app.listen(process.env.PORT, ()=>{
  console.log("server is running at port", process.env.PORT);
})