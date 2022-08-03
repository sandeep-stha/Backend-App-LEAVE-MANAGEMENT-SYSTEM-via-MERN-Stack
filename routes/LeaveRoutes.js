//EXPRESS AND ROUTER
const router = require("express").Router();

//USER FUNCTIONS
const {
  getAll,
  getOne,
  addNew,
  updateExisting,
  deleteExisting,
} = require("../controller/LeaveController");

//AUTHENTICATION AND AUTHORIZATION FUNCTIONS
const { authentication, authorization } = require("../middleware/auth");

//=========================ROUTES==============================

//GET COMPLETE LEAVE LIST
router.get("/allLeave", [authentication], getAll);

//GET A PARTICULAR LEAVE BY ID
router.get("/leave/:id", [authentication], getOne);

//TO ADD NEW LEAVE
router.post("/addLeave", [authentication], addNew);

//TO UPDATE A PARTICULAR LEAVE BY LEAVE ID
router.put("/updateLeave/:id", [authentication], updateExisting);

//TO DELETE A PARTICULAR LEAVE BY ID
router.delete(
  "/deleteLeave/:id",
  [authentication, authorization("admin", "hr")],
  deleteExisting
);

module.exports = router;
