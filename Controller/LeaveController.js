//THIRD  PARTY
require("express-async-errors");
const Joi = require("joi");
const _ = require("lodash");
const moment = require("moment");

//USER MODULE
const Leave = require("../model/Leave");

//TO GET ALL LEAVES FROM ALL USER
module.exports.getAll = async (req, res) => {
  // console.log(req.user)
  let condition = {};
  if (req.user.role !== "admin" && req.user.role !== "hr")
    //Not || as single true will set it to go below
    condition = { user: req.user._id };
  // console.log(condition)
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

//SEE WHO'S ON LEAVE TODAY
module.exports.getAbsentEmployeesForToday = async (req, res) => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const startDateToday = `${date} 00:00:00`;
  const endDateToday = `${date} 23:59:59`;
  console.log(startDateToday, endDateToday);
  const leaves = await Leave.find({
    startDate: { $lte: new Date(startDateToday) },
    endDate: { $gte: new Date(endDateToday) },
  });

  if (leaves.length > 0) return res.json({ status: true, leaves });
  return res
    .status(404)
    .json({ status: false, msg: "No Employees On Leave Today" });
};

//GET FUTURE LEAVES OF EMPLOYEES
module.exports.getFutureLeaves = async (req, res) => {
  // console.log(req.user)
  let referenceDate = moment().add(1, "days").format();
  let futureDate = referenceDate.split("T")[0];
  let condition = {};
  if (req.user.role == "user") {
    //Not || as single true will set it to go below
    condition = { user: req.user._id };
    // console.log(condition)
  }
  condition.startDate = { $gt: futureDate };
  const leaves = await Leave.find(condition).populate("user");
  console.log(leaves);
  if (leaves.length > 0) return res.json({ status: true, leaves });
  return res.status(404).json({ status: false, msg: "No leaves found" });
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

//VALIDATION FOR ADD LEAVE
const addLeavesDataValidation = (datas) => {
  const schema = Joi.object({
    reason: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date(),
    leaveType: Joi.string().required(),
    fullHalf: Joi.string().required(),
    selectHalf: Joi.string(),
    status: Joi.string().required(),
  });

  return schema.validate(datas);
};
