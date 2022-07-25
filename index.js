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

//===================DATABASE========================
require("./Database/connection");

//====================DEFAULT EXPRESS MIDDLEWARE==============
app.use(express.json()); //For JSON DATA
app.use(express.urlencoded({ extended: true })); //FOR URL ENCODED DATA

//================CUSTOM MIDDLEWARES======================
//USER
const userRoutes = require("./routes/UserRoutes");

//ROLE
const roleRoute = require("./routes/RoleRoutes");

//PROJECT MANAGER
const projectManager = require("./routes/ProjectmanagerRoutes");

//++++++++++++++++++++MIDDLEWARES SETUP+++++++++++++++++++++++++
//USER
app.use("/users", userRoutes);

//ROLE
app.use("/roles", roleRoute);

//PROJECT MANAGER
app.use("/pms", projectManager);

//HANDLING ERRORS BY USING ERROR MIDDLEWARE
app.use(require("./middleware/error"));

//=========================SERVER PORT SETUP===========================
const PORT = process.env.PORT || 3456;
//Normally, PORT 8000 onwards is reserved for laravel
//i.e AS LONG AS .env is found, use from env ELSE IF NOT FOUND USE 8555
app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
