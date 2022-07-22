//THIRD PARTY
const _ = require("lodash");

//PROJECT MANAGER MODULE
const Pm = require("../model/Projectmanager");

//TO GET ALL PROJECT MANAGERS
module.exports.getAll = async (req, res) => {
  const pms = await Pm.find();
  if (pms.length > 0) {
    //If Roles Exists
    return res.json({ status: true, pms }); //i.e Return the projectmanagers
  }
  //If no Project Manager found
  return res
    .status(404)
    .json({ status: false, msg: "Project Managers not found" });
};

//TO GET Project Manager BY ID
module.exports.getOne = async (req, res) => {
  const pm = await Pm.findById(req.params.id);
  if (role) {
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
  const pm = await Pm.create(
    _.pick(req.body, ["projectmanagerid", "employeeid"])
  ); //_.pick is a function via lodash
  //_.pick mechanism?
  //Filter from req.body (Object) and returns only selected field i.e "Project Manager" as an object
  return res.json({
    status: true,
    msg: "New Project Manager Created Successfully",
    projectmanager: _.pick(pm, ["pmId", "employeeId"]),
  });
};

//TO UPDATE ROLE VIA ROLE-ID
module.exports.updateExisting = async (req, res) => {
  const pm = await Pm.findByIdAndUpdate(req.params.id, req.body);
  if (!pm)
    //Single Line so no need to use {}
    return res
      .status(404)
      .json({ status: false, msg: "Project Manager not found" });
  return res.json({
    status: true,
    msg: "Project Manager Updated Successfully",
    role,
  });
};

//TO DELETE ROLE BY ID
module.exports.deleteExisting = async (req, res) => {
  const pm = await Pm.findByIdAndUpdate(req.params.id);
  if (!pm)
    return res
      .status(404)
      .json({ status: false, msg: "Project Manager not found" });
  return res.json({
    status: true,
    msg: "Project Manager Deleted Successfully",
    role,
  });
};
