//THe first letter of the model should be capital. Hence Projectmanager.js and not projectmanager.js
// const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const pmSchema = new mongoose.Schema(
  {
    //Referencing Own ID From Users Table
    pmId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    //Referencing the employee id from Users Table
    employeeId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pm", pmSchema);
