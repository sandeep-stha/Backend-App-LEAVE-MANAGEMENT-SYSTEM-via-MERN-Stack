//EXPRESS
const express = require("express");

//ROUTER
const router = express.Router();

//USER FUNCTIONS AND AUTH FUNCTIONS
const {
  getAll,
  getOne,
  addNew,
  updateExisting,
  deleteExisting,
} = require("../controller/RoleController");

const { authorization, authentication } = require("../middleware/auth");

//=========================ROUTES==============================

//TO ADD NEW ROLE
router.post("/addRole", [authentication, authorization("admin")], addNew);

//GET COMPLETE ROLE LIST
router.get("/allRole", [authentication, authorization("admin", "hr")], getAll);

//GET A PARTICULAR ROLE BY ID
router.get("/role/:id", [authentication], getOne);

//TO UPDATE A PARTICUAR ROLE
router.put(
  "/updateRole/:id",
  [authentication, authorization("admin")],
  updateExisting
);

//TO DELETE A PARTICUAR ROLE
router.delete(
  "/deleteRole/:id",
  [authentication, authorization("admin")],
  deleteExisting
);

module.exports = router;
