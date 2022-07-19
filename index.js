//EXPRESS
const express = require("express");
const app = express();

//SET DOTENV
require("dotenv").config();

//DATABASE
const db = require("./Database/connection");

//SERVER OPERATION
const PORT = process.env.PORT || 3456;
console.log(PORT);
//Normally, PORT 8000 onwards is reserved for laravel
//i.e AS LONG AS .env is found, use from env ELSE IF NOT FOUND USE 8555
app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
