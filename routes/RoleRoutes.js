//EXPRESS
const express = require("express");

//ROUTER
const router = express.Router();

//USER FUNCTIONS
const {
  getAll,
  getOne,
  addNew,
  updateExisting,
  deleteExisting,
} = require("../controller/RoleController");

//=========================ROUTES==============================

//TO ADD NEW USER
router.post("/addrole", addNew);

//GET COMPLETE USERS LIST
router.get("/allrole", getAll);

//GET A PARTICULAR USER BY ID
router.get("/role/:id", getOne);

//TO UPDATE A PARTICUAR USER
router.put("/updaterole/:id", updateExisting);

//TO DELETE A PARTICUAR USER
router.delete("/deleterole", deleteExisting);

module.exports = router;
