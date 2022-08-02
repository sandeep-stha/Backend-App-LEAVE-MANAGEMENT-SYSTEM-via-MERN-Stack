const mongoose = require("mongoose");

//FOR MONGO REFERENCE TO ANOTHER MODEL
const { ObjectId } = mongoose.Schema.Types;

//THIRD PARTY
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("./Role");

//USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    //Full Name
    firstName: {
      type: String,
      required: [true, "Please add a your first name"],
    },

    middleName: {
      type: String,
    },

    lastName: {
      type: String,
      required: [true, "Please add your last name"],
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
      //SET ENUM VALUES FOR SELECT OPTIONS
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

    //Company ID number
    companyId: {
      type: String,
      required: [true, "Enter the Company ID"],
      unique: [true, "CompanyId must be unique"],
    },

    designation: {
      type: String,
      //UNIQUE SO AS SAME DESIGNATION SHOULD NOT BE REPEATED
      required: [true, "Please Set A Designation"],
      unique: [true, "Designation must be unique"],
    },
  },

  { timestamps: true }
);

//METHODS FOR USER CONTROLLER FUNCTIONS

//GET ACCESS TOKEN
userSchema.methods.getAccessToken = async function () {
  const role = await Role.findById(this.role); //This points to current object i.e ROLE
  return jwt.sign({ _id: this._id, role: role.role }, process.env.PRIVATE_KEY, {
    //AFTER TOKEN IS CREATED, WE CAN ACCESS THESE DATA FROM TOKEN I.E ID AND ROLE
    expiresIn: process.env.TOKEN_EXPIRES,
  });
};

//FOR VALIDATE PASSWORD
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);

//FOR GETTING PASSWORD RESET TOKEN
userSchema.methods.getPasswordResetToken = async function () {
  const resetToken = await crypto.randomBytes(20).toString("hex"); //i.e Limit bytes upto 20 digits long and convert it to hex

  //NOW TO HASH THE RESETTOKEN AND SET TO resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); //createHash = to use algorithm i.e sha256, digest('hex') to make it into hexadecimal

  //NOW TO SET THE EXPIRY FOR TOKEN
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
