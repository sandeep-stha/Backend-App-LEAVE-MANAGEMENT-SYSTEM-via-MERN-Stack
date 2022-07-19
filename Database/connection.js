const mongoose = require("mongoose");

mongoose
  .connect(process.env.DATABASE, {
    //DATABASE = our mongoDB url
    useNewUrlParser: true, //To connect via URL
    useUnifiedTopology: true, //To maintain structire in JSON format
  })

  //If Successful Data-Connection
  .then(() => console.log("Successfully Connected To Database"))

  //If Error
  .catch((error) => console.log(error));
