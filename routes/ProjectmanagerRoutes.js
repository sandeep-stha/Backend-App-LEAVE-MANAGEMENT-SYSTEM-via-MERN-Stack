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

//AUTHENTICATION AND AUTHORIZATION FUNCTIONS
const { authentication, authorization } = require("../middleware/auth");

//=========================ROUTES==============================

//TO ADD NEW PM
router.post("/addpm", [authentication, authorization("admin", "hr")], addNew);

//GET COMPLETE PMS LIST
router.get("/allpm", [authentication, authorization("admin", "hr")], getAll);

//GET A PARTICULAR USER BY ID
router.get("/pm/:id", [authentication], getOne);

//TO UPDATE A PARTICLUAR PM BY ID
router.put(
  "/updatepm/:id",
  [authentication, authorization("admin", "hr")],
  updateExisting
);

//TO DELETE A PARTICUAR PM BY ID
router.delete(
  "/deletepm",
  [authentication, authorization("admin", "hr")],
  deleteExisting
);

module.exports = router;
