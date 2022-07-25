//NOTE:-

//THIRD  PARTY
const Joi = require("joi");
const _ = require("lodash");
require("express-async-errors");
// require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//USER MODULE
const User = require("../model/User");

//To Import

//TO GET ALL USERS
module.exports.getAll = async (req, res) => {
  // console.log("user");
  const users = await User.find();
  if (users.length > 0) return res.json({ status: true, users });
  return res.status(404).json({ status: false, msg: "No Users found" });
};

//TO GET USER BY USER ID
module.exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) return res.json({ status: true, user });
  return res.status(404).json({ status: false, msg: "No such User found" });
};

//TO ADD NEW USER
module.exports.addNew = async (req, res) => {
  // try{
  const { error } = addUserDataValidation(req.body);
  //JOI VALIDATES ONE AT A TIME
  //HENCE, IF WE DO:
  // return res.status(400).json({ status: false , msg: error.message }); -> ONE ERROR at a time

  if (error) {
    // return res.status(400).json({ status: false , msg: error.message });
    return res.status(400).json({ status: false, msg: error });
  } else {
    //FOR HASHING PASSWORD
    // const SALT_ROUND = process.env.SALT_ROUND;
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10); //Number as env took salt as string
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = await User.create(
      _.pick(req.body, [
        "fullName",
        "address",
        "phone",
        "email",
        "password",
        "gender",
        "dob",
      ])
    );

    // req.body.password = password;
    //Success Message
    return res.json({
      status: true,
      msg: "New user created successfully",
      user,
    });
    // }
    // catch(error){
    // res.status(400).json({ status: false, msg: error });
    // }
  }
};

//TO UPDATE USER BY USER_ID
module.exports.updateExisting = async (req, res) => {
  //NOTE, FOR ERROR MESSAGE HANDLING, MUST HAVE TRY CATCH OR CAN USE A PACKAGE CALLED EXPRESS-ASYNC-ERRORS
  //THE FOLLOWING IS WITHOUT USING THE PACKAGE SO WE MUST USE TRY-CATCH
  try {
    //PREVIOUS CODE
    // const user = await User.findById(req.params.id);
    // if (!user)
    //   return res.status(404).json({ status: false, msg: "No such User found" });
    //Now To SAVE USER DATA
    // user.set(req.body);
    //INSTEAD, WE DO findByIDAndUpdate

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    // new: true,
    // }); // new: true shows updated data

    //TO CHECK IF USER EXISTS OR NOT
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, msg: "No such User found" });

    //NOW INITIALLY, CHECK IF EMAIL IS ALREADY IN USE
    if (req.body.email) {
      const checkEmail = await User.findOne({ email: req.body.email });
      if (checkEmail && checkEmail.id != user.id)
        //i.e If user has input email (that is now in checkEmail) and the id linked to that email (CheckEmail.id) does not match id linked to user i.e User ID
        return res
          .status(400)
          .json({ status: false, msg: "Email not available" });
    }
    //NOW FINALLY SAVE USER DATA
    // await user.save(); //Note, this is old method, now instead, do the following:-

    //FIRST HASHING PASSWORD AS IN MODEL WE HAVE SET HASHED PASSWORD
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10); //Number as env took salt as string
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const userData = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({
      status: true,
      msg: "User updated successfully",
      userData,
    });
  } catch (error) {
    res.status(400).json({ status: false, msg: error });
  }
};

//TO DELETE USER BY USER_ID
module.exports.deleteExisting = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(400).json({ status: false, msg: "No such User found" });
  return res.json({ status: true, msg: "User deleted successfully" });
};

//TO LOGIN FOR USER
module.exports.login = async (req, res) => {
  const { error } = validateLoginData(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: false, msg: error.details[0].message });
  //To Show entire error, do
  // return res.status(400).json({status:false, msg:error.details[0].message})

  //ELSE
  const { email, password } = req.body; //DE-Structuring
  //INITIALLY CHECKING IF NO USER EXISTS OR NOT
  const user = await User.findOne({ email }).select("+password"); //As we have set password select as false, it will be hidden, hence we need to use select('+password') to use that field
  //AS WE HAVE DE-STRUCTURED, NO NEED TO WRITE email:req.body.email. Also, as email: email. we can directly write email
  if (!user)
    return res.status(400).json({ status: false, msg: "No Such User Found" });

  //If User FOUND
  //As password is hashed, we need to validate it so as it matches, hence
  const valid = await user.validatePassword(password); //Here, validatePassword is custom Method defined below USER MODEL
  if (!valid)
    return res.status(400).json({ status: false, msg: "Invalid Credentials" });

  //IF VALID
  //WE NEED TO CREATE TOKEN FIRST
  // const token = user.getAccessToken(); //getAccessToken is our custom method as defined in User Model

  //JWT COOKIE OPTIONS
  // const options = {
  // expires: new Date(
  // Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 24 * 7
  // ),
  // httpOnly: true, //Only ALLOW HTTP
  // };

  //FOR PRODUCTION
  // if (process.env.NODE_ENV === "production") options.secure = true;

  // return res
  // .cookie("token", token, options)
  // .json({ status: true, msg: "Login Succesful", token });

  //ABOVE CODES REMOVED TEMPORARILY FOR LOGIN, UNCOMMENT IT LATER AND ALSO REMOVE THE FOLLOWING
  return res.json({ status: true, msg: "login Successful" });
};

//FOR ADD USER VALIDATION
const addUserDataValidation = (datas) => {
  const schema = Joi.object({
    fullName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    gender: Joi.string().required(),
    dob: Joi.string().required(),
  });

  return schema.validate(datas);
};

//FOR LOGIN FIELD VALIDATION
const validateLoginData = (logindatas) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
  });

  return schema.validate(logindatas);
};
