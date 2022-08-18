//EXPRESS AND ROUTER
const router = require("express").Router();

//USER FUNCTIONS
const {
  getAll,
  getOne,
  getAbsentEmployeesForToday,
  getFutureLeaves,
  addNew,
  updateExisting,
  deleteExisting,
} = require("../controller/LeaveController");

//AUTHENTICATION AND AUTHORIZATION FUNCTIONS
const { authentication, authorization } = require("../middleware/auth");

//=========================ROUTES==============================

//GET COMPLETE LEAVE LIST
router.get("/allLeave", [authentication], getAll);

//GET LEAVES OF ABSENT USER TODAY
router.get("/leave/absent", [authentication], getAbsentEmployeesForToday);

//NOTE:- :ID WILL TAKE ANY VALUE SO USE BETTER NAMING SYSTEM AND TRY TO USE ID BELOW

//GET FUTURE LEAVES
router.get("/leave/coming/leaves", [authentication], getFutureLeaves);

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
