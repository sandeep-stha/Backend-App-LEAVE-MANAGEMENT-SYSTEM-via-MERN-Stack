const mongoose = require("mongoose");

//FOR MONGO REFERENCE TO ANOTHER MODEL
const { ObjectId } = mongoose.Schema.Types;

//PROJECT MANAGER SCHEMA
const pmSchema = new mongoose.Schema(
  {
    //REFERENCE USER ID FROM USER MODEL FOR PMID
    pmId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    //REFERENCE USER ID FROM USER MODEL FOR EMPLOYEEID TO SHOW EMPLOYEE UNDER PM
    employeeId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pm", pmSchema);
