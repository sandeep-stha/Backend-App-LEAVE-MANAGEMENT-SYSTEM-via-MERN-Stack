//THIRD  PARTY
const Joi = require("joi");
const _ = require("lodash");
require("express-async-errors");
const bcrypt = require("bcrypt");

//USER MODULE
const User = require("../model/User");

//UTILS
const sendMail = require("../utils/sendMail");

//TO GET ALL USERS
module.exports.getAll = async (req, res) => {
  const users = await User.find().populate("role");
  if (users.length > 0) return res.json({ status: true, users });
  return res.status(404).json({ status: false, msg: "No Users found" });
};

//TO GET USER BY USER ID
module.exports.getOne = async (req, res) => {
  const user = await User.findById(req.params.id).populate("role");
  if (user) return res.json({ status: true, user });
  return res.status(404).json({ status: false, msg: "No such User found" });
};

//TO ADD NEW USER
//AS EXPRESS ASYNC ERROR PACKAGE IS USED AND WE HAVE VALIDATED USING JOI, NO NEED TO USE TRY{} CATCH{}
module.exports.addNew = async (req, res) => {
  const { error } = addUserDataValidation(req.body);
  if (error) {
    return res.status(400).json({ status: false, msg: error.message });
  } else {
    //FOR HASHING PASSWORD
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10); //Number as env took salt as string
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = await User.create(
      _.pick(req.body, [
        "firstName",
        "middleName",
        "lastName",
        "address",
        "phone",
        "email",
        "password",
        "gender",
        "dob",
        "role",
        "companyId",
        "designation",
      ])
    );

    //getAccessToken FROM methods in User Model
    const token = await user.getAccessToken();

    //SUCCESS
    return res.json({
      status: true,
      msg: "New user created successfully",
      user,
      token,
    });
  }
};

//TO UPDATE USER BY USER ID
module.exports.updateExisting = async (req, res) => {
  //THE FOLLOWING IS WITHOUT USING THE EXPRESS ASYNC ERROR PACKAGE SO WE MUST USE TRY-CATCH
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, msg: "No such User found" });

    if (
      req.user.role == "admin" ||
      req.user.role == "hr" ||
      user._id == req.user._id
    ) {
      //NOW INITIALLY, CHECK IF EMAIL IS ALREADY IN USE
      if (req.body.email) {
        const checkEmail = await User.findOne({ email: req.body.email });
        //If checkEmail has data or not and If user has input email (that is now in checkEmail) and the id linked to that email (CheckEmail.id) does not match id linked to user i.e User ID
        if (checkEmail && checkEmail.id != user.id)
          return res
            .status(400)
            .json({ status: false, msg: "Email not available" }); //Show this If checkEmail does not have any data and/or the id does not match
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
    } else res.status(401).json({ status: false, msg: "Not Authorized" });
  } catch (error) {
    res.status(400).json({ status: false, msg: error });
  }
};

//TO DELETE USER BY USER ID
module.exports.deleteExisting = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(400).json({ status: false, msg: "No such User found" });
  return res.json({ status: true, msg: "User deleted successfully" });
};

//WE WILL NOT DEFINE LOGOUT FUNCTION
//IF WE SAVE TOKEN IN A MODEL, WE NEED TO CLEAR TOKEN FROM IT ASWELL BUT AN EASIER METHOD IS AS FOLLOWS:
// THE EASIER METHOD IS THAT WE DON'T SAVE THE TOKEN IN A MODEL, HENCE NO NEED TO CLEAR TOKEN, ALSO,
//AS WE ARE NOT STORING ANY TOKENS IN BACKEND, NO NEED TO DEFINE ANY LOGOUT FUNTION HERE BUT IN FRONT END, WE WILL GET THAT TOKEN, SAVE IT IN SESSION AND THEN CLEAR IT WHEN LOGGED OUT

//FOR USER LOGIN
module.exports.login = async (req, res) => {
  const { error } = validateLoginData(req.body);
  if (error)
    //Single statement so no curly braces
    return res
      .status(400)
      .json({ status: false, msg: error.details[0].message });
  //as return already states not compulsory to write else

  //DE_STRUCTURING EMAIL AND PASSWORD
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password"); //No need to set email:email as both are spelled same. ALSO, select('+password)as we hence set password as hidden by default
  if (!user) {
    return res.status(400).json({ status: false, msg: "User not found" });
  }
  //IF USER EXISTS, VALIDATE FIRST
  const valid = await user.validatePassword(password); //validatePassword is our METHOD from USER MODEL
  if (!valid)
    return res.status(400).json({ status: false, msg: "Invalid Credentials" });

  const token = await user.getAccessToken();

  //TOKEN EXPIRE SETUP
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 24 * 1000
    ),
    httpOnly: true,
  };

  return res
    .cookie("token", token, options)
    .json({ status: true, msg: "Login successful", token });
};

//FOR SENDING FORGET PASSWORD RESET LINKS
module.exports.forgetPassword = async (req, res) => {
  if (req.body && req.body.email) {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({
        status: false,
        msg: `The email address ${req.body.email} does not exist`,
      });
    //IF USER FOUND
    //INITIALLY GENERATE PASSWORD RESET TOKEN
    const resetToken = await user.getPasswordResetToken(); //getPasswordResetToken() METHOD from USER MODEL

    //INITIALLY, SEND EMAIL WITH URLS FOR FORGET PASSWORD
    //NO ROUTES FOR THIS
    const resetUrl = `${req.protocol}:${req.get(
      "host"
    )}/users/resetpassword/${resetToken}`;
    const message = `You are receiving this email because you or someone else has requested to reset the password.`;

    try {
      await sendMail({
        //SendMail Called From utils
        email: user.email,
        subject: "Password reset token",
        message: "Please use the following link to reset the password",
      });
      await user.save();
      return res.json({ status: true, msg: "Please check your email" });
    } catch (error) {
      console.log(error);
      return res
        .status(400)
        .json({ status: false, msg: "Email could not be sent" });
    }
  }
  return res.status(400).json({ status: false, msg: "Please send your email" });
};

//TO RESET FORGOTTEN PASSWORD
module.exports.updateForgottenPassword = async (req, res) => {
  //INITIAL CREATE A RESET PASSWORD TOKEN USING CURRENT TOKEN
  //HASHING TOKEN
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  //
  const user = await User.findOne({
    resetPasswordToken, //CALLING METHOD DEFINED ABOVE
    resetPasswordExpire: { $gt: Date.now() }, //CALLING METHOD FROM USER MODEL
  });
  //IF NO USER FOUND
  if (!user)
    return res.status(400).json({ status: false, msg: "Invalid Token" });
  //ELSE IF USER EXISTS

  //SET USER PASSWORD
  user.password = req.body.password;

  //ALSO, CLEAR TOKEN AND EXPIRY
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //FINALLY SAVE
  await user.save();
  res.json({ status: true, msg: "Password Changed Successfully" });
};

//VALIDATION FOR ADD USER
const addUserDataValidation = (datas) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    gender: Joi.string().required(),
    dob: Joi.date().required(),
    role: Joi.string(),
    companyId: Joi.string().required(),
    designation: Joi.string().required(),
  });

  return schema.validate(datas);
};

//FOR LOGIN FIELD VALIDATION
const validateLoginData = (datas) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
  });

  return schema.validate(datas);
};
