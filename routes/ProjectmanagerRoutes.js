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
} = require("../controller/ProjectmanagerController");

//=========================ROUTES==============================

//TO ADD NEW USER
router.post("/addpm", addNew);

//GET COMPLETE USERS LIST
router.get("/allpm", getAll);

//GET A PARTICULAR USER BY ID
router.get("/pm/:id", getOne);

//TO UPDATE A PARTICUAR USER
router.put("/updatepm/:id", updateExisting);

//TO DELETE A PARTICUAR USER
router.delete("/deletepm", deleteExisting);

module.exports = router;
