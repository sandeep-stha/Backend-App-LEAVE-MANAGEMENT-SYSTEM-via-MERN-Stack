//THe first letter of the model should be capital. Hence Projectmanager.js and not projectmanager.js
import { Schema, module } from "mongoose";
const mongoose = require("mongoose");
const { ObjectID } = mongoose.Schema.Type;

const projectmanagerSchema = new mongoose.schema(
  {
    //Referencing Own ID From Users Table
    projectmanagerid: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    //Referencing the employee id from Users Table
    employeeid: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projectmanager", projectmanagerSchema);
