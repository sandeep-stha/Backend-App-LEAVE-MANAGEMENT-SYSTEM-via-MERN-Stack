//=================SET DOTENV (.env)================
require("dotenv").config();

//JUST TO GET MONGOOSEID FOR CHECKING ANY OBJECTID
// const mongoose = require('mongoose');
// console.log("MongooseObjectId", new mongoose.Types.ObjectId())
//IF WE HAVE SET type:ObjectId, then we need ObjectID i.e 16 digit hex code to (WHICH MAY NOT MATCH) pass it as something
//WE CAN ALSO HANDLE ObjectId with JOI

//===================EXPRESS=======================
const express = require("express");
const app = express();
const cors = require("cors");

//===================DATABASE========================
require("./Database/connection");

//====================DEFAULT EXPRESS MIDDLEWARE==============
app.use(express.json()); //For JSON DATA
app.use(express.urlencoded({ extended: true })); //FOR URL ENCODED DATA
app.use(cors()); //FOR CONNECTIONG TO FRONT END I.E REACT

//================CUSTOM MIDDLEWARES======================
//USER
const userRoutes = require("./routes/UserRoutes");

//ROLE
const roleRoutes = require("./routes/RoleRoutes");

//PROJECT MANAGER
const projectManagerRoutes = require("./routes/ProjectmanagerRoutes");

//LEAVE
const leaveRoutes = require("./routes/LeaveRoutes");

//++++++++++++++++++++MIDDLEWARES SETUP+++++++++++++++++++++++++
//HOME ROUTES FOR USER
app.use("/users", userRoutes);

//HOME ROUTES FOR ROLES
app.use("/roles", roleRoutes);

//HOME ROUTES FOR ROLES
app.use("/pms", projectManagerRoutes);

//HOME ROUTES FOR ROLES
app.use("/leaves", leaveRoutes);

//HANDLING ERRORS BY USING ERROR MIDDLEWARE
app.use(require("./middleware/error"));

//=========================SERVER PORT SETUP===========================
const PORT = process.env.PORT || 3456;
//Normally, PORT 8000 onwards is reserved for laravel
//i.e AS LONG AS .env is found, use from env ELSE IF NOT FOUND USE 8555
app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
