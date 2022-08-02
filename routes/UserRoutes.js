//EXPRESS AND ROUTER
const router = require("express").Router();

//USER FUNCTIONS AND AUTHENTICATION/AUTHORIZATIONS
const {
  getAll,
  getOne,
  addNew,
  updateExisting,
  deleteExisting,
  login,
  //NO NEED TO CREATE A ROUTE  FOR SEND EMAIL FOR forgetPassword function, Only create a route for updateForgottenPassword
  updateForgottenPassword,
} = require("../controller/UserController");

const { authentication, authorization } = require("../middleware/auth");

//=========================ROUTES==============================

//GET COMPLETE USERS LIST
router.get(
  "/allUser",
  [authentication, authorization("admin", "pm", "hr")],
  getAll
);

//GET A PARTICULAR USER BY ID
router.get("/user/:id", [authentication], getOne);

//TO ADD NEW USER
router.post("/addUser", [authentication, authorization("admin", "hr")], addNew);

//TO UPDATE A PARTICULAR USER BY USER ID
router.put("/updateUser/:id", [authentication], updateExisting);

//TO DELETE A PARTICUAR USER BY USER ID
router.delete(
  "/deleteUser/:id",
  [authentication, authorization("admin", "hr")],
  deleteExisting
);

//TO LOGIN FOR USER
router.post("/login", login);

//TO UPDATE FORGOTTEN PASSWORD BY PASSWORD RESET TOKEN
router.put("/resetpassword/:token", updateForgottenPassword);

module.exports = router;
