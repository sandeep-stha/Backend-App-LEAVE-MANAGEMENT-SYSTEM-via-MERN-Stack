//THIRD PARTY
const _ = require("lodash");

//PROJECT MANAGER MODULE
const Pm = require("../model/Projectmanager");

//TO GET ALL PROJECT MANAGERS
module.exports.getAll = async (req, res) => {
  const pms = await Pm.find()
    .populate("pmId", "firstName") //ID GET BY DEFAULT
    .populate({ path: "employeeId", select: ["firstName", "lastName"] });
  // .populate("employeeId", "lastName");
  if (pms.length > 0) {
    //If PM Exists
    return res.json({ status: true, pms }); //i.e Return the projectmanagers
  }
  //If no Project Manager found
  return res
    .status(404)
    .json({ status: false, msg: "Project Managers not found" });
};

//TO GET Project Manager BY ID
module.exports.getOne = async (req, res) => {
  const pm = await Pm.findById(req.params.id).populate("pmId", "fullName"); //INITIALLY SET FIELD OF OWN AND THEN SET FIELD OF REFERENCE TABLE
  if (pm) {
    //If Project Manager found
    return res.json({ status: true, pm });
  }
  //If Project Manager not found
  return res
    .status(404)
    .json({ status: false, msg: "Project Manager not found" });
};

//TO ADD NEW PROJECT MANAGER
module.exports.addNew = async (req, res) => {
  // if (req.user.role === "admin") {
  const pm = await Pm.create(
    _.pick(req.body, ["pmId", "employeeId"]) //I.E ONLY SELECT THESE FIELDS
  ); //_.pick is a function via lodash
  //_.pick mechanism?
  //Filter from req.body (Object) and returns only selected field i.e "Project Manager" as an object
  return res.json({
    status: true,
    msg: "New Project Manager Created Successfully",
  });
  // }
  // return res.status(401).json({
  //   status: false,
  //   msg: "Sorry but You are not authorized to add new PM",
  // });
};

//TO UPDATE ROLE VIA ROLE-ID
module.exports.updateExisting = async (req, res) => {
  // console.log(req.user);
  // if (req.user.role == "admin") { //COMMENTED AS REPLACED VIA MIDDLEWARE
  const pm = await Pm.findByIdAndUpdate(req.params.id, req.body);
  if (!pm)
    //Single Line so no need to use {}
    return res
      .status(404)
      .json({ status: false, msg: "Project Manager not found" });
  return res.json({
    status: true,
    msg: "Project Manager Updated Successfully",
  });
  // }
};

//TO DELETE ROLE BY ID
module.exports.deleteExisting = async (req, res) => {
  const pm = await Pm.findByIdAndDelete(req.params.id);
  if (!pm)
    return res
      .status(404)
      .json({ status: false, msg: "Project Manager not found" });
  return res.json({
    status: true,
    msg: "Project Manager Deleted Successfully",
  });
};
