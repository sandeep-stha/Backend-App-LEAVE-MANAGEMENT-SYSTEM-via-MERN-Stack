const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    //Employee Role In Company
    role: {
      type: String,
      required: [true, "Select Your Role"],
      unique: [true, "Select Your Role"],
    },
  },
  { timestamps: true } //Will Set Created At and By Automatically
);

module.exports = mongoose.model("Role", roleSchema);
