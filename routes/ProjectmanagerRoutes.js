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
router.post("/addPm", [authentication, authorization("admin", "hr")], addNew);

//GET COMPLETE PMS LIST
router.get("/allPm", [authentication, authorization("admin", "hr")], getAll);

//GET A PARTICULAR PM BY ID
router.get("/pm/:id", [authentication], getOne);

//TO UPDATE A PARTICULAR PM BY ID
router.put(
  "/updatePm/:id",
  [authentication, authorization("admin", "hr")],
  updateExisting
);

//TO DELETE A PARTICULAR PM BY ID
router.delete(
  "/deletePm/:id",
  [authentication, authorization("admin", "hr")],
  deleteExisting
);

module.exports = router;
