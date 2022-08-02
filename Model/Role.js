const mongoose = require("mongoose");

//ROLE SCHEMA
const roleSchema = new mongoose.Schema(
  {
    //Employee Role In Company; REFERENCED IN USER MODEL
    role: {
      type: String,
      required: [true, "Please Set A New Role"],
      unique: [true, "Roles must be unique"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
