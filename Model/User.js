//New Method
// import { Schema, model } from "mongoose";
// const userSchema = new Schema(
//At The End
// export default model("User", userSchema);
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
//IF ABOVE LINE WAS NOT WRITTEN THEN NEED TO WRITE THE FOLLOWING IN BELOW:-
// role_id :{
//   type:mongoose.Schema.Types.ObjectId,
//   ref:'Role'
// },
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    //Full Name
    fullName: {
      type: String,
      required: [true, "Please add a full name"],
    },

    //Address
    address: {
      type: String,
      required: [true, "Enter your address"],
    },

    //Phone Number
    phone: {
      type: Number,
      required: [true, "Enter your phone number"],
      unique: [true, "Enter a phone number that is not registered previously"],
    },

    //Email Address
    email: {
      type: String,
      required: [true, "Please add a valid email address"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter the valid email address",
      ],
      unique: [true, "Enter a email address that is not registered previously"],
    },

    //Password
    password: {
      type: String,
      required: [true, "Enter your password"],
      select: false, //So as to hide password fields
    },

    //Gender
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Select your gender",
      },
      required: [true, "Select your gender"],
    },

    //Date Of Birth
    dob: {
      type: Date,
      required: [true, "Enter your date of birth"],
    },

    //Role
    role: {
      type: ObjectId,
      ref: "Role",
      //This above reference means take reference from the role_id of Role.js Model
      //Thus create RoleController.js before Creating UserController.js
    },
  },

  { timestamps: true }
);

//METHODS NEEDED FOR FUNCTION

//GET ACCESS TOKEN
userSchema.methods.getAccessToken = function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.PRIVATE_KEY, {
    expiresIn: process.env.TOKEN_EXPIRES,
  });
};

//FOR VALIDATE PASSWORD
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
