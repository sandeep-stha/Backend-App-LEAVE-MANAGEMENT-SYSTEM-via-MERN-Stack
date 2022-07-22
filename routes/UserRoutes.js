//EXPRESS
const router = require("express").Router();

//ROUTER
// const router = express.Router();

//USER FUNCTIONS
const {
  getAll,
  getOne,
  addNew,
  updateExisting,
  deleteExisting,
} = require("../controller/UserController");

//=========================ROUTES==============================

//TO ADD NEW USER
router.post("/addUser", addNew);

//GET COMPLETE USERS LIST
router.get("/allUser", getAll);

//GET A PARTICULAR USER BY ID
router.get("/:id", getOne);

//TO UPDATE A PARTICUAR USER
router.put("/updateUser/:id", updateExisting);

//TO DELETE A PARTICUAR USER
router.delete("/deleteUser/:id", deleteExisting);

module.exports = router;
