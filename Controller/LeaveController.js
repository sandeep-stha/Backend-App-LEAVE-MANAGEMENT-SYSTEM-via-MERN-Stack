//THIRD  PARTY
const Joi = require("joi");
const _ = require("lodash");
require("express-async-errors");

//USER MODULE
const Leave = require("../model/Leave");

//TO GET ALL LEAVES FROM ALL USER
module.exports.getAll = async (req, res) => {
  let condition = {};
  if (req.user.role !== "admin" || req.user.role !== "hr")
    condition = { user: req.user._id };
  const leaves = await Leave.find(condition).populate("user");
  if (leaves.length > 0) return res.json({ status: true, leaves });
  return res.status(404).json({ status: false, msg: "No leaves found" });
};

//TO GET LEAVE BY LEAVE ID
module.exports.getOne = async (req, res) => {
  const user = await Leave.findById(req.params.id).populate("user");
  if (user) return res.json({ status: true, user });
  return res.status(404).json({ status: false, msg: "No such User found" });
};

//TO ADD NEW LEAVE REQUEST
//AS EXPRESS ASYNC ERROR PACKAGE IS USED AND WE HAVE VALIDATED USING JOI, NO NEED TO USE TRY{} CATCH{}
module.exports.addNew = async (req, res) => {
  const { error } = addLeavesDataValidation(req.body);
  if (error) {
    return res.status(400).json({ status: false, msg: error.message });
  } else {
    const userData = _.pick(req.body, [
      "reason",
      "startDate",
      "endDate",
      "leaveType",
      "fullHalf",
      "selectHalf",
      "status",
      "remarks",
      "files",
    ]);
    let startDate = new Date(userData.startDate);
    let endDate = new Date(userData.endDate);
    if (startDate <= endDate) {
      //CHECK IF SAME LEAVE TYPE BY SAME USER ALREADY EXISTS
      if (req.body.leaveType) {
        const checkLeave = await Leave.findOne({
          leaveType: req.body.leaveType,
          startDate: startDate,
          user: req.user._id,
        });
        if (checkLeave)
          return res.status(400).json({
            status: false,
            msg: "You have already applied for same leave on same date",
          }); //Show this If checkEmail does not have any data and/or the id does not match
      }
      //NOW SETTING USER PROPERTY
      userData.user = req.user._id; //AS user FIELD IN Leave MODEL hence userData.user and setting it as req.user._id

      //CREATING NEW LEAVE REQUEST FOR USER i.e ACTUALLY SAVING
      const leave = await Leave.create(userData);

      // console.log(userData);
      //SUCCESS
      return res.json({
        status: true,
        msg: "New leave added successfully",
        leave,
      });
    } else
      return res.status(400).json({
        status: false,
        msg: "Start Date should be at least on same or prior date than end date",
      });
  }
};

//TO UPDATE LEAVE REQUEST BY LEAVE ID
module.exports.updateExisting = async (req, res) => {
  const leave = await Leave.findById(req.params.id);
  if (leave) {
    //IF USER IS VALID AND USER ROLE IS ADMIN
    //ONLY LET USER AND ADMIN TO UPDATE
    if (
      leave.user == req.user._id ||
      req.user.role == "admin" ||
      req.user.role == "hr"
    ) {
      course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.json({
        status: true,
        msg: "Leave Updated Successfully",
        leave,
      });
    }
    return res
      .status(401)
      .json({ status: true, msg: "You are not authorized" });
  }
  return res.status(404).json({ status: false, msg: "Leave not found" });
};

//TO DELETE USER BY USER ID
module.exports.deleteExisting = async (req, res) => {
  const leave = await Leave.findByIdAndRemove(req.params.id);
  if (!leave)
    return res.status(400).json({ status: false, msg: "No such Leave found" });
  return res.json({ status: true, msg: "User deleted successfully" });
};

const addLeavesDataValidation = (datas) => {
  const schema = Joi.object({
    reason: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    leaveType: Joi.string().required(),
    fullHalf: Joi.string().required(),
    status: Joi.string().required(),
  });

  return schema.validate(datas);
};
